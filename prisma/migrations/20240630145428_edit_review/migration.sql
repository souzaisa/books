/*
  Warnings:

  - Added the required column `titulo` to the `review` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "review" ADD COLUMN     "titulo" VARCHAR(255) NOT NULL;
