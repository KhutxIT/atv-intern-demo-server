const express = require('express');
const { userController } = require('../controllers');
const authJwt = require('../middlewares/authJwt');
const validate = require('../middlewares/validation');
const { userValidation } = require('../validations');

const router = express.Router();

router
  .route('/')
  .post([authJwt.verifyToken, authJwt.isAdmin], validate(userValidation.createUser), userController.createUser)
  .get([authJwt.verifyToken, authJwt.isAdmin], userController.getUsers);
  
router
  .route('/:userId')
  .get([authJwt.verifyToken, authJwt.isAdmin], userController.getUser)
  .put([authJwt.verifyToken, authJwt.isAdmin], validate(userValidation.updateUser), userController.updateUser)
  .delete([authJwt.verifyToken, authJwt.isAdmin], userController.deleteByUpdateUserStatus);

module.exports = router;