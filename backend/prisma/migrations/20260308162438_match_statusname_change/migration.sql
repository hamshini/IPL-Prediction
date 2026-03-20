/*
  Warnings:

  - You are about to drop the column `stauts` on the `PlayerPick` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "PlayerPick" DROP COLUMN "stauts",
ADD COLUMN     "status" "MatchStatus" NOT NULL DEFAULT 'SCHEDULED';
