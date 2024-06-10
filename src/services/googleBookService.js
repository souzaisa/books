import fetch from 'node-fetch';

async function searchBooksBySubjects(subject) {
  let startIndex = 0;
  let books = [];
  for (let i = 0; i < 10; i++) {
    try {
      const response = await fetch('https://www.googleapis.com/books/v1/volumes?q=subject=' + subject + '&orderBy=relevance&printType=books&maxResults=40&startIndex=' + startIndex);
      const responseJSON = await response.json();
      books.push(responseJSON);
      startIndex += 40;
    } catch (erro) {
      return erro.toString();
    }
  }
  return books;
}

export async function searchBook(ISBN) {
  const response = await fetch('https://www.googleapis.com/books/v1/volumes?q=isbn:' + ISBN);
  const book = await response.json();
  return book;
}

export async function listBooks() {
  const subjects = ["action", "horror", "fantasy", "romance", "science fiction", "mistery", "suspense", "drama", "comedy", "poetry", "memories", "autobiography", "biography", "history", "essay", "literary criticism", "comics", "graphic novel", "children's books", "cookbook", "travel book", "self-help book", "business book", "self-improvement book", "war Book"];

  try {
    let data = await Promise.all(subjects.map(async subject => {
      return await searchBooksBySubjects(subject);
    }));
    return data;
  } catch (erro) {
    return erro.toString();
  }
}

/**
 * Função para buscar detalhes dos livros na API do Google Books para um array de ISBNs.
 * @param {array} isbns - Array de ISBNs
 */
export async function getBooksDetailsFromGoogleBooks(isbns) {
  try {
    const booksDetails = await Promise.all(isbns.map(async isbn => {
      const book = await searchBook(isbn);
      return book;
    }));
    return booksDetails;
  } catch (error) {
    console.error('Erro ao buscar detalhes dos livros na API do Google Books:', error);
    throw error;
  }
}

/**
 * Busca avaliações na API do Google Books por ISBNs
 * @param {array} isbns - Array de ISBNs
 */
export async function fetchGoogleBookReviewsByIsbns(isbns) {
  try {
    const reviews = [];

    for (const isbn of isbns) {
      const url = `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`;
      try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.items && data.items.length > 0) {
          const bookData = data.items[0].volumeInfo;
          if (bookData && bookData.averageRating && bookData.ratingsCount) {
            reviews.push({
              isbn: isbn,
              title: bookData.title,
              authors: bookData.authors,
              averageRating: bookData.averageRating,
              ratingsCount: bookData.ratingsCount,
              reviews: bookData.description
            });
          } else {
            console.log(`Nenhuma avaliação encontrada para o ISBN: ${isbn}`);
          }
        } else {
          console.log(`Nenhum livro encontrado para o ISBN: ${isbn}`);
        }

      } catch (error) {
        console.error(`Erro ao buscar avaliações para o ISBN ${isbn}:`, error);
      }
    }

    return reviews;
  } catch (error) {
    console.error('Erro ao buscar avaliações:', error);
    throw error;
  }
}