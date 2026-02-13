import { NextResponse } from "next/server";
import { raceRepo } from "@/server/repositories/raceRepo";
import { getFlightPricesForRequest } from "@/server/services/itineraryMerge";

/** Fixed sample request matching the sample itinerary page (Monaco GP, London, 5 days). */
const SAMPLE_REQUEST = {
  originCity: "London",
  raceId: "monaco-gp",
  durationDays: 5,
  budgetTier: "$$" as const,
};

/**
 * GET /api/flight-prices/sample
 * Returns flightsByOption for the fixed sample itinerary (no auth).
 * Used by the sample itinerary page so it can render immediately and fetch prices on the client.
 */
export async function GET() {
  try {
    const monacoRace = raceRepo.getRaceById(2026, "monaco-gp");
    if (!monacoRace) {
      return NextResponse.json({ error: "Sample not available" }, { status: 404 });
    }
    const flightsByOption = await getFlightPricesForRequest(SAMPLE_REQUEST, monacoRace);
    return NextResponse.json({ flightsByOption }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
