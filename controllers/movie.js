const Movie = require('../models/movie');
const NotFound = require('../errors/NotFound');
const Conflict = require('../errors/Conflict');

const getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .sort({ createdAt: -1 })
    .then((movie) => res.send(movie))
    .catch(next);
};

const createMovie = (req, res, next) => {
  const ownerId = req.user._id;
  const { movieId } = req.body;
  Movie.findOne({ movieId })
    .orFail(() => {
      throw new NotFound('Кина не будет! Данные не валидны');
    })
    .then((movie) => {
      if (movie) {
        throw new Conflict('Фильм уже добавлен');
      }
      return Movie.create({
        ...req.body,
        owner: ownerId,
      });
    })
    .then((movie) => {
      res.send(movie);
    })
    .catch(next);
};

const deleteMovieById = (req, res, next) => {
  const { movieId } = req.params;
  Movie.findById(req.params.movieId)
    .orFail(() => {
      throw new NotFound('Фильм не найден');
    })
    .then((movie) => {
      if (movie.owner.toString() === req.user._id) {
        Movie.findByIdAndRemove(movieId)
          .then(() => res.send({ message: 'Удаление прошло успешно!' }));
      } else {
        throw new Conflict('Конфликт на ровном месте');
      }
    })
    .catch(next);
};

module.exports = {
  getMovies,
  createMovie,
  deleteMovieById,
};
