"use client";

import { useState, useEffect, useRef, useCallback, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { TripRequest, BudgetTier } from "@/domain/itinerary/types";
import type { RaceWeekend } from "@/domain/races/types";
import worldCities from "@/content/cities.json";
import { getCountryFlag } from "@/ui/trip/countryFlags";
import { Card } from "@/ui/components/Card";
import { Skeleton, SkeletonInput, SkeletonSelect, SkeletonButton } from "@/ui/components/Skeleton";
import { Spinner } from "@/ui/components/Spinner";

type TripFormProps = {
  onSubmit?: (request: TripRequest) => Promise<void>;
};

/**
 * Formats a race date ISO string to a readable format
 * Example: "2026-05-24" -> "May 24, 2026"
 */
function formatRaceDate(raceDateISO: string): string {
  const date = new Date(raceDateISO);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Formats race name for dropdown display
 * Example: "Monaco Grand Prix" -> "Monaco GP"
 */
function formatRaceName(name: string): string {
  return name.replace("Grand Prix", "GP");
}

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

  // Validation state
  const [validationErrors, setValidationErrors] = useState<{
    originCity?: string;
    raceId?: string;
    durationDays?: string;
    budgetTier?: string;
  }>({});

  // Race Weekend custom dropdown (flags + less clutter)
  const [raceDropdownOpen, setRaceDropdownOpen] = useState(false);
  const [raceHighlightIndex, setRaceHighlightIndex] = useState(-1);
  const raceDropdownRef = useRef<HTMLDivElement>(null);
  const raceListRef = useRef<HTMLUListElement>(null);

  // Origin city inline autocomplete (no dropdown)
  const originInputRef = useRef<HTMLInputElement>(null);

  // World cities for inline suggestion (first match only; any city can still be typed)
  const citiesList: string[] = worldCities as string[];
  const query = formData.originCity.trim().toLowerCase();
  const filteredCities = query.length < 1
    ? []
    : citiesList.filter((city) => city.toLowerCase().includes(query));
  const firstMatch = filteredCities.find((c) => c.toLowerCase().startsWith(query)) ?? filteredCities[0];
  const showInlineSuggestion =
    query.length >= 1 &&
    firstMatch &&
    firstMatch.toLowerCase() !== query.toLowerCase() &&
    firstMatch.toLowerCase().startsWith(query);
  const completionSuffix = showInlineSuggestion
    ? firstMatch.slice(query.length)
    : "";

  const acceptInlineSuggestion = useCallback(() => {
    if (!showInlineSuggestion || !firstMatch) return;
    setFormData((prev) => ({ ...prev, originCity: firstMatch }));
    validateField("originCity", firstMatch);
  }, [showInlineSuggestion, firstMatch]);

  const handleOriginKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Tab" || e.key === "Enter") {
        if (showInlineSuggestion && firstMatch) {
          e.preventDefault();
          acceptInlineSuggestion();
        }
      } else if (e.key === "Escape") {
        if (showInlineSuggestion) {
          e.preventDefault();
          originInputRef.current?.blur();
        }
      }
    },
    [showInlineSuggestion, firstMatch, acceptInlineSuggestion]
  );

  // Real-time validation
  const validateField = (field: string, value: string | number) => {
    const errors = { ...validationErrors };
    
    switch (field) {
      case "originCity":
        if (typeof value === "string") {
          if (value.length < 2) {
            errors.originCity = "City name must be at least 2 characters";
          } else {
            delete errors.originCity;
          }
        }
        break;
      case "raceId":
        if (!value) {
          errors.raceId = "Please select a race weekend";
        } else {
          delete errors.raceId;
        }
        break;
      case "durationDays":
        if (typeof value === "number") {
          if (value < 2 || value > 30) {
            errors.durationDays = "Duration must be between 2 and 30 days";
          } else {
            delete errors.durationDays;
          }
        }
        break;
      case "budgetTier":
        if (!value) {
          errors.budgetTier = "Please select a budget tier";
        } else {
          delete errors.budgetTier;
        }
        break;
    }
    
    setValidationErrors(errors);
  };

  // Check if form is valid
  const isFormValid = () => {
    return (
      formData.originCity.length >= 2 &&
      formData.raceId !== "" &&
      formData.durationDays >= 2 &&
      formData.durationDays <= 30 &&
      !!formData.budgetTier &&
      Object.keys(validationErrors).length === 0
    );
  };

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

  // Close race dropdown on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (raceDropdownRef.current && !raceDropdownRef.current.contains(e.target as Node)) {
        setRaceDropdownOpen(false);
      }
    }
    if (raceDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [raceDropdownOpen]);

  // Scroll highlighted race option into view when using keyboard
  useEffect(() => {
    if (!raceDropdownOpen || raceHighlightIndex < 0 || !raceListRef.current) return;
    const el = raceListRef.current.querySelector(`#race-option-${raceHighlightIndex}`);
    el?.scrollIntoView({ block: "nearest" });
  }, [raceDropdownOpen, raceHighlightIndex]);

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
      <Card className="border-gray-800/50 bg-gray-900/30 backdrop-blur-sm">
        <div className="space-y-5">
          <div>
            <Skeleton className="mb-1 h-4 w-28" />
            <Skeleton className="mb-2 h-3 w-48" />
            <SkeletonSelect />
          </div>
          <div>
            <Skeleton className="mb-1 h-4 w-24" />
            <Skeleton className="mb-2 h-3 w-36" />
            <SkeletonInput />
          </div>
          <div>
            <Skeleton className="mb-1 h-4 w-28" />
            <Skeleton className="mb-2 h-3 w-52" />
            <SkeletonInput />
          </div>
          <div>
            <Skeleton className="mb-1 h-4 w-24" />
            <Skeleton className="mb-2 h-3 w-40" />
            <SkeletonSelect />
          </div>
          <div className="pt-2 border-t border-gray-800/50">
            <SkeletonButton />
          </div>
        </div>
      </Card>
    );
  }

  // Sort races by date (upcoming first)
  const sortedRaces = [...races].sort((a, b) => 
    new Date(a.raceDateISO).getTime() - new Date(b.raceDateISO).getTime()
  );

  return (
    <Card className="font-form border-gray-800/50 bg-gray-900/30 backdrop-blur-sm shadow-lg shadow-red-600/5 transition-all duration-200 hover:border-red-600/30 hover:shadow-red-600/10 px-4 py-4 sm:px-5 sm:py-5">
      <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in">
        {/* Race Weekend - Custom dropdown with flags and clearer layout */}
        <div ref={raceDropdownRef} className="relative">
          <label
            id="raceId-label"
            htmlFor="raceId-button"
            className="block text-sm font-medium text-gray-300 mb-1"
          >
            Race Weekend
          </label>
          <p className="text-xs text-gray-500 mb-2" id="raceId-help">
            Choose which F1 race weekend you want to attend
          </p>
          <input
            type="hidden"
            id="raceId"
            name="raceId"
            value={formData.raceId}
            required
            aria-invalid={validationErrors.raceId ? "true" : "false"}
          />
          <button
            type="button"
            id="raceId-button"
            aria-haspopup="listbox"
            aria-expanded={raceDropdownOpen}
            aria-labelledby="raceId-label"
            aria-describedby="raceId-help raceId-error"
            aria-controls="raceId-listbox"
            aria-activedescendant={raceDropdownOpen && raceHighlightIndex >= 0 ? `race-option-${raceHighlightIndex}` : undefined}
            disabled={loading}
            onClick={() => {
              setRaceDropdownOpen((open) => !open);
              setRaceHighlightIndex(formData.raceId ? sortedRaces.findIndex((r) => r.id === formData.raceId) : 0);
            }}
            onKeyDown={(e) => {
              if (!raceDropdownOpen) {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setRaceDropdownOpen(true);
                  setRaceHighlightIndex(0);
                }
                return;
              }
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setRaceHighlightIndex((i) => (i < sortedRaces.length - 1 ? i + 1 : i));
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setRaceHighlightIndex((i) => (i > 0 ? i - 1 : 0));
              } else if (e.key === "Enter" && raceHighlightIndex >= 0 && sortedRaces[raceHighlightIndex]) {
                e.preventDefault();
                const race = sortedRaces[raceHighlightIndex];
                setFormData((prev) => ({ ...prev, raceId: race.id }));
                validateField("raceId", race.id);
                setRaceDropdownOpen(false);
              } else if (e.key === "Escape") {
                e.preventDefault();
                setRaceDropdownOpen(false);
              }
            }}
            className={`mt-1 flex w-full items-center justify-between gap-2 rounded-md border px-3 py-2.5 text-left text-white shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 hover:border-gray-600 min-h-[44px] touch-manipulation ${
              validationErrors.raceId
                ? "border-red-600 bg-gray-800/50"
                : formData.raceId
                ? "border-green-600/50 bg-gray-800/50"
                : "border-gray-700 bg-gray-800/50"
            }`}
          >
            {formData.raceId ? (
              (() => {
                const selected = sortedRaces.find((r) => r.id === formData.raceId);
                return selected ? (
                  <span className="flex items-center gap-2 truncate">
                    <span className="shrink-0 text-lg leading-none" aria-hidden="true">
                      {getCountryFlag(selected.country)}
                    </span>
                    <span className="truncate">
                      {formatRaceName(selected.name)} · {formatRaceDate(selected.raceDateISO)}
                    </span>
                  </span>
                ) : (
                  <span className="text-gray-500">Select a race...</span>
                );
              })()
            ) : (
              <span className="text-gray-500">Select a race...</span>
            )}
            <svg
              className={`h-5 w-5 shrink-0 text-gray-400 transition-transform ${raceDropdownOpen ? "rotate-180" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {raceDropdownOpen && (
            <ul
              ref={raceListRef}
              id="raceId-listbox"
              role="listbox"
              aria-labelledby="raceId-label"
              className="absolute z-20 mt-1 max-h-[min(18rem,60vh)] w-full overflow-auto rounded-md border border-gray-700 bg-gray-900 py-1 shadow-xl ring-1 ring-black/20"
            >
              {sortedRaces.map((race, i) => (
                <li
                  key={race.id}
                  id={`race-option-${i}`}
                  role="option"
                  aria-selected={formData.raceId === race.id}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    setFormData((prev) => ({ ...prev, raceId: race.id }));
                    validateField("raceId", race.id);
                    setRaceDropdownOpen(false);
                  }}
                  onMouseEnter={() => setRaceHighlightIndex(i)}
                  className={`flex cursor-pointer items-start gap-3 px-3 py-2.5 text-left transition-colors ${
                    raceHighlightIndex === i
                      ? "bg-red-600/20 text-white"
                      : "text-gray-200 hover:bg-gray-800"
                  }`}
                >
                  <span className="mt-0.5 shrink-0 text-xl leading-none" aria-hidden="true">
                    {getCountryFlag(race.country)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-white">
                      {formatRaceName(race.name)} · {formatRaceDate(race.raceDateISO)}
                    </div>
                    <div className="mt-0.5 text-xs text-gray-400">
                      {race.city}, {race.country}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
          {validationErrors.raceId && (
            <p id="raceId-error" className="mt-1 text-xs text-red-400" role="alert">
              {validationErrors.raceId}
            </p>
          )}
        </div>

        {/* Origin City - Second - Inline autocomplete (no dropdown) */}
        <div className="relative">
          <label
            htmlFor="originCity"
            className="block text-sm font-medium text-gray-300 mb-1"
          >
            Origin City
          </label>
          <p className="text-xs text-gray-500 mb-1.5" id="originCity-help">
            Any city worldwide. Type your city or use the suggestion (Tab to accept).
          </p>
          <div
            className={`relative mt-1 flex min-h-[44px] items-center rounded-md border px-3 py-2.5 shadow-sm transition-all duration-200 focus-within:outline focus-within:ring-2 focus-within:ring-red-500/50 focus-within:ring-offset-0 ${
              validationErrors.originCity
                ? "border-red-600 bg-gray-800/50"
                : formData.originCity.length >= 2
                ? "border-green-600/50 bg-gray-800/50"
                : "border-gray-700 bg-gray-800/50"
            }`}
          >
            {/* Ghost line: same baseline as input — transparent typed part + gray completion */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 flex items-center px-3 py-2.5 text-base leading-normal"
            >
              <span className="whitespace-pre text-transparent">
                {formData.originCity}
              </span>
              {showInlineSuggestion && completionSuffix && (
                <span className="whitespace-pre text-gray-500" aria-live="polite">
                  {completionSuffix}
                </span>
              )}
            </div>
            <input
              ref={originInputRef}
              type="text"
              id="originCity"
              required
              minLength={2}
              value={formData.originCity}
              onChange={(e) => {
                const value = e.target.value;
                setFormData({ ...formData, originCity: value });
                validateField("originCity", value);
              }}
              onBlur={() => validateField("originCity", formData.originCity)}
              onKeyDown={handleOriginKeyDown}
              disabled={loading}
              autoComplete="off"
              aria-describedby="originCity-help originCity-error originCity-suggestion"
              aria-invalid={validationErrors.originCity ? "true" : "false"}
              aria-autocomplete="inline"
              aria-controls={showInlineSuggestion ? "originCity-suggestion" : undefined}
              className="relative z-10 w-full min-w-0 border-0 bg-transparent py-0 text-base leading-normal text-white placeholder-gray-500 outline-none focus:ring-0 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="e.g. London, Mumbai, São Paulo"
            />
          </div>
          {showInlineSuggestion && firstMatch && (
            <p id="originCity-suggestion" className="sr-only" aria-live="polite">
              Suggestion: {firstMatch}. Press Tab or Enter to accept.
            </p>
          )}
          {validationErrors.originCity && (
            <p
              id="originCity-error"
              className="mt-1 text-xs text-red-400"
              role="alert"
            >
              {validationErrors.originCity}
            </p>
          )}
          {formData.originCity.length >= 2 && !validationErrors.originCity && (
            <p className="mt-1 text-xs text-green-400" aria-live="polite">
              ✓ Valid
            </p>
          )}
        </div>

        {/* Trip Duration - Third */}
        <div>
          <label
            htmlFor="durationDays"
            className="block text-sm font-medium text-gray-300 mb-1"
          >
            Trip Duration
          </label>
          <p className="text-xs text-gray-500 mb-2" id="durationDays-help">
            How many days? (Typical: 3-5 days for a race weekend)
          </p>
          <input
            type="number"
            id="durationDays"
            required
            min={2}
            max={30}
            value={formData.durationDays}
            onChange={(e) => {
              const value = parseInt(e.target.value) || 5;
              setFormData({ ...formData, durationDays: value });
              validateField("durationDays", value);
            }}
            onBlur={() => validateField("durationDays", formData.durationDays)}
            disabled={loading}
            aria-describedby="durationDays-help durationDays-error"
            aria-invalid={validationErrors.durationDays ? "true" : "false"}
            className={`mt-1 block w-full rounded-md border px-3 py-2.5 text-white shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50 hover:border-gray-600 min-h-[44px] ${
              validationErrors.durationDays
                ? "border-red-600 bg-gray-800/50"
                : formData.durationDays >= 2 && formData.durationDays <= 30
                ? "border-green-600/50 bg-gray-800/50"
                : "border-gray-700 bg-gray-800/50"
            }`}
          />
          {validationErrors.durationDays && (
            <p
              id="durationDays-error"
              className="mt-1 text-xs text-red-400"
              role="alert"
            >
              {validationErrors.durationDays}
            </p>
          )}
          {formData.durationDays >= 2 && formData.durationDays <= 30 && !validationErrors.durationDays && (
            <p className="mt-1 text-xs text-green-400" aria-live="polite">
              ✓ Valid
            </p>
          )}
        </div>

        {/* Budget Tier - Fourth - Visual Button Selector */}
        <div>
          <label id="budgetTier-label" className="block text-sm font-medium text-gray-300 mb-1">
            Budget Tier
          </label>
          <p className="text-xs text-gray-500 mb-2" id="budgetTier-help">
            Select your preferred budget level
          </p>
          <div
            role="radiogroup"
            aria-labelledby="budgetTier-label"
            aria-describedby="budgetTier-help budgetTier-error"
            className="grid grid-cols-1 sm:grid-cols-3 gap-3"
          >
            {[
              { value: "$", label: "Budget", icon: "💰", desc: "Economy flights, budget hotels" },
              { value: "$$", label: "Mid-range", icon: "💼", desc: "Standard flights, 3-4 star hotels" },
              { value: "$$$", label: "Luxury", icon: "✨", desc: "Premium flights, 5-star hotels" },
            ].map((tier) => (
              <button
                key={tier.value}
                type="button"
                onClick={() => {
                  setFormData({ ...formData, budgetTier: tier.value as BudgetTier });
                  validateField("budgetTier", tier.value);
                }}
                disabled={loading}
                aria-checked={formData.budgetTier === tier.value}
                role="radio"
                className={`relative flex flex-col items-center justify-center gap-1.5 rounded-lg border-2 px-4 py-3 min-h-[88px] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:cursor-not-allowed disabled:opacity-50 touch-manipulation ${
                  formData.budgetTier === tier.value
                    ? "border-red-600 bg-red-600/10 shadow-lg shadow-red-600/20"
                    : "border-gray-700 bg-gray-800/50 hover:border-gray-600 hover:bg-gray-800/70"
                }`}
              >
                <span className="text-2xl" aria-hidden="true">
                  {tier.icon}
                </span>
                <div className="text-center">
                  <div className="text-base font-semibold text-white">
                    {tier.value} {tier.label}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">{tier.desc}</div>
                </div>
                {formData.budgetTier === tier.value && (
                  <div className="absolute top-2 right-2">
                    <svg
                      className="h-5 w-5 text-red-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
              </button>
            ))}
          </div>
          <input
            type="hidden"
            id="budgetTier"
            name="budgetTier"
            value={formData.budgetTier}
            required
            aria-invalid={validationErrors.budgetTier ? "true" : "false"}
          />
          {validationErrors.budgetTier && (
            <p
              id="budgetTier-error"
              className="mt-2 text-xs text-red-400"
              role="alert"
            >
              {validationErrors.budgetTier}
            </p>
          )}
        </div>

        {error && (
          <div className="rounded-md bg-red-900/30 border border-red-800/50 p-4 text-sm text-red-300">
            {error}
          </div>
        )}

        {/* Visual divider before submit */}
        <div className="pt-2 border-t border-gray-800/50">
          <button
            type="submit"
            disabled={loading || !isFormValid()}
            aria-disabled={loading || !isFormValid()}
            className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-red-600 px-6 py-3.5 text-base font-semibold text-white shadow-lg transition-all duration-200 hover:translate-x-1 hover:brightness-110 hover:shadow-xl hover:shadow-red-600/20 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-x-0 disabled:hover:brightness-100 disabled:hover:bg-red-600 min-h-[48px] touch-manipulation"
          >
            {loading && <Spinner size="sm" className="text-white" />}
            <span>{loading ? "Generating itinerary..." : "Generate Itinerary"}</span>
            {!loading && <span className="text-lg" aria-hidden="true">→</span>}
          </button>
          {!isFormValid() && !loading && (
            <p className="mt-2 text-xs text-gray-500 text-center" role="status">
              Fix the errors above to enable Generate Itinerary
            </p>
          )}
        </div>

        <p className="mt-3 text-xs text-gray-400">
          Note: Prices and availability may change. Please verify with providers before booking.
        </p>
      </form>
    </Card>
  );
}
