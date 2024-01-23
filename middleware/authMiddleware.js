const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
const token = req.header('Authorization');
if (!token) return res.status(401).json({ error: 'Access denied' });
try {
 const decoded = jwt.verify(token, 'pappi123');
 req.userId = decoded.userId;
 console.log('Decoded user ID:', decoded.userId);
 next();
 } catch (error) {
    console.error('Error verifying token:', error.message);
 res.status(401).json({ error: 'Invalid token' });
 }
 };

module.exports = verifyToken;