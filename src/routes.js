import express from 'express';
import { fetchGoogleBookReviewsByIsbns } from './services/googleBookService.js';
import { fetchNytAllBestSellers, fetchAllIsbnsFromNytLists, fetchAllFromNytLists } from './services/newYorkTimesService.js';
import { listDataFormater } from './utils/dataFormatter.js';
import { dataBooks, searchDataBooks } from './services/dataProcessingService.js';
import { googleReviewDataFormater, bookDataFormater } from './utils/googleBooksDataFormatter.js';
import { livrosDaListaDataFormater } from './utils/newYorkTimesDataFormatter.js'
import { bookExists, bookInsertion, listInsertion, booksOfListInsertion, booksOfListInsertionBS, reviewInsertion } from './repositories/databaseInsertions.js';
import { PrismaClient } from '@prisma/client'

const router = express.Router();
const prisma = new PrismaClient();

// Rota para testar a conexão e popular o banco com livros
router.post('/create-book', async (req, res) => {
  try {
    let booksFormated = await dataBooks();
    // booksFormated = arrayVerifier(booksFormated, 'isbn');
    await Promise.all(booksFormated.map(async book => {
      try {
        if (book && typeof book === 'object' && book.hasOwnProperty('isbn')) {
          if (book.isbn !== undefined && book.isbn !== "" && book.isbn.length === 13) {
            await bookInsertion(book, prisma);  // Inserir livro
          }
        }
      } catch (erro) {
        console.log(erro);
      }
    }));

    await prisma.$disconnect()
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
  const booksOfList = await fetchAllFromNytLists();
  await Promise.all(booksOfList.map(async bookList => {
    try {
      if (!await bookExists(bookList.livro_isbn, prisma)) {
        const book = await searchDataBooks(bookList.livro_isbn);
        if (book) {
          if (book.isbn !== undefined && book.isbn !== "" && book.isbn.length === 13) {
            await bookInsertion(book, prisma);
          }
        }
        if (await bookExists(bookList.livro_isbn, prisma)) {
          booksOfList.forEach(booksList => {
            try {
              booksOfListInsertion(booksList, prisma);
            } catch (error) {
              console.log('Erro:', error);
            }
          });
        }
      } else {
        booksOfList.forEach(booksList => {
          try {
            booksOfListInsertion(booksList, prisma);
          } catch (error) {
            console.log('Erro:', error);
          }
        });
      }
    } catch (error) {
      console.log("Erro ao inserir livro da lista");
    }
  }));


  await prisma.$disconnect();
  res.json(booksOfList);
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

// Rota para obter o histórico de best-sellers e inserir no banco de dados
// router.post("/best-sellers-history", async (req, res) => {
//   const dataBooks = await fetchBestSellersHistory();
//   dataBooks.results.forEach(async data => {
//     try {
//       if (data.isbns != []) {
//         if (!await bookExists(data.isbns[0].isbn13, prisma)) {
//           const book = await searchDataBooks(data.isbns[0].isbn13);
//           if (book) {
//             if (book.isbn != undefined && book.isbn != "") {
//               await bookInsertion(book, prisma);
//             }

//           } else {
//             res.status(404).json({ error: "Nenhum dado de best-sellers encontrado na resposta da API" });
//           }
//         }

//       }

//     } catch (error) {
//       console.log("Erro ao formatar e inserir livro da lista: " + error);
//     }
//   });

//   dataBooks.results.forEach(booksList => {
//     try {
//       if (booksList.isbns != []) {
//         const booksListFormated = formatBooksListBS(booksList);
//         booksOfListInsertion(booksListFormated, prisma);
//       }
//       else {
//         console.log("Livro sem isbn válido.");
//       }
//     } catch (error) {
//       console.log('Erro:', error);
//     }
//   });
//   await prisma.$disconnect();
// });

// Rota para tratar requisições não encontradas (404)
router.get('*', (req, res) => {
  res.status(404).json({ error: 'Página não encontrada!' });
});

export default router;
