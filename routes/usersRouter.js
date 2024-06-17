var express = require('express');
var router = express.Router();
const usersController = require('../controllers/usersController.js');
const { handleErrorAsync } = require('../utils/errorHandler.js');
const { authJwt } = require('../service/authService.js');

// 會員相關 API
router.get('/', handleErrorAsync(usersController.getUsers)
    /*  #swagger.tags = ['Users']
        #swagger.summary = '取得所有會員'
        #swagger.description = '取得所有會員' 
     */
);

router.get('/:userId', handleErrorAsync(usersController.getUser)
    /*  #swagger.tags = ['Users']
        #swagger.summary = '取得特定會員'
        #swagger.description = '取得特定會員' 
        #swagger.parameters['userId'] = { 
            in: 'path',
            description: '會員 ID',
            required: true,
            type: 'string'
        }
     */
);

router.patch('/me/profile', authJwt, handleErrorAsync(usersController.updateProfile)
    /*  #swagger.tags = ['Users']
        #swagger.summary = '更新會員資料'
        #swagger.description = '更新會員資料' 
        #swagger.security = [{"apiKeyAuth": []}]
        #swagger.parameters['body'] = {
            in: 'body',
            description: '會員資料',
            required: true,
            schema: { 
                $name: 'shuantt',
                photo: 'url',
                gender: 'female',
            }
        }
     */
);

router.patch('/me/password', authJwt, handleErrorAsync(usersController.resetPassword)
    /*  #swagger.tags = ['Users']
        #swagger.summary = '重設密碼'
        #swagger.description = '重設密碼'
        #swagger.security = [{"apiKeyAuth": []}] 
        #swagger.parameters['body'] = {
            in: 'body',
            description: '新密碼',
            required: true,
            schema: { 
                $password: '123456'
            }
        }
     */
);

// router.delete('/', authJwt, handleErrorAsync(usersController.deleteUsers));

router.delete('/me', authJwt, handleErrorAsync(usersController.deleteUser)
    /*  #swagger.tags = ['Users']
        #swagger.summary = '刪除會員'
        #swagger.description = '刪除會員' 
        #swagger.security = [{"apiKeyAuth": []}]
     */
);


router.delete('/:userId', authJwt, handleErrorAsync(usersController.deleteUserAdmin)
    /*  #swagger.tags = ['Users']
        #swagger.summary = '刪除特定會員'
        #swagger.description = '刪除會員，需 admin 帳號權限' 
        #swagger.security = [{"apiKeyAuth": []}]
        #swagger.parameters['userId'] = { 
            in: 'path',
            description: '會員 ID',
            required: true,
            type: 'string'
        }
     */
);

router.get('/:userId/posts', handleErrorAsync(usersController.getUserPosts)
    /*  #swagger.tags = ['Users']
        #swagger.summary = '取得特定會員貼文'
        #swagger.description = '取得特定會員貼文' 
        #swagger.parameters['userId'] = { 
            in: 'path',
            description: '會員 ID',
            required: true,
            type: 'string'
        }
     */
);

// 追蹤相關 API
router.get('/:userId/followers', handleErrorAsync(usersController.getFollowers)
    /*  #swagger.tags = ['Users']
        #swagger.summary = '取得跟隨者名單'
        #swagger.description = '取得跟隨者名單' 
        #swagger.parameters['userId'] = { 
            in: 'path',
            description: '會員 ID',
            required: true,
            type: 'string' 
        }
     */
);

router.get('/:userId/followings', handleErrorAsync(usersController.getFollowings)
    /*  #swagger.tags = ['Users']
        #swagger.summary = '取得追蹤中名單'
        #swagger.description = '取得追蹤中名單' 
        #swagger.parameters['userId'] = { 
            in: 'path',
            description: '會員 ID',
            required: true,
            type: 'string'    
        }
     */
);

router.post('/me/followings/:targetUserId', authJwt, handleErrorAsync(usersController.followUser)
    /*  #swagger.tags = ['Users']
        #swagger.summary = '追蹤會員'
        #swagger.description = '追蹤會員' 
        #swagger.security = [{"apiKeyAuth": []}]
        #swagger.parameters['targetUserId'] = { 
            in: 'path',
            description: '追蹤對象會員 ID',
            required: true,
            type: 'string'
        }
     */
);

router.delete('/me/followings/:targetUserId', authJwt, handleErrorAsync(usersController.unfollowUser)
    /*  #swagger.tags = ['Users']
        #swagger.summary = '取消追蹤會員'
        #swagger.description = '取消追蹤會員' 
        #swagger.security = [{"apiKeyAuth": []}]
        #swagger.parameters['targetUserId'] = { 
            in: 'path',
            description: '取消追蹤對象會員 ID',
            required: true,
            type: 'string'
        }
     */
);

module.exports = router;
