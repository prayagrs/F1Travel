"use client";

type TicketSourceFilterChipsProps = {
  sources: string[];
  selected: string | null;
  onChange: (source: string | null) => void;
};

/**
 * Chips to filter ticket options by source (Official F1, circuit, etc.).
 */
export function TicketSourceFilterChips({
  sources,
  selected,
  onChange,
}: TicketSourceFilterChipsProps) {
  if (sources.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 mb-3">
      <span className="text-sm text-gray-400 mr-1">Source:</span>
      <button
        type="button"
        onClick={() => onChange(null)}
        className={`inline-flex items-center rounded-full px-3 py-1.5 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900 ${
          selected === null
            ? "bg-red-600/20 text-red-400 border border-red-500/40 hover:bg-red-600/30"
            : "bg-gray-800 text-gray-500 border border-gray-600 hover:bg-gray-700 hover:text-gray-400"
        }`}
        aria-pressed={selected === null}
      >
        All
      </button>
      {sources.map((source) => (
        <button
          key={source}
          type="button"
          onClick={() => onChange(selected === source ? null : source)}
          className={`inline-flex items-center rounded-full px-3 py-1.5 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900 ${
            selected === source
              ? "bg-red-600/20 text-red-400 border border-red-500/40 hover:bg-red-600/30"
              : "bg-gray-800 text-gray-500 border border-gray-600 hover:bg-gray-700 hover:text-gray-400"
          }`}
          aria-pressed={selected === source}
        >
          {source}
        </button>
      ))}
    </div>
  );
}
