import type { RaceWeekend, TicketOption } from "../races/types";

export type BudgetTier = "$" | "$$" | "$$$";

export type TripRequest = {
  originCity: string;
  raceId: string;
  durationDays: number;
  budgetTier: BudgetTier;
};

export type DateOption = {
  key: string;
  label: string;
  departDateISO: string;
  returnDateISO: string;
};

/** One leg of a flight (e.g. NRT → DXB). */
export type SampleFlightLeg = {
  depIata: string;
  depTime: string;
  arrIata: string;
  arrTime: string;
  durationText: string;
};

/** One sample flight summary for display on a flight search card (e.g. from Amadeus). */
export type SampleFlight = {
  airlineLabel: string;
  departure: string;
  arrival: string;
  stops: number;
  durationText: string;
  /** Stop airport codes (e.g. ["DXB"]) for "1 stop (DXB)". */
  stopAirports?: string[];
  /** Per-segment legs so we can show actual routing (dep → arr, times). */
  legs?: SampleFlightLeg[];
};

export type ProviderLink = {
  label: string;
  href: string;
  /** Optional path to provider logo (e.g. /logos/google-flights.svg). Used by Flights section. */
  logo?: string;
  /** Optional cheapest price from the provider for this search (e.g. "450" for "From $450"). Shown when set. */
  fromPrice?: string;
  /** Optional one sample result (airline, times, stops, duration) to show on the card. */
  sampleFlight?: SampleFlight;
};

export type SectionLinks = {
  title: string;
  links: ProviderLink[];
  notes?: string[];
};

export type TicketsSection = SectionLinks & {
  options?: TicketOption[];
};

export type ItineraryResult = {
  request: TripRequest;
  race: RaceWeekend;
  dateOptions: DateOption[];
  flightsByOption: Record<string, SectionLinks>;
  staysByOption: Record<string, SectionLinks>;
  tickets: TicketsSection;
  experiences: SectionLinks;
};
