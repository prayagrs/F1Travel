import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/server/auth/session";
import { itineraryRepo } from "@/server/repositories/itineraryRepo";
import { Card } from "@/ui/components/Card";

/** Format raceId (e.g. "canadian-gp") to display name with "GP" uppercased. */
function formatRaceName(raceId: string): string {
  const titleCased = raceId
    .replace(/-/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());
  return titleCased.replace(/\bGp\b/gi, "GP");
}

/** Format ISO date to "May 2026" or "Feb 1, 2026" style. */
function formatRaceDate(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

/** Format created date for display. */
function formatCreatedDate(date: Date): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

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
    <div className="relative w-full min-h-screen overflow-hidden bg-[#0B0C0E] pt-12 sm:pt-16 pb-32">
      {/* F1 Background Patterns - Static, calmer than Trip page */}
      <div className="pointer-events-none absolute inset-0 checkered-pattern opacity-20" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0 circuit-lines opacity-30" aria-hidden="true" />
      <div
        className="pointer-events-none absolute inset-0 opacity-15"
        style={{
          background:
            "radial-gradient(ellipse at top right, rgba(220, 38, 38, 0.3) 0%, transparent 50%), radial-gradient(ellipse at bottom left, rgba(220, 38, 38, 0.15) 0%, transparent 50%)",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <div
          className={
            itineraries.length > 0
              ? "mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
              : "mb-8"
          }
        >
          <h1 className="text-3xl font-bold text-white">My Itineraries</h1>
          {itineraries.length > 0 && (
            <Link
              href="/trip"
              className="inline-flex min-h-[44px] items-center justify-center rounded-md border border-gray-700 px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:border-red-600/50 hover:bg-red-600/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900"
            >
              + New itinerary
            </Link>
          )}
        </div>

        {itineraries.length === 0 ? (
          <Card className="border-gray-800/50 bg-gray-900/30 backdrop-blur-sm">
            <div className="text-center">
              <p className="text-gray-300">
                You don&apos;t have any saved itineraries yet.
              </p>
              <Link
                href="/trip"
                className="mt-4 inline-block rounded-md bg-red-600 px-6 py-3 text-base font-semibold text-white shadow-sm transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900"
              >
                Create Your First Itinerary
              </Link>
            </div>
          </Card>
        ) : (
          <div className="space-y-4">
            {itineraries.map((itinerary) => {
              return (
                <Link key={itinerary.id} href={`/itinerary/${itinerary.id}`}>
                  <Card className="cursor-pointer border-gray-800/50 bg-gray-900/30 backdrop-blur-sm transition-all duration-200 hover:border-red-600/50 hover:shadow-md hover:shadow-red-600/10">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-white">
                          {formatRaceName(itinerary.raceId)}
                        </h3>
                        <p className="mt-1 text-sm text-gray-300">
                          {itinerary.raceDateISO && (
                            <>
                              {formatRaceDate(itinerary.raceDateISO)}
                              {" · "}
                            </>
                          )}
                          From {itinerary.originCity} • {itinerary.durationDays} days • Budget:{" "}
                          {itinerary.budgetTier}
                        </p>
                      </div>
                      <div className="text-sm text-gray-400">
                        {formatCreatedDate(itinerary.createdAt)}
                      </div>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
