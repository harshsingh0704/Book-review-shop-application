const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');

const booksRouter = require('./routes/books');
const usersRouter = require('./routes/users');
const { JWT_SECRET } = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from public folder
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());

app.use(
  session({
    secret: 'your_session_secret_here',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);

app.use('/', usersRouter);
app.use('/books', booksRouter);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Book Review API running on http://localhost:${PORT}`);
  console.log(`JWT secret (dev): ${JWT_SECRET}`);
});