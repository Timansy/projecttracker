const db = require('../models');

module.exports = (app) => {
    // GET route for all projects
    app.get('/api/projects', (req, res) => {
        db.Project.findAll({})
            .then((data) => res.json(data))
            .catch((err) => {
                if (err) throw err;
            });
    });

    // GET route for one project
    app.get('/api/projects/:id', (req, res) => {
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
        console.log('Project Update: ', req.body);

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