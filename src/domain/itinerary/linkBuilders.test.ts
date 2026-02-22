import { describe, it, expect } from "vitest";
import {
  getOriginIata,
  getDestIata,
  buildStaysLinks,
  buildExperiencesLinks,
  buildExperiencesSection,
} from "./linkBuilders";

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

  describe("buildStaysLinks", () => {
    const race = {
      id: "monaco-gp",
      name: "Monaco GP",
      circuit: "Circuit de Monaco",
      city: "Monte Carlo",
      country: "Monaco",
      raceDateISO: "2026-06-07",
    };
    const dateOption = {
      key: "opt1",
      label: "Jun 2 - Jun 12",
      departDateISO: "2026-06-02",
      returnDateISO: "2026-06-12",
    };

    it("returns three provider links (Booking.com, Airbnb, Google Hotels)", () => {
      const links = buildStaysLinks(race, dateOption);
      expect(links).toHaveLength(3);
      expect(links.map((l) => l.label)).toEqual([
        "Booking.com",
        "Airbnb",
        "Google Hotels",
      ]);
    });

    it("includes logo path on each link", () => {
      const links = buildStaysLinks(race, dateOption);
      expect(links[0].logo).toBe("/logos/booking.svg");
      expect(links[1].logo).toBe("/logos/airbnb.svg");
      expect(links[2].logo).toBe("/logos/google.svg");
    });

    it("builds Booking.com URL with city and dates", () => {
      const links = buildStaysLinks(race, dateOption);
      const booking = links[0];
      expect(booking.href).toContain("booking.com");
      expect(booking.href).toContain("ss=Monte+Carlo");
      expect(booking.href).toContain("checkin=2026-06-02");
      expect(booking.href).toContain("checkout=2026-06-12");
    });

    it("builds Airbnb URL with city and dates", () => {
      const links = buildStaysLinks(race, dateOption);
      const airbnb = links[1];
      expect(airbnb.href).toContain("airbnb.com");
      expect(airbnb.href).toContain("query=Monte+Carlo");
      expect(airbnb.href).toContain("checkin=2026-06-02");
      expect(airbnb.href).toContain("checkout=2026-06-12");
    });

    it("builds Google Hotels URL with city and dates", () => {
      const links = buildStaysLinks(race, dateOption);
      const google = links[2];
      expect(google.href).toContain("google.com/travel/hotels");
      expect(google.href).toContain("Hotels+in+Monte+Carlo");
      expect(google.href).toContain("checkin=2026-06-02");
      expect(google.href).toContain("checkout=2026-06-12");
    });
  });

  describe("buildExperiencesLinks", () => {
    it("returns three providers (GetYourGuide, Viator, TripAdvisor)", () => {
      const links = buildExperiencesLinks({ city: "Barcelona", country: "Spain" });
      expect(links).toHaveLength(3);
      expect(links.map((l) => l.label)).toEqual([
        "GetYourGuide",
        "Viator",
        "TripAdvisor",
      ]);
    });

    it("builds search URLs with city", () => {
      const links = buildExperiencesLinks({ city: "Monte Carlo", country: "Monaco" });
      expect(links[0].href).toContain("getyourguide.com");
      expect(links[0].href).toContain("Monte+Carlo");
      expect(links[1].href).toContain("viator.com");
      expect(links[2].href).toContain("tripadvisor.com");
      expect(links[2].href).toContain("things+to+do");
    });
  });

  describe("buildExperiencesSection", () => {
    it("returns section with title and three provider links", () => {
      const race = {
        id: "monaco-gp",
        name: "Monaco GP",
        circuit: "Circuit de Monaco",
        city: "Monte Carlo",
        country: "Monaco",
        raceDateISO: "2026-06-07",
      };
      const section = buildExperiencesSection(race);
      expect(section.title).toBe("Experiences & Activities");
      expect(section.links).toHaveLength(3);
    });

    it("includes city fallback activities for known cities", () => {
      const race = {
        id: "miami-gp",
        name: "Miami GP",
        circuit: "Miami",
        city: "Miami",
        country: "United States",
        raceDateISO: "2026-05-03",
      };
      const section = buildExperiencesSection(race);
      expect(section.providerActivities).toBeDefined();
      expect(section.providerActivities?.GetYourGuide).toHaveLength(2);
      expect(section.providerActivities?.Viator?.length).toBeGreaterThanOrEqual(1);
    });

    it("uses race experienceOptions when present", () => {
      const race = {
        id: "monaco-gp",
        name: "Monaco GP",
        circuit: "Circuit de Monaco",
        city: "Monte Carlo",
        country: "Monaco",
        raceDateISO: "2026-06-07",
        experienceOptions: [
          {
            provider: "GetYourGuide",
            activities: [
              { title: "Monaco Tour", href: "https://example.com/1", description: "A tour" },
            ],
          },
        ],
      };
      const section = buildExperiencesSection(race);
      expect(section.providerActivities?.GetYourGuide).toHaveLength(1);
      expect(section.providerActivities?.GetYourGuide?.[0].title).toBe("Monaco Tour");
    });
  });
});
