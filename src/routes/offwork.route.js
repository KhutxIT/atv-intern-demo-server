const express = require('express');
const { offworkController } = require('../controllers');
const authJwt = require('../middlewares/authJwt');

const router = express.Router();

router
  .route('/')
  .post([authJwt.verifyToken, authJwt.isEmployee], offworkController.createOffwork)
  .get([authJwt.verifyToken, authJwt.isEmployee], offworkController.getAllOffWork);

router
  .route('/month-year')
  .get([authJwt.verifyToken, authJwt.isEmployee], offworkController.getOffWorkByMonthAndYear)
  .delete([authJwt.verifyToken, authJwt.isEmployee], offworkController.deleteFormById);

module.exports = router;