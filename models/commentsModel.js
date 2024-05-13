const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, '會員Id 必填'],
        },
        post: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post',
            required: [true, '貼文Id 必填'],
        },
        content: {
            type: String,
            required: [true, '內容 必填'],
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
    }
);

commentSchema.virtual('userInfo', {
    ref: 'User',
    localField: 'user',
    foreignField: '_id',
    select: '_id name photo',
    // justOne: true,
});

commentSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'user',
        select: '_id name photo'
    })
    next();
})

// followsSchema.pre(/^find/, function (next) {
//     this.populate({
//         path: 'following',
//         select: '_id name photo'
//     })
//     this.populate({
//         path: 'user',
//         select: '_id name photo'
//     })
//     next();
// })


const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;