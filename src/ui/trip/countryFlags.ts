/**
 * Country name → flag emoji for F1 race countries (2026 calendar).
 * Used in Race Weekend dropdown for quick visual scanning.
 */
const COUNTRY_FLAGS: Record<string, string> = {
  Australia: "🇦🇺",
  Azerbaijan: "🇦🇿",
  Bahrain: "🇧🇭",
  Belgium: "🇧🇪",
  Brazil: "🇧🇷",
  Canada: "🇨🇦",
  China: "🇨🇳",
  Hungary: "🇭🇺",
  Italy: "🇮🇹",
  Japan: "🇯🇵",
  Mexico: "🇲🇽",
  Monaco: "🇲🇨",
  Netherlands: "🇳🇱",
  Qatar: "🇶🇦",
  "Saudi Arabia": "🇸🇦",
  Singapore: "🇸🇬",
  Spain: "🇪🇸",
  Austria: "🇦🇹",
  "United Kingdom": "🇬🇧",
  "United States": "🇺🇸",
  "United Arab Emirates": "🇦🇪",
};

export function getCountryFlag(country: string): string {
  return COUNTRY_FLAGS[country] ?? "🏁";
}
