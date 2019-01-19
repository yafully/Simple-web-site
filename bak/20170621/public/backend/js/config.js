/****
 *Project:Lovevox company site
 *Anthor:YafullyZhao
 *Date:20170504
 *Version:1.0.0	
*****/

require.config({
	 //urlArgs: "version=20170501",
	 waitSeconds: 500,
	 paths: {
		//Global 
		jquery: "/backend/js/jquery",
		vue:"/backend/js/vue.min",
		"socket": '/socket.io/socket.io',
		lovevox_common:"/backend/js/lovevox_common",
		lovevox_core:"/backend/js/lovevox_core",
		lovevox_ui:"/backend/js/lovevox_ui",
		scrollbar:"/backend/js/scrollbar",

		xheditor:"/backend/js/xheditor-1.2.1",
		H:"/backend/js/H"

	},
	"shim": {
		//fotorama picture viewer
		H: {
			deps: ['jquery'],
			exports: 'jQuery.fn.highcharts'
		},
		xheditor: {
			deps: ['jquery'],
			exports: 'jQuery.fn.xheditor'
		}
	}
});