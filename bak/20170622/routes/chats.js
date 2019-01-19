'use strict'

const chatuserModel = require('../modules/chatuserSetup');
const roomCheck = require('../helper/roomCheck');//房间检测
const authCheck = require('../helper/authStatus');//用户登录状态检测
const statusSetUp = require('../helper/roomStatus');//房间内用户状态更新
const silly = require("silly-datetime");



const routes = (app) => {
    app.get('/chatindex',roomCheck, function (req, res) {//进入路由前调用房间判断中间件
        //console.log(req.session.chatuser);
        let response = res;
        let site = req.query.site || 'systemroom';//如果没有房间标识则默认到系统房间
        let lang = req.query.lang;
        let auth_chat = authCheck(req,site);


        
        if(!auth_chat){//session 判断
            let site_email = req.query.email ||'';
            let site_user = req.query.user ||'';
            req.session.error = "请先登录";
            // response.render('chat/chatlogin',{
            //     title:'访客咨询',
            //     room:site,
            //     usermail:site_email,
            //     username:site_user
            // });

            response.redirect("/chatlogin?site="+site+"&email="+site_email+"&user="+site_user); 
            return;
        }
        
        let omail = auth_chat.chatuser;
        let oname = auth_chat.name; 
        statusSetUp(site,omail,oname,req,res,true);//纯更新用户状态，当用户未退出只刷新了页面session未丢失的情况下
        response.render('chat/chat',{
            user:omail,
            name:oname,
            room:site
        });

    });

    app.get('/chatlogin', function (req, res) {
        let site = req.query.site || 'systemroom';//如果没有房间标识则默认到系统房间
	    let site_email = req.query.email;
        let site_user = req.query.user;
        let auth_chat = authCheck(req,site);

        if(auth_chat){
            req.session.error = "已登录"  
            res.render('chat/chat',{title:'访客咨询',user:auth_chat.chatuser}); //登录则重定向到聊天界面 
            return;
        }
        
        res.render('chat/chatlogin',{
            title:'访客咨询',
            room:site,
            usermail:site_email,
            username:site_user
        });
    });

    //Chat route
    app.post('/joinchat', function (req, res) {
        let response = res;
        let request = req;
        //let now = silly.format(new Date(), 'YYYY-MM-DD');

        req.checkBody({
            'roomname':{
                notEmpty: {
                  errorMessage: '房间名不能为空.'
                }
            },
            'nickname':{
                notEmpty: {
                  errorMessage: '姓名能为空.'
                }
            },
            'chatmail':{
                isEmail: {
                  errorMessage: '请填写正确的邮箱地址.'
                }
            }
        });
        req.getValidationResult().then(function(result) {
            if (!result.isEmpty()) {
                var error = '';
                result.array().map(function(item){
                    error += item.msg;
                });
                response.send({status: 'error',message:error});

              return;
            }
            //验证通过
            let room = req.body.roomname;
            let umail = req.body.chatmail;
            let uname = req.body.nickname;


            //{roomname:room,users:{"$elemMatch":{"email":umail}}}
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

    });

    //退出登录
    app.get("/chatlogout",function(req,res){    // 到达 /logout 路径则登出， session中user,error对象置空，并重定向到登录入口
        req.session.error = null;
        let site = req.query.site;
        let site_email = req.query.email;
        let site_user = req.query.user;
        let request = req;
        let response = res;

        if(typeof request.session.chatauth !='undefined'){

            let sessionObj = request.session.chatauth[site];
                delete sessionObj[site];//删除session对象
            req.session.regenerate(function(){
                
                request.session.save();  //保存一下修改后的Session
                
                response.render('chat/chatlogin',{
                    title:'访客咨询',
                    room:site,
                    usermail:site_email,
                    username:site_user
                });
            });
        }
    });


}
module.exports = routes;
