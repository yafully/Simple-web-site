'use strict'
const mongoose = require('../modules/dbSetup');

const guestSchema = new mongoose.Schema({
    frequency:Number,
    guestIp:String,
    date:Date
})
// 创建model
const guestModel = mongoose.model('guest', guestSchema); // newClass为创建或选中的集合

module.exports = guestModel;