module.exports = function (sequelize, DataTypes) {
    var Project = sequelize.define('Project', {
        title: DataTypes.STRING,
        text: DataTypes.STRING,
        complete: DataTypes.BOOLEAN
    });

    Project.associate = (models) => {
        Project.hasMany(models.ProjectPhase, {
            onDelete: 'cascade'
        });
    };

    Project.associate = (models) => {
        Project.belongsTo(models.User, {
            foreignKey: {
                allowNull: false
            }
        });
    };

    return Project;
};
('titl');
