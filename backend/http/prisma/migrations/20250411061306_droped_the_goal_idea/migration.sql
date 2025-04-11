/*
  Warnings:

  - You are about to drop the `Goals` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Goals" DROP CONSTRAINT "Goals_userId_fkey";

-- DropForeignKey
ALTER TABLE "StudyRoom" DROP CONSTRAINT "StudyRoom_goalsId_fkey";

-- DropTable
DROP TABLE "Goals";
