import fetch from 'node-fetch';
import { getBooksByISBN } from '../controllers/bookController.js';
import { listBooks } from '../services/googleBookService.js';
import { bookDataFormater } from '../utils/googleBooksDataFormatter.js';
import { arrayFormater, arrayFormater2, arrayVerifier, sumArrays } from '../utils/dataFormatter.js';

export async function dataBooks() {
  const books = await listBooks();
  const booksByNYT = await getBooksByISBN(); // arrumar a função para vir somente o primary isbn13
  const nytList = arrayFormater2(booksByNYT);
  const googleList = arrayFormater(books);
  const booksList = nytList.concat(googleList);
  const booksFormated = booksList.map(book => bookDataFormater(book));
  const booksVerifier = arrayVerifier(booksFormated, 'isbn');

  return booksVerifier;
}