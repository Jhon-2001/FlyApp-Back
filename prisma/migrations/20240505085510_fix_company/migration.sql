/*
  Warnings:

  - You are about to drop the column `copmapny` on the `Flight` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Flight" DROP COLUMN "copmapny",
ADD COLUMN     "company" TEXT;
