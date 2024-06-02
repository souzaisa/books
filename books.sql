-- ####Código de criação das tabelas no banco#### --

-- Cria a Tabela Livro para armazenar as informações sobre os livros.
CREATE TABLE Livro (
    id INT PRIMARY KEY AUTO_INCREMENT,
    isbn VARCHAR(13) UNIQUE NOT NULL,
    titulo VARCHAR(255) NOT NULL,
    autor VARCHAR(255) NOT NULL,
    categoria VARCHAR(255) NOT NULL,
    dataPublicacao DATE NOT NULL,
    descricao TEXT,
    numPaginas INT CHECK (numPaginas >= 0),
    link_Thumbnail VARCHAR(255),
    notaMedia FLOAT CHECK (notaMedia BETWEEN 1 AND 5),
);

-- Cria a Tabela Review para armazenar as informações sobre as reviews.
CREATE TABLE Review (
    id INT PRIMARY KEY AUTO_INCREMENT,
    autor VARCHAR(255) NOT NULL,
    dataPublicacao DATE NOT NULL,
    sumario TEXT,
    link_URL_Review VARCHAR(255),
    livroId INT NOT NULL,
    FOREIGN KEY (livroId) REFERENCES Livro(id)
);

-- Cria a Tabela Lista para armazenar as informações sobre as listas.
CREATE TABLE Lista (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(255) NOT NULL,
    dataPublicacao DATE NOT NULL,
    dataAvaliacao DATE,
);

-- Cria a Tabela Livrosdalista para representar a relação entre Livro e Lista.
CREATE TABLE Livrosdalista (
    listaId INT NOT NULL,
    livroId INT NOT NULL,
    rank INT NOT NULL CHECK (rank BETWEEN 1 AND 15),
    PRIMARY KEY (listaId, livroId),
    FOREIGN KEY (listaId) REFERENCES Lista(id),
    FOREIGN KEY (livroId) REFERENCES Livro(id)
);

-- #### Criação de indices #### --

-- Cria o indice autor do livro
CREATE INDEX idx_autor ON Livro (autor);

-- Cria o indice categoria/data
CREATE INDEX idx_categoria_data ON Livro (categoria, dataPublicacao);

-- Cria o indice nome da lista
CREATE INDEX idx_nome ON Lista (nome);

-- #### Criação dos usuários do banco #### --

--Cria o usuário DBA
CREATE USER user_dba WITH PASSWORD 'senha1234';
ALTER USER user_dba WITH SUPERUSER;

-- Cria o usuário Aplicação
CREATE USER user_app WITH PASSWORD '321senha';
GRANT USAGE ON SCHEMA books TO user_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA books TO user_app;

