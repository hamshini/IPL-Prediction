/*
  Warnings:

  - You are about to drop the column `teamShortName` on the `Player` table. All the data in the column will be lost.
  - Added the required column `teamId` to the `Player` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Player" DROP CONSTRAINT "Player_teamShortName_fkey";

-- AlterTable
ALTER TABLE "Player" DROP COLUMN "teamShortName",
ADD COLUMN     "teamId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
