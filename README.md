# Books App - Informações Iniciais

## Iniciar o Projeto
```bash
  git clone https://github.com/souzaisa/books.git
  npm install
  npm start
```

## Rotas
- http://localhost:8080: Exibirá a lista de livros de vários assuntos.
- http://localhost:8080/book: Buscará um livro específico por ISBN.
- http://localhost:8080/database: Testará a conexão com o banco de dados.
- http://localhost:8080/nyt-lists: Buscará todas as listas de Best Sellers do NYT.
- http://localhost:8080/nyt-list/:listName: Buscará uma lista de Best Sellers específica da API do NYT (substitua :listName pelo nome da lista desejada, por exemplo, hardcover-fiction).
