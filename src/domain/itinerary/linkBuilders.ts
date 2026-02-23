import type {
  BudgetTier,
  ExperienceActivity,
  ExperiencesSection,
  ProviderLink,
  TripRequest,
  DateOption,
  TicketsSection,
} from "./types";
import type { RaceWeekend } from "../races/types";
import type { TicketOption } from "../races/types";

/** Optional affiliate/partner query string for official F1 ticket URLs (e.g. "partner=xyz"). Only appended when set. */
const F1_TICKETS_AFFILIATE_PARAM = typeof process !== "undefined" ? process.env.F1_TICKETS_AFFILIATE_PARAM : undefined;
/** Booking.com affiliate aid (e.g. aid=123456). Only appended when set. */
const BOOKING_AFFILIATE_AID = typeof process !== "undefined" ? process.env.BOOKING_AFFILIATE_AID : undefined;
/** Skyscanner partner ID for affiliate tracking. Only appended when set. */
const SKYSCANNER_PARTNER_ID = typeof process !== "undefined" ? process.env.SKYSCANNER_PARTNER_ID : undefined;
/** Viator partner/affiliate ID. Only appended when set. */
const VIATOR_PARTNER_ID = typeof process !== "undefined" ? process.env.VIATOR_PARTNER_ID : undefined;
/** GetYourGuide partner ID. Only appended when set. */
const GETYOURGUIDE_PARTNER_ID = typeof process !== "undefined" ? process.env.GETYOURGUIDE_PARTNER_ID : undefined;
/** When true, show "Partner" label for affiliate-capable providers even without env set. UI demo only; do not use in production. */
const AFFILIATE_LABELS_DEMO =
  typeof process !== "undefined" && process.env.NEXT_PUBLIC_AFFILIATE_LABELS_DEMO === "true";

/**
 * Appends an optional affiliate param to a URL. Uses ? or & as needed.
 * Safe when param is undefined or empty: returns url unchanged.
 */
function appendAffiliateParam(url: string, param: string | undefined): string {
  if (!param || param.trim() === "") return url;
  try {
    const parsed = new URL(url);
    const toAppend = param.trim().startsWith("?") ? param.trim().slice(1) : param.trim();
    if (parsed.search) {
      parsed.search += "&" + toAppend;
    } else {
      parsed.search = toAppend;
    }
    return parsed.toString();
  } catch {
    return url;
  }
}

/**
 * Appends a return URL param so the partner can redirect the user back to this itinerary section after booking.
 * Use when building links that support post-booking redirect (e.g. Booking.com redirect_uri).
 * @param href - Outbound partner URL
 * @param baseUrl - App origin (e.g. window.location.origin or NEXT_PUBLIC_APP_URL)
 * @param itineraryId - Itinerary ID
 * @param section - Section key for ?return= (stay | ticket | flight | activity)
 */
export function appendReturnUrlToHref(
  href: string,
  baseUrl: string,
  itineraryId: string,
  section: "stay" | "ticket" | "flight" | "activity"
): string {
  if (!baseUrl?.trim() || !itineraryId?.trim()) return href;
  try {
    const returnPath = `${baseUrl.replace(/\/$/, "")}/itinerary/${itineraryId}?return=${section}`;
    const parsed = new URL(href);
    parsed.searchParams.set("redirect_uri", returnPath);
    return parsed.toString();
  } catch {
    return href;
  }
}

/** True when href is the official F1 ticket site (tickets.formula1.com). */
function isOfficialF1TicketsUrl(href: string): boolean {
  try {
    const u = new URL(href);
    return u.hostname === "tickets.formula1.com";
  } catch {
    return false;
  }
}

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

/** Try IATA lookup; also try without ", country" suffix so "San Francisco, USA" matches. Exported for server-side flight API (e.g. Amadeus). */
export function getOriginIata(originCity: string): string | undefined {
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

/** Race city to IATA. Exported for server-side flight API (e.g. Amadeus). */
export function getDestIata(race: RaceWeekend): string | undefined {
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
  if (SKYSCANNER_PARTNER_ID?.trim()) {
    skyscannerUrl.searchParams.set("partner", SKYSCANNER_PARTNER_ID.trim());
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

  const skyscannerAffiliate = Boolean(SKYSCANNER_PARTNER_ID?.trim()) || AFFILIATE_LABELS_DEMO;
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
      isAffiliate: skyscannerAffiliate,
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
  if (BOOKING_AFFILIATE_AID?.trim()) {
    bookingUrl.searchParams.set("aid", BOOKING_AFFILIATE_AID.trim());
  }

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

  const bookingAffiliate = Boolean(BOOKING_AFFILIATE_AID?.trim()) || AFFILIATE_LABELS_DEMO;
  return [
    {
      label: "Booking.com",
      href: bookingUrl.toString(),
      logo: "/logos/booking.svg",
      isAffiliate: bookingAffiliate,
    },
    {
      label: "Airbnb",
      href: airbnbUrl.toString(),
      logo: "/logos/airbnb.svg",
    },
    {
      label: "Google Hotels",
      href: googleHotelsUrl.toString(),
      logo: "/logos/google.svg",
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

  const f1Affiliate = Boolean(F1_TICKETS_AFFILIATE_PARAM?.trim()) || AFFILIATE_LABELS_DEMO;
  if (race.officialTicketsUrl) {
    links.push({
      label: "Official F1 Tickets",
      href: appendAffiliateParam(race.officialTicketsUrl, F1_TICKETS_AFFILIATE_PARAM),
      isAffiliate: f1Affiliate,
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
 * Official F1 ticket URLs (tickets.formula1.com) get the optional affiliate param when F1_TICKETS_AFFILIATE_PARAM is set.
 */
export function buildTicketsSection(race: RaceWeekend): TicketsSection {
  const links = buildTicketsLinks(race);
  const options: TicketOption[] | undefined = race.ticketOptions?.map((opt) => ({
    ...opt,
    href: isOfficialF1TicketsUrl(opt.href)
      ? appendAffiliateParam(opt.href, F1_TICKETS_AFFILIATE_PARAM)
      : opt.href,
  }));
  return {
    title: "Race Tickets",
    links,
    options: options ?? race.ticketOptions,
  };
}

/**
 * Builds deep links for experiences (GetYourGuide, Viator, TripAdvisor)
 */
export function buildExperiencesLinks(race: { city: string; country: string }): ProviderLink[] {
  const getYourGuideUrl = new URL("https://www.getyourguide.com/s");
  getYourGuideUrl.searchParams.set("q", race.city);
  if (GETYOURGUIDE_PARTNER_ID?.trim()) {
    getYourGuideUrl.searchParams.set("partner_id", GETYOURGUIDE_PARTNER_ID.trim());
  }

  const viatorUrl = new URL("https://www.viator.com/searchResults/all");
  viatorUrl.searchParams.set("text", race.city);
  if (VIATOR_PARTNER_ID?.trim()) {
    viatorUrl.searchParams.set("mcid", VIATOR_PARTNER_ID.trim());
  }

  const tripAdvisorUrl = new URL("https://www.tripadvisor.com/Search");
  tripAdvisorUrl.searchParams.set("q", `${race.city} things to do`);

  const gygAffiliate = Boolean(GETYOURGUIDE_PARTNER_ID?.trim()) || AFFILIATE_LABELS_DEMO;
  const viatorAffiliate = Boolean(VIATOR_PARTNER_ID?.trim()) || AFFILIATE_LABELS_DEMO;
  return [
    {
      label: "GetYourGuide",
      href: getYourGuideUrl.toString(),
      logo: "/logos/getyourguide.svg",
      isAffiliate: gygAffiliate,
    },
    {
      label: "Viator",
      href: viatorUrl.toString(),
      logo: "/logos/viator.svg",
      isAffiliate: viatorAffiliate,
    },
    {
      label: "TripAdvisor",
      href: tripAdvisorUrl.toString(),
      logo: "/logos/tripadvisor.svg",
    },
  ];
}

/** Normalize city name for activity lookup: lowercase, trim. */
function normalizeCityForActivities(city: string): string {
  return String(city).trim().toLowerCase();
}

/**
 * City-level fallback: 1–2 activities per provider when race has no experienceOptions.
 * Key is normalized city name (e.g. "melbourne", "barcelona").
 */
const CITY_ACTIVITIES_FALLBACK: Record<
  string,
  Record<string, ExperienceActivity[]>
> = {
  melbourne: {
    GetYourGuide: [
      { title: "Melbourne City Highlights Tour", href: "https://www.getyourguide.com/melbourne-l123/", description: "Discover top sights and hidden gems" },
      { title: "Yarra Valley Wine Tour", href: "https://www.getyourguide.com/melbourne-l123/", description: "Wine tasting and scenic day trip" },
    ],
    Viator: [
      { title: "Phillip Island & Penguin Parade", href: "https://www.viator.com/Melbourne/d384-ttd", description: "Wildlife and coastal scenery" },
    ],
    TripAdvisor: [
      { title: "Things to Do in Melbourne", href: "https://www.tripadvisor.com/Attractions-g255100-Activities-Melbourne_Victoria.html", description: "Tours, food & culture" },
    ],
  },
  barcelona: {
    GetYourGuide: [
      { title: "Sagrada Familia & Park Güell Tour", href: "https://www.getyourguide.com/barcelona-l45/", description: "Gaudí masterpieces" },
      { title: "Tapas and Wine Experience", href: "https://www.getyourguide.com/barcelona-l45/", description: "Food tour in the Gothic Quarter" },
    ],
    Viator: [
      { title: "Montserrat Half-Day Trip", href: "https://www.viator.com/Barcelona/d562-ttd", description: "Monastery and mountain views" },
    ],
    TripAdvisor: [
      { title: "Things to Do in Barcelona", href: "https://www.tripadvisor.com/Attractions-g187497-Activities-Barcelona_Catalonia.html", description: "Tours and attractions" },
    ],
  },
  "monte carlo": {
    GetYourGuide: [
      { title: "Monaco & Monte Carlo Tour", href: "https://www.getyourguide.com/monaco-l395/", description: "Principality highlights" },
      { title: "French Riviera Day Trip", href: "https://www.getyourguide.com/monaco-l395/", description: "Nice, Eze, and coastal views" },
    ],
    Viator: [
      { title: "Monaco Grand Prix Circuit Walk", href: "https://www.viator.com/Monaco/d802-ttd", description: "Walk the famous track" },
    ],
    TripAdvisor: [
      { title: "Things to Do in Monaco", href: "https://www.tripadvisor.com/Attractions-g190410-Activities-Monaco.html", description: "Tours and experiences" },
    ],
  },
  miami: {
    GetYourGuide: [
      { title: "Everglades Airboat Adventure", href: "https://www.getyourguide.com/miami-l358/", description: "Wildlife and wetlands" },
      { title: "South Beach Food & Art Walk", href: "https://www.getyourguide.com/miami-l358/", description: "Food and culture tour" },
    ],
    Viator: [
      { title: "Miami Boat Tour", href: "https://www.viator.com/Miami/d662-ttd", description: "Harbor and celebrity homes" },
    ],
    TripAdvisor: [
      { title: "Things to Do in Miami", href: "https://www.tripadvisor.com/Attractions-g34438-Activities-Miami_Beach_Florida.html", description: "Tours and activities" },
    ],
  },
  montreal: {
    GetYourGuide: [
      { title: "Old Montreal Walking Tour", href: "https://www.getyourguide.com/montreal-l359/", description: "History and architecture" },
      { title: "Food Tour of Mile End", href: "https://www.getyourguide.com/montreal-l359/", description: "Local eats and culture" },
    ],
    Viator: [
      { title: "Montreal City Sightseeing", href: "https://www.viator.com/Montreal/d625-ttd", description: "Top attractions by bus or foot" },
    ],
    TripAdvisor: [
      { title: "Things to Do in Montreal", href: "https://www.tripadvisor.com/Attractions-g155032-Activities-Montreal_Quebec.html", description: "Tours and experiences" },
    ],
  },
};

const MAX_ACTIVITIES_PER_PROVIDER = 2;

/**
 * Builds the full experiences section: provider links plus optional 1–2 activities per provider.
 * Uses race.experienceOptions when present, otherwise city-level fallback.
 */
export function buildExperiencesSection(race: RaceWeekend): ExperiencesSection {
  const links = buildExperiencesLinks(race);
  const providerActivities: Record<string, ExperienceActivity[]> = {};

  if (race.experienceOptions && race.experienceOptions.length > 0) {
    for (const entry of race.experienceOptions) {
      const activities = entry.activities.slice(0, MAX_ACTIVITIES_PER_PROVIDER);
      if (activities.length > 0) {
        providerActivities[entry.provider] = activities as ExperienceActivity[];
      }
    }
  } else {
    const cityKey = normalizeCityForActivities(race.city);
    const byCity = CITY_ACTIVITIES_FALLBACK[cityKey];
    if (byCity) {
      for (const label of links.map((l) => l.label)) {
        const activities = byCity[label]?.slice(0, MAX_ACTIVITIES_PER_PROVIDER);
        if (activities?.length) providerActivities[label] = activities;
      }
    }
  }

  return {
    title: "Experiences & Activities",
    links,
    ...(Object.keys(providerActivities).length > 0 ? { providerActivities } : {}),
  };
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
  return "Prices and availability vary by date and airline. Use the partner site to see more flight options, current rates and book.";
}
