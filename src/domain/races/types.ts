/**
 * RaceWeekend type representing a Formula 1 race weekend.
 * This type is the single source of truth for race data structure
 * across domain, services, and UI layers.
 */
export type RaceWeekend = {
  id: string;
  name: string;
  circuit: string;
  city: string;
  country: string;
  raceDateISO: string;
  /** Official F1 ticket purchase URL (from tickets.formula1.com). */
  officialTicketsUrl?: string;
  /** Other ticket sources (promoter/circuit URLs). */
  otherTicketsUrl?: string;
};
