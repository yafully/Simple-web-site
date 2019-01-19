'use strict'
const mongoose = require('../modules/dbSetup');
const bcrypt = require('bcryptjs');

const adminSchema = new mongoose.Schema({
    name:{type:String,required:true},  
    password:{type:String,required:true},
    token: {type: String},
    email:{type:String},
    role:{type:Number,required:true,default: 10} //1、超级管理员，10一般用户
});

// 添加用户保存时中间件对password进行bcrypt加密,这样保证用户密码只有用户本人知道
adminSchema.pre('save', function (next) {
    let user = this;
    if (this.isModified('password') || this.isNew) {
        bcrypt.genSalt(10, function (err, salt) {//生成hash密码
            if (err) {
                return next(err);
            }
            bcrypt.hash(user.password, salt, function (err, hash) {
                if (err) {
                    return next(err);
                }
                user.password = hash;
                next();
            });
        });
    } else {
        return next();
    }
});
// 校验用户输入密码是否正确
adminSchema.methods.comparePassword = function(passw, cb) {
	
	let isMatch = (passw == this.password) ? true : false;
	cb(null, isMatch);
	
    // bcrypt.compare(passw, this.password, (err, isMatch) => {
    //     if (err) {
    //     	console.log()
    //         return cb(err);
    //     }
    //     cb(null, isMatch);
    // });
};
// 创建model
const adminModel = mongoose.model('user', adminSchema); // newClass为创建或选中的集合

module.exports = adminModel;