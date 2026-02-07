import type { TripRequest, ItineraryResult } from "./types";
import type { RaceWeekend } from "../races/types";
import { generateDateOptions } from "./dateOptions";
import {
  buildFlightsLinks,
  buildStaysLinks,
  buildTicketsSection,
  buildExperiencesLinks,
  getNeighborhoodTipsByBudget,
  getFlightNotesByBudget,
} from "./linkBuilders";

/**
 * Pure function that builds a complete itinerary result from a trip request and race weekend.
 * This function is deterministic and has no side effects.
 */
export function buildItinerary(
  request: TripRequest,
  race: RaceWeekend
): ItineraryResult {
  // Generate date options
  const dateOptions = generateDateOptions(race.raceDateISO, request.durationDays);

  // Build flights and stays for each date option
  const flightsByOption: Record<string, { title: string; links: Array<{ label: string; href: string }>; notes?: string[] }> = {};
  const staysByOption: Record<string, { title: string; links: Array<{ label: string; href: string }>; notes?: string[] }> = {};

  for (const dateOption of dateOptions) {
    // Flights section
    const flightLinks = buildFlightsLinks(request, race, dateOption);
    flightsByOption[dateOption.key] = {
      title: "Flights",
      links: flightLinks,
      notes: getFlightNotesByBudget(request.budgetTier),
    };

    // Stays section
    const stayLinks = buildStaysLinks(race, dateOption);
    staysByOption[dateOption.key] = {
      title: "Accommodation",
      links: stayLinks,
      notes: getNeighborhoodTipsByBudget(request.budgetTier),
    };
  }

  // Build tickets section (constant, not per date option)
  const tickets = buildTicketsSection(race);

  // Build experiences section (constant, not per date option)
  const experienceLinks = buildExperiencesLinks(race);
  const experiences = {
    title: "Experiences & Activities",
    links: experienceLinks,
  };

  return {
    request,
    race,
    dateOptions,
    flightsByOption,
    staysByOption,
    tickets,
    experiences,
  };
}
