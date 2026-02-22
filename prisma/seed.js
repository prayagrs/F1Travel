/* eslint-disable @typescript-eslint/no-require-imports -- Node seed script run with node prisma/seed.js (CommonJS) */
/**
 * Seed mock ItineraryBooking records for verifying the "Add booking" / My Bookings flow.
 *
 * Usage:
 *   1. Create an itinerary in the app (Plan Your Trip → save).
 *   2. Copy the itinerary ID from the URL (/itinerary/[id]) or from Prisma Studio.
 *   3. Run: ITINERARY_ID=clxxxxx node prisma/seed.js
 *   4. Open that itinerary and the My Bookings page to see the mock bookings.
 *
 * If ITINERARY_ID is not set, the script finds the first itinerary in the DB and seeds that.
 */

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const MOCK_BOOKINGS = [
  { type: "ticket", provider: "Official F1", confirmationRef: "F1-AU-2026-001", detailsUrl: "https://tickets.formula1.com/", notes: "General Admission, 3 days" },
  { type: "flight", provider: "Google Flights", confirmationRef: "GF-ABC123", detailsUrl: null, notes: "MEL–SFO return" },
  { type: "stay", provider: "Booking.com", confirmationRef: "BC-987654321", detailsUrl: "https://booking.com/confirmation", notes: "2 guests, 5 nights" },
  { type: "activity", provider: "GetYourGuide", confirmationRef: "GYG-MEL-456", detailsUrl: null, notes: "City tour, Mar 10" },
];

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

  for (const b of MOCK_BOOKINGS) {
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

  console.log("Created", MOCK_BOOKINGS.length, "mock bookings for itinerary", itineraryId);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
