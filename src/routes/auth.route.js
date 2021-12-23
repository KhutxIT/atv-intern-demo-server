const express = require('express');
const { authController } = require('../controllers');
const validate = require('../middlewares/validation');
const { login } = require('../validations/auth.validation');

const router = express.Router();

router
  .route('/login')
  .post(validate(login), authController.login);

module.exports = router;