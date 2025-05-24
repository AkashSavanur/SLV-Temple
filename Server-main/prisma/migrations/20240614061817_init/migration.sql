/*
  Warnings:

  - Added the required column `rate_id` to the `Donations` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Donations" ADD COLUMN     "rate_id" TEXT NOT NULL;
