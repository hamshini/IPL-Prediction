/*
  Warnings:

  - A unique constraint covering the columns `[shortName]` on the table `Team` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `shortName` to the `Team` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Team" ADD COLUMN     "shortName" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Team_shortName_key" ON "Team"("shortName");
