const firebaseConnection = require('../connections/firebaseConnection.js');
const { appError } = require('../utils/errorHandler.js');
const { sendSuccess } = require('../utils/responseHandler.js');
const { v4: uuidv4 } = require('uuid');
const firebaseAdmin = require('../connections/firebaseConnection.js');
const bucket = firebaseAdmin.storage().bucket();

const uploadController = {
    // 上傳圖片
    uploadImage: async (req, res, next) => {
        if (!req.files) {
            return next(appError(400, '請上傳圖片', next));
        }

        const file = req.files[0];
        const blob = bucket.file(`images/${uuidv4()}.${file.originalname.split('.').pop()}`);
        const blobStream = blob.createWriteStream({
            metadata: {
                contentType: file.mimetype,
            },
        });

        blobStream.on('error', (err) => {
            return next(appError(500, '圖片上傳失敗', next));
        });

        blobStream.on('finish', () => {
            const config = {
                action: 'read',
                expires: '03-01-2500',
            };
            blob.getSignedUrl(config, (err, url) => {
                if (err) {
                    return next(appError(500, '圖片上傳失敗', next));
                }
                sendSuccess(res, 200, "圖片上傳成功", { imageUrl: url });
            });
        });

        blobStream.end(file.buffer);
    }
};

module.exports = uploadController;