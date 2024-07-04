import { fetchAllIsbnsFromNytLists } from "../services/newYorkTimesService.js";
import { searchBook } from "../services/googleBookService.js";

export async function getBooksByISBN(req, res) {
  try {
    const isbns = await fetchAllIsbnsFromNytLists();
    const booksDetails = await Promise.all(isbns.map(async isbn => {
      return await searchBook(isbn.isbn13);
    }));
    return booksDetails;
  } catch (error) {
    console.error('Erro ao obter livros por ISBN:', error);
    res.status(500).json({ error: error.toString() });
  }
}

