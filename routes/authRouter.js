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
                $email: 'newhulu@gmail.com',
                $password: 'Aa123456'
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
                $name: '祺貴人',
                $email: 'kiki@gmail.com',
                $password: 'Aa123456',
                $confirmPassword:'Aa123456'
            }
        }
    */
);

module.exports = router;
