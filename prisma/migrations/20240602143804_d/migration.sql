/*
  Warnings:

  - You are about to drop the `UserBookedFlight` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserBookedFlight" DROP CONSTRAINT "UserBookedFlight_accommodationId_fkey";

-- DropForeignKey
ALTER TABLE "UserBookedFlight" DROP CONSTRAINT "UserBookedFlight_flightId_fkey";

-- DropForeignKey
ALTER TABLE "UserBookedFlight" DROP CONSTRAINT "UserBookedFlight_userId_fkey";

-- AlterTable
ALTER TABLE "UserAccomodationFlight" ADD COLUMN     "numberOfPeople" INTEGER;

-- DropTable
DROP TABLE "UserBookedFlight";
