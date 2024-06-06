import { fetchNytAllBestSellers, fetchAllIsbnsFromNytLists, fetchReviewsByIsbns } from "./newYorkTimesConsumer.js";
import { searchBook, getBooksDetailsFromGoogleBooks, fetchGoogleBookReviewsByIsbns } from "./googleBookConsumer.js";

export async function getAllBooksFromNYTLists() {
    try {
        const lists = await fetchNytAllBestSellers();

        if (!lists) throw "Não foi possível completar a solicitação!";
        if (!lists.results) throw "Não foi possível obter as listas!";
        if (lists.results.length === 0) throw "Não há livros na lista!";

        let booksLists = await Promise.all(lists.results.map(async list => {
            return await fetchNytAllBestSellers(list.list_name);
        }));

        const books = booksLists.map(list => {
            if (!list) return;
            if (!list.results) return;
            if (!list.results.books) return;

            const ISBNList = list.results.books.map(list => {
                if (list && list.primary_isbn13) return list.primary_isbn13;
            });
            return ISBNList; //Está retornando array de arrays de ISBN's, deve retornar array de ISBN's
        });

        return books;
    } catch (error) {
        return error.toString();
    }
}

/**
 * Função para obter todos os livros por ISBN
 */
export async function getBooksByISBN() {
    try {
        const isbns = await fetchAllIsbnsFromNytLists();
        const booksDetails = await getBooksDetailsFromGoogleBooks(isbns);
        return booksDetails;
    } catch (error) {
        console.error('Erro ao obter livros por ISBN:', error);
        throw error;
    }
}

async function getAllReviews() {
    try {
        const isbns = await fetchAllIsbnsFromNytLists();
        const reviews = await fetchReviewsByIsbns(isbns);
        console.log(reviews);
    } catch (error) {
        console.error('Erro ao obter reviews:', error);
    }
}

getAllReviews();


// async function testFetchReviews() {
//     try {
//         const testIsbns = ['9781250178633', '9780593422878', '9781635575583']; // Adicione mais ISBNs conforme necessário
//         const reviews = await fetchReviewsByIsbns(testIsbns);
//         console.log(JSON.stringify(reviews, null, 2)); // Exibir resultados formatados
//     } catch (error) {
//         console.error('Erro ao testar fetchReviewsByIsbns:', error);
//     }
// }

// testFetchReviews();

async function testFetchGoogleBookReviews() {
    try {
        // Primeiro, obtemos todos os ISBNs.
        const isbns = await fetchAllIsbnsFromNytLists();
        // Em seguida, buscamos as avaliações desses ISBNs na API do Google Books.
        const reviews = await fetchGoogleBookReviewsByIsbns(isbns);
        console.log(JSON.stringify(reviews, null, 2)); // Exibir resultados formatados
    } catch (error) {
        console.error('Erro ao testar fetchGoogleBookReviewsByIsbns:', error);
    }
}


export function bookDataFormater(book) {
    try {
        let formatedBook = {
            "isbn": book.volumeInfo.industryIdentifiers[0].identifier,
            "titulo": book.volumeInfo.title,
            "autor": book.volumeInfo.authors.toString(),
            "categoria": book.volumeInfo.categories.toString(),
            "data_publicacao": dateFormater(book.volumeInfo.publishedDate),
            "descricao": book.volumeInfo.description ? book.volumeInfo.description : null,
            "num_paginas": book.volumeInfo.pageCount ? book.volumeInfo.pageCount : null,
            "link_thumbnail": book.imageLinks ? book.imageLinks.thumbnail : null,
            "nota_media": book.averageRating ? parseFloat(book.averageRating) : null,
        }
        return formatedBook;
    } catch (error) {
        console.log("Erro de formatação do livro: " + error);
    }
}

function dateFormater(date) {
    const [year, month, day] = date.split("-");
    return new Date(year, parseInt(month) - 1, day).toISOString();
}

export function arrayFormater(array) {

    let booksList = [];

    array.forEach(element => {
        if (element) {
            element.forEach(element2 => {
                if (element2) {
                    if (element2.items) {
                        element2.items.forEach(book => {
                            if (book) booksList.push(book);
                        });
                    }
                }
            });
        }
    });

    return booksList;
}

testFetchGoogleBookReviews();