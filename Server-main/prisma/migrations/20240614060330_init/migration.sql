/*
  Warnings:

  - You are about to drop the column `recipientName` on the `Donations` table. All the data in the column will be lost.
  - Added the required column `recipient_name` to the `Donations` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Donations" DROP COLUMN "recipientName",
ADD COLUMN     "recipient_name" TEXT NOT NULL;
