const { MediaController } = require('../../controllers/v1');
const { AuthMiddleware } = require('../../middlewares');

const router = require('express').Router();

router.route('/').post(AuthMiddleware.verifyUser, MediaController.uploadMedia);

module.exports = router;
