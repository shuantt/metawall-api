// 根據環境設定 CORS 選項
function setCorsOptions(env) {
  let corsOptions;
  corsOptions = {
    origin: '*',
  };
  // if (env === 'production') {
  //   const whitelist = [
  //     'https://www.example.com', 
  //     'https://example.com',
  //     'http://127.0.0.1:3000',
  //     'http://localhost:3000'
  //   ];
  //   corsOptions = {
  //     origin: function (origin, callback) {
  //       if (whitelist.indexOf(origin) !== -1 || !origin) {
  //         callback(null, true);
  //       } else {
  //         callback(new Error('禁止CORS請求'));
  //       }
  //     },
  //   };
  // } else {
  //   corsOptions = {
  //     origin: '*',
  //   };
  // }

  return corsOptions;
}

module.exports = { setCorsOptions };
