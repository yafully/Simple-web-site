/****
 *Magento EE Require set up config
 *Anthor:YafullyZhao
 *Date:20160725
 *Version:1.12	
*****/

require.config({
	 urlArgs: "version=20170420",
	 waitSeconds: 200,
	 paths: {
		//Global 
		jquery: "js/jquery",
		"socket": '/socket.io/socket.io',
		fullpage:"js/jquery.fullpage",
		vue:"js/vue.min",

		lovevox_common:"js/lovevox_common",
		lovevox_core:"js/lovevox_core",
		lovevox_ui:"js/lovevox_ui",
		scrollbar:"js/scrollbar",
		'BMap': ['http://api.map.baidu.com/api?v=2.0&ak=Uf6Mo59nXo7ZGbPsZXeiVPdX&services=&t=20150901171226'],
		async: 'js/async'

	},
    shim: {
        'BMap': {
            deps: ['jquery'],
            exports: 'BMap'
        }
    }
});