import { redirect } from "next/navigation";
import { getSession } from "@/server/auth/session";
import { TripForm } from "@/ui/trip/TripForm";
import { Card } from "@/ui/components/Card";
import Link from "next/link";

/**
 * Trip form page. Requires authentication.
 * If not signed in: show sign-in prompt/button.
 * If signed in: render TripForm.
 */
export default async function TripPage() {
  const session = await getSession();

  if (!session?.user?.id) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
        <Card>
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
              Sign in to Create Your Itinerary
            </h2>
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              You need to sign in with Google to generate and save your F1 trip itineraries.
            </p>
            <div className="mt-6">
              <Link
                href="/api/auth/signin"
                className="inline-flex items-center rounded-md bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-blue-500"
              >
                Sign in with Google
              </Link>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-3xl font-bold text-gray-900 dark:text-gray-100">
        Create Your F1 Trip Itinerary
      </h1>
      <TripForm />
    </div>
  );
}
