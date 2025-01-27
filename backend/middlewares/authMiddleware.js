const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(403).send('Token required');

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next(); 
  } catch (error) {
    res.status(401).send('Invalid token');
  }
}

module.exports = authMiddleware;
