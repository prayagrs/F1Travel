import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/server/auth/session";
import { bookingRepo } from "@/server/repositories/bookingRepo";
import { validateBookingInput } from "@/domain/itinerary/bookingValidation";

/**
 * PATCH /api/bookings/[id]
 * Updates a booking. User must own the booking.
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const existing = await bookingRepo.getById(id);
    if (!existing || existing.userId !== session.user.id) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    const body = await request.json();
    const provider = body?.provider !== undefined ? String(body.provider) : existing.provider;
    const confirmationRef = body?.confirmationRef !== undefined ? String(body.confirmationRef) : existing.confirmationRef;
    const detailsUrl = body?.detailsUrl !== undefined ? body.detailsUrl : existing.detailsUrl;
    const notes = body?.notes !== undefined ? body.notes : existing.notes;

    const validationError = validateBookingInput({
      type: existing.type,
      provider,
      confirmationRef,
      detailsUrl: detailsUrl ?? null,
      notes: notes ?? null,
    });
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const update = {
      provider: provider.trim(),
      confirmationRef: confirmationRef.trim(),
      detailsUrl: detailsUrl === "" ? null : (detailsUrl?.trim() || null),
      notes: notes === "" ? null : (notes?.trim() || null),
    };
    const booking = await bookingRepo.update(id, session.user.id, update);
    return NextResponse.json({ booking }, { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

/**
 * DELETE /api/bookings/[id]
 * Deletes a booking. User must own the booking.
 */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const deleted = await bookingRepo.delete(id, session.user.id);
    if (!deleted) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
