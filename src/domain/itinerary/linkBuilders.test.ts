import { describe, it, expect } from "vitest";
import { getOriginIata, getDestIata } from "./linkBuilders";

describe("linkBuilders", () => {
  describe("getOriginIata", () => {
    it("returns IATA code for known city (case insensitive)", () => {
      expect(getOriginIata("London")).toBe("LHR");
      expect(getOriginIata("london")).toBe("LHR");
      expect(getOriginIata("  New York  ")).toBe("JFK");
    });

    it("returns undefined for unknown city", () => {
      expect(getOriginIata("Unknown City")).toBeUndefined();
      expect(getOriginIata("")).toBeUndefined();
    });

    it("normalizes spaces", () => {
      expect(getOriginIata("San   Francisco")).toBe("SFO");
    });
  });

  describe("getDestIata", () => {
    it("returns IATA for race with known city", () => {
      expect(
        getDestIata({
          id: "monaco",
          name: "Monaco GP",
          circuit: "Monaco",
          city: "Monte Carlo",
          country: "Monaco",
          raceDateISO: "2025-05-25",
        })
      ).toBe("NCE");
    });

    it("returns airportCode when present", () => {
      expect(
        getDestIata({
          id: "suzuka",
          name: "Japanese GP",
          circuit: "Suzuka",
          city: "Suzuka",
          country: "Japan",
          airportCode: "NGO",
          raceDateISO: "2025-10-12",
        })
      ).toBe("NGO");
    });

    it("returns undefined when city has no mapping", () => {
      expect(
        getDestIata({
          id: "nowhere",
          name: "Nowhere GP",
          circuit: "Nowhere",
          city: "Nowhere",
          country: "XX",
          raceDateISO: "2025-01-01",
        })
      ).toBeUndefined();
    });
  });
});
