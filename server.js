require("dotenv");

var express = require("express");
var models = require("models");

var app = expres();
var PORT = process.env.PORT || 8080;

db.sequelize.sync().then(function() {
    app.listen(PORT, function() {
        console.log("App listening on PORT " + PORT)
    });
});