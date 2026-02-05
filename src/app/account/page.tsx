import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/server/auth/session";
import { itineraryRepo } from "@/server/repositories/itineraryRepo";
import { Card } from "@/ui/components/Card";
import { ItineraryCard } from "@/ui/account/ItineraryCard";
import { getCountryFlag } from "@/ui/trip/countryFlags";

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
    <>
      <div
        className={
          itineraries.length > 0
            ? "mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
            : "mb-8"
        }
      >
        <h1 className="font-heading text-3xl font-bold text-white">My Itineraries</h1>
        {itineraries.length > 0 && (
          <Link
            href="/trip"
            className="inline-flex min-h-[44px] items-center justify-center rounded-md border border-gray-700 px-4 py-2 text-sm font-medium text-gray-300 transition-transform hover:border-red-600/50 hover:bg-red-600/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900 active:scale-95"
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
              className="mt-4 inline-block rounded-md bg-red-600 px-6 py-3 text-base font-semibold text-white shadow-sm transition-transform hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900 active:scale-95"
            >
              Create Your First Itinerary
            </Link>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {itineraries.map((itinerary, index) => (
            <ItineraryCard
              key={itinerary.id}
              staggerDelay={index * 50}
              itinerary={{
                id: itinerary.id,
                raceName: formatRaceName(itinerary.raceId),
                countryFlag: getCountryFlag(itinerary.country ?? ""),
                raceDate: formatRaceDate(itinerary.raceDateISO),
                subtitle: `From ${itinerary.originCity} • ${itinerary.durationDays} days • Budget: ${itinerary.budgetTier}`,
                createdDate: formatCreatedDate(itinerary.createdAt),
              }}
            />
          ))}
        </div>
      )}
    </>
  );
}
