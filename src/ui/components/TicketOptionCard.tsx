"use client";

import { useState } from "react";
import Image from "next/image";
import type { TicketOption } from "@/domain/races/types";
import type { Currency } from "@/ui/components/FlightSearchCard";

type TicketOptionCardProps = {
  option: TicketOption;
  /** Display currency; when set, price is converted for display to match flight section. */
  currency?: Currency;
};

/** Parse price string (e.g. "€400", "From €3,500") to number, source currency, and optional "From " prefix. */
function parsePrice(
  priceStr: string
): { value: number; source: "EUR" | "USD"; fromPrefix: boolean } | null {
  const fromPrefix = /^From\s+/i.test(priceStr);
  const normalized = priceStr.replace(/,/g, "").replace(/^From\s+/i, "").trim();
  const eurMatch = normalized.match(/€\s*([\d.]+)/);
  const usdMatch = normalized.match(/\$\s*([\d.]+)/);
  if (eurMatch) {
    const n = Number.parseFloat(eurMatch[1]);
    return Number.isNaN(n) ? null : { value: n, source: "EUR", fromPrefix };
  }
  if (usdMatch) {
    const n = Number.parseFloat(usdMatch[1]);
    return Number.isNaN(n) ? null : { value: n, source: "USD", fromPrefix };
  }
  return null;
}

/** Format numeric value in the requested currency (approximate EUR/USD conversion). */
function formatTicketPrice(value: number, from: "EUR" | "USD", to: Currency): string {
  if (from === to) return to === "EUR" ? `€${value.toLocaleString()}` : `$${value.toLocaleString()}`;
  if (to === "USD") return `$${Math.round(value / 0.92).toLocaleString()}`;
  return `€${Math.round(value * 0.92).toLocaleString()}`;
}

/** Fallback icon when no logo is provided */
function SourceIcon({ size = "md" }: { size?: "sm" | "md" }) {
  const isSm = size === "sm";
  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded bg-gray-800 text-gray-400 ${isSm ? "h-4 w-4" : "h-14 w-14 rounded-lg"}`}
      aria-hidden
    >
      <svg
        className={isSm ? "h-3 w-3" : "h-7 w-7"}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
        />
      </svg>
    </span>
  );
}

/** Small inline logo or icon for the source line */
function InlineSourceLogo({
  sourceLogo,
}: {
  sourceLogo: string | undefined;
}) {
  if (!sourceLogo) return <SourceIcon size="sm" />;
  return (
    <span className="relative flex h-4 w-4 shrink-0 items-center justify-center overflow-hidden rounded">
      <Image
        src={sourceLogo}
        alt=""
        width={16}
        height={16}
        className="object-contain"
      />
    </span>
  );
}

export function TicketOptionCard({ option, currency }: TicketOptionCardProps) {
  const { source, sourceLogo, stand, days, price, href, notes } = option;
  const [expanded, setExpanded] = useState(false);
  const hasNotes = notes && notes.length > 0;

  const displayPrice =
    currency != null
      ? (() => {
          const parsed = parsePrice(price);
          if (!parsed) return price;
          const formatted = formatTicketPrice(parsed.value, parsed.source, currency);
          return parsed.fromPrefix ? `From ${formatted}` : formatted;
        })()
      : price;

  return (
    <div className="flex flex-col rounded-lg border border-gray-700 bg-gray-800/50 transition-colors hover:border-gray-600">
      <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <div className="flex items-center gap-3">
          {sourceLogo ? (
            <span className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gray-900">
              <Image
                src={sourceLogo}
                alt=""
                width={56}
                height={56}
                className="object-contain"
              />
            </span>
          ) : (
            <SourceIcon size="md" />
          )}
          <div>
            <p className="font-medium text-white">
              {days} Days · {stand}
            </p>
            <p className="flex items-center gap-1.5 text-sm text-gray-400">
              <InlineSourceLogo sourceLogo={sourceLogo} />
              <span>Source: {source}</span>
            </p>
          </div>
        </div>
        <div className="flex items-center justify-between gap-4 sm:justify-end">
          <span className="text-lg font-semibold text-emerald-500">{displayPrice}</span>
          <div className="flex items-center gap-2">
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center justify-center rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900 min-h-[44px]"
            >
              Select
            </a>
            {hasNotes && (
              <button
                type="button"
                onClick={() => setExpanded((e) => !e)}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gray-600 bg-gray-800 text-gray-400 transition-colors hover:border-gray-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                aria-expanded={expanded}
                aria-label={expanded ? "Collapse details" : "Expand details"}
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
      </div>
      {hasNotes && expanded && (
        <div className="border-t border-gray-700 px-4 py-3">
          <ul className="space-y-1 text-sm text-gray-400">
            {notes!.map((note, i) => (
              <li key={i}>• {note}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
