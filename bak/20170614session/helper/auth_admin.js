'use strict'
const auth = (req,res,next) => {
    // checkLogin
    if(!req.session.user){                     //session 判断
        req.session.error = "请先登录"  
        //res.redirect("/login");                //未登录则重定向到 /login 路径
        res.send('<script>window.parent.location="/login";</script>');
        return;
    }
    //check auth
    //var routePath=req.route.path;
    //if(req.session.role != role)return;
    next();
}

module.exports = auth;