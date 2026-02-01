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
      <div className="relative w-full min-h-screen overflow-hidden bg-[#0B0C0E] pt-12 sm:pt-16 pb-32">
        {/* F1 Background Patterns */}
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
        
        <div className="relative z-10 mx-auto max-w-3xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          <div className="w-full max-w-2xl">
            <Card className="border-gray-800/50 bg-gray-900/30 backdrop-blur-sm">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-white sm:text-3xl">
                  Sign in to Create Your Itinerary
                </h2>
                <p className="mt-4 text-gray-300">
                  You need to sign in with Google to generate and save your F1 trip itineraries.
                </p>
                <div className="mt-6">
                  <Link
                    href="/api/auth/signin"
                    className="inline-flex items-center justify-center gap-2 rounded-md bg-red-600 px-6 py-3 text-base font-semibold text-white shadow-lg transition-all duration-200 hover:translate-x-1 hover:brightness-110 hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 focus-visible:ring-2 focus-visible:ring-red-500"
                  >
                    Sign in with Google
                    <span className="text-lg" aria-hidden="true">→</span>
                  </Link>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-[#0B0C0E] pt-12 sm:pt-16 pb-32">
      {/* F1 Checkered Flag Pattern - Very subtle */}
      <div className="pointer-events-none absolute inset-0 checkered-pattern opacity-20" aria-hidden="true" />
      
      {/* Circuit Track Lines - Racing lines effect */}
      <div className="pointer-events-none absolute inset-0 circuit-lines opacity-30" aria-hidden="true" />
      
      {/* F1 Grid Lines - Starting grid effect */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 grid-lines opacity-15" aria-hidden="true" />
      
      {/* Animated gradient background for visual energy */}
      <div
        className="pointer-events-none absolute inset-0 opacity-15"
        style={{
          background:
            "radial-gradient(ellipse at top right, rgba(220, 38, 38, 0.3) 0%, transparent 50%), radial-gradient(ellipse at bottom left, rgba(220, 38, 38, 0.15) 0%, transparent 50%)",
        }}
        aria-hidden="true"
      />
      
      {/* Enhanced racing gradient sweep - More dynamic motion */}
      <div
        className="pointer-events-none absolute inset-0 animate-racing-sweep"
        style={{
          background:
            "radial-gradient(circle, rgba(220, 38, 38, 0.2) 0%, transparent 70%), linear-gradient(135deg, rgba(220, 38, 38, 0.25) 0%, transparent 50%, rgba(59, 130, 246, 0.1) 100%)",
        }}
        aria-hidden="true"
      />
      
      {/* Animated gradient sweep - Creates motion */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.08] animate-gradient-sweep"
        style={{
          background:
            "linear-gradient(135deg, rgba(220, 38, 38, 0.2) 0%, transparent 40%, rgba(107, 114, 128, 0.1) 60%, transparent 100%)",
        }}
        aria-hidden="true"
      />
      
      {/* Speed Lines Effect - Dynamic racing motion */}
      <div className="pointer-events-none absolute inset-0 speed-lines opacity-30" aria-hidden="true" />
      
      {/* Animated red accent dots with F1 pulse */}
      <div className="pointer-events-none absolute top-20 right-20 h-2.5 w-2.5 rounded-full bg-red-600 animate-f1-pulse shadow-lg shadow-red-600/50" aria-hidden="true" />
      <div className="pointer-events-none absolute bottom-32 left-16 h-2 w-2 rounded-full bg-red-500 animate-f1-pulse delay-1000 shadow-lg shadow-red-500/40" aria-hidden="true" />
      <div className="pointer-events-none absolute top-1/3 right-1/4 h-1.5 w-1.5 rounded-full bg-red-400 animate-f1-pulse delay-2000 shadow-lg shadow-red-400/30" aria-hidden="true" />
      
      <div className="relative z-10 mx-auto max-w-3xl px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
        {/* Badge */}
        <div className="mb-3 inline-flex items-center gap-2 border-l-2 border-red-600 pl-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-300">
            PLAN YOUR TRIP
          </span>
          <div className="h-1.5 w-1.5 rounded-full bg-red-600" aria-hidden="true" />
        </div>
        
        {/* Heading - Proportional size for form page */}
        <h1 className="mb-4 text-2xl font-bold leading-tight tracking-tight text-white sm:text-3xl lg:text-4xl">
          Create Your F1 Trip
          <br />
          <span className="text-red-600">Itinerary.</span>
        </h1>
        
        <TripForm />
      </div>
    </div>
  );
}
