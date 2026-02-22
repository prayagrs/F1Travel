import Image from "next/image";
import type { ExperienceActivity, ProviderLink } from "@/domain/itinerary/types";

type ExperienceProviderCardProps = {
  link: ProviderLink;
  subtitle: string;
  /** Optional 1–2 curated activities to show under the provider CTA */
  activities?: ExperienceActivity[];
  ctaLabel?: string;
};

function ExperienceFallbackIcon({ className }: { className?: string }) {
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
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
        />
      </svg>
    </span>
  );
}

export function ExperienceProviderCard({
  link,
  subtitle,
  activities = [],
  ctaLabel = "Search",
}: ExperienceProviderCardProps) {
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
            <ExperienceFallbackIcon />
          )}
          <div className="space-y-0.5">
            <p className="font-medium text-white">{link.label}</p>
            <p className="text-sm text-gray-400">{subtitle}</p>
          </div>
        </div>
        <div className="flex shrink-0 items-center justify-end">
          <a
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900 min-h-[44px]"
            aria-label={`Search experiences on ${link.label}`}
          >
            {ctaLabel}
          </a>
        </div>
      </div>
      {activities.length > 0 && (
        <div className="border-t border-gray-700/80 px-4 pb-4 pt-2">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500 mb-2">
            Top picks
          </p>
          <ul className="space-y-2">
            {activities.map((activity, index) => (
              <li key={index}>
                <a
                  href={activity.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-200 hover:text-white hover:underline focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900 rounded"
                >
                  {activity.title}
                </a>
                {activity.description && (
                  <p className="text-xs text-gray-400 mt-0.5">{activity.description}</p>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
