const express = require('express');
const router = express.Router();
const { AdminController } = require('../../controllers/v1');
const { AuthMiddleware } = require('../../middlewares');

router.put(
  '/users/status',
  AuthMiddleware.verifyAdmin,
  AdminController.changeAccountStatus
);

router.get(
  '/system/general',
  AuthMiddleware.verifyAdmin,
  AdminController.getGeneralSystemStats
);

router.get(
  '/system/date-stats',
  AuthMiddleware.verifyAdmin,
  AdminController.getDateStats
);

router.post('/nfts', AuthMiddleware.verifyAdmin, AdminController.createNFT);
router.get('/nfts', AuthMiddleware.verifyAdmin, AdminController.searchNFT);

module.exports = router;
