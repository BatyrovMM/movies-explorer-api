const router = require('express').Router();
const users = require('./users');
const movie = require('./movie');
const NotFound = require('../errors/NotFound');

router.use('/', users);
router.use('/', movie);

router.use('/*', (req, res, next) => {
  next(new NotFound('Вам тут не фильмы!'));
});

module.exports = router;
