const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
const token = req.header('Authorization');
if (!token) return res.status(401).json({ error: 'Access denied' });
const tokenWithoutBearer = token.slice(7);
try {
   console.log('trying...');
   const huda = jwt.decode(tokenWithoutBearer, 'pappi123');
   console.log(huda);
   const decoded = jwt.verify(tokenWithoutBearer, 'pappi123');
   console.log('failed')
   console.log("------------>",decoded);
   req.userId = decoded.userId;
   console.log('Decoded user ID:', decoded.userId);
   next();
 } catch (error) {
    console.error('Error verifying token:', error.message);
 res.status(401).json({ error: 'Invalid token' });
 }
 };

module.exports = verifyToken;