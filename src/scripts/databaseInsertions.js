// import { PrismaClient } from '@prisma/client'

// const prisma = new PrismaClient();

export async function bookInsertion(book, prisma) {
    const bookInserted = await prisma.livro.create({
        data: {
            isbn: book.isbn,
            titulo: book.titulo,
            autor: book.autor,
            categoria: book.categoria,
            data_publicacao: book.data_publicacao,
            descricao: book.descricao,
            num_paginas: book.num_paginas,
            link_thumbnail: book.link_thumbnail,
            nota_media: book.nota_media
            //Como tratar as listas do relacionamento?
        },
    })
    console.log("BOOK INSERTION: " + bookInserted.toString());
}

// bookInsertion()
//     .then(async () => {
//         await prisma.$disconnect()
//     })
//     .catch(async (e) => {
//         console.error(e)
//         await prisma.$disconnect()
//         process.exit(1)
//     })