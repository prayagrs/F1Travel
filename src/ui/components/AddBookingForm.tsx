"use client";

import { useState, type FormEvent, useCallback } from "react";
import type { BookingType, ItineraryBookingRecord } from "@/domain/itinerary/types";
import type { AddBookingPreFill } from "@/domain/itinerary/types";
import { validateBookingInput } from "@/domain/itinerary/bookingValidation";
import { getProviderLabels } from "@/domain/itinerary/linkBuilders";
import { parseConfirmationText } from "@/domain/itinerary/confirmationParser";

const BOOKING_TYPE_LABELS: Record<BookingType, string> = {
  flight: "Flight",
  stay: "Accommodation",
  ticket: "Race ticket",
  activity: "Experience",
};

const CONFIRMATION_PLACEHOLDERS: Record<BookingType, string> = {
  flight: "e.g. BA123, LHR→MEL",
  stay: "e.g. ABC123",
  ticket: "e.g. Stand A, 3-day",
  activity: "e.g. Tour name, date",
};

const NOTES_PLACEHOLDERS: Record<BookingType, string> = {
  flight: "e.g. Flight numbers, times",
  stay: "e.g. 2 guests, room 401",
  ticket: "e.g. Stand, grandstand, days",
  activity: "e.g. Tour name, date, time",
};

const PROVIDER_LABELS: Record<BookingType, string> = {
  flight: "Provider",
  stay: "Provider",
  ticket: "Provider",
  activity: "Provider",
};

export type { AddBookingPreFill };

type AddBookingFormProps = {
  itineraryId: string;
  type: BookingType;
  onSuccess: () => void;
  onCancel: () => void;
  /** Pre-fill when user returns from partner (e.g. ?return=stay). */
  preFill?: AddBookingPreFill;
  /** When set, form is in edit mode: PATCH this booking. */
  booking?: ItineraryBookingRecord;
};

const OTHER_VALUE = "__other__";

export function AddBookingForm({
  itineraryId,
  type,
  onSuccess,
  onCancel,
  preFill,
  booking,
}: AddBookingFormProps) {
  const isEdit = Boolean(booking);
  const providerOptions = getProviderLabels(type);

  const [providerSelect, setProviderSelect] = useState<string>(() => {
    const initial = (booking?.provider ?? preFill?.provider ?? "").trim();
    if (!initial) return "";
    if (providerOptions.includes(initial)) return initial;
    return OTHER_VALUE;
  });
  const [providerOther, setProviderOther] = useState(() => {
    const initial = (booking?.provider ?? preFill?.provider ?? "").trim();
    if (providerOptions.includes(initial)) return "";
    return initial;
  });
  const [confirmationRef, setConfirmationRef] = useState(
    booking?.confirmationRef ?? preFill?.confirmationRef ?? ""
  );
  const [detailsUrl, setDetailsUrl] = useState(
    booking?.detailsUrl ?? preFill?.detailsUrl ?? ""
  );
  const [notes, setNotes] = useState(booking?.notes ?? "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pasteMessage, setPasteMessage] = useState<string | null>(null);
  const [confirmationInlineError, setConfirmationInlineError] = useState<string | null>(null);
  const [urlInlineError, setUrlInlineError] = useState<string | null>(null);

  const provider =
    providerSelect === OTHER_VALUE ? providerOther.trim() : providerSelect;

  const handlePaste = useCallback(async () => {
    setPasteMessage(null);
    try {
      const text = await navigator.clipboard.readText();
      const parsed = parseConfirmationText(text);
      let filled = 0;
      if (parsed.provider) {
        if (providerOptions.includes(parsed.provider)) {
          setProviderSelect(parsed.provider);
          setProviderOther("");
        } else {
          setProviderSelect(OTHER_VALUE);
          setProviderOther(parsed.provider);
        }
        filled++;
      }
      if (parsed.confirmationRef) {
        setConfirmationRef(parsed.confirmationRef);
        filled++;
      }
      if (parsed.detailsUrl) {
        setDetailsUrl(parsed.detailsUrl);
        filled++;
      }
      if (filled > 0) {
        setPasteMessage("Details filled from clipboard. Please review and save.");
      } else {
        setPasteMessage("Couldn't extract details—please enter manually.");
      }
    } catch {
      setPasteMessage("Couldn't access clipboard—please paste manually.");
    }
  }, [providerOptions]);

  function validateUrl(url: string): boolean {
    const t = url?.trim();
    if (!t) return true;
    try {
      const u = new URL(t);
      return u.protocol === "http:" || u.protocol === "https:";
    } catch {
      return false;
    }
  }

  function validateConfirmationRef(val: string): boolean {
    const t = val?.trim();
    if (!t) return true;
    return /^[A-Za-z0-9\s\-_]+$/.test(t) && t.length <= 100;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setConfirmationInlineError(null);
    setUrlInlineError(null);
    const validationError = validateBookingInput({
      type,
      provider,
      confirmationRef,
      detailsUrl: detailsUrl || null,
      notes: notes || null,
    });
    if (validationError) {
      setError(validationError);
      return;
    }
    setSubmitting(true);
    try {
      const url =
        isEdit && booking
          ? `/api/bookings/${booking.id}`
          : `/api/itineraries/${itineraryId}/bookings`;
      const method = isEdit ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(
          isEdit
            ? {
                provider: provider.trim(),
                confirmationRef: confirmationRef.trim(),
                detailsUrl: detailsUrl.trim() || undefined,
                notes: notes.trim() || undefined,
              }
            : {
                type,
                provider: provider.trim(),
                confirmationRef: confirmationRef.trim(),
                detailsUrl: detailsUrl.trim() || undefined,
                notes: notes.trim() || undefined,
              }
        ),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(
          data?.error ?? (isEdit ? "Failed to update booking" : "Failed to add booking")
        );
        return;
      }
      onSuccess();
    } catch {
      setError("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-lg border border-gray-600 bg-gray-800/80 p-4 space-y-3"
      aria-label={
        isEdit
          ? `Edit ${BOOKING_TYPE_LABELS[type]} booking`
          : `Add ${BOOKING_TYPE_LABELS[type]} booking`
      }
    >
      <p className="text-sm font-medium text-white">
        {isEdit ? "Edit" : "Add"} {BOOKING_TYPE_LABELS[type]} booking
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="text-xs text-gray-400">{PROVIDER_LABELS[type]}</span>
          <select
            value={providerSelect}
            onChange={(e) => {
              setProviderSelect(e.target.value);
              if (e.target.value !== OTHER_VALUE) setProviderOther("");
            }}
            className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-900 px-3 py-2 text-sm text-white focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
          >
            <option value="">Select provider</option>
            {providerOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </label>
        {providerSelect === OTHER_VALUE && (
          <label className="block sm:col-span-2">
            <span className="text-xs text-gray-400">Provider name</span>
            <input
              type="text"
              value={providerOther}
              onChange={(e) => setProviderOther(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-900 px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
              placeholder="e.g. Expedia, direct"
            />
          </label>
        )}
        <label className="block">
          <span className="text-xs text-gray-400">Confirmation / reference number</span>
          <input
            type="text"
            value={confirmationRef}
            onChange={(e) => {
              setConfirmationRef(e.target.value);
              setConfirmationInlineError(null);
            }}
            onBlur={() => {
              if (confirmationRef.trim() && !validateConfirmationRef(confirmationRef)) {
                setConfirmationInlineError("Use only letters, numbers, hyphens, and underscores.");
              } else {
                setConfirmationInlineError(null);
              }
            }}
            className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-900 px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
            placeholder={CONFIRMATION_PLACEHOLDERS[type]}
            aria-invalid={!!confirmationInlineError}
          />
        </label>
      </div>
      <label className="block">
        <span className="text-xs text-gray-400">Link to booking (optional)</span>
        <input
          type="url"
          value={detailsUrl}
          onChange={(e) => {
            setDetailsUrl(e.target.value);
            setUrlInlineError(null);
          }}
          onBlur={() => {
            if (detailsUrl.trim() && !validateUrl(detailsUrl)) {
              setUrlInlineError("Please enter a valid link.");
            } else {
              setUrlInlineError(null);
            }
          }}
          className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-900 px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
          placeholder="https://..."
          aria-invalid={!!urlInlineError}
        />
      </label>
      <label className="block">
        <span className="text-xs text-gray-400">Notes (optional)</span>
        <input
          type="text"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-900 px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
          placeholder={NOTES_PLACEHOLDERS[type]}
        />
      </label>
      {(confirmationInlineError || urlInlineError) && (
        <p className="text-sm text-amber-400" role="alert">
          {confirmationInlineError ?? urlInlineError}
        </p>
      )}
      {!isEdit && (
        <div>
          <button
            type="button"
            onClick={handlePaste}
            className="text-sm text-gray-400 hover:text-white underline focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-800 rounded"
          >
            Paste from confirmation
          </button>
          {pasteMessage && (
            <p
              className={`mt-1 text-xs ${pasteMessage.includes("Couldn't") ? "text-amber-400" : "text-emerald-400"}`}
              role="status"
            >
              {pasteMessage}
            </p>
          )}
        </div>
      )}
      {error && (
        <p className="text-sm text-red-400" role="alert">
          {error}
        </p>
      )}
      <div className="flex flex-wrap gap-2 pt-1">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          {submitting ? "Saving…" : isEdit ? "Update booking" : "Save booking"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md border border-gray-600 px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
