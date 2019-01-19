'use strict'
//Discription：后台用户控制模块
//Author:YafullyZhao
//Date:20170428
const adminModel = require('../modules/adminSetup');
//const guestModel = require('../modules/guestSetup');
const pageHelper = require('../helper/pager');


const routes = (app) => {

app.get('/lwht', function(req, res, next) {  

    if(!req.session.user){                     //到达/home路径首先判断是否已经登录  
        req.session.error = "请先登录"  
        res.redirect("/login");                //未登录则重定向到 /login 路径  
        return;
    }

    res.render('backend/admin/index',{title:'乐薇网站管理系统',user:req.session.user});         //已登录则渲染home页面  
});

app.get('/login', function(req, res, next) {  

    if(req.session.user){                     //到达/home路径首先判断是否已经登录  
        req.session.error = "已登录"  
        res.render('backend/admin/index',{title:'乐薇网站管理系统',user:req.session.user});               //登录则重定向到 /login 路径  
        return;
    }  
    res.render('backend/admin/login',{title:'乐薇网站管理--登录'});         //已登录则渲染home页面  
});

app.post('/login', function (req, res, next) {
    let uname = req.body.username;
    let upwd = req.body.password;
    let response = res;
    

    
    adminModel.findOne({'name':uname},function(err,doc){   //通过此model以用户名的条件 查询数据库中的匹配信息  

        if(err){                                         //错误就返回给原post处（login.html) 状态码为500的错误  
            res.send(500);  
            console.log(err);
            return;
        }else if(!doc){                                 //查询不到用户名匹配信息，则用户名不存在  
            req.session.error = '用户名不存在';  
            //res.send(404);                            //    状态码返回404  
            response.send({status: 'error',message:'用户名不存在'});
            return;
        }else{  
            if(upwd == doc.password){     //查询到匹配用户名的信息，再对比密码

                // req.session.user = doc;  //信息匹配成功，则将此对象（匹配到的user) 赋给session.user  并返回成功
                // req.session.chatuser = doc.email;//给聊天赋值
                // req.session.name = doc.name;
                // response.send({status: 'success',message:'登录成功'});
                req.session.regenerate(function(){
                    req.session.user = doc.name;
                    req.session.email = doc.email;
                    req.session.save();  //保存一下修改后的Session
                    response.send({status: 'success',message:'登录成功'});
                });
                return;
            }else{                                       
                req.session.error = "密码错误";  
                //res.send(404);  
                response.send({status: 'error',message:'密码错误'});
                return;
            }  
        }  
    });


});

app.get("/logout",function(req,res){    // 到达 /logout 路径则登出， session中user,error对象置空，并重定向到根路径  
    // req.session.user = null;  
    // req.session.error = null;  
    // res.redirect("/login");  
    req.session.user = null; 
    req.session.email = null;  
    res.clearCookie('secret');
    req.session.regenerate(function(){
        //重新生成session之后后续的处理
        res.redirect("/login"); 
    })
});


    
}
module.exports = routes;



// User.findOne({name: uname},function(err,doc){   // 同理 /login 路径的处理方式  
//     if(err){  
//         res.send(500);  
//         req.session.error =  '网络异常错误！';  
//         console.log(err);  
//     }else if(doc){  
//         req.session.error = '用户名已存在！';  
//         res.send(500);  
//     }else{  
//         User.create({                             // 创建一组user对象置入model  
//             name: uname,  
//             password: upwd  
//         },function(err,doc){  
//             if (err) {  
//                 res.send(500);  
//                 console.log(err);  
//             } else {  
//                 req.session.error = '用户名创建成功！';  
//                 res.send(200);  
//             }  
//         });  
//     }  
// }); 