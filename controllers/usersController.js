const User = require('../models/usersModel');
const Post = require('../models/postsModel');
const Follow = require('../models/followsModel');
const { sendSuccess } = require('../utils/responseHandler');
const { appError } = require('../utils/errorHandler');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const usersController = {
  // 註冊
  signUp: async (req, res, next) => {
    let { name, email, password, confirmPassword, adminPassword } = req.body;
    if (!name || !email || !password || !confirmPassword) {
      return next(appError(400, 'name, email, password, confirmPassword 不可為空'));
    }

    if (password !== confirmPassword) {
      return next(appError(400, '密碼不一致'));
    }

    if (validator.isEmail(email) === false) {
      return next(appError(400, 'Email格式錯誤'));
    }

    if (validator.isLength(password, { min: 8, max: 20 }) === false) {
      return next(appError(400, '密碼長度需在8-20字元'));
    }


    // 檢查 email 是否已經註冊
    const user = await User.findOne({ email });
    if (user) {
      return next(appError(400, 'Email已註冊'));
    }

    //jwt加密
    password = await bcrypt.hash(password, 12);

    // 建立使用者
    const newUser = await User.create({
      name: name,
      email: email,
      password: password,
    });

    const token = generateJwt(newUser);
    const rtnUserData = { userId: newUser._id, name: newUser.name, token: token };

    sendSuccess(res, 200, '註冊成功', rtnUserData);
  },

  // 登入
  signIn: async (req, res, next) => {
    let { email, password } = req.body;

    if (!email || !password) {
      return next(appError(400, 'email, password 不可為空'));
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return next(appError(400, 'email 未註冊'));
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return next(appError(400, '密碼錯誤'));
    }

    const token = generateJwt(user);
    const rtnUserData = { name: user.name, token: token };

    sendSuccess(res, 200, '登入成功', rtnUserData);
  },

  // 取得全部使用者
  getUsers: async (req, res, next) => {
    const users = await User.find().select('email name photo gender');
    sendSuccess(res, 200, '取得使用者成功', users);
  },

  // 取得使用者
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

  // 修改密碼
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

  // 修改使用者資料
  updateProfile: async (req, res, next) => {
    const { userId } = req.user;
    let { name, photo, gender } = req.body;

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

  // 取得使用者貼文
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

  // 取得追隨者
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

  // 取得追蹤中
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

  // 追蹤用戶
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

  // 取消追蹤
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

  // 刪除使用者
  deleteUser: async (req, res, next) => {
    const { userId } = req.user;

    const user = await User.findById(userId);

    if (!user) {
      return next(appError(400, '找不到會員'));
    }

    await User.findByIdAndDelete(userId);
    sendSuccess(res, 200, '已刪除會員', []);
  },

  // 管理員刪除使用者
  deleteUserAdmin: async (req, res, next) => {
    const { userId } = req.user;
    const { targetUserId } = req.params;

    if (user.role !== 'admin'){
      return next(appError(400, '無刪除權限'));
    }

    if (!targetUserId) {
      return next(appError(400, '請輸入欲刪除會員 Id'));
    }

    const user = await User.findById(targetUserId);

    if (!user) {
      return next(appError(400, '找不到會員'));
    }

    if (userId !== targetUserId) {
      return next(appError(400, '無刪除權限'));
    }

    await User.findByIdAndDelete(targetUserId);
    sendSuccess(res, 200, '已刪除會員', []);
  }
};

module.exports = usersController;
