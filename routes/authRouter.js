const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { handleErrorAsync } = require('../utils/errorHandler');

router.get('/signin', handleErrorAsync(authController.signIn));
router.post('/signup', handleErrorAsync(authController.signUp));

module.exports = router;
