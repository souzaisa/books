import express from 'express';
import router from './src/routes.js';

const app = express();
const port = 8080;

// Middleware para parsear URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Usar as rotas definidas
app.use('/', router);

// Inicialização do servidor
app.listen(port, () => {
    console.log('Servidor na porta: localhost:' + port);
});
