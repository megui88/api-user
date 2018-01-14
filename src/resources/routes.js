const express = require('express');
const user = require('./UserService');
const router = express.Router();

/* GET users listing. */
router.get('/', (req, res, next) => {
    user.all()
        .then(data => {
            res.json(data);
        })
        .catch(next);
});

/* POST user create. */
router.post('/', (req, res, next) => {
    user.create(req.body)
        .then(data => {
            res.status(201);
            res.json(data);
        })
        .catch(next);
});

/* GET user details. */
router.get('/:id', (req, res, next) => {
    user.get(req.params.id)
        .then(data => {
            res.json(data);
        })
        .catch(next);
});

/* PUT/PATCH user update. */
router.put('/:id', update);
router.patch('/:id', update);

function update(req, res, next) {
    user.update(req.params.id, req.body)
        .then(data => {
            res.json(data);
        })
        .catch(next);
}

module.exports = router;
