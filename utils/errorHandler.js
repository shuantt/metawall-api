// 統一處理 Error 物件內容
const appError = (httpStatus, errMessage) => {
  error = new Error(errMessage);
  error.httpStatus = httpStatus;
  error.isOperational = true;
  return error;
};

// 統一處理例外錯誤的 Error 物件內容, 如為可預期設定 isOperational 為 true
const exceptionError = (error) => {
  if (process.env.NODE_ENV === 'production') {
    if (error.name === 'ValidationError') {
      // 資料庫錯誤
      error.message = '資料欄位錯誤，請重新輸入';
      error.httpStatus = 400;
      error.isOperational = true;
    } else if (error.name === 'TokenExpiredError') {
      error.message = '登錄已過期，請重新登入';
      error.httpStatus = 401;
      error.isOperational = true;
    } else {
      // 例外錯誤
      error.message = '伺服器錯誤，請聯繫客服人員';
      error.httpStatus = 500;
      error.isOperational = false;
    }
  } else {
    // dev 錯誤不做特別處理
    error.httpStatus = 500;
    error.isOperational = false;
  }
  return error;
};

// func 需帶入 async function
// 因 async 本身是 promise，所以可使用 catch 去捕捉錯誤
// handleErrorAsync 會統一幫帶入的 async function 接上 catch，並且將錯誤交給 next middleware 處理
// 因為帶 error 物件，所以下一個 middleware 會進入 app.js 的錯誤處理
const handleErrorAsync = function handleErrorAsync(func) {
  return function (req, res, next) {
    func(req, res, next).catch(
      function (error) {
        return next(exceptionError(error));
    });
  };
};

module.exports = {
  appError,
  exceptionError,
  handleErrorAsync,
};
