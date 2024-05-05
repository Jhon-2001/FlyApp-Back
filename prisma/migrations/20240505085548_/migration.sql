/*
  Warnings:

  - You are about to drop the column `numberOfpeople` on the `Flight` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Flight" DROP COLUMN "numberOfpeople",
ADD COLUMN     "numberOfPeople" INTEGER;
