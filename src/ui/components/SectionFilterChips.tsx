"use client";

import type { ItinerarySectionKey, SectionFilters } from "@/domain/itinerary/types";

const SECTION_LABELS: Record<ItinerarySectionKey, string> = {
  tickets: "Race tickets",
  flights: "Flights",
  stays: "Accommodation",
  experiences: "Experiences",
};

type SectionFilterChipsProps = {
  filters: SectionFilters;
  onChange: (key: ItinerarySectionKey, value: boolean) => void;
};

/**
 * Chips to show/hide itinerary sections (tickets, flights, stays, experiences).
 * All sections are shown by default; user can toggle any off.
 */
export function SectionFilterChips({ filters, onChange }: SectionFilterChipsProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm text-gray-400 mr-1">Show:</span>
      {(Object.keys(SECTION_LABELS) as ItinerarySectionKey[]).map((key) => {
        const on = filters[key];
        return (
          <button
            key={key}
            type="button"
            onClick={() => onChange(key, !on)}
            className={`inline-flex items-center rounded-full px-3 py-1.5 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900 ${
              on
                ? "bg-red-600/20 text-red-400 border border-red-500/40 hover:bg-red-600/30"
                : "bg-gray-800 text-gray-500 border border-gray-600 hover:bg-gray-700 hover:text-gray-400"
            }`}
            aria-pressed={on}
            aria-label={`${on ? "Hide" : "Show"} ${SECTION_LABELS[key]}`}
          >
            {SECTION_LABELS[key]}
          </button>
        );
      })}
    </div>
  );
}
