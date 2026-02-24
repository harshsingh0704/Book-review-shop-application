// Users routes: register and login
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const users = require('../data/users');
const { JWT_SECRET } = require('../middleware/auth');

const router = express.Router();
router.use(bodyParser.json());

// POST /register
// Body: { username, password }
router.post('/register', async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ message: 'username and password required' });

    // Check if user exists
    const existing = users.find(u => u.username === username);
    if (existing) return res.status(400).json({ message: 'User already exists' });

    // Hash the password
    const saltRounds = 10;
    const hash = await bcrypt.hash(password, saltRounds);

    // Store user
    users.push({ username, passwordHash: hash });
    return res.status(201).json({ message: 'User registered' });
  } catch (err) {
    next(err);
  }
});

// POST /login
// Body: { username, password }
router.post('/login', async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ message: 'username and password required' });

    const user = users.find(u => u.username === username);
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    // Generate JWT
    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' });
    return res.json({ token });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
