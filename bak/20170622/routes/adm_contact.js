'use strict'

const contactModel = require('../modules/contactSetup');
const pageHelper = require('../helper/pager');
const silly = require("silly-datetime");

const routes = (app) => {

    //联系我们管理首页
    app.get('/contactlist', (req, res, next) => {
        if(!req.session.user){                     //session 判断
            req.session.error = "请先登录"  
            //res.redirect("/login");                //未登录则重定向到 /login 路径  
            res.send('<script>window.parent.location="/login";</script>');
            return;
        }

        let response = res;

        var page = req.query.page || 1,pageurl = '/contactlist?page=';

        pageHelper.pageQuery(page, pageurl , 10 ,contactModel, '', {}, {
            created_time: 'desc'
        }, function(error, $page){
            if(error){
                next(error);
            }else{
                response.render('backend/contacts/index',{
                    title:"访客联系列表",
                    uri: $page.pageUri,
                    result: $page.results,
                    pageCount: $page.pageCount,
                    pageNumber: $page.pageNumber
                });
                //console.log($page);
            }
        });

    });

    //详情查看
    app.get('/contactview',(req,res, next) =>{
        if(!req.session.user){                     //session 判断
            req.session.error = "请先登录"  
            //res.redirect("/login");                //未登录则重定向到 /login 路径  
            res.send('<script>window.parent.location="/login";</script>');
            return;
        }

        let contactId = req.query.id;
        let response = res;
        contactModel.find({'_id':contactId}, (err, result, res) => {
            if(err) return console.log(err)
            response.render('backend/contacts/detail', { 
                title:"访客详细信息",
                result:result 
            })

        });
    });
    //返回上级
    // app.get('/back',(req,res, next) =>{
    //     if(!req.session.user){                     //session 判断
    //         req.session.error = "请先登录"  
    //         res.redirect("/login");                //未登录则重定向到 /login 路径  
    //     }
    //     console.log(req.path);
    //     res.redirect('back');
    // });

    //列表删除
    app.get('/contactdel', (req, res, next) => {
        if(!req.session.user){                     //session 判断
            req.session.error = "请先登录"  
            res.redirect("/login");                //未登录则重定向到 /login 路径  
            return;
        }
        
        contactModel.remove({'_id':req.query.id}, (err, result) => {
            if(err) return console.log(err);
            res.redirect('/contactlist');
        });
    });

}
module.exports = routes;
