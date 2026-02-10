"use client";

import { useState, useEffect } from "react";
import type { ItineraryResult } from "@/domain/itinerary/types";
import { getCachedResult, clearCachedResult } from "@/ui/trip/itineraryCache";
import { ItineraryView } from "@/ui/trip/ItineraryView";
import { Card } from "@/ui/components/Card";
import { Spinner } from "@/ui/components/Spinner";

type ItineraryPageClientProps = {
  id: string;
};

/**
 * Client component that loads itinerary result from cache (after generate) or from API.
 * Uses cached result for instant paint when navigating from trip form; fetches merged result for direct links or to refresh.
 */
export function ItineraryPageClient({ id }: ItineraryPageClientProps) {
  const [result, setResult] = useState<ItineraryResult | null>(() => getCachedResult(id) ?? null);
  const [loading, setLoading] = useState(!result);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cached = getCachedResult(id);
    if (cached) {
      setResult(cached);
      setLoading(false);
      setError(null);
      // Fetch merged result in background so tickets and flight links are current
      fetch(`/api/itineraries/${id}/result`, { credentials: "include" })
        .then((res) => {
          if (!res.ok) return;
          return res.json();
        })
        .then((data) => {
          if (data?.result) {
            setResult(data.result);
            clearCachedResult(id);
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
        if (data?.result) setResult(data.result);
      })
      .catch(() => setError("Failed to load itinerary"))
      .finally(() => setLoading(false));
  }, [id]);

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

  return <ItineraryView result={result} />;
}
