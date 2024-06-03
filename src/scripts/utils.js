import { fetchNytAllBestSellers } from "./newYorkTimesConsumer.js";
import { searchBook } from "./googleBookConsumer.js";

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

export async function getBooksByISBN() {
    const ISBNList = await getAllBooksFromNYTLists();

    let books = await Promise.all(ISBNList.map(async isbn => {
        console.log(isbn);
            return await searchBook(isbn);
        }));

    return books;
}