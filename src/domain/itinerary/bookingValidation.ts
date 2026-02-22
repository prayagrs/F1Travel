/**
 * Validation for Add booking form and POST /api/itineraries/[id]/bookings.
 * Returns a single user-facing error message or null if valid.
 * Plan: one clear error per submit; length limits, URL format, optional confirmation format.
 */

const PROVIDER_MAX = 100;
const CONFIRMATION_REF_MAX = 100;
const NOTES_MAX = 500;

/** Allowed characters for confirmation ref: letters, numbers, spaces, hyphens. */
const CONFIRMATION_REF_REGEX = /^[A-Za-z0-9\s\-]+$/;

function isValidHttpUrl(s: string): boolean {
  const trimmed = s.trim();
  if (!trimmed) return true;
  try {
    const u = new URL(trimmed);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

export type ValidateBookingInput = {
  type: string;
  provider: string;
  confirmationRef: string;
  detailsUrl?: string | null;
  notes?: string | null;
};

/**
 * Validates booking input. Returns one user-facing error string or null.
 */
export function validateBookingInput(input: ValidateBookingInput): string | null {
  const { type, provider, confirmationRef, detailsUrl, notes } = input;
  const providerTrim = provider?.trim() ?? "";
  const confirmationTrim = confirmationRef?.trim() ?? "";

  if (!type || !["flight", "stay", "ticket", "activity"].includes(type)) {
    return "Invalid booking type.";
  }
  if (!providerTrim) {
    return "Provider and confirmation number are required.";
  }
  if (!confirmationTrim) {
    return "Provider and confirmation number are required.";
  }
  if (providerTrim.length > PROVIDER_MAX) {
    return "Provider name is too long.";
  }
  if (confirmationTrim.length > CONFIRMATION_REF_MAX) {
    return "Confirmation number is too long.";
  }
  if (!CONFIRMATION_REF_REGEX.test(confirmationTrim)) {
    return "Use only letters, numbers, and hyphens for the confirmation number.";
  }
  const details = detailsUrl?.trim();
  if (details && !isValidHttpUrl(details)) {
    return "Please enter a valid link.";
  }
  const notesStr = notes?.trim();
  if (notesStr && notesStr.length > NOTES_MAX) {
    return "Notes are too long.";
  }
  return null;
}
