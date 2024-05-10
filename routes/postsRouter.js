const express = require('express');
const router = express.Router();
const postController = require('../controllers/postsController.js');
const { handleErrorAsync } = require('../utils/errorHandler.js');
const { authJwt } = require('../service/authService.js');

// 驗證 JWT Token
// router.use(authJwt);

// 取得所有貼文
router.get('/', authJwt, handleErrorAsync(postController.getAllPosts));

// 取得單一貼文
router.get('/:postId', authJwt, handleErrorAsync(postController.getPost));

// 新增貼文
router.post('/', authJwt, handleErrorAsync(postController.createPost));

// 更新貼文
router.patch('/:postId', authJwt, handleErrorAsync(postController.updatePost));

// 刪除貼文
router.delete('/:postId', authJwt, handleErrorAsync(postController.deletePost));

// 刪除全部貼文
router.delete('/', authJwt, handleErrorAsync(postController.deletePosts));

// 貼文留言
router.post('/:postId/comments', authJwt, handleErrorAsync(postController.createPost));

// 貼文按讚
router.post('/:postId/likes', authJwt, handleErrorAsync(postController.createPost));

module.exports = router;
