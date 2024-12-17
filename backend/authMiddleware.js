const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret_key';

const authMiddleware = (req, res, next) => {
    console.log('Request Headers:', req.headers); // Log all headers for debugging

    const authHeader = req.header('Authorization');
    console.log('Authorization Header:', authHeader);

    const token = authHeader && authHeader.split(' ')[1];
    console.log('Extracted Token:', token);

    if (!token) {
        return res.status(401).json({ error: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        console.log('Decoded Token:', decoded);
        req.user = decoded;
        next();
    } catch (err) {
        console.error('Token Verification Error:', err.message);
        res.status(401).json({ error: 'Token is not valid' });
    }
};

module.exports = authMiddleware;

