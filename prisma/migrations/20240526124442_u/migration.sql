/*
  Warnings:

  - You are about to drop the column `endDate` on the `trips` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `trips` table. All the data in the column will be lost.
  - Added the required column `date` to the `trips` table without a default value. This is not possible if the table is not empty.
  - Added the required column `photo` to the `trips` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `trips` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "trips" DROP COLUMN "endDate",
DROP COLUMN "startDate",
ADD COLUMN     "date" TEXT NOT NULL,
ADD COLUMN     "photo" TEXT NOT NULL,
ADD COLUMN     "type" TEXT NOT NULL;
