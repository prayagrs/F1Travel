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

export type ProviderLink = {
  label: string;
  href: string;
  /** Optional path to provider logo (e.g. /logos/google-flights.svg). Used by Flights section. */
  logo?: string;
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
