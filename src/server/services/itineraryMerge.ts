import { raceRepo } from "@/server/repositories/raceRepo";
import type { ItineraryRecord } from "@/server/repositories/itineraryRepo";
import {
  buildTicketsSection,
  buildFlightsLinks,
  getFlightNotesByBudget,
} from "@/domain/itinerary/linkBuilders";
import { generateDateOptions } from "@/domain/itinerary/dateOptions";
import type { ItineraryResult, SectionLinks } from "@/domain/itinerary/types";

/**
 * Builds the merged itinerary result (live tickets + flight links) from a stored record.
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
      flightsByOption[dateOption.key] = {
        title: "Flights",
        links: buildFlightsLinks(stored.request, raceForFlights, normalizedOption),
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
      flightsByOption[dateOption.key] = {
        title: "Flights",
        links: buildFlightsLinks(stored.request, raceForFlights, dateOption),
        notes: getFlightNotesByBudget(stored.request.budgetTier),
      };
    }
  } else {
    Object.assign(flightsByOption, stored.flightsByOption ?? {});
  }

  return { ...stored, tickets, flightsByOption };
}
