export function bookDataFormater(book) {
  try {
    let formatedBook = {
      isbn: book.volumeInfo.industryIdentifiers[0].identifier,
      titulo: book.volumeInfo.title,
      autor: book.volumeInfo.authors.toString(),
      categoria: book.volumeInfo.categories.toString(),
      data_publicacao: dateFormater(book.volumeInfo.publishedDate),
      descricao: book.volumeInfo.description || null,
      num_paginas: book.volumeInfo.pageCount || null,
      link_thumbnail: book.imageLinks ? book.imageLinks.thumbnail : null,
      nota_media: book.averageRating ? parseFloat(book.averageRating) : null,
    };
    return formatedBook;
  } catch (error) {
    console.log("Erro de formatação do livro: " + error);
  }
}

export function listDataFormater(list) {
  try {
    let formatedList = {
      nome: list.title,
      data_publicacao: dateFormater(list.publishDate),
      data_avaliacao: dateFormater(list.rateDate),
      livrosdalista: list.isbns
    };
    return formatedList;
  } catch (error) {
    console.log("Erro de formatação da lista: " + error);
  }
}

export function dateFormater(date) {
  const [year, month, day] = date.split("-"); // "2024-06-06"
  return new Date(year, parseInt(month) - 1, day).toISOString();
}

export function arrayFormater(array) {
  let booksList = [];
  array.forEach(element => {
    if (element) {
      element.forEach(element2 => {
        if (element2) {
          if (element2.items) {
            element2.items.forEach(book => {
              if (book) booksList.push(book);
            });
          }
        }
      });
    }
  });
  return booksList;
}
