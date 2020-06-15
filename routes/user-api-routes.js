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

    // PUT route for updating a user's password by username
    app.put('/api/users', (req, res) => {
        let hashedPassword = req.body.password;

        // Hashes new password for protection in DB
        hashedPassword = bcrypt.hashSync(
            hashedPassword,
            bcrypt.genSaltSync(10),
            null
        );

        let updatedUser = {
            password: hashedPassword
        };

        db.User.update(updatedUser, {
            where: {
                username: req.body.username
            }
        })
            .then((data) => {
                res.json(data);
            })
            .catch((err) => {
                if (err) throw err;
            });
    });
};
