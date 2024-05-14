const options = {
    autoHeaders:false
};

const swaggerAutogen = require('swagger-autogen')(options);

const doc = {
    info: {
        version: '1.0.0',
        title: 'Metawall API',
        description: 'Metawall API Documentation',
    },
    host: '127.0.0.1:3000',
    basePath: '/',
    schemes: ['http', 'https'],
    tags: [
        {
            name: 'Auth',
            description: '註冊、登入、登出 API'
        },
        {
            name: 'Users',
            description: '使用者相關 API，包含會員資料、追蹤、被追蹤等功能'
        },
        {
            name: 'Posts',
            description: '貼文相關 API，包含貼文、留言、貼文按讚等功能'
        }
    ],
    securityDefinitions: {
        apiKeyAuth: {
            type: 'apiKey',
            in: 'headers',
            name: 'Authorization',
            description: '請在取得的 token 前補上 "Bearer " 再送出(須包含一空白字元)，範例："Bearer {your token}"'
        }
    },
    definitions: {
        "成功訊息": {
            success: true,
            message: "成功訊息",
            data: [{ "key": "value" }]
        },
        "失敗訊息": {
            success: false,
            message: "錯誤訊息說明"
        }
    },
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./app.js'];

/* NOTE: If you are using the express Router, you must pass in the 'routes' only the 
root file where the route starts, such as index.js, app.js, routes.js, etc ... */

swaggerAutogen(outputFile, endpointsFiles, doc);