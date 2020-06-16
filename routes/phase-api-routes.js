const db = require('../models');

module.exports = (app) => {
    // GET route for every project phase
    app.get('/api/project-phase', (req, res) => {
        db.ProjectPhase.findAll({})
            .then((data) => {
                let ordered = data.sort((a, b) => a.id - b.id);
                res.json(ordered);
            })
            .catch((err) => {
                if (err) throw err;
            });
    });

    // GET Phases associated with a specific project
    app.get('/api/project-phase/project/:projectId', (req, res) => {
        // console.log(req.params.projectId);
        db.ProjectPhase.findAll({
            where: {
                ProjectId: req.params.projectId
            }
        })
            .then((data) => {
                res.json(data);
            })
            .catch((err) => {
                if (err) throw err;
            });
    });

    // POST route for new project phase
    app.post('/api/project-phase', (req, res) => {
        db.ProjectPhase.create(req.body)
            .then((data) => res.json(data))
            .catch((err) => {
                if (err) throw err;
            });
    });

    // DELETE route for one project phase
    app.delete('/api/project-phase/:id', (req, res) => {
        db.ProjectPhase.destroy({
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
    app.put('/api/project-phase', (req, res) => {
        db.ProjectPhase.update(req.body, {
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
