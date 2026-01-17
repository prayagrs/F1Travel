import type { RaceWeekend } from "@/domain/races/types";
import races2026 from "@/content/races/2026.json";

/**
 * Race repository for accessing race calendar data.
 * This is the ONLY place in the application that should read race data.
 * 
 * Future-proofing: This interface remains stable so that V2 can replace
 * JSON with DB or external API without requiring changes in domain logic or UI.
 */
export class RaceRepository {
  /**
   * Lists all races for a given year.
   * @param year - The season year (e.g., 2026)
   * @returns Array of races sorted by raceDateISO ascending, or empty array if year not supported
   */
  listRaces(year: number): RaceWeekend[] {
    if (year === 2026) {
      // Type assertion needed because JSON import doesn't preserve types
      return races2026 as RaceWeekend[];
    }
    return [];
  }

  /**
   * Gets a single race by ID for a given year.
   * @param year - The season year (e.g., 2026)
   * @param raceId - The race ID (e.g., "british-gp")
   * @returns The race if found, null otherwise
   */
  getRaceById(year: number, raceId: string): RaceWeekend | null {
    const races = this.listRaces(year);
    return races.find((race) => race.id === raceId) || null;
  }
}

// Export a singleton instance for convenience
export const raceRepo = new RaceRepository();
