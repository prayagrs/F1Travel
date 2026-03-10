/**
 * Heuristic parser for pasted confirmation text.
 * Extracts provider, confirmation ref, and URL from emails or web pages.
 * Best-effort; returns partial results when possible.
 */

export type ParsedConfirmation = {
  provider?: string;
  confirmationRef?: string;
  detailsUrl?: string;
};

/** Known provider names (case-insensitive) for matching in pasted text. */
const KNOWN_PROVIDERS = [
  "Booking.com",
  "Airbnb",
  "Google Hotels",
  "Google Flights",
  "Skyscanner",
  "Kayak",
  "Official F1",
  "Official F1 Tickets",
  "GetYourGuide",
  "Viator",
  "TripAdvisor",
  "Expedia",
  "Hotels.com",
  "Agoda",
  "British Airways",
  "United",
  "Delta",
  "American Airlines",
  "Emirates",
  "Qantas",
  "Jetstar",
  "Virgin",
];

/** Patterns for confirmation/reference numbers. */
const CONFIRMATION_PATTERNS = [
  /(?:confirmation|reference|ref|booking)\s*(?:number|#|no\.?|id)?\s*[:\s]*([A-Za-z0-9\-]{5,50})/i,
  /(?:reservation|pnr)\s*(?:code|number|#)?\s*[:\s]*([A-Za-z0-9\-]{5,20})/i,
  /(?:code|id)\s*[:\s]*([A-Za-z0-9\-]{6,30})/i,
  /\b([A-Z]{2}\d{6,10})\b/,
  /\b([A-Z0-9]{8,16})\b/,
  /\b(\d{6,12}[A-Z]?)\b/,
];

/** Extract first https URL from text. */
function extractUrl(text: string): string | undefined {
  const urlMatch = text.match(/https?:\/\/[^\s<>"']+/);
  return urlMatch ? urlMatch[0].replace(/[.,;:)]+$/, "") : undefined;
}

/** Find best provider match in text (case-insensitive). */
function matchProvider(text: string): string | undefined {
  const lower = text.toLowerCase();
  for (const p of KNOWN_PROVIDERS) {
    if (lower.includes(p.toLowerCase())) {
      return p;
    }
  }
  return undefined;
}

/** Extract confirmation/reference using patterns. Prefer longer, more specific matches. */
function extractConfirmation(text: string): string | undefined {
  let best: string | undefined;
  for (const re of CONFIRMATION_PATTERNS) {
    const m = text.match(re);
    if (m && m[1]) {
      const candidate = m[1].trim();
      if (candidate.length >= 5 && (!best || candidate.length > best.length)) {
        best = candidate;
      }
    }
  }
  return best;
}

/**
 * Parse pasted text for provider, confirmation ref, and URL.
 * Returns partial results; caller should validate and let user review.
 */
export function parseConfirmationText(text: string): ParsedConfirmation {
  const result: ParsedConfirmation = {};
  const trimmed = text?.trim() ?? "";
  if (!trimmed) return result;

  result.provider = matchProvider(trimmed);
  result.confirmationRef = extractConfirmation(trimmed);
  result.detailsUrl = extractUrl(trimmed);

  return result;
}
