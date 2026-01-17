import { tripRequestSchema } from "@/domain/itinerary/schema";
import type { TripRequest, ItineraryResult } from "@/domain/itinerary/types";
import { buildItinerary } from "@/domain/itinerary/itineraryBuilder";
import { raceRepo } from "@/server/repositories/raceRepo";
import { itineraryRepo } from "@/server/repositories/itineraryRepo";

export type GenerateItineraryInput = {
  userId: string;
  request: TripRequest;
};

export type GenerateItineraryOutput = {
  itineraryId: string;
  result: ItineraryResult;
};

/**
 * Service for generating and persisting itineraries.
 * Validates input, fetches race data, builds itinerary, and saves to database.
 */
export async function generateAndSaveItinerary(
  input: GenerateItineraryInput
): Promise<GenerateItineraryOutput> {
  const { userId, request } = input;

  // 1. Validate incoming request with tripRequestSchema
  const validationResult = tripRequestSchema.safeParse(request);
  if (!validationResult.success) {
    throw new Error(`Invalid trip request: ${validationResult.error.message}`);
  }

  const validatedRequest = validationResult.data;

  // 2. Fetch race via getRaceById(2026, raceId); error if missing
  const race = raceRepo.getRaceById(2026, validatedRequest.raceId);
  if (!race) {
    throw new Error(`Race not found: ${validatedRequest.raceId}`);
  }

  // 3. Call buildItinerary(request, race)
  const result = buildItinerary(validatedRequest, race);

  // 4. Persist via createItinerary
  const itineraryId = await itineraryRepo.createItinerary(userId, validatedRequest, result);

  // 5. Return { itineraryId, result }
  return {
    itineraryId,
    result,
  };
}
