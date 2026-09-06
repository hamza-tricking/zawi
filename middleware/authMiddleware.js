const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
    try {
        let token;
        
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            const err = new Error('Not authorized, no token provided');
            err.statusCode = 401;
            throw err;
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key');
        req.user = decoded;
        next();
    } catch (error) {
        error.statusCode = 401;
        error.message = 'Not authorized, token failed';
        next(error);
    }
};

module.exports = { protect };
