"use client";

import { useState } from "react";
import type { ItineraryResult } from "@/domain/itinerary/types";
import { Card } from "@/ui/components/Card";
import { Section } from "@/ui/components/Section";
import { DateOptionTabs } from "@/ui/components/DateOptionTabs";

type ItineraryViewProps = {
  result: ItineraryResult;
};

/**
 * Presentational component that renders an ItineraryResult.
 * Renders deep links as external anchors.
 */
export function ItineraryView({ result }: ItineraryViewProps) {
  const [selectedOption, setSelectedOption] = useState(result.dateOptions[0]?.key || "");

  const selectedFlights = result.flightsByOption[selectedOption];
  const selectedStays = result.staysByOption[selectedOption];

  return (
    <div className="space-y-8">
      {/* Disclaimers */}
      <Card className="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
        <p className="text-sm text-amber-800 dark:text-amber-300">
          <strong>Disclaimer:</strong> All links open external websites. Prices and availability
          may change. Please verify all information with providers before booking.
        </p>
      </Card>

      {/* Race Info Header */}
      <Card>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          {result.race.name}
        </h1>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
          {result.race.circuit}, {result.race.city}, {result.race.country}
        </p>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-500">
          Race Date: {result.race.raceDateISO} | From: {result.request.originCity} | 
          Duration: {result.request.durationDays} days | Budget: {result.request.budgetTier}
        </p>
      </Card>

      {/* Date Options Tabs */}
      <Card>
        <DateOptionTabs
          options={result.dateOptions}
          selectedKey={selectedOption}
          onSelect={setSelectedOption}
        />
      </Card>

      {/* Flights Section */}
      {selectedFlights && (
        <Section title={selectedFlights.title}>
          <Card>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-3">
                {selectedFlights.links.map((link, index) => (
                  <a
                    key={index}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
              {selectedFlights.notes && selectedFlights.notes.length > 0 && (
                <ul className="mt-4 space-y-1 text-sm text-gray-600 dark:text-gray-400">
                  {selectedFlights.notes.map((note, index) => (
                    <li key={index}>• {note}</li>
                  ))}
                </ul>
              )}
            </div>
          </Card>
        </Section>
      )}

      {/* Stays Section */}
      {selectedStays && (
        <Section title={selectedStays.title}>
          <Card>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-3">
                {selectedStays.links.map((link, index) => (
                  <a
                    key={index}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
              {selectedStays.notes && selectedStays.notes.length > 0 && (
                <ul className="mt-4 space-y-1 text-sm text-gray-600 dark:text-gray-400">
                  {selectedStays.notes.map((note, index) => (
                    <li key={index}>• {note}</li>
                  ))}
                </ul>
              )}
            </div>
          </Card>
        </Section>
      )}

      {/* Tickets Section */}
      <Section title={result.tickets.title}>
        <Card>
          <div className="flex flex-wrap gap-3">
            {result.tickets.links.map((link, index) => (
              <a
                key={index}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
              >
                {link.label}
              </a>
            ))}
          </div>
        </Card>
      </Section>

      {/* Experiences Section */}
      <Section title={result.experiences.title}>
        <Card>
          <div className="flex flex-wrap gap-3">
            {result.experiences.links.map((link, index) => (
              <a
                key={index}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center rounded-md bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
              >
                {link.label}
              </a>
            ))}
          </div>
        </Card>
      </Section>
    </div>
  );
}
