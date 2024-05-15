const multer = require('multer');
const path = require('path');
const { appError } = require('../utils/errorHandler.js');

const upload = multer({
    limits: { fileSize: 1024 * 1024 * 5 },
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png') {
            return cb(appError(400, '只接受 jpg, jpeg, png 圖片'));
        }
        cb(null, true);
    },
}).any();

module.exports = upload;

