var bcrypt      = require('bcrypt');
var models      = require('./../models');
var jwtUtils    = require('./../utils/jwt.utils'); 

module.exports = {
    register: (req, res) => {
        //params
        var username    = req.body.username
        var password    = req.body.password
        var email       = req.body.email
        var bio         = req.body.bio

        if (email == null || password == null || username == null || bio == null) {
            return res.status(400).json({ 'error': 'missing parameters '});
        }

        models.User.findOne({
            attributes: ['email'],
            where: {email: email}
        }).then((userFound) => {
            if(!userFound) {
                bcrypt.hash(password, 5, (err, bcryptPassword) => {
                    var newUser = models.User.create({
                        email: email,
                        username: username,
                        password: bcryptPassword,
                        bio: bio,
                        isAdmin: 0
                    }).then((newUser) => {
                        return res.status(201).json({ 'userId': newUser.id });
                    }).catch((err) => {
                        return res.status(500).json({ 'error': 'cannot add user' });
                    })
                });
            } else {
                return res.status(409).json({ 'error': 'user already exist' });
            }
        }).catch ((err) => {
            return res.status(500).json({ 'error': 'enable to verify user' });
        });
    },
    login: (req, res) => {
        var email       = req.body.email
        var password    = req.body.password

        if (email == null || password == null) {
            return res.status(400).json({ 'error': 'missing parameters' })
        }

        models.User.findOne({
            where: {email: email}
        }).then((userFound) => {
            if (userFound) {
                bcrypt.compare(password, userFound.password, (errBcrypt, resBcrypt) => {
                    if (resBcrypt) {
                        return res.status(200).json({
                            'userId': userFound.id,
                            'token': jwtUtils.generateTokenForUser(userFound)
                        });
                    } else {
                        return res.status(403).json({ 'error': 'invalid password' });
                    }
                })
            }else {
                return res.status(404).json({ 'error': 'user not found' });
            }
        }).catch((err) => {
            return res.status(500).json({ 'error': 'unable to verify user' });
        });
    }
}