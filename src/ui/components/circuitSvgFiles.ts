/**
 * Maps race IDs to SVG filenames in public/circuit-svg/.
 * Used by the footer to show actual circuit track SVGs.
 */
export const circuitSvgFiles: Record<string, string> = {
  "australian-gp": "RaceCircuitAlbertPark.svg",
  "chinese-gp": "RaceCircuitShanghai.svg",
  "japanese-gp": "RaceCircuitSuzuka.svg",
  "bahrain-gp": "RaceCircuitBahrain.svg",
  "saudi-arabian-gp": "saudiarabia.svg",
  "miami-gp": "usamiami.svg",
  "canadian-gp": "RaceCircuitGillesVilleneuve.svg",
  "monaco-gp": "monaco-svgfind-com.svg",
  "spanish-gp": "catalunya race-svgfind-com.svg",
  "austrian-gp": "austria.sg.svg",
  "british-gp": "RaceCircuitSilverstone.svg",
  "belgian-gp": "belgium-spa.svg",
  "hungarian-gp": "Hungary-svgfind-com.svg",
  "dutch-gp": "zandvoort race track-svgfind-com.svg",
  "italian-gp": "monza-svgfind-com.svg",
  "madrid-gp": "madrid.svg",
  "azerbaijan-gp": "baku street race-svgfind-com.svg",
  "singapore-gp": "RaceCircuitMarinaBay.svg",
  "united-states-gp": "RaceCircuitAmericas.svg",
  "mexican-gp": "mexico.svg",
  "brazilian-gp": "brasil-svgfind-com.svg",
  "las-vegas-gp": "usavegas.svg",
  "qatar-gp": "qatar.svg",
  "abu-dhabi-gp": "yas marina-svgfind-com.svg",
};

export function getCircuitSvgPath(raceId: string): string | null {
  const file = circuitSvgFiles[raceId];
  if (!file) return null;
  return `/circuit-svg/${encodeURIComponent(file)}`;
}
