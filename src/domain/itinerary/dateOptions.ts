import type { DateOption } from "./types";

/**
 * Generates exactly 3 date options (A, B, C) using offsets [-4, -3, -2] from raceDateISO.
 * Each option adds durationDays to the depart date to calculate the return date.
 */
export function generateDateOptions(
  raceDateISO: string,
  durationDays: number
): DateOption[] {
  const raceDate = new Date(raceDateISO);
  const offsets = [-4, -3, -2];
  const optionKeys = ["A", "B", "C"];

  return offsets.map((offset, index) => {
    const departDate = new Date(raceDate);
    departDate.setDate(departDate.getDate() + offset);

    const returnDate = new Date(departDate);
    returnDate.setDate(returnDate.getDate() + durationDays);

    const formatDate = (date: Date): string => {
      return date.toISOString().split("T")[0];
    };

    const formatLabel = (depart: Date, returnDate: Date): string => {
      const departMonth = depart.toLocaleDateString("en-US", { month: "short" });
      const departDay = depart.getDate();
      const returnMonth = returnDate.toLocaleDateString("en-US", { month: "short" });
      const returnDay = returnDate.getDate();

      return `${departMonth} ${departDay} - ${returnMonth} ${returnDay}`;
    };

    return {
      key: optionKeys[index],
      label: formatLabel(departDate, returnDate),
      departDateISO: formatDate(departDate),
      returnDateISO: formatDate(returnDate),
    };
  });
}
