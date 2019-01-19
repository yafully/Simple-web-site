'use strict'

const jobModel = require('../modules/jobSetup');
const contactModel = require('../modules/contactSetup');
const guestModel = require('../modules/guestSetup');

const pageHelper = require('../helper/pager');
const silly = require("silly-datetime");
//const util = require('util');//工具类

var guest = 0;


const routes = (app) => {
    //前台首页
    app.get('/', (req, res, next) => {
        let response = res;
        var page = req.query.page || 1,pageurl = '/ajaxlist?page=';

        //response.render('front/index', { title: '武汉乐薇贸易有限公司' })

        pageHelper.pageQuery(page, pageurl , 10 ,jobModel, '', {}, {
            created_time: 'desc'
        }, function(error, $page){
            if(error){
                next(error);
            }else{
                response.render('front/index',{
                    title: '乐薇 – 让婚礼充满喜悦',
                    uri: $page.pageUri,
                    result: $page.results,
                    pageCount: $page.pageCount,
                    pageNumber: $page.pageNumber
                });
                //console.log($page);
            }
        });

        //访客统计
        
        let guestip = req.ip;

        let day = new Date();
        let year = day.getFullYear(); 
        let month = day.getMonth() + 1;

        let today = year+"-"+month+"-"+day.getDate();
        let start = today + " 0:0:0";
        let end = today + " 24:0:0";
        

         guestModel.findOne({'guestIp':guestip,'date':{"$gte": start, "$lt": end}},function(err,doc){
            if(err) {//查询不到则表示今天没有访问写入数据
                //response.send({status: 'error'});
                res.send(500);  
                console.log(err); 
            }else if(!doc){    
                let newGuest = [{
                    frequency: 1,
                    guestIp:guestip,
                    date: new Date()
                    //new Date().toLocaleString()
                }];
                guestModel.create(newGuest, (err) => {
                    if(err) {
                        //response.send({status: 'error'});
                        console.log(err);
                        return; 
                    }

                    //console.log('Ip:'+ guestip);
                });
                console.log('查询不到则表示今天没有访问');
                return; 
            }else{
                console.log('你今天已经访问过了');
                //console.log(doc);
            }
            
         }); 
        
    });

    //招聘分页
    app.get('/ajaxlist',(req,res, next) =>{
        var page = req.query.page, pageurl = '/ajaxlist?page=';
        var data = {
            status:"error",
            data :"no data"
        };
        let response = res;

        pageHelper.pageQuery(page, pageurl , 10 ,jobModel, '', {}, {
            created_time: 'desc'
        }, function(error, $page){
            if(error){
                next(error);
            }else{

                response.render('front/jobs', {
                    uri: $page.pageUri,
                    result: $page.results,
                    pageCount: $page.pageCount,
                    pageNumber: $page.pageNumber
                });
            }
        });
    });

    //招聘详情
    app.get('/ajaxdetail',(req,res, next) =>{
        let jobId = req.query.id;
        var data = {
            status:"error",
            data :"no data"
        };
        let response = res;
        jobModel.find({'_id':jobId}, (err, result, res) => {
            if(err) {
                response.send(data);
                console.log(err);
                return;
            }
            data.status = "success";
            data.data = result[0];
            //response.send(data);
            console.log(data);
            response.render('front/jobdetail', {data});

        });
    });

    //联系我们
    app.post('/contact', function (req, res) {
        let response = res;
        let now = silly.format(new Date(), 'YYYY-MM-DD');


        // req.checkBody('contactname', 'Invalid contactname').notEmpty();
        // req.checkBody('mail', 'Invalid mail').isEmail();

        req.checkBody({
            'contactname':{
                notEmpty: {
                  errorMessage: '姓名能为空.'
                }
            },
            'mail':{
                isEmail: {
                  errorMessage: '请填写正确的邮箱地址.'
                }
            },
            'message':{
                isLength: {
                  options: [{ min: 1, max: 300 }],
                  errorMessage: '留言不能为空且长度小于300个字符.' // Error message for the validator, takes precedent over parameter message 
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
            let newContact = [{
                name: req.body.contactname,
                phone: req.body.telephone,
                email:req.body.mail,
                content:req.body.message,
                date:now
            }];
            contactModel.create(newContact, (err) => {
                if(err) {
                    response.send({status: 'error',message:'好像出了点小故障，提交失败.'});
                    console.log(err);
                    return; 
                }
                response.send({status: 'success',message:'感谢您的关注，我们会在稍后联系您.'});
            });
        });

        //console.log('req.body', req.body);
        
    });

    
}
module.exports = routes;
