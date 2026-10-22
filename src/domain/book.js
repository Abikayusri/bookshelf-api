import { InvalidBookError } from './errors.js';

export const validateBook = ({ name, pageCount, readPage }, action) => {
  if (!name) {
    throw new InvalidBookError(`Gagal ${action} buku. Mohon isi nama buku`);
  }

  if (readPage > pageCount) {
    throw new InvalidBookError(
      `Gagal ${action} buku. readPage tidak boleh lebih besar dari pageCount`,
    );
  }
};

const pickBookFields = ({
  name,
  year,
  author,
  summary,
  publisher,
  pageCount,
  readPage,
  reading,
}) => ({
  name,
  year,
  author,
  summary,
  publisher,
  pageCount,
  readPage,
  finished: pageCount === readPage,
  reading,
});

export const createBook = (id, payload, now) => ({
  id,
  ...pickBookFields(payload),
  insertedAt: now,
  updatedAt: now,
});

export const updateBook = (book, payload, now) => ({
  ...book,
  ...pickBookFields(payload),
  updatedAt: now,
});
