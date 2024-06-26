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
 * Função para buscar todos os ISBNs-13 de todas as listas de Best Sellers da NYT sem duplicados.
 */
export async function fetchAllIsbnsFromNytLists() {
  try {
    const listData = await fetchAllNytLists();
    const listNames = listData.map(list => list.list_name_encoded);

    const allIsbns = new Set();
    for (const listName of listNames) {
      const url = `${nytBaseUrl}/lists/current/${listName}.json?api-key=${nytApiKey}`;
      try {
        const response = await fetch(url);
        const data = await response.json();
        if (data && data.results && data.results.books) {
          data.results.books.forEach(book => {
            book.isbns.forEach(isbn => allIsbns.add(isbn.isbn13)); // jogar para o data formater
          });
        }
      } catch (error) {
        console.error(`Erro ao buscar ISBNs para a lista ${listName}:`, error);
      }
    }

    return Array.from(allIsbns); // Converter Set para Array antes de retornar
  } catch (error) {
    console.error('Erro ao extrair ISBNs de todas as listas:', error);
    throw error;
  }
}

/**
 * Função para buscar reviews na API do NYT por ISBNs
 * @param {array} isbns - Array de ISBNs
 */
export async function fetchReviewsByIsbns(isbns) {
  try {
    const reviews = [];

    for (const isbn of isbns) {
      const url = `${nytBaseUrl}/reviews.json?api-key=${nytApiKey}&isbn=${isbn}`;
      try {
        const response = await fetch(url);
        const data = await response.json();

        if (data && data.results && data.results.length > 0) {
          reviews.push({
            isbn: isbn,
            reviews: data.results
          });
        } else {
          console.log(`Nenhum review encontrado para o ISBN: ${isbn}`);
        }
      } catch (error) {
        console.error(`Erro ao buscar reviews para o ISBN ${isbn}:`, error);
      }
    }

    return reviews;
  } catch (error) {
    console.error('Erro ao buscar reviews:', error);
    throw error;
  }
}