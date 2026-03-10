import type { DateOption } from "./types";

/** Format ISO date strings (YYYY-MM-DD) to human label (e.g. "Jun 7 - Jun 17") without timezone drift. */
function formatLabelFromISO(departISO: string, returnISO: string): string {
  const [dy, dm, dd] = departISO.split("-").map(Number);
  const [ry, rm, rd] = returnISO.split("-").map(Number);
  const departMonth = new Date(dy, dm - 1, dd).toLocaleDateString("en-US", {
    month: "short",
  });
  const returnMonth = new Date(ry, rm - 1, rd).toLocaleDateString("en-US", {
    month: "short",
  });
  return `${departMonth} ${dd} - ${returnMonth} ${rd}`;
}

/**
 * Generates exactly 3 date options (A, B, C) using offsets [-4, -3, -2] from raceDateISO.
 * Each option adds durationDays to the depart date to calculate the return date.
 * Uses UTC for date math so label and ISO strings stay consistent across timezones.
 */
export function generateDateOptions(
  raceDateISO: string,
  durationDays: number
): DateOption[] {
  const [y, m, d] = raceDateISO.slice(0, 10).split("-").map(Number);
  const raceDate = new Date(Date.UTC(y, m - 1, d));
  const offsets = [-4, -3, -2];
  const optionKeys = ["A", "B", "C"];

  return offsets.map((offset, index) => {
    const departDate = new Date(raceDate);
    departDate.setUTCDate(departDate.getUTCDate() + offset);

    const returnDate = new Date(departDate);
    returnDate.setUTCDate(returnDate.getUTCDate() + durationDays);

    const departISO = departDate.toISOString().split("T")[0];
    const returnISO = returnDate.toISOString().split("T")[0];

    return {
      key: optionKeys[index],
      label: formatLabelFromISO(departISO, returnISO),
      departDateISO: departISO,
      returnDateISO: returnISO,
    };
  });
}
