module.exports = function(sequelize, dataTypes) {
    var user = sequelize.define("user", {
        userName: dataTypes.STRING,
        password: dataTypes.INTEGER,
        admin: dataTypes.BOOLEAN
    });
    return user
}