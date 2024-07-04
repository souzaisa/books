import { PrismaClient } from '@prisma/client'
import { searchBook } from '../services/googleBookService.js';
import { arrayFormater, arrayVerifier } from '../utils/dataFormatter.js';
import { bookDataFormater } from '../utils/googleBooksDataFormatter.js';
const prisma = new PrismaClient();

export async function bookExists(isbn, prisma) {
  const book = await prisma.livro.findUnique({
    where: { isbn }
  });
  return book !== null;
}

export async function bookInsertion(book, prisma) {
  if (!await bookExists(book.isbn, prisma)) {
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
      }
    });
    return bookInserted;
  }
}

export async function listInsertion(list, prisma) {
  const data = {
    nome: list.nome,
    data_publicacao: list.data_publicacao,
    frequencia: list.frequencia,
  }
  try {
    const listInserted = await prisma.lista.create({ data })
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
        sumario: review.sumario,
        link_url_review: review.link_url_review,
        numero_review: review.ratingsCount,
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
export async function booksOfListInsertion(booksList, prisma) {
  try {
    await prisma.livros_da_lista.create({
      data: {
        livro: {
          connect: {
            isbn: booksList.livro_isbn
          }
        },
        lista: {
          connect: {
            nome: booksList.lista_nome,
            isbn: booksList.livro_isbn
          }
        },
        rank: booksList.rank,
      }
    });
  } catch (erro) {
    console.log("Erro na inserção dos livros da lista: " + erro);
  }

}


export async function booksOfListInsertionBS(booksList, prisma) {
  try {
    await prisma.livros_da_lista.create({
      data: {
        livro: {
          connect: {
            isbn: booksList.isbns[0].isbn13
          }
        },
        lista: {
          connect: {
            nome: booksList.ranks_history[0].list_name
          }
        },
        rank: booksList.ranks_history[0].rank // Adicione o rank, se disponível
      }
    });
    console.log(data);

  } catch (erro) {
    console.log("Erro na inserção dos livros da lista: " + erro);
  }

}