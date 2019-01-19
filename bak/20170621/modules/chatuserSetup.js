'use strict'
const mongoose = require('../modules/dbSetup');

const chatuserSchema = new mongoose.Schema({

		roomname:{type:String,required:true},
		users:[{
			email:{type:String,required:true},
			name:{type:String,required:true},
			status:{type:Boolean,default: false},
			role:{type:Number,default: 10},
			content:[{
				chatlog:{type:String},
				date:{type:Date,required:true},
				touser:{type:String,default: "all"}
			}]
		}]

})
// 创建model
const chatuserModel = mongoose.model('chatuser', chatuserSchema); // newClass为创建或选中的集合

module.exports = chatuserModel;