import Link from "next/link";
import { raceRepo } from "@/server/repositories/raceRepo";
import { CircuitIcon } from "./CircuitIcon";

/**
 * Footer component with circuit icons and essential links.
 * Displays all 2026 F1 circuits as clickable icons for quick race discovery.
 */
export async function Footer() {
  const races = raceRepo.listRaces(2026);
  const today = new Date();
  
  // Find the next upcoming race
  const nextRace = races.find(
    (race) => new Date(race.raceDateISO) > today
  );

  return (
    <footer className="fixed bottom-0 z-50 w-full border-t border-white/5 bg-[#14171C]/95 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Circuit Icons Row - Centered with horizontal scroll when needed */}
        <div className="mb-2 overflow-x-auto scrollbar-hide overflow-y-hidden">
          <div className="flex items-center justify-center gap-2.5 sm:gap-3 min-w-max py-2" style={{ position: 'relative' }}>
            {races.map((race) => (
              <CircuitIcon
                key={race.id}
                race={race}
                isNextRace={nextRace?.id === race.id}
              />
            ))}
          </div>
        </div>

        {/* Footer Links - Centered */}
        <div className="flex flex-col items-center gap-1.5 border-t border-white/5 pt-1.5 pb-2 sm:flex-row sm:justify-between">
          <div className="flex flex-wrap items-center justify-center gap-2.5 text-[10px] text-gray-500">
            <Link
              href="/privacy"
              className="transition-colors hover:text-gray-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 focus-visible:ring-2 focus-visible:ring-red-500"
            >
              Privacy
            </Link>
            <span className="text-gray-600">•</span>
            <Link
              href="/terms"
              className="transition-colors hover:text-gray-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 focus-visible:ring-2 focus-visible:ring-red-500"
            >
              Terms
            </Link>
            <span className="text-gray-600">•</span>
            <Link
              href="/contact"
              className="transition-colors hover:text-gray-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 focus-visible:ring-2 focus-visible:ring-red-500"
            >
              Contact
            </Link>
          </div>
          <span className="text-[10px] text-gray-600">
            © {new Date().getFullYear()} F1 Travel
          </span>
        </div>
      </div>
    </footer>
  );
}
