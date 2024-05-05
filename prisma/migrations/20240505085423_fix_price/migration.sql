/*
  Warnings:

  - You are about to drop the column `priece` on the `Flight` table. All the data in the column will be lost.
  - Added the required column `price` to the `Flight` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Flight" DROP COLUMN "priece",
ADD COLUMN     "price" INTEGER NOT NULL;
