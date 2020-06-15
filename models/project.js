module.exports = function(sequelize, DataTypes) {
    var Project = sequelize.define('Project', {
        title: DataTypes.STRING,
        complete: DataTypes.BOOLEAN
    });

    Project.associate = (models) => {
        Project.hasMany(models.ProjectPhase)
    };

    Project.associate = (models) => {
        Project.belongsTo(models.User, {
            as: 'admin_id',
            foreignKey: {
                allowNull: false
            }
        });
    };

    Project.associate = (models) => {
        Project.belongsTo(models.User, {
            as: 'project_mgr_id',
            foreignKey: {
                allowNull: true
            }
        });
    };

    return Project;
};