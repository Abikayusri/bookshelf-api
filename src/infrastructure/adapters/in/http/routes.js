import express from 'express';

export const createRoutes = (bookController) => {
  const routes = express.Router();

  routes.post('/books', bookController.addBook);
  routes.get('/books', bookController.getBooks);
  routes.get('/books/:bookId', bookController.getBook);
  routes.put('/books/:bookId', bookController.editBook);
  routes.delete('/books/:bookId', bookController.deleteBook);

  return routes;
};
