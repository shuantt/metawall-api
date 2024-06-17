const express = require('express');
const router = express.Router();
const postController = require('../controllers/postsController.js');
const { handleErrorAsync } = require('../utils/errorHandler.js');
const { authJwt } = require('../service/authService.js');

// 驗證 JWT Token
// router.use(authJwt);

// 貼文相關 API
router.get('/', handleErrorAsync(postController.getAllPosts)
    /*
        #swagger.tags = ['Posts']
        #swagger.summary = '取得所有貼文'
        #swagger.description = '取得所有貼文'
        #swagger.parameters['keyword'] = {
            in: 'query',
            description: '查詢貼文官內容關鍵字',
            required: false,
            type: 'string'
        }
        #swagger.parameters['startTime'] = {
            in: 'query',
            description: '查詢貼文發布時間，開始時間',
            required: false,
            type: 'string',
            format: 'date-time'
        }
        #swagger.parameters['endTime'] = {
            in: 'query',
            description: '查詢貼文發布時間，結束時間',
            required: false,
            type: 'string',
            format: 'date-time'
        }
        #swagger.parameters['size'] = {
            in: 'query',
            description: '查詢貼文數量，上限 100 筆，預設 100 筆',
            required: false,
            type: 'integer',
            maximum: 100
        }
        #swagger.parameters['sort'] = {
            in: 'query',
            description: '發文時間排序方式，預設 desc 降冪排序',
            required: false,
            type: 'string',
            enum: ['asc', 'desc']
        }
    */
);

router.get('/:postId', handleErrorAsync(postController.getPost)
    /*
        #swagger.tags = ['Posts']
        #swagger.summary = '取得特定貼文'
        #swagger.description = '取得特定貼文'
        #swagger.parameters['postId'] = {
            in: 'path',
            description: '貼文 id',
            required: true,
            type: 'string'
        }
     */
);

router.post('/', authJwt, handleErrorAsync(postController.createPost)
    /*
        #swagger.tags = ['Posts']
        #swagger.summary = '新增貼文'
        #swagger.description = '新增貼文'
        #swagger.security = [{"apiKeyAuth": []}]
        #swagger.parameters['body'] = {
            in:'body',
            description: '新增貼文資訊',
            required: true,
            schema: {
                $content: '哈囉，你好嗎~~~',
                image: 'https://metawall/image2'
            }
        }
     */
);

router.patch('/:postId', authJwt, handleErrorAsync(postController.updatePost)
    /*
        #swagger.tags = ['Posts']
        #swagger.summary = '更新貼文'
        #swagger.description = '更新貼文'
        #swagger.security = [{"apiKeyAuth": []}]
        #swagger.parameters['body'] = {
        in:'body',
        description: '更新貼文資訊',
        required: true,
        schema: {
                content: '小智是個大渣男!',
                image: 'img-url2'
            }
        }
    */
);


router.delete('/:postId', authJwt, handleErrorAsync(postController.deletePost)
    /*
        #swagger.tags = ['Posts']
        #swagger.summary = '刪除特定貼文'
        #swagger.description = '刪除特定貼文'
        #swagger.security = [{"apiKeyAuth": []}]
        #swagger.parameters['postId'] = {
            in: 'path',
            description: '貼文 id',
            required: true,
            type: 'string'
        }
    */
);

// 留言相關 API
router.post('/:postId/comments', authJwt, handleErrorAsync(postController.createComment)
    /*
        #swagger.tags = ['Posts']
        #swagger.summary = '新增留言'
        #swagger.description = '新增留言'
        #swagger.security = [{"apiKeyAuth": []}]
        #swagger.parameters['postId'] = {
            in: 'path',
            description: '貼文 id',
            required: true,
            type: 'string'
        }
        #swagger.parameters['body'] = {
            in:'body',
            description: '新增留言資訊',
            required: true,
            schema: {
                $content: '小智是個大渣男!',
                image: 'https://metawall/image2'
            }
        }
    */
);

// 更新留言
router.patch('/:postId/comments/:commentId', authJwt, handleErrorAsync(postController.updateComment)
    /*
        #swagger.tags = ['Posts']
        #swagger.summary = '更新留言'
        #swagger.description = '更新留言'
        #swagger.security = [{"apiKeyAuth": []}]
        #swagger.parameters['postId'] = {
            in: 'path',
            description: '貼文 id',
            required: true,
            type: 'string'
        }
        #swagger.parameters['commentId'] = {
            in: 'path',
            description: '留言 id',
            required: true,
            type: 'string'
        }
        #swagger.parameters['body'] = {
            in:'body',
            description: '更新留言資訊',
            required: true,
            schema: {
                $content: '小智是個大渣男!'
            }
        }
    */
);

router.delete('/:postId/comments/:commentId', authJwt, handleErrorAsync(postController.deleteComment)
    /*
        #swagger.tags = ['Posts']
        #swagger.summary = '刪除特定留言'
        #swagger.description = '刪除特定留言'
        #swagger.security = [{"apiKeyAuth": []}]
        #swagger.parameters['postId'] = {
            in: 'path',
            description: '貼文 id',
            required: true,
            type: 'string'
        }
        #swagger.parameters['commentId'] = {
            in: 'path',
            description: '留言 id',
            required: true,
            type: 'string'
        }
    */
);


// 按讚相關 API
router.post('/:postId/likes', authJwt, handleErrorAsync(postController.likePost)
    /*
        #swagger.tags = ['Posts']
        #swagger.summary = '貼文按讚'
        #swagger.description = '貼文按讚'
        #swagger.security = [{"apiKeyAuth": []}]
        #swagger.parameters['postId'] = {
            in: 'path',
            description: '貼文 id',
            required: true,
            type: 'string'
        }
    */
);

router.delete('/:postId/likes', authJwt, handleErrorAsync(postController.unlikePost)
    /*
        #swagger.tags = ['Posts']
        #swagger.summary = '取消貼文按讚'
        #swagger.description = '取消貼文按讚'
        #swagger.security = [{"apiKeyAuth": []}]
        #swagger.parameters['postId'] = {
            in: 'path',
            description: '貼文 id',
            required: true,
            type: 'string'
        }
    */
);

module.exports = router;
