import express from 'express';
import { PrismaClient } from '@prisma/client'
const app = express();

import { searchBook, listBooks, fetchGoogleBookReviewsByIsbns } from "./src/scripts/googleBookConsumer.js";
import { fetchNytAllBestSellers, fetchAllIsbnsFromNytLists, fetchReviewsByIsbns } from "./src/scripts/newYorkTimesConsumer.js";
import { getBooksByISBN, arrayFormater, bookDataFormater } from "./src/scripts/utils.js";
import { bookInsertion } from "./src/scripts/databaseInsertions.js";


app.use(express.urlencoded({ extended: true }));

const port = 8080;

// Rota para listar livros de vários assuntos
app.get('/', async (req, res) => {
    try {
        const resposta = await listBooks();
        res.json(resposta);
    } catch (err) {
        res.status(500).json({ error: 'Erro: ' + err });
    }
});

// Rota para buscar um livro específico por ISBN
app.get('/book', async (req, res) => {
    try {
        const book = await searchBook("9781446484198");
        res.json(book);
    } catch (err) {
        res.status(500).json({ error: 'Erro: ' + err });
    }
});

// // Rota para testar a conexão e população do banco com livros
// app.get('/database-book', async (req, res) => {
//     try {
//         const books = await listBooks();
//         const booksList = arrayFormater(books);
//         const booksFormated = booksList.map(book => bookDataFormater(book));
//         const prisma = new PrismaClient();
//         booksFormated.forEach(book => {
//             try {
//                 if (book && typeof book === 'object' && book.hasOwnProperty('isbn')) {
//                     if (book.isbn !== undefined && book.isbn !== "") {
//                         console.log(book.isbn);
//                         bookInsertion(book, prisma);
//                     }
//                 }
//             } catch (erro) {
//                 console.log(erro);
//             }
//         }).then(async () => {
//             await prisma.$disconnect()
//         })
//             .catch(async (e) => {
//                 console.error(e)
//                 await prisma.$disconnect()
//                 process.exit(1)
//             });
//         res.json(booksFormated);
//     } catch (err) {
//         res.status(500).json({ error: 'Erro: ' + err });
//     }
// });

// Rota para buscar todas as listas de Best Sellers da API do NYT
app.get('/nyt-lists', async (req, res) => {
    try {
        const data = await fetchNytAllBestSellers();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: 'Erro: ' + err });
    }
});

// Rota para buscar uma lista de Best Sellers específica da API do NYT
app.get('/nyt-list/:listName', async (req, res) => {
    const listName = req.params.listName;
    try {
        const data = await fetchNytAllBestSellers(listName);
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: 'Erro: ' + err });
    }
});

// Rota para buscar todos os ISBNs-13 dos livros presentes nas listas de Best Seller da NYT
app.get('/nyt-all-isbns', async (req, res) => {
    try {
        const isbns = await fetchAllIsbnsFromNytLists();
        res.json(isbns);
    } catch (err) {
        res.status(500).json({ error: 'Erro: ' + err });
    }
});

// Rota para buscar todos os ISBNs-13 únicos dos livros presentes nas listas de Best Sellers da NYT e seus reviews
app.get('/nyt-reviews', async (req, res) => {
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

// Rota para buscar avaliações do Google Books para ISBNs de Best Sellers do NYT
app.get('/google-book-reviews', async (req, res) => {
    try {
        const isbns = await fetchAllIsbnsFromNytLists();
        const reviews = await fetchGoogleBookReviewsByIsbns(isbns);
        res.json(reviews);
    } catch (err) {
        res.status(500).json({ error: 'Erro: ' + err });
    }
});

// Rota para montar o array de livros completo
app.get('/get-all-books', async (req, res) => {
    try {
        const randomBooks = await listBooks();
        const booksByISBN = await getBooksByISBN(); // Está retornando um array vazio!!

        res.json(booksByISBN);
    } catch (err) {
        res.status(500).json({ error: 'Erro: ' + err });
    }
});

// Rota para tratar requisições não encontradas (404)
app.get('*', (req, res) => {
    res.status(404).json({ error: 'Página não encontrada!' });
});

// Inicialização do servidor
app.listen(port, () => {
    console.log('Servidor na porta: localhost:' + port);
});
