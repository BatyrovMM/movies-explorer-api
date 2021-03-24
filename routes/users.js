const users = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  myUser,
  myUserUpdateInfo,
} = require('../controllers/users');

users.get('/users/me', myUser);
users.patch('/users/me', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    name: Joi.string().required().min(2).max(30),
  }),
}), myUserUpdateInfo);

module.exports = users;
