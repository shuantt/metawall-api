const mongoose = require('mongoose');

const likesSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, '會員Id 必填'],
        },
        post: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post',
            required: [true, '文章Id 必填'],
        },
    },
    {
        timestamps: true,
        versionKey: false,
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

likesSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'user',
        select: '_id name photo',
    });
    this.populate({
        path: 'post',
        select: '_id content image likes',
    });
});

const Like = mongoose.model('Like', likesSchema);
module.exports = Like;
