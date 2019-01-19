'use strict'
const mongoose = require('../modules/dbSetup');

const classSchema = new mongoose.Schema({
    jobName: {type: String, required: true},
    depart: {type: String, required: true},
    jobNumber: {type: String, required: true},
    jobPay: {type: String, required: true},
    date:{type: String, required: true},
    detail:{type: String, required: true},
    jobReq:{type: String, required: true},
    visible:{type: Boolean, required: true}
}, {timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'}})
// 创建model
const jobModel = mongoose.model('jobs', classSchema); // newClass为创建或选中的集合

module.exports = jobModel;