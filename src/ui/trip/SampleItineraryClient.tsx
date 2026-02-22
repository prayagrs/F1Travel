"use client";

import { useState, useEffect } from "react";
import type { ItineraryResult } from "@/domain/itinerary/types";
import { ItineraryView } from "@/ui/trip/ItineraryView";

type SampleItineraryClientProps = {
  /** Initial result without flight prices; prices load in background and merge in. */
  initialResult: ItineraryResult;
};

/**
 * Renders the sample itinerary immediately and fetches flight prices in the background
 * so the page does not block on Amadeus (avoids 8–10s wait).
 */
export function SampleItineraryClient({ initialResult }: SampleItineraryClientProps) {
  const [result, setResult] = useState<ItineraryResult>(initialResult);
  const [flightPricesLoading, setFlightPricesLoading] = useState(true);

  useEffect(() => {
    fetch("/api/flight-prices/sample", { credentials: "include" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.flightsByOption) {
          setResult((prev) => ({
            ...prev,
            flightsByOption: data.flightsByOption,
          }));
        }
      })
      .catch(() => {})
      .finally(() => setFlightPricesLoading(false));
  }, []);

  return <ItineraryView result={result} flightPricesLoading={flightPricesLoading} />;
}
