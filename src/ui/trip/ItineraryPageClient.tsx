"use client";

import { useState, useEffect, useCallback } from "react";
import type { ItineraryResult, ItineraryBookingRecord } from "@/domain/itinerary/types";
import { getCachedResult, clearCachedResult } from "@/ui/trip/itineraryCache";
import { ItineraryView } from "@/ui/trip/ItineraryView";
import { Card } from "@/ui/components/Card";
import { Spinner } from "@/ui/components/Spinner";

type ItineraryPageClientProps = {
  id: string;
};

/** Fetch flight prices in background and merge into result so page renders fast. */
function fetchAndMergeFlightPrices(
  id: string,
  setResult: React.Dispatch<React.SetStateAction<ItineraryResult | null>>,
  setFlightPricesLoading: React.Dispatch<React.SetStateAction<boolean>>
) {
  setFlightPricesLoading(true);
  fetch(`/api/itineraries/${id}/flight-prices`, { credentials: "include" })
    .then((res) => (res.ok ? res.json() : null))
    .then((data) => {
      if (data?.flightsByOption) {
        setResult((prev) =>
          prev ? { ...prev, flightsByOption: data.flightsByOption } : null
        );
      }
    })
    .catch(() => {})
    .finally(() => setFlightPricesLoading(false));
}

/**
 * Client component that loads itinerary result from cache (after generate) or from API.
 * Result is shown immediately; flight prices load in a second request and merge in when ready.
 */
export function ItineraryPageClient({ id }: ItineraryPageClientProps) {
  const [result, setResult] = useState<ItineraryResult | null>(() => getCachedResult(id) ?? null);
  const [bookings, setBookings] = useState<ItineraryBookingRecord[]>([]);
  const [loading, setLoading] = useState(!result);
  const [flightPricesLoading, setFlightPricesLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBookings = useCallback(() => {
    fetch(`/api/itineraries/${id}/bookings`, { credentials: "include" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.bookings) setBookings(data.bookings);
      })
      .catch(() => {});
  }, [id]);

  useEffect(() => {
    const cached = getCachedResult(id);
    if (cached) {
      setResult(cached);
      setLoading(false);
      setError(null);
      // Fetch merged result in background, then flight prices so tickets/links and prices stay in sync
      fetch(`/api/itineraries/${id}/result`, { credentials: "include" })
        .then((res) => {
          if (!res.ok) return;
          return res.json();
        })
        .then((data) => {
          if (data?.result) {
            setResult(data.result);
            clearCachedResult(id);
            fetchAndMergeFlightPrices(id, setResult, setFlightPricesLoading);
          }
        })
        .catch(() => {});
      return;
    }

    setResult(null);
    setLoading(true);
    setError(null);
    fetch(`/api/itineraries/${id}/result`, { credentials: "include" })
      .then((res) => {
        if (!res.ok) {
          if (res.status === 404) setError("Itinerary not found");
          else setError("Failed to load itinerary");
          return;
        }
        return res.json();
      })
      .then((data) => {
        if (data?.result) {
          setResult(data.result);
          fetchAndMergeFlightPrices(id, setResult, setFlightPricesLoading);
        }
      })
      .catch(() => setError("Failed to load itinerary"))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (result && id) fetchBookings();
  }, [id, result, fetchBookings]);

  if (error) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
        <Card>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
            {error === "Itinerary not found" ? "Itinerary Not Found" : "Something went wrong"}
          </h2>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            {error === "Itinerary not found"
              ? "This itinerary doesn't exist or you don't have permission to view it."
              : "We couldn't load this itinerary. Please try again."}
          </p>
        </Card>
      </div>
    );
  }

  if (loading || !result) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <ItineraryView
      result={result}
      itineraryId={id}
      bookings={bookings}
      onBookingAdded={fetchBookings}
      flightPricesLoading={flightPricesLoading}
    />
  );
}
