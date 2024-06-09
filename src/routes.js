import express from 'express';
import { getBooksByISBN } from './controllers/bookController.js';
import { searchBook, listBooks, fetchGoogleBookReviewsByIsbns } from './services/googleBookService.js';
import { fetchNytAllBestSellers, fetchAllIsbnsFromNytLists, fetchAllFromNytLists, fetchReviewsByIsbns, fetchBookByListName } from './services/newYorkTimesService.js';
import { arrayFormater, arrayFormater2, listDataFormater, arrayVerifier, sumArrays } from './utils/dataFormatter.js';
import { dataBooks } from './services/dataProcessingService.js';
import { bookDataFormater } from './utils/googleBooksDataFormatter.js';
import { bookInsertion, listInsertion, booksOfListInsertion } from './repositories/databaseInsertions.js';
import { PrismaClient } from '@prisma/client'

const router = express.Router();
let booksReview;

/*-- Rotas que usam a API do Google Books --*/

// Rota para listar livros de vários assuntos
router.get('/', async (req, res) => {
  try {
    const resposta = await listBooks();
    res.json(resposta);
  } catch (err) {
    res.status(500).json({ error: 'Erro: ' + err });
  }
});

// Rota para buscar um livro específico por ISBN
router.get('/book', async (req, res) => {
  try {
    const dataBooks = await getBooksByISBN();
    res.json(dataBooks);
  } catch (err) {
    res.status(500).json({ error: 'Erro: ' + err });
  }
});


/*-- Rotas que usam a API do New York Times --*/

// Rota para buscar todas as listas de Best Sellers da API do NYT
router.get('/nyt-lists', async (req, res) => {
  try {
    const data = await fetchNytAllBestSellers();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Erro: ' + err });
  }
});

// Rota para buscar uma lista de Best Sellers específica da API do NYT
router.get('/nyt-list/:listName', async (req, res) => {
  const listName = req.params.listName;
  try {
    const data = await fetchNytAllBestSellers(listName);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Erro: ' + err });
  }
});

// Rota para buscar todos os ISBNs-13 dos livros presentes nas listas de Best Seller da NYT
router.get('/nyt-all-isbns', async (req, res) => {
  try {
    const isbns = await fetchAllIsbnsFromNytLists();
    res.json(isbns);
  } catch (err) {
    res.status(500).json({ error: 'Erro: ' + err });
  }
});

// Rota para buscar os Reviews de um determinado ISBN
router.get('/nyt-reviews', async (req, res) => {
  try {
    const isbns = await fetchAllIsbnsFromNytLists();
    const reviews = await fetchReviewsByIsbns(isbns);
    if (reviews.length > 0) {
      res.json(reviews);
    } else {
      res.json({ message: "Nenhum review encontrado para os ISBNs fornecidos." });
    }
  } catch (err) {
    res.status(500).json({ error: 'Erro: ' + err });
  }
});

/*-- Rotas usadas na junção das duas APIs para tratar as requisições --*/

// Rota para buscar avaliações do Google Books dos ISBNs de Best Sellers do NYT
router.get('/google-book-reviews', async (req, res) => {
  try {
    const isbns = await fetchAllIsbnsFromNytLists();
    const reviews = await fetchGoogleBookReviewsByIsbns(isbns);
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: 'Erro: ' + err });
  }
});

// Rota para montar o array de livros completo
router.get('/get-all-books', async (req, res) => {
  try {
    const randomBooks = await listBooks();
    const booksByISBN = await getBooksByISBN(); // Está retornando um array vazio!!
    console.log(booksByISBN);

    res.json(booksByISBN);
  } catch (err) {
    res.status(500).json({ error: 'Erro: ' + err });
  }
});

// Rota para testar a conexão e população do banco com livros
router.post('/database-book', async (req, res) => {
  try {
    const booksFormated = await dataBooks();
    // booksFormated = arrayVerifier(booksFormated, 'isbn');
    console.log('booksformated', booksFormated);
    const prisma = new PrismaClient();
    booksFormated.forEach(book => {
      try {
        if (book && typeof book === 'object' && book.hasOwnProperty('isbn')) {
          if (book.isbn !== undefined && book.isbn !== "" && book.isbn.length == 13) {
            console.log(book.isbn);
            bookInsertion(book, prisma);
          }
        }
      } catch (erro) {
        console.log(erro);
      }
    }).then(async () => {
      await prisma.$disconnect()
    })
      .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
      });
    res.json(booksFormated);
  } catch (err) {
    res.status(500).json({ error: 'Erro: ' + err });
  }
});

router.post("/books-list", async (req, res) => {
  try {
    const booksOfList = await fetchAllFromNytLists();
    const prisma = new PrismaClient();
    booksOfList.forEach(list => {
      try {
        booksOfListInsertion(list, prisma);
      } catch (error) {
        console.log(error);
      }
    }).then(async () => {
      await prisma.$disconnect()
    }).catch(async (e) => {
      console.error(e)
      await prisma.$disconnect()
      process.exit(1)
    });
    res.json(booksOfList);
  } catch (error) {
    res.status(500).json({ error: 'Erro: ' + error });
  }
});

router.post("/create-reviews", async (req, res) => {
  try {
    const booksFormated = await dataBooks();
    // const prisma = new PrismaClient();
    const reviewsIsbns = booksFormated.map(book => {
      if (book && book.isbn) {
        return book.isbn;
      }
    })
    const review = await fetchGoogleBookReviewsByIsbns(reviewsIsbns);
    console.log("review>>>>>>>>>>>>>>>>>>>>", review);
    res.json(review);
  }
  catch (error) {
    res.status(500).json({ error: 'Erro: ' + error });
  }
});

// Refatorar para criar somente listas
// Precisa de ajustes
router.post("/create-lists", async (req, res) => {
  const nytLists = await fetchNytAllBestSellers();
  const lists = nytLists.results.filter(value => JSON.stringify(value) !== '{}')
  const nytListsFormated = await Promise.all(lists.map(async list => {
    const books = await fetchBookByListName(list.list_name_encoded)
    if (books.length > 0) {
      list.books = books
    }
    return listDataFormater(list)
  }
  ))

  const prisma = new PrismaClient();

  nytListsFormated.forEach(formatedList => {
    try {
      listInsertion(formatedList, prisma);
    } catch (error) {
      console.log(error);
    }
  });

  await prisma.$disconnect();
  res.json(nytListsFormated);
});

// Rota para tratar requisições não encontradas (404)
router.get('*', (req, res) => {
  res.status(404).json({ error: 'Página não encontrada!' });
});

export default router;
