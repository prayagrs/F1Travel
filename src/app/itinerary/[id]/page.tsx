import { redirect } from "next/navigation";
import { getSession } from "@/server/auth/session";

export const dynamic = "force-dynamic";

import { ItineraryPageClient } from "@/ui/trip/ItineraryPageClient";

type ItineraryPageProps = {
  params: Promise<{ id: string }>;
};

/**
 * Itinerary detail page. Requires session.
 * Auth is enforced here; data is loaded client-side (cache from generate or GET /api/itineraries/[id]/result).
 */
export default async function ItineraryPage({ params }: ItineraryPageProps) {
  const session = await getSession();

  if (!session?.user?.id) {
    redirect("/api/auth/signin");
  }

  const { id } = await params;

  return <ItineraryPageClient id={id} />;
}
