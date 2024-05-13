const express = require('express');
const router = express.Router();
const postController = require('../controllers/postsController.js');
const { handleErrorAsync } = require('../utils/errorHandler.js');
const { authJwt } = require('../service/authService.js');

// 驗證 JWT Token
// router.use(authJwt);

// 貼文相關 API
router.get('/', authJwt, handleErrorAsync(postController.getAllPosts));
router.get('/:postId', authJwt, handleErrorAsync(postController.getPost));
router.post('/', authJwt, handleErrorAsync(postController.createPost));
router.patch('/:postId', authJwt, handleErrorAsync(postController.updatePost));
router.delete('/:postId', authJwt, handleErrorAsync(postController.deletePost));
// router.delete('/', authJwt, handleErrorAsync(postController.deletePosts));

// 留言相關 API
router.post('/:postId/comments', authJwt, handleErrorAsync(postController.createComment));
router.patch('/:postId/comments/:commentId', authJwt, handleErrorAsync(postController.updateComment));
router.delete('/:postId/comments/:commentId', authJwt, handleErrorAsync(postController.deleteComment));

// 按讚相關 API
router.post('/:postId/likes', authJwt, handleErrorAsync(postController.likePost));
router.delete('/:postId/likes', authJwt, handleErrorAsync(postController.unlikePost));

module.exports = router;
