import type { BudgetTier, ProviderLink, TripRequest, DateOption } from "./types";
import type { RaceWeekend } from "../races/types";

/**
 * Builds deep links for flights (Google Flights + Skyscanner)
 */
export function buildFlightsLinks(
  request: TripRequest,
  race: RaceWeekend,
  dateOption: DateOption
): ProviderLink[] {
  const { originCity } = request;
  const { departDateISO, returnDateISO } = dateOption;

  // Google Flights deep link
  const googleFlightsUrl = new URL("https://www.google.com/travel/flights");
  googleFlightsUrl.searchParams.set("q", `Flights from ${originCity} to ${race.city}`);
  googleFlightsUrl.searchParams.set("departure", departDateISO);
  googleFlightsUrl.searchParams.set("return", returnDateISO);

  // Skyscanner deep link
  const skyscannerUrl = new URL("https://www.skyscanner.com/transport/flights");
  skyscannerUrl.searchParams.set("origin", originCity);
  skyscannerUrl.searchParams.set("destination", race.city);
  skyscannerUrl.searchParams.set("departure", departDateISO);
  skyscannerUrl.searchParams.set("return", returnDateISO);

  return [
    {
      label: "Google Flights",
      href: googleFlightsUrl.toString(),
    },
    {
      label: "Skyscanner",
      href: skyscannerUrl.toString(),
    },
  ];
}

/**
 * Builds deep links for stays (Booking + Airbnb + Google Hotels)
 */
export function buildStaysLinks(
  race: RaceWeekend,
  dateOption: DateOption
): ProviderLink[] {
  const { departDateISO, returnDateISO } = dateOption;

  // Booking.com deep link
  const bookingUrl = new URL("https://www.booking.com/searchresults.html");
  bookingUrl.searchParams.set("ss", race.city);
  bookingUrl.searchParams.set("checkin", departDateISO);
  bookingUrl.searchParams.set("checkout", returnDateISO);

  // Airbnb deep link
  const airbnbUrl = new URL("https://www.airbnb.com/s");
  airbnbUrl.searchParams.set("query", race.city);
  airbnbUrl.searchParams.set("checkin", departDateISO);
  airbnbUrl.searchParams.set("checkout", returnDateISO);

  // Google Hotels deep link
  const googleHotelsUrl = new URL("https://www.google.com/travel/hotels");
  googleHotelsUrl.searchParams.set("q", `Hotels in ${race.city}`);
  googleHotelsUrl.searchParams.set("checkin", departDateISO);
  googleHotelsUrl.searchParams.set("checkout", returnDateISO);

  return [
    {
      label: "Booking.com",
      href: bookingUrl.toString(),
    },
    {
      label: "Airbnb",
      href: airbnbUrl.toString(),
    },
    {
      label: "Google Hotels",
      href: googleHotelsUrl.toString(),
    },
  ];
}

/**
 * Builds deep links for tickets (official F1 tickets + circuit override if provided)
 */
export function buildTicketsLinks(race: { officialTicketsUrl?: string; circuit: string }): ProviderLink[] {
  const links: ProviderLink[] = [];

  if (race.officialTicketsUrl) {
    links.push({
      label: "Official F1 Tickets",
      href: race.officialTicketsUrl,
    });
  }

  // Circuit-specific ticket search
  const circuitSearchUrl = new URL("https://www.google.com/search");
  circuitSearchUrl.searchParams.set("q", `${race.circuit} tickets Formula 1`);

  links.push({
    label: "Search Circuit Tickets",
    href: circuitSearchUrl.toString(),
  });

  return links;
}

/**
 * Builds deep links for experiences (GetYourGuide + Viator)
 */
export function buildExperiencesLinks(race: { city: string; country: string }): ProviderLink[] {
  // GetYourGuide deep link
  const getYourGuideUrl = new URL("https://www.getyourguide.com/s");
  getYourGuideUrl.searchParams.set("q", race.city);

  // Viator deep link
  const viatorUrl = new URL("https://www.viator.com/searchResults/all");
  viatorUrl.searchParams.set("text", race.city);

  return [
    {
      label: "GetYourGuide",
      href: getYourGuideUrl.toString(),
    },
    {
      label: "Viator",
      href: viatorUrl.toString(),
    },
  ];
}

/**
 * Returns neighborhood tips by budget tier
 */
export function getNeighborhoodTipsByBudget(budgetTier: BudgetTier): string[] {
  const tips: Record<BudgetTier, string[]> = {
    $: [
      "Look for hostels or budget hotels near public transport",
      "Consider staying slightly outside the city center for better prices",
      "Book early for the best deals",
    ],
    $$: [
      "Mid-range hotels in city center offer good value",
      "Check for hotels with breakfast included",
      "Look for properties near the circuit for convenience",
    ],
    $$$: [
      "Luxury hotels near the circuit or city center",
      "Consider boutique hotels for a unique experience",
      "Book premium accommodations with race weekend packages",
    ],
  };

  return tips[budgetTier];
}

/**
 * Returns flight booking notes influenced by budget tier
 */
export function getFlightNotesByBudget(budgetTier: BudgetTier): string[] {
  const notes: Record<BudgetTier, string[]> = {
    $: [
      "Book early for best prices",
      "Consider flexible dates for cheaper options",
      "Check budget airlines for additional savings",
    ],
    $$: [
      "Compare multiple airlines for best deals",
      "Consider direct flights to save time",
      "Book 2-3 months in advance for optimal pricing",
    ],
    $$$: [
      "Premium economy or business class available",
      "Direct flights recommended for convenience",
      "Flexible booking options recommended",
    ],
  };

  return notes[budgetTier];
}
