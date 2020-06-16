// Requiring path to so we can use relative routes to our HTML files
var path = require('path');

// Requiring our custom middleware for checking if a user is logged in
var isAuthenticated = require('../config/authenticate/isAuthenticated');

module.exports = function (app) {
    app.get('/', function (req, res) {
        // If the user already has an account send them to the members page
        if (req.user) {
            res.redirect('/in');
        }
        res.sendFile(path.join(__dirname, '../public/login.html'));
    });

    app.get('/login', function (req, res) {
        // If the user already has an account send them to the members page
        if (req.user) {
            res.redirect('/in');
        }
        res.sendFile(path.join(__dirname, '../public/login.html'));
    });

    app.get('/register', (req, res) => {
        res.sendFile(path.join(__dirname, '../public/register.html'));
    });

    app.get('/password-reset', function (req, res) {
        res.sendFile(path.join(__dirname, '../public/reset.html'));
    });

    // Here we've add our isAuthenticated middleware to this route.
    // If a user who is not logged in tries to access this route they will be redirected to the signup page
    app.get('/in', isAuthenticated, function (req, res) {
        res.sendFile(path.join(__dirname, '../public/in.html'));
    });

    app.get('/administrator', isAuthenticated, function (req, res) {
        res.sendFile(path.join(__dirname, '../public/admin.html'));
    });

    app.get('/project_manager', isAuthenticated, function (req, res) {
        res.sendFile(path.join(__dirname, '../public/pm.html'));
    });

    app.get('/developer', isAuthenticated, function (req, res) {
        res.sendFile(path.join(__dirname, '../public/dev.html'));
    });
};
