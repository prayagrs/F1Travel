import fs from "fs";
import path from "path";
import type { RaceWeekend } from "@/domain/races/types";
import races2026 from "@/content/races/2026.json";

const RACES_2026_PATH = path.join(process.cwd(), "src/content/races/2026.json");

/**
 * Reads 2026 races from the filesystem so itinerary merge always gets fresh data (e.g. ticketOptions).
 * Falls back to the bundled import if the file cannot be read (e.g. in some serverless environments).
 */
function getRaces2026Fresh(): RaceWeekend[] {
  try {
    const raw = fs.readFileSync(RACES_2026_PATH, "utf-8");
    const data = JSON.parse(raw) as RaceWeekend[];
    return Array.isArray(data) ? data : (races2026 as RaceWeekend[]);
  } catch {
    return races2026 as RaceWeekend[];
  }
}

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
      return races2026 as RaceWeekend[];
    }
    return [];
  }

  /**
   * Gets a single race by ID for a given year.
   * For 2026, reads from the filesystem so existing itineraries always see current data (e.g. ticketOptions).
   * @param year - The season year (e.g., 2026)
   * @param raceId - The race ID (e.g., "british-gp")
   * @returns The race if found, null otherwise
   */
  getRaceById(year: number, raceId: string): RaceWeekend | null {
    if (year === 2026) {
      const races = getRaces2026Fresh();
      return races.find((race) => race.id === raceId) ?? null;
    }
    const races = this.listRaces(year);
    return races.find((race) => race.id === raceId) ?? null;
  }
}

// Export a singleton instance for convenience
export const raceRepo = new RaceRepository();
