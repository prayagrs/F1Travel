import { NextResponse } from "next/server";
import { getSession } from "@/server/auth/session";
import { itineraryRepo } from "@/server/repositories/itineraryRepo";
import { getMergedItineraryResult } from "@/server/services/itineraryMerge";

/**
 * GET /api/itineraries/[id]/result
 * Returns the merged itinerary result (live tickets + flight links) for the authenticated user.
 * Used by the itinerary page client when loading data (cache miss or direct link).
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

    const result = getMergedItineraryResult(itinerary);
    return NextResponse.json({ result }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
