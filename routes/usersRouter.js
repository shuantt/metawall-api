var express = require('express');
var router = express.Router();
const usersController = require('../controllers/usersController.js');
const { handleErrorAsync } = require('../utils/errorHandler.js');
const { authJwt } = require('../service/authService.js');

// 驗證 JWT Token
// router.use(authJwt);

// 使用者相關 API
router.get('/', handleErrorAsync(usersController.getUsers));
router.get('/:userId', handleErrorAsync(usersController.getUser));
router.patch('/:userId', handleErrorAsync(usersController.updateProfile));
router.patch('/:userId/password', handleErrorAsync(usersController.resetPassword));
// router.delete('/', authJwt, handleErrorAsync(usersController.deleteUsers));
router.delete('/:targetUserId', authJwt, handleErrorAsync(usersController.deleteUser));
router.get('/:userId/posts', handleErrorAsync(usersController.getUserPosts));

// 追蹤相關 API
router.get('/:userId/followers', handleErrorAsync(usersController.getFollowers));
router.get('/:userId/followings', handleErrorAsync(usersController.getFollowings));
router.post('/me/followings/:targetUserId', authJwt, handleErrorAsync(usersController.followUser));
router.delete('/me/followings/:targetUserId', authJwt, handleErrorAsync(usersController.unfollowUser));
// router.delete('/:userId/followings', handleErrorAsync(usersController.cleanFollowings));
// router.delete('/:userId/followers', handleErrorAsync(usersController.cleanFollowers));

module.exports = router;
