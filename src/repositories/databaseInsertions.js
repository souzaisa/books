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
  let livros_da_lista = []
  if (list.livros_da_lista !== undefined) {
    livros_da_lista = list.livros_da_lista.map(book => ({
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
  if (livros_da_lista.length > 0) {
    data.livros_da_lista = {
      create: livros_da_lista
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
  console.log("review insertion", review);
  try {
    // Insere os dados formatados da avaliação no banco de dados
    const reviewInserted = await prisma.review.create({
      data: {
        autor: review.autor,
        titulo: review.titulo,
        sumario: review.sumario,
        // link_url_review: review.link_url_review,
        livro: {
          connect: {
            isbn: review.isbn
          }
        }
      },
    });
    // console.log("REVIEW INSERTION: " + reviewInserted.toString());
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
    console.log("Erro na inserção dos livros da lista: " + error);
  }
}
