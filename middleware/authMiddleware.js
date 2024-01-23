const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
const token = req.header('Authorization');
if (!token) return res.status(401).json({ error: 'Access denied' });
const tokenWithoutBearer = token.slice(7);
try {
   const decoded = jwt.verify(tokenWithoutBearer, 'pappi123');
   req.userId = decoded.userId;
   next();
 } catch (error) {
   res.status(401).json({ error: 'Invalid token' });
 }
 };

module.exports = verifyToken;