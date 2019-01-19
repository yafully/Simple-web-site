'use strict'

const guestModel = require('../modules/guestSetup');
const pageHelper = require('../helper/pager');
const silly = require("silly-datetime");
const async = require('async');

const routes = (app) => {

    //联系我们管理首页
    // app.get('/home', (req, res, next) => {
    //     if(!req.session.user){                     //session 判断
    //         req.session.error = "请先登录"  
    //         //res.redirect("/login");                //未登录则重定向到 /login 路径  
    //         res.send('<script>window.parent.location="/login";</script>');
    //     }

    //     let response = res;

    //     var page = req.query.page || 1,pageurl = '/contactlist?page=';

    //     pageHelper.pageQuery(page, pageurl , 10 ,contactModel, '', {}, {
    //         created_time: 'desc'
    //     }, function(error, $page){
    //         if(error){
    //             next(error);
    //         }else{
    //             response.render('backend/contacts/index',{
    //                 uri: $page.pageUri,
    //                 result: $page.results,
    //                 pageCount: $page.pageCount,
    //                 pageNumber: $page.pageNumber
    //             });
    //             //console.log($page);
    //         }
    //     });

    // });

    //详情查看
    app.get('/home',(req,res, next) =>{
        if(!req.session.user){                     //session 判断
            req.session.error = "请先登录"  
            //res.redirect("/login");                //未登录则重定向到 /login 路径  
            res.send('<script>window.parent.location="/login";</script>');
            return;
        }

        //统计当天访问量和历史总访问量
        let response = res;
        let day = new Date();
        let year = day.getFullYear(); 
        let month = day.getMonth() + 1;

        let today = year+"-"+month+"-"+day.getDate();
        let start = today + " 0:0:0";
        let end = today + " 24:0:0";

        let startM = new Date(year+"-"+month+"-01 0:0:0").valueOf();
        var endM = new Date(year + '-' + month + '-' + new Date(year,month,0).getDate() + " 24:0:0").valueOf();
        // console.log(startM);
        // console.log(endM);

        var totals = {
            day: 0,
            all: 0
        };

        // guestModel.count(
        // {
        //     "date": {"$gte": start, "$lt": end}
        // }, (err, count, res) => {
        //     if(err) return console.log(err)
        //     response.render('backend/home/index', { count })

        // });

        async.parallel({//并行处理以下3个方法
            countToday: function (done) {  // 统计当天数量
                guestModel.count({
                    "date": {"$gte": start, "$lt": end}
                })
                .exec(function (err, count) {
                    done(err, count);
                });
            },
            countAll: function(done){
                guestModel.count({})
                .exec(function (err, count) {
                    done(err, count);
                });
            }
            ,
            everyDay: function(done){
                guestModel.aggregate([
                    { $match : { date : { "$gt": new Date(startM), "$lt": new Date(endM) } } },//获取当月数据并且按天分组统计，注意这里不能像数据库视图里面直接查询ISOdate必须转化
                    {
                        $project : {
                            day : {$substr: [{"$add":["$date", 28800000]}, 0, 10] }//时区数据校准，8小时换算成毫秒数为8*60*60*1000=288000后分割成YYYY-MM-DD日期格式便于分组
                        },
                    },
                    {
                        $group : {
                            _id : "$day", 
                            total : {$sum : 1}
                        }
                    },
                    {
                        $sort: {_id: 1}//根据date排序
                    }
                ])
                .exec(function (err, turnover){//返回结果
                    done(err, turnover);
                });
            }

        }, function (err, results) {
            totals.day = results.countToday;
            totals.all = results.countAll;
            totals.everyDay = results.everyDay;
            console.log(totals.everyDay);
            response.render('backend/home/index', { 
                title:"网站统计",
                totals: totals
            })
        });
    });


}
module.exports = routes;
