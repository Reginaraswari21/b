const {
  addBooksHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  updateBookHandler,
  deleteBookHandler,
} = require('./handler');

const routes = [
    {
        method: 'GET',
        path: '/',
        handler: () => 'Selamat Datang',
    },
    {
        method: '*',
        path: '/{any*}',
        handler: () => 'Halaman tidak ditemukan',
    },
    {
        method: 'GET',
        path: '/books',
        handler: () => getAllBooksHandler,
    },
    {
        method: 'POST',
        path: '/books',
        handler: () => addBooksHandler,
    },
    {
        method: 'GET',
        path: '/books/{bookId}',
        handler: () => getBookByIdHandler,
    },
    {
        method: 'PUT',
        path: '/books/{bookId}',
        handler: () => updateBookHandler,
    },
    {
        method: 'DELET',
        path: '/books/{bookId}',
        handler: () => deleteBookHandler,
    },
];

module.exports = routes;
