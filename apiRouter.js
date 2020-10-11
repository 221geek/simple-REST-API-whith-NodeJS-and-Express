var express = require('express');
var usersCrtl = require('./routes/usersCtrl');

exports.router = (() => {
    var apiRouter = express.Router();

    apiRouter.route('/users/register/').post(usersCrtl.register);
    apiRouter.route('/users/login/').post(usersCrtl.login);
    apiRouter.route('/profile/').get(usersCrtl.getUserProfil);

    return apiRouter;
})();