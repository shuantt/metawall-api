const Follow = require('../models/followsModel');
const { sendSuccess, sendError } = require('../utils/responseHandler');
const { appError } = require('../utils/errorHandler');

const followController = {
  followUser: async (req, res, next) => {
    const { userId, followingId } = req.params;
    if (!userId || !followingId) {
      return next(appError(400, 'userId 和 followingId 不可為空'));
    }

    const result = await Follow.create({ user: userId, following: befollowerUserId });
    sendSuccess(res, 200, '追蹤成功', []);
  },
  unfollowUser: async (req, res, next) => {
    const { userId, followingId } = req.params;
    if (!userId || !followingId) {
      return next(appError(400, 'userId, followingId 不可為空'));
    }

    const result = await Follow.findOneAndDelete({ user: userId, following: followingId });
    sendSuccess(res, 200, '取消追蹤成功', []);
  },
};

module.exports = followController;
