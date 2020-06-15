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
    app.get('/api/username/:username', (req, res) => {
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

    // GET one user by ID
    app.get('/api/users/:id', (req, res) => {
        db.User.findOne({
            where: {
                id: req.params.id
            }
        })
            .then((data) => res.json(data))
            .catch((err) => {
                if (err) throw err;
            });
    });

    // POST new user
    app.post('/api/users', (req, res) => {
        db.User.create(req.body)
            .then((data) => res.json(data))
            .catch((err) => {
                if (err) throw err;
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
    app.put('/api/user-password', (req, res) => {
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
