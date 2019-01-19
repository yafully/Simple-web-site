var docBox,myBox;
define(['jquery','lovevox_core','lovevox_ui','H'],function ($){
	
	(function($) {
		docBox = $('html'),
		main = $('#main'),
		sidebar = $('#sidebar'),
		myBox = new ZUI.Box();

		//myProgress = new ZUI.Progress(),
		var Dropmenu = new ZUI.DropMenu(sidebar,{
			mselect:'.dropSec',
			msActiv:'active',
			mBody:'.dropBox',
			msHover: true,
			effects:{
				dEf:function(d,s,t){
					
					//d.fadeIn(t)
					//d.slideDown(t);
				},
				cEf:function(d,s,t){
					
					//d.fadeOut(t)
					//d.hide();
				},
				duration:100
			},
			onClick:function(targ,sec){
				
				if(!main.hasClass('menu_action') && ($(targ).is('h2')||$(targ).is('span'))){
					$(sec).toggleClass('active').siblings().removeClass('active');
				}
			},
			onHover:function(sec){
				return main.hasClass('menu_action');
			}
	    });


		
	    $(document).ready(function() {

			$('.menu_call').on('click',function(){
				main.toggleClass('menu_action');
			});


			// $('.scrollScope').scrollbar({
			// 	onScroll: function(maxScroll,scroll,size,visible){


			// 	}
			// });

			$('#logout').on('click',function(e){
				e.preventDefault();

				myBox.confirm('您确定要退出系统?',{
					boxtitle:'系统提示',
					textBoxBtnOk: '确 定', 
					textBoxBtnCancel: '取 消',
					callback:function(){
						window.location = '/logout';
					}
				});
			});

			//菜单
			sidebar.on('click','.sideuri',function(e){
				e.preventDefault();
				$('#mainframe').attr('src',$(this).attr('href'));
			});
		});
	})(jQuery);
});