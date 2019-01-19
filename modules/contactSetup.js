'use strict'
const mongoose = require('../modules/dbSetup');

// 创建schema
const contactSchema = new mongoose.Schema({
    name:  {type: String, required: true},
    phone: String,
    email:  {type: String, required: true},
    content:  {type: String, required: true},
    date: {type: String, required: true}

}, {timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'}})
// 创建model
const jobModel = mongoose.model('contacts', contactSchema); // newClass为创建或选中的集合

module.exports = jobModel;