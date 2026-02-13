import type { TripRequest, DateOption, ItineraryResult, SampleFlight, SampleFlightLeg } from "@/domain/itinerary/types";
import type { RaceWeekend } from "@/domain/races/types";
import { getOriginIata, getDestIata } from "@/domain/itinerary/linkBuilders";

/** Normalize city name for price key: trim, lowercase, collapse spaces. */
function normalizeCity(s: string): string {
  return String(s).trim().toLowerCase().replace(/\s+/g, " ");
}

/** Deterministic placeholder when API is not configured or fails. */
function getPlaceholderPrices(
  request: TripRequest,
  race: RaceWeekend
): { google: number; skyscanner: number; kayak: number } {
  const originCity = request.originCity;
  const destCity = race.city;
  const key = `${normalizeCity(originCity)}|${normalizeCity(destCity)}`;
  let h = 0;
  for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) >>> 0;
  const base = 220 + (h % 480);
  const round5 = (n: number) => Math.round(n / 5) * 5;
  return {
    google: round5(base + (h % 40)),
    skyscanner: round5(base - 15 - (h % 25)),
    kayak: round5(base - 5 + (h % 30)),
  };
}

const isDev = process.env.NODE_ENV === "development";

function getAmadeusBaseUrl(): string {
  // Amadeus Self-Service credentials are typically for TEST.
  // Use production only if explicitly configured.
  const raw = process.env.AMADEUS_BASE_URL?.trim();
  if (raw) return raw.replace(/\/+$/, "");
  return "https://test.api.amadeus.com";
}

function getAmadeusTokenUrl(): string {
  return `${getAmadeusBaseUrl()}/v1/security/oauth2/token`;
}

function getAmadeusFlightOffersUrl(): string {
  return `${getAmadeusBaseUrl()}/v2/shopping/flight-offers`;
}

/** Fetch Amadeus OAuth token. */
async function getAmadeusToken(): Promise<string | null> {
  const clientId = process.env.AMADEUS_CLIENT_ID;
  const clientSecret = process.env.AMADEUS_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    if (isDev) console.warn("[Amadeus] Missing AMADEUS_CLIENT_ID or AMADEUS_CLIENT_SECRET");
    return null;
  }
  if (isDev) console.warn("[Amadeus] Using base URL:", getAmadeusBaseUrl());

  const body = new URLSearchParams({
    grant_type: "client_credentials",
    client_id: clientId,
    client_secret: clientSecret,
  });

  const res = await fetch(getAmadeusTokenUrl(), {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });
  if (!res.ok) {
    if (isDev) {
      try {
        const json = (await res.json()) as { error?: string; error_description?: string };
        const msg = [json.error, json.error_description].filter(Boolean).join(" — ") || "unknown";
        console.warn("[Amadeus] Token request failed:", res.status, msg);
      } catch {
        console.warn("[Amadeus] Token request failed:", res.status, "(non-JSON response)");
      }
    }
    return null;
  }
  const data = (await res.json()) as { access_token?: string };
  return data.access_token ?? null;
}

type AmadeusSegment = {
  departure?: { at?: string; iataCode?: string };
  arrival?: { at?: string; iataCode?: string };
  carrierCode?: string;
  numberOfStops?: number;
  duration?: string;
};

type AmadeusItinerary = {
  duration?: string;
  segments?: AmadeusSegment[];
};

type AmadeusOffer = {
  price?: { grandTotal?: string };
  itineraries?: AmadeusItinerary[];
};

type AmadeusOfferResponse = {
  data?: AmadeusOffer[];
  errors?: Array<{
    title?: string;
    detail?: string;
    source?: { parameter?: string; pointer?: string };
  }>;
};

function summarizeAmadeusErrors(json: AmadeusOfferResponse): string {
  const errs = json.errors;
  if (!Array.isArray(errs) || errs.length === 0) return "Unknown error";
  return errs
    .map((e) => {
      const where = e.source?.parameter
        ? `param=${e.source.parameter}`
        : e.source?.pointer
          ? `ptr=${e.source.pointer}`
          : undefined;
      return [e.title, e.detail, where].filter(Boolean).join(" | ");
    })
    .join("; ");
}

async function fetchJsonOrNull(res: Response): Promise<{ text: string; json: AmadeusOfferResponse | null }> {
  const text = await res.text();
  try {
    return { text, json: JSON.parse(text) as AmadeusOfferResponse };
  } catch {
    return { text, json: null };
  }
}

/** Format ISO date-time to local time "HH:MM". */
function formatTime(iso?: string): string {
  if (!iso || iso.length < 16) return "–";
  const t = iso.slice(11, 16);
  return t || "–";
}

/** Parse Amadeus duration "PT12H30M" to "12h 30m". */
function parseDuration(dur?: string): string {
  if (!dur || !dur.startsWith("PT")) return "–";
  const hours = dur.match(/(\d+)H/)?.[1];
  const mins = dur.match(/(\d+)M/)?.[1];
  const parts: string[] = [];
  if (hours) parts.push(`${hours}h`);
  if (mins) parts.push(`${mins}m`);
  return parts.length ? parts.join(" ") : "–";
}

/** IATA 2-letter carrier code → full airline name (for flight detail display). Fallback to code if unknown. */
const AIRLINE_NAMES: Record<string, string> = {
  AA: "American Airlines",
  AC: "Air Canada",
  AF: "Air France",
  AY: "Finnair",
  BA: "British Airways",
  CX: "Cathay Pacific",
  DL: "Delta Air Lines",
  EK: "Emirates",
  EY: "Etihad Airways",
  IB: "Iberia",
  KL: "KLM",
  LH: "Lufthansa",
  LX: "Swiss International Air Lines",
  NH: "All Nippon Airways",
  QR: "Qatar Airways",
  SA: "South African Airways",
  SQ: "Singapore Airlines",
  TK: "Turkish Airlines",
  UA: "United Airlines",
  VS: "Virgin Atlantic",
};

function airlineNameFromCode(code: string): string {
  if (!code) return "Flight";
  const name = AIRLINE_NAMES[code.toUpperCase()];
  return name ?? code;
}

/** Build one sample flight summary from an Amadeus offer for display on a card (with actual legs and stop airports). */
function offerToSampleFlight(offer: AmadeusOffer): SampleFlight | undefined {
  const itins = offer.itineraries;
  if (!Array.isArray(itins) || itins.length === 0) return undefined;
  const first = itins[0];
  const segments = first?.segments;
  if (!Array.isArray(segments) || segments.length === 0) return undefined;

  const firstSeg = segments[0];
  const lastSeg = segments[segments.length - 1];
  const departure = formatTime(firstSeg?.departure?.at);
  const arrival = formatTime(lastSeg?.arrival?.at);
  // Stops: multiple segments = connections (e.g. 2 segments = 1 stop); single segment uses segment numberOfStops
  const stops =
    segments.length > 1
      ? segments.length - 1
      : (segments[0]?.numberOfStops ?? 0);
  const durationText = parseDuration(first?.duration) !== "–" ? parseDuration(first?.duration) : "–";
  const carrierCode = firstSeg?.carrierCode ?? "";
  const airlineLabel = airlineNameFromCode(carrierCode);

  // Stop airports: arrival code of every segment except the last (connection points)
  const stopAirports: string[] = segments
    .slice(0, -1)
    .map((s) => s.arrival?.iataCode)
    .filter((c): c is string => typeof c === "string" && c.length > 0);

  // Per-segment legs for actual routing (dep → arr, times)
  const legs: SampleFlightLeg[] = segments
    .map((s) => {
      const depIata = s.departure?.iataCode ?? "";
      const arrIata = s.arrival?.iataCode ?? "";
      const depTime = formatTime(s.departure?.at);
      const arrTime = formatTime(s.arrival?.at);
      const durationText = parseDuration(s.duration);
      if (!depIata && !arrIata && depTime === "–" && arrTime === "–") return null;
      return { depIata, depTime, arrIata, arrTime, durationText };
    })
    .filter((l): l is SampleFlightLeg => l !== null);

  return {
    airlineLabel,
    departure,
    arrival,
    stops,
    durationText,
    ...(stopAirports.length > 0 && { stopAirports }),
    ...(legs.length > 0 && { legs }),
  };
}

type OfferWithPrice = { price: number; sample?: SampleFlight };

/**
 * Call Amadeus Flight Offers Search and return up to 3 cheapest offers (price + optional sample per offer).
 * Used to show different "from" values and one sample result per provider card.
 */
async function fetchTopOffersWithSamples(
  originIata: string,
  destIata: string,
  departureDate: string,
  returnDate: string,
  accessToken: string
): Promise<OfferWithPrice[]> {
  const depart = departureDate.slice(0, 10);
  const return_ = returnDate.slice(0, 10);

  const attemptParamSets: Array<{
    label: string;
    params: Record<string, string>;
  }> = [
    {
      label: "rt",
      params: {
        originLocationCode: originIata,
        destinationLocationCode: destIata,
        departureDate: depart,
        returnDate: return_,
        adults: "1",
      },
    },
    {
      label: "ow",
      params: {
        originLocationCode: originIata,
        destinationLocationCode: destIata,
        departureDate: depart,
        adults: "1",
      },
    },
  ];

  let lastErr: string | null = null;
  for (const attempt of attemptParamSets) {
    const qs = new URLSearchParams(attempt.params);
    const res = await fetch(`${getAmadeusFlightOffersUrl()}?${qs.toString()}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const { text, json } = await fetchJsonOrNull(res);
    if (!res.ok) {
      const summary = json ? summarizeAmadeusErrors(json) : text.slice(0, 200);
      lastErr = `${attempt.label}: ${summary}`;
      if (isDev) console.warn("[Amadeus] Flight offers failed:", res.status, lastErr);
      continue;
    }

    const offers = json?.data as AmadeusOffer[] | undefined;
    if (!Array.isArray(offers) || offers.length === 0) {
      lastErr = `${attempt.label}: no_offers`;
      if (isDev) console.warn("[Amadeus] No flight offers for", attempt.label, originIata, "->", destIata, depart, return_);
      continue;
    }

    const withPrices: Array<{ offer: AmadeusOffer; price: number }> = [];
    for (const offer of offers) {
      const total = offer.price?.grandTotal;
      if (total != null) {
        const n = Number.parseFloat(total);
        if (!Number.isNaN(n)) withPrices.push({ offer, price: n });
      }
    }
    if (withPrices.length === 0) {
      lastErr = `${attempt.label}: no_parsable_price`;
      continue;
    }
    withPrices.sort((a, b) => a.price - b.price);
    return withPrices.slice(0, 3).map(({ offer, price }) => ({
      price,
      sample: offerToSampleFlight(offer),
    }));
  }

  if (isDev && lastErr) console.warn("[Amadeus] All flight-offers attempts failed:", lastErr);
  return [];
}

export type FlightPricesResult = {
  google: number;
  skyscanner: number;
  kayak: number;
  /** True when prices are from Amadeus API; false when placeholder. Only show price in UI when true. */
  fromApi: boolean;
  /** One sample flight per provider (index 0=Google, 1=Skyscanner, 2=Kayak) when fromApi is true. */
  sampleFlights?: (SampleFlight | undefined)[];
};

/**
 * Fetches prices for one date option using a pre-obtained Amadeus token (used for parallel batch).
 */
async function getFlightPricesForOptionWithToken(
  request: TripRequest,
  race: RaceWeekend,
  dateOption: DateOption,
  accessToken: string
): Promise<FlightPricesResult> {
  const placeholder = getPlaceholderPrices(request, race);

  const originIata = getOriginIata(request.originCity);
  const destIata = getDestIata(race);
  const depart = dateOption.departDateISO?.slice(0, 10);
  const return_ = dateOption.returnDateISO?.slice(0, 10);

  if (!originIata || !destIata || !depart || !return_) {
    return { ...placeholder, fromApi: false };
  }

  const topOffers = await fetchTopOffersWithSamples(
    originIata,
    destIata,
    depart,
    return_,
    accessToken
  );

  if (topOffers.length === 0) return { ...placeholder, fromApi: false };

  const [o0, o1, o2] = topOffers;
  const google = Math.round(o0.price);
  const skyscanner = Math.round(o1?.price ?? o0.price);
  const kayak = Math.round(o2?.price ?? o0.price);
  const sampleFlights: (SampleFlight | undefined)[] = [
    o0?.sample,
    o1?.sample,
    o2?.sample,
  ];
  return {
    google,
    skyscanner,
    kayak,
    fromApi: true,
    sampleFlights,
  };
}

/**
 * Returns "from" prices per flight search provider for a route.
 * When AMADEUS_CLIENT_ID and AMADEUS_CLIENT_SECRET are set, calls Amadeus Flight Offers Search
 * and uses the cheapest offer for all three providers (fromApi: true).
 * Otherwise returns placeholder but fromApi: false — do not show in UI to avoid misleading ~$1000 variance.
 */
export async function getFlightPricesForOption(
  request: TripRequest,
  race: RaceWeekend,
  dateOption: DateOption
): Promise<FlightPricesResult> {
  const placeholder = getPlaceholderPrices(request, race);

  const originIata = getOriginIata(request.originCity);
  const destIata = getDestIata(race);
  const depart = dateOption.departDateISO?.slice(0, 10);
  const return_ = dateOption.returnDateISO?.slice(0, 10);

  if (!originIata || !destIata || !depart || !return_) {
    return { ...placeholder, fromApi: false };
  }

  const token = await getAmadeusToken();
  if (!token) return { ...placeholder, fromApi: false };

  return getFlightPricesForOptionWithToken(request, race, dateOption, token);
}

/**
 * Fetches prices for all date options in parallel with a single Amadeus token.
 * Use from flight-prices API / merge to minimize latency (one token + parallel offers).
 */
export async function getFlightPricesForOptions(
  request: TripRequest,
  race: RaceWeekend,
  dateOptions: DateOption[]
): Promise<Record<string, FlightPricesResult>> {
  const placeholder = getPlaceholderPrices(request, race);
  const emptyResult = (): FlightPricesResult => ({ ...placeholder, fromApi: false });

  if (dateOptions.length === 0) return {};

  const token = await getAmadeusToken();
  if (!token) {
    return Object.fromEntries(dateOptions.map((opt) => [opt.key, emptyResult()]));
  }

  const results = await Promise.all(
    dateOptions.map((opt) => getFlightPricesForOptionWithToken(request, race, opt, token))
  );
  return Object.fromEntries(dateOptions.map((opt, i) => [opt.key, results[i]]));
}

/**
 * Enriches an itinerary result with flight "from" prices from Amadeus (when configured).
 * Uses one token + parallel fetch for all date options so the sample itinerary loads faster.
 */
export async function enrichItineraryWithFlightPrices(
  result: ItineraryResult
): Promise<ItineraryResult> {
  if (!result.request || !result.race || !result.dateOptions?.length) return result;

  const raceForFlights = result.race;
  const flightsByOption = { ...result.flightsByOption };

  const pricesMap = await getFlightPricesForOptions(
    result.request,
    raceForFlights,
    result.dateOptions
  );

  for (const dateOption of result.dateOptions) {
    const section = flightsByOption[dateOption.key];
    if (!section?.links?.length) continue;

    const prices = pricesMap[dateOption.key];
    if (!prices?.fromApi) continue;

    const links = [...section.links];
    if (links[0]) {
      links[0].fromPrice = String(prices.google);
      links[0].sampleFlight = prices.sampleFlights?.[0];
    }
    if (links[1]) {
      links[1].fromPrice = String(prices.skyscanner);
      links[1].sampleFlight = prices.sampleFlights?.[1];
    }
    if (links[2]) {
      links[2].fromPrice = String(prices.kayak);
      links[2].sampleFlight = prices.sampleFlights?.[2];
    }
    flightsByOption[dateOption.key] = { ...section, links };
  }

  return { ...result, flightsByOption };
}
