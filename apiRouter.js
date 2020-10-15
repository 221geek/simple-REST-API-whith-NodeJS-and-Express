var express = require('express');
var usersCrtl = require('./routes/usersCtrl');

exports.router = (() => {
    var apiRouter = express.Router();

    apiRouter.route('/users/register/').post(usersCrtl.register);
    apiRouter.route('/users/login/').post(usersCrtl.login);
    apiRouter.route('/users/me/').get(usersCrtl.getUserProfil);
    apiRouter.route('/users/me/').put(usersCrtl.updateUserProfile);

    return apiRouter;
})();