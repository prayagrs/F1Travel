/**
 * Circuit SVG Loader - Scalable solution for loading external SVG files.
 * 
 * This utility maps race IDs to external SVG file configurations.
 * 
 * To add a new circuit SVG:
 * 1. Place the SVG file in public/circuit-svg/
 * 2. Open the SVG file and note its viewBox attribute (e.g., "144 144 512 512")
 * 3. Extract the path data from the SVG file (the <path d="..."> content)
 * 4. Add the path data to circuitPaths.ts with the race ID as the key
 * 5. Add an entry below with:
 *    - viewBox: the viewBox from the SVG file
 *    - strokeWidth: appropriate stroke width (usually 2 for detailed SVGs, 1.5 for simplified)
 * 
 * Example workflow:
 * - SVG file: public/circuit-svg/silverstone.svg
 * - ViewBox in SVG: "0 0 800 800"
 * - Path data: Extract from <path d="..."> and add to circuitPaths.ts as "british-gp": "..."
 * - Add entry here: "british-gp": { viewBox: "0 0 800 800", strokeWidth: "2" }
 */

export type CircuitSVGConfig = {
  /** ViewBox for the SVG (extracted from SVG file's viewBox attribute) */
  viewBox: string;
  /** Stroke width for the circuit path (usually 2 for detailed SVGs, 1.5 for simplified) */
  strokeWidth: string;
};

/**
 * Map of race IDs to their SVG configuration.
 * Add new circuits by:
 * 1. Placing SVG file in public/circuit-svg/
 * 2. Extracting path data and adding to circuitPaths.ts
 * 3. Adding entry here with viewBox and strokeWidth
 */
export const circuitSVGConfig: Record<string, CircuitSVGConfig> = {
  "monaco-gp": {
    viewBox: "144 144 512 512",
    strokeWidth: "2",
  },
  "brazilian-gp": {
    viewBox: "144 144 512 512",
    strokeWidth: "2",
  },
  // Add more circuits here as SVG files become available
  // Example:
  // "british-gp": {
  //   viewBox: "0 0 800 800",  // From SVG file's viewBox attribute
  //   strokeWidth: "2",
  // },
};

/**
 * Get SVG configuration for a race ID.
 * Returns undefined if no external SVG configuration exists (uses default settings).
 */
export function getCircuitSVGConfig(raceId: string): CircuitSVGConfig | undefined {
  return circuitSVGConfig[raceId];
}

/**
 * Check if a race has an external SVG configuration.
 * Circuits with external SVGs typically have custom viewBoxes and stroke widths.
 */
export function hasExternalSVG(raceId: string): boolean {
  return !!circuitSVGConfig[raceId];
}
