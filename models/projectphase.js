module.exports = function (sequelize, DataTypes) {
  var ProjectPhase = sequelize.define("ProjectPhase", {
    title: DataTypes.STRING,
    phaseComplete: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  });

  

  ProjectPhase.associate = (models) => {
    ProjectPhase.hasMany(models.Task, {
      onDelete: "cascade",
    });
  };

  ProjectPhase.associate = (models) => {
    ProjectPhase.belongsTo(models.Project,{
      foreignKey: {
        allowNull: false,
      },
    });
  };

  return ProjectPhase;
};
