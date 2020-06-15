// Requiring our models and passport as we've configured it
var db = require('../models');
var passport = require('../config/passport');

module.exports = function (app) {
    // Using the passport.authenticate middleware with our local strategy.
    // If the user has valid login credentials, send them to the members page.
    // Otherwise the user will be sent an error
    app.post('/api/login', passport.authenticate('local'), function (req, res) {
        res.json(req.user);
    });

    // Route for signing up a user. The user's password is automatically hashed and stored securely thanks to
    // how we configured our Sequelize User Model. If the user is created successfully, proceed to log the user in,
    // otherwise send back an error
    app.post('/api/signup', function (req, res) {
        db.User.findOne({
            where: {
                username: req.body.username
            }
        }).then(function (dbUser) {
            if (dbUser) {
                res.redirect(307, '/api/login');
            } else {
                db.User.create({
                    username: req.body.username,
                    password: req.body.password
                })
                    .then(function () {
                        res.redirect(307, '/api/login');
                    })
                    .catch(function (err) {
                        res.status(401).json(err);
                    });
            }
        });
    });

    // Route for creating a new user as an Admin
    app.post('/api/create-user', function (req, res) {
        db.User.findOne({
            where: {
                username: req.body.username
            }
        }).then(function (dbUser) {
            if (dbUser) {
                res.redirect(307, '/administrator');
            } else {
                db.User.create({
                    username: req.body.username,
                    password: req.body.password,
                    auth_level: req.body.auth_level
                })
                    .then(function () {
                        res.status(200);
                    })
                    .catch(function (err) {
                        res.status(401).json(err);
                    });
            }
        });
    });

    app.post('/api/auth_level/:id/:auth_level', function (req, res) {
        db.User.update(
            { auth_level: req.params.auth_level },
            { where: { id: req.params.id } }
        )
            .then(function (rowsUpdated) {
                // window.location.replace("/in");
                res.json(rowsUpdated);
            })
            .catch();
    });

    // Route for logging user out
    app.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/');
    });

    // Route for getting some data about our user to be used client side
    app.get('/api/user_data', function (req, res) {
        if (!req.user) {
            // The user is not logged in, send back an empty object
            res.json({});
        } else {
            res.json({
                username: req.user.username,
                id: req.user.id,
                password: req.user.password,
                auth_level: req.user.auth_level
            });
        }
    });
};
