const db = require('../models');

module.exports = (app) => {
    // GET route for all projects by user id
    app.get('/api/projects/:userId', (req, res) => {
        db.Project.findAll({
            where: {
                UserId: req.params.userId
            }
        })
            .then((data) => res.json(data))
            .catch((err) => {
                if (err) throw err;
            });
    });

    app.get('/api/projects/pm/:id', (req, res) => {
        db.Project.findAll({
            where: {
                projectMgrIdId: req.params.id
            }
        })
            .then((data) => res.json(data))
            .catch((err) => {
                if (err) throw err;
            });
    });

    // GET one project by project ID
    app.get('/api/projects/id/:id', (req, res) => {
        db.Project.findOne({
            where: {
                id: req.params.id
            }
        })
            .then((data) => res.json(data))
            .catch((err) => {
                if (err) throw err;
            });
    });

    // POST route for new project
    app.post('/api/projects', (req, res) => {
        db.Project.create(req.body)
            .then((data) => res.json(data))
            .catch((err) => {
                if (err) throw err;
            });
    });

    // DELETE route for one project
    app.delete('/api/projects/:id', (req, res) => {
        db.Project.destroy({
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
    app.put('/api/projects', (req, res) => {
        db.Project.update(req.body, {
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
