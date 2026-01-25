"use client";

import Link from "next/link";
import { useState } from "react";

/**
 * Interactive preview strip component for the home page.
 * Shows sample itinerary preview with interactive date pills.
 */
export function PreviewStrip() {
  const [hoveredOption, setHoveredOption] = useState<string | null>(null);

  const dateOptions = [
    { key: "A", dateRange: "Jun 3-9", flights: "Direct flights from London", hotels: "Harbor views, walking distance", tickets: "Grandstand & general admission" },
    { key: "B", dateRange: "Jun 4-10", flights: "Multiple flight options", hotels: "Luxury & mid-range options", tickets: "Premium grandstand seats" },
    { key: "C", dateRange: "Jun 5-11", flights: "Early arrival options", hotels: "Extended stay packages", tickets: "VIP hospitality access" },
  ];

  const activeOption = hoveredOption || "A";
  const activeData = dateOptions.find(opt => opt.key === activeOption) || dateOptions[0];

  return (
    <div className="relative order-2 lg:order-none" role="complementary" aria-label="Sample itinerary preview">
      <Link
        href="/sample-itinerary"
        className="group block rounded-lg border border-gray-800/50 bg-gradient-to-br from-gray-900/50 via-gray-900/30 to-gray-900/20 p-4 sm:p-5 lg:p-6 backdrop-blur-sm transition-all duration-200 hover:border-red-600/60 hover:shadow-xl hover:shadow-red-600/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 focus-visible:ring-2 focus-visible:ring-red-500 relative overflow-hidden speed-lines"
        aria-label="Click to view full sample itinerary"
      >
        {/* Enhanced circuit background illustration with F1 pulse */}
        <div className="absolute top-4 right-4 opacity-15 group-hover:opacity-25 transition-opacity animate-f1-pulse" aria-hidden="true">
          <svg width="80" height="80" viewBox="0 0 32 32" fill="none" className="text-red-600">
            <path
              d="M8 24 L8 18 Q8 14 12 14 Q16 14 20 16 Q24 18 26 18 L26 8 Q26 6 24 6 L18 6 L18 10 L14 10 L14 6 L8 6 Q6 6 6 8 L6 14 Q6 16 8 16 Q10 16 12 18 Q14 20 16 20 Q18 20 20 18 Q22 16 24 16 Q26 16 26 18 L26 22 Q26 24 24 24 L18 24 Q16 24 16 22 Q16 20 14 20 Q12 20 10 22 Q8 24 8 22 Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
        </div>

        {/* Preview label with F1 badge */}
        <div className="mb-3 sm:mb-4 flex items-center gap-2 relative z-10">
          <span className="text-[10px] sm:text-xs font-medium uppercase tracking-wider text-gray-400">
            Preview Your Weekend
          </span>
          <span className="inline-flex items-center gap-1 rounded-full border border-red-600/30 bg-red-600/10 px-1.5 py-0.5 text-[9px] font-semibold text-red-400">
            <span className="h-1 w-1 rounded-full bg-red-600 animate-pulse" aria-hidden="true" />
            F1 Weekend
          </span>
        </div>
        
        {/* Race name with enhanced typography */}
        <div className="mb-3 sm:mb-4 relative z-10">
          <h3 className="text-sm sm:text-base font-bold text-white mb-1">Monaco Grand Prix</h3>
          <p className="text-[10px] sm:text-xs text-gray-400 mb-1">Circuit de Monaco • Monte Carlo</p>
          <p className="text-[10px] sm:text-xs font-medium text-red-400">Jun 7, 2026 • Iconic Street Circuit</p>
        </div>
        
        {/* Date option pills - interactive with hover states */}
        <div className="mb-4 sm:mb-5 flex gap-1.5 sm:gap-2 relative z-10">
          {dateOptions.map((option) => {
            const isActive = option.key === activeOption;
            return (
              <div
                key={option.key}
                onMouseEnter={() => setHoveredOption(option.key)}
                onMouseLeave={() => setHoveredOption(null)}
                className={`rounded-md border-2 px-3 sm:px-3.5 py-1.5 sm:py-2 text-[11px] sm:text-xs font-bold transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "animate-subtle-pulse border-red-600/40 bg-red-600/15 text-red-400 shadow-md shadow-red-600/30"
                    : "border-gray-700/50 bg-gray-800/40 text-gray-500 hover:border-gray-600 hover:bg-gray-800/60 hover:text-gray-400"
                }`}
              >
                <span className="block leading-tight">{option.key}</span>
                <span className={`text-[9px] sm:text-[10px] font-medium ${
                  isActive ? "text-red-500/80" : "text-gray-600"
                }`}>
                  {option.dateRange}
                </span>
              </div>
            );
          })}
        </div>
        
        {/* Value statements - update based on hovered option */}
        <div className="space-y-3 border-t border-gray-800/50 pt-4 relative z-10">
          <div className="flex items-start gap-2.5">
            <svg className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
            <div className="flex-1">
              <p className="text-xs font-medium text-white">{activeData.flights}</p>
              <p className="text-[10px] text-gray-500 mt-0.5">Multiple airlines, best prices</p>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <svg className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <div className="flex-1">
              <p className="text-xs font-medium text-white">{activeData.hotels}</p>
              <p className="text-[10px] text-gray-500 mt-0.5">Hotels near Circuit de Monaco</p>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <svg className="h-4 w-4 text-red-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
            </svg>
            <div className="flex-1">
              <p className="text-xs font-medium text-white">{activeData.tickets}</p>
              <p className="text-[10px] text-gray-500 mt-0.5">Official F1 race tickets</p>
            </div>
          </div>
        </div>
        
        {/* Enhanced click indicator */}
        <div className="mt-4 flex items-center justify-center gap-2 border-t border-gray-800/50 pt-4 text-xs font-medium text-gray-400 transition-colors group-hover:text-red-400 relative z-10">
          <span>View complete weekend itinerary</span>
          <svg className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </Link>
    </div>
  );
}
