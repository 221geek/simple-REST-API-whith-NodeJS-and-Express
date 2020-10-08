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
    }
}