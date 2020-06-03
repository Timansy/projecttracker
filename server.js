require("dotenv");

var express = require("express");
var passport = require("passport");
var session = require("express-session");
var db = require("./models");

var app = express();
var PORT = process.env.PORT || 8080;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

// Passport Middleware
app.use(
    session({ secret: "sequelize it", resave: true, saveUninitialized: true })
);
app.use(passport.initialize());
app.use(passport.session());

// Routes
require("./routes/user-api-routes")(app);
require("./routes/auth-routes")(app, passport);

// Passport Strategies
require("./config/passport.js")(passport, db.User);

db.sequelize.sync({ force: false }).then(function () {
    app.listen(PORT, function () {
        console.log("App listening on PORT " + PORT);
    });
});
