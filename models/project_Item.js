module.exports = function(sequelize, dataTypes) {
    var projectItem = sequelize.define("Project Item", {
        title: dataTypes.STRING,
        text: dataTypes.STRING,
        phaseID: dataTypes.INTEGER,
        complete: dataTypes.BOOLEAN
    })
    return projectItem
}