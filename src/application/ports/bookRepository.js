/**
 * Outbound port for storing books. Any adapter (memory, database) must
 * provide these functions.
 *
 * @typedef {object} BookRepository
 * @property {(book: object) => void} save
 * @property {() => object[]} findAll
 * @property {(id: string) => object | undefined} findById
 * @property {(book: object) => void} update
 * @property {(id: string) => boolean} deleteById Returns false when the id does not exist.
 */

/**
 * Outbound port for generating unique book ids.
 *
 * @typedef {() => string} IdGenerator
 */

export {};
