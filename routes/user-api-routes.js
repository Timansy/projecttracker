const db = require('../models');
const bcrypt = require('bcryptjs');

module.exports = (app) => {
    // GET all users
    app.get('/api/users', (req, res) => {
        db.User.findAll({})
            .then((data) => res.json(data))
            .catch((err) => {
                if (err) throw err;
            });
    });

    // GET one user by Username
    app.get('/api/users/username/:username', (req, res) => {
        db.User.findOne({
            where: {
                username: req.params.username
            }
        })
            .then((data) => res.json(data))
            .catch((err) => {
                if (err) throw err;
            });
    });

    // Route for creating a new user as an Admin
    app.post('/api/users/create-user', function (req, res) {
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

    // DELETE one user
    app.delete('/api/users/:id', (req, res) => {
        db.User.destroy({
            where: {
                id: req.params.id
            }
        })
            .then((data) => res.json(data))
            .catch((err) => {
                if (err) throw err;
            });
    });

    // PUT route for updating a users password by username
    app.put('/api/users/update-password', (req, res) => {
        let newPasswordInput = req.body.password;

        // Hashes new password
        let hashedPassword = bcrypt.hashSync(
            newPasswordInput,
            bcrypt.genSaltSync(10),
            null
        );

        db.User.update(
            { password: hashedPassword },
            {
                where: {
                    username: req.body.username
                }
            }
        )
            .then((data) => {
                res.json(data);
            })
            .catch((err) => {
                if (err) {
                    res.status(401).json(err);
                }
            });
    });
};
