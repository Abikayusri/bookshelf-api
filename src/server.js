import express from 'express';
import { createBookService } from './application/services/bookService.js';
import { createInMemoryBookRepository } from './infrastructure/adapters/out/memory/inMemoryBookRepository.js';
import { nanoidGenerator } from './infrastructure/adapters/out/id/nanoidGenerator.js';
import { createBookController } from './infrastructure/adapters/in/http/bookController.js';
import { createRoutes } from './infrastructure/adapters/in/http/routes.js';
import { errorHandler } from './infrastructure/adapters/in/http/errorHandler.js';

const bookService = createBookService({
  bookRepository: createInMemoryBookRepository(),
  generateId: nanoidGenerator,
});

const app = express();
const port = 9000;

app.use(express.json());
app.use('/', createRoutes(createBookController(bookService)));
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
