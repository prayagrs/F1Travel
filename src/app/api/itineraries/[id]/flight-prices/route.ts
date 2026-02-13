import { NextResponse } from "next/server";
import { getSession } from "@/server/auth/session";
import { itineraryRepo } from "@/server/repositories/itineraryRepo";
import { getFlightPricesForItinerary } from "@/server/services/itineraryMerge";

/**
 * GET /api/itineraries/[id]/flight-prices
 * Returns flight sections with "from" prices (Amadeus when configured) for all date options.
 * Client fetches this after GET /result so the page can render fast and prices fill in when ready.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const itinerary = await itineraryRepo.getItineraryById(session.user.id, id);

    if (!itinerary) {
      return NextResponse.json({ error: "Itinerary not found" }, { status: 404 });
    }

    const flightsByOption = await getFlightPricesForItinerary(itinerary);
    return NextResponse.json({ flightsByOption }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
