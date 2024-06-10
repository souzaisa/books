export function listDataFormater(list) {
  try {
    let formatedList = {
      nome: list.list_name_encoded,
      data_publicacao: dateFormater(list.newest_published_date),
      frequencia: list.updated,
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


export function arrayFormater2(array) {
  let booksList = [];
  array.forEach(element => {
    if (element) {
      if (element.items) {
        element.items.forEach(book => {
          if (book) booksList.push(book);
        });
      }
    }
  });
  return booksList;
}

export function arrayVerifier(array, attribute) {
  if (!Array.isArray(array)) {
    throw new Error("Input must be an array");
  }
  if (!attribute) {
    throw new Error("Attribute must be defined");
  }

  let reduced = [];
  array.forEach((item) => {
    if (item && item.hasOwnProperty(attribute)) {
      let duplicated = reduced.findIndex(redItem => redItem[attribute] === item[attribute]) > -1;
      if (!duplicated) {
        reduced.push(item);
      }
    }
  });
  return reduced;
}

export function sumArrays(array1, array2) {
  return [...array1, ...array2];
}