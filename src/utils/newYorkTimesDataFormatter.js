// // Função para formatar dados de avaliação do New York Times
// export function nytReviewDataFormater(review) {
//   try {
//     // Realiza a formatação dos dados da avaliação do New York Times
//     let formatedReview = {
//       isbn: review.isbn13[0],
//       autor: review.book_author,
//       data_publicacao: dateFormater(review.publication_dt) || null,
//       sumario: review.sumary || null,
//       link_url_review: review.url || null,
//       numero_review: null // O número de avaliações será definido posteriormente
//     };
//     return formatedReview;
//   } catch (error) {
//     console.log("Erro de formatação do NYT review: " + error);
//   }
// }