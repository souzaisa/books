
import fetch from 'node-fetch';

const nytBaseUrl = 'https://api.nytimes.com/svc/books/v3';

// API Keys
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
            console.log(`New York Times Best Sellers Data for ${listName}:`, data);
            return data;
        } catch (error) {
            console.error(`Erro ao buscar best sellers no NYT para ${listName}:`, error);
        }
    } else {
        try {
            const response = await fetch(url);
            const data = await response.json();
            console.log('All New York Times Best Sellers Lists:', data);
            return data;
        } catch (error) {
            console.error('Erro ao buscar todas as listas de best sellers no NYT:', error);
        }
    }
}
fetchNytAllBestSellers();