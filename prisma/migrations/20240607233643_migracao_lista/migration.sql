-- CreateTable
CREATE TABLE "lista" (
    "nome" VARCHAR(255) NOT NULL,
    "data_publicacao" DATE NOT NULL,
    "data_avaliacao" DATE,
    "frequencia_atualizacao" VARCHAR(255) NOT NULL,

    CONSTRAINT "lista_pkey" PRIMARY KEY ("nome")
);

-- CreateTable
CREATE TABLE "livro" (
    "isbn" VARCHAR(13) NOT NULL,
    "titulo" VARCHAR(255) NOT NULL,
    "autor" VARCHAR(255) NOT NULL,
    "categoria" VARCHAR(255) NOT NULL,
    "data_publicacao" DATE NOT NULL,
    "descricao" TEXT,
    "num_paginas" INTEGER,
    "link_thumbnail" VARCHAR(255),
    "nota_media" DOUBLE PRECISION,

    CONSTRAINT "livro_pkey" PRIMARY KEY ("isbn")
);

-- CreateTable
CREATE TABLE "livrosdalista" (
    "lista_nome" VARCHAR(255) NOT NULL,
    "livro_isbn" VARCHAR(13) NOT NULL,
    "rank" INTEGER,

    CONSTRAINT "livrosdalista_pkey" PRIMARY KEY ("lista_nome","livro_isbn")
);

-- CreateTable
CREATE TABLE "review" (
    "autor" VARCHAR(255) NOT NULL,
    "livro_isbn" VARCHAR(13) NOT NULL,
    "data_publicacao" DATE NOT NULL,
    "sumario" TEXT,
    "link_url_review" VARCHAR(255),

    CONSTRAINT "review_pkey" PRIMARY KEY ("autor","livro_isbn")
);

-- CreateIndex
CREATE INDEX "idx_nome" ON "lista"("nome");

-- CreateIndex
CREATE INDEX "idx_autor" ON "livro"("autor");

-- CreateIndex
CREATE INDEX "idx_categoria_data" ON "livro"("categoria", "data_publicacao");

-- AddForeignKey
ALTER TABLE "livrosdalista" ADD CONSTRAINT "livrosdalista_lista_nome_fkey" FOREIGN KEY ("lista_nome") REFERENCES "lista"("nome") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "livrosdalista" ADD CONSTRAINT "livrosdalista_livro_isbn_fkey" FOREIGN KEY ("livro_isbn") REFERENCES "livro"("isbn") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "review" ADD CONSTRAINT "review_livro_isbn_fkey" FOREIGN KEY ("livro_isbn") REFERENCES "livro"("isbn") ON DELETE NO ACTION ON UPDATE NO ACTION;
