const jwt = require('jsonwebtoken');
const { appError, handleErrorAsync } = require('../utils/errorHandler');
const User = require('../models/usersModel');

// 產生 JWT Token
const generateJwt = function generateJwt(user) {
  const token = jwt.sign(
    { id: user._id, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_DAY }
  );
  return token;
};

// 驗證 JWT Token
const authJwt = handleErrorAsync(async (req, res, next) => {
  let token = null;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return next(appError(401, '未登入，請重新登入 '));
  }

  const decoded = await new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
      if (err) {
        reject(err);
        return next(appError(401, '使用者驗證失敗，請重新登入'));
      }
      resolve(payload);
    });
  });
  
  const user = await User.findById(decoded.id).select('_id name');
  
  if (!user) {
    return next(appError(401, '使用者不存在，請重新登入'));
  }

  if(user.isActive === false) {
    return next(appError(401, '使用者已停用，請重新登入'));
  }

  const userId = user._id.toString();
  const name = user.name;
  req.user = { userId, name };
  return next();
});

module.exports = {
  generateJwt,
  authJwt,
};
