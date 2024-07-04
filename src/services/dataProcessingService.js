import fetch from 'node-fetch';
import { getBooksByISBN } from '../controllers/bookController.js';
import { listBooks, searchBook } from '../services/googleBookService.js';
import { bookDataFormater } from '../utils/googleBooksDataFormatter.js';
import { arrayFormater, arrayFormater2, arrayVerifier, sumArrays } from '../utils/dataFormatter.js';

export async function dataBooks() {
  const books = await listBooks();
  const googleList = arrayFormater(books);
  const booksFormated = googleList.map(book => bookDataFormater(book));
  const booksVerifier = arrayVerifier(booksFormated, 'isbn');

  return booksVerifier;
}

export async function searchDataBooks(isbn) {
  const book = await searchBook(isbn);
  if (book) {
    const booksFormated = bookDataFormater(book);
    return booksFormated;
  } else {
    return null;
  }
}