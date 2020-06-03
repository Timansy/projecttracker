module.exports = function (sequelize, DataTypes) {
    var ProjectPhase = sequelize.define("Project Phase", {
        title: DataTypes.STRING,
        phaseComplete: DataTypes.BOOLEAN
    });

    ProjectPhase.associate = (models) => {
        ProjectPhase.belongsTo(models.Project, {
            foreignKey: {
                allowNull: false
            }
        });
    };

    return ProjectPhase;
};
