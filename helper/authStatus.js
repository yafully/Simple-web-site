'use strict'
//检测聊天用户的session
const auth_chat = (req,room) => {
    var status = false;
    if(typeof req.session.chatauth !='undefined'){
    	if(req.session.chatauth[room] !='undefined'){
    		status = req.session.chatauth[room];
    	}else{
    		status = false;
    	}
    }else{
		status = false;
    }

    return status;

}

module.exports = auth_chat;