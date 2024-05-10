const Post = require('../models/postsModel.js');
const User = require('../models/usersModel');
const { sendSuccess, sendError } = require('../utils/responseHandler.js');
const { appError } = require('../utils/errorHandler.js');

const postsController = {
  getAllPosts: async (req, res, next) => {
    let query = {};
    let size = 100; //上限100筆

    if (req.query.userName) {
      query['userInfo.userName'] = req.query.userName;
    }

    if (req.query.startTime && req.query.endTime) {
      query.createdAt = { $gte: req.query.startTime, $lte: req.query.endTime };
    }

    if (req.query.keyword) {
      query.content = { $regex: req.query.keyword, $options: 'i', };
    }

    if (req.query.size) {
      size = parseInt(req.query.size) > 100 ? 100 : parseInt(req.query.size);
    }

    // const users = await User.find()
    //   .populate({
    //     path: 'followers',
    //     populate: { path: 'user', select: 'name photo' },
    //   })
    //   .populate({
    //     path: 'followings',
    //     populate: { path: 'following', select: 'name photo' },
    //   })
    //   .select('name photo ');


    const posts = await Post.find(query)
      .populate({
        path: 'user',
        select: 'name photo',
      })
      .sort(req.query.sortDirection === 'desc' ? { createdAt: -1 } : { createdAt: 1 })
      .limit(size);

    sendSuccess(res, 200, '取得貼文成功', posts);
  },
  getPost: async (req, res, next) => {
    let { postId } = req.params;
    console.log(postId)
    const post = await Post.findById(postId).populate({
      path: 'user',
      select: 'name photo',
    });
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

    const newPost = new Post({ content: content, image: image, user: userId });
    const result = await Post.create(newPost);
    sendSuccess(res, 200, '新增貼文成功', result);
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
    sendSuccess(res, 200, '更新貼文成功', result);
  },
  deletePosts: async (req, res, next) => {
    if (req.path === '/') {
      return next(appError(res, 400, '欲刪除全部貼文請刪除路由末端斜線，欲刪除單筆貼文需提供 postId'));
    }
    const deleteResult = await Post.deleteMany({});
    sendSuccess(res, 200, '刪除全部貼文成功', deleteResult);
  },
  deletePost: async (req, res, next) => {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return next(appError(res, 404, '查無此貼文'));
    }
    const deleteResult = await Post.findByIdAndDelete(req.params.id);
    sendSuccess(res, 200, '刪除貼文成功', deleteResult);
  }
};

module.exports = postsController;
