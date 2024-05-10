const mongoose = require('mongoose');
const validator = require('validator');
const Follow = require('./followsModel');

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: [true, 'email必填'],
            unique: true,
            lowercase: true,
            validate: function (value) {
                return validator.isEmail(value);
            },
            select: false,
        },
        password: {
            type: String,
            required: [true, '密碼必填'],
            minlength: 8,
            validate: function (value) {
                return validator.isStrongPassword(value);
            },
            select: false,
        },
        name: {
            type: String,
            required: [true, '名字必填'],
        },
        gender: {
            type: String,
            default: 'other',
            enum: ['male', 'female', 'other'],
        },
        photo: {
            type: String,
            default: '',
        },
        role:{
            type: String,
            default: 'user',
            enum: ['user', 'admin'],
        },
        isActive: {
            type: Boolean,
            default: true,
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

userSchema.virtual('followings', {
    ref: 'Follow',
    localField: '_id',
    foreignField: 'user',
});

userSchema.virtual('followers', {
    ref: 'Follow',
    localField: '_id',
    foreignField: 'following'
});

userSchema.virtual('like', {
    ref: 'Post',
    localField: '_id',
    foreignField: 'likes',
});

const User = mongoose.model('User', userSchema);
module.exports = User;
