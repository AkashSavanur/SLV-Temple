/*
  Warnings:

  - Added the required column `occasion` to the `AdoptADay` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AdoptADay" ADD COLUMN     "occasion" TEXT NOT NULL;
