/*
  Warnings:

  - The `status` column on the `PlayerPick` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "PlayerPick" DROP COLUMN "status",
ADD COLUMN     "status" "PickStatus" NOT NULL DEFAULT 'PENDING';
