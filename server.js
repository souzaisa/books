import express from 'express';
const app = express();

import { searchBook, listBooks } from "./src/scripts/googleBookConsumer.js";
import { sequelize } from "./src/config/db.config.js";

app.use(express.urlencoded({ extended: true }));

const port = 8080;

app.get('/', async (req, res) => {
    try {
        const resposta = await listBooks();
        res.send(resposta);
    } catch (err) {
        res.status(500).send('Erro' + err);
    }
});

app.get('/book', async (req, res) => {
    try {
        const book = await searchBook("9781446484197");
        res.send(book);
    } catch (err) {
        res.status(500).send('Erro' + err);
    }
});

app.get('/database', async (req, res) => {
    try {
        await sequelize.authenticate();
        sequelize.close()   //Utilzar somente depois de popular todo o banco
        res.send('Connection has been established successfully.');
    } catch (err) {
        res.status(500).send('Erro' + err);
    }
});

app.get('*', (req, res) => {
    res.send('Página não encontrada!');
});

app.listen(port, () => {
    console.log('Servidor na porta: localhost:' + port);
});
