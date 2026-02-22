"use client";

import { useState, useCallback, useMemo } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import type {
  ItineraryResult,
  SectionFilters,
  ItinerarySectionKey,
  ItineraryBookingRecord,
} from "@/domain/itinerary/types";
import {
  DEFAULT_SECTION_FILTERS,
  ITINERARY_SECTION_KEYS,
} from "@/domain/itinerary/types";
import { getFlightPriceExpectationLine } from "@/domain/itinerary/linkBuilders";
import Image from "next/image";
import { Card } from "@/ui/components/Card";
import { DateOptionTabs } from "@/ui/components/DateOptionTabs";
import { SectionFilterChips } from "@/ui/components/SectionFilterChips";
import { AddBookingForm } from "@/ui/components/AddBookingForm";
import { FlightSearchCard, type Currency } from "@/ui/components/FlightSearchCard";
import { ExperienceProviderCard } from "@/ui/components/ExperienceProviderCard";
import { StaySearchCard } from "@/ui/components/StaySearchCard";
import { TicketOptionCard } from "@/ui/components/TicketOptionCard";
import { getCircuitPath } from "@/ui/components/circuitPaths";
import { getCircuitSVGConfig } from "@/ui/components/circuitSVGLoader";
import { getCircuitSvgPath } from "@/ui/components/circuitSvgFiles";

/** Map section key to booking type for filtering. */
const SECTION_TO_BOOKING_TYPE: Record<
  "tickets" | "flights" | "stays" | "experiences",
  ItineraryBookingRecord["type"]
> = {
  tickets: "ticket",
  flights: "flight",
  stays: "stay",
  experiences: "activity",
};

type ItineraryViewProps = {
  result: ItineraryResult;
  /** Itinerary ID (for booking links and URL updates). */
  itineraryId?: string;
  /** User-added bookings for this itinerary. */
  bookings?: ItineraryBookingRecord[];
  /** Called after a new booking is added so parent can refetch. */
  onBookingAdded?: () => void;
  /** True while flight "from" prices are being fetched in the background. */
  flightPricesLoading?: boolean;
};

function parseSectionFiltersFromSearchParams(
  searchParams: URLSearchParams
): SectionFilters {
  const raw = searchParams.get("sections");
  if (!raw || raw.trim() === "") {
    return { ...DEFAULT_SECTION_FILTERS };
  }
  const allowed = new Set(raw.split(",").map((s) => s.trim().toLowerCase()));
  const filters: SectionFilters = { ...DEFAULT_SECTION_FILTERS };
  for (const key of ITINERARY_SECTION_KEYS) {
    filters[key] = allowed.has(key);
  }
  return filters;
}

function sectionFiltersToSearchParams(filters: SectionFilters): string {
  const on = ITINERARY_SECTION_KEYS.filter((k) => filters[k]);
  if (on.length === ITINERARY_SECTION_KEYS.length) return "";
  return on.join(",");
}

/** Renders "Your booking(s)" list and Add booking button/form for one section. */
function BookingsForSection({
  sectionKey,
  bookings,
  itineraryId,
  onBookingAdded,
  addBookingSection,
  setAddBookingSection,
}: {
  sectionKey: ItinerarySectionKey;
  bookings: ItineraryBookingRecord[];
  itineraryId?: string;
  onBookingAdded?: () => void;
  addBookingSection: ItinerarySectionKey | null;
  setAddBookingSection: (k: ItinerarySectionKey | null) => void;
}) {
  const type = SECTION_TO_BOOKING_TYPE[sectionKey];
  const sectionBookings = bookings.filter((b) => b.type === type);

  return (
    <div className="mb-4 space-y-3">
      {sectionBookings.length > 0 && (
        <div className="rounded-lg border border-emerald-800/50 bg-emerald-900/20 p-3">
          <p className="text-xs font-medium text-emerald-400 uppercase tracking-wide mb-2">
            Your booking(s)
          </p>
          <ul className="space-y-2">
            {sectionBookings.map((b) => (
              <li key={b.id} className="flex flex-wrap items-center justify-between gap-2 text-sm">
                <span className="text-white font-medium">{b.provider}</span>
                <span className="text-gray-400 font-mono">{b.confirmationRef}</span>
                {b.detailsUrl && (
                  <a
                    href={b.detailsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-red-400 hover:text-red-300"
                  >
                    View on provider →
                  </a>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
      {itineraryId && onBookingAdded && (
        <>
          {addBookingSection === sectionKey ? (
            <AddBookingForm
              itineraryId={itineraryId}
              type={type}
              onSuccess={() => {
                onBookingAdded();
                setAddBookingSection(null);
              }}
              onCancel={() => setAddBookingSection(null)}
            />
          ) : (
            <button
              type="button"
              onClick={() => setAddBookingSection(sectionKey)}
              className="rounded-md border border-gray-600 px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              + Add booking
            </button>
          )}
        </>
      )}
    </div>
  );
}

/** Circuit SVG for the race details card (right side). Uses same assets as CircuitIcon. */
function RaceCircuitSvg({ raceId }: { raceId: string }) {
  const svgFileUrl = getCircuitSvgPath(raceId);
  const svgConfig = getCircuitSVGConfig(raceId);
  const circuitPath = getCircuitPath(raceId);
  const viewBox = svgConfig?.viewBox ?? "0 0 32 32";
  const strokeWidth = svgConfig?.strokeWidth ?? "1.5";

  const size = 112; // w-28 h-28

  if (svgFileUrl) {
    return (
      <Image
        src={svgFileUrl}
        alt=""
        width={size}
        height={size}
        className="h-28 w-28 object-contain opacity-60 [filter:invert(1)_brightness(0.9)]"
      />
    );
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox={viewBox}
      fill="none"
      className="text-gray-500"
      aria-hidden
    >
      <path
        d={circuitPath}
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

/**
 * Presentational component that renders an ItineraryResult.
 * Renders deep links as external anchors.
 */
const CURRENCY_LABELS: Record<Currency, string> = {
  USD: "USD ($)",
  EUR: "EUR (€)",
  GBP: "GBP (£)",
  AUD: "AUD",
  CAD: "CAD",
  JPY: "JPY (¥)",
  SGD: "SGD",
};

/** Currency selector for the itinerary page. All prices (tickets, flights) display in the selected currency. */
function CurrencySelector({
  value,
  onChange,
}: {
  value: Currency;
  onChange: (c: Currency) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-400">Currency</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as Currency)}
        className="rounded-md border border-gray-600 bg-gray-800 px-3 py-1.5 text-sm font-medium text-white focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
        aria-label="Select currency"
      >
        {Object.entries(CURRENCY_LABELS).map(([code, label]) => (
          <option key={code} value={code}>
            {label}
          </option>
        ))}
      </select>
    </div>
  );
}

export function ItineraryView({
  result,
  itineraryId,
  bookings = [],
  onBookingAdded,
  flightPricesLoading = false,
}: ItineraryViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedOption, setSelectedOption] = useState(result.dateOptions[0]?.key || "");
  const [currency, setCurrency] = useState<Currency>("USD");
  const [addBookingSection, setAddBookingSection] = useState<ItinerarySectionKey | null>(null);

  const sectionFilters = useMemo(
    () => parseSectionFiltersFromSearchParams(searchParams),
    [searchParams]
  );

  const setSectionFilter = useCallback(
    (key: ItinerarySectionKey, value: boolean) => {
      const next = { ...sectionFilters, [key]: value };
      const param = sectionFiltersToSearchParams(next);
      const nextUrl = new URL(window.location.href);
      if (param) nextUrl.searchParams.set("sections", param);
      else nextUrl.searchParams.delete("sections");
      router.replace(nextUrl.pathname + nextUrl.search, { scroll: false });
    },
    [sectionFilters, router]
  );

  const selectedFlights = result.flightsByOption[selectedOption];
  const selectedStays = result.staysByOption[selectedOption];

  return (
    <div className="space-y-8">
      {/* Breadcrumb: minimal, arrow separator, F1 typography and theme */}
      <nav aria-label="Breadcrumb" className="font-heading text-base">
        <ol className="flex flex-wrap items-center gap-x-2">
          <li>
            <Link
              href="/account"
              className="text-gray-300 transition-colors hover:text-red-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-[#0B0C0E] rounded"
            >
              My Itineraries
            </Link>
          </li>
          <li aria-hidden="true" className="select-none text-gray-500">→</li>
          <li className="font-semibold text-white" aria-current="page">
            {result.race.name}
          </li>
        </ol>
      </nav>

      {/* Disclaimers — F1 dark theme */}
      <Card className="border-amber-800/60 bg-amber-900/20 text-amber-200">
        <p className="text-sm">
          <strong>Disclaimer:</strong> All links open external websites. Prices and availability
          may change. Please verify all information with providers before booking.
        </p>
      </Card>

      {/* Race Info Header — F1 dark theme, font-heading, circuit on right */}
      <Card className="border-gray-800 bg-gray-900/30">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
          <div className="min-w-0 flex-1">
            <h1 className="font-heading text-3xl font-bold text-white">
              {result.race.name}
            </h1>
            <p className="mt-2 text-lg text-gray-300">
              {result.race.circuit}, {result.race.city}, {result.race.country}
            </p>
            <p className="mt-1 text-sm text-gray-400">
              Race Date: {result.race.raceDateISO} | From: {result.request.originCity} | 
              Duration: {result.request.durationDays} days | Budget: {result.request.budgetTier}
            </p>
          </div>
          <div className="flex shrink-0 items-center justify-center" aria-hidden>
            <RaceCircuitSvg raceId={result.race.id} />
          </div>
        </div>
      </Card>

      {/* One card: Option tabs (left) + currency (right) + all booking sections */}
      <Card className="border-gray-800 bg-gray-900/30 overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4 px-4 pt-4">
          <div className="min-w-0 flex-1">
            <DateOptionTabs
              options={result.dateOptions}
              selectedKey={selectedOption}
              onSelect={setSelectedOption}
            />
          </div>
          <div className="shrink-0">
            <CurrencySelector value={currency} onChange={setCurrency} />
          </div>
        </div>
        <div className="mt-4 px-4">
          <SectionFilterChips filters={sectionFilters} onChange={setSectionFilter} />
        </div>
        {sectionFilters.tickets && (
        <hr className="border-t border-gray-700/80 my-0 mt-4" aria-hidden />
        )}
        {/* Race Tickets */}
        {sectionFilters.tickets && (
        <div className="py-5">
          <h2 className="font-heading text-lg font-semibold text-white mb-3" id="section-tickets">
            {result.tickets.title}
          </h2>
          <BookingsForSection
            sectionKey="tickets"
            bookings={bookings}
            itineraryId={itineraryId}
            onBookingAdded={onBookingAdded}
            addBookingSection={addBookingSection}
            setAddBookingSection={setAddBookingSection}
          />
          {result.tickets.options && result.tickets.options.length > 0 ? (
            <div className="space-y-4">
              {result.tickets.options.map((option, index) => (
                <TicketOptionCard key={index} option={option} currency={currency} />
              ))}
              <p className="text-sm text-gray-400">
                Prices shown are indicative—verify with provider. Official and reseller prices vary by grandstand and circuit.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex flex-wrap gap-3">
                {result.tickets.links.map((link, index) => (
                  <a
                    key={index}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900 min-h-[44px] items-center justify-center"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
              <p className="text-sm text-gray-400">
                Official and reseller prices vary by grandstand and circuit; expect roughly €200–1500+ for race weekend. Check each link for current availability and pricing.
              </p>
            </div>
          )}
        </div>
        )}

        {sectionFilters.flights && selectedFlights && (() => {
          const selectedDateOption = result.dateOptions.find((o) => o.key === selectedOption);
          const flightSubtitle = selectedDateOption
            ? `From ${result.request.originCity} to ${result.race.city} · ${selectedDateOption.label}`
            : `From ${result.request.originCity} to ${result.race.city}`;
          const flightNotesWithPrice = [getFlightPriceExpectationLine()];
          return (
            <>
              <hr className="border-t border-gray-700/80 my-0" aria-hidden />
              <div className="py-5" id="section-flights">
                <h2 className="font-heading text-lg font-semibold text-white mb-3">
                  {selectedFlights.title}
                </h2>
                <BookingsForSection
                  sectionKey="flights"
                  bookings={bookings}
                  itineraryId={itineraryId}
                  onBookingAdded={onBookingAdded}
                  addBookingSection={addBookingSection}
                  setAddBookingSection={setAddBookingSection}
                />
                {flightPricesLoading && (
                  <p
                    className="text-xs text-gray-500 mb-3"
                    aria-live="polite"
                    role="status"
                  >
                    Flight prices are loading
                  </p>
                )}
                <div className="space-y-4">
                  {selectedFlights.links.map((link) => (
                    <FlightSearchCard
                      key={link.label}
                      link={link}
                      subtitle={flightSubtitle}
                      notes={flightNotesWithPrice}
                      currency={currency}
                      priceLoading={flightPricesLoading}
                    />
                  ))}
                </div>
              </div>
            </>
          );
        })()}

        {sectionFilters.stays && selectedStays && (() => {
          const selectedDateOption = result.dateOptions.find((o) => o.key === selectedOption);
          const staysSubtitle = `Hotels in ${result.race.city} · ${selectedDateOption?.label ?? ""}`;
          return (
            <>
              <hr className="border-t border-gray-700/80 my-0" aria-hidden />
              <div className="py-5" id="section-stays">
                <h2 className="font-heading text-lg font-semibold text-white mb-3">
                  {selectedStays.title}
                </h2>
                <BookingsForSection
                  sectionKey="stays"
                  bookings={bookings}
                  itineraryId={itineraryId}
                  onBookingAdded={onBookingAdded}
                  addBookingSection={addBookingSection}
                  setAddBookingSection={setAddBookingSection}
                />
                <div className="space-y-4">
                  {selectedStays.links.map((link) => (
                    <StaySearchCard
                      key={link.href}
                      link={link}
                      subtitle={staysSubtitle}
                    />
                  ))}
                  {selectedStays.notes && selectedStays.notes.length > 0 && (
                    <ul className="space-y-1 text-sm text-gray-400">
                      {selectedStays.notes.map((note, index) => (
                        <li key={index}>• {note}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </>
          );
        })()}

        {sectionFilters.experiences && (
        <>
        <hr className="border-t border-gray-700/80 my-0" aria-hidden />
        <div className="py-5 last:pb-0" id="section-experiences">
          <h2 className="font-heading text-lg font-semibold text-white mb-3">
            {result.experiences.title}
          </h2>
          <BookingsForSection
            sectionKey="experiences"
            bookings={bookings}
            itineraryId={itineraryId}
            onBookingAdded={onBookingAdded}
            addBookingSection={addBookingSection}
            setAddBookingSection={setAddBookingSection}
          />
          <div className="space-y-4">
            {result.experiences.links.map((link) => (
              <ExperienceProviderCard
                key={link.label}
                link={link}
                subtitle={`Tours & activities in ${result.race.city}`}
                activities={result.experiences.providerActivities?.[link.label]}
              />
            ))}
          </div>
        </div>
        </>
        )}
      </Card>
    </div>
  );
}
