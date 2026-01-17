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
  officialTicketsUrl?: string;
};
