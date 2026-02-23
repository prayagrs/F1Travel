"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ItineraryBookingRecord } from "@/domain/itinerary/types";
import type { BookingType } from "@/domain/itinerary/types";
import { PencilIcon, TrashIcon } from "@/ui/components/icons/BookingActionsIcons";

const BOOKING_TYPE_LABELS: Record<BookingType, string> = {
  flight: "Flight",
  stay: "Accommodation",
  ticket: "Race ticket",
  activity: "Experience",
};

type BookingRowWithActionsProps = {
  booking: ItineraryBookingRecord;
};

export function BookingRowWithActions({ booking }: BookingRowWithActionsProps) {
  const router = useRouter();
  const [removing, setRemoving] = useState(false);
  const [confirmRemove, setConfirmRemove] = useState(false);

  async function handleRemove() {
    setConfirmRemove(false);
    setRemoving(true);
    try {
      const res = await fetch(`/api/bookings/${booking.id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) router.refresh();
    } finally {
      setRemoving(false);
    }
  }

  if (confirmRemove) {
    return (
      <li className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-gray-700 bg-gray-800/50 px-4 py-3">
        <div className="min-w-0 flex-1">
          <p className="text-sm text-gray-400">Remove this booking from your itinerary? You can add it again later.</p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => setConfirmRemove(false)}
            className="rounded border border-gray-600 px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleRemove}
            disabled={removing}
            className="rounded bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
          >
            {removing ? "Removing…" : "Remove"}
          </button>
        </div>
      </li>
    );
  }

  return (
    <li className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-gray-700 bg-gray-800/50 px-4 py-3">
      <div className="min-w-0 flex-1">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
          {BOOKING_TYPE_LABELS[booking.type]}
        </span>
        <p className="font-medium text-white mt-0.5">{booking.provider}</p>
        <p className="text-sm text-gray-400">
          Confirmation: <span className="text-gray-300 font-mono">{booking.confirmationRef}</span>
        </p>
        {booking.notes && (
          <p className="text-sm text-gray-500 mt-1">{booking.notes}</p>
        )}
      </div>
      <div className="flex shrink-0 items-center gap-1">
        {booking.detailsUrl && (
          <a
            href={booking.detailsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md border border-gray-600 px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            View on {booking.provider}
          </a>
        )}
        <Link
          href={`/itinerary/${booking.itineraryId}`}
          className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded p-2 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900"
          aria-label={`Edit ${booking.provider} booking`}
        >
          <PencilIcon />
        </Link>
        <button
          type="button"
          onClick={() => setConfirmRemove(true)}
          disabled={removing}
          className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded p-2 text-red-400 hover:text-red-300 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900"
          aria-label={`Remove ${booking.provider} booking`}
        >
          <TrashIcon />
        </button>
      </div>
    </li>
  );
}
