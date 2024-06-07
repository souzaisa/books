// import { PrismaClient } from '@prisma/client'

// const prisma = new PrismaClient();

export async function bookInsertion(book, prisma) {
  const bookInserted = await prisma.livro.create({
    data: {
      isbn: book.isbn,
      titulo: book.titulo,
      autor: book.autor,
      categoria: book.categoria,
      data_publicacao: book.data_publicacao,
      descricao: book.descricao,
      num_paginas: book.num_paginas,
      link_thumbnail: book.link_thumbnail,
      nota_media: book.nota_media
      //Como tratar as listas do relacionamento?
    },
  })
  console.log("BOOK INSERTION: " + bookInserted.toString());
}

export async function listInsertion(list, prisma) {
  const listInserted = await prisma.lista.create({
    data: {
      nome: list.nome,
      data_publicacao: list.data_publicacao,
      data_avaliacao: list.data_avaliacao,
      livrosdalista: list.livrosdalista,
    }
  })
  console.log("LIST INSERTION: " + listInserted.toString());

}