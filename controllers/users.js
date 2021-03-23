const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const BadRequest = require('../errors/BadRequest');
const Conflict = require('../errors/Conflict');
const User = require('../models/user');

const { NODE_ENV, JWT_SECRET } = process.env;

const myUser = (req, res, next) => {
  const id = req.user._id;
  User.findById(id)
    .then((user) => res.status(200).send(user))
    .catch(next);
};

const myUserUpdateInfo = (req, res, next) => {
  const { email, name } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    {
      email,
      name,
    },
    {
      new: true,
      runValidators: true,
      upsert: false,
    },
  )
    .then((users) => {
      res.send(users);
    })
    .catch(() => {
      if (BadRequest) {
        next(new BadRequest('Данные введены неверно!'));
      }
    })
    .catch(next);
};

const createUsers = (req, res, next) => {
  const {
    email, password, name,
  } = req.body;

  return bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email,
      password: hash,
      name,
    }))
    .then(({ _id }) => {
      res.status(200).send({ _id, email });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Неправильные почта или пароль'));
      }
      if (Conflict) {
        next(new Conflict('Конфликт на ровном месте...'));
      }
    })
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new BadRequest('Неправильные почта или пароль'));
      }

      return bcrypt.compare(password, user.password)
        .then((isValid) => {
          if (isValid) {
            return user;
          }
          return Promise.reject(new BadRequest('Неправильные почта или пароль'));
        });
    })
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch(next);
};

module.exports = {
  myUser,
  myUserUpdateInfo,
  createUsers,
  login,
};
