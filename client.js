// client.js - example axios client to call the Book Review API
// Demonstrates the requested async/callback/promise styles
const axios = require('axios');

const BASE = 'http://localhost:3000';

// Task 10 – Get all books (Async callback style)
function getAllBooksCallback(cb) {
  axios
    .get(`${BASE}/books`)
    .then(response => cb(null, response.data))
    .catch(err => cb(err));
}

// Task 11 – Search by ISBN (Using Promises)
function getBookByIsbn(isbn) {
  return axios.get(`${BASE}/books/isbn/${isbn}`).then(r => r.data);
}

// Task 12 – Search by Author (async/await)
async function getBooksByAuthor(author) {
  const res = await axios.get(`${BASE}/books/author/${encodeURIComponent(author)}`);
  return res.data;
}

// Task 13 – Search by Title (async/await)
async function getBooksByTitle(title) {
  const res = await axios.get(`${BASE}/books/title/${encodeURIComponent(title)}`);
  return res.data;
}

// Example usage when run directly
if (require.main === module) {
  // Callback style example
  getAllBooksCallback((err, books) => {
    if (err) return console.error('Callback error:', err.message || err);
    console.log('All books (callback):', books);

    // Promise style
    getBookByIsbn('9780143127741')
      .then(book => {
        console.log('Book by ISBN (promise):', book);
        return getBooksByAuthor('Paulo Coelho');
      })
      .then(async booksByAuthor => {
        console.log('Books by author (async/await):', booksByAuthor);
        const byTitle = await getBooksByTitle('Pride');
        console.log('Books by title (async/await):', byTitle);
      })
      .catch(err => console.error('Promise/async error:', err.message || err));
  });
}

module.exports = { getAllBooksCallback, getBookByIsbn, getBooksByAuthor, getBooksByTitle };
