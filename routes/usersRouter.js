var express = require('express');
var router = express.Router();
const usersController = require('../controllers/usersController.js');
const { handleErrorAsync } = require('../utils/errorHandler.js');
const { authJwt } = require('../service/authService.js');

// 驗證 JWT Token
// router.use(authJwt);

// 使用者相關 API
router.get('/', handleErrorAsync(usersController.getUsers));

// 取得使用者資料
router.get('/:userId', handleErrorAsync(usersController.getUser));

// 更新使用者資料
router.patch('/:userId', handleErrorAsync(usersController.updateProfile));

// 重設密碼
router.patch('/:userId/password', handleErrorAsync(usersController.resetPassword));

// 刪除使用者
router.delete('/', authJwt, handleErrorAsync(usersController.deleteUsers));

// 刪除特定使用者
router.delete('/:targetUserId', authJwt, handleErrorAsync(usersController.deleteUser));

// 取得使用者的貼文
router.get('/:userId/posts', handleErrorAsync(usersController.getUserPosts));

// 追蹤相關 API
router.get('/:userId/followers', handleErrorAsync(usersController.getFollowers));
router.get('/:userId/followings', handleErrorAsync(usersController.getFollowings));
router.post('/:userId/followings/:targeUserId', handleErrorAsync(usersController.followUser));
router.delete('/:userId/followings/:targeUserId', handleErrorAsync(usersController.unfollowUser));
router.delete('/:userId/followings', handleErrorAsync(usersController.cleanFollowings));
router.delete('/:userId/followers', handleErrorAsync(usersController.cleanFollowers));

module.exports = router;
