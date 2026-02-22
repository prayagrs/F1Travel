"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef, useState, useCallback, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import type { RaceWeekend } from "@/domain/races/types";
import { getCircuitPath } from "./circuitPaths";
import { getCircuitSVGConfig } from "./circuitSVGLoader";
import { getCircuitSvgPath } from "./circuitSvgFiles";

type CircuitIconProps = {
  race: RaceWeekend;
  isNextRace?: boolean;
};

/**
 * Circuit icon: uses SVG file from public/circuit-svg when available,
 * else inline path. Tooltip shows Grand Prix name on hover (state-driven, portal).
 */
export function CircuitIcon({ race, isNextRace = false }: CircuitIconProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const iconRef = useRef<HTMLDivElement>(null);

  const svgFileUrl = getCircuitSvgPath(race.id);
  const svgConfig = getCircuitSVGConfig(race.id);
  const circuitPath = getCircuitPath(race.id);
  const viewBox = svgConfig?.viewBox || "0 0 32 32";
  const strokeWidth = svgConfig?.strokeWidth || "1.5";

  const updateTooltipPos = useCallback(() => {
    const el = iconRef.current;
    if (el) {
      const rect = el.getBoundingClientRect();
      setTooltipPos({
        x: rect.left + rect.width / 2,
        y: rect.top,
      });
    }
  }, []);

  const handleMouseEnter = useCallback(() => {
    setShowTooltip(true);
    updateTooltipPos();
  }, [updateTooltipPos]);

  const handleMouseLeave = useCallback(() => {
    setShowTooltip(false);
  }, []);

  useLayoutEffect(() => {
    if (showTooltip) updateTooltipPos();
  }, [showTooltip, updateTooltipPos]);

  const tooltipEl =
    typeof document !== "undefined" && showTooltip
      ? createPortal(
          <div
            className="pointer-events-none fixed z-[9999] -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-md border border-red-500/30 bg-gray-900 px-3 py-2 text-sm font-semibold text-white shadow-xl shadow-black/50 ring-1 ring-gray-700"
            style={{ left: tooltipPos.x, top: tooltipPos.y - 8 }}
            role="tooltip"
            id={`circuit-tooltip-${race.id}`}
          >
            <span>{race.name}</span>
            <div
              className="absolute left-1/2 top-full -translate-x-1/2 border-[6px] border-transparent border-t-gray-900"
              aria-hidden
            />
          </div>,
          document.body
        )
      : null;

  return (
    <>
      <div
        ref={iconRef}
        className="relative inline-block group"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Link
          href={`/trip?race=${race.id}`}
          className="flex items-center justify-center transition-all duration-200 hover:scale-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 focus-visible:ring-2 focus-visible:ring-red-500 touch-manipulation"
          aria-label={`Plan trip to ${race.name} at ${race.circuit}`}
        >
          <div className={`relative ${isNextRace ? "animate-pulse" : ""}`}>
            {svgFileUrl ? (
              <Image
                src={svgFileUrl}
                alt=""
                width={32}
                height={32}
                className="h-8 w-8 object-contain opacity-70 transition-opacity group-hover:opacity-100 [filter:invert(1)_brightness(0.9)] group-hover:[filter:invert(0.4)_sepia(1)_saturate(5)_hue-rotate(320deg)]"
                aria-hidden
              />
            ) : (
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
                  className={isNextRace ? "text-red-500" : "text-gray-400 group-hover:text-red-400"}
                />
              </svg>
            )}
            {isNextRace && (
              <div className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-red-600" aria-hidden />
            )}
          </div>
        </Link>
      </div>
      {tooltipEl}
    </>
  );
}
