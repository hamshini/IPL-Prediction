-- AlterTable
ALTER TABLE "Match" ADD COLUMN     "manOfMatch" TEXT,
ADD COLUMN     "winningTeamId" TEXT;

-- CreateTable
CREATE TABLE "MatchScore" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "matchId" TEXT NOT NULL,
    "result" TEXT NOT NULL,
    "streak" INTEGER NOT NULL,
    "points" INTEGER NOT NULL,
    "isMomCorrect" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MatchScore_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MatchScore_userId_matchId_key" ON "MatchScore"("userId", "matchId");

-- AddForeignKey
ALTER TABLE "MatchScore" ADD CONSTRAINT "MatchScore_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchScore" ADD CONSTRAINT "MatchScore_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
