import { raceRepo } from "@/server/repositories/raceRepo";
import { buildItinerary } from "@/domain/itinerary/itineraryBuilder";
import { ItineraryView } from "@/ui/trip/ItineraryView";
import { Card } from "@/ui/components/Card";
import Link from "next/link";

/**
 * Sample itinerary page. Does NOT require authentication.
 * Shows a sample itinerary for Monaco GP to demonstrate the product.
 * This itinerary is NOT saved to any user account.
 */
export default async function SampleItineraryPage() {
  // Get Monaco GP race data (matching the preview strip on home page)
  const monacoRace = raceRepo.getRaceById(2026, "monaco-gp");

  if (!monacoRace) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
        <Card>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
            Sample Not Available
          </h2>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            The sample itinerary is currently unavailable.
          </p>
        </Card>
      </div>
    );
  }

  // Create sample trip request matching the preview strip
  // Monaco GP: Jun 7, 2026 • From London • 5 days • Mid-range budget
  const sampleRequest = {
    originCity: "London",
    raceId: "monaco-gp",
    durationDays: 5,
    budgetTier: "$$" as const,
  };

  // Build the sample itinerary using the same logic as real itineraries
  const sampleItinerary = buildItinerary(sampleRequest, monacoRace);

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Sample Banner - Prominent indicator this is not saved */}
      <Card className="mb-8 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-blue-900 dark:text-blue-100">
              Sample Itinerary Preview
            </h2>
            <p className="mt-1 text-sm text-blue-800 dark:text-blue-300">
              This is a sample itinerary to show you what you'll get. It is{" "}
              <strong>not saved</strong> to any account.{" "}
              <Link
                href="/api/auth/signin"
                className="font-medium underline hover:text-blue-600 dark:hover:text-blue-400"
              >
                Sign in
              </Link>{" "}
              to create and save your own personalized itinerary.
            </p>
          </div>
          <Link
            href="/trip"
            className="inline-flex items-center gap-2 rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Create Your Own
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </Card>

      {/* Render the sample itinerary using the same component as real itineraries */}
      <ItineraryView result={sampleItinerary} />
    </div>
  );
}
