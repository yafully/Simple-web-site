'use strict'

const chatuserModel = require('../modules/chatuserSetup');
const pageHelper = require('../helper/pager');
const auth = require('../helper/auth_admin');
const roomCheck = require('../helper/roomCheck');
const statusSetUp = require('../helper/roomStatus');//房间内用户状态更新
const silly = require("silly-datetime");

const routes = (app) => {

    //聊天室列表
    app.get('/chatroomlist', auth, (req, res, next) => {

        let response = res;

        chatuserModel.aggregate([
        {
            $project : {
                roomname:1,
                users : 1
            }
        },
        {
            "$unwind": "$users"
        },
        {"$sort": { "_id":1} },
        {  
             $project:  
               {
                _id :'$_id',
                room:'$roomname',
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
                    _id: {id:'$_id',room:'$room'},

                    staffTotal:{$sum:{  
                        $cond: { if: {$eq: [ "$myuser.staff",true ]}, then: 1, else: 0 }  
                    }},
                    staffOnline:{$sum:{  
                        $cond: [ {$and : [ {$eq: [ "$myuser.status",true ]},{$eq: [ "$myuser.staff",true ]} ]},1,0]
                    }},

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
            response.render('backend/chat/index',{
                title:"网站集群",
                result: doc
            });
        });

    });

    app.post('/chatroom', roomCheck, (req, res, next) => {
        let response = res;
        let request = req;

        if(!req.session.user){                     //session 判断
            req.session.error = "请先登录"  
            //res.redirect("/login");                //未登录则重定向到 /login 路径
            response.send({status: 'timeout',message:'登录超时.'});
            return;
        }

        let room = req.query.site;
        let umail = req.session.email;
        let uname = req.session.user;

        chatuserModel.findOne({"roomname":room,'users.email': umail},{'users.$':1},function(err,doc){ //查询当前房间下是否有这个email用户
            if(err){  
                //res.send(500);  
                req.session.error =  '网络异常错误！'; 
                response.send({status: 'error',message:'网络异常错误！'});
                console.log(err);  
            }else if(doc){
                //Email已存在！则进入聊天？
                //req.session.error = 'Email已存在！';  
                //res.send(500); 
                //response.send({status: 'error',message:'Email已存在!'});
                //console.log(doc);
                console.log('Email已存在');
                statusSetUp(room,umail,uname,request,response);
                //response.send({status: 'ok',message:'Old user login.',chatuser:uname});
            }else{
                console.log('新建用户！');
                chatuserModel.update({roomname:room},{$push: {users: {email:umail,name:uname}}},function(err,doc){
                    if (err) {  
                        res.send(500);  
                        console.log(err);  
                    } else {  
                        // req.session.error = '用户名创建成功！';  
                        // res.send(200); 
                        statusSetUp(room,umail,uname,request,response);
                        //response.send({status: 'ok',message:'New user login.',chatuser:uname});
                    }  
                });  
            }  
        });
    });

    app.get('/joinchatadmin', auth, (req, res, next) => {
        let response = res;
        let room = req.query.site;
        let sess_chat = req.session.chatauth;

        let omail = sess_chat[room].chatuser;
        let oname = sess_chat[room].name;
        // if(typeof sess_chat.id != 'undefined'){
        //     statusSetUp(room,omail,oname,req,res,true);
        // };


        response.render('backend/chat/chat',{
            title: room,
            user:omail,
            name:oname,
            sid:req.session.id,
            room: room
        });
    });
}
module.exports = routes;
