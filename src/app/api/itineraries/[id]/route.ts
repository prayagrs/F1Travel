import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/server/auth/session";
import { itineraryRepo } from "@/server/repositories/itineraryRepo";

/**
 * GET /api/itineraries/[id]
 * Fetches a single itinerary by ID for the authenticated user.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 1. Require session user id else 401
    const session = await getSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Get itinerary ID from params
    const { id } = await params;

    // 3. Fetch via repo getItineraryById
    const itinerary = await itineraryRepo.getItineraryById(session.user.id, id);

    // 4. 404 if missing
    if (!itinerary) {
      return NextResponse.json({ error: "Itinerary not found" }, { status: 404 });
    }

    // 5. Return record
    return NextResponse.json(itinerary, { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
