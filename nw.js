let Service = require('node-windows').Service;  
  
let svc = new Service({  
  name: 'node_lovevox',    //服务名称  
  description: '公司网站', //描述  
  script: 'C:/wwwroot/lovevox2017/bin/www' //nodejs项目要启动的文件路径  
});  
  
svc.on('install', () => {  
  svc.start();  
});  
  
svc.install();  