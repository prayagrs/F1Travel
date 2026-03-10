"use client";

import { useState } from "react";
import Image from "next/image";
import type { StayOption } from "@/domain/races/types";
import type { DisplayCurrency } from "@/domain/currency";
import {
  convertToDisplay,
  formatInCurrency,
  type SourceCurrency,
} from "@/domain/currency";

type StayOptionCardProps = {
  option: StayOption;
  /** Display currency; when set, price is converted for display. */
  currency?: DisplayCurrency;
  /** Human-readable date range (e.g. "Jun 23 - Jul 3") to match the selected date tab. */
  dateLabel?: string;
};

/** Parse price string (e.g. "€400", "From $350") to number, source currency, and "From " prefix. */
function parsePrice(
  priceStr: string
): { value: number; source: SourceCurrency; fromPrefix: boolean } | null {
  const fromPrefix = /^From\s+/i.test(priceStr);
  const normalized = priceStr.replace(/,/g, "").replace(/^From\s+/i, "").trim();
  const patterns: { pattern: RegExp; source: SourceCurrency }[] = [
    { pattern: /€\s*([\d.]+)/, source: "EUR" },
    { pattern: /\$\s*([\d.]+)/, source: "USD" },
    { pattern: /£\s*([\d.]+)/, source: "GBP" },
    { pattern: /AUD\s*([\d.]+)/i, source: "AUD" },
    { pattern: /CAD\s*([\d.]+)/i, source: "CAD" },
    { pattern: /SGD\s*([\d.]+)/i, source: "SGD" },
    { pattern: /MXN\s*([\d.]+)/i, source: "MXN" },
    { pattern: /BRL\s*([\d.]+)/i, source: "BRL" },
    { pattern: /¥\s*([\d.]+)/, source: "JPY" },
  ];
  for (const { pattern, source } of patterns) {
    const m = normalized.match(pattern);
    if (m) {
      const n = Number.parseFloat(m[1]);
      return Number.isNaN(n) ? null : { value: n, source, fromPrefix };
    }
  }
  return null;
}

function formatStayPrice(
  value: number,
  from: SourceCurrency,
  to: DisplayCurrency
): string {
  const converted = convertToDisplay(value, from, to);
  return formatInCurrency(converted, to);
}

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
          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
        />
      </svg>
    </span>
  );
}

function InlineSourceLogo({ sourceLogo }: { sourceLogo: string | undefined }) {
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

export function StayOptionCard({ option, currency, dateLabel }: StayOptionCardProps) {
  const { source, sourceLogo, name, address, price, checkIn, checkOut, href, notes } = option;
  const [expanded, setExpanded] = useState(false);
  const hasNotes = notes && notes.length > 0;

  const displayPrice =
    currency != null
      ? (() => {
          const parsed = parsePrice(price);
          if (!parsed) return price;
          const formatted = formatStayPrice(parsed.value, parsed.source, currency);
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
            <p className="font-medium text-white">{name}</p>
            <p className="flex items-center gap-1.5 text-sm text-gray-400">
              <InlineSourceLogo sourceLogo={sourceLogo} />
              <span>Source: {source}</span>
            </p>
            {address && (
              <p className="mt-0.5 text-xs text-gray-500">{address}</p>
            )}
            {(dateLabel ?? (checkIn && checkOut)) && (
              <p className="mt-0.5 text-xs text-gray-500">
                {dateLabel ?? `${checkIn} – ${checkOut}`}
              </p>
            )}
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
              Check Availability
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
