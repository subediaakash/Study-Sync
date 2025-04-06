/*
  Warnings:

  - You are about to drop the column `duration` on the `TimerSetting` table. All the data in the column will be lost.
  - You are about to drop the column `isDefault` on the `TimerSetting` table. All the data in the column will be lost.
  - You are about to drop the column `studyRoomId` on the `TimerSetting` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[timerSettingId]` on the table `StudyRoom` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `category` to the `StudyRoom` table without a default value. This is not possible if the table is not empty.
  - Added the required column `timerSettingId` to the `StudyRoom` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "RoomCategory" AS ENUM ('MATHEMATICS', 'COMPUTER_SCIENCE', 'LANGUAGES', 'TECHNOLOGY', 'HUMANITIES', 'SCIENCE', 'BUSINESS');

-- DropForeignKey
ALTER TABLE "TimerSetting" DROP CONSTRAINT "TimerSetting_studyRoomId_fkey";

-- DropIndex
DROP INDEX "TimerSetting_studyRoomId_isDefault_key";

-- AlterTable
ALTER TABLE "StudyRoom" ADD COLUMN     "category" "RoomCategory" NOT NULL,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "isPrivate" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "password" TEXT,
ADD COLUMN     "timerSettingId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "TimerSetting" DROP COLUMN "duration",
DROP COLUMN "isDefault",
DROP COLUMN "studyRoomId",
ADD COLUMN     "focusTime" INTEGER NOT NULL DEFAULT 25,
ALTER COLUMN "breakTime" SET DEFAULT 5;

-- CreateIndex
CREATE UNIQUE INDEX "StudyRoom_timerSettingId_key" ON "StudyRoom"("timerSettingId");

-- AddForeignKey
ALTER TABLE "StudyRoom" ADD CONSTRAINT "StudyRoom_timerSettingId_fkey" FOREIGN KEY ("timerSettingId") REFERENCES "TimerSetting"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
