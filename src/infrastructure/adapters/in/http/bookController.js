const toFlag = (value) => {
  if (value === '1') return true;
  if (value === '0') return false;
  return undefined;
};

export const createBookController = (bookService) => ({
  addBook(req, res) {
    const bookId = bookService.addBook(req.body ?? {});

    res.status(201).json({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: { bookId },
    });
  },

  getBooks(req, res) {
    const { name, reading, finished } = req.query;
    const books = bookService.getBooks({
      name: name ? String(name) : undefined,
      reading: toFlag(reading),
      finished: toFlag(finished),
    });

    res.json({
      status: 'success',
      data: {
        books: books.map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        })),
      },
    });
  },

  getBook(req, res) {
    const book = bookService.getBook(req.params.bookId);

    res.json({
      status: 'success',
      data: { book },
    });
  },

  editBook(req, res) {
    bookService.editBook(req.params.bookId, req.body ?? {});

    res.json({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
  },

  deleteBook(req, res) {
    bookService.deleteBook(req.params.bookId);

    res.json({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
  },
});
