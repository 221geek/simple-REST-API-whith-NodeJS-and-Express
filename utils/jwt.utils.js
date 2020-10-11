var jwt = require('jsonwebtoken');

const JWT_SIGN_SECRET = 'hjvbhbjbuibYG68IYIUJBNJvghv76R7TGBhVUIG7T67RYUGVHbvbhv';

module.exports = {
    generateTokenForUser: (userData) => {
        return jwt.sign({
            userId: userData.id,
            isAdmin: userData.isAdmin,
        },
        JWT_SIGN_SECRET,
        {
            expiresIn: '2h'
        })
    },
    parseAuthorization: (authorization) => {
        return (authorization != null) ? authorization.replace('Bearer ', '') : null;
    },
    getUserId: (authorization) => {
        var userId = -1;
        var token = module.exports.parseAuthorization(authorization );
        if (token != null) {
            try {
                var jwtToken = jwt.verify(token, JWT_SIGN_SECRET);
                if (jwtToken != null) {
                    userId = jwtToken.userId
                }
            } catch(err) {}
        }
        return userId;
    }
}