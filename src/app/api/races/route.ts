import { NextResponse } from "next/server";
import { raceRepo } from "@/server/repositories/raceRepo";

/**
 * GET /api/races
 * Returns list of races for the current season (2026).
 */
export async function GET() {
  const races = raceRepo.listRaces(2026);
  return NextResponse.json(races, { status: 200 });
}
