const mongoose = require('mongoose');
const User = require('../models/usersModel');

const followsSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, '會員Id 必填'],
    },
    following: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, '追蹤中會員 Id 必填'],
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
    toObject: { virtuals: true, versionKey: false },
  }
);



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

const Follow = mongoose.model('Follow', followsSchema);
module.exports = Follow;
