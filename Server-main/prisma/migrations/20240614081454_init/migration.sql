-- AddForeignKey
ALTER TABLE "AdoptADay" ADD CONSTRAINT "AdoptADay_rate_id_fkey" FOREIGN KEY ("rate_id") REFERENCES "Rates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
