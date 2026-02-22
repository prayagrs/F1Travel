import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/server/auth/session";
import { itineraryRepo } from "@/server/repositories/itineraryRepo";
import { bookingRepo } from "@/server/repositories/bookingRepo";
import { validateBookingInput } from "@/domain/itinerary/bookingValidation";

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
    const provider = body?.provider ?? "";
    const confirmationRef = body?.confirmationRef ?? "";
    const detailsUrl = body?.detailsUrl ?? null;
    const notes = body?.notes ?? null;

    const validationError = validateBookingInput({
      type,
      provider,
      confirmationRef,
      detailsUrl,
      notes,
    });
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const providerTrim = provider.trim();
    const confirmationRefTrim = confirmationRef.trim();

    const booking = await bookingRepo.create(itineraryId, session.user.id, {
      type,
      provider: providerTrim,
      confirmationRef: confirmationRefTrim,
      detailsUrl: detailsUrl?.trim() || null,
      notes: notes?.trim() || null,
    });

    return NextResponse.json({ booking }, { status: 201 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
