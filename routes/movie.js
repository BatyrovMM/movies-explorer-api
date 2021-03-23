const movie = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getMovies,
  createMovie,
  deleteMovieById,
} = require('../controllers/movie');

movie.get('/movie', getMovies);

movie.post('/movie', createMovie);

movie.delete('/movie/:movieId', celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().length(24).hex().required(true),
  }),
}), deleteMovieById);

module.exports = movie;
