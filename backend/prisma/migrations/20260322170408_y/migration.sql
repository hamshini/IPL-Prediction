/*
  Warnings:

  - Added the required column `modifiedBy` to the `PickHistory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `submittedBy` to the `PlayerPick` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PickHistory" ADD COLUMN     "modifiedBy" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "PlayerPick" ADD COLUMN     "submittedBy" TEXT NOT NULL;
