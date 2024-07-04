/*
  Warnings:

  - You are about to drop the column `data_avaliacao` on the `lista` table. All the data in the column will be lost.
  - You are about to drop the column `data_publicacao` on the `review` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "idx_nome";

-- DropIndex
DROP INDEX "idx_autor";

-- DropIndex
DROP INDEX "idx_categoria_data";

-- AlterTable
ALTER TABLE "lista" DROP COLUMN "data_avaliacao",
ALTER COLUMN "frequencia" DROP NOT NULL;

-- AlterTable
ALTER TABLE "livro" ALTER COLUMN "autor" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "review" DROP COLUMN "data_publicacao";
