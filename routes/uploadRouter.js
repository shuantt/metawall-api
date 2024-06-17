const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController.js');
const { handleErrorAsync } = require('../utils/errorHandler.js');
const { authJwt } = require('../service/authService.js');
const upload = require('../service/uploadService.js');

router.post('/file', authJwt, upload, handleErrorAsync(uploadController.uploadImage)
    /*  #swagger.tags = ['Upload']
        #swagger.summary = '上傳單張圖片'
        #swagger.description = '上傳單張圖片'
        #swagger.security = [{"apiKeyAuth": []}]
        #swagger.parameters['file'] = {
            in: 'formData',
            description: '圖片',
            required: true,
            type: 'file'
        }
     */
);

module.exports = router;
