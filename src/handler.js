import { nanoid } from 'nanoid';
import books from './books.js';

const validateBook = ({ name, pageCount, readPage }, action) => {
  if (!name) {
    return `Gagal ${action} buku. Mohon isi nama buku`;
  }

  if (readPage > pageCount) {
    return `Gagal ${action} buku. readPage tidak boleh lebih besar dari pageCount`;
  }

  return null;
};

export const addBookHandler = (req, res) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = req.body ?? {};

  const error = validateBook(req.body ?? {}, 'menambahkan');

  if (error) {
    return res.status(400).json({
      status: 'fail',
      message: error,
    });
  }

  const id = nanoid(16);
  const finished = pageCount === readPage;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  books.push(newBook);

  return res.status(201).json({
    status: 'success',
    message: 'Buku berhasil ditambahkan',
    data: {
      bookId: id,
    },
  });
};

export const getAllBooksHandler = (req, res) => {
  const result = books.map(({ id, name, publisher }) => ({
    id,
    name,
    publisher,
  }));

  return res.json({
    status: 'success',
    data: {
      books: result,
    },
  });
};

export const getBookByIdHandler = (req, res) => {
  const { bookId } = req.params;
  const book = books.find((b) => b.id === bookId);

  if (!book) {
    return res.status(404).json({
      status: 'fail',
      message: 'Buku tidak ditemukan',
    });
  }

  return res.json({
    status: 'success',
    data: {
      book,
    },
  });
};

export const editBookByIdHandler = (req, res) => {
  const { bookId } = req.params;
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = req.body ?? {};

  const error = validateBook(req.body ?? {}, 'memperbarui');

  if (error) {
    return res.status(400).json({
      status: 'fail',
      message: error,
    });
  }

  const index = books.findIndex((b) => b.id === bookId);

  if (index === -1) {
    return res.status(404).json({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });
  }

  books[index] = {
    ...books[index],
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished: pageCount === readPage,
    reading,
    updatedAt: new Date().toISOString(),
  };

  return res.json({
    status: 'success',
    message: 'Buku berhasil diperbarui',
  });
};

export const deleteBookByIdHandler = (req, res) => {
  const { bookId } = req.params;
  const index = books.findIndex((b) => b.id === bookId);

  if (index === -1) {
    return res.status(404).json({
      status: 'fail',
      message: 'Buku gagal dihapus. Id tidak ditemukan',
    });
  }

  books.splice(index, 1);

  return res.json({
    status: 'success',
    message: 'Buku berhasil dihappus',
  });
};
