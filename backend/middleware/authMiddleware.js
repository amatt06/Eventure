const jwt = require('jsonwebtoken');

// Middleware to check access level and verify the token
const authMiddleware = (requiredLevel) => (req, res, next) => {
    const token = req.header('x-auth-token');

    if (!token) {
        return res.status(401).json({message: 'Authorization denied: No token provided'});
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;

        // Check if the user meets the required access level
        if (req.user.accessLevel < requiredLevel) {
            return res.status(403).json({message: 'Forbidden: Insufficient access level'});
        }

        next();
    } catch (err) {
        console.error('Token validation failed:', err);
        res.status(401).json({message: 'Token is not valid'});
    }
};

module.exports = authMiddleware;