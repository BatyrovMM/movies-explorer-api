const movie = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getMovies,
  createMovie,
  deleteMovieById,
} = require('../controllers/movie');

movie.get('/movie', getMovies);

movie.post('/movie', celebrate({
  body: Joi.object().keys({
    country: Joi.string().min(1).required(true),
    director: Joi.string().min(1).required(true),
    duration: Joi.number().min(1).required(true),
    year: Joi.string().min(2).max(4).required(true),
    description: Joi.string().min(1).required(true),
    image: Joi.string().pattern(new RegExp(/https?:\/\/w{0,3}[a-z0-9-._~:\/?#[\]@!$&'()*+,;=]{0,}/i)).required(true),
    trailer: Joi.string().pattern(new RegExp(/https?:\/\/w{0,3}[a-z0-9-._~:\/?#[\]@!$&'()*+,;=]{0,}/i)).required(true),
    thumbnail: Joi.string().pattern(new RegExp(/https?:\/\/w{0,3}[a-z0-9-._~:\/?#[\]@!$&'()*+,;=]{0,}/i)).required(true),
    nameRU: Joi.string().required(true),
    nameEN: Joi.string().required(true),
  }),
}), createMovie);

movie.delete('/movie/:movieId', celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().length(24).hex().required(true),
  }),
}), deleteMovieById);

module.exports = movie;
