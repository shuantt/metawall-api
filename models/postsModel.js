const mongoose = require('mongoose');
const { validate } = require('./followsModel');

const postSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, '會員 Id 必填'],
        },
        content: {
            type: String,
            required: [true, '內容 必填'],
        },
        image: {
            type: Array,
            default: [],
        },

    },
    {
        timestamps: true,
        // versionKey: false,
        virtuals: true,
        toJSON: {
            versionKey: false,
            virtuals: true,
            transform: function (doc, ret) {
                // ret.id = ret._id; // 將 _id 映射為 id 
                delete ret.id; // 移除 _id 
                delete ret.__v; // 移除 __v 
            },
        },
        // toObject: { virtuals: true, versionKey: false },
    }
);

postSchema.virtual('likes', {
    ref: 'Like',
    localField: '_id',
    foreignField: 'post',
    options: { select: 'user -post ' }
});

postSchema.virtual('comments', {
    ref: 'Comment',
    localField: '_id',
    foreignField: 'post',
    options: { select: 'user -post content createdAt' }
});

postSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'user',
        select: '_id name photo'
    })
    next();
})

const Post = mongoose.model('Post', postSchema);
module.exports = Post;
