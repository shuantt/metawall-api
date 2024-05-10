const dotenv = require('dotenv');

// 根據發布環境載入環境變數
function loadConfig(env) {
  if (env === 'production') {
    dotenv.config({ path: './prod.env' });
  } else {
    dotenv.config({ path: './dev.env' });
  }
}

module.exports = {
  loadConfig,
};
