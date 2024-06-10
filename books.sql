-- #### Criação das tabelas #### --

-- Cria a Tabela Livro para armazenar as informações sobre os livros.
CREATE TABLE livro (
    isbn VARCHAR(13) PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    autor TEXT NOT NULL,
    categoria VARCHAR(255) NOT NULL,
    data_publicacao DATE NOT NULL,
    descricao TEXT,
    num_paginas INT CHECK (num_paginas >= 0),
    link_thumbnail VARCHAR(255),
    nota_media FLOAT
);

-- Cria a Tabela Review para armazenar as informações sobre as reviews.
CREATE TABLE review (
    livro_isbn VARCHAR(13) NOT NULL,
    autor VARCHAR(255) NOT NULL,
    data_publicacao DATE,
    sumario TEXT,
    link_url_review VARCHAR(255),
    numero_review INT,
    PRIMARY KEY (autor, livro_isbn),
    FOREIGN KEY (livro_isbn) REFERENCES livro(isbn)
);

-- Cria a Tabela Lista para armazenar as informações sobre as listas.
CREATE TABLE lista (
    nome VARCHAR(255) PRIMARY KEY,
    data_publicacao DATE NOT NULL,
    frequencia VARCHAR(255)
);

-- Cria a Tabela Livrosdalista para representar a relação entre Livro e Lista.
CREATE TABLE livros_da_lista (
    lista_nome VARCHAR(255) NOT NULL,
    livro_isbn VARCHAR(13) NOT NULL,
    rank INT CHECK (rank BETWEEN 1 AND 15),
    PRIMARY KEY (lista_nome, livro_isbn),
    FOREIGN KEY (lista_nome) REFERENCES Lista(nome),
    FOREIGN KEY (livro_isbn) REFERENCES Livro(isbn)
);

-- #### Criação de índices #### --

-- Cria o índice autor do livro
CREATE INDEX idx_autor ON livro (autor);

-- Cria o índice categoria/data
CREATE INDEX idx_categoria_data ON livro (categoria, data_publicacao);

-- Cria o índice nome da lista
CREATE INDEX idx_nome ON lista (nome);

-- #### Criação dos usuários do banco #### --

-- Cria o usuário DBA
CREATE USER user_dba WITH PASSWORD 'senha1234';
ALTER USER user_dba WITH SUPERUSER;

-- Cria o usuário Aplicação
CREATE USER user_app WITH PASSWORD '321senha';
GRANT USAGE ON SCHEMA public TO user_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO user_app;