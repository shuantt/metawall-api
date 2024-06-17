// 資料庫連線
const mongoose = require('mongoose');

// 資料庫連線
function connectDB(env) {
  const connectionStr = process.env.CONNECTION_STR;
  // console.log('環境: ', process.env.NODE_ENV, ' / connectionStr: ', connectionStr);
  mongoose
    .connect(connectionStr)
    .then(() => {
      console.log('連接資料庫成功');
    })
    .catch((err) => {
      console.log(err);
    });
}

module.exports = {
  connectDB,
};
