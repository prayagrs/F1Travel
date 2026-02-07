import { redirect } from "next/navigation";
import { getSession } from "@/server/auth/session";

export const dynamic = "force-dynamic";

import { itineraryRepo } from "@/server/repositories/itineraryRepo";
import { raceRepo } from "@/server/repositories/raceRepo";
import { buildTicketsSection } from "@/domain/itinerary/linkBuilders";
import { ItineraryView } from "@/ui/trip/ItineraryView";
import { Card } from "@/ui/components/Card";

type ItineraryPageProps = {
  params: Promise<{ id: string }>;
};

/**
 * Itinerary detail page. Requires session.
 * Fetches itinerary via internal server call (using repo directly since server component).
 * Merges live ticket data at view time so existing itineraries show current ticket options.
 * Renders ItineraryView with date option tabs and sections.
 */
export default async function ItineraryPage({ params }: ItineraryPageProps) {
  const session = await getSession();

  if (!session?.user?.id) {
    redirect("/api/auth/signin");
  }

  const { id } = await params;

  // Fetch itinerary via repo directly (server component)
  const itinerary = await itineraryRepo.getItineraryById(session.user.id, id);

  if (!itinerary) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
        <Card>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
            Itinerary Not Found
          </h2>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            The itinerary you're looking for doesn't exist or you don't have permission to view it.
          </p>
        </Card>
      </div>
    );
  }

  const resultJson = itinerary.resultJson;

  // Merge live tickets at view time so existing itineraries see current ticket options
  const yearRaw = resultJson.race?.raceDateISO
    ? new Date(resultJson.race.raceDateISO).getFullYear()
    : 2026;
  const year = Number.isNaN(yearRaw) ? 2026 : yearRaw;
  const raceId = resultJson.request?.raceId ?? itinerary.raceId;
  const currentRace = raceRepo.getRaceById(year, raceId);
  const tickets = currentRace
    ? buildTicketsSection(currentRace)
    : resultJson.tickets;

  const result = { ...resultJson, tickets };

  return <ItineraryView result={result} />;
}
