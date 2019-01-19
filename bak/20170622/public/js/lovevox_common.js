var docBox,myBox;
define(['jquery','fullpage','lovevox_core','lovevox_ui','scrollbar','async!BMap'],function ($){
	
	(function($) {
		myBox = new ZUI.Box(),
		docBox = $('html'),
		baseUrl = '';
		var pics = [
			baseUrl + "images/menu01.jpg",
			baseUrl + "images/menu02.jpg",
			baseUrl + "images/menu03.jpg",
			baseUrl + "images/menu04.jpg",
			baseUrl + "images/menu05.jpg",
			baseUrl + "images/home.jpg",
			baseUrl + "images/bgv.png",
			baseUrl + "images/about_01.jpg",
			baseUrl + "images/product_sl01.jpg",
			baseUrl + "images/product_sl02.jpg",
			baseUrl + "images/product_bg01.png",
			baseUrl + "images/product_bg.png",
			baseUrl + "images/home_bg05.png",
			baseUrl + "images/home_bg04.png",
			baseUrl + "images/home_bg03.png",
			baseUrl + "images/productTit.svg"
		];
		$.imgpreload(pics,{
			all:function(){
				docBox.addClass('init');
			}
		});
		//myProgress = new ZUI.Progress(),


		var RegValid = new ZUI.Validator("contactFm",{
			ruleTag:'.validate',
			tagClass:'Vmsg',
			passClass:'',
			Qmode:false,
			autoSbmit:false,
			submitBtn:'#send',
			onSubmit: function(fm,err,btn){
				
				if(err>0){
				
				}else{
					$(btn).addClass('wait').prop('disabled',true);
					$.ajax({
						type: "POST",
						url: fm.attr('action'),
						dataType:'json',
						data: fm.serialize()
					})
					.done(function(data) {
						myBox.alert(data.message,{
	                        textBoxBtnOk:"确 定",
	                        onShow:function(a,b,c){
	                            if(data.status=='success')fm.clearForm();
	                        }
	                    });
					})
					.always(function(){
						$(btn).removeClass('wait').removeProp('disabled');
					});
				}
			}
		});

		
	    $(document).ready(function() {
			$('#fullpage').fullpage({
				verticalCentered: false,
				anchors: ['Start', 'Introduction', 'Product', 'Cooperation', 'Joinus'],
				//to avoid problems with css3 transforms and fixed elements in Chrome, as detailed here: https://github.com/alvarotrigo/fullPage.js/issues/208
				css3:true,
				fitToSection:false,
				scrollBar:$.device.m ? true : false,
				autoScrolling:$.device.m ? false : true,
				menu: '.menuTrigger',
				afterLoad: function(anchorLink, index){
					
					
					switch(anchorLink){
						case 'Start':
							$('.hmItem').addClass('active');
							$.fn.fullpage.setFitToSection(true,'internal');
						break;
						case 'Introduction':
							$('.abItem').addClass('active');
							$.fn.fullpage.setFitToSection(true,'internal');
						break;
						case 'Product':
							$('.proItem').addClass('active');
							$.fn.fullpage.setFitToSection(false,'internal');
						break;
						case 'Cooperation':
							$('.coopItem').addClass('active');
							$.fn.fullpage.setFitToSection(false,'internal');
						break;
						case 'Joinus':
							$('.joinItem').addClass('active');
							$.fn.fullpage.setFitToSection(false,'internal');
						break;
					}
				},
				onLeave: function(index, nextIndex, direction){
					$('#bgv')[index > 0 ? 'removeClass' : 'addClass']('hide');
					docBox.removeClass('menu_action');//pageAction
					//myBox.display(0);
					if(myBox.options.display==1)myBox.display(0);
					//console.log("onLeave--" + "index: " + index + " nextIndex: " + nextIndex + " direction: " +  direction);

				},
				afterSlideLoad: function(anchorLink, index, slideAnchor, slideIndex,slideNow,sliders){
					
					slideNow.find('.total').html('0'+sliders)
					slideNow.find('.current').html('0'+parseInt(slideIndex+1));
				},
				afterRender: function(){
					
				}
			});
			docBox.on('click touchstart','.active',function(){
				docBox.removeClass('menu_action');
			});

			
			//BuildPage
			var pageEvt = function(action,uri,style,target){
				var disWheel = !action;
				if(xhr && xhr.readyState != 4){
                    xhr.abort();
                }
				if(uri){
					xhr = $.ajax({
					  url: uri
					})
					.done(function(data) {
						$(target).html(data);
					});	
				}
				docBox[action ? 'addClass' : 'removeClass'](style);
				if(disWheel)$('.scrollScope').scrollTop(0);
				$.fn.fullpage.setAllowScrolling(disWheel);
			},xhr;

			$('body').on('click','.pageCall',function(e){
				e.preventDefault();
				var action = $(this).data('action') ? true : false,url = $(this).attr('href');
				pageEvt(action,url,'pageAction','#dataBox');
			});

			//招聘详情
			var jbxhr;
			$('body').on('click','.jobItem',function(e){
				e.preventDefault();
				var action = $(this).data('action') ? true : false,uri = $(this).attr('href'),disWheel = !action;;

				if(jbxhr && jbxhr.readyState != 4){
                    jbxhr.abort();
                }
				if(uri){
					// jbxhr = $.ajax({
					// 	url: uri,
					// 	type: 'get',
					// 	dataType: 'json',
					// 	cache: false,
     				//timeout: 5000
					// })
					// .done(function(data) {
					// 	console.log(data);
					// 	//$('#dataJoin').html(data.);
					// });	
					$.get(uri, function(data) {
					  //console.log(data);
					  $('#dataJoin').html(data);
					});
				}

				docBox[action ? 'addClass' : 'removeClass']('joinAction');
				if(disWheel)$('.scrollScope').scrollTop(0);
				$.fn.fullpage.setAllowScrolling(disWheel);
			});

			//分页
			$('#jobsBox').on('click','.pg',function(e){
				e.preventDefault();
				var uri = $(this).attr('href')
				$.get(uri, function(data) {
				  //console.log(data);
				  $('#jobsBox').html(data);
				});
			});


			$('.menuCall').on('click',function(){
				docBox.toggleClass('menu_action');
			});

			$('.scrollScope').scrollbar({
				onScroll: function(maxScroll,scroll,size,visible){


				}
			});

			// if($.device.m){
			// 	$('.joinScroll').scrollbar({
			// 		onScroll: function(maxScroll,scroll,size,visible){
			// 			$.fn.fullpage.setMouseWheelScrolling((maxScroll.scroll<=0 ||maxScroll.scroll >= maxScroll.maxScroll) ? true : false);
			// 		}
			// 	});
			// }


			$('.scrolldown').click(function(e){
				e.preventDefault();
				$.fn.fullpage.moveSectionDown();
			});

			//map
			var map = new BMap.Map("bmap");
	        var point = new BMap.Point(114.431755,30.478396);
	        map.centerAndZoom(point, 15);
	        var marker = new BMap.Marker(point);  // 创建标注
			map.addOverlay(marker);               // 将标注添加到地图中
			marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
			var opts = {
			  width : 200,     // 信息窗口宽度
			  height: 100,     // 信息窗口高度
			  title : "武汉乐薇贸易有限公司" , // 信息窗口标题
			  enableMessage:true,//设置允许信息窗发送短息
			  message:"~"
			}
			var infoWindow = new BMap.InfoWindow("地址：湖北省武汉市.洪山区.关南园四路东港科技产业园", opts);  // 创建信息窗口对象 
			marker.addEventListener("click", function(){          
				map.openInfoWindow(infoWindow,point); //开启信息窗口
			});
	         // 添加带有定位的导航控件
			var navigationControl = new BMap.NavigationControl({
			    // 靠左上角位置
			    anchor: BMAP_ANCHOR_TOP_LEFT,
			    // LARGE类型
			    type: BMAP_NAVIGATION_CONTROL_LARGE
			});
			map.addControl(navigationControl);

		});
	})(jQuery);
});