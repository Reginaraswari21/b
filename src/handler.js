// eslint-disable-next-line import/no-extraneous-dependencies
const { nanoid } = require('nanoid');
const books = require('./books');

const addBooksHandler = (request, h) => {
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;

  // if name undefined
  if (name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);

    return response;
  }
  // if readPage > pageCount
  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);

    return response;
  }

  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const finished = (pageCount === readPage);
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
  const isSuccess = books.filter((book) => book.id === id).length > 0;
  // console.log(isSuccess);
  if (isSuccess) {
    return h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    }).code(201);
  }
  // add fail response
  const response = h.response({
    status: 'fail',
    message: 'Buku gagal ditambahkan',
  });
  response.code(400);
  return response;
};

const getAllBooksHandler = (request, h) => {
  const { name, reading, finished } = request.query;

  if (name) {
    const foundBook = books.filter((book) => book.name.toLowerCase().includes(name.toLowerCase()));
    return h
      .response({
        status: 'success',
        data: {
          books: foundBook.map((book) => ({
            id: book.id,
            name: book.name,
            publisher: book.publisher,
          })),
        },
      })
      .code(200);
  }

  if (reading === '1') {
    return h
      .response({
        status: 'success',
        data: {
          books: books
            .filter((book) => book.reading === true)
            .map((book) => ({
              id: book.id,
              name: book.name,
              publisher: book.publisher,
            })),
        },
      })
      .code(200);
  }

  if (reading === '0') {
    return h
      .response({
        status: 'success',
        data: {
          books: books
            .filter((book) => book.reading === false)
            .map((book) => ({
              id: book.id,
              name: book.name,
              publisher: book.publisher,
            })),
        },
      })
      .code(200);
  }

  if (finished === '1') {
    return h
      .response({
        status: 'success',
        data: {
          books: books
            .filter((book) => book.finished === true)
            .map((book) => ({
              id: book.id,
              name: book.name,
              publisher: book.publisher,
            })),
        },
      })
      .code(200);
  }

  if (finished === '0') {
    return h
      .response({
        status: 'success',
        data: {
          books: books
            .filter((book) => book.finished === false)
            .map((book) => ({
              id: book.id,
              name: book.name,
              publisher: book.publisher,
            })),
        },
      })
      .code(200);
  }

  return h
    .response({
      status: 'success',
      data: {
        books: books.map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        })),
      },
    })
    .code(200);
};

const getBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const foundBook = books.filter((book) => book.id === bookId)[0];

  if (foundBook !== undefined) {
    return h
      .response({
        status: 'success',
        data: {
          book: foundBook,
        },
      })
      .code(200);
  }

  return h
    .response({
      status: 'fail',
      message: 'Buku tidak ditemukan',
    })
    .code(404);
};

const updateBookHandler = (request, h) => {
  const { bookId } = request.params;
  const updatedAt = new Date().toISOString();
  const foundBook = books.findIndex((book) => book.id === bookId);

  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;

  if (foundBook !== -1) {
    if (!name) {
      return h
        .response({
          status: 'fail',
          message: 'Gagal memperbarui buku. Mohon isi nama buku',
        })
        .code(400);
    }

    if (readPage > pageCount) {
      return h
        .response({
          status: 'fail',
          message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
        })
        .code(400);
    }

    books[foundBook] = {
      ...books[foundBook],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      finished: pageCount === readPage,
      updatedAt,
    };

    return h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    }).code(200);
  }
  return h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  }).code(404);
};

const deleteBookHandler = (request, h) => {
  const { bookId } = request.params;
  const foundBook = books.findIndex((book) => book.id === bookId);

  if (foundBook !== -1) {
    books.splice(foundBook, 1);
    return h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    }).code(200);
  }
  return h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  }).code(404);
};

module.exports = {
  addBooksHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  updateBookHandler,
  deleteBookHandler,
};
