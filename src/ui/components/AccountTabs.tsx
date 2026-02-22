"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * Tab navigation for Account section (My Itineraries, My Bookings).
 * Matches Header nav pattern: red dot + underline when active.
 */
export function AccountTabs() {
  const pathname = usePathname();
  const isItineraries = pathname === "/account";
  const isBookings = pathname === "/account/bookings";

  return (
    <div className="mb-8 flex gap-6 border-b border-gray-800/50 pb-4">
      <Link
        href="/account"
        className={`font-heading relative flex items-center gap-1.5 rounded-md px-4 py-2.5 text-sm font-medium transition-opacity hover:opacity-80 ${
          isItineraries ? "text-white" : "text-gray-400"
        }`}
      >
        {isItineraries && (
          <span className="h-1.5 w-1.5 rounded-full bg-red-600" aria-hidden />
        )}
        <span className="material-symbols-outlined text-base" aria-hidden>event_note</span>
        <span>My Itineraries</span>
        {isItineraries && (
          <span className="absolute -bottom-4 left-0 h-0.5 w-full bg-red-600" />
        )}
      </Link>
      <Link
        href="/account/bookings"
        className={`font-heading relative flex items-center gap-1.5 rounded-md px-4 py-2.5 text-sm font-medium transition-opacity hover:opacity-80 ${
          isBookings ? "text-white" : "text-gray-400"
        }`}
      >
        {isBookings && (
          <span className="h-1.5 w-1.5 rounded-full bg-red-600" aria-hidden />
        )}
        <span className="material-symbols-outlined text-base" aria-hidden>confirmation_number</span>
        <span>My Bookings</span>
        {isBookings && (
          <span className="absolute -bottom-4 left-0 h-0.5 w-full bg-red-600" />
        )}
      </Link>
    </div>
  );
}
