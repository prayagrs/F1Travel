/**
 * A single ticket option from a specific source (Official F1, circuit promoter, etc.)
 */
export type TicketOption = {
  source: string;
  /** Path or URL to source logo */
  sourceLogo?: string;
  stand: string;
  days: number;
  price: string;
  href: string;
  /** Optional details shown when card is expanded (inclusions, notes) */
  notes?: string[];
};

/** A single curated activity (tour/experience) for the experiences section. */
export type RaceExperienceActivity = {
  title: string;
  href: string;
  description?: string;
};

/** Per-provider curated activities (1–2 per provider) for a race. */
export type RaceExperienceOption = {
  provider: string;
  activities: RaceExperienceActivity[];
};

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
  /** Nearest airport IATA code for flight search links (e.g. NGO for Suzuka). */
  airportCode?: string;
  raceDateISO: string;
  /** Official F1 ticket purchase URL (from tickets.formula1.com). */
  officialTicketsUrl?: string;
  /** Other ticket sources (promoter/circuit URLs). */
  otherTicketsUrl?: string;
  /** Curated ticket options with price, stand, and source for card display */
  ticketOptions?: TicketOption[];
  /** Curated 1–2 activities per experience provider (GetYourGuide, Viator, TripAdvisor). */
  experienceOptions?: RaceExperienceOption[];
};
