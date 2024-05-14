const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { handleErrorAsync } = require('../utils/errorHandler');

router.post('/signin', handleErrorAsync(authController.signIn)
    /*
        #swagger.tags = ['Auth']
        #swagger.summary = '登入'
        #swagger.description = '登入'
        #swagger.parameters['body'] = {
        in:'body',
        description: '登入資訊',
        required: true,
        schema: {
                $email: 'test@gmail.com',
                $password: 'Abc123456'
            }
        }
     */
);

router.post('/signup', handleErrorAsync(authController.signUp)
    /*
        #swagger.tags = ['Auth']
        #swagger.summary = '註冊'
        #swagger.description = '註冊'
        #swagger.parameters['body'] = {
        in:'body',
        description: '註冊資訊',
        required: true,
        schema: {
                $name: 'shuantisagenius',
                $email: 'shuantt@gmail.com',
                $password: 'A123456789',
                $confirmPassword:'A123456789'
            }
        }
    */
);

module.exports = router;
