module.exports = function (sequelize, DataTypes) {
    var User = sequelize.define("User", {
        username: DataTypes.STRING,
        password: DataTypes.INTEGER,
        auth_level: {
            type: DataTypes.STRING,
            isIn: [['administrator','project_manager','developer']]
        }
    });

    User.associate = (models) => {
        User.hasMany(models.Project,{});
        User.hasMany(models.Task,{});
    };

    return User;
};
