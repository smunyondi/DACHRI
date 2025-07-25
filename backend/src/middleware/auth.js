const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = (req, res, next) => {
    let token = req.headers['authorization'];
    console.log('[DEBUG] authMiddleware called, token:', token);
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }
    // Extract token from 'Bearer <token>' format
    if (token.startsWith('Bearer ')) {
        token = token.slice(7);
    }
    jwt.verify(token, process.env.JWT_SECRET || 'secretkey', (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Failed to authenticate token' });
        }
        req.userId = decoded.userId;
        req.user = { _id: decoded.userId };
        console.log('[DEBUG] authMiddleware decoded.userId:', decoded.userId);
        next();
    });
};

const adminMiddleware = async (req, res, next) => {
    console.log('[DEBUG] adminMiddleware called, req.userId:', req.userId);
    try {
        const user = await User.findById(req.userId);
        console.log('[DEBUG] adminMiddleware user:', user);
        if (!user) return res.status(404).json({ message: 'User not found' });
        if (!user.isAdmin) return res.status(403).json({ message: 'Require Admin Role!' });
        next();
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    authMiddleware,
    adminMiddleware
};