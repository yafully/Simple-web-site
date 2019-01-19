'use strict'
const chatuserModel = require('../modules/chatuserSetup');
const roomCheck = (req,res,next) => {
    // checkLogin
    let site = req.query.site || 'systemroom';
    let response = res;

    chatuserModel.findOne({roomname:site},function(err,doc){
        if(err){  
            //res.send(500);  
            req.session.error =  '网络异常错误！'; 
            response.send({status: 'error',message:'网络异常错误！'});
            console.log(err);
            return;  
        }
        if(!doc){
            //如果不存在房间
            console.log('新建房间！');
            // var newRoom = new chatuserModel({
            //   room:{
            //     roomname:site
            //   }
            // });
            var newRoom = new chatuserModel({
                roomname:site
            });

            // Saving it to the database.
            newRoom.save(function (err) {
                if (err) console.log ('Error on save!')
            });
        }
    });
    

    next();
}

module.exports = roomCheck;