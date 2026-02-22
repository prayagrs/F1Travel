/**
 * Display currencies supported on the itinerary page.
 * All prices are normalized to the selected display currency using approximate rates.
 */
export const DISPLAY_CURRENCIES = [
  "USD",
  "EUR",
  "GBP",
  "AUD",
  "CAD",
  "JPY",
  "SGD",
] as const;

export type DisplayCurrency = (typeof DISPLAY_CURRENCIES)[number];

/** Source currencies we can parse from content (e.g. ticket price strings). */
export type SourceCurrency =
  | "USD"
  | "EUR"
  | "GBP"
  | "AUD"
  | "CAD"
  | "JPY"
  | "SGD"
  | "MXN"
  | "BRL";

/** Approximate rate to USD (1 unit of source = rate USD). Used for normalizing to display currency. */
export const SOURCE_TO_USD: Record<SourceCurrency, number> = {
  USD: 1,
  EUR: 1.08,
  GBP: 1.27,
  AUD: 0.65,
  CAD: 0.72,
  JPY: 0.0067,
  SGD: 0.74,
  MXN: 0.058,
  BRL: 0.17,
};

/** Convert from source currency to display currency (via USD). */
export function convertToDisplay(
  value: number,
  from: SourceCurrency,
  to: DisplayCurrency
): number {
  const usd = value * SOURCE_TO_USD[from];
  const rateToDisplay = to === "USD" ? 1 : 1 / SOURCE_TO_USD[to as SourceCurrency];
  return usd * rateToDisplay;
}

export function formatInCurrency(value: number, currency: DisplayCurrency): string {
  if (currency === "JPY") return `¥${Math.round(value).toLocaleString()}`;
  if (currency === "GBP") return `£${Math.round(value).toLocaleString()}`;
  if (currency === "EUR") return `€${Math.round(value).toLocaleString()}`;
  if (currency === "AUD") return `AUD ${Math.round(value).toLocaleString()}`;
  if (currency === "CAD") return `CAD ${Math.round(value).toLocaleString()}`;
  if (currency === "SGD") return `SGD ${Math.round(value).toLocaleString()}`;
  return `$${Math.round(value).toLocaleString()}`;
}
