const Joi = require('joi');
const { User } = require('./config.validation');

const createUser = {
  body: Joi.object().keys({
    email: User.email.required(),
    password: User.password.required(),
    name: User.name.required(),
    date_of_birth: User.date_of_birth.required(),
    gender: User.gender.required(),
    address: User.address.required(),
    cmnd_number: User.cmnd_number.required(),
    salary: User.salary.required(),
    manager_id: User.manager_id,
    status: User.status.required(),
    roles: User.roles.required(),
  })
};

const updateUser = {
  body: Joi.object().keys(User)
};

module.exports = {
  createUser,
  updateUser
}