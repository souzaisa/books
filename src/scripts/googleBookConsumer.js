import fetch from 'node-fetch';

async function searchBooksBySubjects(subject) {
    let startIndex = 0;
    let books = [];
    for (let i = 0; i < 2; i++) {
        try {
            const response = await fetch('https://www.googleapis.com/books/v1/volumes?q=subject=' + subject + '&orderBy=relevance&printType=books&maxResults=40&startIndex=' + startIndex);
            const responseJSON = await response.json();
            books.push(responseJSON);
            startIndex = 40;
        } catch (erro) {
            return erro.toString();
        }
    }
    return books;
}

export async function searchBook(ISBN) {
    const response = await fetch('https://www.googleapis.com/books/v1/volumes?q=isbn:' + ISBN);
    const book = await response.json();
    return book;
}

export async function listBooks() {
    const subjects = ["action", "horror", "fantasy", "romance", "science fiction", "mistery", "suspense", "drama", "comedy", "poetry", "memories", "autobiography", "biography", "history", "essay", "literary criticism", "comics", "graphic novel", "children's books", "cookbook", "travel book", "self-help book", "business book", "self-improvement book", "war Book"];

    try {
        let data = await Promise.all(subjects.map(async subject => {
            return await searchBooksBySubjects(subject);
        }));
        return data;
    } catch (erro) {
        return erro.toString();
    }
}