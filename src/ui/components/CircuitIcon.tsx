"use client";

import Link from "next/link";
import type { RaceWeekend } from "@/domain/races/types";
import { CircuitTooltip } from "./CircuitTooltip";
import { getCircuitPath } from "./circuitPaths";
import { getCircuitSVGConfig, hasExternalSVG } from "./circuitSVGLoader";

type CircuitIconProps = {
  race: RaceWeekend;
  isNextRace?: boolean;
};

/**
 * Circuit icon component - displays actual F1 circuit SVG paths.
 * Supports both external SVG files (via circuitSVGLoader) and inline paths.
 * 
 * To add a new circuit SVG:
 * 1. Place SVG file in public/circuit-svg/
 * 2. Extract the path data from the SVG file
 * 3. Add entry to circuitSVGConfig in circuitSVGLoader.ts with filePath and viewBox
 * 4. The component will automatically use the external SVG
 * 
 * Clickable to navigate to trip planning for that race.
 * Shows tooltip on hover with Grand Prix name only.
 */
export function CircuitIcon({ race, isNextRace = false }: CircuitIconProps) {
  // Check if this circuit has an external SVG file configuration
  const svgConfig = getCircuitSVGConfig(race.id);
  const usesExternalSVG = hasExternalSVG(race.id);
  
  // Get path data (used for inline paths or as fallback)
  const circuitPath = getCircuitPath(race.id);
  
  // Determine viewBox and stroke width based on SVG type
  const viewBox = svgConfig?.viewBox || "0 0 32 32";
  const strokeWidth = svgConfig?.strokeWidth || "1.5";

  return (
    <div className="relative inline-block group">
      <Link
        href={`/trip?race=${race.id}`}
        className="flex items-center justify-center transition-all duration-200 hover:scale-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 focus-visible:ring-2 focus-visible:ring-red-500 touch-manipulation"
        aria-label={`Plan trip to ${race.name} at ${race.circuit}`}
      >
        {/* Actual Circuit SVG Icon */}
        <div className={`relative ${isNextRace ? "animate-pulse" : ""}`}>
          <svg
            width="32"
            height="32"
            viewBox={viewBox}
            fill="none"
            className="transition-all duration-200"
            aria-hidden="true"
          >
            <path
              d={circuitPath}
              stroke="currentColor"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              // Improved contrast: lighter gray for better visibility on dark footer
              className={isNextRace ? "text-red-500" : "text-gray-400 group-hover:text-red-400"}
            />
          </svg>
          {isNextRace && (
            <div className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-red-600" aria-hidden="true" />
          )}
        </div>
      </Link>
      
      {/* Tooltip - shows only Grand Prix name on hover */}
      <CircuitTooltip raceName={race.name} />
    </div>
  );
}
