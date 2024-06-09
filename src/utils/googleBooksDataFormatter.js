import { dateFormater } from '../utils/dataFormatter.js'

export function bookDataFormater(book) {
  try {
    let formatedBook = {
      isbn: book.volumeInfo.industryIdentifiers[0].identifier.trim(),
      titulo: book.volumeInfo.title.trim(),
      autor: book.volumeInfo.authors.toString().trim(),
      categoria: book.volumeInfo.categories.toString().trim(),
      data_publicacao: dateFormater(book.volumeInfo.publishedDate),
      descricao: book.volumeInfo.description.trim() || null,
      num_paginas: book.volumeInfo.pageCount || null,
      link_thumbnail: book.imageLinks ? book.imageLinks.thumbnail : null,
      nota_media: book.averageRating ? parseFloat(book.averageRating) : null,
    };
    return formatedBook;
  } catch (error) {
    console.log("Erro de formatação do livro: " + error);
  }
}

// Função para formatar dados de avaliação do Google Books
export function googleReviewDataFormater(review) {
  try {
    // Realiza a formatação dos dados da avaliação do Google Books
    let formatedReview = {
      isbn: review.isbn,
      autor: review.authors.toString(),
      data_publicacao: null,
      link_url_review: null,
      numero_review: parseInt(review.ratingsCount) || null,
      sumario: review.reviews || null
    };
    return formatedReview;
  } catch (error) {
    console.log("Erro de formatação da google review: " + error);
  }
}
