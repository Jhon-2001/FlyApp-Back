/*
  Warnings:

  - You are about to drop the column `numberOfPeople` on the `UserAccomodationFlight` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "UserAccomodationFlight" DROP COLUMN "numberOfPeople",
ADD COLUMN     "amount" INTEGER;

-- CreateTable
CREATE TABLE "UserBookedFlight" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "flightId" INTEGER,
    "accommodationId" INTEGER,
    "numberOfPeople" INTEGER NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "UserBookedFlight_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UserBookedFlight" ADD CONSTRAINT "UserBookedFlight_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserBookedFlight" ADD CONSTRAINT "UserBookedFlight_flightId_fkey" FOREIGN KEY ("flightId") REFERENCES "Flight"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserBookedFlight" ADD CONSTRAINT "UserBookedFlight_accommodationId_fkey" FOREIGN KEY ("accommodationId") REFERENCES "Accommodation"("id") ON DELETE SET NULL ON UPDATE CASCADE;
