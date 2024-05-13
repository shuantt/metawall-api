const mongoose = require('mongoose');

const likesSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, '會員 Id 必填'],
        },
        post: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post',
            required: [true, '貼文 Id 必填'],
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
                delete ret.id; // 移除 _id 
                delete ret.__v; // 移除 __v 
            },
        },
        // toObject: { virtuals: true, versionKey: false },
    }
);

// likesSchema.virtual('userInfo', {
//     ref: 'User',
//     localField: 'user',
//     foreignField: '_id',
//     select: '_id name photo',
//     // justOne: true,
// });


likesSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'user',
        select: '_id name photo',
    });
    next();
});

// likesSchema.pre(/^find/, function (next) {
//     this.populate({
//         path: 'user',
//         select: '_id name',
//     });
//     this.populate({
//         path: 'post',
//         select: '_id',
//     });
// });

const Like = mongoose.model('Like', likesSchema);
module.exports = Like;
