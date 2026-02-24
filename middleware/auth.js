// Authentication middleware: verifies JWT in Authorization header
const jwt = require('jsonwebtoken');

// Secret for signing/verifying JWTs (for demo only). In production use env vars.
const JWT_SECRET = 'your_jwt_secret_here';

// Middleware to protect routes. Expects header: Authorization: Bearer <token>
function authenticateJWT(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ message: 'Missing Authorization header' });

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') return res.status(401).json({ message: 'Invalid Authorization format' });

  const token = parts[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload; // payload should contain { username }
    return next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

module.exports = { authenticateJWT, JWT_SECRET };
