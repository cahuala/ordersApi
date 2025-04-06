/*
  Warnings:

  - You are about to drop the column `orderNo` on the `table_sessions` table. All the data in the column will be lost.
  - Added the required column `tableSessionId` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "table_sessions" DROP CONSTRAINT "table_sessions_orderNo_fkey";

-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "tableSessionId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "table_sessions" DROP COLUMN "orderNo";

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_tableSessionId_fkey" FOREIGN KEY ("tableSessionId") REFERENCES "table_sessions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
