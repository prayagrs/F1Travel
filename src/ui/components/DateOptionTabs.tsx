"use client";

import { useState } from "react";
import type { DateOption } from "@/domain/itinerary/types";

type DateOptionTabsProps = {
  options: DateOption[];
  selectedKey: string;
  onSelect: (key: string) => void;
};

/**
 * Tabs component for date options (A/B/C).
 */
export function DateOptionTabs({
  options,
  selectedKey,
  onSelect,
}: DateOptionTabsProps) {
  return (
    <div className="border-b border-gray-200 dark:border-gray-700">
      <nav className="-mb-px flex space-x-8">
        {options.map((option) => (
          <button
            key={option.key}
            onClick={() => onSelect(option.key)}
            className={`whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium transition-colors ${
              selectedKey === option.key
                ? "border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400"
                : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:border-gray-600 dark:hover:text-gray-300"
            }`}
          >
            Option {option.key}
            <span className="ml-2 text-xs text-gray-400 dark:text-gray-500">
              {option.label}
            </span>
          </button>
        ))}
      </nav>
    </div>
  );
}
