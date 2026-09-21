-- AlterTable
ALTER TABLE "user" ADD COLUMN     "subscriptionStatus" TEXT,
ADD COLUMN     "subscriptionTier" TEXT NOT NULL DEFAULT 'free';

-- CreateTable
CREATE TABLE "userUsage" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "repositoriesCount" INTEGER NOT NULL DEFAULT 0,
    "reviewsCounts" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "userUsage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "userUsage_userId_key" ON "userUsage"("userId");

-- AddForeignKey
ALTER TABLE "userUsage" ADD CONSTRAINT "userUsage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
