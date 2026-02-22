"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ItineraryBookingRecord } from "@/domain/itinerary/types";
import type { BookingType } from "@/domain/itinerary/types";

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

  async function handleRemove() {
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
      <div className="flex shrink-0 items-center gap-2">
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
          className="text-sm text-gray-400 hover:text-white"
        >
          Edit
        </Link>
        <button
          type="button"
          onClick={handleRemove}
          disabled={removing}
          className="text-sm text-red-400 hover:text-red-300 disabled:opacity-50"
          aria-label={`Remove ${booking.provider} booking`}
        >
          {removing ? "Removing…" : "Remove"}
        </button>
      </div>
    </li>
  );
}
