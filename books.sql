-- #### Criação das tabelas #### --

-- Cria a Tabela Livro para armazenar as informações sobre os livros.
CREATE TABLE Livro (
    isbn VARCHAR(13) PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    autor VARCHAR(255) NOT NULL,
    categoria VARCHAR(255) NOT NULL,
    data_publicacao DATE NOT NULL,
    descricao TEXT,
    num_paginas INT CHECK (num_paginas >= 0),
    link_thumbnail VARCHAR(255),
    nota_media FLOAT CHECK (nota_media BETWEEN 1 AND 5)
);

-- Cria a Tabela Review para armazenar as informações sobre as reviews.
CREATE TABLE Review (
    autor VARCHAR(255) NOT NULL,
    livro_isbn VARCHAR(13) NOT NULL,
    data_publicacao DATE NOT NULL,
    sumario TEXT,
    link_url_review VARCHAR(255),
    PRIMARY KEY (autor, livro_isbn),
    FOREIGN KEY (livro_isbn) REFERENCES Livro(isbn)
);

-- Cria a Tabela Lista para armazenar as informações sobre as listas.
CREATE TABLE Lista (
    nome VARCHAR(255) PRIMARY KEY,
    data_publicacao DATE NOT NULL,
    data_avaliacao DATE
);

-- Cria a Tabela Livrosdalista para representar a relação entre Livro e Lista.
CREATE TABLE Livrosdalista (
    lista_nome VARCHAR(255) NOT NULL,
    livro_isbn VARCHAR(13) NOT NULL,
    rank INT CHECK (rank BETWEEN 1 AND 15),
    PRIMARY KEY (lista_nome, livro_isbn),
    FOREIGN KEY (lista_nome) REFERENCES Lista(nome),
    FOREIGN KEY (livro_isbn) REFERENCES Livro(isbn)
);

-- #### Criação de índices #### --

-- Cria o índice autor do livro
CREATE INDEX idx_autor ON Livro (autor);

-- Cria o índice categoria/data
CREATE INDEX idx_categoria_data ON Livro (categoria, data_publicacao);

-- Cria o índice nome da lista
CREATE INDEX idx_nome ON Lista (nome);

-- #### Criação dos usuários do banco #### --

-- Cria o usuário DBA
CREATE USER user_dba WITH PASSWORD 'senha1234';
ALTER USER user_dba WITH SUPERUSER;

-- Cria o usuário Aplicação
CREATE USER user_app WITH PASSWORD '321senha';
GRANT USAGE ON SCHEMA books TO user_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA books TO user_app;