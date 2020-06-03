module.exports = function (sequelize, DataTypes) {
    var User = sequelize.define("User", {
        username: DataTypes.STRING,
        password: DataTypes.TEXT,
        admin: DataTypes.BOOLEAN
    });

    User.associate = (models) => {
        User.belongsTo(models.Project, {
            foreignKey: {
                allowNull: false
            }
        });
    };

    return User;
};
