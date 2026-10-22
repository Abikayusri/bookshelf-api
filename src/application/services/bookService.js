import { createBook, updateBook, validateBook } from '../../domain/book.js';
import { BookNotFoundError } from '../../domain/errors.js';

/**
 * Inbound port: the use cases of the Bookshelf API.
 *
 * @param {object} deps
 * @param {import('../ports/bookRepository.js').BookRepository} deps.bookRepository
 * @param {import('../ports/bookRepository.js').IdGenerator} deps.generateId
 */
export const createBookService = ({ bookRepository, generateId }) => ({
  addBook(payload) {
    validateBook(payload, 'menambahkan');

    const book = createBook(generateId(), payload, new Date().toISOString());
    bookRepository.save(book);

    return book.id;
  },

  getBooks({ name, reading, finished } = {}) {
    let books = bookRepository.findAll();

    if (name) {
      const keyword = name.toLowerCase();
      books = books.filter((book) => book.name.toLowerCase().includes(keyword));
    }

    if (reading !== undefined) {
      books = books.filter((book) => book.reading === reading);
    }

    if (finished !== undefined) {
      books = books.filter((book) => book.finished === finished);
    }

    return books;
  },

  getBook(id) {
    const book = bookRepository.findById(id);

    if (!book) {
      throw new BookNotFoundError('Buku tidak ditemukan');
    }

    return book;
  },

  editBook(id, payload) {
    validateBook(payload, 'memperbarui');

    const book = bookRepository.findById(id);

    if (!book) {
      throw new BookNotFoundError('Gagal memperbarui buku. Id tidak ditemukan');
    }

    bookRepository.update(updateBook(book, payload, new Date().toISOString()));
  },

  deleteBook(id) {
    if (!bookRepository.deleteById(id)) {
      throw new BookNotFoundError('Buku gagal dihapus. Id tidak ditemukan');
    }
  },
});
