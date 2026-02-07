/**
 * Itinerary layout. Wraps /itinerary/[id] with F1 theme background (matches Account).
 * Auth and content are handled by the [id] page.
 */
export default function ItineraryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-[#0B0C0E] pt-12 sm:pt-16 pb-28 sm:pb-32">
      {/* F1 Background Patterns — match Account theme */}
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
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06] animate-racing-sweep"
        style={{
          background:
            "radial-gradient(circle, rgba(220, 38, 38, 0.3) 0%, transparent 70%), linear-gradient(135deg, rgba(220, 38, 38, 0.2) 0%, transparent 50%)",
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05] animate-gradient-sweep"
        style={{
          background:
            "linear-gradient(135deg, rgba(220, 38, 38, 0.2) 0%, transparent 40%, rgba(107, 114, 128, 0.1) 60%, transparent 100%)",
        }}
        aria-hidden="true"
      />
      <div className="pointer-events-none absolute top-20 right-20 h-2 w-2 rounded-full bg-red-600 opacity-60 animate-f1-pulse" aria-hidden="true" />
      <div className="pointer-events-none absolute bottom-32 left-16 h-1.5 w-1.5 rounded-full bg-red-500 opacity-50 animate-f1-pulse delay-1000" aria-hidden="true" />
      <div className="pointer-events-none absolute top-1/3 right-1/4 h-1 w-1 rounded-full bg-red-400 opacity-40 animate-f1-pulse delay-2000" aria-hidden="true" />

      <div className="relative z-10 mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        {children}
      </div>
    </div>
  );
}
