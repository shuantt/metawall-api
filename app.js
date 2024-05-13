const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const { loadConfig } = require('./config/configLoader');
const { connectDB } = require('./database/dbConnection');
const { setCorsOptions } = require('./config/configureCors');
const { sendError } = require('./utils/responseHandler');
const { appError, exceptionError } = require('./utils/errorHandler');

// 載入路由
const indexRouter = require('./routes/indexRouter');
const authRouter = require('./routes/authRouter'); // 登入、註冊、登出
const usersRouter = require('./routes/usersRouter'); // 會員、追蹤、被追蹤
const postsRouter = require('./routes/postsRouter'); // 貼文、留言、按讚

// 載入設定檔
loadConfig(process.env.NODE_ENV);

// 連接資料庫
connectDB(process.env.NODE_ENV);

// 處理未捕捉到的錯誤
process.on('uncaughtException', function (err) {
  console.log('Caught exception');
  console.log(err);
  process.exit(1);
});

const app = express();

// 中介軟體
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors(setCorsOptions(process.env.NODE_ENV)));

// 註冊路由
app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/users', usersRouter);
app.use('/posts', postsRouter);

app.use((req, res, next) => {
  sendError(res, appError(404, '無此路由'));
});

// 錯誤處理
app.use(function (err, req, res, next) {
  sendError(res, err);
});

// 未捕捉到的 catch 錯誤
process.on('unhandledRejection', (reason, promise) => {
  console.error('未捕捉到的 rejection：', promise, '原因：', reason);
});

module.exports = app;
