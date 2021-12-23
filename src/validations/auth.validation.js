const Joi = require('joi');
const { User } = require('./config.validation');

const login = {
  body: Joi.object().keys({
    email:  User.email.required(),
    password: User.password.required()
  })
};

module.exports = {
  login,
}