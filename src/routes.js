import express from 'express';
import {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
} from './handler.js';

const routes = express.Router();

routes.post('/books', addBookHandler);
routes.get('/books', getAllBooksHandler);
routes.get('/books/:bookId', getBookByIdHandler);
routes.put('/books/:bookId', editBookByIdHandler);
routes.delete('/books/:bookId', deleteBookByIdHandler);

export default routes;
