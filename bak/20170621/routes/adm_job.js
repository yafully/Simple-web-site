'use strict'
const util = require('util');
const jobModel = require('../modules/jobSetup');
const pageHelper = require('../helper/pager');
const auth = require('../helper/auth_admin');
const silly = require("silly-datetime");


const routes = (app) => {

    //招聘管理首页
    app.get('/joblist', auth, (req, res, next) => {
        // if(!req.session.user){                     //session 判断
        //     req.session.error = "请先登录"  
        //     //res.redirect("/login");                //未登录则重定向到 /login 路径
        //     res.send('<script>window.parent.location="/login";</script>');
        //     return;
        // }

        let response = res;
        var page = req.query.page || 1,pageurl = '/joblist?page=';

        pageHelper.pageQuery(page, pageurl , 10 ,jobModel, '', {}, {
            created_time: 'desc'
        }, function(error, $page){
            if(error){
                next(error);
            }else{
                response.render('backend/jobs/index',{
                    title:"招聘列表",
                    uri: $page.pageUri,
                    result: $page.results,
                    pageCount: $page.pageCount,
                    pageNumber: $page.pageNumber
                });
                //console.log($page);
            }
        });

    });


    // 增加招聘信息
    app.get('/create', (req, res, next) => {
        if(!req.session.user){                     //session 判断
            req.session.error = "请先登录"  
            //res.redirect("/login");                //未登录则重定向到 /login 路径  
            res.send('<script>window.parent.location="/login";</script>');
            return;
        }

        let now = silly.format(new Date(), 'YYYY-MM-DD');
        res.render('backend/jobs/create', {title:"新增招聘职位",timestamp:now})
    })
    app.post('/create', (req, res, next) => {
        if(!req.session.user){                     //session 判断
            req.session.error = "请先登录"  
            //res.redirect("/login");                //未登录则重定向到 /login 路径  
            res.send('<script>window.parent.location="/login";</script>');
            return;
        }

        let newJob = [{
            jobName: req.body.job_name,
            depart: req.body.depart,
            jobNumber:req.body.job_number,
            jobPay:req.body.job_pay,
            date:req.body.date,
            detail:req.body.detail,
            jobReq:req.body.job_req,
            visible:req.body.visible
        }]
        jobModel.create(newJob, (err) => {
            if(err) return console.log(err)
            res.redirect('/joblist');
        })
    })

    // 修改招聘信息
    //进入页面
    app.get('/update', (req, res, next) => {
        if(!req.session.user){                     //session 判断
            req.session.error = "请先登录"  
            //res.redirect("/login");                //未登录则重定向到 /login 路径  
            res.send('<script>window.parent.location="/login";</script>');
            return;
        }

        // let response = res
        // jobModel.find({}, (err, result, res) => {
        //     if(err) return console.log(err)
        //     response.render('backend/jobs/update', { result })
        // });


        let response = res;
        var page = req.query.page || 1,pageurl = '/update?page=';

        pageHelper.pageQuery(page, pageurl , 10 ,jobModel, '', {}, {
            created_time: 'desc'
        }, function(error, $page){
            if(error){
                next(error);
            }else{
                response.render('backend/jobs/update',{
                    title:"招聘信息修改",
                    uri: $page.pageUri,
                    result: $page.results,
                    pageCount: $page.pageCount,
                    pageNumber: $page.pageNumber
                });
                //console.log($page);
            }
        });

    });
    //提交
    app.post('/update', (req, res, next) => {
        if(!req.session.user){                     //session 判断
            req.session.error = "请先登录"  
            //res.redirect("/login");                //未登录则重定向到 /login 路径  
            res.send('<script>window.parent.location="/login";</script>');
            return;
        }

        let pagetotal = req.body.pagetotal;
        let response = res;

        
        if(util.isArray(pagetotal)){
            var count = 0;
            pagetotal.forEach(function(value, index, array) {
                
                let condiction = {_id: req.body['_id_'+value]},
                query = {$set: {
                    jobName: req.body['job_name_'+value], 
                    depart: req.body['depart_'+value],
                    jobNumber:req.body['job_number_'+value],
                    jobPay: req.body['job_pay_'+value],
                    detail:req.body['detail_'+value],
                    jobReq:req.body['job_req_'+value],
                    visible:req.body['visible_'+value],
                    date:req.body['date_'+value]
                }};

                jobModel.updateOne(condiction, query, (err, result) => {
                    if(err) {
                        console.log(err)
                        res.send('<script>alert("请勾选待修改的学生")</script>');
                        return;
                    }
                    count++;
                    if(count >=pagetotal.length){
                        res.redirect('/joblist');
                    }
                    
                });

            });
        }else{
            console.log('请勾选至少2个以上');
            //res.send('<script>alert("请勾选待修改的学生")</script>');
            res.send("<h2>请勾选至少2个以上待修改的数据.</h2><a href='/update'>返 回</a>");
        }
            
    })

    //列表编辑
    app.get('/edit', (req, res, next) => {
        if(!req.session.user){                     //session 判断
            req.session.error = "请先登录"  
            //res.redirect("/login");                //未登录则重定向到 /login 路径  
            res.send('<script>window.parent.location="/login";</script>');
            return;
        }

        let response = res;
        let now = silly.format(new Date(), 'YYYY-MM-DD');
        let page = req.query.page;
        jobModel.find({'_id':req.query.id}, (err, result, res) => {
            if(err) return console.log(err);
            console.log(now);
            response.render('backend/jobs/edit', { 
                title:"招聘信息修改",
                result:result,
                timestamp:now,
                page:page
            })
        })
    });

    app.post('/edit', (req, res, next) => {
        if(!req.session.user){                     //session 判断
            req.session.error = "请先登录"  
            //res.redirect("/login");                //未登录则重定向到 /login 路径  
            res.send('<script>window.parent.location="/login";</script>');
            return;
        }

        let condiction = {_id: req.body._id},
            query = {$set: {
                jobName: req.body.job_name, 
                depart: req.body.depart,
                jobNumber:req.body.job_number,
                jobPay: req.body.job_pay,
                detail:req.body.detail,
                jobReq:req.body.job_req,
                visible:req.body.visible,
                date:req.body.date
            }};

        let request = req;
        let response = res;
        var page = request.query.page || 1,pageurl = '/joblist?page=';
            
        if(req.body.delete !== undefined){//删除
            jobModel.remove({_id: req.body._id}, (err, result) => {
                if(err) return console.log(err)
                //console.log(result.result)
                //res.render('index', { result })
                //res.send("<a href='/joblist'>删除成功，点击返回首页</a>")
                console.log('删除成功');
                res.redirect('/joblist');
                


            });
        }else{
            
            jobModel.update(condiction, query, (err, result) => {
                if(err) {
                    console.log(err)
                    res.send('<script>alert("请勾选待修改的学生")</script>')
                }
                console.log('修改成功！！！！');

                
                //常规列表
                pageHelper.pageQuery(page, pageurl , 10 ,jobModel, '', {}, {
                    created_time: 'desc'
                }, function(error, $page){
                    if(error){
                        next(error);
                    }else{
                        
                        response.render('backend/jobs/index',{
                            title:"招聘列表",
                            uri: $page.pageUri,
                            result: $page.results,
                            pageCount: $page.pageCount,
                            pageNumber: $page.pageNumber
                        });
                        
                    }
                });
                
                
                //res.redirect('/joblist');
                
            });
        }
    });
    //列表删除
    app.get('/dellist', (req, res, next) => {
        if(!req.session.user){                     //session 判断
            req.session.error = "请先登录"  
            //res.redirect("/login");                //未登录则重定向到 /login 路径  
            res.send('<script>window.parent.location="/login";</script>');
            return;
        }

        jobModel.remove({'_id':req.query.id}, (err, result) => {
            if(err) return console.log(err);
            //res.redirect('/joblist');
            res.send('<script>history.back();</script>');
        });

    });
    // 查找招聘信息



    app.get('/reach', (req, res, next) => {
        if(!req.session.user){                     //session 判断
            req.session.error = "请先登录"  
            //res.redirect("/login");                //未登录则重定向到 /login 路径  
            res.send('<script>window.parent.location="/login";</script>');
            return;
        }

        let response = res,
            result = null,
            page = req.query.page || 1,
            searchtype = req.query.searchtype || 0,
            keyWord = req.query.keyword ? req.query.keyword :'',
            searchParm;


        if (searchtype == 0) {
            searchParm = {'jobName': {$regex:keyWord}};
        }else{
            searchParm = {'depart': keyWord};
        }

        let pageurl = '/reach?'+'searchtype='+searchtype+'&keyword='+keyWord+'&page=';

            
        pageHelper.pageQuery(page, pageurl , 10 ,jobModel, '', searchParm, {
            created_time: 'desc'
        }, function(error, $page){
            if(error){
                next(error);
            }else{
                response.render('backend/jobs/reach',{
                    title:"招聘信息搜索",
                    searchType:searchtype,
                    keyWord:keyWord,
                    uri: $page.pageUri,
                    result: $page.results,
                    pageCount: $page.pageCount,
                    pageNumber: $page.pageNumber
                });
                //console.log($page);
            }
        });



        //res.render('backend/jobs/reach', {'searchType':searchtype,'result':result,'keyWord':keyWord});


    });

    app.post('/reach', (req, res, next) => {
        if(!req.session.user){                     //session 判断
            req.session.error = "请先登录"  
            //res.redirect("/login");                //未登录则重定向到 /login 路径  
            res.send('<script>window.parent.location="/login";</script>');
            return;
        }
        
        let response = res
        let reachType = req.body.reach_type,
            keyWord = req.body.keyword,
            searchParm;

        if (reachType == 0) {
            searchParm = {'jobName': {$regex:keyWord}};
        }else{
            searchParm = {'depart': keyWord};
        }

        let page = req.query.page || 1,pageurl = '/reach?'+'searchtype='+reachType+'&keyword='+keyWord+'&page=';
            
        pageHelper.pageQuery(page, pageurl , 10 ,jobModel, '', searchParm, {
            created_time: 'desc'
        }, function(error, $page){
            if(error){
                next(error);
            }else{
                response.render('backend/jobs/reach',{
                    title:"招聘信息搜索结果",
                    searchType:reachType,
                    keyWord:keyWord,
                    uri: $page.pageUri,
                    result: $page.results,
                    pageCount: $page.pageCount,
                    pageNumber: $page.pageNumber
                });
                //console.log($page);
            }
        });


        // if (reachType == 0) {
        //     jobModel.find({jobName: {$regex:keyWord}}, (err, result) => {
        //         if(err) return console.log(err)
        //         response.render('backend/jobs/reach', { result })
        //     })
        // } else {
        //     jobModel.find({depart: keyWord}, (err, result) => {
        //         if(err) return console.log(err)
        //         response.render('backend/jobs/reach', { result })
        //     })
        // }
    })

}
module.exports = routes;
