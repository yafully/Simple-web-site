'use strict'
const chatuserModel = require('../modules/chatuserSetup');
const statusSetUp = (room,oMail,oName,req,res,updateOnly) => {
    let request = req;
    let response = res;
    let sessionObj = typeof req.session.chatauth != 'undefined' ? req.session.chatauth : {};//如果session里面不存在房间容器则创建
        sessionObj[room] = {};//单个用户可能有多个房间session
        sessionObj[room].name = oName;
        sessionObj[room].chatuser = oMail;
    //res.cookie('sessionId',req.session.id,{maxAge:600000,path:'/'});

    chatuserModel.updateOne({"roomname":room,'users.email': oMail}, {'$set': {'users.$.name': oName,'users.$.status': true}},function(err,doc){      
        if(err){ 
            console.log(err);
        }else{ 
            if(!updateOnly){
            //console.log(oName+ "  is  up");
                
                request.session.chatauth = sessionObj;

                response.send({status: 'ok',message:'User login.',chatuser:oName});
            }
        }

    });
}

module.exports = statusSetUp;