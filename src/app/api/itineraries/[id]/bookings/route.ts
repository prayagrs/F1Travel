import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/server/auth/session";
import { itineraryRepo } from "@/server/repositories/itineraryRepo";
import { bookingRepo } from "@/server/repositories/bookingRepo";
import { BOOKING_TYPES } from "@/domain/itinerary/types";

/**
 * GET /api/itineraries/[id]/bookings
 * Lists bookings for an itinerary. User must own the itinerary.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: itineraryId } = await params;
    const itinerary = await itineraryRepo.getItineraryById(session.user.id, itineraryId);
    if (!itinerary) {
      return NextResponse.json({ error: "Itinerary not found" }, { status: 404 });
    }

    const bookings = await bookingRepo.listByItinerary(itineraryId);
    return NextResponse.json({ bookings }, { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

/**
 * POST /api/itineraries/[id]/bookings
 * Adds a booking to an itinerary. User must own the itinerary.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: itineraryId } = await params;
    const itinerary = await itineraryRepo.getItineraryById(session.user.id, itineraryId);
    if (!itinerary) {
      return NextResponse.json({ error: "Itinerary not found" }, { status: 404 });
    }

    const body = await request.json();
    const type = body?.type;
    const provider = body?.provider?.trim?.();
    const confirmationRef = body?.confirmationRef?.trim?.();

    if (!type || !BOOKING_TYPES.includes(type)) {
      return NextResponse.json(
        { error: "Invalid type; must be one of: flight, stay, ticket, activity" },
        { status: 400 }
      );
    }
    if (!provider || provider.length === 0) {
      return NextResponse.json({ error: "provider is required" }, { status: 400 });
    }
    if (!confirmationRef || confirmationRef.length === 0) {
      return NextResponse.json({ error: "confirmationRef is required" }, { status: 400 });
    }

    const booking = await bookingRepo.create(itineraryId, session.user.id, {
      type,
      provider,
      confirmationRef,
      detailsUrl: body.detailsUrl ?? null,
      notes: body.notes ?? null,
    });

    return NextResponse.json({ booking }, { status: 201 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
