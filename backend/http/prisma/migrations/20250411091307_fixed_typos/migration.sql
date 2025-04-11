/*
  Warnings:

  - You are about to drop the column `remaingTime` on the `TimerSetting` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "TimerSetting" DROP COLUMN "remaingTime",
ADD COLUMN     "remainingTime" INTEGER NOT NULL DEFAULT 5;
