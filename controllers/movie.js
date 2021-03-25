const Movie = require('../models/movie');
const NotFound = require('../errors/NotFound');
const BadRequest = require('../errors/BadRequest');
const Forbidden = require('../errors/Forbidden');

const getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .sort({ createdAt: -1 })
    .then((movie) => res.send(movie))
    .catch(next);
};

const createMovie = (req, res, next) => {
  const ownerId = req.user._id;
  Movie.create({ ...req.body, owner: ownerId })
    .then((movie) => {
      res.send({
        _id: movie._id,
        country: movie.country,
        director: movie.director,
        duration: movie.duration,
        year: movie.year,
        description: movie.description,
        image: movie.image,
        trailer: movie.trailer,
        thumbnail: movie.thumbnail,
        movieId: movie.movieId,
        nameRU: movie.nameRU,
        nameEN: movie.nameEN,
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Данные невалидны'));
      } else {
        next(err);
      }
    });
};

const deleteMovieById = (req, res, next) => {
  const { movieId } = req.params;
  Movie.findById(req.params.movieId).select('+owner')
    .orFail(() => {
      throw new NotFound('Фильм не найден');
    })
    .then((movie) => {
      if (movie.owner.toString() === req.user._id.toString()) {
        Movie.findByIdAndRemove(movieId)
          .then(() => res.send({ message: 'Удаление прошло успешно!' }));
      } else {
        throw new Forbidden('Нельзя удалять чужие фильмы!');
      }
    })
    .catch(next);
};

module.exports = {
  getMovies,
  createMovie,
  deleteMovieById,
};
