import express from 'express';
import { getBooksByISBN } from './controllers/bookController.js';
import { searchBook, listBooks, fetchGoogleBookReviewsByIsbns } from './services/googleBookService.js';
import { fetchNytAllBestSellers, fetchAllIsbnsFromNytLists, fetchReviewsByIsbns } from './services/newYorkTimesService.js';
import { arrayFormater, bookDataFormater, listDataFormater } from './utils/dataFormatter.js';
import { bookInsertion } from './repositories/databaseInsertions.js';

const router = express.Router();

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
    const book = await searchBook("9781446484198");
    res.json(book);
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

    res.json(booksByISBN);
  } catch (err) {
    res.status(500).json({ error: 'Erro: ' + err });
  }
});

// Rota para testar a conexão e população do banco com livros
router.post('/database-book', async (req, res) => {
  try {
    const books = await listBooks();
    const booksList = arrayFormater(books);
    const booksFormated = booksList.map(book => bookDataFormater(book));
    const prisma = new PrismaClient();
    booksFormated.forEach(book => {
      try {
        if (book && typeof book === 'object' && book.hasOwnProperty('isbn')) {
          if (book.isbn !== undefined && book.isbn !== "") {
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

// Rota para tratar requisições não encontradas (404)
router.get('*', (req, res) => {
  res.status(404).json({ error: 'Página não encontrada!' });
});

// Precisa de ajustes

// router.post("/create-lists", async (req, res) => {
//   const nytLists = await fetchNytAllBestSellers();
//   console.log(nytLists);
//   // trata as informações
//   const listsFormated = nytLists.map(list => listDataFormater(list));
//   const prisma = new PrismaClient();

//   listsFormated.forEach(list => {
//     try {
//       listInsertion(list, prisma); // fazer o tratamento de erros
//     } catch (error) {
//       console.log(error);
//     }
//   });

//   await prisma.$disconnect();
//   res.json(listsFormated);
// });

export default router;