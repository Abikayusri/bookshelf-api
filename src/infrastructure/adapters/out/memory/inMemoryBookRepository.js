/**
 * @returns {import('../../../../application/ports/bookRepository.js').BookRepository}
 */
export const createInMemoryBookRepository = () => {
  const books = [];

  return {
    save(book) {
      books.push(book);
    },

    findAll() {
      return [...books];
    },

    findById(id) {
      return books.find((book) => book.id === id);
    },

    update(book) {
      const index = books.findIndex((b) => b.id === book.id);
      books[index] = book;
    },

    deleteById(id) {
      const index = books.findIndex((book) => book.id === id);

      if (index === -1) {
        return false;
      }

      books.splice(index, 1);
      return true;
    },
  };
};
