const express = require('express');
const router = express.Router();
const followController = require('../controllers/followController');
const { handleErrorAsync } = require('../utils/errorHandler');
const { authJwt } = require('../service/authService');

// 查追蹤中名單
router.get('/:userId', authJwt, handleErrorAsync(followController.getFollowers));

// 追蹤用戶
router.post('/:userId/followings/:userId', handleErrorAsync(followController.followUser));

//取消追蹤用戶
router.delete('/:userId/followings/:userId', handleErrorAsync(followController.unfollowUser));

module.exports = router;
