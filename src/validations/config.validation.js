const Joi = require('joi');

const User = {
  email: Joi.string().email(),
  password: Joi.string().min(3),
  name: Joi.string(),
  date_of_birth: Joi.date(),
  gender: Joi.string(),
  address: Joi.string(),
  cmnd_number: Joi.number(),
  salary: Joi.number(),
  manager_id: Joi.number(),
  status: Joi.number(),
  roles: Joi.array().items(Joi.string().required().valid(
    'user', 'admin', 'manager', 'accountant', 'employee')
  )
};

module.exports = {
  User
}