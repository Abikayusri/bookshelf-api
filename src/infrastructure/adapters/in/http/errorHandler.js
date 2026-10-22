import { BookNotFoundError, InvalidBookError } from '../../../../domain/errors.js';

export const errorHandler = (err, req, res, next) => {
  if (err instanceof InvalidBookError) {
    return res.status(400).json({ status: 'fail', message: err.message });
  }

  if (err instanceof BookNotFoundError) {
    return res.status(404).json({ status: 'fail', message: err.message });
  }

  // Leave other errors (e.g. malformed JSON) to Express's default handler.
  return next(err);
};
