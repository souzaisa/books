/*
  Warnings:

  - You are about to drop the column `titulo` on the `review` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "review" DROP COLUMN "titulo",
ADD COLUMN     "numero_review" INTEGER;
