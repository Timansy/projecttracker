module.exports = function(sequelize, DataTypes) {
    var Task = sequelize.define("Task", {
        taskname: DataTypes.STRING,
        isComplete: DataTypes.BOOLEAN,
    });

    Task.associate = (models) => {
        Task.belongsTo(models.User, {
            foreignKey: {
                allowNull: true,
            },
        });
    };

    Task.associate = (models) => {
        Task.belongsTo(models.ProjectPhase, {
            foreignKeyConstraint: true
        });
    };

    return Task;
};