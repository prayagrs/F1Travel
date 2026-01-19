import Link from "next/link";
import { Card } from "@/ui/components/Card";

/**
 * Public home page with CTA to /trip
 */
export default function Home() {
  return (
    <div className="w-full">
      {/* Hero Section - Full width with integrated background */}
      <div className="relative w-full overflow-hidden bg-[#0B0C0E] pt-20 sm:pt-24 lg:pt-28">
        {/* Subtle diagonal gradient sweep */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            background:
              "linear-gradient(135deg, rgba(220, 38, 38, 0.1) 0%, transparent 50%, rgba(107, 114, 128, 0.05) 100%)",
          }}
        />
        
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-12">
            {/* Left Column: Content */}
            <div className="text-center lg:text-left">
              {/* Badge */}
              <div className="mb-3 inline-flex items-center gap-2 border-l-2 border-red-600 pl-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  2026 CALENDAR
                </span>
                <div className="h-1.5 w-1.5 rounded-full bg-red-600" />
              </div>
              
              {/* Headline */}
              <h1 className="text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-5xl">
                YOUR F1 WEEKEND.
                <br />
                <span className="text-red-600">PLANNED.</span>
              </h1>
              
              {/* Value Proposition - Benefit-focused */}
              <div className="mt-5 space-y-3">
                <p className="text-lg font-medium leading-relaxed text-white sm:text-xl">
                  Stop juggling 10 tabs. Get your complete race weekend itinerary in seconds.
                </p>
                <p className="text-base leading-relaxed text-gray-400 sm:text-lg">
                  Personalized flights, stays, tickets, and local experiences—all curated around the 2026 F1 calendar.
                </p>
              </div>
              
              {/* CTA */}
              <div className="mt-8 space-y-2">
                <Link
                  href="/trip"
                  className="inline-flex items-center gap-2 rounded-md bg-red-600 px-6 py-3 text-base font-semibold text-white shadow-lg transition-all duration-200 hover:translate-x-1 hover:brightness-110 hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                >
                  Plan Your Trip
                  <span className="text-lg">→</span>
                </Link>
                <p className="text-xs text-gray-500 sm:text-sm">
                  Takes 30 seconds • No sign-up required to explore
                </p>
              </div>
            </div>
            
            {/* Right Column: Preview Strip */}
            <div className="relative hidden lg:block">
              <div className="rounded-lg border border-gray-800/50 bg-gray-900/30 p-6 backdrop-blur-sm">
                {/* Sample output label */}
                <div className="mb-4">
                  <span className="text-xs font-medium uppercase tracking-wider text-gray-500">
                    Sample Output
                  </span>
                </div>
                
                {/* Race name */}
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-white">Monaco Grand Prix</h3>
                  <p className="text-xs text-gray-500">Jun 7, 2026 • Monte Carlo</p>
                </div>
                
                {/* Date option pills */}
                <div className="mb-5 flex gap-2">
                  <div className="animate-subtle-pulse rounded-sm border border-red-600/30 bg-red-600/10 px-3 py-1.5 text-xs font-medium text-red-400 shadow-sm shadow-red-600/20">
                    <span className="block">A</span>
                    <span className="text-[10px] text-red-500/70">Jun 3-9</span>
                  </div>
                  <div className="rounded-sm border border-gray-700 bg-gray-800/50 px-3 py-1.5 text-xs font-medium text-gray-500">
                    <span className="block">B</span>
                    <span className="text-[10px] text-gray-600">Jun 4-10</span>
                  </div>
                  <div className="rounded-sm border border-gray-700 bg-gray-800/50 px-3 py-1.5 text-xs font-medium text-gray-500">
                    <span className="block">C</span>
                    <span className="text-[10px] text-gray-600">Jun 5-11</span>
                  </div>
                </div>
                
                {/* Preview lines with realistic data */}
                <div className="space-y-2.5 border-t border-gray-800/50 pt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-0.5 w-14 bg-gray-700" />
                      <span className="text-xs text-gray-500">Flights</span>
                    </div>
                    <span className="text-[10px] text-gray-600">2 links</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-0.5 w-16 bg-gray-700" />
                      <span className="text-xs text-gray-500">Stays</span>
                    </div>
                    <span className="text-[10px] text-gray-600">3 links</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-0.5 w-12 bg-gray-700" />
                      <span className="text-xs text-gray-500">Tickets</span>
                    </div>
                    <span className="text-[10px] text-gray-600">1 link</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Connector - Gradient fade from hero to cards */}
      <div className="relative h-12 w-full bg-gradient-to-b from-[#0B0C0E] to-transparent" />

      {/* Cards Section - Starting Grid Layout */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Microcopy */}
        <p className="mb-8 text-center text-sm text-gray-500">
          3 steps. Pick a race. Set preferences. Get links.
        </p>
        
        <div className="relative">
          {/* Track rail behind cards */}
          <div className="absolute left-0 top-1/2 hidden h-px w-full -translate-y-1/2 bg-gray-800 lg:block" />
          
          <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-3">
            {/* Card 1 - Choose Your Race */}
            <Link
              href="/trip"
              className="group relative flex h-full transform transition-all duration-200 hover:-translate-y-1"
            >
              {/* Red node on track rail */}
              <div className="absolute -left-2 top-1/2 hidden h-2 w-2 -translate-y-1/2 rounded-full bg-red-600 transition-all duration-200 group-hover:scale-125 lg:block" />
              
              <div className="flex min-h-[180px] w-full flex-col rounded-lg border border-gray-800/50 bg-gray-900/30 p-6 shadow-sm backdrop-blur-sm transition-all duration-200 group-hover:border-red-600/50 group-hover:shadow-md group-hover:shadow-red-600/10">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-lg font-bold text-gray-600">01</span>
                  {/* Race Flag Icon */}
                  <svg
                    className="h-5 w-5 text-gray-600 transition-colors duration-200 group-hover:text-red-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-white">
                  Choose Your Race
                  <span className="ml-2 block h-0.5 w-8 bg-red-600 transition-all duration-200 group-hover:w-12" />
                </h3>
                <p className="mt-3 flex-grow text-sm leading-relaxed text-gray-400">
                  Select from all 2026 F1 races around the world
                </p>
                <div className="mt-4 flex items-center text-xs text-gray-500 transition-colors duration-200 group-hover:text-red-600">
                  <span>Get started</span>
                  <svg
                    className="ml-1 h-3 w-3 transition-transform duration-200 group-hover:translate-x-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </Link>
            
            {/* Card 2 - Set Your Preferences */}
            <Link
              href="/trip"
              className="group relative flex h-full transform transition-all duration-200 hover:-translate-y-1"
            >
              {/* Red node on track rail */}
              <div className="absolute -left-2 top-1/2 hidden h-2 w-2 -translate-y-1/2 rounded-full bg-red-600 transition-all duration-200 group-hover:scale-125 lg:block" />
              
              <div className="flex min-h-[180px] w-full flex-col rounded-lg border border-gray-800/50 bg-gray-900/30 p-6 shadow-sm backdrop-blur-sm transition-all duration-200 group-hover:border-red-600/50 group-hover:shadow-md group-hover:shadow-red-600/10">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-lg font-bold text-gray-600">02</span>
                  {/* Settings Gear Icon */}
                  <svg
                    className="h-5 w-5 text-gray-600 transition-colors duration-200 group-hover:text-red-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-white">
                  Set Your Preferences
                  <span className="ml-2 block h-0.5 w-8 bg-red-600 transition-all duration-200 group-hover:w-12" />
                </h3>
                <p className="mt-3 flex-grow text-sm leading-relaxed text-gray-400">
                  Enter your origin city, trip duration, and budget tier
                </p>
                <div className="mt-4 flex items-center text-xs text-gray-500 transition-colors duration-200 group-hover:text-red-600">
                  <span>Get started</span>
                  <svg
                    className="ml-1 h-3 w-3 transition-transform duration-200 group-hover:translate-x-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </Link>
            
            {/* Card 3 - Get Your Itinerary */}
            <Link
              href="/trip"
              className="group relative flex h-full transform transition-all duration-200 hover:-translate-y-1"
            >
              {/* Red node on track rail */}
              <div className="absolute -left-2 top-1/2 hidden h-2 w-2 -translate-y-1/2 rounded-full bg-red-600 transition-all duration-200 group-hover:scale-125 lg:block" />
              
              <div className="flex min-h-[180px] w-full flex-col rounded-lg border border-gray-800/50 bg-gray-900/30 p-6 shadow-sm backdrop-blur-sm transition-all duration-200 group-hover:border-red-600/50 group-hover:shadow-md group-hover:shadow-red-600/10">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-lg font-bold text-gray-600">03</span>
                  {/* Document Icon */}
                  <svg
                    className="h-5 w-5 text-gray-600 transition-colors duration-200 group-hover:text-red-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-white">
                  Get Your Itinerary
                  <span className="ml-2 block h-0.5 w-8 bg-red-600 transition-all duration-200 group-hover:w-12" />
                </h3>
                <p className="mt-3 flex-grow text-sm leading-relaxed text-gray-400">
                  Receive curated date options with flight, hotel, and ticket links
                </p>
                <div className="mt-4 flex items-center text-xs text-gray-500 transition-colors duration-200 group-hover:text-red-600">
                  <span>Get started</span>
                  <svg
                    className="ml-1 h-3 w-3 transition-transform duration-200 group-hover:translate-x-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
