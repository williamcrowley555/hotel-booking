const jwt = require('jsonwebtoken');
const User = require('../models/User');

class JWTMiddleware {
    verifyToken(req, res, next) {
        const accessToken = req.header('Authorization').replace('Bearer ', '');

        if (accessToken) {
            jwt.verify(accessToken, process.env.JWT_ACCESS_KEY, async (err, decoded) => {
                if (err) {
                    return res.status(403).json({ message: 'Access token is not valid !' });
                }

                const user = await User.findOne({ _id: decoded._id, 'accessTokens.accessToken': accessToken });

                if (!user) {
                    return res.status(403).json({ message: 'Access token is not valid!' });
                }

                req.user = user;
                next();
            });
        } else {
            return res.status(401).json({ message: 'You are not authenticated' });
        }
    }

    verifyManagerToken(req, res, next) {
        this.verifyToken(req, res, () => {
            const allowedRoles = ['admin', 'manager'];

            if (req.user._id == req.params.id || allowedRoles.includes(req.user.role)) {
                next();
            } else {
                return res.status(403).json({ message: 'You are not allow to perform this action' });
            }
        });
    }

    verifyAdminToken(req, res, next) {
        this.verifyToken(req, res, () => {
            if (req.user._id == req.params.id || req.user.role == 'admin') {
                next();
            } else {
                return res.status(403).json({ message: 'You are not allow to perform this action' });
            }
        });
    }
}

module.exports = new JWTMiddleware();
