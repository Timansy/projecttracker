// Creating our User model
module.exports = function (sequelize, DataTypes) {
  var User = sequelize.define("User", {
    username: DataTypes.STRING,
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    auth_level: {
      type: DataTypes.STRING,
      isIn: [["administrator", "project_manager", "developer"]],
      defaultValue: "administrator"
    },
  });

  User.associate = (models) => {
    User.hasMany(models.Project, {});
    User.hasMany(models.Task, {});
  };

  //could add bcrypt stuff??

  return User;
};
