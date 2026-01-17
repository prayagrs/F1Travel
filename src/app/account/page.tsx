import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/server/auth/session";
import { itineraryRepo } from "@/server/repositories/itineraryRepo";
import { Card } from "@/ui/components/Card";

/**
 * Account page listing user itineraries.
 * Requires session.
 * Lists user itineraries via repo listUserItineraries.
 * Each item links to /itinerary/[id].
 */
export default async function AccountPage() {
  const session = await getSession();

  if (!session?.user?.id) {
    redirect("/api/auth/signin");
  }

  const itineraries = await itineraryRepo.listUserItineraries(session.user.id);

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-3xl font-bold text-gray-900 dark:text-gray-100">
        My Itineraries
      </h1>

      {itineraries.length === 0 ? (
        <Card>
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400">
              You don't have any saved itineraries yet.
            </p>
            <Link
              href="/trip"
              className="mt-4 inline-block rounded-md bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-blue-500"
            >
              Create Your First Itinerary
            </Link>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {itineraries.map((itinerary) => (
            <Link key={itinerary.id} href={`/itinerary/${itinerary.id}`}>
              <Card className="hover:border-blue-500 hover:shadow-md transition-all cursor-pointer">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {itinerary.raceId.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                    </h3>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                      From {itinerary.originCity} • {itinerary.durationDays} days • Budget:{" "}
                      {itinerary.budgetTier}
                    </p>
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-500">
                    {new Date(itinerary.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
