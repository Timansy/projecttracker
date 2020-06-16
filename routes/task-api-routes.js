const db = require('../models');

module.exports = (app) => {
    app.get('/api/pmview/allofit/:phaseId', async (req, res) => {
        try {
            const Tasks = await db.Task.findAll({
                where: {
                    ProjectPhaseId: req.params.phaseId
                }
            });
            const Users = await db.User.findAll({});
            const result = {};
            result.Users = Users;
            result.Tasks = Tasks;
            console.log(result);
            return res.json(result);
        } catch (error) {
            throw error;
        }
    });

    // GETs all Tasks by User Id -- include Phase/Project Data
    app.get('/api/tasks/task-data/user/:id', (req, res) => {
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
        }).then((data) => res.json(data));
    });

    // GET Tasks by Phase Id
    app.get('/api/tasks/phase/:phaseId', function (req, res) {
        db.Task.findAll({
            where: {
                ProjectPhaseId: req.params.phaseId
            }
        })
            .then(function (data) {
                res.json(data);
            })
            .catch(function (err) {
                if (err) throw err;
            });
    });

    // POST route for new task
    app.post('/api/tasks', (req, res) => {
        db.Task.create(req.body)
            .then((data) => res.json(data))
            .catch((err) => {
                if (err) throw err;
            });
    });

    // DELETE route for one task
    app.delete('/api/tasks/:id', (req, res) => {
        db.Task.destroy({
            where: {
                id: req.params.id
            }
        })
            .then((data) => res.json(data))
            .catch((err) => {
                if (err) throw err;
            });
    });

    // PUT route for updating project
    app.put('/api/tasks', (req, res) => {
        console.log('Task Update: ', req.body);

        db.Task.update(req.body, {
            where: {
                id: req.body.id
            }
        })
            .then((data) => res.json(data))
            .catch((err) => {
                if (err) throw err;
            });
    });
};
