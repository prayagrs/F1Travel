import { describe, it, expect } from "vitest";
import { parseConfirmationText } from "./confirmationParser";

describe("parseConfirmationText", () => {
  it("extracts provider from pasted text", () => {
    const text = "Your Booking.com reservation is confirmed. Ref: ABC123";
    expect(parseConfirmationText(text)).toEqual({
      provider: "Booking.com",
      confirmationRef: "ABC123",
      detailsUrl: undefined,
    });
  });

  it("extracts confirmation from common patterns", () => {
    expect(parseConfirmationText("Confirmation number: XYZ789")).toEqual({
      provider: undefined,
      confirmationRef: "XYZ789",
      detailsUrl: undefined,
    });
    expect(parseConfirmationText("Reference: GF123456")).toEqual({
      provider: undefined,
      confirmationRef: "GF123456",
      detailsUrl: undefined,
    });
  });

  it("extracts URL from pasted text", () => {
    const text =
      "View your booking at https://www.booking.com/hotel/view/123456";
    const result = parseConfirmationText(text);
    expect(result.provider).toBe("Booking.com");
    expect(result.detailsUrl).toBe("https://www.booking.com/hotel/view/123456");
  });

  it("returns empty object for empty input", () => {
    expect(parseConfirmationText("")).toEqual({});
    expect(parseConfirmationText("   ")).toEqual({});
  });

  it("extracts all fields when present", () => {
    const text = `
      Booking.com - Reservation confirmed
      Confirmation: STAY2024ABC
      View: https://www.booking.com/confirmation/STAY2024ABC
    `;
    const result = parseConfirmationText(text);
    expect(result.provider).toBe("Booking.com");
    expect(result.confirmationRef).toBeDefined();
    expect(result.detailsUrl).toContain("https://");
  });
});
