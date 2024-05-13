const Post = require('../models/postsModel.js');
const User = require('../models/usersModel');
const Comment = require('../models/commentsModel.js');
const Like = require('../models/likesModel.js');
const { sendSuccess, sendError } = require('../utils/responseHandler.js');
const { appError } = require('../utils/errorHandler.js');

const postsController = {
  getAllPosts: async (req, res, next) => {
    let search = {};
    let size = 100; //上限100筆 (之後要改成 cursor 分頁)

    // if (req.query.userName) {
    //   query['userInfo.userName'] = req.query.userName;
    // }

    if (req.query.startTime && req.query.endTime) {
      search.createdAt = { $gte: req.query.startTime, $lte: req.query.endTime };
    }

    if (req.query.name) {
      search.name = req.query.name;
    }

    if (req.query.keyword) {
      search.content = { $regex: req.query.keyword, $options: 'i', };
    }

    if (req.query.size) {
      size = parseInt(req.query.size) > 100 ? 100 : parseInt(req.query.size);
    }

    const posts = await Post.find(search)
      .populate({ path: 'user' })
      .populate({ path: 'comments' })
      .populate({ path: 'likes' })
      .sort(req.query.sort === 'asc' ? { createdAt: 1 } : { createdAt: -1 })
      .limit(size);

    sendSuccess(res, 200, '取得貼文成功', posts);
  },

  getPost: async (req, res, next) => {
    let { postId } = req.params;
    console.log(postId)
    const post = await Post.findById(postId)
      .populate({ path: 'user' })
      .populate({ path: 'comments' })
      .populate({ path: 'likes' });

    if (!post) {
      return next(appError(404, '查無此貼文'));
    }

    sendSuccess(res, 200, '取得貼文成功', post);
  },

  createPost: async (req, res, next) => {
    let { content, image } = req.body;
    let userId = req.user.userId;

    if (!content || !userId) {
      return next(appError(400, '會員 id 和 貼文內容 為必填欄位'));
    }

    const newPost = { user: userId, content: content, image: image };
    const result = await Post.create(newPost, { new: true });

    if (!result) {
      return next(appError(400, '新增貼文失敗'));
    } else {
      sendSuccess(res, 200, '新增貼文成功', result);
    }
  },

  updatePost: async (req, res, next) => {
    let { postId } = req.params;
    let { content, image } = req.body;
    let update = {};
    const post = await Post.findById(postId);

    if (!post) {
      return next(appError(404, '查無此貼文'));
    }

    if (content) {
      update.content = content;
    }

    if (image) {
      update.image = image;
    }

    const result = await Post.findByIdAndUpdate(postId, update, { new: true });

    if (!result) {
      return next(appError(400, '更新貼文失敗'));
    } else {
      sendSuccess(res, 200, '更新貼文成功', result);
    }
  },

  // deletePosts: async (req, res, next) => {
  //   if (req.path === '/') {
  //     return next(appError(res, 400, '欲刪除全部貼文請刪除路由末端斜線，欲刪除單筆貼文需提供 postId'));
  //   }
  //   const deleteResult = await Post.deleteMany({});
  //   sendSuccess(res, 200, '刪除全部貼文成功', deleteResult);
  // },

  deletePost: async (req, res, next) => {
    let { postId } = req.params;
    let { userId } = req.user;

    const post = await Post.findById(postId);

    if (!post) {
      return next(appError(404, '查無此貼文'));
    }

    const postOwner = post.user._id.toString();

    if (postOwner !== userId) {
      return next(appError(400, '無刪除權限'));
    }

    const result = await Post.findByIdAndDelete(req.params.id);
    if (!result) {
      return next(appError(400, '刪除貼文失敗'));
    }
    else {
      sendSuccess(res, 200, '刪除貼文成功', result);
    }
  },

  createComment: async (req, res, next) => {
    let { postId } = req.params;
    let { userId } = req.user;
    let { content } = req.body;

    if (!content) {
      return next(appError(400, 'content 為必填欄位'));
    }

    const post = await Post.findById(postId);

    if (!post) {
      return next(appError(404, '查無此貼文'));
    }

    const newComment = { post: postId, user: userId, content: content };
    const result = await Comment.create(newComment);

    if (!result) {
      return next(appError(400, '新增留言失敗'));
    } else {
      sendSuccess(res, 200, '新增留言成功', result);
    }
  },

  updateComment: async (req, res, next) => {
    let { postId, commentId } = req.params;
    let { content } = req.body;

    const post = await Post.findById(postId);

    if (!post) {
      return next(appError(404, '查無此貼文'));
    }

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return next(appError(404, '查無此留言'));
    }

    const result = await Comment.findByIdAndUpdate(commentId, { content: content }, { new: true });

    if (!result) {
      return next(appError(404, '更新留言失敗'));
    } else {
      sendSuccess(res, 200, '更新留言成功', result);
    }
  },

  deleteComment: async (req, res, next) => {
    let { userId } = req.user;
    let { postId, commentId } = req.params;

    const post = await Post.findById(postId);

    if (!post) {
      return next(appError(404, '查無此貼文'));
    }

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return next(appError(404, '查無此留言'));
    }

    const commentOwner = comment.user._id.toString();

    if (commentOwner !== userId) {
      return next(appError(400, '無刪除權限'));
    }

    const result = await Comment.findByIdAndDelete(commentId);
    if (!result) {
      return next(appError(404, '刪除留言失敗'));
    }
    else {
      sendSuccess(res, 200, '刪除留言成功', []);
    }
  },

  likePost: async (req, res, next) => {
    let { postId } = req.params;
    let { userId } = req.user;

    const post = await Post.findById(postId);

    if (!post) {
      return next(appError(404, '查無此貼文'));
    }

    const like = await Like.findOne({ user: userId, post: postId });

    if (like) {
      return next(appError(400, '已對此貼文按過讚'));
    }

    const result = await Like.create({ user: userId, post: postId });
    if (!result) {
      return next(appError(400, '按讚失敗'));
    } else {
      sendSuccess(res, 200, '按讚成功', result);
    }
  },

  unlikePost: async (req, res, next) => {
    let { postId } = req.params;
    let { userId } = req.user;

    const post = await Post.findById(postId);

    if (!post) {
      return next(appError(404, '查無此貼文'));
    }

    const like = await Like.findOne({ user: userId, post: postId });

    if (!like) {
      return next(appError(400, '尚未按讚，無法取消'));
    }

    const result = await Like.findByIdAndDelete(like._id);
    if (!result) {
      return next(appError(400, '取消按讚失敗'));
    }
    else {
      sendSuccess(res, 200, '取消按讚成功', result);
    }
  },
};

module.exports = postsController;