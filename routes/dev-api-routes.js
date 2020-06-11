const db = require('../models');

module.exports = (app) => {
    // GETs all task data for a user
    app.get('/api/task-data/user/:id', (req, res) => {
        db.Task.findAll({
            where: {
                UserId: req.params.id
            },
            include: [
                {
                    model: db.ProjectPhase,
                    include: [
                        {
                            model: db.Project
                        }
                    ]
                }
            ]
        }).then((data) => {
            res.json(data);
        });
    });
};
