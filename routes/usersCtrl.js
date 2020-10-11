var bcrypt      = require('bcrypt');
var models      = require('./../models');
var jwtUtils    = require('./../utils/jwt.utils');
var asynclib    = require('async');

const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PASSWORD_REGEX = /^(?=.*\d).{4,8}$/;

module.exports = {
    register: (req, res) => {
        //params
        var username    = req.body.username
        var password    = req.body.password
        var email       = req.body.email
        var bio         = req.body.bio

        if (email == null || password == null || username == null || bio == null) {
            return res.status(400).json({ 'error': 'missing parameters' });
        }

        if (username.lengh >= 13 || username.lengh <= 4) {
            return res.status(400).json({ 'error': 'wrong username (must be length 5 - 12)' });
        }

        if (!EMAIL_REGEX.test(email)) {
            return res.status(400).json({ 'error': 'email is not valid' });
        }

        if (!PASSWORD_REGEX.test(password)) {
            return res.status(400).json({ 'error': 'invalid password (must lenght 4 - 8 and include 1 number ' });
        }
        asyncLib.waterfall([
            (done) => {
              models.User.findOne({
                attributes: ['email'],
                where: { email: email }
              })
              .then((userFound) => {
                done(null, userFound);
              })
              .catch((err) => {
                return res.status(500).json({ 'error': 'unable to verify user' });
              });
            },
            (userFound, done) => {
              if (!userFound) {
                bcrypt.hash(password, 5, ( err, bcryptedPassword ) => {
                  done(null, userFound, bcryptedPassword);
                });
              } else {
                return res.status(409).json({ 'error': 'user already exist' });
              }
            },
            (userFound, bcryptedPassword, done) => {
              var newUser = models.User.create({
                email: email,
                username: username,
                password: bcryptedPassword,
                bio: bio,
                isAdmin: 0
              })
              .then((newUser) => {
                done(newUser);
              })
              .catch((err) => {
                return res.status(500).json({ 'error': 'cannot add user' });
              });
            }
        ], (newUser) => {
            if (newUser) {
              return res.status(201).json({
                'userId': newUser.id
              });
            } else {
              return res.status(500).json({ 'error': 'cannot add user' });
            }
        });
    },
    login: (req, res) => {
        var email       = req.body.email
        var password    = req.body.password

        if (email == null || password == null) {
            return res.status(400).json({ 'error': 'missing parameters' })
        }

        asynclib.waterfall([
            (done) => {
              models.User.findOne({
                where: { email: email }
              })
              .then((userFound) => {
                done(null, userFound);
              })
              .catch((err) => {
                return res.status(500).json({ 'error': 'unable to verify user' });
              });
            },
            (userFound, done) => {
              if (userFound) {
                bcrypt.compare(password, userFound.password, (errBycrypt, resBycrypt) => {
                  done(null, userFound, resBycrypt);
                });
              } else {
                return res.status(404).json({ 'error': 'user not exist in DB' });
              }
            },
            (userFound, resBycrypt, done) => {
              if(resBycrypt) {
                done(userFound);
              } else {
                return res.status(403).json({ 'error': 'invalid password' });
              }
            }
        ], (userFound) => {
            if (userFound) {
              return res.status(201).json({
                'userId': userFound.id,
                'token': jwtUtils.generateTokenForUser(userFound)
              });
            } else {
              return res.status(500).json({ 'error': 'cannot log on user' });
            }
        });
    },
    getUserProfil: (req, res) => {
      var headerAuh = req.headers['authorization'];
      var userId    = jwtUtils.getUserId(headerAuh);

      if (userId < 0) {
        return res.status(400).json({ 'error': 'invalid token' })
      }

      models.User.findOne({
        attributes: ['id', 'email', 'username', 'bio'],
        where: { id: userId }
      }).then((user) => {
        if (user) {
          res.status(200).json(user)
        } else {
          res.status(404).json({ 'error': 'usernot found' });
        }
      }).catch((err) => {
        res.status(500).json({ 'error': 'cannot fetch user' });
      });
    }
}