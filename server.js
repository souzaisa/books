import express from 'express';
const app = express();

import { searchBook, listBooks } from "./src/scripts/googleBookConsumer.js";
import { fetchNytAllBestSellers, fetchAllIsbnsFromAllLists } from "./src/scripts/newYorkTimesConsumer.js";
import { getBooksByISBN } from "./src/scripts/utils.js";

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
        const book = await searchBook("9781446484197");
        res.json(book); 
    } catch (err) {
        res.status(500).json({ error: 'Erro: ' + err });
    }
});

// Rota para testar a conexão com o banco de dados
app.get('/database', async (req, res) => {
    try {
        res.json({ message: 'Connection has been established successfully.' });
    } catch (err) {
        res.status(500).json({ error: 'Erro: ' + err });
    }
});

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
        const isbns = await fetchAllIsbnsFromAllLists();
        res.json(isbns);
    } catch (err) {
        res.status(500).json({ error: 'Erro: ' + err });
    }
});

// Rota para buscar detalhes dos livros pelos ISBNs do NYT na API do Google Books
app.get('/nyt-books', async (req, res) => {
    try {
        const data = await getBooksByISBN();
        res.json(data); 
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
