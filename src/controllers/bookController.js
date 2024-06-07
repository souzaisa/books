import { fetchNytAllBestSellers, fetchAllIsbnsFromNytLists, fetchReviewsByIsbns } from "../services/newYorkTimesService.js";
import { searchBook, getBooksDetailsFromGoogleBooks, fetchGoogleBookReviewsByIsbns } from "../services/googleBookService.js";

export async function getAllBooksFromNYTLists(req, res) {
  try {
    const lists = await fetchNytAllBestSellers();

    if (!lists) throw "Não foi possível completar a solicitação!";
    if (!lists.results) throw "Não foi possível obter as listas!";
    if (lists.results.length === 0) throw "Não há livros na lista!";

    let booksLists = await Promise.all(lists.results.map(async list => {
      return await fetchNytAllBestSellers(list.list_name);
    }));

    const books = booksLists.map(list => {
      if (!list) return;
      if (!list.results) return;
      if (!list.results.books) return;

      const ISBNList = list.results.books.map(list => {
        if (list && list.primary_isbn13) return list.primary_isbn13;
      });
      return ISBNList;
    });

    res.json(books);
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
}

export async function getBooksByISBN(req, res) {
  try {
    const isbns = await fetchAllIsbnsFromNytLists();
    const booksDetails = await getBooksDetailsFromGoogleBooks(isbns);
    res.json(booksDetails);
  } catch (error) {
    console.error('Erro ao obter livros por ISBN:', error);
    res.status(500).json({ error: error.toString() });
  }
}

export async function getAllReviews(req, res) {
  try {
    const isbns = await fetchAllIsbnsFromNytLists();
    const reviews = await fetchReviewsByIsbns(isbns);
    res.json(reviews);
  } catch (error) {
    console.error('Erro ao obter reviews:', error);
    res.status(500).json({ error: error.toString() });
  }
}

export async function testFetchGoogleBookReviews(req, res) {
  try {
    const isbns = await fetchAllIsbnsFromNytLists();
    const reviews = await fetchGoogleBookReviewsByIsbns(isbns);
    res.json(reviews);
  } catch (error) {
    console.error('Erro ao testar fetchGoogleBookReviewsByIsbns:', error);
    res.status(500).json({ error: error.toString() });
  }
}
