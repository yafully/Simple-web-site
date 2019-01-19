'use strict'
//Discription：后台文件处理控制模块
//Author:YafullyZhao
//Date:20170428
//const adminModel = require('../modules/adminSetup');
//const guestModel = require('../modules/guestSetup');
//const pageHelper = require('../helper/pager');
var xl = require('node-xlrd');//读取
var excelPort = require('excel-export');//导出
var _ = require('lodash');
var fs = require('fs');
//var path = require('path');


const routes = (app) => {

    app.get('/file', function(req, res, next) {  

        if(!req.session.user){                     //到达/home路径首先判断是否已经登录  
            req.session.error = "请先登录"  
            res.redirect("/login");                //未登录则重定向到 /login 路径  
            return;
        }

        var path = 'public/a.xls';
        var datas = [];

        xl.open(path, function(err,bk){
            if(err) {console.log(err.name, err.message); return;}
            
            var shtCount = bk.sheet.count;
            for(var sIdx = 0; sIdx < shtCount; sIdx++ ){
                //console.log('sheet "%d" ', sIdx);
                //console.log('  check loaded : %s', bk.sheet.loaded(sIdx) );
                var sht = bk.sheets[sIdx],
                    rCount = sht.row.count,
                    cCount = sht.column.count;
                //console.log('  name = %s; index = %d; rowCount = %d; columnCount = %d', sht.name, sIdx, rCount, cCount);
                for(var rIdx = 0; rIdx < rCount; rIdx++){    // rIdx：行数；cIdx：列数
                    var data = {};
                    for(var cIdx = 0; cIdx < cCount; cIdx++){
                        try{
                            data['s'+cIdx] = sht.cell(rIdx,cIdx);
                            //console.log('  cell : row = %d, col = %d, value = "%s"', rIdx, cIdx, sht.cell(rIdx,cIdx));
                        }catch(e){
                            console.log(e.message);
                        }
                    }
                    datas[rIdx] = data;
                }
            }

            req.datas = datas;
            
            // _.sortBy(datas, function(item) {
            //     console.log(item[0]);
            //   return item[0];
            // });

            //console.log(_.map(_.sortByAll(datas, [0]), _.values));
            var a = _.sortBy(datas, function(item) {
              return item.s0;
            });

            console.log('=============');
            

            var filename = 'filename';  //只支持字母和数字命名

            var conf = {};
            conf.cols = [
               {caption:'列-1', type:'string', width:200},
               {caption:'列-2', type:'string', width:40},
               {caption:'列-3', type:'string', width:20},
               {caption:'列-4', type:'string', width:30}
            ];

            
            var array = [];

            var k = 0;
            a.forEach(function(value, index, arr) {
                
              if(value.s0 !=''){
                  array[k] = [value.s0.toString(),value.s1.toString(),value.s2.toString(),value.s3.toString()]
                  k++;
              }
            });
            console.log(array);
            // array[0] = [
            //     a[7].s0,
            //     a[7].s1,
            //     a[7].s2,
            //     a[7].s3
            // ];


            conf.rows = array;
            var result = excelPort.execute(conf);

            var random = Math.floor(Math.random()*10000+0);

            var uploadDir = 'public/';
            var filePath = uploadDir + filename + random + ".xlsx";

            fs.writeFile(filePath, result, 'binary',function(err){
                if(err){
                    console.log(err);
                }
            });

        });

        res.render('backend/file/index',{title:'乐薇网站管理系统',user:req.session.user});         //已登录则渲染home页面  
    });

}
module.exports = routes;