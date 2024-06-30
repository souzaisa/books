import express from 'express';
import { fetchGoogleBookReviewsByIsbns } from './services/googleBookService.js';
import { fetchNytAllBestSellers, fetchAllIsbnsFromNytLists, fetchAllFromNytLists } from './services/newYorkTimesService.js';
import { listDataFormater } from './utils/dataFormatter.js';
import { dataBooks } from './services/dataProcessingService.js';
import { googleReviewDataFormater } from './utils/googleBooksDataFormatter.js';
import { bookInsertion, listInsertion, booksOfListInsertion, reviewInsertion } from './repositories/databaseInsertions.js';
import { PrismaClient } from '@prisma/client'

const router = express.Router();

// Rota para testar a conexão e popular o banco com livros
router.post('/create-book', async (req, res) => {
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

// Rota para popular o banco de dados com as listas do NYT
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
  const prisma = new PrismaClient();

  try {
    // Obter livros com ISBNS do banco de dados
    const booksFromDb = await prisma.livro.findMany({
      select: {
        isbn: true
      }
    });

    // Extrair os ISBNS dos resultados
    const reviewsIsbns = booksFromDb.map(book => book.isbn);

    // Buscar reviews na API do Google Books usando os ISBNS
    if (reviewsIsbns.length > 0) {
      const reviews = await fetchGoogleBookReviewsByIsbns(reviewsIsbns);

      // Processar e inserir reviews no banco de dados
      for (const review of reviews) {
        console.log(review);
        try {
          const formatedReview = googleReviewDataFormater(review);
          await reviewInsertion(formatedReview, prisma);
        } catch (error) {
          console.error('Erro ao inserir review:', error);
        }
      }

      res.json({ message: 'Reviews inseridas com sucesso!' });
    } else {
      res.json({ message: 'Nenhum ISBN encontrado no banco de dados.' });
    }
  } catch (error) {
    console.error('Erro ao processar e inserir revisões:', error);
    res.status(500).json({ error: 'Erro: ' + error });
  } finally {
    await prisma.$disconnect();
  }
});

// Rota para tratar requisições não encontradas (404)
router.get('*', (req, res) => {
  res.status(404).json({ error: 'Página não encontrada!' });
});

export default router;
