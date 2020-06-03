module.exports = function(sequelize, dataTypes) {
    var projectPhase = sequelize.define("Project Phase", {
        title: dataTypes.STRING
    });

    projectPhase.associate = function(models) {
        projectPhase.hasMany(models.projectItem, {
            // onDelete: "cascade"
        });
    };

    return projectPhase
};