'use strict'
//检测聊天用户的session
const auth_chat = (req,room) => {
    let status = (typeof req.session.chatauth !='undefined' && req.session.chatauth[room] !='undefined') ? 
    req.session.chatauth[room] : false;
    return status;

}

module.exports = auth_chat;