/*
  Warnings:

  - Added the required column `role` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'USER', 'ROOT');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "UserRole" NOT NULL;

-- CreateTable
CREATE TABLE "UserAccomodationFlight" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "flightId" INTEGER NOT NULL,
    "accommodationId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "UserAccomodationFlight_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Accommodation" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "description" TEXT,
    "facilities" TEXT[],
    "rating" INTEGER,
    "stars" INTEGER,
    "rooms" INTEGER,
    "surface" INTEGER,
    "price" INTEGER,
    "photos" TEXT[],
    "locationId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Accommodation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Flight" (
    "id" SERIAL NOT NULL,
    "startLocationId" INTEGER NOT NULL,
    "endLocationId" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "twoWay" BOOLEAN NOT NULL DEFAULT false,
    "numberOfpeople" INTEGER,
    "optionId" INTEGER,
    "priece" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Flight_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LocationPoint" (
    "id" SERIAL NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "LocationPoint_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Accommodation_locationId_key" ON "Accommodation"("locationId");

-- CreateIndex
CREATE UNIQUE INDEX "Flight_startLocationId_key" ON "Flight"("startLocationId");

-- CreateIndex
CREATE UNIQUE INDEX "Flight_endLocationId_key" ON "Flight"("endLocationId");

-- AddForeignKey
ALTER TABLE "UserAccomodationFlight" ADD CONSTRAINT "UserAccomodationFlight_flightId_fkey" FOREIGN KEY ("flightId") REFERENCES "Flight"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAccomodationFlight" ADD CONSTRAINT "UserAccomodationFlight_accommodationId_fkey" FOREIGN KEY ("accommodationId") REFERENCES "Accommodation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAccomodationFlight" ADD CONSTRAINT "UserAccomodationFlight_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Accommodation" ADD CONSTRAINT "Accommodation_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "LocationPoint"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Flight" ADD CONSTRAINT "Flight_startLocationId_fkey" FOREIGN KEY ("startLocationId") REFERENCES "LocationPoint"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Flight" ADD CONSTRAINT "Flight_endLocationId_fkey" FOREIGN KEY ("endLocationId") REFERENCES "LocationPoint"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
