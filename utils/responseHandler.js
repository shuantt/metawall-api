class BaseResponse {
  constructor(success = false, message = '', data = null, isOperational = false, stack = null) {
    this.success = success;
    this.message = message;
    if (success == true) {
      this.data = data;
    }
    if (success == false && process.env.NODE_ENV !== 'production') {
      this.isOperational = isOperational;
    }
    if (stack && process.env.NODE_ENV !== 'production') {
      this.stack = stack;
    }
  }

  static successResponse(message = '', data = []) {
    return new BaseResponse(true, message, data);
  }

  // err 來源於 errorHandler.js 的 appError 和 exceptionErr
  static errorResponse(err) {
    if (process.env.NODE_ENV === 'production') {
      if (err.isOperational) {
        return new BaseResponse(false, err.message);
      } else {
        return new BaseResponse(false, '系統錯誤，請聯繫客服人員');
      }
    } else {
      return new BaseResponse(false, err.message, null, err.isOperational, err.stack);
    }
  }
}

// 成功查詢並回傳資料內容
const sendSuccess = (res, httpStatus = 200, message = '', data = null) => {
  res.status(httpStatus).send(BaseResponse.successResponse(message, data));
};

// 回傳客戶端錯誤
const sendError = (res, err) => {
  res.status(err.httpStatus || 500).send(BaseResponse.errorResponse(err));
};

module.exports = {
  sendSuccess,
  sendError,
};
