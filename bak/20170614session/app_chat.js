'use strict'
const server = require('socket.io')();
const chatuserModel = require('./modules/chatuserSetup');
const silly = require("silly-datetime");
const url = require("url");
const qs = require('querystring');
const cookieParser = require('cookie-parser');


const roomInfo = {};
const clients = [];


//staff
//socket.broadcast.emit("userIn","system@: 【"+client.name+"】-- a newer ! Let's welcome him ~");//广播（不包含当前客户端）
//server.sockets.emit('userIn', "this is a test");//广播（且包含当前客户端）
//socket.broadcast.to('game').emit('message', 'nice game');//在房间广播（不包含当前客户端）
//server.sockets.in('game').emit('message', 'cool game');//在房间广播（包含当前客户端）
//io.sockets.socket(socketid).emit('message', 'for your eyes only');//发送给指定客户端
// 获取上线的客服
function getStaff(room,ssocket){

	//聚合分组客服人员和普通用户
	chatuserModel.aggregate([
	    {
	        $match: {
	            "roomname":room
	        }
	    }, 
	    {
	        $project : {
	            roomname:1,
	            users : 1
	        }
	    },
	    {
	        "$unwind": "$users"
	    },
	    //{"$sort": { "users.status":1} },
	    {  
	     $project:  
	       {  
	        myuser:{
	         _id:null,
	         email:'$users.email',
	         name:'$users.name',
	         status:'$users.status',
	         role:'$users.role',
	         staff:{  
	           $cond: { if: {$in: ["$users.role",[ 1 ]]}, then: true, else: false }  
	           }
	         }  
	       }  
	    },
	    
	    {
	    $group:
	        {
	            _id: '$roomname',
	            staff: { $addToSet: {  
	                $cond: { if: {$eq: [ "$myuser.staff",true ]}, then: "$myuser", else: null } }
	            },
	            staffTotal:{$sum:{  
	                $cond: { if: {$eq: [ "$myuser.staff",true ]}, then: 1, else: 0 }  
	            }},
	            staffOnline:{$sum:{  
	                $cond: [ {$and : [ {$eq: [ "$myuser.status",true ]},{$eq: [ "$myuser.staff",true ]} ]},1,0]
	            }},
	            custom: { $addToSet: {  
	                $cond: { if: {$eq: [ "$myuser.staff",false ]}, then: "$myuser", else: null } }
	            },
	            customTotal:{$sum:{  
	                $cond: { if: {$eq: [ "$myuser.staff",false ]}, then: 1, else: 0 }  
	            }},
	            customOnline:{$sum:{  
	                $cond: [ {$and : [ {$eq: [ "$myuser.status",true ]},{$eq: [ "$myuser.staff",false ]} ]},1,0]  
	            }}
	        }
	    }
	]).exec(function(err, doc) {
		if(err){console.log(err); return;}

		let customData = doc[0].custom;
		let customOline = doc[0].customOnline; 
		ssocket.broadcast.to(room).emit('staff_list',doc[0].staff,doc[0].staffOnline,customData,customOline);   		//广播更新客服人员列表
 		ssocket.emit('staff_list',doc[0].staff,doc[0].staffOnline,customData,customOline);   		//更新本机客服人员列表

	});
}
//注销  下线处理
function statusSetDown(room,client,ssocket){

	// let oMail = client.email;
	// let oName = client.name; 

	let data = {};
		data.email = client.email;
		data.name = client.name;   
		
	chatuserModel.updateOne({"roomname":room,'users.email': data.email}, {$set: {'users.$.status': false}},function(err,doc){
		if(err){ 
			console.log(err);
		}else{ 
			console.log(data.name+ " is down");
			ssocket.broadcast.to(room).emit('userOut',data);//向房间广播用户下线
			getStaff(room,ssocket);
		}
	});
}
//存储聊天记录
function storeContent(room,oMail,chats,time,to){       // 保存聊天记录
    chatuserModel.update(
    	{"roomname":room,'users.email': oMail},
    	{$push: {'users.$.content': {chatlog:chats,date:time,touser:to?to:'all'}}},
    	function(err,doc){ 
	        if(err){ 
	            console.log(err);
	        }else{ 
	            console.log("store chatlog success!");
	        }
    });
}

server.on('connection',function(socket){   // server listening
	console.log('socket.id '+socket.id+ ':  connecting');  // console-- message\
	

	//var cookies = socket.request.headers.cookie;    //保存对象地址，提高运行效率
    //cookieParser.signedCookie(cookies,'sessionId');
    //console.log(cookieParser.signedCookie(cookies,'sessionId'));


	let headurl = socket.request.headers.referer;
	let queryUrl = url.parse(headurl).query;//获取房间名
	let query = qs.parse(queryUrl);
	let roomId = query.site;

	
	
	getStaff(roomId,socket);

	socket.join(roomId);//加入房间
	//构造用户对象client
    var client = { 
		Socket: socket,
		id:socket.id,
		email: '----',
		name:'----'
    };
    //接收客户端聊天页面打开时发送过来的用户信息并广播
    socket.on("message",function(email,name,sid){ 
    	//console.log(sid);
    	//console.log('778888777777');
    	
    	// session_store.get("user", function(error, session){
    	// 	console.log(session);
    	// });


  		client.email = email;// 接收user name
  		client.name =  name;            
  		clients.push(client);//保存此client

        if (!roomInfo[roomId]) {
	      roomInfo[roomId] = [];
	    }
	    
	    //console.log(roomInfo[roomId]);
		// let hasUser = roomInfo[roomId].some(function(item){
		// 	return item.email == email;
		// });
		// if(!hasUser){
			
		// }
		roomInfo[roomId].push(client);
		//console.log(roomInfo);
  		////socket.broadcast.emit("userIn","system@: ["+client.name+"]-- a newer ! Let's welcome him ~");//广播（不包含当前客户端）
  		////server.sockets.emit('userIn', "this is a test");//广播(且包含当前客户端)
  		////socket.broadcast.to('my room').emit('event_name', data);}//2. 向another room广播一个事件，在此房间所有客户端都会收到消息//注意：和上面对比，这里是从服务器的角度来提交事件  
		////io.sockets.in('another room').emit('event_name', data);//向所有客户端广播
		let data = {};
		data.email = client.email;
		data.name = client.name; 

		socket.broadcast.to(roomId).emit("userIn",data);

		//console.log(roomInfo);
    });
    //socket.emit("system","system@:  Welcome ! Now chat with others");


	//广播客户传来的数据并处理--群聊
	socket.on('say',function(content){         // 群聊阶段
		console.log("server: "+client.name + "  say : " + content);
		//置入数据库
		var time = silly.format(new Date(), 'YYYY-MM-DD HH:mm');
		socket.emit('user_say',client.name,client.email,time,content);
		socket.broadcast.to(roomId).emit('user_say',client.name,client.email,time,content);
		storeContent(roomId,client.email,content,new Date());   //保存聊天记录

	});

	//私聊
	socket.on("say_private",function(fromuser,touser,content){    //私聊阶段
		let toSocket = [];
		let fromSocket =[];
		let tomail = "";
		let time = silly.format(new Date(), 'YYYY-MM-DD HH:mm');
		// for(var n in clients){ 
		// 	if(clients[n].name === touser){     // get touser -- socket
		// 		toSocket = clients[n].Socket;
		// 	}
		// }
		for(var n in roomInfo[roomId]){
			//找到对方数据
			if(roomInfo[roomId][n].name === touser){     // get touser -- socket
				toSocket.push(roomInfo[roomId][n].Socket);
				tomail = roomInfo[roomId][n].email;
			}
			//找到我方数据
			if(roomInfo[roomId][n].email === client.email){
				fromSocket.push(roomInfo[roomId][n].Socket);
			}
		}

		//console.log(toSocket);
		// console.log(touser);
		// console.log("toSocket:  "+toSocket.id);
		// console.log("my socket:  "+socket.id);
		if(typeof toSocket != "undefined"){//id不为空且不是自己
			if(client.email != tomail){//这里不能用socket.id来判断，因为新开一个选项卡socket.id就不一样了
				
				fromSocket.forEach(function(item, index) {// 数据返回给 fromuser这里用数组遍历是因为目标对象可能开了N个页面需要广播
					item.emit("say_private_done",touser,content,time);   //数据返回给fromuser
				});

				toSocket.forEach(function(item, index) {
				    item.emit("sayToYou",fromuser,content,time);
				    // 数据返回给 touser这里用数组遍历是因为目标对象可能开了N个页面需要广播
				});

				storeContent(roomId,client.email,content,new Date(),tomail);//保存聊天记录
			}else{
				console.log('不能给自己发消息');
				socket.emit("erro",'不能给自己发消息.');
				//server.to(roomId).socket.emit('erro', fromuser, '不能给自己发消息.');
			}
		//console.log(fromuser+" 给 "+touser+"发了份私信： "+content);
		}else{
			socket.emit("erro",'对方不在线，无法收到消息.');
		}	
	});

	//断开链接
	socket.on('disconnect',function(){ 	  // Event:  disconnect

		if(Object.keys(roomInfo).length>0){

			for(let i=0;i<roomInfo[roomId].length;i++){//删除这个房间内email为当前email的所有信息
				if(roomInfo[roomId][i].email === client.email){
					roomInfo[roomId].splice(i, 1);
					i--;
				}
			}

			statusSetDown(roomId,client,socket);//用户下线状态更新
			socket.leave(roomId);
			
			
			console.log(client.name + ':   disconnect');
		}

	});

});





exports.listen = function(charServer){    
	return server.listen(charServer);    // listening 
};	