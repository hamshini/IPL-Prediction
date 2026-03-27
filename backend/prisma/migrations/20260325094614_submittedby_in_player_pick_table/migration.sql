-- AddForeignKey
ALTER TABLE "PlayerPick" ADD CONSTRAINT "PlayerPick_submittedBy_fkey" FOREIGN KEY ("submittedBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
