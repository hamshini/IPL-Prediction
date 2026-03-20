/*
  Warnings:

  - You are about to drop the column `stauts` on the `Match` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Match" DROP COLUMN "stauts",
ADD COLUMN     "status" "MatchStatus" NOT NULL DEFAULT 'SCHEDULED';
