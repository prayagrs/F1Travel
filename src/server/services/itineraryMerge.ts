import { raceRepo } from "@/server/repositories/raceRepo";
import type { ItineraryRecord } from "@/server/repositories/itineraryRepo";
import {
  buildTicketsSection,
  buildFlightsLinks,
  getFlightNotesByBudget,
} from "@/domain/itinerary/linkBuilders";
import { generateDateOptions } from "@/domain/itinerary/dateOptions";
import type { DateOption, ItineraryResult, SectionLinks, TripRequest } from "@/domain/itinerary/types";
import type { RaceWeekend } from "@/domain/races/types";
import { getFlightPricesForOptions } from "@/server/services/flightPrices";

/**
 * Builds the merged itinerary result (live tickets + flight links) from a stored record.
 * Does not fetch flight prices; use GET /api/itineraries/[id]/flight-prices for that.
 * Used by the itinerary page and GET /api/itineraries/[id]/result.
 */
export function getMergedItineraryResult(itinerary: ItineraryRecord): ItineraryResult {
  const resultJson = itinerary.resultJson;
  const yearRaw = resultJson.race?.raceDateISO
    ? new Date(resultJson.race.raceDateISO).getFullYear()
    : 2026;
  const year = Number.isNaN(yearRaw) ? 2026 : yearRaw;
  const raceId = resultJson.request?.raceId ?? itinerary.raceId;
  const currentRace = raceRepo.getRaceById(year, raceId);
  const tickets = currentRace
    ? buildTicketsSection(currentRace)
    : resultJson.tickets;

  const stored = resultJson as ItineraryResult;
  const flightsByOption: Record<string, SectionLinks> = {};
  if (stored.dateOptions?.length && stored.request && stored.race) {
    const raceForFlights = currentRace ? { ...stored.race, ...currentRace } : stored.race;
    for (const dateOption of stored.dateOptions) {
      const raw = dateOption as Record<string, unknown>;
      const departStr = raw.departDateISO ?? raw.depart_date_iso;
      const returnStr = raw.returnDateISO ?? raw.return_date_iso;
      if (typeof departStr !== "string" || typeof returnStr !== "string") {
        continue;
      }
      const normalizedOption = {
        key: dateOption.key,
        label: dateOption.label,
        departDateISO: departStr,
        returnDateISO: returnStr,
      };
      const links = buildFlightsLinks(stored.request, raceForFlights, normalizedOption);
      flightsByOption[dateOption.key] = {
        title: "Flights",
        links,
        notes: getFlightNotesByBudget(stored.request.budgetTier),
      };
    }
  } else if (stored.request && stored.race && currentRace) {
    const raceForFlights = { ...stored.race, ...currentRace };
    const dateOptions = generateDateOptions(
      stored.race.raceDateISO,
      stored.request.durationDays
    );
    for (const dateOption of dateOptions) {
      const links = buildFlightsLinks(stored.request, raceForFlights, dateOption);
      flightsByOption[dateOption.key] = {
        title: "Flights",
        links,
        notes: getFlightNotesByBudget(stored.request.budgetTier),
      };
    }
  } else {
    Object.assign(flightsByOption, stored.flightsByOption ?? {});
  }

  return { ...stored, tickets, flightsByOption };
}

/**
 * Fetches flight prices (Amadeus) for all date options in parallel with a single token,
 * and returns flightsByOption with fromPrice set. Used by GET /api/itineraries/[id]/flight-prices.
 */
export async function getFlightPricesForItinerary(
  itinerary: ItineraryRecord
): Promise<Record<string, SectionLinks>> {
  const resultJson = itinerary.resultJson;
  const stored = resultJson as ItineraryResult;
  const yearRaw = resultJson.race?.raceDateISO
    ? new Date(resultJson.race.raceDateISO).getFullYear()
    : 2026;
  const year = Number.isNaN(yearRaw) ? 2026 : yearRaw;
  const raceId = resultJson.request?.raceId ?? itinerary.raceId;
  const currentRace = raceRepo.getRaceById(year, raceId);
  const flightsByOption: Record<string, SectionLinks> = {};
  let optionsList: DateOption[] = [];

  if (stored.dateOptions?.length && stored.request && stored.race) {
    const raceForFlights = currentRace ? { ...stored.race, ...currentRace } : stored.race;
    for (const dateOption of stored.dateOptions) {
      const raw = dateOption as Record<string, unknown>;
      const departStr = raw.departDateISO ?? raw.depart_date_iso;
      const returnStr = raw.returnDateISO ?? raw.return_date_iso;
      if (typeof departStr !== "string" || typeof returnStr !== "string") continue;
      const normalizedOption = {
        key: dateOption.key,
        label: dateOption.label,
        departDateISO: departStr,
        returnDateISO: returnStr,
      };
      optionsList.push(normalizedOption);
      const links = buildFlightsLinks(stored.request, raceForFlights, normalizedOption);
      flightsByOption[dateOption.key] = {
        title: "Flights",
        links,
        notes: getFlightNotesByBudget(stored.request.budgetTier),
      };
    }
    const pricesMap = await getFlightPricesForOptions(stored.request, raceForFlights, optionsList);
    for (const key of Object.keys(flightsByOption)) {
      const section = flightsByOption[key];
      const prices = pricesMap[key];
      if (prices?.fromApi && section.links) {
        if (section.links[0]) {
          section.links[0].fromPrice = String(prices.google);
          section.links[0].sampleFlight = prices.sampleFlights?.[0];
        }
        if (section.links[1]) {
          section.links[1].fromPrice = String(prices.skyscanner);
          section.links[1].sampleFlight = prices.sampleFlights?.[1];
        }
        if (section.links[2]) {
          section.links[2].fromPrice = String(prices.kayak);
          section.links[2].sampleFlight = prices.sampleFlights?.[2];
        }
      }
    }
  } else if (stored.request && stored.race && currentRace) {
    const raceForFlights = { ...stored.race, ...currentRace };
    const dateOptions = generateDateOptions(
      stored.race.raceDateISO,
      stored.request.durationDays
    );
    optionsList = dateOptions;
    for (const dateOption of dateOptions) {
      const links = buildFlightsLinks(stored.request, raceForFlights, dateOption);
      flightsByOption[dateOption.key] = {
        title: "Flights",
        links,
        notes: getFlightNotesByBudget(stored.request.budgetTier),
      };
    }
    const pricesMap = await getFlightPricesForOptions(stored.request, raceForFlights, dateOptions);
    for (const key of Object.keys(flightsByOption)) {
      const section = flightsByOption[key];
      const prices = pricesMap[key];
      if (prices?.fromApi && section.links) {
        if (section.links[0]) {
          section.links[0].fromPrice = String(prices.google);
          section.links[0].sampleFlight = prices.sampleFlights?.[0];
        }
        if (section.links[1]) {
          section.links[1].fromPrice = String(prices.skyscanner);
          section.links[1].sampleFlight = prices.sampleFlights?.[1];
        }
        if (section.links[2]) {
          section.links[2].fromPrice = String(prices.kayak);
          section.links[2].sampleFlight = prices.sampleFlights?.[2];
        }
      }
    }
  }

  return flightsByOption;
}

/**
 * Fetches flight prices for a request + race (no saved itinerary).
 * Used by GET /api/flight-prices/sample so the sample itinerary page can load fast and fetch prices on the client.
 */
export async function getFlightPricesForRequest(
  request: TripRequest,
  race: RaceWeekend
): Promise<Record<string, SectionLinks>> {
  const dateOptions = generateDateOptions(race.raceDateISO, request.durationDays);
  const flightsByOption: Record<string, SectionLinks> = {};
  for (const dateOption of dateOptions) {
    const links = buildFlightsLinks(request, race, dateOption);
    flightsByOption[dateOption.key] = {
      title: "Flights",
      links,
      notes: getFlightNotesByBudget(request.budgetTier),
    };
  }
  const pricesMap = await getFlightPricesForOptions(request, race, dateOptions);
  for (const key of Object.keys(flightsByOption)) {
    const section = flightsByOption[key];
    const prices = pricesMap[key];
    if (prices?.fromApi && section.links) {
      if (section.links[0]) {
        section.links[0].fromPrice = String(prices.google);
        section.links[0].sampleFlight = prices.sampleFlights?.[0];
      }
      if (section.links[1]) {
        section.links[1].fromPrice = String(prices.skyscanner);
        section.links[1].sampleFlight = prices.sampleFlights?.[1];
      }
      if (section.links[2]) {
        section.links[2].fromPrice = String(prices.kayak);
        section.links[2].sampleFlight = prices.sampleFlights?.[2];
      }
    }
  }
  return flightsByOption;
}
