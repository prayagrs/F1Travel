import { prisma } from "@/server/db/prisma";
import type { Prisma } from "@prisma/client";
import type { TripRequest, ItineraryResult } from "@/domain/itinerary/types";

export type ItineraryRecord = {
  id: string;
  userId: string;
  originCity: string;
  raceId: string;
  durationDays: number;
  budgetTier: string;
  resultJson: ItineraryResult;
  createdAt: Date;
  updatedAt: Date;
};

export type ItinerarySummary = {
  id: string;
  originCity: string;
  raceId: string;
  raceDateISO: string | null;
  country: string | null;
  durationDays: number;
  budgetTier: string;
  createdAt: Date;
};

/**
 * Repository for itinerary data access.
 * Handles all database operations for itineraries.
 */
export class ItineraryRepository {
  /**
   * Creates a new itinerary record.
   * @param userId - The user ID who owns this itinerary
   * @param request - The trip request data
   * @param result - The generated itinerary result
   * @returns The created itinerary ID
   */
  async createItinerary(
    userId: string,
    request: TripRequest,
    result: ItineraryResult
  ): Promise<string> {
    const itinerary = await prisma.itinerary.create({
      data: {
        userId,
        originCity: request.originCity,
        raceId: request.raceId,
        durationDays: request.durationDays,
        budgetTier: request.budgetTier,
        resultJson: result as unknown as Prisma.InputJsonValue,
      },
    });

    return itinerary.id;
  }

  /**
   * Gets a single itinerary by ID for a specific user.
   * @param userId - The user ID who owns the itinerary
   * @param id - The itinerary ID
   * @returns The itinerary record with full resultJson, or null if not found
   */
  async getItineraryById(userId: string, id: string): Promise<ItineraryRecord | null> {
    const itinerary = await prisma.itinerary.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!itinerary) {
      return null;
    }

    return {
      id: itinerary.id,
      userId: itinerary.userId,
      originCity: itinerary.originCity,
      raceId: itinerary.raceId,
      durationDays: itinerary.durationDays,
      budgetTier: itinerary.budgetTier,
      resultJson: itinerary.resultJson as ItineraryResult,
      createdAt: itinerary.createdAt,
      updatedAt: itinerary.updatedAt,
    };
  }

  /**
   * Lists all itineraries for a user (summaries only).
   * @param userId - The user ID
   * @returns Array of itinerary summaries sorted by createdAt descending (newest first)
   */
  async listUserItineraries(userId: string): Promise<ItinerarySummary[]> {
    const itineraries = await prisma.itinerary.findMany({
      where: {
        userId,
      },
      select: {
        id: true,
        originCity: true,
        raceId: true,
        durationDays: true,
        budgetTier: true,
        createdAt: true,
        resultJson: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return itineraries.map((row) => {
      const result = row.resultJson as ItineraryResult | null;
      const raceDateISO = result?.race?.raceDateISO ?? null;
      const country = result?.race?.country ?? null;
      return {
        id: row.id,
        originCity: row.originCity,
        raceId: row.raceId,
        raceDateISO,
        country,
        durationDays: row.durationDays,
        budgetTier: row.budgetTier,
        createdAt: row.createdAt,
      };
    });
  }

  /**
   * Deletes an itinerary if the user owns it.
   * @returns true if deleted, false if not found or not owned
   */
  async deleteItinerary(userId: string, id: string): Promise<boolean> {
    const result = await prisma.itinerary.deleteMany({
      where: { id, userId },
    });
    return result.count > 0;
  }

  /**
   * Duplicates an itinerary for the user. Creates a new record with the same
   * content but a new ID and timestamp.
   * @returns The new itinerary ID, or null if source not found
   */
  async duplicateItinerary(userId: string, id: string): Promise<string | null> {
    const existing = await this.getItineraryById(userId, id);
    if (!existing) return null;

    const newId = await this.createItinerary(
      userId,
      {
        originCity: existing.originCity,
        raceId: existing.raceId,
        durationDays: existing.durationDays,
        budgetTier: existing.budgetTier as TripRequest["budgetTier"],
      },
      existing.resultJson
    );
    return newId;
  }
}

// Export a singleton instance for convenience
export const itineraryRepo = new ItineraryRepository();
