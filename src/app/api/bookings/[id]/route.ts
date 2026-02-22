import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/server/auth/session";
import { bookingRepo } from "@/server/repositories/bookingRepo";

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
    const body = await request.json();
    const update: {
      provider?: string;
      confirmationRef?: string;
      detailsUrl?: string | null;
      notes?: string | null;
    } = {};
    if (body?.provider !== undefined) update.provider = String(body.provider).trim();
    if (body?.confirmationRef !== undefined) update.confirmationRef = String(body.confirmationRef).trim();
    if (body?.detailsUrl !== undefined) update.detailsUrl = body.detailsUrl === "" ? null : body.detailsUrl;
    if (body?.notes !== undefined) update.notes = body.notes === "" ? null : body.notes;

    const booking = await bookingRepo.update(id, session.user.id, update);
    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }
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
