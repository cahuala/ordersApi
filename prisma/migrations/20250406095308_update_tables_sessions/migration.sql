/*
  Warnings:

  - You are about to drop the column `totalTime` on the `table_sessions` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "table_sessions" DROP COLUMN "totalTime",
ADD COLUMN     "total_price" DOUBLE PRECISION NOT NULL DEFAULT 0;
