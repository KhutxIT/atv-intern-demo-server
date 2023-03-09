const {
  UserController,
  FriendRequestController,
  MediaController,
} = require('../../controllers/v1');
const { AuthMiddleware } = require('../../middlewares');

const router = require('express').Router();

// Signup
router.post('/signup', UserController.signup);

// Login
router.post('/login', UserController.login);

// Profile
router
  .route('/profile')
  .get(AuthMiddleware.verifyUser, UserController.fetchProfile)
  .put(AuthMiddleware.verifyUser, UserController.updateProfile);

router
  .route('/profile/profile-picture')
  .put(
    AuthMiddleware.verifyUser,
    MediaController.uploadMediaMiddleware,
    UserController.updateProfile
  );

// Init
router.get('/chats', AuthMiddleware.verifyUser, UserController.fetchUserChats);

// Search
router.get('/search', AuthMiddleware.verifyUser, UserController.searchUser);
router.get(
  '/search/name',
  AuthMiddleware.verifyUser,
  UserController.searchUserByName
);
router.get(
  '/search/username',
  AuthMiddleware.verifyUser,
  UserController.searchUserByUsername
);

router.get('/count', AuthMiddleware.verifyUser, UserController.countUsers);

router
  .route('/follows')
  .post(AuthMiddleware.verifyUser, UserController.newFollowing)
  .put(AuthMiddleware.verifyUser, UserController.unFollow);

// friend request
router
  .route('/friendrequests')
  .get(AuthMiddleware.verifyUser, UserController.getUsersSentFriendRequestToMe)
  .post(AuthMiddleware.verifyUser, UserController.confirmFriendRequest)
  .delete(AuthMiddleware.verifyUser, UserController.rejectFriendRequest);

// friend
router
  .route('/friends')
  .delete(AuthMiddleware.verifyUser, UserController.unFriend);

router
  .route('/friends/:_id')
  .get(AuthMiddleware.verifyUser, UserController.getFriends);

router
  .route('/friendrequestssent')
  .get(
    AuthMiddleware.verifyUser,
    FriendRequestController.getFriendRequestSentList
  );

router
  .route('/:userId/followers')
  .get(AuthMiddleware.verifyUser, UserController.getFollowerList);

router
  .route('/:userId/followings')
  .get(AuthMiddleware.verifyUser, UserController.getFollowingList);

router.route('/:userId').get(AuthMiddleware.verifyUser, UserController.getUser);

module.exports = router;
