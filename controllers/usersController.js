const mongoose = require('mongoose');
const User = require('../models/usersModel');
const Post = require('../models/postsModel');
const Follow = require('../models/followsModel');
const { sendSuccess } = require('../utils/responseHandler');
const { appError } = require('../utils/errorHandler');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const usersController = {
  getUsers: async (req, res, next) => {
    const users = await User.find().select('email name photo gender');
    sendSuccess(res, 200, '取得使用者成功', users);
  },

  getUser: async (req, res, next) => {
    const { userId } = req.params;
    const user = await User.findById(userId)
      .populate({
        path: 'followers',
        populate: { path: 'user', select: 'name photo' },
      })
      .populate({
        path: 'followings',
        populate: { path: 'following', select: 'name photo' },
      })
      .select('email name photo gender');

    if (!user) {
      return next(appError(400, '找不到使用者'));
    }

    sendSuccess(res, 200, '取得使用者成功', user);
  },

  resetPassword: async (req, res, next) => {
    let { userId } = req.user;
    let { password, confirmPassword } = req.body;

    if (!password || !confirmPassword) {
      return next(appError(400, '請填寫完整資料'));
    }

    if (password !== confirmPassword) {
      return next(appError(400, '密碼不一致'));
    }

    if (validator.isLength(password, { min: 8, max: 20 }) === false) {
      return next(appError(400, '密碼長度需在8-20字元'));
    }

    const user = await User.findById(userId);

    if (!user) {
      return next(appError(400, '找不到使用者'));
    }

    password = await bcrypt.hash(password, 12);

    const updatePassword = await User.findByIdAndUpdate(
      userId,
      { password: password },
      { new: true }
    );

    sendSuccess(res, 200, '密碼修改成功');
  },

  updateProfile: async (req, res, next) => {
    const { userId } = req.user;
    let { name, photo, gender } = req.body;

    // if (!name || !photo || !gender) {
    //   return next(appError(400, 'name 為必填'));
    // }

    const user = await User.findById(userId);

    if (!user) {
      return next(appError(400, '找不到使用者'));
    }

    const updateUser = await User.findByIdAndUpdate(
      userId,
      { name: name, photo: photo, gender: gender },
      { new: true }
    ).select('name photo gender');

    sendSuccess(res, 200, '更新使用者資料成功', updateUser);
  },

  getUserPosts: async (req, res, next) => {
    const { userId } = req.params;

    const userPosts = await Post.find({ user: userId })
      .populate({ path: 'user' })
      .populate({ path: 'comments' })
      .populate({ path: 'likes' });

    if (userPosts.length === 0) {
      return next(appError(400, '用戶尚未發布任何貼文'));
    }
    else {
      sendSuccess(res, 200, '取得使用者貼文成功', userPosts);
    }
  },

  getFollowers: async (req, res, next) => {
    const { userId } = req.params;
    if (!userId) {
      return next(appError(400, '請輸入會員ID'));
    }

    const followers = await User.findById(userId)
      .populate(
        {
          path: 'followers',
          populate: { path: 'user', select: 'name photo' }
        }
      ).select('name followers');

    sendSuccess(res, 200, '取得追隨者資料', followers);
  },

  getFollowings: async (req, res, next) => {
    const { userId } = req.params;

    if (!userId) {
      return next(appError(400, '請輸入會員ID'));
    }

    const followings = await User.findById(userId)
      .populate({
        path: 'followings',
        populate: { path: 'following', select: '_id name photo' },
      }).select('name followings');

    sendSuccess(res, 200, '取得用戶追蹤資料', followings);
  },

  followUser: async (req, res, next) => {
    const { userId } = req.user;
    const { targetUserId } = req.params;

    if (!userId || !targetUserId) {
      return next(appError(400, 'userId 和 targetUserId 不可為空'));
    }

    if (userId === targetUserId) {
      return next(appError(400, '無法追蹤自己'));
    }

    const result = await Follow.create({ user: userId, following: targetUserId });

    if (!result) {
      return next(appError(400, '追蹤失敗'));
    } else {
      sendSuccess(res, 200, '追蹤成功', []);
    }
  },

  unfollowUser: async (req, res, next) => {
    const { userId } = req.user;
    const { targetUserId } = req.params;

    if (!userId || !targetUserId) {
      return next(appError(400, 'userId, targetUserId 不可為空'));
    }

    const following = await Follow.findOne({ user: userId, following: targetUserId });

    if (!following) {
      return next(appError(400, '未追蹤此用戶'));
    }

    const result = await Follow.findOneAndDelete({ user: userId, following: targetUserId });

    if (!result) {
      return next(appError(400, '取消追蹤失敗'));
    } else {
      sendSuccess(res, 200, '取消追蹤成功', []);
    }
  },

  // deleteUsers: async (req, res, next) => {
  //   let { userId } = req.user;
  //   const isAdmin = await User.findById(userId).select('isAdmin');
  //   if (!isAdmin) {
  //     return next(appError(400, '無刪除權限'));
  //   }
  //   const deleteResult = await User.deleteMany({});
  //   sendSuccess(res, 200, '刪除所有使用者成功', []);
  // },

  deleteUser: async (req, res, next) => {
    const { userId } = req.user;

    const user = await User.findById(userId);

    if (!user) {
      return next(appError(400, '找不到會員'));
    }

    await User.findByIdAndDelete(userId);
    sendSuccess(res, 200, '已刪除會員', []);
  },

  deleteUserAdmin: async (req, res, next) => {
    const { userId } = req.user;
    const { targetUserId } = req.params;

    if (!targetUserId) {
      return next(appError(400, '請輸入欲刪除會員 Id'));
    }

    const user = await User.findById(targetUserId);

    if (!user) {
      return next(appError(400, '找不到會員'));
    }

    if (userId !== targetUserId && user.role !== 'admin') {
      return next(appError(400, '無刪除權限'));
    }

    await User.findByIdAndDelete(targetUserId);
    sendSuccess(res, 200, '已刪除會員', []);
  }
};


module.exports = usersController;
