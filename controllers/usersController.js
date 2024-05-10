const User = require('../models/usersModel');
const Post = require('../models/postsModel');
const Follow = require('../models/followsModel');
const { sendSuccess } = require('../utils/responseHandler');
const { appError } = require('../utils/errorHandler');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

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
    let { userId } = req.params;
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
    const { updateUserId } = req.params;
    const { userId } = req.user.userId;

    if (updateUserId !== userId) {
      return next(appError(400, '不可修改其他使用者資料'));
    }
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
    console.log(updateUser)
    sendSuccess(res, 200, '更新使用者資料成功', updateUser);
  },

  getUserPosts: async (req, res, next) => {
    const { userId } = req.params;
    const posts = await Post.find({ user: userId }).populate({
      path: 'user',
    });
    sendSuccess(res, 200, posts.length === 0 ? "使用者無貼文" : '取得使用者貼文成功', posts);
  },

  getFollowers: async (req, res, next) => {
    const { userId } = req.params;
    if (!userId) {
      return next(appError(400, '請輸入會員ID'));
    }
    const user = await User.findById(userId)
      .populate({
        path: 'followers',
        populate: { path: 'user', select: 'name photo' },
      })
      .select('name');
    sendSuccess(res, 200, '取得追隨者資料', user);
  },

  getFollowings: async (req, res, next) => {
    const { userId } = req.params;
    if (!userId) {
      return next(appError(400, '請輸入會員ID'));
    }

    const user = await User.findById(userId)
      .populate({
        path: 'followings',
        populate: { path: 'following', select: 'name photo' },
      })
      .select('name');
    sendSuccess(res, 200, '取得用戶追蹤資料', user.followings);
  },
  deleteUsers: async (req, res, next) => {
    let { userId } = req.user;
    const isAdmin = await User.findById(userId).select('isAdmin');
    if (!isAdmin) {
      return next(appError(400, '無刪除權限'));
    }
    const deleteResult = await User.deleteMany({});
    sendSuccess(res, 200, '刪除所有使用者成功', []);
  },

  deleteUser: async (req, res, next) => {
    console.log(req.user)
    const { userId } = req.user;
    const { targetUserId } = req.params;
    const user = await User.findById(userId).select('role');

    if (!targetUserId) {
      return next(appError(400, '請輸入欲刪除會員 Id'));
    }

    if (userId !== targetUserId && user.role !== 'admin') {
      return next(appError(400, '無刪除權限'));
    }

    const deactivateAccount = await User.findByIdAndUpdate(userId, { isActive: false }, { new: true });

    sendSuccess(res, 200, '已停用帳號', []);
  }
};

module.exports = usersController;
