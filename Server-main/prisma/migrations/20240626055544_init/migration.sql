/*
  Warnings:

  - A unique constraint covering the columns `[date,isDeleted]` on the table `AdoptADay` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "AdoptADay_date_key";

-- AlterTable
ALTER TABLE "AdoptADay" ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "AdoptADay_date_isDeleted_key" ON "AdoptADay"("date", "isDeleted");
