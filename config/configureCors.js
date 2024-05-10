// 根據環境設定 CORS 選項
function setCorsOptions(env) {
  let corsOptions;
  if (env === 'production') {
    const whitelist = ['https://www.example.com', 'https://example.com'];
    corsOptions = {
      origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1 || !origin) {
          callback(null, true);
        } else {
          callback(new Error('禁止CORS請求'));
        }
      },
    };
  } else {
    corsOptions = {
      origin: '*',
    };
  }

  return corsOptions;
}

module.exports = { setCorsOptions };
