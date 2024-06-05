import { PrismaClient } from '@prisma/client'
import { searchBook } from "./googleBookConsumer.js";

const prisma = new PrismaClient();

export async function bookInsertion() {
    // const book = await searchBook();
    // const livro = await prisma.livro.create({
    //     data: {
    //         isbn: "9781446484197",
    //         titulo: 'teste123',
    //         autor: "shaolin matador",
    //         categoria: "terror",
    //         data_publicacao: (new Date("05 October 2011 14:48 UTC")).toISOString()
    //     },
    // })
    // console.log("BOOK INSERTION: " + livro.toString());
}

bookInsertion()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })