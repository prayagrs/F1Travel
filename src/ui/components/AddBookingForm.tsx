"use client";

import { useState, type FormEvent } from "react";
import type { BookingType } from "@/domain/itinerary/types";

const BOOKING_TYPE_LABELS: Record<BookingType, string> = {
  flight: "Flight",
  stay: "Accommodation",
  ticket: "Race ticket",
  activity: "Experience",
};

type AddBookingFormProps = {
  itineraryId: string;
  type: BookingType;
  onSuccess: () => void;
  onCancel: () => void;
};

export function AddBookingForm({
  itineraryId,
  type,
  onSuccess,
  onCancel,
}: AddBookingFormProps) {
  const [provider, setProvider] = useState("");
  const [confirmationRef, setConfirmationRef] = useState("");
  const [detailsUrl, setDetailsUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (!provider.trim() || !confirmationRef.trim()) {
      setError("Provider and confirmation number are required.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`/api/itineraries/${itineraryId}/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          type,
          provider: provider.trim(),
          confirmationRef: confirmationRef.trim(),
          detailsUrl: detailsUrl.trim() || undefined,
          notes: notes.trim() || undefined,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data?.error ?? "Failed to add booking");
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
      aria-label={`Add ${BOOKING_TYPE_LABELS[type]} booking`}
    >
      <p className="text-sm font-medium text-white">
        Add {BOOKING_TYPE_LABELS[type]} booking
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="text-xs text-gray-400">Provider (e.g. Booking.com)</span>
          <input
            type="text"
            value={provider}
            onChange={(e) => setProvider(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-900 px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
            placeholder="Booking.com"
          />
        </label>
        <label className="block">
          <span className="text-xs text-gray-400">Confirmation / reference number</span>
          <input
            type="text"
            value={confirmationRef}
            onChange={(e) => setConfirmationRef(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-900 px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
            placeholder="ABC123"
          />
        </label>
      </div>
      <label className="block">
        <span className="text-xs text-gray-400">Link to booking (optional)</span>
        <input
          type="url"
          value={detailsUrl}
          onChange={(e) => setDetailsUrl(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-900 px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
          placeholder="https://..."
        />
      </label>
      <label className="block">
        <span className="text-xs text-gray-400">Notes (optional)</span>
        <input
          type="text"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-900 px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
          placeholder="e.g. 2 guests, room 401"
        />
      </label>
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
          {submitting ? "Saving…" : "Save booking"}
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
