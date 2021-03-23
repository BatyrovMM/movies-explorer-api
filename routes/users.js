const users = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  myUser,
  myUserUpdateInfo,
} = require('../controllers/users');

users.get('/users/me', myUser);
users.patch('/users/me', celebrate({
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
}), myUserUpdateInfo);

module.exports = users;
