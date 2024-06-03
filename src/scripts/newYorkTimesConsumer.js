import fetch from 'node-fetch';

const nytBaseUrl = 'https://api.nytimes.com/svc/books/v3';
const nytApiKey = 'j7q5f0NhhO7eAVxTT2zC72zGlLwZN5Np';

/**
 * Função para buscar a lista de Best Sellers na API do NYT
 * @param {string} listName - Nome da lista de best sellers, exemplo "hardcover-fiction"
 */
export async function fetchNytAllBestSellers(listName = '') {
    let url = `${nytBaseUrl}/lists/names.json?api-key=${nytApiKey}`;

    if (listName) {
        url = `${nytBaseUrl}/lists/current/${listName}.json?api-key=${nytApiKey}`;
        try {
            const response = await fetch(url);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error(`Erro ao buscar best sellers no NYT para ${listName}:`, error);
            throw error;
        }
    } else {
        try {
            const response = await fetch(url);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Erro ao buscar todas as listas de best sellers no NYT:', error);
            throw error;
        }
    }
}

/**
 * Função para buscar todas as listas de Best Sellers
 */
export async function fetchAllNytLists() {
    const url = `${nytBaseUrl}/lists/names.json?api-key=${nytApiKey}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data && data.results) {
            return data.results;
        } else {
            console.error('Estrutura da resposta inválida ao buscar todas as listas.');
            return [];
        }
    } catch (error) {
        console.error('Erro ao buscar todas as listas de best sellers no NYT:', error);
        throw error;
    }
}

/**
 * Função para buscar todos os ISBNs primários de todas as listas de Best Sellers
 */
export async function fetchAllIsbnsFromAllLists() {
    try {
        const listData = await fetchAllNytLists();
        const listNames = listData.map(list => list.list_name_encoded);

        const allIsbns = [];
        for (const listName of listNames) {
            const url = `${nytBaseUrl}/lists/current/${listName}.json?api-key=${nytApiKey}`;
            try {
                const response = await fetch(url);
                const data = await response.json();
                if (data && data.results && data.results.books) {
                    const isbns = data.results.books.map(book => book.primary_isbn13);
                    allIsbns.push(...isbns);
                }
            } catch (error) {
                console.error(`Erro ao buscar ISBNs para a lista ${listName}:`, error);
            }
        }

        return allIsbns;
    } catch (error) {
        console.error('Erro ao extrair ISBNs de todas as listas:', error);
        throw error;
    }
}
