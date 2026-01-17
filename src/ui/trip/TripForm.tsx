"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { TripRequest, BudgetTier } from "@/domain/itinerary/types";
import type { RaceWeekend } from "@/domain/races/types";
import { Card } from "@/ui/components/Card";

type TripFormProps = {
  onSubmit?: (request: TripRequest) => Promise<void>;
};

/**
 * Client component form for creating a trip itinerary.
 * Fetches races from API and submits to /api/itineraries/generate.
 */
export function TripForm({ onSubmit }: TripFormProps) {
  const router = useRouter();
  const [races, setRaces] = useState<RaceWeekend[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingRaces, setFetchingRaces] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<TripRequest>({
    originCity: "",
    raceId: "",
    durationDays: 5,
    budgetTier: "$$",
  });

  // Fetch races on mount
  useEffect(() => {
    async function fetchRaces() {
      try {
        const response = await fetch("/api/races");
        if (!response.ok) {
          throw new Error("Failed to fetch races");
        }
        const data = await response.json();
        setRaces(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load races");
      } finally {
        setFetchingRaces(false);
      }
    }
    fetchRaces();
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (onSubmit) {
        await onSubmit(formData);
      } else {
        // Default: call API endpoint
        const response = await fetch("/api/itineraries/generate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || "Failed to generate itinerary");
        }

        const data = await response.json();
        router.push(`/itinerary/${data.itineraryId}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (fetchingRaces) {
    return (
      <Card>
        <p className="text-gray-600 dark:text-gray-400">Loading races...</p>
      </Card>
    );
  }

  return (
    <Card>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="originCity"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Origin City
          </label>
          <input
            type="text"
            id="originCity"
            required
            minLength={2}
            value={formData.originCity}
            onChange={(e) =>
              setFormData({ ...formData, originCity: e.target.value })
            }
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            placeholder="e.g., London"
          />
        </div>

        <div>
          <label
            htmlFor="raceId"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Race Weekend
          </label>
          <select
            id="raceId"
            required
            value={formData.raceId}
            onChange={(e) =>
              setFormData({ ...formData, raceId: e.target.value })
            }
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          >
            <option value="">Select a race...</option>
            {races.map((race) => (
              <option key={race.id} value={race.id}>
                {race.name} - {race.city}, {race.country} ({race.raceDateISO})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="durationDays"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Trip Duration (days)
          </label>
          <input
            type="number"
            id="durationDays"
            required
            min={2}
            max={30}
            value={formData.durationDays}
            onChange={(e) =>
              setFormData({
                ...formData,
                durationDays: parseInt(e.target.value) || 5,
              })
            }
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          />
        </div>

        <div>
          <label
            htmlFor="budgetTier"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Budget Tier
          </label>
          <select
            id="budgetTier"
            required
            value={formData.budgetTier}
            onChange={(e) =>
              setFormData({
                ...formData,
                budgetTier: e.target.value as BudgetTier,
              })
            }
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          >
            <option value="$">$ - Budget</option>
            <option value="$$">$$ - Mid-range</option>
            <option value="$$$">$$$ - Luxury</option>
          </select>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-4 text-sm text-red-800 dark:bg-red-900/20 dark:text-red-400">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Generating..." : "Generate Itinerary"}
        </button>

        <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">
          Note: Prices and availability may change. Please verify with providers before booking.
        </p>
      </form>
    </Card>
  );
}
