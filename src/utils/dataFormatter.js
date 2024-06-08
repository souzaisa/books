export function listDataFormater(list) {
  try {
    let formatedList = {
      nome: list.list_name_encoded,
      data_publicacao: dateFormater(list.newest_published_date),
      frequencia_atualizacao: list.updated,
      livrosdalista: list.books
    };
    return formatedList;
  } catch (error) {
    console.log("Erro de formatação da lista: " + error);
  }
}

export function dateFormater(date) {
  const [year, month, day] = date.split("-"); // "2024-06-06"
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
