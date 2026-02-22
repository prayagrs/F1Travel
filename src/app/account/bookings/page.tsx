import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/server/auth/session";
import { bookingRepo } from "@/server/repositories/bookingRepo";
import { Card } from "@/ui/components/Card";
import { getCountryFlag } from "@/ui/trip/countryFlags";
import type { BookingType } from "@/domain/itinerary/types";

/** Format raceId to display name with "GP" uppercased. */
function formatRaceName(raceId: string): string {
  const titleCased = raceId
    .replace(/-/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());
  return titleCased.replace(/\bGp\b/gi, "GP");
}

function formatRaceDate(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

const BOOKING_TYPE_LABELS: Record<BookingType, string> = {
  flight: "Flight",
  stay: "Accommodation",
  ticket: "Race ticket",
  activity: "Experience",
};

/**
 * My Bookings page: lists all user bookings grouped by trip (itinerary).
 * Similar to Airbnb / Hotels.com / Expedia "My Bookings".
 */
export default async function MyBookingsPage() {
  const session = await getSession();

  if (!session?.user?.id) {
    redirect("/api/auth/signin");
  }

  const list = await bookingRepo.listByUser(session.user.id);

  // Group by itinerary id
  const byItinerary = new Map<
    string,
    {
      itineraryId: string;
      raceId: string;
      originCity: string;
      durationDays: number;
      raceDateISO: string | null;
      country: string | null;
      bookings: typeof list;
    }
  >();

  for (const b of list) {
    const key = b.itineraryId;
    if (!byItinerary.has(key)) {
      byItinerary.set(key, {
        itineraryId: b.itineraryId,
        raceId: b.itinerary.raceId,
        originCity: b.itinerary.originCity,
        durationDays: b.itinerary.durationDays,
        raceDateISO: b.itinerary.raceDateISO,
        country: b.itinerary.country,
        bookings: [],
      });
    }
    byItinerary.get(key)!.bookings.push(b);
  }

  const groups = Array.from(byItinerary.values());

  return (
    <>
      <h1 className="font-heading text-3xl font-bold text-white mb-8">My Bookings</h1>

      {groups.length === 0 ? (
        <Card className="border-gray-800/50 bg-gray-900/30 backdrop-blur-sm">
          <div className="text-center py-10">
            <p className="text-gray-300">You don&apos;t have any saved bookings yet.</p>
            <p className="text-sm text-gray-500 mt-2">
              Add confirmation numbers from your itineraries to see them here.
            </p>
            <Link
              href="/account"
              className="mt-6 inline-block rounded-md bg-red-600 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900"
            >
              Go to My Itineraries
            </Link>
          </div>
        </Card>
      ) : (
        <div className="space-y-6">
          {groups.map((group) => (
            <Card
              key={group.itineraryId}
              className="border-gray-800 bg-gray-900/30 overflow-hidden"
            >
              <div className="p-4 sm:p-5">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl" aria-hidden>
                      {getCountryFlag(group.country ?? "")}
                    </span>
                    <h2 className="font-heading text-xl font-semibold text-white">
                      {formatRaceName(group.raceId)}
                    </h2>
                  </div>
                  <span className="text-sm text-gray-400">
                    {formatRaceDate(group.raceDateISO)} · From {group.originCity} · {group.durationDays} days
                  </span>
                </div>
                <Link
                  href={`/itinerary/${group.itineraryId}`}
                  className="text-sm text-red-400 hover:text-red-300 focus:outline-none focus:ring-2 focus:ring-red-500 rounded"
                >
                  View full itinerary →
                </Link>

                <ul className="mt-4 space-y-3" aria-label="Bookings for this trip">
                  {group.bookings.map((b) => (
                    <li
                      key={b.id}
                      className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-gray-700 bg-gray-800/50 px-4 py-3"
                    >
                      <div className="min-w-0 flex-1">
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                          {BOOKING_TYPE_LABELS[b.type]}
                        </span>
                        <p className="font-medium text-white mt-0.5">{b.provider}</p>
                        <p className="text-sm text-gray-400">
                          Confirmation: <span className="text-gray-300 font-mono">{b.confirmationRef}</span>
                        </p>
                        {b.notes && (
                          <p className="text-sm text-gray-500 mt-1">{b.notes}</p>
                        )}
                      </div>
                      {b.detailsUrl && (
                        <a
                          href={b.detailsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="shrink-0 rounded-md border border-gray-600 px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                        >
                          View on {b.provider}
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
