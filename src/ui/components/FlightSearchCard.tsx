"use client";

import { useState } from "react";
import Image from "next/image";
import type { ProviderLink } from "@/domain/itinerary/types";

export type FlightSearchCardLink = ProviderLink;

type FlightSearchCardProps = {
  link: FlightSearchCardLink;
  subtitle: string;
  /** When provided, shows expand/collapse for tips (pass section notes to first card only) */
  notes?: string[];
  ctaLabel?: string;
};

/** Provider icon: plane SVG (neutral for any flight search provider) */
function PlaneIcon({ className }: { className?: string }) {
  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-lg bg-gray-800 text-gray-400 ${className ?? "h-14 w-14"}`}
      aria-hidden
    >
      <svg
        className="h-7 w-7"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6 12L3 21h18l-3-9M3 21h18M9 12l3-9 3 9M9 12h6"
        />
      </svg>
    </span>
  );
}

export function FlightSearchCard({
  link,
  subtitle,
  notes,
  ctaLabel = "Search flights",
}: FlightSearchCardProps) {
  const [expanded, setExpanded] = useState(false);
  const hasNotes = notes && notes.length > 0;

  return (
    <div className="flex flex-col rounded-lg border border-gray-700 bg-gray-800/50 transition-colors hover:border-gray-600">
      <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <div className="flex items-center gap-3">
          {link.logo ? (
            <span className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gray-900">
              <Image
                src={link.logo}
                alt=""
                width={56}
                height={56}
                className="object-contain"
              />
            </span>
          ) : (
            <PlaneIcon />
          )}
          <div className="space-y-0.5">
            <p className="font-medium text-white">{link.label}</p>
            <p className="text-sm text-gray-400">Source: {link.label}</p>
            <p className="text-sm text-gray-400">{subtitle}</p>
          </div>
        </div>
        <div className="flex items-center justify-between gap-4 sm:justify-end">
          <a
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center justify-center rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900 min-h-[44px]"
          >
            {ctaLabel}
          </a>
          {hasNotes && (
            <button
              type="button"
              onClick={() => setExpanded((e) => !e)}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gray-600 bg-gray-800 text-gray-400 transition-colors hover:border-gray-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900 min-h-[44px] min-w-[44px]"
              aria-expanded={expanded}
              aria-label={expanded ? "Collapse booking tips" : "Expand booking tips"}
              aria-controls={hasNotes ? `flight-tips-${link.label.replace(/\s+/g, "-")}` : undefined}
            >
              <svg
                className={`h-5 w-5 transition-transform ${expanded ? "rotate-180" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          )}
        </div>
      </div>
      {hasNotes && expanded && (
        <div
          id={`flight-tips-${link.label.replace(/\s+/g, "-")}`}
          role="region"
          aria-label="Booking tips"
          className="border-t border-gray-700 px-4 py-3"
        >
          <ul className="space-y-1 text-sm text-gray-400">
            {notes.map((note, i) => (
              <li key={i}>• {note}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
