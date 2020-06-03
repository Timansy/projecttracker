const path = require("path");

// Middleware to protect "/dashboard" route
let isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) return next();

    res.redirect("/login");
};

module.exports = (app, passport) => {
    app.get("/signup", (req, res) => {
        res.sendFile(path.join(__dirname, "../public/signup.html"));
    });
    app.get("/login", (req, res) => {
        res.sendFile(path.join(__dirname, "../public/login.html"));
    });

    app.get("/dashboard", isLoggedIn, (req, res) => {
        res.sendFile(path.join(__dirname, "../public/dashboard.html"));
    });

    // Destroys session and redirects to home page
    app.get("/logout", (req, res) => {
        req.session.destroy((err) => {
            if (err) throw err;

            // Redirecting to login screen until home view is ready
            res.redirect("/login");
        });
    });

    // POST to sign up -- authenticates sign up and redirects accordingly
    app.post(
        "/signup",
        passport.authenticate("local-signup", {
            successRedirect: "/dashboard",
            failureRedirect: "/signup"
        })
    );

    // POST to sign in -- authenticates sign in with passport and redirects accordingly
    app.post(
        "/login",
        passport.authenticate("local-login", {
            successRedirect: "/dashboard",
            failureRedirect: "/login"
        })
    );
};
