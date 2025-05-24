-- DropForeignKey
ALTER TABLE "AdoptADay" DROP CONSTRAINT "AdoptADay_relationship_id_fkey";

-- AlterTable
ALTER TABLE "AdoptADay" ALTER COLUMN "relationship_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "AdoptADay" ADD CONSTRAINT "AdoptADay_relationship_id_fkey" FOREIGN KEY ("relationship_id") REFERENCES "Relationship"("id") ON DELETE SET NULL ON UPDATE CASCADE;
