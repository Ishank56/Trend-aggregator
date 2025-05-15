-- CreateTable
CREATE TABLE "Trend" (
    "id" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "summary" TEXT,
    "sentiment" TEXT,
    "likes" INTEGER,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Trend_pkey" PRIMARY KEY ("id")
);
