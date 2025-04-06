/*
  Warnings:

  - You are about to drop the column `price` on the `addons` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `sizes` table. All the data in the column will be lost.
  - Added the required column `price` to the `addons_food` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `sizes_food` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "addons" DROP COLUMN "price";

-- AlterTable
ALTER TABLE "addons_food" ADD COLUMN     "price" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "sizes" DROP COLUMN "price";

-- AlterTable
ALTER TABLE "sizes_food" ADD COLUMN     "price" DOUBLE PRECISION NOT NULL;
