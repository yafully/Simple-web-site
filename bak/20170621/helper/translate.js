const i18n = require('i18n');

i18n.configure({
  // setup some locales - other locales default to en silently
  locales:['en-US', 'zh-CN'],  // setup some locales - other locales default to en_US silently

  //defaultLocale: 'zh-CN',

  // where to store json files - defaults to './locales' relative to modules directory
  directory: __dirname + '/lang',

  
  // sets a custom cookie name to parse locale settings from  - defaults to NULL
  cookie: 'lang',
});

module.exports = function(req, res, next) {
    //console.log(req.url+'客户端2');
    //console.log(req.query.lang+'客户端2');
    
    i18n.init(req, res);

  //res.local('__', res.__);


  let current_locale = i18n.getLocale();
  if(req.url.indexOf('chatindex')>0 && req.query.lang){//如果来路带有lang信息则设置语言否则自动语言
      let lang;
      switch(req.query.lang){
        case 'en':
          lang = 'en-US';
        break;
        case 'zh':
        default:
          lang = 'zh-CN';
        break;
      }
      res.setLocale(lang);
      
  }
  //console.log(current_locale);
  console.log('========');
  return next();
};