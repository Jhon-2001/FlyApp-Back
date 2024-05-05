-- AlterTable
ALTER TABLE "Flight" ADD COLUMN     "companyLogo" TEXT,
ADD COLUMN     "copmapny" TEXT,
ALTER COLUMN "twoWay" DROP NOT NULL;

-- AlterTable
ALTER TABLE "LocationPoint" ADD COLUMN     "airport" TEXT,
ADD COLUMN     "city" TEXT;
