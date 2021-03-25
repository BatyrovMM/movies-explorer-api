const Movie = require('../models/movie');
const NotFound = require('../errors/NotFound');
const Conflict = require('../errors/Conflict');

const getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .sort({ createdAt: -1 })
    .then((movie) => res.send({
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
      _id: movie._id,
    }))
    .catch(next);
};

const createMovie = (req, res, next) => {
  const ownerId = req.user._id;
    Movie.create({...req.body, owner: ownerId})
    .then((movie) => {
      res.send({
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
        _id: movie._id,
      });
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
