"use client";

import { useState } from "react";
import Image from "next/image";
import type { ProviderLink } from "@/domain/itinerary/types";

import type { DisplayCurrency } from "@/domain/currency";
import { convertToDisplay, formatInCurrency } from "@/domain/currency";

export type FlightSearchCardLink = ProviderLink;

/** Re-export for components that need the same type (e.g. ItineraryView currency selector). */
export type Currency = DisplayCurrency;

type FlightSearchCardProps = {
  link: FlightSearchCardLink;
  subtitle: string;
  /** When provided, shows expand/collapse for tips (pass section notes to first card only) */
  notes?: string[];
  ctaLabel?: string;
  /** Display currency for the "from" price; matches TicketOptionCard. All amounts shown in this currency. */
  currency?: Currency;
  /** When true and no fromPrice yet, shows Material "travel" icon (blinking) where the price will appear. */
  priceLoading?: boolean;
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

/** Material Symbols "travel" icon with blink animation for "price loading" slot. */
function TravelLoadingIcon() {
  return (
    <span
      className="material-symbols-outlined flex shrink-0 items-center justify-center text-xl text-gray-500 animate-blink"
      aria-hidden
    >
      travel
    </span>
  );
}

/** Format numeric price string (from API, typically USD) for display in selected currency. */
function formatPrice(priceStr: string, currency: Currency): string {
  const num = Number.parseFloat(priceStr);
  if (Number.isNaN(num)) return priceStr;
  const inDisplayCurrency = convertToDisplay(num, "USD", currency);
  return formatInCurrency(inDisplayCurrency, currency);
}

/** Flight detail card shown when user expands the chevron (Emirates-style: depart, duration/stops, arrive; optional per-leg rows). */
function FlightDetailCard({ sample }: { sample: NonNullable<ProviderLink["sampleFlight"]> }) {
  const stopLabel =
    sample.stops > 0
      ? sample.stopAirports?.length
        ? `${sample.stops} stop${sample.stops === 1 ? "" : "s"} (${sample.stopAirports.join(", ")})`
        : `${sample.stops} stop${sample.stops === 1 ? "" : "s"}`
      : "Direct";

  return (
    <div
      className="rounded-lg border border-gray-700 bg-gray-800/80 px-4 py-3"
      role="region"
      aria-label="Flight details"
    >
      <p className="text-xs text-gray-500 mb-2">{sample.airlineLabel}</p>
      <div className="flex items-center gap-4">
        <div className="flex shrink-0 flex-col">
          <span className="font-semibold text-white">{sample.departure}</span>
          <span className="text-xs text-gray-400">Depart</span>
        </div>
        <div className="flex flex-1 flex-col items-center gap-0.5">
          <span className="text-sm text-gray-300">{sample.durationText !== "–" ? sample.durationText : "—"}</span>
          <div className="flex w-full items-center gap-1">
            <span className="h-px flex-1 bg-gray-600" aria-hidden />
            {sample.stops > 0 ? (
              <span className="text-gray-500" aria-hidden title={stopLabel}>
                <span className="material-symbols-outlined text-xl">airline_stops</span>
              </span>
            ) : null}
            <span className="h-px flex-1 bg-gray-600" aria-hidden />
          </div>
          <span className={`text-xs font-medium ${sample.stops > 0 ? "text-red-500" : "text-gray-400"}`}>
            {stopLabel}
          </span>
        </div>
        <div className="flex shrink-0 flex-col text-right">
          <span className="font-semibold text-white">{sample.arrival}</span>
          <span className="text-xs text-gray-400">Arrive</span>
        </div>
      </div>
      {sample.legs && sample.legs.length > 0 && (
        <div className="mt-3 space-y-2 border-t border-gray-700 pt-3">
          {sample.legs.map((leg, i) => (
            <div
              key={i}
              className="flex items-center justify-between gap-2 text-sm"
              aria-label={`Leg ${i + 1}: ${leg.depIata} to ${leg.arrIata}`}
            >
              <span className="font-medium text-white">{leg.depIata}</span>
              <span className="text-gray-400">{leg.depTime}</span>
              <span className="text-gray-500">→</span>
              <span className="text-gray-400">{leg.arrTime}</span>
              <span className="font-medium text-white">{leg.arrIata}</span>
              {leg.durationText !== "–" && (
                <span className="text-xs text-gray-500">{leg.durationText}</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function FlightSearchCard({
  link,
  subtitle,
  notes,
  ctaLabel = "Search",
  currency = "USD",
  priceLoading = false,
}: FlightSearchCardProps) {
  const [expanded, setExpanded] = useState(false);
  const hasNotes = notes && notes.length > 0;
  const hasSampleFlight = !!link.sampleFlight;
  const hasExpandableContent = hasNotes || hasSampleFlight;
  const showFromPrice = link.fromPrice != null && String(link.fromPrice).trim() !== "";
  const showPriceLoadingIcon = priceLoading && !showFromPrice;

  return (
    <div className="flex flex-col rounded-lg border border-gray-700 bg-gray-800/50 transition-colors hover:border-gray-600">
      <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <div className="flex items-center gap-3">
          {link.logo ? (
            <span className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-transparent">
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
            <p className="font-medium text-white">
              {link.label}
              {link.isAffiliate && (
                <span className="ml-2 text-xs font-normal text-gray-500" aria-label="Partner link">
                  Partner
                </span>
              )}
            </p>
            <p className="text-sm text-gray-400">Source: {link.label}</p>
            <p className="text-sm text-gray-400">{subtitle}</p>
          </div>
        </div>
          <div className="flex flex-wrap items-center justify-end gap-3 sm:gap-4">
          <div className="flex min-w-[4.5rem] items-center justify-end gap-2 sm:gap-3">
            {showFromPrice && (
              <span className="text-sm font-medium text-emerald-500 shrink-0">
                From {formatPrice(String(link.fromPrice).trim(), currency)}
              </span>
            )}
            {showPriceLoadingIcon && <TravelLoadingIcon />}
            <a
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center justify-center rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900 min-h-[44px]"
            >
              {ctaLabel}
            </a>
          </div>
          {hasExpandableContent && (
            <button
              type="button"
              onClick={() => setExpanded((e) => !e)}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gray-600 bg-gray-800 text-gray-400 transition-colors hover:border-gray-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900 min-h-[44px] min-w-[44px]"
              aria-expanded={expanded}
              aria-label={
                expanded
                  ? "Collapse details"
                  : hasSampleFlight
                    ? "Expand flight details"
                    : "Expand booking tips"
              }
              aria-controls={`flight-details-${link.label.replace(/\s+/g, "-")}`}
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
      {hasExpandableContent && expanded && (
        <div
          id={`flight-details-${link.label.replace(/\s+/g, "-")}`}
          role="region"
          aria-label="Flight details and tips"
          className="border-t border-gray-700 px-4 py-3 space-y-3"
        >
          {hasSampleFlight && link.sampleFlight && (
            <FlightDetailCard sample={link.sampleFlight} />
          )}
          {hasNotes && (
            <ul className="space-y-1 text-sm text-gray-400" aria-label="Booking tips">
              {notes!.map((note, i) => (
                <li key={i}>• {note}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
