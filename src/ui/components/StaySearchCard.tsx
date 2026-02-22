import Image from "next/image";
import type { ProviderLink } from "@/domain/itinerary/types";

type StaySearchCardProps = {
  link: ProviderLink;
  subtitle: string;
  ctaLabel?: string;
};

/** Fallback icon when no logo: building/accommodation (same size as FlightSearchCard fallback). */
function StayFallbackIcon({ className }: { className?: string }) {
  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-lg bg-gray-800 text-gray-400 ${className ?? "h-14 w-14"}`}
      aria-hidden
    >
      <svg
        className="h-7 w-7"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
        />
      </svg>
    </span>
  );
}

export function StaySearchCard({
  link,
  subtitle,
  ctaLabel = "Search",
}: StaySearchCardProps) {
  return (
    <div className="flex flex-col rounded-lg border border-gray-700 bg-gray-800/50 transition-colors hover:border-gray-600">
      <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <div className="flex items-center gap-3">
          {link.logo ? (
            <span className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-transparent">
              <Image
                src={link.logo}
                alt=""
                width={56}
                height={56}
                className="object-contain"
              />
            </span>
          ) : (
            <StayFallbackIcon />
          )}
          <div className="space-y-0.5">
            <p className="font-medium text-white">
              {link.label}
              {link.isAffiliate && (
                <span className="ml-2 text-xs font-normal text-gray-500" aria-label="Partner link">
                  Partner
                </span>
              )}
            </p>
            <p className="text-sm text-gray-400">Source: {link.label}</p>
            <p className="text-sm text-gray-400">{subtitle}</p>
          </div>
        </div>
        <div className="flex shrink-0 items-center justify-end">
          <a
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900 min-h-[44px]"
            aria-label={`Search accommodation on ${link.label}`}
          >
            {ctaLabel}
          </a>
        </div>
      </div>
    </div>
  );
}
