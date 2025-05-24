/*
  Warnings:

  - A unique constraint covering the columns `[date]` on the table `AdoptADay` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "AdoptADay_date_key" ON "AdoptADay"("date");
