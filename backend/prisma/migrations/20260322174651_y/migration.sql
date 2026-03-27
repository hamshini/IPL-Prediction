-- CreateTable
CREATE TABLE "SeasonPrediction" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "submittedBy" TEXT NOT NULL,
    "top1TeamId" TEXT NOT NULL,
    "top2TeamId" TEXT NOT NULL,
    "top3TeamId" TEXT NOT NULL,
    "top4TeamId" TEXT NOT NULL,
    "bottom1TeamId" TEXT NOT NULL,
    "bottom2TeamId" TEXT NOT NULL,
    "orangeCap1" TEXT NOT NULL,
    "orangeCap2" TEXT NOT NULL,
    "orangeCap3" TEXT NOT NULL,
    "purpleCap1" TEXT NOT NULL,
    "purpleCap2" TEXT NOT NULL,
    "purpleCap3" TEXT NOT NULL,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastModifiedAt" TIMESTAMP(3),

    CONSTRAINT "SeasonPrediction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SeasonPredictionHistory" (
    "id" TEXT NOT NULL,
    "seasonPredictionId" TEXT NOT NULL,
    "top1TeamId" TEXT NOT NULL,
    "top2TeamId" TEXT NOT NULL,
    "top3TeamId" TEXT NOT NULL,
    "top4TeamId" TEXT NOT NULL,
    "bottom1TeamId" TEXT NOT NULL,
    "bottom2TeamId" TEXT NOT NULL,
    "orangeCap1" TEXT NOT NULL,
    "orangeCap2" TEXT NOT NULL,
    "orangeCap3" TEXT NOT NULL,
    "purpleCap1" TEXT NOT NULL,
    "purpleCap2" TEXT NOT NULL,
    "purpleCap3" TEXT NOT NULL,
    "modifiedBy" TEXT NOT NULL,
    "modifiedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SeasonPredictionHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SeasonPrediction_userId_key" ON "SeasonPrediction"("userId");

-- AddForeignKey
ALTER TABLE "SeasonPrediction" ADD CONSTRAINT "SeasonPrediction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SeasonPredictionHistory" ADD CONSTRAINT "SeasonPredictionHistory_seasonPredictionId_fkey" FOREIGN KEY ("seasonPredictionId") REFERENCES "SeasonPrediction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
