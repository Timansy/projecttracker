// Requiring necessary npm packages
var express = require('express');
var session = require('express-session');
// Requiring passport as we've configured it
var passport = require('./config/passport');

// Setting up port and requiring models for syncing
var PORT = process.env.PORT || 3500;
var db = require('./models');

// Creating express app and configuring middleware needed for authentication
var app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// We need to use sessions to keep track of our user's login status
app.use(
    session({ secret: 'keyboard cat', resave: true, saveUninitialized: true })
);
app.use(passport.initialize());
app.use(passport.session());

// Requiring our routes
require('./routes/html-routes.js')(app);
require('./routes/api-routes.js')(app);
require('./routes/user-api-routes')(app);
require('./routes/project-api-routes')(app);
require('./routes/phase-api-routes')(app);
require('./routes/task-api-routes')(app);
require('./routes/dev-api-routes')(app);
require('./routes/auth-routes')(app, passport);

// Syncing our database and logging a message to the user upon success
db.sequelize.sync().then(function () {
    app.listen(PORT, function () {
        console.log(
            '==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.',
            PORT,
            PORT
        );
    });
});
