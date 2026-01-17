import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/server/auth/session";
import { generateAndSaveItinerary } from "@/server/services/generateItinerary";
import type { TripRequest } from "@/domain/itinerary/types";

/**
 * POST /api/itineraries/generate
 * Generates and saves a new itinerary for the authenticated user.
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Require session user id else 401
    const session = await getSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Parse req.json
    const body = await request.json();
    const tripRequest = body as TripRequest;

    // 3. Call generateAndSaveItinerary service
    const result = await generateAndSaveItinerary({
      userId: session.user.id,
      request: tripRequest,
    });

    // 4. Return JSON { itineraryId, result }
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    // Return 400 for validation or business logic errors
    const errorMessage = error instanceof Error ? error.message : "Bad request";
    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }
}
