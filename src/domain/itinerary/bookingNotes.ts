/**
 * Parses booking notes into displayable badges/summary.
 * Splits by comma; short parts become badges; long notes get a summary.
 */

const MAX_VISIBLE_BADGES = 4;

export function parseNotesToBadges(notes: string | null | undefined): string[] {
  if (!notes?.trim()) return [];
  return notes
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
    .slice(0, MAX_VISIBLE_BADGES);
}

export function hasLongNotes(notes: string | null | undefined): boolean {
  if (!notes?.trim()) return false;
  return notes.trim().length > 100;
}
