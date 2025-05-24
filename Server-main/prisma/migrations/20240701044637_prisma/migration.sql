/*
  Warnings:

  - Added the required column `relationship_id` to the `AdoptADay` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AdoptADay" ADD COLUMN     "relationship_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "AdoptADay" ADD CONSTRAINT "AdoptADay_relationship_id_fkey" FOREIGN KEY ("relationship_id") REFERENCES "Relationship"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
