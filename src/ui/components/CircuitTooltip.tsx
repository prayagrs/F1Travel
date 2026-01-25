"use client";

type CircuitTooltipProps = {
  raceName: string;
};

/**
 * Tooltip component that displays only the Grand Prix name on hover.
 * Appears above the footer with smaller text.
 */
export function CircuitTooltip({ raceName }: CircuitTooltipProps) {
  return (
    <div
      className="pointer-events-none absolute bottom-full left-1/2 z-[100] mb-1.5 -translate-x-1/2 whitespace-nowrap rounded bg-gray-900 px-2 py-1 text-[10px] font-normal text-gray-300 opacity-0 shadow-lg ring-1 ring-gray-800 transition-opacity duration-200 group-hover:opacity-100"
      role="tooltip"
      aria-hidden="true"
    >
      {/* Tooltip arrow */}
      <div
        className="absolute left-1/2 top-full -translate-x-1/2 -mt-px border-2 border-transparent border-t-gray-900"
        aria-hidden="true"
      />
      
      {/* Tooltip content - only race name */}
      <span>{raceName}</span>
    </div>
  );
}
