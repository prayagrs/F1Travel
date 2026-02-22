import { NextResponse } from "next/server";
import { getSession } from "@/server/auth/session";
import { bookingRepo } from "@/server/repositories/bookingRepo";

/**
 * GET /api/bookings
 * Lists all bookings for the authenticated user (for My Bookings page).
 */
export async function GET() {
  try {
    const session = await getSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const bookings = await bookingRepo.listByUser(session.user.id);
    return NextResponse.json({ bookings }, { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
