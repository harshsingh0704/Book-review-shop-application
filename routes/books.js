// Books routes: queries and reviews management
const express = require('express');
const bodyParser = require('body-parser');
const books = require('../data/books');
const { authenticateJWT } = require('../middleware/auth');

const router = express.Router();
router.use(bodyParser.json());

// GET /books (list all books)
router.get('/', async (req, res, next) => {
  try {
    // Return an array of books
    const list = Object.values(books);
    return res.json(list);
  } catch (err) {
    next(err);
  }
});

// GET /books/isbn/:isbn
router.get('/isbn/:isbn', async (req, res, next) => {
  try {
    const { isbn } = req.params;
    const book = books[isbn];
    if (!book) return res.status(404).json({ message: 'Book not found' });
    return res.json(book);
  } catch (err) {
    next(err);
  }
});

// GET /books/author/:author
router.get('/author/:author', async (req, res, next) => {
  try {
    const author = req.params.author.toLowerCase();
    const results = Object.values(books).filter(b => b.author.toLowerCase().includes(author));
    return res.json(results);
  } catch (err) {
    next(err);
  }
});

// GET /books/title/:title
router.get('/title/:title', async (req, res, next) => {
  try {
    const title = req.params.title.toLowerCase();
    const results = Object.values(books).filter(b => b.title.toLowerCase().includes(title));
    return res.json(results);
  } catch (err) {
    next(err);
  }
});

// GET /books/:isbn/reviews
router.get('/:isbn/reviews', async (req, res, next) => {
  try {
    const { isbn } = req.params;
    const book = books[isbn];
    if (!book) return res.status(404).json({ message: 'Book not found' });
    return res.json(book.reviews || {});
  } catch (err) {
    next(err);
  }
});

// PUT /books/:isbn/review  (add or modify review) - protected
router.put('/:isbn/review', authenticateJWT, async (req, res, next) => {
  try {
    const { isbn } = req.params;
    const { review } = req.body;
    const username = req.user && req.user.username;
    if (!username) return res.status(401).json({ message: 'Unauthorized' });
    if (!review) return res.status(400).json({ message: 'Review text required' });

    const book = books[isbn];
    if (!book) return res.status(404).json({ message: 'Book not found' });

    const isUpdate = Object.prototype.hasOwnProperty.call(book.reviews, username);
    book.reviews[username] = review; // add or update

    return res.status(isUpdate ? 200 : 201).json({ message: isUpdate ? 'Review updated' : 'Review added' });
  } catch (err) {
    next(err);
  }
});

// DELETE /books/:isbn/review (delete own review) - protected
router.delete('/:isbn/review', authenticateJWT, async (req, res, next) => {
  try {
    const { isbn } = req.params;
    const username = req.user && req.user.username;
    if (!username) return res.status(401).json({ message: 'Unauthorized' });

    const book = books[isbn];
    if (!book) return res.status(404).json({ message: 'Book not found' });

    if (!Object.prototype.hasOwnProperty.call(book.reviews, username)) {
      return res.status(404).json({ message: 'Review not found for user' });
    }

    delete book.reviews[username];
    return res.json({ message: 'Review deleted' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
