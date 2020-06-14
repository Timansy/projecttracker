var bcrypt = require('bcryptjs');

// Creating our User model
module.exports = function (sequelize, DataTypes) {
    var User = sequelize.define('User', {
        username: DataTypes.STRING,
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        auth_level: {
            type: DataTypes.STRING,
            isIn: [['administrator', 'project_manager', 'developer']],
            defaultValue: 'administrator'
        }
    });

    User.associate = (models) => {
        User.hasMany(models.Project, {});
        User.hasMany(models.Task, {});
    };

    // Compares the password entered with the bCrypt comparison method
    User.prototype.validPassword = (userPassword, password) => {
        return bcrypt.compareSync(password, userPassword);
    };

    // Hashes a user's password before the user is created
    User.beforeCreate((user) => {
        user.password = bcrypt.hashSync(
            user.password,
            bcrypt.genSaltSync(10),
            null
        );
    });

    return User;
};
