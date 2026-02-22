/* eslint-disable @typescript-eslint/no-require-imports -- Node seed script run with node prisma/seed.js (CommonJS) */
/**
 * Seed mock ItineraryBooking records for verifying the "Add booking" / My Bookings flow.
 *
 * Usage:
 *   1. Create an itinerary in the app (Plan Your Trip → save).
 *   2. Copy the itinerary ID from the URL (/itinerary/[id]) or from Prisma Studio.
 *   3. Run: ITINERARY_ID=clxxxxx node prisma/seed.js
 *   4. Optional: SCENARIO=multiple | edge (default: happy path).
 *
 * If ITINERARY_ID is not set, the script uses the most recent itinerary.
 * See docs/TEST_DATA.md for scenarios and verification steps.
 */

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/** Happy path: one booking per type (ticket, flight, stay, activity). */
const MOCK_BOOKINGS_HAPPY = [
  { type: "ticket", provider: "Official F1", confirmationRef: "F1-AU-2026-001", detailsUrl: "https://tickets.formula1.com/", notes: "General Admission, 3 days" },
  { type: "flight", provider: "Google Flights", confirmationRef: "GF-ABC123", detailsUrl: null, notes: "MEL–SFO return" },
  { type: "stay", provider: "Booking.com", confirmationRef: "BC-987654321", detailsUrl: "https://booking.com/confirmation", notes: "2 guests, 5 nights" },
  { type: "activity", provider: "GetYourGuide", confirmationRef: "GYG-MEL-456", detailsUrl: null, notes: "City tour, Mar 10" },
];

/** Multiple per type: two activities, one flight, one stay, one ticket. */
const MOCK_BOOKINGS_MULTIPLE = [
  { type: "ticket", provider: "Official F1", confirmationRef: "F1-AU-2026-001", detailsUrl: null, notes: null },
  { type: "flight", provider: "Google Flights", confirmationRef: "GF-ABC123", detailsUrl: null, notes: null },
  { type: "stay", provider: "Booking.com", confirmationRef: "BC-987654321", detailsUrl: null, notes: null },
  { type: "activity", provider: "GetYourGuide", confirmationRef: "GYG-001", detailsUrl: null, notes: "City tour" },
  { type: "activity", provider: "Viator", confirmationRef: "VTR-002", detailsUrl: "https://viator.com/booking/002", notes: "Wine tour" },
];

/** Edge: long provider, long confirmationRef, long notes, detailsUrl with query params (at validation limits). */
const MOCK_BOOKINGS_EDGE = [
  {
    type: "stay",
    provider: "A".repeat(100),
    confirmationRef: "B".repeat(100),
    detailsUrl: "https://booking.com/confirmation?ref=xyz&lang=en",
    notes: "C".repeat(500),
  },
];

function getBookingsForScenario() {
  const scenario = (process.env.SCENARIO || "happy").toLowerCase();
  if (scenario === "multiple") return MOCK_BOOKINGS_MULTIPLE;
  if (scenario === "edge") return MOCK_BOOKINGS_EDGE;
  return MOCK_BOOKINGS_HAPPY;
}

async function main() {
  let itineraryId = process.env.ITINERARY_ID;
  if (!itineraryId) {
    const first = await prisma.itinerary.findFirst({ orderBy: { createdAt: "desc" } });
    if (!first) {
      console.error("No itineraries found. Create one in the app, then run: ITINERARY_ID=<id> node prisma/seed.js");
      process.exit(1);
    }
    itineraryId = first.id;
    console.log("No ITINERARY_ID set; using most recent itinerary:", itineraryId);
  }

  const itinerary = await prisma.itinerary.findUnique({ where: { id: itineraryId } });
  if (!itinerary) {
    console.error("Itinerary not found:", itineraryId);
    process.exit(1);
  }

  const bookings = getBookingsForScenario();
  for (const b of bookings) {
    await prisma.itineraryBooking.create({
      data: {
        itineraryId,
        userId: itinerary.userId,
        type: b.type,
        provider: b.provider,
        confirmationRef: b.confirmationRef,
        detailsUrl: b.detailsUrl,
        notes: b.notes,
      },
    });
  }

  console.log("Created", bookings.length, "mock bookings for itinerary", itineraryId, "(SCENARIO=" + (process.env.SCENARIO || "happy") + ")");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
