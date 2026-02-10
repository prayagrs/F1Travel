import type { ItineraryResult } from "@/domain/itinerary/types";

const cache = new Map<string, ItineraryResult>();

/**
 * Client-side cache for itinerary result from generate call.
 * Used so the itinerary page can show the result immediately after navigation without a refetch.
 */
export function getCachedResult(id: string): ItineraryResult | undefined {
  return cache.get(id);
}

/**
 * Store result for the given itinerary id (e.g. after POST /api/itineraries/generate).
 */
export function setCachedResult(id: string, result: ItineraryResult): void {
  cache.set(id, result);
}

/**
 * Remove cached result (e.g. after viewing merged data so we don't show stale data on revisit).
 */
export function clearCachedResult(id: string): void {
  cache.delete(id);
}
