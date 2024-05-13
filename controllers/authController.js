const User = require('../models/usersModel');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { sendSuccess } = require('../utils/responseHandler');
const { appError } = require('../utils/errorHandler');
const { generateJwt } = require('../service/authService');

const authController = {
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
    const rtnUserData = { userId:newUser._id , name: newUser.name, token: token };

    sendSuccess(res, 200, '註冊成功', rtnUserData);
  },
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
};

module.exports = authController;
