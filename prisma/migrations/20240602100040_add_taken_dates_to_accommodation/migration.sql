/*
  Warnings:

  - Added the required column `takenDates` to the `Accommodation` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "UserAccomodationFlight" DROP CONSTRAINT "UserAccomodationFlight_accommodationId_fkey";

-- DropForeignKey
ALTER TABLE "UserAccomodationFlight" DROP CONSTRAINT "UserAccomodationFlight_flightId_fkey";

-- AlterTable
ALTER TABLE "Accommodation" ADD COLUMN     "takenDates" JSONB NOT NULL;

-- AlterTable
ALTER TABLE "UserAccomodationFlight" ADD COLUMN     "checkIn" TIMESTAMP(3),
ADD COLUMN     "checkOut" TIMESTAMP(3),
ALTER COLUMN "flightId" DROP NOT NULL,
ALTER COLUMN "accommodationId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "UserAccomodationFlight" ADD CONSTRAINT "UserAccomodationFlight_flightId_fkey" FOREIGN KEY ("flightId") REFERENCES "Flight"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAccomodationFlight" ADD CONSTRAINT "UserAccomodationFlight_accommodationId_fkey" FOREIGN KEY ("accommodationId") REFERENCES "Accommodation"("id") ON DELETE SET NULL ON UPDATE CASCADE;
