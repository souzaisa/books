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
}

export async function listInsertion(list, prisma) {
  let livrosDaLista = []
  if (list.livrosdalista !== undefined) {
    livrosDaLista = list.livrosdalista.map(book => ({
      rank: book.rank,
      livro: {
        connect: {
          isbn: book.isbn
        }
      }
    }))
  }
  const data = {
    nome: list.nome,
    data_publicacao: list.data_publicacao,
    frequencia: list.frequencia,

  }
  if (livrosDaLista.length > 0) {
    data.livrosdalista = {
      create: livrosDaLista
    }
  }


  console.log("PRISMA INSERT  ", JSON.stringify({ data }))
  try {

    const listInserted = await prisma.lista.create({ data })
    // console.log("LIST INSERTION: " + listInserted.toString());
  } catch (e) {
    console.log("Error on listInsertion: ", String(e))
  }

}

// Função para inserir dados de avaliação no banco de dados
export async function reviewInsertion(review, prisma) {
  try {
    // Insere os dados formatados da avaliação no banco de dados
    const reviewInserted = await prisma.review.create({
      data: {
        isbn: review.isbn,
        autor: review.autor,
        data_publicacao: review.data_publicacao,
        sumario: review.sumario,
        link_url_review: review.link_url_review,
        numero_review: review.numero_review
      },
    });
    console.log("REVIEW INSERTION: " + reviewInserted.toString());
  } catch (error) {
    console.log("Erro na inserção da avaliação: " + error);
  }
}

// Função para inserir dados dos livros da lista no banco de dados
export async function booksOfListInsertion(booksOfList, prisma) {
  try {
    // Insere os dados dos livros da lista no banco de dados
    const booksOfListInserted = await prisma.livros_da_lista.create({
      data: {
        lista_nome: booksOfList.lista_nome,
        livro_isbn: booksOfList.livro_isbn,
        rank: booksOfList.rank
      },
    });
    console.log("BooksOfList INSERTION: " + booksOfListInserted.toString());
  } catch (error) {
    console.log("Erro na inserção da lista de livros: " + error);
  }
}
