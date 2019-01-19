'use strict'
const mongoose = require('../modules/dbSetup');

const adminSchema = new mongoose.Schema({
    name:{type:String,required:true},  
    password:{type:String,required:true},
    email:{type:String},
    role:{type:Number,required:true,default: 10} //1、超级管理员，10一般用户
})
// 创建model
const adminModel = mongoose.model('user', adminSchema); // newClass为创建或选中的集合

module.exports = adminModel;