/*
  Warnings:

  - Added the required column `description` to the `trips` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "trips" ADD COLUMN     "description" TEXT NOT NULL;
