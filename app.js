const express = require('express');
const path = require('path');//路径模块

const favicon = require('serve-favicon');
const logger = require('morgan');

const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');//Session
var RedisStore = require('connect-redis')(session);//载入redis session中间件
const expressValidator = require('express-validator');//验证
const translate = require('./helper/translate');

const routes = require('./routes/index');
const chats = require('./routes/chats');

const rt_Adm_home = require('./routes/adm_home');
const rt_Adm_user = require('./routes/adm_user');
const rt_Adm_contact = require('./routes/adm_contact');
const rt_Adm_job = require('./routes/adm_job');
const rt_Adm_chat = require('./routes/adm_chat');

const rt_Adm_file = require('./routes/adm_fileconvert');

const rt_notfound = require('./routes/notfound'); 

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(expressValidator({
 customValidators: {
    phonecn: function(value) {
        return Array.isArray(value);
    }
 }
}
));
//部署session

//配置Redis
var sessionStore = new RedisStore({
    host:'127.0.0.1',
    port:'6379',
    db:1  //此属性可选。redis可以进行分库操作。若无此参数，则不进行分库
});


app.use (session({  
  secret:'secret', 
  key: 'exSid',	
  store:sessionStore, 
  cookie:{  
      maxAge:60000//1000*60*30  
  },
  resave: true, // 是否允许session重新设置，要保证session有操作的时候必须设置这个属性为true
  saveUninitialized:false,//是否设置session在存储容器中可以给修改
  rolling: true   //是否按照原设定的maxAge值重设session同步到cookie中，要保证session有操作的时候必须设置这个属性为true
  //session过期30分钟，没有人操作时候session 30分钟后过期，如果有人操作，每次以当前时间为起点，
  //使用原设定的maxAge重设session过期时间到30分钟只有这种业务场景必须同行设置resave rolling为true.
  //同时saveUninitialized要设置为false允许修改。
}));  

app.use(function (req,res,next) {  
    res.locals.user = req.session.user;//从session获取user对象
    res.locals.chatuser = req.session.chatuser;//从session获取user对象
    var err = req.session.error;//获取错误信息  
    delete req.session.error;  
    res.locals.message = "";//展示信息的message  
    if(err){  
      res.locals.message = '<div class="alert alert-danger" style="margin-bottom:20px;color:red">'+err+'</div>';  
    }  
    next();//中间件传递  
});
//部署翻译

const setLang = (req, res, next) => {//手动设置翻译
    //res.setLocale('zh-CN');
    if(req.url.indexOf('chatindex')>0 && req.query.lang){
        res.setLocale('en-US');
    }
    next();
};
app.use(translate);
//app.use(setLang);
//前台
routes(app);

//Dashebord
rt_Adm_home(app);
//用户
rt_Adm_user(app);
//后台联系我们
rt_Adm_contact(app);
//后台招聘
rt_Adm_job(app);
//后台聊天管理
rt_Adm_chat(app);
//文件转换
rt_Adm_file(app);
//Chats
chats(app);
//404
rt_notfound(app);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
