import { describe, it, expect, vi, beforeEach } from "vitest";
import { getMergedItineraryResult } from "./itineraryMerge";
import type { ItineraryRecord } from "@/server/repositories/itineraryRepo";
import type { ItineraryResult, TripRequest, DateOption } from "@/domain/itinerary/types";
import type { RaceWeekend } from "@/domain/races/types";

vi.mock("@/server/repositories/raceRepo", () => ({
  raceRepo: {
    getRaceById: vi.fn(),
  },
}));

import { raceRepo } from "@/server/repositories/raceRepo";

function minimalRace(overrides: Partial<RaceWeekend> = {}): RaceWeekend {
  return {
    id: "monaco-gp",
    name: "Monaco Grand Prix",
    circuit: "Circuit de Monaco",
    city: "Monte Carlo",
    country: "Monaco",
    raceDateISO: "2026-06-07",
    ...overrides,
  };
}

function minimalRequest(overrides: Partial<TripRequest> = {}): TripRequest {
  return {
    originCity: "Tokyo",
    raceId: "monaco-gp",
    durationDays: 10,
    budgetTier: "$$",
    ...overrides,
  };
}

function minimalDateOption(overrides: Partial<DateOption> = {}): DateOption {
  return {
    key: "opt1",
    label: "Jun 2 - Jun 12",
    departDateISO: "2026-06-02",
    returnDateISO: "2026-06-12",
    ...overrides,
  };
}

describe("itineraryMerge", () => {
  describe("getMergedItineraryResult", () => {
    beforeEach(() => {
      vi.mocked(raceRepo.getRaceById).mockReturnValue(null);
    });

    it("rebuilds staysByOption so each stay link has a logo", () => {
      const storedStaysWithoutLogos = {
        opt1: {
          title: "Accommodation",
          links: [
            { label: "Booking.com", href: "https://www.booking.com/old" },
            { label: "Airbnb", href: "https://www.airbnb.com/old" },
            { label: "Google Hotels", href: "https://www.google.com/travel/hotels/old" },
          ],
          notes: ["Tip one"],
        },
      };

      const resultJson: ItineraryResult = {
        request: minimalRequest(),
        race: minimalRace(),
        dateOptions: [minimalDateOption()],
        flightsByOption: {},
        staysByOption: storedStaysWithoutLogos,
        tickets: { title: "Race Tickets", links: [] },
        experiences: { title: "Experiences", links: [] },
      };

      const record: ItineraryRecord = {
        id: "rec-1",
        userId: "user-1",
        originCity: resultJson.request.originCity,
        raceId: resultJson.request.raceId,
        durationDays: resultJson.request.durationDays,
        budgetTier: resultJson.request.budgetTier,
        resultJson,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const merged = getMergedItineraryResult(record);

      expect(merged.staysByOption).toBeDefined();
      expect(merged.staysByOption.opt1).toBeDefined();
      expect(merged.staysByOption.opt1.title).toBe("Accommodation");
      expect(merged.staysByOption.opt1.links).toHaveLength(3);

      const links = merged.staysByOption.opt1.links;
      expect(links[0].label).toBe("Booking.com");
      expect(links[0].logo).toBe("/logos/booking.svg");
      expect(links[1].label).toBe("Airbnb");
      expect(links[1].logo).toBe("/logos/airbnb.svg");
      expect(links[2].label).toBe("Google Hotels");
      expect(links[2].logo).toBe("/logos/google.svg");
    });

    it("rebuilds staysByOption for every date option key", () => {
      const dateOptions: DateOption[] = [
        minimalDateOption({ key: "a", label: "Jun 1 - Jun 10", departDateISO: "2026-06-01", returnDateISO: "2026-06-10" }),
        minimalDateOption({ key: "b", label: "Jun 2 - Jun 12", departDateISO: "2026-06-02", returnDateISO: "2026-06-12" }),
      ];

      const resultJson: ItineraryResult = {
        request: minimalRequest(),
        race: minimalRace(),
        dateOptions,
        flightsByOption: {},
        staysByOption: {},
        tickets: { title: "Race Tickets", links: [] },
        experiences: { title: "Experiences", links: [] },
      };

      const record: ItineraryRecord = {
        id: "rec-1",
        userId: "user-1",
        originCity: resultJson.request.originCity,
        raceId: resultJson.request.raceId,
        durationDays: resultJson.request.durationDays,
        budgetTier: resultJson.request.budgetTier,
        resultJson,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const merged = getMergedItineraryResult(record);

      expect(Object.keys(merged.staysByOption)).toEqual(["a", "b"]);
      expect(merged.staysByOption.a.links.every((l) => l.logo != null)).toBe(true);
      expect(merged.staysByOption.b.links.every((l) => l.logo != null)).toBe(true);
    });
  });
});
