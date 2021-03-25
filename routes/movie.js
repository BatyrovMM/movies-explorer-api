const movie = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const validator = require('validator');
const {
  getMovies,
  createMovie,
  deleteMovieById,
} = require('../controllers/movie');

movie.get('/movies', getMovies);

movie.post('/movies', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(true),
    director: Joi.string().required(true),
    duration: Joi.number().required(true),
    year: Joi.string().required(true),
    description: Joi.string().min(1).required(true),
    image: Joi.string().required(true).custom((value, helpers) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helpers.message('Неправильная ссылка - image');
    }),
    trailer: Joi.string().required(true).custom((value, helpers) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helpers.message('Неправильная ссылка - trailer');
    }),
    thumbnail: Joi.string().required(true).custom((value, helpers) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helpers.message('Неправильная ссылка - thumbnail');
    }),
    movieId: Joi.number().required(true),
    nameRU: Joi.string().required(true),
    nameEN: Joi.string().required(true),
  }),
}), createMovie);

movie.delete('/movies/:movieId', celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().length(24).hex().required(true),
  }),
}), deleteMovieById);

module.exports = movie;
