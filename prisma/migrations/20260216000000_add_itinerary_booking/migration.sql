-- CreateTable
CREATE TABLE "ItineraryBooking" (
    "id" TEXT NOT NULL,
    "itineraryId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "confirmationRef" TEXT NOT NULL,
    "detailsUrl" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ItineraryBooking_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ItineraryBooking_userId_idx" ON "ItineraryBooking"("userId");

-- CreateIndex
CREATE INDEX "ItineraryBooking_itineraryId_idx" ON "ItineraryBooking"("itineraryId");

-- AddForeignKey
ALTER TABLE "ItineraryBooking" ADD CONSTRAINT "ItineraryBooking_itineraryId_fkey" FOREIGN KEY ("itineraryId") REFERENCES "Itinerary"("id") ON DELETE CASCADE ON UPDATE CASCADE;
