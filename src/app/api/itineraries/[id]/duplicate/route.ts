import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/server/auth/session";
import { itineraryRepo } from "@/server/repositories/itineraryRepo";

/**
 * POST /api/itineraries/[id]/duplicate
 * Creates a copy of an itinerary for the authenticated user.
 * Returns { id } for the new itinerary.
 */
export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const newId = await itineraryRepo.duplicateItinerary(session.user.id, id);

    if (!newId) {
      return NextResponse.json({ error: "Itinerary not found" }, { status: 404 });
    }

    return NextResponse.json({ id: newId }, { status: 201 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
