/*
  Warnings:

  - You are about to drop the column `phoneNumber` on the `Users` table. All the data in the column will be lost.
  - Added the required column `phone_number` to the `Users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Users" DROP COLUMN "phoneNumber",
ADD COLUMN     "phone_number" INTEGER NOT NULL;
