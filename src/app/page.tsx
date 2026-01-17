import Link from "next/link";
import { Card } from "@/ui/components/Card";

/**
 * Public home page with CTA to /trip
 */
export default function Home() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-6xl">
          Plan Your F1 Race Weekend
        </h1>
        <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-400">
          Get personalized itineraries for Formula 1 race weekends. Find flights, hotels, race
          tickets, and local experiences all in one place.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link
            href="/trip"
            className="rounded-md bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            Plan Your Trip
          </Link>
        </div>
      </div>

      <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Choose Your Race
          </h3>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Select from all 2026 F1 races around the world
          </p>
        </Card>
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Set Your Preferences
          </h3>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Enter your origin city, trip duration, and budget tier
          </p>
        </Card>
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Get Your Itinerary
          </h3>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Receive curated date options with flight, hotel, and ticket links
          </p>
        </Card>
      </div>
    </div>
  );
}
