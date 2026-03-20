/*
  Warnings:

  - You are about to drop the column `teamAId` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the column `teamBId` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the column `teamId` on the `Player` table. All the data in the column will be lost.
  - The primary key for the `Team` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Team` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `teamAShortName` to the `Match` table without a default value. This is not possible if the table is not empty.
  - Added the required column `teamBShortName` to the `Match` table without a default value. This is not possible if the table is not empty.
  - Added the required column `teamShortName` to the `Player` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Match" DROP CONSTRAINT "Match_teamAId_fkey";

-- DropForeignKey
ALTER TABLE "Match" DROP CONSTRAINT "Match_teamBId_fkey";

-- DropForeignKey
ALTER TABLE "Player" DROP CONSTRAINT "Player_teamId_fkey";

-- AlterTable
ALTER TABLE "Match" DROP COLUMN "teamAId",
DROP COLUMN "teamBId",
ADD COLUMN     "teamAShortName" TEXT NOT NULL,
ADD COLUMN     "teamBShortName" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Player" DROP COLUMN "teamId",
ADD COLUMN     "teamShortName" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Team" DROP CONSTRAINT "Team_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Team_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_teamShortName_fkey" FOREIGN KEY ("teamShortName") REFERENCES "Team"("shortName") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_teamAShortName_fkey" FOREIGN KEY ("teamAShortName") REFERENCES "Team"("shortName") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_teamBShortName_fkey" FOREIGN KEY ("teamBShortName") REFERENCES "Team"("shortName") ON DELETE RESTRICT ON UPDATE CASCADE;
