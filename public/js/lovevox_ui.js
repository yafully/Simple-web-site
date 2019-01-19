define(['jquery','lovevox_core'],function ($){
	
$H = ZUI.Hash = new $.Class({
	options:{
	},

	initialize: function(data,options) {
		this.options = $.extend({},this.options, options);
		var data = data || {};
		this.hash = $.isPlainObject(data) ? data : $.parseJSON(data);
	},
	exists: function(key){
	   return this.hash.hasOwnProperty(key);
	},
	get: function(key){
		return this.exists(key)?this.hash[key]:null;
	},
	set: function(key, value){
		this.hash[key] = value;
	},
	keys:function(){
		
	}

});

Template = ZUI.Template = new $.Class({

	Pattern: /(^|.|\r|\n)(#\{(.*?)\})/,
	initialize: function(template, pattern) {
		this.template = template.toString();
		this.pattern = pattern || this.Pattern;
		
	},

	evaluate: function(object) {
		if (object && $.isFunction(object.toTemplateReplacements))
		  object = object.toTemplateReplacements();
	
		return $.string.gsub(this.template,this.pattern, function(match) {
		  if (object == null) return (match[1] + '');
	
		  var before = match[1] || '';
		  if (before == '\\') return match[2];
	
		  var ctx = object, expr = match[3],
			  pattern = /^([^.[]+|\[((?:.*?[^\\])?)\])(\.|\[|$)/;
	
		  match = pattern.exec(expr);
		  if (match == null) return before;
	
		  while (match != null) {
			var comp = match[1].startsWith('[') ? match[2].replace(/\\\\]/g, ']') : match[1];
			ctx = ctx[comp];
			if (null == ctx || '' == match[3]) break;
			expr = expr.substring('[' == match[3] ? match[1].length : match[0].length);
			match = pattern.exec(expr);
		  }
	
		  return before + $.string.interpret(ctx);
		});
	}
});

	
ZUI.Overlay = new $.Class({
	options : {
		color: '#000',
		opacity: 0.5,
		effect: 'ease',
		zIndex:1000,
		container:null,
		closeOnClick: true,
		duration:300,
		monitor:false,//监听容器变化
		onOpen:$.noop,
		onHide:$.noop,
		onClick:$.noop
	}, // end defaults
	initialize: function(options) {
		this.options = $.extend({},this.options, options);

		this.container = this.options.container ? $(this.options.container) : 'body';
		var GID = 'over' + $.GUID();
		this.ovOpen = false;
		this.spa = $.support.aniEndEvt;
		//Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);


		var overlay = $('<div class="overlay" id='+GID+'></div>')
					  .css({
						background: this.options.color,
						opacity: 0,
						position: 'fixed',
						zIndex: this.spa?-1:this.options.zIndex,
						display: this.spa?'':'none',
						visibility:this.spa?'hidden':'visible',
						overflow: 'hidden',
						top:0,left:0,width:'100%',height:'100%',
						'-webkit-transition':'opacity '+this.options.duration+'ms '+this.options.effect,
						'transition':'opacity '+this.options.duration+'ms '+this.options.effect
					  });
				  
		$('body').append(overlay);
		this.overlay = $(overlay);
		this.fixSize();
		var self = this;
		this.overlay.bind('click', function(){
			$.fireEvent(self.options.onClick,[self.overlay,self]);
		});
		$(window).on('resize',function(){
			self.ovOpen && self.fixSize();
		});
	},
	fixSize: function(){
		this.overlay.css({
			top: this.container == 'body' ? 0 : this.container.offset().top ,
			left: this.container == 'body' ? 0 : this.container.offset().left ,
			width: this.container == 'body' ? '100%' : this.container.outerWidth(),
			height: this.container == 'body' ?  Math.max(document.documentElement.scrollHeight, document.body.scrollHeight) : this.container.outerHeight()
		});
	},
	open : function(){
		var self = this;
		
		if(!this.ovOpen){
			this.options.monitor && this.fixSize();
			
			this.spa ?
			this.overlay.css({zIndex: this.options.zIndex,opacity: this.options.opacity,'-webkit-transform': 'translateY(0)',
						'transform': 'translateY(0)',visibility:'visible'})
			.one(self.spa,function(){
				self.ovOpen = true;
				$.fireEvent(self.options.onOpen,[self.overlay]);
			}):
			this.overlay.show().fadeTo(this.options.duration,this.options.opacity,function(){
				self.ovOpen = true;
				$.fireEvent(self.options.onOpen,[self.overlay]);
			});
			
		}
	}, 
	close : function(){
			var self = this;
			this.spa ?
			this.overlay.css({zIndex: -1,opacity: 0,'-webkit-transform': 'translateY(-100%)',
						'transform': 'translateY(-100%)',visibility:'hidden'})
			.one(self.spa,function(){
				self.ovOpen = false;
				$.fireEvent(self.options.onHide,[self.overlay])
			}):
			this.overlay.fadeOut(this.options.duration, function(){
				self.ovOpen = false;
				self.overlay.hide();
				$.fireEvent(self.options.onHide,[self.overlay]);
			});

	},
	toElement: function(){
		return this.overlay;
	}
});

/*
ASDUI.Box 
autor:Yafullyzhao
date:2010.10.25
last:2015.07.20
version:1.9
*/
ZUI.Box = new $.Class({
	Extends: [Events],
	options: {
		zIndex: 1000,
		onReturn: false,
		display: 0,
		width: 280,
		height: 180,
		Useoverlay: true,
		esc:false,
		aName:'zoomIn',
		//effect:'linear',
		duration: 300,

		onShowStart: function () {},
		onCloseStart: function () {},
		loadTxt:'',
		errorTxt:'',

		properties: {
			mywidth: 300,
			myheight: 200,
			boxtitle: '',
			textBoxBtnOk: '确 定',
			textBoxBtnCancel: '取 消',
			classBoxBtnOk:'button wt',
			classBoxBtnCancel:'button ga',
			loadTxt:null,
			clickHide:true,
			backinfo: '',
			password: false,
			auto: false,
			autoduration: 0,
			bar:null,
			onShow:$.noop,
			onClose:$.noop
		}
	},
	initialize: function (options) {
		this.i = 0;
		this.options = $.extend({},this.options, options);
		this.SID = $.GUID();
		this.boxInfo = {};
		this.closeCall = null;
		this.clickHide = false;
		this.clase = null;
		this.ani = $.support.ani;
		var boxId = 'Box' + this.SID,
			titleId = 'Btit' + this.SID,//标题ID
			closeId = 'Close' + this.SID,//关闭ID
			CondorId = 'Condor' + this.SID,
			InBoxId = 'Inbox' + this.SID,//Box主体ID
			InnerId = 'Inner' + this.SID,//内容容器ID
			BarId = 'Bar' + this.SID,//内容容器ID
			LoadId = 'Load' + this.SID;//loading ID
		
		var BoxCd = '<div class="ASDBox-InBoxTop"><div id="'+titleId+'" class="boxtile"></div></div><em class="closebtn" id="'+closeId+'"></em>';//Top
			BoxCd += '<div class="ASDBox-InBox" id="'+InBoxId+'"><div class="ASDBox-BoxContent" id="'+CondorId+'"><div id="'+InnerId+'"></div></div></div>';//Body
			BoxCd += '<div class="ASDBox-Buttons" id="'+BarId+'"></div>';
			BoxCd +='<div class="ASDloading" id="'+LoadId+'">'+this.options.loadTxt+'</div>';//Other
			
		
		this.Box = $("<div>",{
			'class': 'ASD_Abox',
			id: boxId,
			html: BoxCd,
			css:{
				'visibility':'hidden',
				'display':this.ani ? null : 'none',
				'zIndex': -1,
				'opacity':0,
				'position': 'fixed'				
			}
		}).appendTo("body");		
		

		var self = this;
		this.InBox = $('#'+InBoxId);
		this.boxtitle = $('#'+titleId);
		this.Contenedor = $('#'+CondorId);
		this.Content = $('#'+InnerId);
		this.BtnBox = $('#'+BarId);
		this.loadBg = $('#'+LoadId);  
		this.closebtn = $('#'+closeId)
		.on('click',function(){
			self.options.onReturn = false;
			self.display(0,self.options.onCloseStart,[$(this)]);
		});
		//$(window).resize($.proxy(function(){
			//this.replaceBox();
		//},this));
		this.options.esc && $(document).keydown(function(e){
			if (e.keyCode == 27) {
				self.Box.stopTime ('D');
				self.options.display == 1 && self.display(0);
				
			}
		});

		if(this.options.Useoverlay)
		this.Overlay = new ZUI.Overlay({
			Oclass:'overlay',
			color: '#000',
			duration: 300,
			zIndex:this.options.zIndex,
			opacity: 0.6,
			onClick: function(){
				self.clickHide && self.display(0);
			}
		});		
	},
	display: function (option,evt,target) {
		
		// Show Box	
		if (this.options.display == 0 && option != 0 || option == 1) {
			this.Overlay && this.Overlay.open();
			this.showBox(true);
			//this.fireEvent('onShowStart', [this.Overlay]);
		}
		// Close Box
		else {
			//$.fireEvent(this.options.onCloseStart, [this.boxInfo.type,this.boxInfo.message,this.Content]);
			this.showBox(false);
			this.clearBox();
			this.Overlay && this.Overlay.close();
			
			$.fireEvent(this.closeCall,[this.Box,this.boxInfo.type,this.boxInfo.message,this.Content]);
			
		}
		evt && $.fireEvent(evt,$.array.combine(target,[this.Box,this.boxInfo.type,this.boxInfo.message,this.Content]));
	},
	clearBox:function(depth){
		var p = this.boxInfo.prop,barSty = p.barClass ? p.barClass:'';
		if(depth)this.options.display = 2;

		switch(this.boxInfo.type){
			case 'myframe':
				this.ifram.attr({src: 'about:blank'}).remove();
			break;
			case 'myhtml':

		        var tar = this.boxInfo.message;
		        if(typeof tar=="string"){
			        var isId = tar.match(/^#/)==null ? false : true;
			        if(isId){
			          $(tar).appendTo($(tar+'_back'));
			        }
		    	}
			break;
		}
		this.Content.empty();
		this.BtnBox && this.BtnBox.empty();
		this.loadbar(0);
		this.Box.removeClass('ASDBox-bh ASDBox-b '+barSty);
		
	},
	showBox: function(opt){
		this.options.display = opt ? 1 : 0;
		this.Box.css({'zIndex':opt ? this.options.zIndex+2 : -1,'visibility':opt ? 'visible' : 'hidden','display':opt ? 'block':'none','opacity':opt ? 1:0});
		opt && this.replaceBox();
		
	},
	loadbar: function (option,txt) {
		option ? this.loadBg.show().html(txt ? txt : this.options.loadTxt) : this.loadBg.hide();
	},
	replaceBox: function () {
		if(this.options.display != 1) return;
		this.Box.cmPos();
	},

	toolBar: function(type,properties){
		
			
			switch (type) {
				case 'alert':
					this.BtnOk = $('<button/>', {
						'class': properties.classBoxBtnOk,
						type: 'button',
						html:  properties.textBoxBtnOk ? properties.textBoxBtnOk : this.options.properties.textBoxBtnOk
					}).appendTo(this.BtnBox);			
					this.Box.addClass('ASDBox-b');
					break;

				case 'prompt':
				case 'confirm':

					this.BtnOk = $('<button/>', {
						'class': properties.classBoxBtnOk,
						type: 'button',
						html: properties.textBoxBtnOk ? properties.textBoxBtnOk : this.options.properties.textBoxBtnOk
					}).appendTo(this.BtnBox);
					this.BtnCancel = $('<button/>', {
						'class': properties.classBoxBtnCancel,
						'type': 'button',
						html: properties.textBoxBtnCancel ? properties.textBoxBtnCancel : this.options.properties.textBoxBtnCancel
					}).appendTo(this.BtnBox);
					this.Box.addClass('ASDBox-b');
				   break;

				default:
				 if($.isFunction(properties.bar)){
					this.BtnBox.append(properties.bar.apply(this,[this.Content,properties,this]));
				 	this.Box.addClass(properties.barClass ? properties.barClass : 'ASDBox-b');	
				 }else{
					
				 	this.Box.addClass(properties.barClass ? properties.barClass : 'ASDBox-bh');
				 }

				 
				break;	
			}
		},	
	getTitle: function(){
		return this.boxtitle;
		},	
	getContent: function(){
		return this.Contenedor;
		},
	getFrame: function(){
		return this.ifram.contents();
		},
	getFrameName: function(){
		return this.ifram.name;
	},		
	messageBox: function (type, message, properties) {
			var properties = $.extend({},this.options.properties, properties);
			if(this.options.display==1 && !properties.depth)return;
			properties.depth && this.clearBox(properties.depth);
			this.boxInfo.type = type;
			this.boxInfo.message = message;
			this.boxInfo.prop = properties;
			this.closeCall = properties.onClose;
			this.clickHide = properties.clickHide;
			var time = properties.duration || this.options.duration,self = this;
			
			
			this.boxtitle.html(properties.boxtitle);
			this.toolBar(type,properties);//创建底部toolbar
			this.Box.css({
				width: properties.mywidth ? properties.mywidth : this.options.width,
				height: properties.myheight ? properties.myheight : this.options.height,
				'-webkit-animation-duration':this.ani ? time+'ms':null,
				'animation-duration':this.ani ? time+'ms':null
				
			}).addClass(properties.aName||this.options.aName);
			this.Content.attr('class', type);
			if (properties.autoduration > 0 && this.options.display !== 0 || properties.autoduration > 0 && this.options.display == 0) {
				this.options.onReturn = true;

				
				this.Box.oneTime(properties.autoduration+'ms','D',function() {
					self.display(0);
				});
			}
			properties.auto ? this.closebtn.hide() : this.closebtn.show();
			//\\toolbar	 
			switch (type) {
			case 'alert':
				{
					this.BtnOk.on('click',function(){
						self.options.onReturn = true;
						self.display(0,properties.callback,[this.BtnOk]);
					});
					this.Content.html(message);
					this.display(1,properties.onShow,[this.BtnOk]);
					
					break;
				}
			case 'confirm':{
					this.BtnOk.on('click', function(){
						self.options.onReturn = true;
						self.display(0,properties.callback,[self.BtnOk,self.BtnCancel]);
					});

					this.BtnCancel.on('click', function(){
						self.options.onReturn = false;
						self.display(0,properties.onCancel,[self.BtnOk,self.BtnCancel]);
					});
					this.Content.html(message);
					this.display(1,properties.onShow,[this.BtnOk,this.BtnCancel]);
					
					break;
				}
			case 'prompt':{
					this.PromptInput = $('<input/>', {
						type: this.options.properties.password ? 'password' : 'text',
						val: '',
						css: {
							'width': '250'
						}
					});

					this.BtnOk.on('click',function(){
						self.options.onReturn = true;
						$.fireEvent(properties.callback,[self.PromptInput.val(),self]);
					});

					this.BtnCancel.on('click',function(){
						self.options.onReturn = false;
						self.display(0);
					});

					this.Content.html(message + '<br />');
					this.PromptInput.appendTo(this.Content);
					$('<br/>').appendTo(this.Content);
					this.display(1);
					break;
				}
			case 'flash':
				{
					$.swf.create(this.Content,{id:'myswf',url:message,width:'100%',height:'100%',bgcolor:'#fff'});
					this.display(1);
					break;
				}
			case 'myhtml':
				{
					if(typeof message=="string"){
						var isId = message.match(/^#/)==null ? false : true;
						if(isId){
							$(message).parent().attr('id',message.replace('#','')+'_back').end().appendTo(this.Content);
						}else{
							this.Content.append(message);
						}
					}else{
						this.Content.append(message);
					}
					this.display(1,properties.onShow,[this.Content]);
					break;
				}

			case 'myframe':
				{
					this.ifram = $('<iframe>', {
					   src: message,
					   id: 'Frame' + this.SID,
					   'class':'YFrame',
                       name: 'myframes' + this.SID,
					   frameborder: 0,
					   allowTransparency: 'true',
					   load: function(){
						   self.loadbar(0);
					   }
					}).appendTo(this.Content);
					
					this.display(1,properties.onShow,[this.ifram]);
					this.loadbar(1,properties.loadTxt);
					break;
				}
			case 'myAjax':
				{
					var obj02 = $('<div>', {
						'class': properties.inClass
					}).appendTo(this.Content);
					
					$.ajax({
						url: message,
						data: properties.params || {},
						method: properties.method || "GET",
						beforeSend:function(){
							self.loadbar(1,properties.loadTxt);
						}
					})
					.done(function(){ })
					.fail(function(){
						obj02.remove();
						self.loadbar(0);
						//self.myMessage('加载出了点问题T T',{mywidth:'400',myheight:'120',Mstyle:'Yerro',boxtitle:'Erro'});
						$.fireEvent(properties.onErro,[data,obj02,self]);
					})
					.always(function(data){ 
						
						$.fireEvent(properties.onSuccess,[data,obj02,self]);
						self.loadbar(0);
					});
					this.display(1,properties.onShow,[obj02]);
					
					break;
				}
			case 'myMessage':
				{
					var obj03 = $('<div>', {
						'class': properties.Mstyle,
						html:'<div>'+message+'</div>'
					}).appendTo(this.Content);
					$.fireEvent(properties.callback,[obj03,this.Content]);
					obj03.on('click',function(){
						self.options.onReturn = false;
						
						self.Box.stopTime ('D');
						self.display(0);
						
					});
					this.display(1,properties.onShow,[obj03]);
					break;
				}
			case 'custom':	
			default:
				{
					
					this.display(1,properties.onShow,[this]);
				}

			}

	},
	alert: function (message, properties) {
		this.messageBox('alert', message, properties);
	},
	confirm: function (message, properties) {
		this.messageBox('confirm', message, properties);
	},

	prompt: function (message, properties) {
		this.messageBox('prompt', message, properties);
	},
	flash: function (message, properties) {
		this.messageBox('flash', message, properties);
	},
	myhtml: function (message, properties) {
		this.messageBox('myhtml', message, properties);
	},
	myframe: function (message, properties) {
		this.messageBox('myframe', message, properties);
	},
	myAjax: function (message, properties) {
		this.messageBox('myAjax', message, properties);
	},
	myMessage: function (message, properties) {
		this.messageBox('myMessage', message, properties);
	},
	custom: function (message, properties) {
		this.messageBox('custom', message, properties);
	}
});

/*
---
Class:Image zoomer Ver.1.0
date:20140707
description: inline&outline image zoomer
TODO:preload
authors:
- YafullyZhao
...
*/
ZUI.ImgZoom = new $.Class({
	options : {
		zoomBig:null,
		zoomState:null,
		zoom:1.5,
		zoomRange:"1,4",
		zoomStep:0.5,
		zoomClass:'he-view-show',
		zoomOut:false,
		outSize:null,
		skew:{x:0,y:0},
		pos:'east',
		onOpen:$.noop,
		onHide:$.noop
	}, // end defaults
	initialize: function(zoomBox,options) {
		this.options = $.extend({},this.options, options);
		this.zoomBox = typeof zoomBox =='string' ? $('#'+zoomBox) : zoomBox;
		this.zoomBig = this.options.zoomBig ? $('#'+this.options.zoomBig) : this.zoomBox.find("div");
		this.zoomState = this.options.zoomState ? $('#'+this.options.zoomState) : $('<span class="he-zoomstate"></span>').appendTo(this.zoomBig);
		this.zoom = this.options.zoom;
		this.zoomBox.on({
			'mousewheel':$.proxy(function(e,delta, deltaX, deltaY){
				e.preventDefault();
				this.changeZoom(this.zoomBig,e,delta,deltaX,deltaY);
			},this),
			'mouseenter':$.proxy(function(){
				this.zoomBig.addClass(this.options.zoomClass);
				$.fireEvent(this.options.onOpen,[this.zoomBox,this.zoomBig]);
		   },this),
			'mouseleave':$.proxy(function(){
				this.zoomBig.removeClass(this.options.zoomClass);
				$.fireEvent(this.options.onHide,[this.zoomBox,this.zoomBig]);
		   },this)
		
		});
		
		if(this.options.zoomOut){
			this.options.pos && this.zoomBig.flpos(this.zoomBox,this.options.pos,this.options.skew.x,this.options.skew.y);

			this.zoomBox.on('mousemove',$.proxy(function(e){
				this.moveZoom(this.zoomBig,e);
			},this));
			this.zoomBig.css({
				'width':this.options.outSize ? this.options.outSize.width : this.zoomBox.width(),
				'height':this.options.outSize ? this.options.outSize.height : this.zoomBox.height()
			});
		}else{
			this.zoomBig.on('mousemove',$.proxy(function(e){
				this.moveZoom(this.zoomBig,e);
			},this));	
		}
	},
	moveZoom:function(obj,e){

		var h =obj.height(),
		w=obj.width(),
		t= this.options.zoomOut ? e.pageY-this.zoomBox.offset().top : e.pageY-obj.offset().top,
		l= this.options.zoomOut ? e.pageX-this.zoomBox.offset().left: e.pageX-obj.offset().left;
		var $largeImg = obj.find("img");
		if(this.zoom && this.zoom!="auto"){
			var zoomNum = parseFloat(this.zoom);
			$largeImg.css({"width":w*zoomNum,"height":h*zoomNum,"top":-t*(zoomNum-1),"left":-l*(zoomNum-1)});
		}else{
			var zoomNum = $largeImg.width()/w;
			$largeImg.css({"top":-t*(zoomNum-1)+"px","left":-l*(zoomNum-1)+"px"});
		}
	},
	changeZoom:function(obj,e,delta, deltaX, deltaY){
		var $largeImg = obj.find("img");
		var currentZoom = this.zoom=="auto" ? $largeImg.width()/obj.width() : parseFloat(this.zoom);

		var zoomStep = this.options.zoomStep;
		var zoomRange = this.options.zoomRange.split(",");
		var zoomMin = parseFloat(zoomRange[0]),zoomMax = parseFloat(zoomRange[1])>currentZoom ? parseFloat(zoomRange[1]):currentZoom;
		var op = deltaY>0?1:-1;
		var	nextZoom =Math.round((currentZoom+zoomStep*op)*10)/10.0;
		if(nextZoom >=zoomMin && nextZoom <=zoomMax){
			this.zoom = nextZoom;
			this.showZoomState(obj,nextZoom);
			this.moveZoom(obj,e);
		}
		
	},
	showZoomState:function(obj,state){
		this.zoomState.text(state+"X").stop(true,true).fadeIn(300).delay(200).fadeOut(300);
	}
});//!Class
/*
---
ASDUI.Paging Class
author:YafullyZhao
date:2011.06.10
...

*/
ZUI.Paging = new $.Class({

		options:{       
			className:'paging',
			total:'total', //数据源中记录数属性
			limit:10, //每页记录数
			total_records:null,
			curPage:0,
			//el:控件容器,showNumber:是否显示数字按钮,showText:是否显示页码
			gap:3,
			showNumber:true,
			showText:true,
			showGoto:"select",
			filter:[10,20,30,50],
			display:null,
			cookie:null,
			onChange:$.noop,
			onFilter:$.noop,
			onLoad:$.noop
		},
		
		initialize: function(pageBox,options){        
			this.options = $.extend({},this.options, options);
			this.GUID = $.GUID();
			this.pageBox = $('#'+pageBox);
			 //当前页
			this.limit = this.options.limit;      
			this.head = $('<span class="'+this.options.className+'"></span>');
			
			this.pageBox.append(this.head);
			
			
			this.options.filter ? this.creatFilter(this.options.cookie) : this.load();		
		},
		
		load: function(options){ 
			this.options = $.extend({},this.options, options);
			this.index = this.index || 0;
			this.total = this.options.total_records;
			this.limit = this.options.limit;
			this.page = Math.ceil(this.total / this.limit); //总页数
			this.options.showGoto && this.creatGoto();
			
			this.options.curPage>0 ? this.goPage(this.options.curPage) : this.create();
	
		},
	  
		create: function(){
			
			this.head.empty();
			var prev = $('<a href="javascript:void(0)">上一页</a>');
			this.head.prepend(prev);
			      
			if(this.index<1){
				prev.removeClass('Pageprev').addClass('Pagedisprev');
			}else{
				prev.removeClass('Pagedisprev').addClass('Pageprev');	
				prev.bind('click',$.proxy(function(){
					this.goPage(this.index-1);
				},this));
			}  
			
			if(this.options.showNumber){
				
				var beginInx = this.index-this.options.gap<0?0:this.index-this.options.gap;
				var endIdx = this.index+this.options.gap>this.page?this.page:this.index+this.options.gap;

				if(beginInx>0) this.head.append(this.createNumber(0));
				if(beginInx>1) this.head.append(this.createNumber(1));
				if(beginInx>2) this.head.append(this.createSplit());        
				
				for(var i=beginInx;i<endIdx;i++){
					this.head.append(this.createNumber(i));
				}
				
				if(endIdx<this.page-2) this.head.append(this.createSplit());
				if(endIdx<this.page-1) this.head.append(this.createNumber(this.page-2));
				if(endIdx<this.page) this.head.append(this.createNumber(this.page-1));
				
			}   

			var next = $('<a href="javascript:void(0)">下一页</a>');
			this.head.append(next);
			if(this.index<this.page-1){
				next.removeClass('Pagedisnext').addClass('Pagenext');	
				next.bind('click',$.proxy(function(){
					
						this.goPage(this.index+1);
				},this));				
			}else{
				next.removeClass('Pagenext').addClass('Pagedisnext');	
				next.onclick = '';	
			}
			
			if(this.options.showText) this.head.append(this.createText()); 
			
			$.fireEvent(this.options.onLoad,[this.limit,this.page,this.total]);
			
		},
		creatFilter: function(cook){
			this.pgFt = $('<span id="filter'+this.GUID+'" class="pageFilter"></span>');
			var self = this;
			var pgkey = cook ? $.cookie.get(cook.key) : null;
			var ftPlay =pgkey || this.options.display || $.inArray(this.limit, this.options.filter);
			
			var ftNum='每页显示：';
			$.each(this.options.filter,function(i,el){
				ftNum += ftPlay== i ? '<a href="javascript:;" class="ftCurrent" data-num="'+el+'">['+el+']</a>' : '<a href="javascript:;" data-num="'+el+'">['+el+']</a>';
			});
			ftNum +='条';
			this.pgFt.append(ftNum).prependTo(this.pageBox);
			this.pgFt.on('click','a',function(e){
				e.preventDefault();
				var fa = $(this);
				self.index = 0;
				fa.addClass('ftCurrent').siblings().removeClass('ftCurrent');
				self.load({limit:fa.data('num'),curPage:0});
				cook && $.cookie.set(cook.key,fa.index(),{expires:cook.expires});//设置cookies
				$.fireEvent(self.options.onFilter,[self.limit,self.page,self.total]);//callback
			});
			
			this.load({limit:this.options.filter[ftPlay],curPage:0});
		},
		creatGoto:function(){
			if(this.pgGo){
				this.pgGo.empty();
			}else{
				
				this.pgGo = $('<span id="goto'+this.GUID+'" class="pageGoto"></span>').appendTo(this.pageBox);
			}
			var self = this;
			switch(this.options.showGoto){
				case 'input':
					var pageNumID = 'pgNum' + this.GUID;
					var pageBtnID = 'pgBtn' + this.GUID;
					this.pgGo.append('跳转到第 <input type="text" class="input" style="width:40px" id="'+pageNumID+'"/> 页 <input type="button" class="button" value="跳 转" id="'+pageBtnID+'"/>');
					$('#'+pageBtnID).on('click',function(){
							
							var num = $.trim($('#'+pageNumID).val());
							if(num>=1&&num<=self.getTotalPage()){
								self.goPage(num-1);
							}else{
								return false;
							}
					});
				break;
				case 'select':
					var pgSelID = 'pgSel' + this.GUID,pageSelNum = '跳转到第 <select id="'+pgSelID+'">';
					for (var i = 0; i < self.getTotalPage(); i++){
						pageSelNum += '<option value="'+ i +'">'+ (i+1) +'</option>';
					}
					pageSelNum +='</select> 页';
					this.pgGo.on('change','#'+pgSelID,function(){
						self.goPage($(this).val());
					});
					this.pgGo.append(pageSelNum);
				break;
				default:
				break;

			}			
		},
		createNumber: function(i){
			var a = $('<a href="javascript:;">'+(i+1)+'</a>');
			a.bind('click',$.proxy(function(){
				this.goPage(i);
			},this));
  
			if(i==this.index)a.addClass('clicked');
	
	
			if(this.index===this.page && (i==this.index-1))a.addClass('clicked');
			return a;
		},
		
		createSplit: function(){
			return $('<span>...</span>');
		},
		
		createText: function(){
			var nowPage = (this.index==this.page) ? this.index : this.index+1;
			return $('<span>...</span>').html('第'+nowPage+'/'+(this.page)+'页 | 共'+this.total+'条记录 | ');

		},
		goPage: function(num){
			this.index = num;
			this.create();
			$.fireEvent(this.options.onChange,[num,this.limit,this.page]);
		},
		reload: function(){
			this.index = 0;
			this.create();
		},
		getPage: function(){
			return this.index + 1;
		},
		getLastPage: function(){
			return this.total%this.limit;
		},
		getTotalPage:function(){
			return this.page
		}
});
/*
---ZUI.Rate
description: Star Rate Class Ver 1.0
authors:YafullyZhao
Date:20140709
...
*/
ZUI.Rate = new $.Class({
	options : {
		starSize:{x:23,y:20},
		rateBar:'dfn',
		/** Boolean vars **/
		step:false, // if true,  mouseover binded star by star,
		isDisabled:false, // if true, user could not rate
		
		canRateAgain : false, // if true, the user could rates {nbRates} times Default, 1 time
		sendRequest: true, // send values to server
		sendPath : 'php/rating.php', // path of the php file
		/** Integer vars **/
		length:5, // number of star to display
		skew:0,
		decimalLength : 0, // number of decimals.
		rateMax : 100, // maximal rate - integer from 0 to 9999 (or more)
		rateInfo:false, // show rates informations when cursor moves onto the plugin
		rateInfoClass:'rateInfo',
		nbRates : 1,

		/** Functions **/
		onSuccess : $.noop, // Fires when the server response is ok
		onError : $.noop, // Fires when the server response is not ok
		onRating: $.noop,
		onClick: $.noop, // Fires when clicking on a star	
		onRerate:$.noop		
	}, // end defaults
	initialize: function(els,options) {
		this.options = $.extend({},this.options, options);
		this.starWidth = this.options.starSize.x;
		this.containerWidth = this.options.starSize.x * this.options.length + this.options.skew;
		this.nbOfRates = this.options.nbRates;
		
		
		this.rate = $(els);
		this.rate.length > 1 ?
		this.rate.each($.proxy(function(i,el){
			this.doRate($(el));
		},this)) : this.doRate(this.rate);
		
	},
	reRate:function(el){
		el.removeClass('rateDis');
		el.next('.rateInfo').remove();
		el.find(this.options.rateBar).width(0);
		this.doRate(el);
		$.fireEvent(this.options.onRerate,[el]);
	},
	doRate:function(rateBox){
		var Disabled = (rateBox.hasClass('rateDis') || this.options.isDisabled ) ? true : false;
		
		var average = parseFloat(rateBox.data('average')), // get the average of all rates
		idBox = rateBox.data('id') || rateBox.attr('id'), // get the id of the box
		starWidth = this.starWidth,
		widthRatingContainer = this.containerWidth, // Width of the Container
		widthColor = average/this.options.rateMax * widthRatingContainer,
		globalWidth = 0,
		nbOfRates = this.nbOfRates;
		hasRated = false;
		
		var quotient = rateBox.find('em').width(widthColor);
		if(Disabled) return;
		var average = rateBox.find(this.options.rateBar);
		var jstar = rateBox.find('abbr');
		rateBox.css({width: widthRatingContainer,overflow:'hidden'});
		var infoBox = this.options.rateInfo ? this.rateInfo(rateBox,idBox) : null;
		var self = this;
		
		rateBox.on({
			'mouseover' : function(e){
				$(this).css('cursor','pointer');
			},
			'mouseout' : function(){
				$(this).css('cursor','default');

				if(hasRated) average.width(globalWidth);
				else average.width(0);
			},
			'mousemove' : function(e){
				var realOffsetLeft = self.findRealLeft(this);
				var relativeX = e.pageX - realOffsetLeft;
				if(self.options.step) newWidth = Math.floor(relativeX/starWidth)*starWidth + starWidth;
				else newWidth = relativeX;
				average.width(newWidth);

				$.fireEvent(self.options.onRating,[infoBox,self.getNote(newWidth),self.options.rateMax]);
			},
			'mouseleave' : function(){
				infoBox && infoBox.html(self.options.rateInfo);
			},
			click : function(e){
				var element = this;

				/*set vars*/
				globalWidth = newWidth;
				nbOfRates--;
				if(!self.options.canRateAgain || parseInt(nbOfRates) <= 0) $(this).unbind().css('cursor','default').addClass('rateDis');
				hasRated = true;
				e.preventDefault();
				var rate = self.getNote(newWidth);
				average.width(newWidth);


				$.fireEvent(self.options.onClick,[element,idBox,rate,nbOfRates]);

				if(self.options.sendRequest) {
					$.post(self.options.sendPath,{
							idBox : idBox,
							rate : rate,
							action : 'rating'
						},function(data) {
							data.error ? $.fireEvent(self.options.onError,[element,rate,data.server]) : $.fireEvent(self.options.onSuccess,[element,rate,data.server]);
						},'json');
					}
			}
		});
				
	},
	rateInfo:function(rateBox,idBox){
		$('<span>',{'class':''+this.options.rateInfoClass+' info'+idBox+'',html:this.options.rateInfo}).insertAfter(rateBox);
		return $('.info'+idBox);
	},
	findRealLeft:function(obj) {
		  if(!obj) return 0;
		  return obj.offsetLeft + this.findRealLeft(obj.offsetParent);
	},
	getNote:function(relativeX) {
		var widthRatingContainer = this.options.starSize.x * this.options.length;
		var noteBrut = parseFloat((relativeX*100/widthRatingContainer)*parseInt(this.options.rateMax)/100);
		var dec=Math.pow(10,parseInt(this.options.decimalLength));
		var note = Math.round(noteBrut*dec)/dec;
		return note;
	}
});

/*
---
script: PrArea.js
author:YafullyZhao
requires: 
  core:1.3: 
provides: [Print]
...
*/
ZUI.PrArea = new $.Class({				   
	options: {
		 area:null,
		 mode : 'popup',//iframe,popup,edit
		 popHt : 600,
		 popWd : 900,
		 prClass:'prArea',
		 popX : 0,
		 popY : 0,
		 popTitle : '打印预览',
		 Prurl : '',
		 popClose : false,
		 strict:false
		},
	initialize: function (options) {
		this.options = $.extend({},this.options, options);
			this.GID = $.GUID();
			this.Frid = "printArea_" + this.GID;
			this.btnId = "printBtn_" + this.GID;
			this.PrAid = "printBox_" + this.GID;
		
	},
	doPrint: function(element,mode){
			var elmt = element || this.options.area;
			var writeDoc;
			var printWindow;
			var mode = mode || this.options.mode;
			switch (mode){
				case 'iframe' :
					var f = this.Iframe();
					writeDoc = f.doc;
					printWindow = f.contentWindow || f;
					break;
				case 'popup' :
					printWindow = this.Popup();
					writeDoc = printWindow.doc;
					break;
				default:
					break;		
			}
			switch (mode){
				case 'iframe' :
				case 'popup' :
					writeDoc.open();
					writeDoc.write( this.docType() + "<html>" + this.getHead() + "<body>" + this.getBody($('#'+elmt)) + "</body></html>" );
					writeDoc.close();
		
					printWindow.focus();
					printWindow.print();
				break;
				case 'edit' :
					this.buildEdit(this.getBody($('#'+ elmt)),this.btnId,this.PrAid);
				break;		
			}
			
			if ( this.options.mode == 'popup' && this.options.popClose )
			printWindow.close();
			
		},
	docType: function(){
		if ( this.options.mode == "iframe" || !this.options.strict ) return "";

		var standard = this.options.strict == false ? " Trasitional" : "";
		var dtd = this.options.strict == false ? "loose" : "strict";

		return '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01' + standard + '//EN" "http://www.w3.org/TR/html4/' + dtd +  '.dtd">';
	},

	getHead: function(){
		var head = "<head><title>" + this.options.popTitle + "</title>";
		head += '<link type="text/css" rel="stylesheet" href="' + this.options.Prurl + '" media="all" >';	
		head += "</head>";
		return head;
	},

	getBody: function (printElement){
		return '<div class="' + this.options.prClass + '" id="' + this.PrAid + '">' + printElement.html() + '</div>';
	},

	Iframe: function(){
		var iframeStyle = 'border:0;position:absolute;width:0px;height:0px;left:0px;top:0px;';
		var iframe;

		try
		{
			iframe = document.createElement('iframe');
			document.body.appendChild(iframe);
			$(iframe).attr({ style: iframeStyle, id:this.Frid, src: "" });
			iframe.doc = null;
			iframe.doc = iframe.contentDocument ? iframe.contentDocument : ( iframe.contentWindow ? iframe.contentWindow.document : iframe.document);
		}
		catch( e ) { throw e + ". 您的浏览器不支持iframe."; }

		if ( iframe.doc == null ) throw "找不到document.";

		return iframe;
	},

	Popup: function (){
		var windowAttr = "location=yes,statusbar=no,directories=no,menubar=no,titlebar=no,toolbar=no,dependent=no";
		windowAttr += ",width=" + this.options.popWd + ",height=" + this.options.popHt;
		windowAttr += ",resizable=yes,screenX=" + this.options.popX + ",screenY=" + this.options.popY + ",personalbar=no,scrollbars=yes";

		var newWin = window.open( "", "_blank",  windowAttr );

		newWin.doc = newWin.document;

		return newWin;
	},
	buildEdit: function(prArea,btnId,element){
		if(!this.editBox)this.editBox = new ZUI.Box();
		this.editBox.myhtml(prArea,{
			mywidth:this.options.popWd,
			myheight:this.options.popHt,
			boxtitle:this.options.popTitle,
			bar:function(){
				$$('.noprint').hide();
				return [
				new Element('input', {
					  'id':btnId,
					  'type':'button',
					  'value':'打 印',
					  'class': 'button'
					})
				]
			}
		});
		$('#'+btnId).bind('click',$.proxy(function(){
			
			this.doPrint(this.options.edit ? this.editBox.getContent() : element,'iframe');//popup
		},this));
		
	}		
});
/*
description: TableHover class v1.2
authors: YafullyZhao
date:2014.06.20

provides: [ZUI.TabelHover]  
*/
ZUI.TabelHover = new $.Class({
	options:{
		allowHead : false,
		allowBody : true,
		allowFoot : false,

		headCols : false,
		bodyCols : true,
		footCols : false,
		spanCols : true,
		ignoreCols : [],

		rowClass : 'hover',
		colClass : null,
		cellClass : null,
		zebraClass:null,
		
		onHover:$.noop
	},
	initialize:function(table,options){
		this.options = $.extend({},this.options, options);
		
		this.table = $(table).get(0);
		if (!this.table.tBodies) return;
		this.loadTB(this.table);
		
	},
	loadTB: function(table){
			var tbl = table ? table : this.table; 
			this.colIndex = [];
			this.fixCellIndexes(tbl);

			//add header cells to index
			if (tbl.tHead){
				this.addToIndex(tbl.tHead.rows, 'THEAD');
			}
			//create index - loop through the bodies
			for ( r = 0; r < tbl.tBodies.length; r++ ){
				this.addToIndex(tbl.tBodies[r].rows, 'TBODY');
			}
			//add footer cells to index
			if ( tbl.tFoot ){
				this.addToIndex(tbl.tFoot.rows, 'TFOOT');
			}
			//$(tbl).bind('mouseover', over).bind('mouseout', out);
			$(tbl).on({
				'mouseover':$.proxy(function(e){
					this.over(e);
				},this),
				'mouseout':$.proxy(function(e){
					this.out(e);
				},this)
			});	
	},
	fixCellIndexes: function(table) {
		var rows = table.rows;
		var len = rows.length;
		var matrix = [];
		for ( var i = 0; i < len; i++ ){
			var cells = rows[i].cells;
			var clen = cells.length;
			
			for ( var j = 0; j < clen; j++ ){
				var c = cells[j];
				var rowSpan = c.rowSpan || 1;
				var colSpan = c.colSpan || 1;
				var firstAvailCol = -1;
				if ( !matrix[i] ){ 
					matrix[i] = []; 
				}
				var m = matrix[i];
				// Find first available column in the first row
				while ( m[++firstAvailCol] ) {}
				c.realIndex = firstAvailCol;
				c.realRow = i;
				for ( var k = i; k < i + rowSpan; k++ ){
					if (!matrix[k])matrix[k] = [];
					var matrixrow = matrix[k];
					for ( var l = firstAvailCol; l < firstAvailCol + colSpan; l++ ){
						matrixrow[l] = 1;
					}
				}
			}
		}
	},	
	addToIndex: function(rows, nodeName){
		var c, row, rowI, cI, rI, s;
		//loop through the rows
		for ( rowI = 0; rowI < rows.length; rowI++){
			row = rows[rowI];
			if($.browser.oldIE && nodeName == 'TBODY' && this.options.zebraClass) $(row)[((rowI % 2) ? 'remove' : 'add')+'Class'](this.options.zebraClass);//Zbra for IE6-8

			//each cell
			for ( cI = 0; cI < row.cells.length; cI++ ){
				c = row.cells[cI];
				//add do colindex
				if ((nodeName == 'TBODY' && this.options.bodyCols) || (nodeName == 'THEAD' && this.options.headCols) || (nodeName == 'TFOOT' && this.options.footCols)){
					s = c.colSpan;
					while ( --s >= 0 ){
						rI = c.realIndex + s;
						if ( $.inArray(rI + 1, this.options.ignoreCols) > -1 ){
							break;//dont highlight the columns in the ignoreCols array
						}
						if (!this.colIndex[rI]) this.colIndex[rI] = [];
						
						this.colIndex[rI].push(c);
					}
				}
				//allow hover for the cell?
				if ( (nodeName == 'TBODY' && this.options.allowBody) || (nodeName == 'THEAD' && this.options.allowHead) || (nodeName == 'TFOOT' && this.options.allowFoot) ){
					c.thover = true;
				}
			}
		}
	},
	over: function(e){
		var p = e.target;
		try{
			while ( p != this && p.thover !== true ){
				p = p.parentNode;
			}
		if (p.thover ===true )this.highlight(p, true);
		$.fireEvent(this.options.onHover,[p,p.realIndex,p.realRow]);
		}catch(err){};
		//because the IE7 8 can't get the thover some times
	},
	out: function(e){
		var p = e.target;
		try{
			while ( p != this && p.thover !== true ){
				p = p.parentNode;
			}
		if (p.thover === true)this.highlight(p, false);
			$.fireEvent(this.options.onOut,[p,p.realIndex,p.realRow]);
		}catch(err){};
	},
	highlight: function(cell, on){

		$.fn.tableHoverHover = on ? $.fn.addClass : $.fn.removeClass;
		//highlight columns
		var h = this.colIndex[cell.realIndex] || [], rH = [], i = 0, rI, nn;
		if (this.options.colClass != ''){
			while (this.options.spanCols && ++i < cell.colSpan && this.colIndex[cell.realIndex + i] ){
				h = h.concat(this.colIndex[cell.realIndex + i]);
			}
			$(h).tableHoverHover(this.options.colClass);
		}
		
		//highlight cell
		if (this.options.cellClass != ''){
			nn = cell.parentNode.parentNode.nodeName.toUpperCase();
			if (nn == 'TBODY')$(cell).tableHoverHover(this.options.cellClass);

		}
	},
	getCol:function(cell){
			var index = cell > -1 ? cell : $(cell).get(0).realIndex;
			var a = this.colIndex[index];
			return a;
	},
	getColNum:function(){
		return this.colIndex.length;
	}		
});//!class



/**
 * ASD.CR
 * @version		1.0
 * @author		YafullyZhao
 */
ZUI.CR = new $.Class({
	options: {
		Selector:"span.ASD_check",
		chkClass: "checked",
		chkOne:false,
		chkOneCancle:false,
		groupTag:'data-group',
		onCheck:$.noop,
		onUncheck:$.noop,
		onClick:$.noop
		
	},
	initialize: function(element,options){
		this.options = $.extend({},this.options, options);
		if(!element) return false;
		this.element = (typeof element == 'string') ? $('#'+element) : element;
		
		this.ckAll = false;
		this.master = [];
		this.allBox = [];
		var self = this;
		this.element.on("click", this.options.Selector, function(e){
				 e.stopPropagation();
				 var group = $(this).data('group');
				 
				 self.options.chkOne ? self.checkOne($(this)) : group ? self.check($(this),group) : self.check($(this));
				 
				 group && self.groupSatus(group);
				 $.fireEvent(self.options.onClick,[$(this)]);	
		}); 
		//this.getSatus();
	},
	check: function (el,gp){
		  
		  var data = el.data('ck'),mother = el.attr('rel'),g = gp||mother,sib = this.element.find("["+this.options.groupTag+"='" + g + "']"),m = this.element.find("[rel='" + gp + "']");
		  
		  switch(data){
			 case 0:
			 el.data('ck',1).addClass(this.options.chkClass);
			 
			 mother && sib.data('ck',1).addClass(this.options.chkClass);
			 
			 $.fireEvent(this.options.onCheck,[el,m,sib,g,mother]);
			 break;
			 case 1:
			 el.data('ck',0).removeClass(this.options.chkClass);
			 
			 mother && sib.data('ck',0).removeClass(this.options.chkClass);
			 $.fireEvent(this.options.onUncheck,[el,m,sib,g,mother]);
			 break;
			 case 2:
			 break;				 				 
		  }
		  
	},

	checkOne: function (el,gp){
		  var data = el.data('ck');
		 
		  switch(data){
			 case 0:

			 el.data('ck',1).addClass(this.options.chkClass).siblings(this.options.Selector).data('ck',0).removeClass(this.options.chkClass);

			 $.fireEvent(this.options.onCheck,[el]);	
			 break;
			 case 1:
			 if(this.options.chkOneCancle) {
				 el.data('ck',0).removeClass(this.options.chkClass);
				 
			 	 $.fireEvent(this.options.onUncheck,[el]);
			 }
			 break;			 				 
		  }
	},
	getSatus: function(){
		 this.element.find(this.options.Selector).each($.proxy(function(i,item){
			 if($(item).attr('rel')){
				 this.master.push($(item).attr('rel')); 
				 this.allBox.push($(item));
			 };
		 },this));

		 this.groupSatus();
	},//初始化状态获取
	groupSatus: function(gp){
		 
		 var self = this,OneGroup = this.element.find("["+this.options.groupTag+"='" + gp + "']"),OneMother = this.element.find("[rel='" + gp + "']");
		
		 var st = $.array.pick(OneGroup,function(item,i){
			 	
				return !$(item).hasClass('checked');
			});  
	     st ? OneMother.data('ck',0).removeClass(self.options.chkClass) : OneMother.data('ck',1).addClass(self.options.chkClass);
		 
		 $.fireEvent(this.options.onAll,[OneMother,st]);
	},//工作时状态获取
	getChecked: function (box){
		 var Ckbox = box ? $(box) : this.element;
		 var ckitem = [];
		 Ckbox.find('.'+this.options.chkClass).each(function(i,el){
			 
			 if(!$(el).attr('rel'))ckitem.push({name:$(el).text(),value:$(el).data('ck')});
			 
		 });
		 
		 return ckitem;
	},
	checkAll: function (el,mother){
		  var data = el.data('ck');
		  var m = $(mother) || el.parent();
		  var sib = m.fins(this.options.Selector);
		  switch(data){
			 case 0:
			 el.data('ck',1).addClass(this.options.chkClass);
			 sib.data('ck',1).addClass(this.options.chkClass);
			 
			 break;
			 case 1:
			 el.data('ck',0).removeClass(this.options.chkClass);
			 sib.data('ck',0).removeClass(this.options.chkClass);
			 m.data('ck',0);
			 break;
			 case 2:
			 break;				 				 
		  }
		  
	}	
});
//DatePicker Class
// ,Element.measure requerd
ZUI.Dp = new $.Class({
    options: {
		Dparea:null,
        CzIndex: 6000,
        Cwidth: $.device.m ? '90%' : 242,
        Cheight:'auto',
		hovClass:'dp_roll',
		secClass:'dp_selected',
		dayChars: 2,
		dayNames : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
		daysInMonth : [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
		format:'mm/dd/yyyy',
		monthNames : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
		mark:[],
		static:false,
		today:false,
		startDay: 7,
		yearOrder: 'asc',
		yearRange: 54,
		yearRangeLeft:0,
		yearStart: (new Date().getFullYear()) - 54,
		yearEnd:null,
		monthStart:null,
		monthEnd:null,
		dayStart:null,
		dayEnd:null,
		onSelect:$.noop,
		onChange:$.noop
		
    },
    initialize: function (els, options) {
        this.options = $.extend({},this.options, options);
        this.Boxon = $.GUID();
		this.tags = els;
		this.makeTime = this.options.format.length >10 ? true : false;
		this.month = this.year = null;
		this.Dparea = this.options.Dparea ? $ ('#'+this.options.Dparea) : $('body');
		this.options.monthNames = (this.options.monthNames && this.options.monthNames.length == 12 ? this.options.monthNames : this.options.monthNames) || this.options.monthNames; 
		this.options.daysInMonth = (this.options.daysInMonth && this.options.daysInMonth.length == 12 ? this.options.daysInMonth : this.options.daysInMonth) || this.options.daysInMonth; 
		this.options.dayNames = (this.options.dayNames && this.options.dayNames.length == 7 ? this.options.dayNames : this.options.dayNames) || this.options.dayNames;
        	this.dpBox = this.options.static ? $('#'+this.options.static) : $('<div>', {'class': 'ASDBox-Dp'})
		.appendTo('body')
		.on('click',function (e) {
				e.stopPropagation();
				return false;
		});

		if($.device.m){
		this.Overlay = new ZUI.Overlay({Oclass:'overlay',color: '#a1a1a1',duration: 300,zIndex:this.options.zIndex,opacity: 0.4});
		this.dpBox.css({'z-index': this.options.CzIndex,'position': 'fixed','width': this.options.Cwidth,'display': 'block'});
		}
		var self = this;
		if(!this.options.static)
		$(document).on('click',function(){
			self.hideDp();
		});

		
		this.dpBox.on("mouseover", ".td_calDay", function(){
		  	$(this).addClass(self.options.hovClass);
		})
		.on("mouseout", ".td_calDay",function(){
		  	$(this).removeClass(self.options.hovClass);
		})
		.on("click", ".td_calDay",function(e){
			var tds = $(this);
			if(self.options.static){
				self.dpBox.find('td.td_calDay').removeClass(self.options.secClass);
				tds.addClass(self.options.secClass);
			}
			var ds = tds.attr('axis').split('|');
			var dat = self.formatValue(ds[0], ds[1], ds[2],true);
			self.BoxonEdit.val(dat).focus();
			$.fireEvent(self.options.onSelect,[self.dpBox,tds,dat,self.BoxonEdit]);
			self.hideDp();
		});
		
        
		this.dpEvents = function(e){
			e.stopPropagation();
			var targ = $(e.target);
			targ.attr('readonly', true);
			targ.val() == '' ? self.fixDate(targ) : self.format(targ,targ.val().substring(0,10));			
		};
			
		this.attach();	
    },
    format: function(element,date){
		switch(this.options.format){
			case 'mm/dd/yyyy':
			case 'mm/dd/yyyy/hh:mn:ss':
				var then = date.split('/'),fixM = parseInt(then[0])-1;
				this.fixDate(element,new Date(then[2],fixM,then[1]));
			break;
			case 'yyyy-mm-dd':
			case 'yyyy-mm-dd-hh:mn:ss':
				var then = date.split('-'),fixM = parseInt(then[1])-1;
				this.fixDate(element,new Date(then[0],fixM,then[2]));
			break;
			default:
			break;
		}
	},
	fixDate:function(element,then,today,Uncreat){
		this.then = then ? then : new Date();
		this.today = new Date();
		this.oldYear = this.year = this.then.getFullYear();
		this.oldMonth = this.month = this.then.getMonth();
		this.oldDay = this.then.getDate();
		this.nowYear = this.today.getFullYear();
		this.nowMonth = this.today.getMonth();
		this.nowDay = this.today.getDate();
		this.nowHour = this.today.getHours();
		this.nowMin = this.today.getMinutes();
		this.nowSec = this.today.getSeconds();
		if(!Uncreat)this.create(element);
	},
	attach: function(){
		this.Dparea.on('focus click',this.tags,this.dpEvents);
	},
	detach: function(){
		this.Dparea.off('focus click',this.tags,this.dpEvents);
	},	
	create: function(element,empt){		
		this.BoxonEdit = element;
        this.calendar && this.calendar.remove();
		this.calendar = $('<div>', {'class':'dp_cal'}).prependTo(this.dpBox);
		empt && this.fixDate(element,false,false,true);
		var date = this.then,self=this;

			
		if (this.month || this.year) {
			date.setFullYear(this.year, this.month, 1);
		}
		 else {
			this.month = date.getMonth();
			this.year = date.getFullYear();
			date.setDate(1);
		}
		this.year % 4 == 0 ? this.options.daysInMonth[1] = 29 : this.options.daysInMonth[1] = 28;
		var firstDay = (1-(7+date.getDay()-this.options.startDay)%7),
		yearSel = $('<select></select>'),years = [],monthSel = $('<select></select>');
		
		$.each(this.options.monthNames,function(i,item){
			if(i < self.options.monthStart && self.year == self.options.yearStart || i > self.options.monthEnd && self.year == self.options.yearEnd) return;
			var mops = $('<option>', { value : i }).text(item);

			monthSel.append(self.month == i ? mops.prop("selected",true) : mops);
		});
		
		if (this.options.yearOrder == 'desc'){
			for (var y = this.options.yearStart; y > (this.options.yearStart - this.options.yearRange - 1);y--){
				$.array.include(years,y);
			}
		} else {
			for (var y = this.options.yearStart - this.options.yearRange; y < (this.options.yearStart + this.options.yearRange +1+this.options.yearRangeLeft); y++){

				$.array.include(years,y);
			}
		}
		
		$.each(years,function(i,item){
			var yops = $('<option>', { value : item }).text(item);
			yearSel.append(self.year == item ? yops.prop("selected",true) : yops);
		});
		var calTable = $('<table/>'),
		calTableThead = $('<thead/>'),
		calSelRow = $('<tr/>'),
		calSelCell = $('<th/>', {'colspan':'7'}),
		YsecWrap = $('<span class="dropdown"/>').append(yearSel),
		MsecWrap = $('<span class="dropdown"/>').append(monthSel);

		calSelCell.append([YsecWrap,MsecWrap]);

		calSelCell.appendTo(calSelRow);
		calSelRow.appendTo(calTableThead);
		calTableTbody = $('<tbody>');
		calDayNameRow = $('<tr>');
		for (var i = 0; i < this.options.dayNames.length; i++) {
			calDayNameCell = $('<th>').html(this.options.dayNames[(this.options.startDay+i)%7].substr(0, this.options.dayChars)).appendTo(calDayNameRow);
		}
		calDayNameRow.appendTo(calTableTbody);
	
		while (firstDay <= this.options.daysInMonth[this.month]){
			calDayRow = $('<tr>'),disDay = firstDay<self.options.dayStart && self.year == self.options.yearStart && self.month == self.options.monthStart|| firstDay>self.options.dayEnd && self.year == self.options.yearEnd && self.month == self.options.monthEnd;
			for (i = 0; i < 7; i++){
				if(disDay){
					calDayCell = $('<td>', {'class':'dp_empty'}).html(' ').appendTo(calDayRow);
				}
				else if ((firstDay <= this.options.daysInMonth[this.month]) && (firstDay > 0)){
					ax = this.year + '|' + (parseInt(this.month)+1) + '|' + firstDay;
					calDayCell = $('<td>', {'class':'td_calDay','axis':ax,html:firstDay}).appendTo(calDayRow);
					if(this.options.mark && $.array.contains(this.options.mark,ax))calDayCell.addClass('dpholiy');
				}else {
					calDayCell = $('<td>', {'class':'dp_empty'}).html(' ').appendTo(calDayRow);
				}
				
				// Show the previous day
				if ( (firstDay == this.oldDay) && (this.month == this.oldMonth ) && (this.year == this.oldYear) && !disDay) {
					calDayCell.addClass(this.options.secClass);
				}
				// Show today
				if ( (firstDay == this.nowDay) && (this.month == this.nowMonth ) && (this.year == this.nowYear) && !disDay) {
					calDayCell.addClass('dp_today');
				}

				firstDay++;
				
			}
			calDayRow.appendTo(calTableTbody);
		}
		
		calTableThead.appendTo(calTable);
		calTableTbody.appendTo(calTable);
		calTable.appendTo(this.calendar);
		
		if(this.makeTime){
			//creat time
			this.today = new Date();	
			this.nowHour = this.today.getHours();
			this.nowMin = this.today.getMinutes();
			this.nowSec = this.today.getSeconds();
			var tpTime = this.getTimeHtml('Hour')+'点';    
			tpTime += this.getTimeHtml('Min')+'分';
			tpTime += this.getTimeHtml('Sec')+'秒';		
			calTableFoot = $('<tfoot>');
			calFelRow = $('<tr>');
			calFelCell = $('<td>', {'colspan':'7'}).append(tpTime);
			calFelRow.appendTo(calTableFoot);
			calFelCell.appendTo(calFelRow);
			calTableFoot.appendTo(calTable);
			$('#'+this.Boxon+'Hour').val(this.nowHour);
			$('#'+this.Boxon+'Min').val(this.nowMin);
			$('#'+this.Boxon+'Sec').val(this.nowSec);		
		}//end if			
		
		$(yearSel).on('change',function(){

			self.year = yearSel.val();
			self.create(self.BoxonEdit);
			$.fireEvent(self.options.onChange,[self.dpBox]);
			
		});
		$(monthSel).on('change',function(){
			
			self.month = monthSel.val();
			self.create(self.BoxonEdit);
			$.fireEvent(self.options.onChange,[self.dpBox]);
		});

        this.showDp(element);
		
		},
	getTimeHtml: function(types){
		var times = [];
		if(types == "Hour"){
			times.push('<select id="'+(this.Boxon+'Hour')+'">');
			for(var i = 0; i < 24; i++){
				times.push('<option value="'+ i +'">'+ i +'</option>');
			}
			times.push('</select>');
		}else if(types == "Min" || types == "Sec"){
			times.push('<select id="'+this.Boxon + types +'">');
			for(var i = 0; i < 60; i++){
				times.push('<option value="'+ i +'">'+ i +'</option>');
			}
			times.push('</select>');
		}
		return times.join("");
	},		
	formatValue: function(year, month, day,tm){
		//alert(year+'~'+month+'~'+day)
		var dateStr = '';
		this.month = this.oldMonth = '' + (month - 1) + '';
		this.year = this.oldYear = year;
		this.oldDay = day;
		if (day < 10) day = '0' + day;
		if (month < 10) month = '0' + month;
		if(this.makeTime && tm){
		hour = $('#'+this.Boxon+'Hour').val();
		mins = $('#'+this.Boxon+'Min').val();
		sec = $('#'+this.Boxon+'Sec').val();			
		dateStr = this.options.format.replace( /dd/i, day ).replace( /mm/i, month ).replace( /yyyy/i, year ).replace( /hh/i, hour ).replace( /mn/i, mins ).replace( /ss/i, sec );	
			
			}else{
		dateStr = this.options.format.replace( /dd/i, day ).replace( /mm/i, month ).replace( /yyyy/i, year );
				}

		return dateStr;

	},
	getSecMonth: function(){
		return parseInt(this.month) + 1;
	},
	getSecYear: function(){
		return parseInt(this.year) + 1;
	},
	showDp: function (el){
		if(this.options.static)return false;

		if($.device.m){
			this.dpBox.show().cmPos().css('height',this.calendar.innerHeight());

		}else{
			this.dpBox.css({
				'top':100,
				'left':100,
				'z-index': this.options.CzIndex,
				'position': 'absolute',
				'height':'auto',
				'width': this.options.Cwidth + 'px',
				'display': 'block'
				//,'background':'#F3FAFF'
			}).flpos(el,'south');
		}
		this.Overlay && this.Overlay.open();		
	},
    hideDp: function () {
		if(this.options.static)return false;
		this.calendar && this.calendar.remove();
        this.dpBox.hide();
		this.Overlay && this.Overlay.close();
    }
});

/*
---
ASDUI.Tab Class
author:YafullyZhao
date:2011.09.20
requires:
    core/
    - Class
    - Class.Extras 
    - Element 
    - Element.Event
    - Selectors 
    - Element.Delegation
provides: [TabPane]
...
*/
ZUI.Tab = new $.Class({
		options: {
			tabSelector: 'tab',
			contentSelector: 'tab-panel',
			activeClass: 'selected',
			mTabSelector:'mtab',
			mobile:false,
			toggle:true,
			onShow:$.noop
		},
		initialize: function(container, options) {
			this.options = $.extend({},this.options, options);
			this.container = $(container);
			this.tabStack = [];
			this.countL = this.countR = 1;
			this.numL = this.numR = 0;
			this.sector = '.'+this.options.tabSelector;
			this.num = 0;
			this.responTab = this.options.mobile && this.options.mTabSelector && $.device.m;
			var self = this;
			
			this.container.on('click',this.sector,function(){
				  self.show($(this).index());
			});
			
			this.sectors = this.container.find(this.sector);
			this.pans = this.container.find('.'+this.options.contentSelector);
			this.toTals = this.container.find(this.sector).length;
			if(this.toTals < 1) return false;//初始化当容器内子元素为空时不执行以下方法
			

		
			this.pans.hide();
			
			this.responTab ? this.responsv() : this.show(0);
			
		},
		show: function(index){
			
				var sects = this.responTab ? this.mSects : this.sectors,
				sect = sects.eq(index),										
				content = this.pans.eq(index) || this.pans.first();

				if(this.options.toggle && this.responTab && sect.hasClass(this.options.activeClass)){
					
					sect.removeClass(this.options.activeClass);
					content.hide();
					return;
				}
				
				//只有一个的异常情况
				sects.removeClass(this.options.activeClass);
				this.pans.hide();
				
				try {
					
					sect.addClass(this.options.activeClass);
					
					content.show();
	
				}catch(e){
					alert('index erro!')
				}
				this.num = index;	
				$.fireEvent(this.options.onShow,[sect,content,index]);
		
		},
		responsv: function(){
			var self = this;
			this.sectors.each(function(i,el){
				var klass = self.options.mTabSelector;
				self.pans.eq(i).before('<div class="'+klass+'" data-index="'+i+'">'+$(el).html()+'</div>');
			});
			this.container.on('click','.'+this.options.mTabSelector,function(){
				self.show($(this).data('index'));
			});
			this.mSects = this.container.find('.'+this.options.mTabSelector);
			
			this.show(0);
		},	
		getIndex: function(){
			return this.num;
		}
});
/*
---
script: Info.js
description: Class to create growl-style popup notifications.
authors: [YafullyZhao]
date:2014.05.09
...
*/
ZUI.Info = new $.Class({
	options: {
		mode: 'top',
		position: 'left',
		elements: {
			wrapper: '<div>',
			alert: '<div>'
		},
		elementOptions: {
			wrapper: {
				css: {
					'position': 'fixed',
					'z-index': '90'
				},
				'class': 'purr-wrapper'
			},
			alert: {
				'class': 'purr-alert',
				css: {
					opacity: '.85'
				}
			}
		},
		clickDismiss: true,
		hoverWait: true,
		hideAfter: 2000,
		duration: 500
		
		
	},
	initialize: function(options){
		this.options = $.extend({},this.options, options);
		this.createWrapper();
		return this;
	},
	createWrapper: function(){
		this.wrapper = $(this.options.elements.wrapper, this.options.elementOptions.wrapper);

		switch (this.options.mode) {
		   case 'top':
		   		this.wrapper.css('top', '0px');
		   break;
		   case 'bottom':
		   		this.wrapper.css('bottom','0px');
		   break;
		   case 'middle':
		   		this.wrapper.css('top','300px');
		   break;	
		   default:
		   break;	
		}
		$('body').append(this.wrapper);
		this.positionWrapper(this.options.position);
	},

	positionWrapper: function(position){
		switch (position) {
		   case 'left':
		   		this.wrapper.css('left', 0);
		   break;
		   case 'right':
		   		this.wrapper.css('right', 0);
		   break;	
		   default:
		   		this.wrapper.css({left: '50%',marginLeft:-this.wrapper.outerWidth()/2});	
		   break;	
		}		
		return this;
	},

	info: function(msg, options){

		var opts = $.extend({},this.options, options);

		var infoDiv = $(opts.elements.alert, opts.elementOptions.alert);
		
		if(typeof msg == 'string'){
			infoDiv.html(msg);
		}
		else if(typeof msg == 'element'){
			infoDiv.append(msg);
		}
		else if($.isArray(msg)){
			var alerts = [];
			$.each(msg,$.proxy(function(i,m){
				alerts.push(this.info(m, opts));
			}, this));
			return alerts;
		}
		infoDiv.addClass(opts.className).appendTo(this.wrapper);

		if(opts.hideAfter > 0){
			infoDiv.oneTime(opts.hideAfter+'ms','TInfo',$.proxy(function(){
				this.runOut(infoDiv);
			},this));			
		}
		opts.clickDismiss && infoDiv.on('click', $.proxy(function(){
				this.holdUp = false;
				this.runOut(infoDiv);
			},this));
		

		opts.hoverWait && infoDiv.on({
				'mouseenter': $.proxy(function(){
					this.holdUp = true;
				},this),
				'mouseout': $.proxy(function(){
					this.holdUp = false;
				},this)
			});
		

		return infoDiv;
	},
	runOut: function(el){
		if(this.holdUp){
			el.stopTime('TInfo');
			el.oneTime(500+'ms','TInfo',$.proxy(function(){
				this.runOut(el);
			},this));			
			return null;
		}

		var to = {
			'opacity': 0
		};
		
		this.options.mode == 'top' ? to['margin-top'] = '-'+el.outerHeight() : to['margin-bottom'] = '-'+el.outerHeight();
		el.animate(to,this.options.duration,function(){
			el.remove();
		});
	}
});

//PassShark.Class

ZUI.PassShark = new $.Class({
	options: {
		 interval:      200,
		 duration:      3000,
		 replacement:   '%u25CF',
		 prefix:        'password_',
		 spBtn:null,
		 onInit:$.noop,
		 onFocus:$.noop,
		 onBlur:$.noop
	},
	initialize: function(input, options) {
		this.options = $.extend({},this.options, options);
		this.input = $('#'+input);
		this.checker = [];
     	this.timer   = [];
         var name        = this.input.attr('name');
         var id          = this.input.attr('id');
         var cssclass    = this.input.attr('class');
         var style       = this.input.attr('style');
         var size        = this.input.attr('size');
         var maxlength   = this.input.attr('maxlength');
         var disabled    = this.input.attr('disabled');
         var tabindex    = this.input.attr('tabindex');
         var accesskey   = this.input.attr('accesskey');
         var value       = this.input.val();
		 this.input.hide();
		 this.input.after('<input name="' + (this.options.prefix + name) + '" ' +
                                'id="' +  (this.options.prefix + id) + '" ' + 
                                'type="text" ' +
                                'value="' + value + '" ' +
                                (cssclass != undefined ? 'class="' + cssclass + '"' : '') +
                                (style != undefined ? 'style="' + style + '"' : '') +
                                (size != undefined ? 'size="' + size + '"' : '') +
                                (maxlength != -1 ? 'maxlength="' + maxlength + '"' : '') +
                                (disabled != undefined ? 'disabled="' + disabled + '"' : '') +
                                (tabindex != undefined ? 'tabindex="' + tabindex + '"' : '') +
                                (accesskey != undefined ? 'accesskey="' + accesskey + '"' : '') +
                                 'autocomplete="off" />');
         
         // change label
         $('label[for='+id+']').attr('for', this.options.prefix + id);
         // disable tabindex
         this.input.attr({'tabindex': '','accesskey': ''});
         this.finput = $('#' + this.options.prefix + id);
		 
		 // bind event
		 var self = this;
         this.finput.on('focus', function(e){
			var p = self.getId($(this).attr('id')),pt;

			$(this).stopTime('PS');

			$(this).everyTime(self.options.interval+'ms','PS',function(){
				self.check(p,'');
			},0,true);
			$.fireEvent(self.options.onFocus,[self.input,self.finput]);
         });
         this.finput.on('blur', function(e){
            $(this).stopTime('PS');
			$.fireEvent(self.options.onBlur,[self.input,self.finput]);
         });
		 
		 
			this.finput.oneTime(self.options.interval+'ms','PS',function(){
				self.check(id,'', true, true);
			});
			
		this.options.spBtn && $(this.options.spBtn).on('click',function(){
		 	self.finput.val(self.input.val());
		 });	
		$.fireEvent(this.options.onInit,[this.input]);			  
	},
	getId : function(id) {
		 var pattern = this.options.prefix+'(.*)';
		 var regex = new RegExp(pattern);
		 regex.exec(id);
		 id = RegExp.$1;
		 
		 return id;
	 },
	
	 setPassword : function(id, str) {
		 var tmp = '';
		 for (i=0; i < str.length; i++) {
			if (str.charAt(i) == unescape(this.options.replacement)) {
			   tmp = tmp + $('#' + id).val().charAt(i);
			}
			else {
			   tmp = tmp + str.charAt(i);
			}
		 }
		 
		 $('#' + id).val(tmp);
	 },
	 check : function(id, oldValue, initialCall) {
		
		 var bullets = this.finput.val();
		
		 if (oldValue != bullets) {
			this.setPassword(id, bullets);
			if (bullets.length > 1) {
			   var tmp = '';
			   for (i=0; i < bullets.length-1; i++) {
				  tmp = tmp + unescape(this.options.replacement);
			   }
			   tmp = tmp + bullets.charAt(bullets.length-1);
			
			   this.finput.val(tmp);
			}

			this.input.stopTime('PSC');
			this.input.oneTime(this.options.duration+'ms','PSC',$.proxy(function(){
				this.convertLastChar(id);
			},this));		
		 }
		 if (!initialCall) this.input.oneTime(this.options.interval+'ms','PSC',$.proxy(function(){
				this.check(id,$(this.finput,false).val());
			},this));

	 },
     convertLastChar : function(id) {
         if (this.finput.val() != '') {

            var tmp = '';
            for (i=0; i < this.finput.val().length; i++) {
               tmp = tmp + unescape(this.options.replacement);
            }
            this.finput.val(tmp);
         }
     }
});

ZUI.Lazyload = new $.Class({
	options : {
		attr: "data-url",
		mouseAttr:null,//'data-original'
		paramAttr:null,
		loadClass:'ZUISeed',
		loadHide:false,
		verticalOnly:true,
		threshold:100,//偏移阀值-距离可视区域
		pixelRatio:[],//[2,3]根据屏幕分辨率加载不同尺寸不指定则加载默认
		callback: $.noop,
		container:false,
		loaded:$.noop
	}, // end defaults
	initialize: function(ps,options) {
		this.options = $.extend({},this.options, options);
		this.ps = ps;
		this.cache = [];
		this.doc = $.device.w;
		this.container = this.options.container ? $(this.options.container) : this.doc;
		this.isWin = this.options.container ? false : true;
		
		this.build(this.ps);
		
		
		this.container.on("scroll", $.proxy(this.checkAppear,this));

	},
	build:function(ps){
		
		var self = this,loaded ='.'+this.options.loadClass, ptargs = self.options.loadHide ? $(ps) : $(ps+':visible'), 
		regAll = function(){
			
			ptargs.not(loaded).each(function(i,el){
				
				//if(!$(el).hasClass(self.options.loadClass)){

					var node = el.nodeName.toLowerCase(), 
					url = self.getUrl($(el).attr(self.options.attr)),
					orginUrl = self.options.mouseAttr ? $(el).attr(self.options.mouseAttr) : null,
					orgImg = orginUrl ? new Image() : null,
					param =  $(el).data('options') ? $.getDataOptions(el) : false;
					//console.log(node);
					var data = {
						obj: $(el),
						tag: node,
						url: url,
						orginUrl:orginUrl,
						orgImg:orgImg,
						param:param
					};
					self.cache.push(data);
					
					
				//}
				
			});
		};
		
		$.when(regAll()).done(function() {
			if($(ps).length>$('.'+self.options.loadClass).length)self.checkAppear();
		});
	},
	getUrl: function(url){
		var suffix = '',device = parseFloat($.device.PixelRatio),pixel = this.options.pixelRatio;
		if(pixel.length){
			$.each(pixel,function(){
				if (device >= this) {
					suffix = '-' + this;
				}
			});
			return url.replace(/.(jpg|gif|png)$/i, suffix + '.$1');
		}else{
			return url;
		}
	},
    belowthefold: function (elmt){
        var fold = this.isWin ? ('innerHeight' in window ? window.innerHeight : this.container.height()) + this.container.scrollTop() : this.container.offset().top + this.container.height();
        return fold <= elmt.offset().top - this.options.threshold;
    },

    rightoffold: function (elmt){
        var fold = this.container.width() + (this.isWin ? this.container.scrollLeft() : this.container.offset().left);
        return fold <= elmt.offset().left - this.options.threshold;
    },

    abovethetop: function (elmt){
        var fold = this.isWin ? this.container.scrollTop() : this.container.offset().top;
        return fold >= elmt.offset().top + this.options.threshold  + elmt.height();
    },
    leftofbegin:function (elmt){
        var fold = this.isWin ? this.container.scrollLeft() : this.container.offset().left;
        return fold >= elmt.offset().left + this.options.threshold + elmt.width();
    },
    checkAppear:function (){
        var self = this;
        $.each(this.cache, function(i,data){
            var o = data.obj;

			if(!o.hasClass(self.options.loadClass)){//若元素没有加载完成则执行下面的运算

				
				if(self.abovethetop(o)){//滚到上面了
					
				}else if(!self.belowthefold(o)){//刚好在区域内
					self.loading(data,i);
				}else{
					
				}
				
				if(!self.options.verticalOnly){
					
					if(self.abovethetop(o) || self.leftofbegin(o)){
	
					}
					else if(!self.belowthefold(o) && !self.rightoffold(o)){
						self.loading(data,i);
					}else{
	
					}
				}
			}
        })
    },
	loading:function(data,i){
		var o = data.obj, tag = data.tag, url = data.url,orgImg = data.orgImg, orginUrl=data.orginUrl,param = data.param?data.param:{},self = this;
		if (tag === "img") {
			if(orginUrl){
				orgImg.onload = function(){
					self.callback(o.attr("src", url));
				}
				orgImg.src = orginUrl;
			}
			self.callback(o.attr("src", url));
			$.fireEvent(self.options.loaded,[o,url,tag,i+1,self.cache.length]);
			o.addClass(self.options.loadClass);
			
		} else {
			$.ajax(url,param).done(function(data){
				o.addClass(self.options.loadClass);
				
				$.fireEvent(self.options.loaded,[o,data,tag,i+1,self.cache.length]);
			});
			
		}
		$.fireEvent(this.options.onEnter,[o]);	
	},
	callback : function(call) {
		$.isFunction(this.options.callback) && this.options.callback.call(call.get(0));
		
	}		
});

ZUI.DropMenu = new $.Class({
	options: {
		container:null,
		mselect:null,
		zIndex:null,
		msHover:true,
		msActiv:'onhover',
		mBody:'div',
		mouseoutDelay:500,
		hideAlways:true,
		makeSelect:false,
		receiver:null,
		sector:null,
		sectorClass:null,
		initialTxt:'显示全部',
		name:'name',
		porps:function(){},
		effects:{
			dEf:null,
			cEf:null,
			duration:250
		},
		//makeAccord:false,
		makeTip:false,
		tipOpts:{
			title:null,
			content:null,
			maxW:400,
			pos:'south',
			arrow:true,
			skew:[0,10]
		},
		
		display:null,

		onInit: $.noop,
		onOpen: $.noop,
		onClose: $.noop,
		onSelect: $.noop
//		,
//		onEnter: $.noop,
//		onOut: $.noop
	},
	
	initialize: function(container,options){
		this.options = $.extend({},this.options, options);
		this.container = (typeof container=='string') ? $('#'+container) : container;

		this.E = this.options.effects;
		this.Ed = (typeof (this.E.dEf)=='function' && this.E.duration) ? true : false;
		this.Ec = (typeof (this.E.cEf)=='function' && this.E.duration) ? true : false;
		this.hover = this.options.msHover && $.browser.desktop ? true : false;
		this.menuShow = false;
		if(this.options.makeTip){
			this.GD = $.GUID();
			this.to = this.options.tipOpts;
			this.TID = 'ZUITip' + this.GD;
			this.TITD = 'ZUITip_tt' + this.GD;
			this.TICD = 'ZUITip_c' + this.GD;
			this.TIAD = 'ZUITip_a' + this.GD;
			$('body').append('<div class="ZUITip" id="'+this.TID+'"><div class="ZUITip_t" id="'+this.TITD+'"></div><div class="ZUITip_c" id="'+this.TICD+'"></div><div class="ZUITip_a" id="'+this.TIAD+'"></div></div>');
			this.tip = $('#'+ this.TID).css('max-width', this.to.maxW);
			this.tiptt = $('#'+ this.TITD);
			this.tipc = $('#'+ this.TICD);
			this.arr = $('#'+ this.TIAD);
			
		}
		
		var events = this.events = {}, self = this;
		
			if(this.hover){
				events['mouseover'] = function(event){
					if(!$(this).find(self.options.mBody) || !$(this).siblings(self.options.mBody) && !self.options.makeTip)return false;//不在sce内或不与sec并列
					// console.log($(this));
					self.container.stopTime ('Dr');
					self.drop = self.options.makeTip ? self.tip: self.findDrop($(this));
					
					
					self.showTip($(this),self.drop);
					if(self.options.makeSelect && !$(this).children().eq(0).data('IntalTxt')) $(this).children().eq(0).data('IntalTxt',$(this).children().eq(0).text());//如果允许select且选择值默认为空则附加
					//self.fireEvent('enter',this);
				};
				events['mouseout'] = function(event){
					var sec = $(this),tag = event.target;;
					
					if(!sec.find(self.options.mBody) || !sec.find(self.options.mBody) && !this.options.makeTip)return false;//不在sce内或不与sec并列
					if (tag.tagName != 'SELECT' && tag.tagName != 'INPUT' && tag.tagName != 'TEXTAREA'){
						self.options.mouseoutDelay ? self.container.oneTime(self.options.mouseoutDelay+'ms','Dr',function() {
							self.hideTip(sec,self.drop);
							
						}):self.hideTip(sec,self.drop);
					}
					
				};
				events['click'] = function(event){
					event.stopPropagation();
				};

				$(document).on('click',function(){
					self.menuShow && self.hideAll();
					$.fireEvent(self.options.onClose,[self.container]);
				});
			}else{
				events['click'] = function(event){
					if(!$(this).find(self.options.mBody) || !$(this).siblings(self.options.mBody))return false;
				
					$(this).is('a') && event.preventDefault();
					event.stopPropagation();
					self.drop = self.options.makeTip ? self.tip: self.findDrop($(this));
					self.showTip($(this),self.drop);
					
					if(self.options.makeSelect && !$(this).children().eq(0).data('IntalTxt')) $(this).children().eq(0).data('IntalTxt',$(this).children().eq(0).text());
				};
				events['tapmove'] = function(event){
					event.stopPropagation();
				};
				this.options.hideAlways && $(document).on('click',function(){
					self.menuShow && self.hideAll();
					$.fireEvent(self.options.onClose,[self.container]);
				});
				$(document).on('tapmove',function(){
					
					self.menuShow && self.hideAll();
				});
			
			}

		this.attach();

		if(this.options.display!=null) this.showIndex(this.options.display);
		$.fireEvent(this.options.onInit,[this.container]);
	},
	findDrop:function(tagt){
		return tagt.find(this.options.mBody).eq(0).length ? tagt.find(this.options.mBody).eq(0) : tagt.siblings(this.options.mBody).eq(0);//drop在seclect内或与select并列
	},
	attach: function(){
		this.container.on(this.events,this.options.mselect);
		(this.options.makeSelect==2) && this.attDel();
	},
	attDel: function(){
		var self = this;
		this.container.on('click','em.deletbtn', function(e){
			  e.stopPropagation();
			  self.ckList(1,$('#'+$(this).attr('rel')));
			  $(this).closest('span.secNode').remove();		  
		});
	},
	detach: function(){
		this.container.removeEvents(this.events);
	},
	showTip: function(sec,el){
		if(sec.hasClass(this.options.msActiv))return;
		this.hideAll(sec);
		var showed = el.data('showed'),self = this;
		
		this.Ed ? $.fireEvent(this.E.dEf,[el,sec,this.E.duration]) : el.show();
		this.menuShow = true;
		
		//如果不满足第一次运行标记则跳出
		if(this.options.makeSelect==1&&!showed){
		 	
		  el.on('click',this.options.sector, function(event) {
			  
			 $(this).is('a') && event.preventDefault();
			 //event.stopPropagation();
			 
				 try{
															 
					 self.secList(sec,el,this);
				 }catch(err){
					 //alert('非标准结构.');
					 console.log(err);
				 } 	 
		  });
		  
		}
		else if(this.options.makeSelect==2&&!showed){
		  var self = this;
		 
		  el.on('click',this.options.sector, function(event) {
			 event.stopPropagation();
				 try{
					 Drlink = self.options.receiver ? sec.find(self.options.receiver).eq(0) : sec.children().eq(0);
					 var flag = $(this).data('clicked');
					 self.ckList(flag,$(this));
					 
				 }catch(err){
					 alert(err);
				 };
			});			
		}
		if(this.options.makeTip){
			
			var cont = this.to.content ? this.to.content : sec.data('title'),tit = this.to.title ? this.to.title : sec.data('tit'),
			pos = sec.data('pos') ? sec.data('pos') : this.to.pos,skew = sec.data("skew"),skews = (skew != null) ? skew.split(',') : null,
			x = skews ? skews[0] : this.to.skew[0].toString(), y = skews ? skews[1] : this.to.skew[1].toString();
			
			
			this.to.arrow && this.arr.addClass(pos).data('pos',pos);
			
			tit ? this.tiptt.html(tit).show() :this.tiptt.hide();
			
			this.tipc.html(cont ? cont : 'empty content!');
			
			el.css({top:'',left:''}).flpos(sec,pos,x,y);
			
		}
		el.data('showed',1);	
		$.fireEvent(this.options.onOpen,[el,sec]);
	},
	secList: function(sec,el,a){
		var opt = isNaN(a) ? a : el.find(this.options.sector)[a];
		var Drlink = this.options.receiver ? $(sec).find(this.options.receiver).eq(0) : $(sec).children().eq(0);
		//Drlink.html($(opt).html() === this.options.initialTxt ? Drlink.data('IntalTxt') : $(opt).data(this.options.name));
		this.options.sectorClass && $(opt).addClass(this.options.sectorClass).siblings().removeClass(this.options.sectorClass);
		$.isFunction(this.options.porps) && $(sec).data('value',this.options.porps($(opt)));
		this.container.stopTime ('Dr');
		this.container.find(this.options.mselect).removeClass(this.options.msActiv);
		el.hide();
		
		$.fireEvent(this.options.onSelect,[$(opt),Drlink,sec,this]);//回调指向选择项&sec		
	},
	hideTip: function(sec,el){
		
		this.Ec ? $.fireEvent(this.E.cEf,[el,sec,this.E.duration]) : el && el.stop(true,true).hide();
		sec && sec.removeClass(this.options.msActiv);
		$.fireEvent(this.options.onClose,[el,sec]);
	},
	hideAll: function(sec){
		
		this.container.stopTime('Dr');//清除定时器ps：JQ的hover事件比较愚蠢！

		(this.to && this.to.arrow) && this.arr.removeClass(this.arr.data('pos'));
		var other = this.container.find('.'+this.options.msActiv),otherDrop = other.find(this.options.mBody);
		
		if(this.options.makeTip){
			this.tip.hide();
		}else{
			this.Ed ? $.fireEvent(this.E.cEf,[otherDrop,other,this.E.duration]) : otherDrop.stop(true,true).hide();
		}
		other.removeClass(this.options.msActiv);

		sec && sec.addClass(this.options.msActiv);
		this.menuShow = false;
		
	},
	accord: function(sec,el,timeout){
		
		if(sec.hasClass(this.options.msActiv)){
			return false;
		}else{
			sec.addClass(this.options.msActiv);
		}
		this.hideAll(sec);
		this.Ed ? $.fireEvent(this.E.dEf,[el,sec,this.E.duration]) : el.show();
		this.menuShow = true;
		var self = this;
		timeout && self.container.oneTime(timeout+'ms','Dr',function() {
			self.hideTip(sec,el);
		});
		$.fireEvent(this.options.onActive,[sec,el]);
	},
	showIndex: function(num,timeout){
		
		if(num < 0){
			this.hideAll();
			return false
		}
		try{
			var isec = this.container.find(this.options.mselect)[num];
			var iel = this.options.makeTip ? this.tip: this.findDrop($(isec));
			
			//$(isec).siblings(this.options.mBody).length>0 ? $(isec).siblings(this.options.mBody).eq(0) : $(isec).find(this.options.mBody).eq(0);
			this.accord($(isec),iel,timeout);
			$.fireEvent(this.options.onShow,[isec,iel]);
		}catch(err){
			alert(err)
		}
		
	},
	ckList: function(flag,list){
		 var ids = list.attr('id');
		 var ckBox = list.find('input:checkbox');
		 switch(flag){
			case 1 :
				list.data('clicked',2);
				this.container.find('em[rel="'+ids+'"]').closest('span.secNode').remove();
				ckBox.prop('checked', false);
				
			break;
			case 2 :
			default:
				dat = ckBox.data('op');
				list.data('clicked',1);
				ckBox.prop('checked', true);
				Drlink.append('<span class="secNode" data-op="'+dat+'">'+list.text()+'<em class="deletbtn" rel="'+ids+'"></em></span>');
				
				$.fireEvent(this.options.onSelect,[list,Drlink]);
			break;
		 }	
	}
});



/**
 * ZUI.SL
 * @version		1.5 #20160822
 * @author		YafullyZhao
 */
ZUI.SL = new $.Class({
    options: {
		moveBox: null,
        slides: null,
        slideDuration: null,
        effectDuration: null,
		effect:'linear',
        fadeDist: null,
        fadePosition: null,//'horizontal','fade','carousel'
        stopSlideOnClick: true,
        autoSlide: false,
		navBuild:false,
        navigationNums: true,
		navbox:null,
		nav:'a',
		navOnClass:'active',
		circle:true,
		vertical:false,
		page:0,//默认显示第几页
		gap:0,
		
		limit:null,//carousel 显示区最少单元个数
		autoSize:false,
		
		amount:1,//滚动个数
		visual:1,//可视个数
		touch:true,
		threshold:20,	
		mouseWheel:false,
		preload:false,
		nextBtn:null,
		prevBtn:null,
		onInit:$.noop,
		onStart:$.noop,
		onFinish:$.noop,
		onNext:$.noop,
		onPrev:$.noop,
		onPreLoad:$.noop	
    },
    initialize: function (element,options) {
        this.options = $.extend({},this.options, options);
        this.container = (typeof element == 'object') ? element : $(element);
		this.moveBox = (typeof this.options.moveBox == 'object') ? this.options.moveBox : $(this.options.moveBox);
		this.moveBox.css('position','relative');
		this.preOver = this.options.preload ? $('#'+this.options.preload) : null;
		this.page = this.options.page;
        this.currentKey = this.page;
		this.busy = false;
		this.limit = this.options.limit;
		this.animCss = this.options.vertical ? "top" : "left";
        this.sizeCss = this.options.vertical ? "height" : "width";
		this.numVisible = this.totalSlides < this.options.visual ? this.totalSlides : this.options.visual;
		
		this.mobi = $.browser.mobile;
		this.towMode = false;
		this.solo = false;

		this.spTran = $.support.TranEndEvt;
		//touch
		this._startX = 0;
        
        this._moveX = 0;
        
        this._moveDistance = 0;
        this._curX = 0;
        
        this._touchDistance = 50;

		this.preOver ? this.preload() : this.start();
		var self  = this;
		this.options.autoSize && $(window).on(this.mobi ? "orientationchange" : "resize", function () {
			self.calcuSize();
		});
    },
	preload:function(){
		$.fireEvent(this.options.onPreLoad,[this.moveBox,this.preOver,this,this.container]);
	},
    start: function () {
		this.container.data('run') && this.destroy();
        this.prepareSlides(this.page);

			$(this.options.nextBtn).on('click',$.proxy(function(){
				this.next();
			},this));
	
			$(this.options.prevBtn).on('click',$.proxy(function(){
				
				this.prev();
			},this));

		this.container.data('run',1);
    },
	destroy: function(){
		this.options.nextBtn && $(this.options.nextBtn).off();
		this.options.prevBtn && $(this.options.prevBtn).off();
		this.container.off();
		
	},
	calcuSize: function(E){
		
		switch(this.options.fadePosition){
			
			case 'horizontal':
				this.depth = this.options.fadeDist ? this.options.fadeDist : this.container.innerWidth();
				if(this.mobi){
					if(this.options.circle){
						var newSlids = this.container.find(this.options.slides); 
						this.moveBox.css('width',this.depth*newSlids.length);
						newSlids.css('width',this.depth).first().css({'marginLeft':this.solo?0:-this.depth,'float':'left'});
					}else{ 
						this.moveBox.css('width',this.depth*this.totalSlides);
						this.slides.css('width',this.depth);
					}
					this.slides.css({'float':'left'});
					this.towMode = false;					
				}else{
					this.towMode = true;
				}
			break;
			case 'fade':
				this.towMode = true;
			break;	

			case 'carousel':
				this.page = this.options.page;
		
				this.towMode = false;
				if(this.options.circle) this.page += this.numVisible;
				
				this.cItems = this.container.find(this.options.slides);
                this.cLen = this.cItems.size();
                this.gapTotal = this.cLen>1 ? (this.cLen-1)*this.options.gap : 0,
                this.gapvisble = (this.options.amount -1)*this.options.gap;
                this.depth = parseInt((this.container.width() - this.gapvisble)/this.options.amount);

				this.currentKey = this.page;
					
                this.cItems.css({overflow: "hidden","float": this.options.vertical ? "none" : "left"}).css(this.sizeCss,this.depth);
                this.moveBox.css({position: "relative","z-index": 1}).css(this.sizeCss,this.cLen*this.depth + this.gapTotal).css({height:this.cItems.innerHeight()});
				
				if(this.mobi){

					this.moveBox.css({
						
						'-webkit-transform':'translateX('+-(this.currentKey * this.depth)+'px)',
						'transform':'translateX('+-(this.currentKey * this.depth)+'px)'
						
					});
				}else{
					
					this.moveBox.css(this.animCss, -(this.currentKey * this.depth));
				}
                // For a non-circular carousel, if the start is 0 and btnPrev is supplied, disable the prev button
                if(!this.options.circle){
					if(this.options.prevBtn && this.page == 0) {
                    	$(this.options.prevBtn).addClass("disabled");
					}
					if(this.options.nextBtn && this.totalSlides <= this.options.amount) {
						$(this.options.nextBtn).addClass("disabled");
					}
                }
			break;	
			default:
			break;	
		}
		this.container.data('height',this.container.height());
		if(this.towMode){
			this.slides.css({
				'position':'absolute',
				'left':this.options.fadePosition=='horizontal' ? this.depth : 0,
				'top':this.options.fadePosition=='vertical' ? this.depth : 0,
				'display':'none'
			});
			E.css({left:0,top:0,'display':'block','zIndex':this.options.fadePosition=='fade' ? 10 : 1});
		}
	},
	rendCircle:function(E){
		
		if(this.mobi && this.options.fadePosition == 'horizontal' || this.options.fadePosition == 'carousel'){
			var dh = this.container.data('height') ? this.container.data('height') : $(E).height();	
			this.container.css('height',dh);
			var $lastItemSet = this.slides.slice(this.totalSlides-this.numVisible).clone();
			var $firstItemSet = this.slides.slice(0,this.numVisible).clone();
			this.moveBox.prepend($lastItemSet).append($firstItemSet); 
		}
	},
    prepareSlides: function (A) {
		
		this.destroy();
		this.currentKey = A ? A : 0;
        this.slides = this.container.find(this.options.slides);
        this.totalSlides = this.slides.length;

		var E = $(this.slides[this.currentKey]),self = this;

		this.options.circle ? 
		$.when(self.rendCircle(E),$.wait(100)).done(function() {
			self.calcuSize(E);
			
		}):
		this.calcuSize(E);


		if(this.totalSlides >= this.limit) {
			this.options.prevBtn && $(this.options.prevBtn).show();
			this.options.nextBtn && $(this.options.nextBtn).show();
		}else{
			this.options.prevBtn && $(this.options.prevBtn).hide();
			this.options.nextBtn && $(this.options.nextBtn).hide();
			return;
		}

		if (this.options.autoSlide) {
			this.AutoScroll();
            this.container.on({
                'mouseenter': function(){
					self.focused = true;
                    self.container.stopTime('SL');
					
                },
                'mouseleave': function(){
                    self.focused = false;
					self.AutoScroll();
                }
            });
        }
		
		if(this.options.mouseWheel){
			this.container.on('mousewheel',function(e, d){
				self.goToSlide(d > 0 ? self.currentKey-self.options.amount : self.currentKey+self.options.amount);
			});
		}
		
		if(!this.towMode && this.options.touch){
			this.container.on({
				'movestart':function(e){
					self._startX = e.startX;
					
				},
				'move':function(e){
					self.fnTouchmove(e);
				},
				'moveend':function(){
					self.fnTouchend(self.options.fadePosition);
				}
			});
		}
		
		this.injectNavigation();
		
		$.fireEvent(this.options.onInit,[E]);
    },
    injectNavigation: function () {
		if(!this.options.navbox)return false;
		var self = this,NavBox = $('#'+this.options.navbox);
		if(this.options.navBuild){
			NavBox.empty();
			var navs = '';
			for(var i=0;i<this.totalSlides;i++){
				navs += self.options.navBuild;
			};
			NavBox.append(navs);
		}
		
        this.navLinks = this.options.nav ? NavBox.find(this.options.nav) : NavBox.children();
        this.navLinks.each(function(B,C){
			var n = $(self.navLinks[B]);
			self.options.navigationNums && n.html(B + 1);
			n.on('click',function(D){
				D.preventDefault();
				self.goToSlide(B);
				if (self.options.autoSlide) {
					self.container.stopTime('SL');
					self.AutoScroll();
				}	
			});
        });
		this.navStatus();
    },	
	AutoScroll: function () {
			var self = this;
			this.container.stopTime('SL');
			if (!this.focused) {
				this.container.everyTime(this.options.slideDuration+'ms','SL',function(){
					self.next();
					
				});
			}
    },
    next: function(){
		if (this.busy) return;
		$.fireEvent(this.options.onNext,[this.currentKey,this.totalSlides,this.moveBox]);
		this.goToSlide(this.currentKey+this.options.amount);
		
    },
	prev: function(){
		if (this.busy) return;
		$.fireEvent(this.options.onPrev,[this.currentKey,this.totalSlides,this.moveBox]);
		this.goToSlide(this.currentKey-this.options.amount,true);
	},

    goToSlide: function (A,dir) {
		//console.log('传入'+A);
        if (A == this.currentKey || this.busy) return;

		
		var B,self = this;
		switch(this.options.fadePosition){
			case "horizontal":
				B = dir ? "right":"left";
			break;
			default:
				B = this.options.fadePosition;
			break;
		}
		var derection = (A > this.currentKey) ? 1 : -1;//判断左右
		
		if(this.towMode){
			if (A < 0) {
				A = this.totalSlides-1;
			} else if (A > this.totalSlides-1) {
				A = 0;
			}//异常处理
		}else{
			this.currentKey = A;
			if(this.options.circle) {      // If circular, and "to" is going OOB, adjust it
				this.adjustOobForCircular(A);
				this.inNum = A;
				
			} else {                    // If non-circular and "to" is going OOB, adjust it.
				this.adjustOobForNonCircular(A);
				this.arrowStatus();
			}

		}
		if(!this.towMode && this.mobi || !this.towMode && this.options.touch){

			this.fnMove();
			return;
		}
		
		var D = $(this.slides[A]);
		var E = $(this.slides[this.currentKey]);

		
		this.slOpt = {
			duration:this.options.effectDuration || 300,
			start:function(){
				D.show().css(B=="fade" ? {'opacity':1,'zIndex':1} : {});
			},
			done:function(){
				switch (B) {
					case "left":
					case "right":
						$(this).css(B,null);
						E.hide();
					break;
					case "fade":
						D.css('zIndex',5);
						E.css('zIndex',0).hide();
					break;
				}
				self.busy = false;
				$.fireEvent(self.options.onFinish,[D,E,self.moveBox,self]);
			}
		};

		this.busy = true;
		
        switch (B) {
			case "right":
				D.css({'right': 0,'left':'auto'});
				this.options.circle ? E.show().css({'right':derection*this.depth,'left':'auto'}) : E.hide();
				this.moveBox.css({'right':(-derection)*this.depth,'left':'auto'}).stop(true,true).animate({right:0},this.slOpt);
				break;	
			case "left":
				D.css({'left': 0,'right':'auto'});
				this.options.circle ? E.show().css({'left':(-derection)*this.depth,'right':'auto'}) : E.hide();
				this.moveBox.css({'left':derection*this.depth,'right':'auto'}).stop(true,true).animate({left:0},this.slOpt);
				break;	
			case "fade":
				E.animate({opacity:0},this.slOpt);
				break;
			case "carousel":
				this.moveBox.stop(true,true).animate({left:-((this.depth+this.options.gap)*this.currentKey)},this.slOpt);
			break;	
        }

        if(B!="carousel")this.currentKey = A;


		this.navStatus();	
		$.fireEvent(this.options.onStart,[D,E,this.moveBox]);
    },
	navStatus: function(){
		if(!this.options.navbox) return;
		$(this.navLinks).removeClass(this.options.navOnClass);
		this.options.fadePosition == 'carousel' ? this.navLinks.slice(this.currentKey).slice(0,this.numVisible).addClass(this.options.navOnClass) : $(this.navLinks[this.currentKey]).addClass(this.options.navOnClass);
	},
	visibleItems: function(A) {
		return this.cItems.slice(this.currentKey).slice(0,this.numVisible);
	},
	arrowStatus: function(){

		$(this.options.prevBtn + "," + this.options.nextBtn).removeClass("disabled");
        if(this.currentKey == 0) $(this.options.prevBtn).addClass("disabled"); 
        if(this.currentKey == this.cLen - this.numVisible)$(this.options.nextBtn).addClass("disabled");
	},
	adjustOobForCircular: function (to) {
		var newPosition;
		// If first, then goto last
		if(to <= this.page - this.numVisible - 1) {
			newPosition = to + this.totalSlides + this.options.amount;
			this.moveBox.css(this.animCss, -(newPosition * this.depth) + "px");
			this.currentKey = newPosition - this.options.amount;
			
		}
		// If last, then goto first
		else if(to >= this.cLen - this.numVisible + 1) {
			newPosition = to - this.totalSlides - this.options.amount;
			this.moveBox.css(this.animCss, -(newPosition * this.depth) + "px");
			this.currentKey = newPosition + this.options.amount;
			
		}

		
	},
	
	adjustOobForNonCircular: function (to) {

		if(to < 0 || this.cLen <= this.options.amount) {
			this.currentKey = 0;
		}
		// If "to" is greater than the max index that we can use to show another set of elements
		// it means that we will have to reset "to" to a smallest possible index that can show it
		else if(to > this.cLen - this.numVisible) {
			this.currentKey = this.cLen - this.numVisible;
		}
	},
	//mobi move
    fnTouchmove: function (e,b){
		$.fireEvent(this.options.onStart,[false,false,this.moveBox]);
	
		this.options.autoSlide && this.container.stopTime('SL');

		this._moveX = e.distX;
		this._moveY = e.distY;
		
		this.fnTransition(this.moveBox,0);
		if(this.options.fadePosition=='horizontal' || this.options.fadePosition=='carousel'){
			if (Math.abs(this._moveX) > Math.abs(this._moveY) && Math.abs(this._moveX)>= this.options.threshold) {
				e.preventDefault()
				edgeMove = 0;
				
				this.fnTranslate(this.moveBox,-(this.depth * (parseInt(this.currentKey)) - this._moveX));
				if(this.options.autoSlide) return this.AutoScroll();
			}
		
		}
     },
     // touchend
     fnTouchend: function (fp){
		if(fp=='horizontal' || fp =='carousel'){
			this._moveDistance = this._moveX;
		
		}

		
		// 距离小
		if(Math.abs(this._moveDistance) <= this._touchDistance){
			this.fnScroll(.3);
		// 距离大
		}else{
			// 手指触摸上一屏滚动
			if(this._moveDistance > this._touchDistance){

				this.prev();
				if(this.options.autoSlide) this.AutoScroll();
			// 手指触摸下一屏滚动
			}else if(this._moveDistance < -this._touchDistance){

				this.next();
				if(this.options.autoSlide) this.AutoScroll();
			}
		}
		this._moveX = 0,this._moveY = 0;
    },
	fnTransition: function(dom,num){
		dom.css({
			'-webkit-transition':'all '+num+'s '+this.options.effect,
			'transition':'all '+num+'s '+this.options.effect
		});
	},
    fnTranslate: function (dom,result,num){
		if(this.spTran){//支持css3
			switch(this.options.fadePosition){
				case "horizontal":
				case "carousel":
				dom.css({
					'-webkit-transform':'translateX('+result+'px)',
					'transform':'translateX('+result+'px)'
					
				});
				break;
			}
			var self = this;
			dom.off(this.spTran).one(this.spTran,function(){
				$.fireEvent(self.options.onFinish,[false,false,self.moveBox,self]);
				
			});
		}else{
			dom.stop().animate({"left": result + "px"}, this.options.effectDuration || 300);
		}
	},	
	fnMove: function(){
		
		if(this.options.circle && this.options.fadePosition !='carousel'){
			if(this.currentKey >= this.totalSlides){
				this.fnScroll(.3);
				this.currentKey = 0;

				this.moveBox.oneTime('200ms',$.proxy(function(){
					this.fnScroll(0);
				},this));
			}else if(this.currentKey < 0){
				this.fnScroll(.3);
				this.currentKey = this.totalSlides-1;
				this.moveBox.oneTime('200ms',$.proxy(function(){
					this.fnScroll(0);
				},this));
			}else{
				this.fnScroll(.3);
			}
		}else{
			this.fnScroll(.3);
		}
		this.navStatus();
	},
	fnScroll: function (num){
	    this.spTran && this.fnTransition(this.moveBox,num);
		this.fnTranslate(this.moveBox,-(this.currentKey)*(this.depth+this.options.gap),num);
		
	},
	//mobi move
	getCurrent: function(){
	 	return this.slides[this.currentKey];
	},
	getNum:function(){
	 	return this.currentKey;
	},
	getSliders: function(){
		return $(this.slides);
	}
});
/*
---
description: Element Visibility Watcher class.

authors: YafullyZhao
date:2012.12.26
requires:
- core/1.3.0: '*'

provides: [VisibilityWatcher]

...
*/

ZUI.VsWatcher = new $.Class({
	options: {
		poll_interval: 2000,//轮询时间间隔
		method: null, //poll轮询 or scroll滚动
		delay: 0, //事件触发延迟
		delta_px: 0, //监听区域扩展值
		event_source: null, //滚动事件监听对象
		
		onEnter:$.noop,
		onLeft:$.noop,
		onScroll:$.noop
		
	},

	initialize: function(el,options){
		this.options = $.extend({},this.options, options);
		this.targetElements = [];
		this.evs = this.options.event_source ? $('#'+this.options.event_source) : $(window);
		this.add(el);
		this.visibilityChangedCheck();
		this.startWatching();
		
	},

	getVisibility: function(targetElement){
		if (!targetElement) targetElement = this.targetElements[0].element;

		var elpos = targetElement.offset();
		var elementPosition ={x:elpos.left,y:elpos.top};
		var getScroll = {x:$(window).scrollLeft(),y:$(window).scrollTop()};
		var getSize ={x:$(window).width(),y:$(window).height()};
		var elementSize = {x:targetElement.outerWidth(),y:targetElement.outerHeight()};
		var returned_array = [];

		$.each(['x', 'y'],$.proxy(function(index,el){
			
			if (getScroll[el] > (elementPosition[el] + elementSize[el] + this.options.delta_px)){
				returned_array[el] = 'after'}
			else if ((getScroll[el] + getSize[el]) > (elementPosition[el] - this.options.delta_px)){
				returned_array[el] = 'on'}
			else{
				returned_array[el] = 'before'
				}
		}, this));

		return returned_array;
	},

	startWatching: function() {
		if (this.options.method == 'poll')
		{
			//this.interval_id = this.visibilityChangedCheck.periodical(this.options.poll_interval, this);
			
			this.evs.everyTime(this.options.poll_interval+'ms','VW',$.proxy(function(){
				this.visibilityChangedCheck();
			},this),0,true);
		} else {
			this.evs.on('scroll',$.proxy(function(){
				this.visibilityChangedCheck();
			},this));
			
		}
		return this;
	},

	stopWatching: function() {
		if (this.options.method == 'poll')
		{
			this.evs.stopTime('VW');
		} else {
			this.evs.of('scroll', this.visibilityChangedCheck);
			this.evs.stopTime('VWD');
		}
		return this;
	},

	add: function(targetElement){
		$(targetElement).each($.proxy(function(i,el){
			this.targetElements.push({'element': $(el), 'last_state': []});
			
		},this));
		
		return this;
	},

	remove: function(targetElement){
		targetElement = $(targetElement);
		this.targetElements = $.filter(this.targetElements,function(i,el){
			return (targetElement != el['element']);
		});
		return this;
	},
	visibilityChangedCheck: function(){
		
		var currentTime = Date.now();
		
		$.each(this.targetElements,$.proxy(function(index,targetElement){
			var cur_state = this.getVisibility( targetElement.element );

			var sat = $.grep(['x', 'y'], function(axis,index){return (cur_state[axis] == targetElement.last_state[axis])}).length == 2;
			
			if (!sat){
			
				if (!targetElement.last_state['started']) targetElement.last_state['started'] = currentTime;
				if ((currentTime - targetElement.last_state['started']) >= this.options.delay){
					targetElement.last_state = cur_state;
					//var sat2 = $.array.every(['x', 'y'],function(index,axis){return( cur_state[axis] == 'on')});
					var sat2= $.grep(['x', 'y'], function(axis,index){return (cur_state[axis] == 'on')}).length == 2;
					sat2 ? $.fireEvent(this.options.onEnter, [targetElement.element,cur_state]) : $.fireEvent(this.options.onLeft, [targetElement.element,cur_state]);
				} else {
					if (this.options.delay>0 && this.options.method == 'event'){
						this.evs.stopTime('VWD');
						this.evs.oneTime(this.options.delay+1+'ms','VWD',$.proxy(function(){
								this.visibilityChangedCheck();
						},this));
					}
				}
			} else {
				$.array.remove(targetElement.last_state,'started');
			}
		},this));

		$.fireEvent(this.options.onScroll,[this.evs.scrollTop(),this.evs.scrollLeft()]);
		return this;
	}
});//!Class

/*
*Validate
*/
ZUI.Validator = new $.Class({
		options: {
			ruleTag: ".validate",
			ruleProp:"data-valid",
			tagClass:"Vmsg",
            regedClass:"Vreged",
			passClass:"Vpass",
			erroClass:"Verro",
			//styleNeutral: {"background-color": "#fff", "border-color": "#ccc"},//normal style
			//styleInvalid: {"background-color": "#FFE0DB", "border-color": "#f90"},//focus style
			styleInvalid:"err",
			tarInvalid:"TarErr",
			styleProcess:"proce",
			//Qmode:false,
			required: {type: "required", re: /.+/},
			alpha: {type: "alpha", re: /^[a-z ._-]+$/i},
			alphanum: {type: "alphanum", re: /^\w+$/},
			integer: {type: "integer", re: /^[-+]?\d+$/},
			real: {type: "real", re: /^\+?[1-9][0-9]*$/},
			date: {type: "date", re: /^((^((1[8-9]\d{2})|([2-9]\d{3}))([-\/\._])(10|12|0?[13578])([-\/\._])(3[01]|[12][0-9]|0?[1-9])$)|(^((1[8-9]\d{2})|([2-9]\d{3}))([-\/\._])(11|0?[469])([-\/\._])(30|[12][0-9]|0?[1-9])$)|(^((1[8-9]\d{2})|([2-9]\d{3}))([-\/\._])(0?2)([-\/\._])(2[0-8]|1[0-9]|0?[1-9])$)|(^([2468][048]00)([-\/\._])(0?2)([-\/\._])(29)$)|(^([3579][26]00)([-\/\._])(0?2)([-\/\._])(29)$)|(^([1][89][0][48])([-\/\._])(0?2)([-\/\._])(29)$)|(^([2-9][0-9][0][48])([-\/\._])(0?2)([-\/\._])(29)$)|(^([1][89][2468][048])([-\/\._])(0?2)([-\/\._])(29)$)|(^([2-9][0-9][2468][048])([-\/\._])(0?2)([-\/\._])(29)$)|(^([1][89][13579][26])([-\/\._])(0?2)([-\/\._])(29)$)|(^([2-9][0-9][13579][26])([-\/\._])(0?2)([-\/\._])(29)$))/},
			dateEn:{type: "dateEn", re: /^((0?\d)|(1[012]))[\/-]([012]?\d|30|31)[\/-]\d{1,4}$/},
			dateISO8601: {type: "dateISO8601", re: /^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/},
			dateEu: {type: "dateEU", re: /^(((([1-9])|([0-2][0-9])|(3[01]))[-]((0[13578])|([13578])|(1[02])))|((([1-9])|([0-2][0-9])|(30))[-]((0[469])|([469])|(11)))|((([1-9])|([0-2][0-9])))[-](2|02))[-]\d{4}$|^\d{4}$/},
			email: {type: "email", re: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/},
			phone: {type: "phone", re: /^((\(\d{2,3}\))|(\d{3}\-))?(\(0\d{2,3}\)|0\d{2,3}-)?[1-9]\d{6,7}(\-\d{1,4})?$/},
			moblie: {type: "moblie", re:/^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/},
			global:{type:"global", re:function(v){
				
				var status = false;
				if(v==''){
					status = false
				}else{
					var lef = v.replace(/^\+\d*\./g, '').replace(/[\s]/g,"");
					status =/^[0-9][0-9_-]{1,}/.test(lef);

				}
				return status;
			}},
			url: {type: "url", re: /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i},
			ip:{type:"ip", re:/^(0|[1-9]\d?|[0-1]\d{2}|2[0-4]\d|25[0-5]).(0|[1-9]\d?|[0-1]\d{2}|2[0-4]\d|25[0-5]).(0|[1-9]\d?|[0-1]\d{2}|2[0-4]\d|25[0-5]).(0|[1-9]\d?|[0-1]\d{2}|2[0-4]\d|25[0-5])$/},
			qq:{type:"qq", re:/^[1-9]\d{4,8}$/},
			code:{type:"code", re:/^[0-9]\d{5}$/},
			decim : {type:"decim", re:/^-?\d+\.\d+$/},
			zip : {type:"zip", re:/^[1-9]\d{5}$/},
			chinese:{type:"chinese", re:/^[\u4e00-\u9fa5]{0,}$/},
			confirm: {type: "confirm"},
			compare:{type:"compare",re:function(a,b){
				if(a)return a==$('#'+b).val()
				}
			},
			strength:{type:"strength", re:/^(?!\D+$)(?![^a-zA-Z]+$)\S{6,15}$/},
			idCard:{type:"idCard", re:/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/},
			range:{type:"range",re:function(a,b,g){
					var ran = b.split(','),n = ran[0]||'',m = ran[1]||'';

					if(g){//若是对象
						return parseInt(n) <= parseInt(a) && parseInt(m) >= parseInt(a);
					}else{//若是文本
						return new RegExp("^.{" +n+","+m+ "}$").test(a);
					}
				}
			},
			includes: {type:"includes",re:function(a,b){
                    var inc = $.array.pick(b.split(','),function(item){return new RegExp(item).test(a)});
                    if(inc == null){
                        return false;
                    }else{
                        return true;
                    };
				}
			},
			excludes: {type:"excludes",re:function(a,b){
				
				return $.array.pick(b.split(','),function(item){return new RegExp(item).test(a)}) == null;

				}
			},
			empty:{type:"empty",re:function(a,b){
					return (a == '' || (a == null) || (a.length == 0) || /^\s+$/.test(a));		
				}
			},
			autoSbmit:false,
			submitBtn:null,
			restBtn:null,
			valiHide:true,
			validDisabled:false,
			infoHide:false,
			keybord:false,
			locating:true,
			onValid: $.noop,
			beforeSubmit: $.noop,
			onSubmit: $.noop,
			onDel: $.noop
		},
	initialize: function(form,options) {
		this.options = $.extend({},this.options, options);
		
		this.form = (typeof form =='string') ? $('#'+form) : form;
		this.busy = false;
		
		this.regForm();
		
		var self = this,doc = $('body');
		
		this.options.infoHide && this.form.on('click','.'+this.options.tagClass,function(){
			$(this).fadeOut();
		});
		if(this.options.autoSbmit){
			this.form.on({
				"submit": function(e){
					//var self._onSubmit()[0]);
					return self._onSubmit()[0];
				},
				"reset": function(){
					self._onReset();
				}
			});//给form添加提交、重置事件

			
		}else{
			this.options.submitBtn && doc.on('click',this.options.submitBtn,function(e){
				e.stopPropagation();
				self._onSubmit(this);
				
			});
			this.options.restBtn && doc.on('click',this.options.restBtn,function(e){
				e.stopPropagation();
				self._onReset();
			});
		}
		
		this.options.keybord ? 
		this.form.on('keypress',function(e){
			
			if(e.which==13) {
				e.preventDefault();
				$(this).oneTime('100ms',function(){

					if(self.options.autoSbmit){
						return self._onSubmit()[0];
					}else{
						$(self.options.submitBtn).click();
					}
					
				});
			}
		}):
		this.form.on('keypress',function(e){
			
			if(e.which==13 && self.options.autoSbmit) {
				e.preventDefault();
			}
		});
		
		this.form.on("blur",'.' + this.options.regedClass,function(e){
			var input = $(this);
            
			if(self._isChildType(this)){
				var iptName = $.parseId(this.name);
                var opt = self.validations[iptName];
                
                if(!opt) return;
				self._validateChild(opt);

			}else{
				var iptId = $.parseId(this.id);
				//console.log(self.validations[iptId]);
				if(!$.trim($(this).val())==''|| this.tagName == "SELECT" && $(this).val()==''){
					var opt = self.validations[iptId];

                    if(!opt) return;
					self._validate(input,opt);

				}
				//失去焦点时触发回调，指向表单元素&验证Tip。
			}

			$.fireEvent(self.options.onValid,[this]);			
		});
        this.form.on("input change",'.' + this.options.regedClass, function(){
            // m.removeClass(self.options.passClass);
            // m.removeClass(self.options.erroClass);
            // ElOpt.passhide && m.hide();
            var input = $(this),iptId = $.parseId(this.id);
            
            if(!self._isChildType(this)){
            	try{
                	self.validations[iptId].passed = false;
            	}catch(e){}
            }
        });
	},
	regForm: function(){
		this.validEls = 0;
		this.erros = 0;
		this.validations = {};
		var self = this,vis = this.options.valiHide ? '' : ':visible',t = this.options.ruleTag + vis;
		
		this.validEls = this.form.find(t);
		this.validEls.each(function(i,el){
            
			self.reg($(el));
		});//遍历表单
		
		
	},
	reg: function(ipt,afterAdd){
		
			
		var iptOpts = ipt.getDataOptions(this.options.ruleProp);

		if(iptOpts.noreginit && !afterAdd) return;
		var iptId = $.parseId(iptOpts.elemt),iptName = iptId.replace(/^#/,'');
			tipId = iptOpts.tip ? $.parseId(iptOpts.tip) : false,
			ru = iptOpts.rule,
			maybe = ru.indexOf('|') > 0 ? true: false,
			rules = maybe ? ru.split('|') : ru.split(','),
			regs = [];
		var self = this;
		//遍历rule
		$.each(rules,function(i,klass) {
			if(self.options[klass]) 
			$.array.include(regs,self.options[klass]);
		});
		//把rule并入对象

        isnotChild = iptId.match(/^#/)==null ? false : true;
        
		iptOpts.el = isnotChild ? $(iptId) : this.form.find('input[name='+iptId+']');//注入对象并赋予委托事件
		iptOpts.el.addClass(this.options.regedClass);
        iptOpts.tipel = iptOpts.tip ? $(tipId) : false;
		iptOpts.elemt = iptId;
		iptOpts.tip = tipId;
		iptOpts.regexps = regs;
		iptOpts.maybe = maybe;
        iptOpts.isChildType = !isnotChild;
        iptOpts.normal = iptOpts.tip ? iptOpts.tipel.html() : '';
		iptOpts.passed = false;
		
		// if(this._isChildType(ipt[0])){
			
		// }
		
		this.validations[iptName] = iptOpts;

		return this;	
	},//读取注册单个表单元素参数
	_isChildType: function(el) {
			if(!el||!el.type) return false;
			var elType = el.type.toLowerCase();
			if((elType == "radio") || (elType == "checkbox")) return true;
			return false;

	},
	_validate: function(ipt, opts) {
            var field = ipt;
        	if(!opts){//验证单个
                var psId = $.parseId(ipt);
                opts = this.validations[psId];
                field = opts.el;
            }
            var satus,
				custom,
				ru = opts.rule,
				rules = opts.regexps,
				v = $.trim(field.val())
				tipBox = opts.tipel;
            
            for(var i=0;i<rules.length;i++){//这里循环单个验证里面的组合条件
                var vType = rules[i].type;
                

                switch(vType) {//判断类型
                    case "compare":
                    case "range":
                    case "includes":
                    case "excludes":
                        satus = rules[i].re(v,opts[vType]);
                        break;      
                    //case "ajax":
//                      var ajxv = options[i].re(field,msgbox.data(vType),msgbox);
//                      satus = ajxv?ajxv[0]:false;
//                      custom = ajxv?ajxv[1]:true;

                    //break;    
                    case "required":    
                    default:

                        satus = $.isFunction(rules[i].re) ? rules[i].re(v,field,tipBox,this) : rules[i].re.test(v);
                        custom = rules[i].custom ? rules[i].custom : false;
                        break;
                }
                if(opts.maybe){//如果条件为或"|"运算符
                    if(satus==true)break;//只要有一个符合则跳出循环
                }else{
                    if(satus==false)break;//只要有一个不符合则跳出循环
                }
            }
    
        if(!this.options.validDisabled && $(opts.elemt).is(':disabled')){
            satus = true;
           //break;
        }  
                 
		opts.passed  = satus; 	

        this._msgInject(tipBox,opts,satus,field,custom);
        return satus;
    },
	_validateChild: function(opts) {
		var nlButtonGroup = opts.el;
		
		var cbCheckeds = 0,
			isValid = true,
			ru = opts.rule,
			rules = opts.regexps;
		for(var i = 0; i < nlButtonGroup.length; i++) {
			nlButtonGroup[i].checked && cbCheckeds++;
		}
		
		for(var i=0;i<rules.length;i++){//这里循环单个验证里面的组合条件
			switch(rules[i].type) {//判断类型

				case "range":
					isValid = rules[i].re(cbCheckeds,opts.range,true);
					break;	
				case "required":
					isValid = (cbCheckeds == 0) ? false : true; 
					break;	
				default:
					break;
			}
			if(isValid==false)break;		
		}
        
		opts.passed  = isValid; 	
		this._msgInject(opts.tipel,opts,isValid,nlButtonGroup);
		return isValid;
	},
	_msgInject: function(tipBox, opts, satus , field ,custom) {
		if(tipBox){
			var pos = opts.pos,skew = opts.skew,
				skews = skew ? skew.split(',') : null,
				x = skews ? skews[0] : 0,
				y = skews ? skews[1] : 0;
			
			pos && tipBox.css({'position':'absolute','top':'inherit','left':'inherit','display':this.options.infoHide ? 'inline-block':'inherit','opacity':this.options.infoHide ? 1:'inherit'}).flpos(field,pos,x,y);
			
			if(!custom){
				field && field[(satus ? 'remove' : 'add')+'Class'](this.options.styleInvalid);
				tipBox.attr('class',satus ? this.options.tagClass+" "+this.options.passClass : this.options.tagClass+" "+this.options.erroClass);
				var msg = opts.warn ? opts.warn : "验证失败.",mpass = opts.pass ? opts.pass : "验证通过.",passHide = opts.passhide ? true : false,valiHide = opts.valihide ? true : false;
				tipBox.html(satus ? mpass : msg).css('display',passHide && satus || valiHide && !satus ? 'none': 'inline-block');
				
				
			}
		}else{
			field && field[(satus ? 'remove' : 'add')+'Class'](this.options.styleInvalid);
		}
		var tar = opts.tar;
		tar && $(tar)[(satus ? 'remove':'add')+'Class'](this.options.tarInvalid);
	},

	_msgRemove: function(options,owner,isReset,field) {
		//var pos = owner.data("pos");
		
		isReset = isReset || false;
		//field && field.css(this.options.styleNeutral);
		field && field.removeClass(this.options.styleInvalid);
		owner.html(owner.data("normal")).removeClass().addClass(this.options.tagClass);
		owner.valiOpts.pos && owner.attr('style','');
	},
	_onSubmit: function(onlyv) {
		$.fireEvent(this.options.beforeSubmit,[this.form]);
		if(this.busy) return ;
		this.busy = true;
		var isValid = false,erro = 0,self=this,onlyVali = (typeof onlyv =='object') ? false :true,
		valiAll = function(){

			$.each(self.validations,function(i,vobj) {
				
				var input = vobj.el,vItem = !self.options.validDisabled;

                if(!self.options.validDisabled && !input.is(':disabled')){
                    vItem = vobj.isChildType ? self._validateChild(vobj) : self._validate(input,vobj);
                }

				if(!vItem)erro++;
      
			});
			
		};
		$.when(valiAll()).done(function() {
           
			//if(erro > 0 || !self.options.autoSbmit)isValid = false;
			isValid = (erro > 0 || !self.options.autoSbmit) ? false : true;
			if(!onlyVali){//如果不是单纯验证则执行回调
				$.fireEvent(self.options.onSubmit,[self.form,erro,self.options.submitBtn]);
			}//提交表单时触发回调，指向form和全体验证结果。
			if(self.options.locating && erro > 0)self.form.find('.'+self.options.styleInvalid+':visible').eq(0).focus();
			self.busy = false;
		});
		
		return [isValid,erro];
		
	},
    resetItem: function(vobj){
        vobj.el.removeClass(this.options.styleInvalid);
        vobj.tipel && vobj.tipel.html(vobj.normal).removeClass().addClass(this.options.tagClass);
        vobj.pos && vobj.tipel.attr('style','');
        vobj.passed = false;
    },
	_onReset: function() {
        var self = this;
        
		$.each(this.validations,function(i,vobj) {
            self.resetItem(vobj);
		});
	},
	addMethod: function(name,opt){
		this.options.name = name;

		this.options[name] = opt;
		return this;
	},
	del: function(rulenmae,t){//console.log(item);
        var rule = $.parseId(rulenmae),vobj = this.validations[rule];
        if(!vobj)return;
        vobj.el.removeClass(this.options.regedClass);
        this.resetItem(vobj);
        $.object.erase(this.validations,rule);
		$.fireEvent(this.options.onDel,[rule,t,this.form,this.validations]);
	}				
});//!Class


/*History manager*/
/*IE8+*/
ZUI.History = new $.Class({
	options : {

	}, // end defaults
	initialize: function(options) {
		this.options = $.extend({},this.options, options);
		var self = this;
		this.supportHistory = !!(window.history && window.history.pushState && window.history.replaceState);
		
		//'onhashchange' in window && ( document.documentMode === 'undefined' || document.documentMode > 7 );
		//this.makeIEHistory();
		if(this.supportHistory){
			$(window).on("hashchange", function(e){
				var hash = self.getHash();
				$(self).trigger("popstate", [hash]);
			});
		}else{
			this.makeIEHistory();
			window.onhashchange = function(e) {
				
				var hash = self.getHash();
				$(self).trigger("popstate", [hash]);
			};
		}
		
	},
	getHash: function(url) {
        url = url || window.location.href;
        return window.location.hash.substr(1); // url.replace( /^[^#]*#?(.*)$/, '$1' )
    },
    setHash: function(newHash) {
        window.location.hash = newHash;
    },
	pushState: function(newHash) {
		
		if(this.supportHistory){
			window.history.pushState(null, null, "#"+newHash);
			$(this).trigger("popstate", [newHash]); // callback(newHash);
		}else{
			this.setHash(newHash); // trigger hashchange event
		}
	},
	makeIEHistory: function(){
			var location = window.location,
			oldURL = location.href,
			oldHash = location.hash;
		
			// check the location hash on a 100ms interval
			setInterval(function() {
				var newURL = location.href,
				  newHash = location.hash;
			
				// if the hash has changed and a handler has been bound...
				if ( newHash != oldHash && typeof window.onhashchange === "function" ) {
				  // execute the handler
				  window.onhashchange({
					type: "hashchange",
					oldURL: oldURL,
					newURL: newURL
				  });
			
				  oldURL = newURL;
				  oldHash = newHash;
				}
			 }, 100);
	}

});

/*
---
description: A cross browser persistent storgae API
requires:
- core/1.9.1+
provides: [LocalStorage]
...
*/
/*!
IE8+, FF3.5+, Safari 4+ : use the HTML5 localStorage API
=======注意=======
IE5.5-IE7使用User Data ,是微软专门为IE在系统中开辟的一块存储空间。单个文件的大小限制128KB。一个域名下总共可以保存1024KB的文件，文件个数没有限制。
在受限站点里单个文件大小限制64KB，一个域名下共可以保存640KB,所以单个文件最好的是控制在64KB下,其他浏览器则沿用COOKIES.userData是一种持久化存储方式，而不是驻留在内存中，因此关闭浏览器并不会删除这些数据。当使用userData 存储体积较大的数据结构时，开发人员需要格外小心。因为这些数据结构中可能会存有身份认证这样的敏感数据，如果被持久保存在客户端很可能被攻击者所利用。由于名/值对是作为XML节点的属性存储在userData的XML文档中，因此Internet Explorer可以自动将某些特殊字符转义为XML中的对应字符。例如，双引号（"）会被替换为&quot;，而连字符（&）会被替换 为&amp;。由于这些自动转义的字符会增加实际存储的数据大小，因此开发人员必须确保有足够的空间来存储转义后的数据。  
*/

ZUI.Storage = new $.Class({
    
	options : {
		sessionMod:false,
		encode:false
    }, 

	initialize : function(options){
         this.options = $.extend({},this.options, options);
		 
		 var self = this;
		 this.drivers= {
				// Firefox 3.5, Safari 4.0, Chrome 5, Opera 10.5, IE8
				'localStorage': {
					// see https://developer.mozilla.org/en/dom/storage#localStorage
					available: function(){
						try{
							// Firefox won't allow localStorage if cookies are disabled
							if (!!window.localStorage) {
								// Safari's "Private" mode throws a QUOTA_EXCEEDED_ERR on setItem
								window.localStorage.setItem("jQuery Store Availability test", true);
								window.localStorage.removeItem("jQuery Store Availability test");
								return true;
							};
							return false;
						}catch(e){
							return false;
						}
					},
					init: $.noop,
					
					get: function(key){
						 var v = self.options.sessionMod ? window.sessionStorage.getItem(key) : window.localStorage.getItem(key),
						 vl = self.options.encode ? v : JSON.parse(v),lastv;
						 if(vl && vl.time){
						 	var date = new Date().getTime();
	
							console.log(vl.time);
							console.log(date);
							if(vl.time - date > 0){
								//console.log('未过期');
								lastv = vl.val;
							}else{
								//console.log('过期');
								self.del(key);
								lastv = null;
							};
							
						 }
						 return lastv;
					},
					set: function(key, value, expires){
						var v = {}; 
						if (typeof expires == 'number'){
							var date = new Date().getTime() + (expires * 24 * 60 * 60 * 1000);
							v.time = date;
							
						}
						v.val = value;
						var vl = self.options.encode ? v : JSON.stringify(v);
						self.options.sessionMod ? window.sessionStorage.setItem(key, vl) : window.localStorage.setItem(key, vl);
					},
					del: function(key){
						self.options.sessionMod ? window.sessionStorage.removeItem(key) : window.localStorage.removeItem(key);
					},
					flush: function(){
						self.options.sessionMod ? window.sessionStorage.clear() : window.localStorage.clear();
					}
				},
				
				// IE6, IE7
				'userData': {
					// see http://msdn.microsoft.com/en-us/library/ms531424.aspx
					element: null,
					nodeName: 'userdatadriver',
					initialized: false,
					available: function(){
						try{
							return !!(document.documentElement && document.documentElement.addBehavior);
						}catch(e){
							return false;
						}
					},
					init: function(){
						// $.store can only utilize one userData store at a time, thus avoid duplicate initialization
						if(this.initialized)
							return;
						
						try{
							// Create a non-existing element and append it to the root element (html)
							this.element = document.createElement(this.nodeName);
							document.documentElement.insertBefore(this.element, document.getElementsByTagName('title')[0]);
							// Apply userData behavior
							this.element.addBehavior("#default#userData");
							this.initialized = true;
						}catch(e){
							return false; 
						}
					},
					get: function(key){
						this.element.load(this.nodeName);
						return this.element.getAttribute(key);
					},
					set: function(key, value){
						this.element.setAttribute(key, value);
						this.element.save(this.nodeName);
					},
					del: function(key){
						this.element.removeAttribute(key);
						this.element.save(this.nodeName );
						
					},
					flush: function(){
						// flush by expiration
						var attrs = this.element.xmlDocument.firstChild.attributes;
						for (var i = attrs.length - 1; i >= 0; i--){
							this.element.removeAttribute(attrs[i].nodeName);
						}
							this.element.save(this.nodeName);
					}
				}
			};
         var self = this;
		 
		 $.each(this.drivers, function(){
			// skip unavailable drivers
			if(!$.isFunction( this.available ) || !this.available())
				return true; // continue;
			
			self.driver = this;
			if(self.driver.init() === false){
				self.driver = null;
				return true; // continue;
			}
			
			return false; // break;
		});

    },
    get:function(key){
		var value = this.driver.get(key);
		return value;
	},
	set: function(key, value, expires){

		this.driver.set(key, value, expires);
	},
	del: function(key){
		this.hour && this.doExp(key,true);
		this.driver.del(key);
	},
	flush: function(){
		this.driver.flush();
	}
});

/*Completer*/
ZUI.Completer = new $.Class({
	options : {		
		container:null,
		template: '<ul class="completer-container"></ul>',
		itemTag: 'li',
		position: 'south', // or 'custom'
		skew:{x:0,y:30},
		
		url:null,
		reader:{
			"cat":0,
			"key":"key",
			"status":"status",
			"data":"data"
		},
		selectedClass: 'completer-selected',
		loadClass:'ckLoad',
		separator: '',
		sugType: 'custom',//ajax,normal,custom
		source: [],//Array or url
		dataAttr:'data-val',
		queryMinChars:1,
		delay:0,
		highlight:false,
		zIndex: 20,
	
		onComplete: $.noop,
		onFocus: $.noop,
		onBlur: $.noop,
		filter: function (val) {
		  return val;
		},
		dataRender:$.noop,
		ItemClick:$.noop
	}, // end defaults
	initialize: function(element, options) {
		this.options = $.extend({},this.options, options);
		this.element = (typeof element == 'object') ? element : $('#'+element);
		this.regexp = this.toRegexp(this.options.separator);
        this.compBox = $(this.options.template);
		this.container = this.options.container ? $(this.options.container):'body';
        this.compBox.hide().appendTo(this.container);
        this.typing = false;
        this.active = false;
        this.parm = {};
		var self = this;
		this.element.attr('autocomplete', 'off');
		this.enable();
        //this.element.is(':focus') && this.enable();
        
		$(document).on('click',function(){
			self.hideComp();
		});
		
	},
	enable: function () {
      if (!this.active) {
		var self = this;  
        this.active = true;
        this.element.on({
        	click:function(e){e.stopPropagation()},
			focus: function(){
				//console.log($(this).val());
				if($(this).val() ==self.parm[self.options.reader.key]){
					self.place();
				}else if($(this).val() !=''){
					self.complete();
				}	
				$.fireEvent(self.options.onFocus,[self.container,self.element]);
			},
		    blur: function(){
				//self.disable();
				$.fireEvent(self.options.onBlur,[self.container,self.element]);
		    },
            keydown: function(e){self.keydown(e);},
            keyup: function(e){self.keyup(e)}
        });
        this.compBox.on({
		  click:function(e){
		  	e.stopPropagation();
		  },	
          mousedown: function(e){
          	if(!$.isFunction(self.options.ItemClick))self.mousedown(e);
          },
          mouseover: function(e){
          	self.mouseover(e)
          }
        })
        .on('click',this.options.itemTag,function(e){
        	e.stopPropagation();
        	$.fireEvent(self.options.ItemClick,[$(this),self]);
        	
        });
		
      }
    },
	disable: function () {
      if (this.active) {
		var self = this;  
        this.active = false;
        this.element.off('keydown');
		this.element.off('keyup');
		this.compBox.off('mousedown');
		this.compBox.off('mouseover');

      }
    },
	keydown: function (e) {
     if (e.keyCode === 13) {
       e.stopPropagation();
       e.preventDefault();
	 }else{
	 	this.typing = true;
	 }

    },

    keyup: function (e) {

      var keyCode = e.keyCode,self = this;
	 
      if (keyCode === 13 || keyCode === 38 || keyCode === 40) {
        this.toggle(keyCode);
      } else {
		clearTimeout(this.processTimer);
	  	this.processTimer = window.setTimeout(function() {
		    self.complete();
		    
		}, this.options.delay);
        
        
      }
	  
    },
	
	mouseover: function (e) {

      var selectedClass = this.options.selectedClass,$target = $(e.target);
      $target.is(this.options.itemTag) && $target.addClass(selectedClass).siblings().removeClass(selectedClass);
      
    },

    mousedown: function (e) {
      e.stopPropagation();
      e.preventDefault();

      this.setValue(this.options.dataAttr ? $(e.target).attr(this.options.dataAttr) : $(e.target).text());
    },
    setValue: function (val) {
      this.element.val(val);
	  $.fireEvent(this.options.onComplete,[this.element,val]);
      this.compBox.hide();
    },
	toggle: function (keyCode) {
      var selectedClass = this.options.selectedClass,$selected = this.compBox.find('.' + selectedClass);

      switch (keyCode) {

        // Down
        case 40:
          $selected.removeClass(selectedClass);
          $selected = $selected.next();
          break;

        // Up
        case 38:
          $selected.removeClass(selectedClass);
          $selected = $selected.prev();
          break;

        // Enter
        case 13:
        	
          if($selected.length>0) { 
          	$.isFunction(this.options.ItemClick) ? $.fireEvent(this.options.ItemClick,[$selected,this]) :
          	this.setValue($selected.text());
          }
          break;

        // No default
      }

      if ($selected.length === 0) {
        $selected = this.compBox.children(keyCode === 40 ? ':first' : ':last');
      }

      $selected.addClass(selectedClass);
    },
	complete: function () {
		
	  
      var val = this.options.filter(this.element.val()).toString();

      if (val === '') {
        this.compBox.hide();
        return;
      }
      this.typing = false;
	  if(val.length >= this.options.queryMinChars) this.suggest(val);

      
    },
	suggest:function(v){

		switch(this.options.sugType){
			case 'ajax':
				if(this.typing) return;
				var opt = this.options, 
				container = $(opt.container),
				loadClass = opt.loadClass,
				
				reader = opt.reader,

          		
				self = this;
				
          		this.parm[reader.cat] = $('#searchCat').val();
          		this.parm[reader.key] = this.espace(v);

          		var url = opt.source + '?' + $.object.toQueryString(this.parm);
				container.addClass(loadClass);
				$.ajax({
					dataType : 'json',
            		type : 'GET',
					url: url,
					data: self.parm
				})
				.done(function() { })
				.always(function(data) { 
					container.removeClass(loadClass);
					//var dat = $.parseJSON(data).data;
					//self.norMod(v,dat);
					
					$.isFunction(self.options.dataRender) ? $.fireEvent(self.options.dataRender,[data,self]) : self.fill(data,v);	
			   		self.typing = false;
			   	});
			break;
			case 'normal':
				this.norMod(v,this.toArray(this.options.source));
				
			break;
			case 'custom':
				this.custMod(v,this.toArray(this.options.source));
				
			break;
		}
	},
	norMod: function(val,datas){
		var reg = new RegExp(this.espace(val), 'i'), self = this,matched = [];
		$.each(datas, function (i, n) {
			reg.test(n) && matched.push(n);
		});
		
		matched.sort(function (a, b) {
			return a.indexOf(val) - b.indexOf(val);
		});
		
		$.each(matched, function (i, n) {
			matched[i] = self.template(n);
		});
		
		this.fill(matched.join(''),val);
	},
	custMod: function(val,datas){
		var separator = this.options.separator,
          regexp = this.regexp,
          part = regexp ? val.match(regexp) : null,
          matched = [],
          all = [],
          self = this,
          reg,
          item;

      if (part) {
        part = part[0];
        val = val.replace(regexp, '');
        reg = new RegExp('^' +  espace(part), 'i');
      }

      $.each(datas, function (i, n) {
        n = separator + n;
        item = self.template(val + n);

        if (reg && reg.test(n)) {
          matched.push(item);
        } else {
          all.push(item);
        }
      });

      matched = matched.length ? matched.sort() : all;

      if (this.options.position === 'top') {
        matched = matched.reverse();
      }

      this.fill(matched.join(''),val);
	},
	template: function (text) {
      var tag = this.options.itemTag,vttr = this.options.dataAttr ?' '+this.options.dataAttr+'='+text:'';
		
      return ('<'+tag+vttr+'>' + text + '</' + tag + '>');
    },
	fill: function (html,pat) {
      var filter;

      this.compBox.empty();
	
      if (html) {
		  
        filter = this.options.position === 'top' ? ':last' : ':first';
        this.compBox.html(html);
		
		this.options.highlight && this.compBox.highlight(pat);
        this.compBox.children(filter);//.addClass(this.defaults.selectedClass);
        this.place();
      } else {
        this.hideComp();
      }
    },
	hideComp:function(){
		this.compBox.hide();
		
	},
	place: function () {

		this.compBox.css({'width':this.element.outerWidth(),'display':'block'}).flpos(this.element,this.options.position,this.options.skew.x,this.options.skew.y);

	},
	toRegexp: function (s) {
		if (typeof s === 'string' && s !== '') {
		  s = this.espace(s);
	
		  return new RegExp(s + '+[^' + s + ']*$', 'i');
		}
	
		return null;
	 },
	
	 espace: function (s) {
		return s.replace(/([\.\$\^\{\[\(\|\)\*\+\?\\])/g, '\\$1');
	 },
	
	 toArray: function (s) {
		if (typeof s === 'string') {
		  s = s.replace(/[\{\}\[\]"']+/g, '').split(/\s*,+\s*/);
		}
	
		s = $.map(s, function (n) {
		  return typeof n !== 'string' ? n.toString() : n;
		});
	
		return s;
	 }
});


//	return {
//		Overlay: ZUI.Overlay,
//		Box: ZUI.Box,
//		ImgZoom: ZUI.ImgZoom,
//		Paging:ZUI.Paging,
//		Rate: ZUI.Rate,
//		PrArea: ZUI.PrArea,
//		Countdown: ZUI.Countdown,
//		CR: ZUI.CR,
//		Dp: ZUI.Dp,
//		Tab: ZUI.Tab,
//		Info: ZUI.Info,
//		PassShark: ZUI.PassShark,
//		Lazyload: ZUI.Lazyload,
//		DropMenu: ZUI.DropMenu,
//		SL: ZUI.SL,
//		VsWatcher: ZUI.VsWatcher,
//		Validator: ZUI.Validator,
//		History: ZUI.History,
//		Storage: ZUI.Storage
//	}


	
});