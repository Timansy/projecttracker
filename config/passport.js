// Used to secure passwords
const bCrypt = require("bcrypt-nodejs");

// Passport Strategies
module.exports = (passport, user) => {
    let User = user;
    let LocalStrategy = require("passport-local").Strategy;

    // SIGN UP
    passport.use(
        "local-signup",
        new LocalStrategy(
            {
                usernameField: "username",
                passwordField: "password",
                passReqToCallback: true // passes entire request to callback
            },
            (req, username, password, done) => {
                // Generates hashed password
                let genHash = (password) => {
                    return bCrypt.hashSync(
                        password,
                        bCrypt.genSaltSync(),
                        null
                    );
                };

                // Querying DB for entered username...
                User.findOne({
                    where: {
                        username: username
                    }
                }).then((user) => {
                    // If username exists in DB...
                    if (user) {
                        return done(null, false, {
                            message: "That username is taken."
                        });
                    } else {
                        // Generating hashed password from user password input
                        let userPassword = genHash(password);

                        let data = {
                            username: username,
                            password: userPassword,
                            admin: req.body.admin
                        };

                        User.create(data).then((user, created) => {
                            if (!user) {
                                return done(null, false);
                            } else {
                                return done(null, user);
                            }
                        });
                    }
                });
            }
        )
    );

    // LOGIN
    passport.use(
        "local-login",
        new LocalStrategy(
            {
                usernameField: "username",
                passwordField: "password",
                passReqToCallback: true
            },
            (req, username, password, done) => {
                let User = user;

                // Compares entered password using bCrypt compare method
                let isValidPassword = (userInput, password) => {
                    return bCrypt.compareSync(password, userInput);
                };

                // Finding username in DB
                User.findOne({
                    where: {
                        username: username
                    }
                })
                    .then((user) => {
                        // If username is not in DB...
                        if (!user) {
                            return done(null, false, {
                                message: "Username does not exist!"
                            });
                        }
                        // If password input does not match password...
                        if (!isValidPassword(user.password, password)) {
                            return done(null, false, {
                                message: "Incorrect password!"
                            });
                        }

                        return done(null, user.get());
                    })
                    .catch((err) => {
                        if (err) throw err;

                        return done(null, false, {
                            message: "Login failed!"
                        });
                    });
            }
        )
    );

    // Saves the user id to the session
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    // Use findOne promise to get user, returns instance of User model
    passport.deserializeUser((id, done) => {
        User.findOne({
            where: {
                id: id
            }
        })
            .then((user) => {
                if (user) done(null, user.get());
                else done(user.errors, null);
            })
            .catch((err) => {
                if (err) throw err;
            });
    });
};
