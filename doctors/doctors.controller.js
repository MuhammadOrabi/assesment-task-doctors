const express = require('express');
const router = express.Router();
const doctorService = require('./doctor.service');

// routes
router.post('/login', authenticate);
router.post('/register', register);
router.get('/', getAll);
router.get('/current', getCurrent);
router.get('/:id', getById);
router.put('/', update);
router.delete('/', _delete);

router.get('/:id/avail/:day', getAvail);

module.exports = router;

function authenticate(req, res, next) {
    doctorService.authenticate(req.body)
        .then(doctor => doctor ? res.json(doctor) : res.status(400).json({ message: 'Username or password is incorrect' }))
        .catch(err => next(err));
}

function register(req, res, next) {
    doctorService.create(req.body)
        .then(() => {
            authenticate(req, res, next);
        })
        .catch(err => next(err));
}

function getAll(req, res, next) {
    doctorService.getAll()
        .then(doctors => res.json(doctors))
        .catch(err => next(err));
}

function getCurrent(req, res, next) {
    doctorService.getById(req.user.sub)
        .then(doctor => doctor ? res.json(doctor) : res.sendStatus(404))
        .catch(err => next(err));
}

function getById(req, res, next) {
    doctorService.getById(req.params.id)
        .then(doctor => doctor ? res.json(doctor) : res.sendStatus(404))
        .catch(err => next(err));
}

function update(req, res, next) {
    doctorService.update(req.user.sub, req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function _delete(req, res, next) {
    doctorService.delete(req.user.sub)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function getAvail(req, res, next) {
    doctorService.getByIdAndAvail(req.params.id,req.params.day)
        .then(doctor => doctor ? res.json(doctor) : res.sendStatus(404))
        .catch(err => next(err));
}