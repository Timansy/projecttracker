const db = require('../models');

module.exports = (app) => {
    // GET route for all tasks
    app.get('/api/tasks', (req, res) => {
        db.Task.findAll({})
            .then((data) => res.json(data))
            .catch((err) => {
                if (err) throw err;
            });
    });

    // GET route for one task
    app.get('/api/tasks/:id', (req, res) => {
        db.Task.findOne({
            where: {
                id: req.params.id
            }
        })
            .then((data) => res.json(data))
            .catch((err) => {
                if (err) throw err;
            });
    });

    // GET tasks by user...
    app.get('/api/tasks/user/:id', (req, res) => {
        db.Task.findAll({
            where: {
                UserId: req.params.id
            }
        })
            .then((data) => res.json(data))
            .catch((err) => {
                if (err) throw err;
            });
    });

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

    // GET project specific Tasks by user id and phase id -- arranges by Phase ID in ascending order
    app.get('/api/tasks/user_id=:userId/phase_id=:phaseId', (req, res) => {
        console.log(req.params);
        db.Task.findAll({
            where: {
                UserId: req.params.userId,
                ProjectPhaseId: req.params.phaseId
            }
        })
            .then((data) => {
                res.json(data);
            })
            .catch((err) => {
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
