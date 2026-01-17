import type { RaceWeekend } from "../races/types";

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
};

export type SectionLinks = {
  title: string;
  links: ProviderLink[];
  notes?: string[];
};

export type ItineraryResult = {
  request: TripRequest;
  race: RaceWeekend;
  dateOptions: DateOption[];
  flightsByOption: Record<string, SectionLinks>;
  staysByOption: Record<string, SectionLinks>;
  tickets: SectionLinks;
  experiences: SectionLinks;
};
