import type { BudgetTier, ProviderLink, TripRequest, DateOption, TicketsSection } from "./types";
import type { RaceWeekend } from "../races/types";

/**
 * Builds deep links for flights (Google Flights, Skyscanner, Kayak).
 * Returns 3–4 provider options with optional logo paths.
 */
/** Convert YYYY-MM-DD to YYMMDD for Skyscanner path. */
function toYYMMDD(iso: string): string {
  if (!iso || iso.length < 10) return "";
  const [y, m, d] = iso.slice(0, 10).split("-");
  return `${y.slice(2)}${m}${d}`;
}

/** Slug for path: lowercase, spaces to hyphens, strip non-alphanumeric. */
function toPathSlug(s: string): string {
  return encodeURIComponent(String(s).trim().toLowerCase().replace(/\s+/g, "-"));
}

/** Normalize city name for IATA lookup: trim, lowercase, collapse spaces. */
function normalizeCity(s: string): string {
  return String(s).trim().toLowerCase().replace(/\s+/g, " ");
}

/** Common origin cities → IATA (nearest major airport). Used for Skyscanner/Kayak deep links. */
const ORIGIN_CITY_TO_IATA: Record<string, string> = {
  "san francisco": "SFO",
  "new york": "JFK",
  "new york city": "JFK",
  "los angeles": "LAX",
  "london": "LHR",
  "chicago": "ORD",
  "miami": "MIA",
  "austin": "AUS",
  "las vegas": "LAS",
  "houston": "IAH",
  "boston": "BOS",
  "seattle": "SEA",
  "washington": "IAD",
  "washington dc": "IAD",
  "dallas": "DFW",
  "denver": "DEN",
  "atlanta": "ATL",
  "phoenix": "PHX",
  "philadelphia": "PHL",
  "toronto": "YYZ",
  "vancouver": "YVR",
  "montreal": "YUL",
  "sydney": "SYD",
  "melbourne": "MEL",
  "singapore": "SIN",
  "tokyo": "NRT",
  "dubai": "DXB",
  "abu dhabi": "AUH",
  "paris": "CDG",
  "amsterdam": "AMS",
  "frankfurt": "FRA",
  "barcelona": "BCN",
  "madrid": "MAD",
  "rome": "FCO",
  "milan": "MXP",
  "munich": "MUC",
  "zurich": "ZRH",
  "mexico city": "MEX",
  "são paulo": "GRU",
  "sao paulo": "GRU",
  "chennai": "MAA",
  "mumbai": "BOM",
  "delhi": "DEL",
  "bangalore": "BLR",
  "hyderabad": "HYD",
  "kolkata": "CCU",
  "dublin": "DUB",
  "brussels": "BRU",
  "vienna": "VIE",
  "lisbon": "LIS",
  "stockholm": "ARN",
  "copenhagen": "CPH",
  "oslo": "OSL",
  "helsinki": "HEL",
  "warsaw": "WAW",
  "prague": "PRG",
  "istanbul": "IST",
  "hong kong": "HKG",
  "seoul": "ICN",
  "beijing": "PEK",
  "kuala lumpur": "KUL",
  "bangkok": "BKK",
  "jakarta": "CGK",
  "manila": "MNL",
  "perth": "PER",
  "brisbane": "BNE",
  "auckland": "AKL",
  "johannesburg": "JNB",
  "cape town": "CPT",
  "cairo": "CAI",
  "tel aviv": "TLV",
  "riyadh": "RUH",
  "doha": "DOH",
};

/** Try IATA lookup; also try without ", country" suffix so "San Francisco, USA" matches. */
function getOriginIata(originCity: string): string | undefined {
  let key = normalizeCity(originCity);
  let iata = ORIGIN_CITY_TO_IATA[key];
  if (iata) return iata;
  // Strip ", country" / ", region" suffix and try again (e.g. "San Francisco, USA" -> "san francisco")
  const comma = key.indexOf(",");
  if (comma > 0) {
    key = key.slice(0, comma).trim();
    iata = ORIGIN_CITY_TO_IATA[key];
  }
  return iata;
}

/** Race city → IATA fallback when race.airportCode is missing (e.g. old stored JSON). */
const RACE_CITY_TO_IATA: Record<string, string> = {
  melbourne: "MEL",
  shanghai: "PVG",
  suzuka: "NGO",
  sakhir: "BAH",
  jeddah: "JED",
  miami: "MIA",
  montreal: "YUL",
  "monte carlo": "NCE",
  barcelona: "BCN",
  spielberg: "GRZ",
  silverstone: "LHR",
  spa: "CRL",
  budapest: "BUD",
  zandvoort: "AMS",
  monza: "MXP",
  madrid: "MAD",
  baku: "GYD",
  singapore: "SIN",
  austin: "AUS",
  "mexico city": "MEX",
  "são paulo": "GRU",
  "sao paulo": "GRU",
  "las vegas": "LAS",
  lusail: "DOH",
  "abu dhabi": "AUH",
};

function getDestIata(race: RaceWeekend): string | undefined {
  if (race.airportCode) return race.airportCode;
  const key = normalizeCity(race.city);
  return RACE_CITY_TO_IATA[key];
}

export function buildFlightsLinks(
  request: TripRequest,
  race: RaceWeekend,
  dateOption: DateOption
): ProviderLink[] {
  const { originCity } = request;
  const departDateISO = dateOption.departDateISO ?? "";
  const returnDateISO = dateOption.returnDateISO ?? "";
  const depart = departDateISO && departDateISO.length >= 10 ? departDateISO : "";
  const return_ = returnDateISO && returnDateISO.length >= 10 ? returnDateISO : "";

  // Google Flights: use /flights/search; q for route; set date params only when valid
  const googleFlightsUrl = new URL("https://www.google.com/travel/flights/search");
  googleFlightsUrl.searchParams.set("q", `Flights from ${originCity} to ${race.city}`);
  if (depart) googleFlightsUrl.searchParams.set("departure", depart);
  if (return_) googleFlightsUrl.searchParams.set("return", return_);

  // Skyscanner: expects IATA codes in path (e.g. sfo/ngo) and YYMMDD; city slugs often don't work
  const outYYMMDD = toYYMMDD(depart);
  const inYYMMDD = toYYMMDD(return_);
  const originIata = getOriginIata(originCity);
  const destIata = getDestIata(race);
  const hasIata = originIata && destIata;
  let skyscannerUrl: URL;
  if (hasIata && outYYMMDD && inYYMMDD) {
    const o = originIata.toLowerCase();
    const d = destIata.toLowerCase();
    skyscannerUrl = new URL(
      `https://www.skyscanner.com/transport/flights/${o}/${d}/${outYYMMDD}/${inYYMMDD}`
    );
    skyscannerUrl.searchParams.set("adultsv2", "1");
    skyscannerUrl.searchParams.set("cabinclass", "economy");
    skyscannerUrl.searchParams.set("rtn", "1");
  } else {
    // Fallback: /transport/flights 404s; use main site so link works
    skyscannerUrl = new URL("https://www.skyscanner.com/");
  }

  // Kayak: path with IATA codes so destination and dates are applied (city names often only set origin).
  // Add cache-busting query param so Kayak doesn't reuse a previous search (e.g. LHR-NCE).
  const kayakCacheBust = `_cb=${Date.now()}`;
  let kayakUrl: URL;
  if (hasIata && depart && return_) {
    const o = originIata.toLowerCase();
    const d = destIata.toLowerCase();
    kayakUrl = new URL(`https://www.kayak.com/flights/${o}-${d}/${depart}/${return_}?${kayakCacheBust}`);
  } else {
    const kayakPath =
      depart && return_
        ? `/flights/${encodeURIComponent(originCity)}-${encodeURIComponent(race.city)}/${depart}/${return_}`
        : `/flights/${encodeURIComponent(originCity)}-${encodeURIComponent(race.city)}`;
    kayakUrl = new URL(kayakPath, "https://www.kayak.com");
    kayakUrl.search = kayakCacheBust;
  }

  return [
    {
      label: "Google Flights",
      href: googleFlightsUrl.toString(),
      logo: "/logos/google-flights.svg",
    },
    {
      label: "Skyscanner",
      href: skyscannerUrl.toString(),
      logo: "/logos/skyscanner.svg",
    },
    {
      label: "Kayak",
      href: kayakUrl.toString(),
      logo: "/logos/kayak.svg",
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
 * Builds deep links for tickets (official F1 tickets + other sources + circuit search).
 */
export function buildTicketsLinks(race: {
  officialTicketsUrl?: string;
  otherTicketsUrl?: string;
  circuit: string;
}): ProviderLink[] {
  const links: ProviderLink[] = [];

  if (race.officialTicketsUrl) {
    links.push({
      label: "Official F1 Tickets",
      href: race.officialTicketsUrl,
    });
  }
  if (race.otherTicketsUrl) {
    links.push({
      label: "Other ticket sources",
      href: race.otherTicketsUrl,
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
 * Builds the tickets section with optional curated options (card display) and fallback links.
 */
export function buildTicketsSection(race: RaceWeekend): TicketsSection {
  const links = buildTicketsLinks(race);
  return {
    title: "Race Tickets",
    links,
    options: race.ticketOptions,
  };
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

/**
 * One-line copy for flight card expand: sets expectation that prices are on the partner site.
 */
export function getFlightPriceExpectationLine(): string {
  return "Prices and availability vary by date and airline. Use the partner site to see current rates and book.";
}
