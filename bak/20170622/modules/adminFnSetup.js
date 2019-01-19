'use strict'
const mongoose = require('../modules/dbSetup');

const adminFnSchema = new mongoose.Schema({
	// id : {type:String,required:true},
	// name : {type:String,required:true},
	// url : {type:String},
	// pId : {type:String,required:true,default: "0"}
	id : {type:String,required:true},
	name : {type:String,required:true},
	url : {type:String},
	children : [{
		id : {type:String,required:true},
		name : {type:String,required:true},
		url : {type:String},
		children : [{
			id : {type:String,required:true},
			name : {type:String,required:true},
			url : {type:String}
		}]
	}]
})
// 创建model
const adminFnModel = mongoose.model('functions', adminFnSchema); // newClass为创建或选中的集合

module.exports = adminFnModel;


//db.functions.insert( { id: "1", pId: "0",name:"网站管理",url:"/a" } )
//db.functions.insert( { id: "1-1", pId: "1",name:"控制面板",url:"/b" } )
//db.functions.insert( { id: "1-2", pId: "1",name:"招聘管理",url:"/c" } )
//db.functions.insert( { id: "1-3", pId: "1",name:"访客管理",url:"/d" } )
//db.functions.insert( { id: "2", pId: "0",name:"在线咨询",url:"" } )
//db.functions.insert( { id: "2-1", pId: "2",name:"网站集群",url:"/e" } )
//db.functions.aggregate([
//{ 
//    $group : {
//    _id : "$pId",
//    children: { $push: "$$ROOT" }
//    } 
//},//系统变量$$ROOT(当前的根文档)来分组
//{
//    $addFields: {name:  "$$ROOT"}
//}
//]).pretty()


// {
//   "_id" : ObjectId("59434857e9b42734d0e7eb28"),
//   "id" : "1",
//   "name" : "网站管理",
//   "url" : "",
//   "children" : [{
//       "_id" : ObjectId("59434992e9b42734d0e7eb29"),
//       "id" : "1-1",
//       "name" : "控制面板",
//       "url" : "/a"
//     }, {
//       "_id" : ObjectId("59434992e9b42734d0e7eb30"),
//       "id" : "1-2",
//       "name" : "招聘管理",
//       "url" : "/b"
//     }, {
//       "_id" : ObjectId("59434992e9b42734d0e7eb31"),
//       "id" : "1-3",
//       "name" : "访客管理",
//       "url" : "/c"
//     }]
// }
// {
//   "_id" : ObjectId("59434a64e9b42734d0e7eb2a"),
//   "id" : "2",
//   "name" : "网站集群",
//   "url" : "/a",
//   "children" : [{
//       "_id" : ObjectId("59434a64e9b42734d0e7eb2b"),
//       "id" : "2-1",
//       "name" : "网站集群",
//       "url" : "/a"
//     }]
// }