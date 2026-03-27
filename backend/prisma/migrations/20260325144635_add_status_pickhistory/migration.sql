/*
  Warnings:

  - You are about to drop the column `modifiedBy` on the `PickHistory` table. All the data in the column will be lost.
  - You are about to drop the column `previousScore` on the `PlayerPick` table. All the data in the column will be lost.
  - You are about to drop the column `score` on the `PlayerPick` table. All the data in the column will be lost.
  - You are about to drop the column `submittedAt` on the `PlayerPick` table. All the data in the column will be lost.
  - Added the required column `matchId` to the `PickHistory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `submittedBy` to the `PickHistory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `PickHistory` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "PickHistory" DROP CONSTRAINT "PickHistory_playerPickId_fkey";

-- AlterTable
ALTER TABLE "PickHistory" DROP COLUMN "modifiedBy",
ADD COLUMN     "matchId" TEXT NOT NULL,
ADD COLUMN     "status" "PickStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "submittedBy" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL,
ALTER COLUMN "playerPickId" DROP NOT NULL,
ALTER COLUMN "mom1Picked" DROP NOT NULL,
ALTER COLUMN "mom2Picked" DROP NOT NULL;

-- AlterTable
ALTER TABLE "PlayerPick" DROP COLUMN "previousScore",
DROP COLUMN "score",
DROP COLUMN "submittedAt",
ALTER COLUMN "mom1Picked" DROP NOT NULL,
ALTER COLUMN "mom2Picked" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "PickHistory" ADD CONSTRAINT "PickHistory_playerPickId_fkey" FOREIGN KEY ("playerPickId") REFERENCES "PlayerPick"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PickHistory" ADD CONSTRAINT "PickHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PickHistory" ADD CONSTRAINT "PickHistory_submittedBy_fkey" FOREIGN KEY ("submittedBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PickHistory" ADD CONSTRAINT "PickHistory_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
