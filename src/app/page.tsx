import Link from "next/link";
import { PreviewStrip } from "@/ui/components/PreviewStrip";

/**
 * Public home page with CTA to /trip
 */
export default function Home() {
  return (
    <div className="w-full">
      {/* Skip to main content link for keyboard navigation */}
      <a
        href="#main-content"
        className="sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:w-auto focus:h-auto focus:overflow-visible focus:clip-auto focus:whitespace-normal focus:rounded-md focus:bg-red-600 focus:px-4 focus:py-2 focus:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
      >
        Skip to main content
      </a>
      
      {/* Hero Section - Full width with integrated background and F1 visuals */}
      <div className="relative w-full overflow-hidden bg-[#0B0C0E] pt-20 sm:pt-24 lg:pt-28">
        {/* F1 Checkered Flag Pattern - Very subtle */}
        <div className="pointer-events-none absolute inset-0 checkered-pattern opacity-30" aria-hidden="true" />
        
        {/* Circuit Track Lines - Racing lines effect */}
        <div className="pointer-events-none absolute inset-0 circuit-lines opacity-40" aria-hidden="true" />
        
        {/* F1 Grid Lines - Starting grid effect */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 grid-lines opacity-20" aria-hidden="true" />
        
        {/* Animated gradient background for visual energy */}
        <div
          className="pointer-events-none absolute inset-0 opacity-20"
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
              "radial-gradient(circle, rgba(220, 38, 38, 0.25) 0%, transparent 70%), linear-gradient(135deg, rgba(220, 38, 38, 0.3) 0%, transparent 50%, rgba(59, 130, 246, 0.15) 100%)",
          }}
          aria-hidden="true"
        />
        
        {/* Animated gradient sweep - Creates motion */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.12] animate-gradient-sweep"
          style={{
            background:
              "linear-gradient(135deg, rgba(220, 38, 38, 0.25) 0%, transparent 40%, rgba(107, 114, 128, 0.15) 60%, transparent 100%)",
          }}
          aria-hidden="true"
        />
        
        {/* Speed Lines Effect - Dynamic racing motion */}
        <div className="pointer-events-none absolute inset-0 speed-lines opacity-40" aria-hidden="true" />
        
        {/* Speed Blur Effect - Racing motion streaks */}
        <div 
          className="pointer-events-none absolute inset-0 animate-speed-blur"
          style={{
            background: "linear-gradient(90deg, transparent, rgba(220, 38, 38, 0.2), transparent)",
          }}
          aria-hidden="true"
        />
        
        {/* Enhanced animated red accent dots with F1 pulse */}
        <div className="pointer-events-none absolute top-20 right-20 h-2.5 w-2.5 rounded-full bg-red-600 animate-f1-pulse shadow-lg shadow-red-600/50" aria-hidden="true" />
        <div className="pointer-events-none absolute bottom-32 left-16 h-2 w-2 rounded-full bg-red-500 animate-f1-pulse delay-1000 shadow-lg shadow-red-500/40" aria-hidden="true" />
        <div className="pointer-events-none absolute top-1/3 right-1/4 h-1.5 w-1.5 rounded-full bg-red-400 animate-f1-pulse delay-2000 shadow-lg shadow-red-400/30" aria-hidden="true" />
        
        {/* Additional racing accent - Top left */}
        <div className="pointer-events-none absolute top-1/4 left-1/5 h-1 w-1 rounded-full bg-blue-500 opacity-60 animate-pulse delay-500" aria-hidden="true" />
        
        <div className="relative z-10 mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
          <div className="grid gap-6 sm:gap-8 lg:grid-cols-2 lg:items-center lg:gap-12">
            {/* Left Column: Content */}
            <div className="relative z-10 order-1 text-center lg:order-none lg:text-left">
              {/* Badge */}
              <div className="mb-3 inline-flex items-center gap-2 border-l-2 border-red-600 pl-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-300">
                  2026 CALENDAR
                </span>
                <div className="h-1.5 w-1.5 rounded-full bg-red-600" aria-hidden="true" />
              </div>
              
              {/* Headline - Increased size for better hierarchy */}
              <h1 className="font-heading text-5xl font-bold leading-tight tracking-tight text-white sm:text-6xl lg:text-7xl">
                YOUR F1 WEEKEND.
                <br />
                <span className="text-red-600">PLANNED.</span>
              </h1>
              
              {/* Value Proposition - Single punchy line */}
              <div className="mt-5">
                <p className="text-xl font-medium leading-relaxed text-white sm:text-2xl">
                  Stop juggling 10 tabs. Get your complete F1 weekend itinerary in seconds.
                </p>
              </div>
              
              {/* CTA */}
              <div className="mt-8 space-y-4">
                {/* Primary CTA - Single, prominent */}
                <div className="flex justify-center sm:justify-start">
                  <Link
                    href="/trip"
                    className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-md bg-red-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-200 hover:translate-x-1 hover:brightness-110 hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 focus-visible:ring-2 focus-visible:ring-red-500"
                    aria-label="Plan your F1 race weekend trip"
                  >
                    Plan Your Trip
                    <span className="text-xl" aria-hidden="true">→</span>
                  </Link>
                </div>
                
                {/* Secondary action - Subtle text link */}
                <div className="flex flex-col items-center gap-1.5 sm:items-start">
                  <Link
                    href="/sample-itinerary"
                    className="text-sm text-gray-400 transition-colors hover:text-red-400 underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 focus-visible:ring-2 focus-visible:ring-red-500"
                    aria-label="View sample itinerary to see what you'll get"
                  >
                    View sample itinerary
                  </Link>
                  <p className="text-xs text-gray-500">
                    Takes 30 seconds • No sign-up required to explore
                  </p>
                </div>
                
                {/* Essential Trust Signals - Consolidated to one line */}
                <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-gray-400 sm:justify-start">
                  <div className="flex items-center gap-1.5">
                    <svg className="h-3.5 w-3.5 text-green-500" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Free to use</span>
                  </div>
                  <span className="text-gray-600">•</span>
                  <div className="flex items-center gap-1.5">
                    <svg className="h-3.5 w-3.5 text-blue-500" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    <span>Secure</span>
                  </div>
                  <span className="text-gray-600">•</span>
                  <div className="flex items-center gap-1.5">
                    <svg className="h-3.5 w-3.5 text-red-500" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                      <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                    </svg>
                    <span>No credit card</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right Column: Preview Strip - Enhanced for F1 fans with interactivity */}
            <PreviewStrip />
          </div>
        </div>
      </div>

      {/* Visual Connector - Gradient fade from hero to cards - Decorative only */}
      <div className="relative h-12 w-full bg-gradient-to-b from-[#0B0C0E] to-transparent" aria-hidden="true" />

      {/* Cards Section - Starting Grid Layout */}
      <section id="main-content" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8" aria-label="How it works">
        {/* Section Header */}
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            How It Works
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            3 steps. Pick a race. Set preferences. Get links.
          </p>
        </div>
        
        <div className="relative">
          {/* Track rail behind cards - Decorative only */}
          <div className="absolute left-0 top-1/2 hidden h-px w-full -translate-y-1/2 bg-gray-800 lg:block" aria-hidden="true" />
          
          <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-3">
            {/* Card 1 - Choose Your Race */}
            <Link
              href="/trip"
              className="group relative flex h-full transform transition-all duration-200 hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 focus-visible:ring-2 focus-visible:ring-red-500"
              aria-label="Step 1: Choose your race - Select from all 2026 F1 races around the world"
            >
              {/* Red node on track rail - Decorative only */}
              <div className="absolute -left-2 top-1/2 hidden h-2 w-2 -translate-y-1/2 rounded-full bg-red-600 transition-all duration-200 group-hover:scale-125 lg:block" aria-hidden="true" />
              
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
                <p className="mt-3 flex-grow text-sm leading-relaxed text-gray-300">
                  Select from all 2026 F1 races around the world
                </p>
                <div className="mt-4 flex items-center text-xs text-gray-400 transition-colors duration-200 group-hover:text-red-600">
                  <span>Get started</span>
                  <svg
                    className="ml-1 h-3 w-3 transition-transform duration-200 group-hover:translate-x-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
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
              className="group relative flex h-full transform transition-all duration-200 hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 focus-visible:ring-2 focus-visible:ring-red-500"
              aria-label="Step 2: Set your preferences - Enter your origin city, trip duration, and budget tier"
            >
              {/* Red node on track rail - Decorative only */}
              <div className="absolute -left-2 top-1/2 hidden h-2 w-2 -translate-y-1/2 rounded-full bg-red-600 transition-all duration-200 group-hover:scale-125 lg:block" aria-hidden="true" />
              
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
                <p className="mt-3 flex-grow text-sm leading-relaxed text-gray-300">
                  Enter your origin city, trip duration, and budget tier
                </p>
                <div className="mt-4 flex items-center text-xs text-gray-400 transition-colors duration-200 group-hover:text-red-600">
                  <span>Get started</span>
                  <svg
                    className="ml-1 h-3 w-3 transition-transform duration-200 group-hover:translate-x-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
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
              className="group relative flex h-full transform transition-all duration-200 hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 focus-visible:ring-2 focus-visible:ring-red-500"
              aria-label="Step 3: Get your itinerary - Receive curated date options with flight, hotel, and ticket links"
            >
              {/* Red node on track rail - Decorative only */}
              <div className="absolute -left-2 top-1/2 hidden h-2 w-2 -translate-y-1/2 rounded-full bg-red-600 transition-all duration-200 group-hover:scale-125 lg:block" aria-hidden="true" />
              
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
                <p className="mt-3 flex-grow text-sm leading-relaxed text-gray-300">
                  Receive curated date options with flight, hotel, and ticket links
                </p>
                <div className="mt-4 flex items-center text-xs text-gray-400 transition-colors duration-200 group-hover:text-red-600">
                  <span>Get started</span>
                  <svg
                    className="ml-1 h-3 w-3 transition-transform duration-200 group-hover:translate-x-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
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
      </section>
    </div>
  );
}
