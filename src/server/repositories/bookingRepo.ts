import { prisma } from "@/server/db/prisma";
import type { ItineraryBookingRecord, CreateBookingInput } from "@/domain/itinerary/types";

function rowToRecord(row: {
  id: string;
  itineraryId: string;
  userId: string;
  type: string;
  provider: string;
  confirmationRef: string;
  detailsUrl: string | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}): ItineraryBookingRecord {
  return {
    id: row.id,
    itineraryId: row.itineraryId,
    userId: row.userId,
    type: row.type as ItineraryBookingRecord["type"],
    provider: row.provider,
    confirmationRef: row.confirmationRef,
    detailsUrl: row.detailsUrl,
    notes: row.notes,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export type BookingWithItinerarySummary = ItineraryBookingRecord & {
  itinerary: {
    id: string;
    raceId: string;
    originCity: string;
    durationDays: number;
    raceDateISO: string | null;
    country: string | null;
  };
};

/**
 * Repository for itinerary booking records (user-added confirmation details).
 */
export class BookingRepository {
  async create(
    itineraryId: string,
    userId: string,
    input: CreateBookingInput
  ): Promise<ItineraryBookingRecord> {
    const row = await prisma.itineraryBooking.create({
      data: {
        itineraryId,
        userId,
        type: input.type,
        provider: input.provider,
        confirmationRef: input.confirmationRef,
        detailsUrl: input.detailsUrl ?? null,
        notes: input.notes ?? null,
      },
    });
    return rowToRecord(row);
  }

  async listByItinerary(itineraryId: string): Promise<ItineraryBookingRecord[]> {
    const rows = await prisma.itineraryBooking.findMany({
      where: { itineraryId },
      orderBy: { createdAt: "asc" },
    });
    return rows.map(rowToRecord);
  }

  async listByUser(userId: string): Promise<BookingWithItinerarySummary[]> {
    const rows = await prisma.itineraryBooking.findMany({
      where: { userId },
      include: {
        itinerary: {
          select: {
            id: true,
            raceId: true,
            originCity: true,
            durationDays: true,
            resultJson: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return rows.map((row) => {
      const result = row.itinerary.resultJson as { race?: { raceDateISO?: string; country?: string } } | null;
      return {
        ...rowToRecord(row),
        itinerary: {
          id: row.itinerary.id,
          raceId: row.itinerary.raceId,
          originCity: row.itinerary.originCity,
          durationDays: row.itinerary.durationDays,
          raceDateISO: result?.race?.raceDateISO ?? null,
          country: result?.race?.country ?? null,
        },
      };
    });
  }

  async getById(bookingId: string): Promise<ItineraryBookingRecord | null> {
    const row = await prisma.itineraryBooking.findUnique({
      where: { id: bookingId },
    });
    return row ? rowToRecord(row) : null;
  }

  async update(
    bookingId: string,
    userId: string,
    input: Partial<Pick<CreateBookingInput, "provider" | "confirmationRef" | "detailsUrl" | "notes">>
  ): Promise<ItineraryBookingRecord | null> {
    const existing = await prisma.itineraryBooking.findFirst({
      where: { id: bookingId, userId },
    });
    if (!existing) return null;
    const row = await prisma.itineraryBooking.update({
      where: { id: bookingId },
      data: {
        ...(input.provider !== undefined && { provider: input.provider }),
        ...(input.confirmationRef !== undefined && { confirmationRef: input.confirmationRef }),
        ...(input.detailsUrl !== undefined && { detailsUrl: input.detailsUrl }),
        ...(input.notes !== undefined && { notes: input.notes }),
      },
    });
    return rowToRecord(row);
  }

  async delete(bookingId: string, userId: string): Promise<boolean> {
    const result = await prisma.itineraryBooking.deleteMany({
      where: { id: bookingId, userId },
    });
    return result.count > 0;
  }
}

export const bookingRepo = new BookingRepository();
