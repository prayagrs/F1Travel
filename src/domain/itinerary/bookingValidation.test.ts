import { describe, it, expect } from "vitest";
import { validateBookingInput } from "./bookingValidation";

describe("validateBookingInput", () => {
  const valid = {
    type: "flight",
    provider: "Google Flights",
    confirmationRef: "GF-ABC123",
    detailsUrl: null,
    notes: null,
  };

  it("returns null for valid input", () => {
    expect(validateBookingInput(valid)).toBeNull();
    expect(validateBookingInput({ ...valid, detailsUrl: "https://example.com/booking" })).toBeNull();
    expect(validateBookingInput({ ...valid, notes: "2 guests" })).toBeNull();
  });

  it("returns error when type is invalid", () => {
    expect(validateBookingInput({ ...valid, type: "hotel" })).toBe("Invalid booking type.");
    expect(validateBookingInput({ ...valid, type: "" })).toBe("Invalid booking type.");
  });

  it("returns error when provider or confirmationRef is missing", () => {
    expect(validateBookingInput({ ...valid, provider: "" })).toBe(
      "Provider and confirmation number are required."
    );
    expect(validateBookingInput({ ...valid, provider: "   " })).toBe(
      "Provider and confirmation number are required."
    );
    expect(validateBookingInput({ ...valid, confirmationRef: "" })).toBe(
      "Provider and confirmation number are required."
    );
  });

  it("returns error when provider is too long", () => {
    expect(
      validateBookingInput({ ...valid, provider: "A".repeat(101) })
    ).toBe("Provider name is too long.");
  });

  it("returns error when confirmationRef is too long", () => {
    expect(
      validateBookingInput({ ...valid, confirmationRef: "A".repeat(101) })
    ).toBe("Confirmation number is too long.");
  });

  it("returns error when confirmationRef has invalid characters", () => {
    expect(validateBookingInput({ ...valid, confirmationRef: "ABC<script>" })).toBe(
      "Use only letters, numbers, and hyphens for the confirmation number."
    );
    expect(validateBookingInput({ ...valid, confirmationRef: "ABC/123" })).toBe(
      "Use only letters, numbers, and hyphens for the confirmation number."
    );
  });

  it("returns error when detailsUrl is not a valid URL", () => {
    expect(validateBookingInput({ ...valid, detailsUrl: "not-a-url" })).toBe(
      "Please enter a valid link."
    );
    expect(validateBookingInput({ ...valid, detailsUrl: "ftp://example.com" })).toBe(
      "Please enter a valid link."
    );
  });

  it("accepts valid http/https detailsUrl", () => {
    expect(validateBookingInput({ ...valid, detailsUrl: "https://booking.com/123" })).toBeNull();
    expect(validateBookingInput({ ...valid, detailsUrl: "http://example.com" })).toBeNull();
  });

  it("returns error when notes are too long", () => {
    expect(validateBookingInput({ ...valid, notes: "x".repeat(501) })).toBe("Notes are too long.");
  });
});
