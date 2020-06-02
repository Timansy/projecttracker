module.exports = function(sequelize, DataTypes) {
    var projectItem = sequelize.define("Project Item", {
        title: DataTypes.STRING,
        text: DataTypes.STRING,
        complete: DataTypes.BOOLEAN
    })
    return projectItem
}