import express from 'express';
import { fetchGoogleBookReviewsByIsbns } from './services/googleBookService.js';
import { fetchNytAllBestSellers, fetchAllFromNytLists} from './services/newYorkTimesService.js';
import { listDataFormater} from './utils/dataFormatter.js';
import { dataBooks } from './services/dataProcessingService.js';
import { bookInsertion, listInsertion, booksOfListInsertion } from './repositories/databaseInsertions.js';
import { PrismaClient } from '@prisma/client'

const router = express.Router();

// Rota para testar a conexão e população do banco com livros
router.post('/create-books', async (req, res) => {
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

router.post("/create-books-list", async (req, res) => {
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
  const lists = nytLists.results.filter(value => JSON.stringify(value) !== '{}');
  const nytListsFormated = await Promise.all(lists.map(async list => {
    return listDataFormater(list);
  }));
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
