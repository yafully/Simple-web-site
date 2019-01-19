(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module depending on jQuery.
        define(['jquery'], factory);
    } else {
        // No AMD. Register plugin with global jQuery object.
        factory(jQuery);
    }
}(function ($) {


	/*
	ZUI.Browser.fn
	*/
	/****Browser****
		 $.browser.msie
		 $.browser.webkit
		 $.browser.version
		 $.browser.desktop
		 $.browser.mobile
		$.browser.android
		$.browser.blackberry
		$.browser.cros
		$.browser.ipad
		$.browser.iphone
		$.browser.ipod
		$.browser.kindle
		$.browser.linux
		$.browser.mac
		$.browser.playbook
		$.browser.silk
		$.browser.win
		$.browser["windows phone"]
	**/
	
	if(!jQuery.browser){
			
		(function($){
		  "use strict";
		
		  function uaMatch( ua ) {
			// If an UA is not provided, default to the current browser UA.
			if ( ua === undefined ) {
			  ua = window.navigator.userAgent;
			}
			ua = ua.toLowerCase();
		
			var match = /(edge)\/([\w.]+)/.exec( ua ) ||
				/(opr)[\/]([\w.]+)/.exec( ua ) ||
				/(chrome)[ \/]([\w.]+)/.exec( ua ) ||
				/(iemobile)[\/]([\w.]+)/.exec( ua ) ||
				/(version)(applewebkit)[ \/]([\w.]+).*(safari)[ \/]([\w.]+)/.exec( ua ) ||
				/(webkit)[ \/]([\w.]+).*(version)[ \/]([\w.]+).*(safari)[ \/]([\w.]+)/.exec( ua ) ||
				/(webkit)[ \/]([\w.]+)/.exec( ua ) ||
				/(opera)(?:.*version|)[ \/]([\w.]+)/.exec( ua ) ||
				/(msie) ([\w.]+)/.exec( ua ) ||
				///ucweb/i.exec(ua) || 
				ua.indexOf("trident") >= 0 && /(rv)(?::| )([\w.]+)/.exec( ua ) ||
				ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec( ua ) ||
				ua.match(/MicroMessenger/i)=="micromessenger" ||
				[];
		
			var platform_match = /(ipad)/.exec( ua ) ||
				/(ipod)/.exec( ua ) ||
			/(windows phone)/.exec( ua ) ||
				/(iphone)/.exec( ua ) ||
				/(kindle)/.exec( ua ) ||
				/(silk)/.exec( ua ) ||
				/(android)/.exec( ua ) ||
				
				/(win)/.exec( ua ) ||
				/(mac)/.exec( ua ) ||
				/(linux)/.exec( ua ) ||
				/(cros)/.exec( ua ) ||
				/(playbook)/.exec( ua ) ||
				/(bb)/.exec( ua ) ||
				/(blackberry)/.exec( ua ) ||
				[];
		
			var browser = {},
				matched = {
				  browser: match[ 5 ] || match[ 3 ] || match[ 1 ] || "",
				  version: match[ 2 ] || match[ 4 ] || "0",
				  versionNumber: match[ 4 ] || match[ 2 ] || "0",
				  platform: platform_match[ 0 ] || ""
				};
		
			if ( matched.browser ) {
			  browser[ matched.browser ] = true;
			  browser.version = matched.version;
			  browser.versionNumber = parseInt(matched.versionNumber, 10);
			}
		
			if ( matched.platform ) {
			  browser[ matched.platform ] = true;
			}
		
			// These are all considered mobile platforms, meaning they run a mobile browser
			if ( browser.android || browser.bb || browser.blackberry || browser.ipad || browser.iphone ||
			  browser.ipod || browser.kindle || browser.playbook || browser.silk || browser[ "windows phone" ]) {
			  browser.mobile = true;
			}
		
			// These are all considered desktop platforms, meaning they run a desktop browser
			if ( browser.cros || browser.mac || browser.linux || browser.win ) {
			  browser.desktop = true;
			}
		
			// Chrome, Opera 15+ and Safari are webkit based browsers
			if ( browser.chrome || browser.opr || browser.safari ) {
			  browser.webkit = true;
			}
		
			// IE11 has a new token so we will assign it msie to avoid breaking changes
			if ( browser.rv || browser.iemobile) {
			  var ie = "msie";
		
			  matched.browser = ie;
			  browser[ie] = true;
			}
		
			// Edge is officially known as Microsoft Edge, so rewrite the key to match
			if ( browser.edge ) {
			  delete browser.edge;
			  var msedge = "msedge";
		
			  matched.browser = msedge;
			  browser[msedge] = true;
			}
		
			// Blackberry browsers are marked as Safari on BlackBerry
			if ( browser.safari && browser.blackberry ) {
			  var blackberry = "blackberry";
		
			  matched.browser = blackberry;
			  browser[blackberry] = true;
			}
		
			// Playbook browsers are marked as Safari on Playbook
			if ( browser.safari && browser.playbook ) {
			  var playbook = "playbook";
		
			  matched.browser = playbook;
			  browser[playbook] = true;
			}
		
			// BB10 is a newer OS version of BlackBerry
			if ( browser.bb ) {
			  var bb = "blackberry";
		
			  matched.browser = bb;
			  browser[bb] = true;
			}
		
			// Opera 15+ are identified as opr
			if ( browser.opr ) {
			  var opera = "opera";
		
			  matched.browser = opera;
			  browser[opera] = true;
			}
		
			// Stock Android browsers are marked as Safari on Android.
			if ( browser.safari && browser.android ) {
			  var android = "android";
		
			  matched.browser = android;
			  browser[android] = true;
			}
		
			// Kindle browsers are marked as Safari on Kindle
			if ( browser.safari && browser.kindle ) {
			  var kindle = "kindle";
		
			  matched.browser = kindle;
			  browser[kindle] = true;
			}
		
			 // Kindle Silk browsers are marked as Safari on Kindle
			if ( browser.safari && browser.silk ) {
			  var silk = "silk";
		
			  matched.browser = silk;
			  browser[silk] = true;
			}
		
			// Assign the name and platform variable
			browser.name = matched.browser;
			browser.platform = matched.platform;
			return browser;
		  }
		
		  // Run the matching process, also assign the function to the returned object
		  // for manual, jQuery-free use if desired
		  window.jQBrowser = uaMatch( window.navigator.userAgent );
		  window.jQBrowser.uaMatch = uaMatch;
		
		  // Only assign to jQuery.browser if jQuery is loaded
		  if ( jQuery ) {
			jQuery.browser = window.jQBrowser;
		  }
		
		  return window.jQBrowser;
		})(jQuery);
	}
	//fix ie8 bug	
	if (!Array.prototype.indexOf){
	  Array.prototype.indexOf = function(elt /*, from*/){
		var len = this.length >>> 0;
	
		var from = Number(arguments[1]) || 0;
		from = (from < 0)
			 ? Math.ceil(from)
			 : Math.floor(from);
		if (from < 0)
		  from += len;
	
		for (; from < len; from++)
		{
		  if (from in this &&
			  this[from] === elt)
			return from;
		}
		return -1;
	  };
	}

	if (!Function.prototype.bind) {
	  Function.prototype.bind = function (oThis) {
	    if (typeof this !== "function") {
	      throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
	    }
	    var aArgs = Array.prototype.slice.call(arguments, 1), 
	        fToBind = this, 
	        fNOP = function () {},
	        fBound = function () {
	          return fToBind.apply(this instanceof fNOP ? this : oThis || this, aArgs.concat(Array.prototype.slice.call(arguments)));
	        };
	    fNOP.prototype = this.prototype;
	    fBound.prototype = new fNOP();
	    return fBound;
	  };
	}
	
	ZUI = {
		version: '1.5.0Dev20150304'
	};

	
	/*====Utility====*/
	//去除ID中影响jq的特殊字符
	$.parseId = function(myid) {
		return myid.replace( /(:|\.|\[|\]|,)/g, "\\$1" );
	}

	$.GUID = function () {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
			return v.toString(16);
		});		
	}

	$.fireEvent = function(fn,arg){
		if(!$.isFunction(fn)) return;
		var args = $.isArray(arg) ? arg : [].push(arg);
		return arg ? fn.apply(this,args) : fn.call(this);
	}
	
	$.support = $.support || {};
	/*CSS3 animation detect*/
	$.support.ani = 'WebkitAnimation' in document.documentElement.style ||'MozAnimation' in document.documentElement.style ||'msAnimation' in document.documentElement.style ||'OAnimation' in document.documentElement.style || 'animation' in document.documentElement.style;
	
	/*CSS3 animation end Evt detect*/
	var whichAnimationEvent = function(trans){
		var t,
		  el = document.createElement("fakeelement");
		
		  var transitions = trans?
		  {'transition':'transitionend','OTransition':'oTransitionEnd','MozTransition':'transitionend','WebkitTransition':'webkitTransitionEnd'}:
		  {"animation": "animationend","OAnimation": "oanimationend","MozAnimation": "mozAnimationEnd","webkitAnimation": "webkitAnimationEnd"}
	//animationstart webkitAnimationStart MSAnimationStart oanimationstart	
		  for (t in transitions){
			if (el.style[t] !== undefined){
			  return transitions[t];
			}
		  }
	}
	$.support.aniEndEvt = whichAnimationEvent();
	$.support.TranEndEvt = whichAnimationEvent(1);
	/*Canvas detect*/
	$.support.canvas = function() {
	   return !!document.createElement('canvas').getContext;
	};
	/*Svg detect*/
	$.support.svg = function() {
		return document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#Shape", "1.0");
	}
	/*WebGL detect*/
	$.support.webGL = function(){
		try {
	        var canvas = document.createElement("canvas");
	        return !! window.WebGLRenderingContext &&  (canvas.getContext("webgl") ||  canvas.getContext("experimental-webgl"));
	    } catch(e) { 
	        return false;
	    }
	}
	//终端
	$.device = $.device || {};
	$.device.PixelRatio = window.devicePixelRatio || 1;	
	$.device.w = $(window);
	$.device.m = $.browser.mobile && window.screen.width<600;	
	//preload Imgs
	$.imgpreload = function (imgs,settings){
		settings = $.extend({},$.fn.imgpreload.defaults,(settings instanceof Function)?{all:settings}:settings);
		// use of typeof required
		if ('string' == typeof imgs) { imgs = new Array(imgs); }
		var loaded = new Array(),baseUrl = settings.baseUrl ? settings.baseUrl : '',backUrls=[];
		$.each(imgs,function(i,elem){
			var img = new Image();
			
			var url = baseUrl+elem;
			
			var img_obj = img;
			
			if ('string' != typeof elem){
				url = $(elem).attr('src') || $(elem).css('background-image').replace(/^url\((.*)?\)$/mg, "$1").replace(/(\"|\'|\ )/g, "");
				img_obj = elem;
			}
			backUrls.push(url);
			$(img).bind('load error', function(e){
				loaded.push(img_obj);
	
				$.data(img_obj, 'loaded', ('error'==e.type)?false:true);
				
				
				$.fireEvent(settings.each, [i,url,backUrls]);//each
				if (loaded.length>=imgs.length)$.fireEvent(settings.all, [loaded,backUrls]);//all
	
				$(this).unbind('load error');
			});
	
			img.src = url;
		});
	};
	/*====Utility====*/
	
	/*===Deferred===*/
	// Wrap setTimeout in a Deferred
	$.wait = function(delay, context){
	  var deferred = $.Deferred();
	  var timer = setTimeout(function(){
		deferred.resolveWith(context || deferred);
	  }, delay);
	  deferred.fail(function(){
		clearTimeout(timer);
	  });
	  return deferred;
	};
	/*异步缓存*/
	$.createCache = function( requestFunction ) { 
		var cache = {}; 
		return function( key, callback ) { 
			if ( !cache[ key ] ) { 
				cache[ key ] = $.Deferred(function( defer ) { 
					requestFunction( defer, key ); 
				}).promise(); 
			} 
		return cache[ key ].done( callback ); 
		}; 
	}
	//请求js
	$.cachedGetScript = $.createCache(function( defer, url ) { 
		$.getScript(url).then( defer.resolve, defer.reject ); 
	});
	//后domredy
	var readyTime; 
	$(function(){ 
		readyTime = jQuery.now();
	}); 
	$.afterDOMReady = $.createCache(function( defer, delay ) { 
		delay = delay || 0; 
		$(function() { 
			var delta = $.now() - readyTime; 
			if ( delta >= delay ) { 
				defer.resolve(); 
			}else { 
				setTimeout( defer.resolve, delay - delta ); 
			} 
		}); 
	});
	/*===Deferred===*/
// ###################################cookie操作相关函数###################################
    /**
     * @function jQuery.cookie jQuery.cookie
     * @parent jquerypp
     * @plugin jquerypp/dom/cookie
     * @author Klaus Hartl/klaus.hartl@stilbuero.de
     *
     * @signature `jQuery.cookie(name, [value, ] [options])`
     * @param {String} [name] The name of the cookie.
     * @param {String} [value] The value of the cookie.
     * @param {{}} [options] An object literal containing key/value pairs to provide optional cookie attributes. Values can be:
     * @option {Integer|Date} expires Either an integer specifying the expiration date from now on in days or a Date object. If a negative value is specified (e.g. a date in the past), the cookie will be deleted. If set to null or omitted, the cookie will be a session cookie and will not be retained when the the browser exits.
     * @option {String} domain The domain name
     * @option {String} path The value of the path atribute of the cookie (default: path of page that created the cookie).
     * @option {Boolean} secure If true, the secure attribute of the cookie will be set and the cookie transmission will require a secure protocol (like HTTPS).
     *
     * @return {String} the value of the cookie or {undefined} when setting the cookie.
     *
     * @body
     *
     * `jQuery.cookie(name, [value], [options])` lets you create, read and remove cookies. It is the
     * [jQuery cookie plugin](https://github.com/carhartl/jquery-cookie) written by [Klaus Hartl](http://www.dasstilbuero.de/)
     * and dual licensed under the [MIT](http://www.opensource.org/licenses/mit-license.php)
     * and [GPL](http://www.gnu.org/licenses/gpl.html) licenses.
     *
	 * ## Examples
	 *
	 * Set the value of a cookie.
	 *
	 *      $.cookie('the_cookie', 'the_value');
	 *
	 * Create a cookie with all available options.
	 *
     *      $.cookie('the_cookie', 'the_value', {
     *          expires: 7,
     *          path: '/',
     *          domain: 'jquery.com',
     *          secure: true
     *      });
	 *
	 * Create a session cookie.
	 *
     *      $.cookie('the_cookie', 'the_value');
	 *
	 * Delete a cookie by passing null as value. Keep in mind that you have to use the same path and domain
	 * used when the cookie was set.
	 *
     *      $.cookie('the_cookie', null);
	 *
	 * Get the value of a cookie.
     *
	 *      $.cookie('the_cookie');
     *
     */
    $.cookie = function(name, value, options) {
        if (typeof value != 'undefined') {
            // name and value given, set cookie
            options = options ||
            {};
            if (value === null) {
                value = '';
                options.expires = -1;
            }
	        // convert value to JSON string
            if (typeof value == 'object' && JSON.stringify) {
                value = JSON.stringify(value);
            }
            var expires = '';
	        // Set expiry
            if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
                var date;
                if (typeof options.expires == 'number') {
                    date = new Date();
                    date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
                }
                else {
                    date = options.expires;
                }
                expires = '; expires=' + date.toUTCString(); // use expires attribute, max-age is not supported by IE
            }
            // CAUTION: Needed to parenthesize options.path and options.domain
            // in the following expressions, otherwise they evaluate to undefined
            // in the packed version for some reason...
            var path = options.path ? '; path=' + (options.path) : '';
            var domain = options.domain ? '; domain=' + (options.domain) : '';
            var secure = options.secure ? '; secure' : '';
	        // Set the cookie name=value;expires=;path=;domain=;secure-
            document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
        }
        else { // only name given, get cookie
            var cookieValue = null;
            if (document.cookie && document.cookie != '') {
                var cookies = document.cookie.split(';');
                for (var i = 0; i < cookies.length; i++) {
                    var cookie = $.trim(cookies[i]);
                    // Does this cookie string begin with the name we want?
                    if (cookie.substring(0, name.length + 1) == (name + '=')) {
	                    // Get the cookie value
                        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                        break;
                    }
                }
            }
	        // Parse JSON from the cookie into an object
            if (cookieValue && cookieValue.match(/^\s*\{/)) {
                try {
                    cookieValue = JSON.parse(cookieValue);
                }
                catch (e) {
                }
            }
            return cookieValue;
        }
    };	
	/*======Object======*/
	$.object = $.object || {};
	
	//序列化Object为String
	$.object.toQueryString = function(object, base, onlyValue){
			var queryString = [];
			$.each(object, function(key, value){
				if (base) key = base + '[' + key + ']';
				var result;
				
				switch (typeof(value)){
					case 'object': result = $.object.toQueryString(value, key); break;
					case 'array':
						var qs = {};
						value.each(function(val, i){
							qs[i] = val;
						});
						result = $.object.toQueryString(qs, key);
					break;
					
					default: result = onlyValue ? encodeURIComponent(value) : key + '=' + encodeURIComponent(value);
				}
				if (value != null && typeof(value)!='function') queryString.push(result);
			});
			return queryString.join('&');	
	}
	//返回所有对象值
	$.object.values = function(object){
			var values = [];
			for (var key in object){
				if (object.hasOwnProperty(key)) values.push(object[key]);
			}
			return values;	
	}
	//检测是否含有某值不存在返回null
	$.object.keyOf = function(object, value){
			for (var key in object){
				if (object.hasOwnProperty(key) && object[key] === value) return key;
			}
			return null;	
	}
	$.object.size = function(object) {
		var size = 0;
		for (var key in object) {
			if (object.hasOwnProperty(key)) size++;
		}
		return size;
	};
	//获取对象子集
	$.object.subset = function(object, keys){
			var results = {};
			for (var i = 0, l = keys.length; i < l; i++){
				var k = keys[i];
				if (k in object) results[k] = object[k];
			}
			return results;	
	}
	//删除对象指定键
	$.object.erase = function(object, key){
			if (object.hasOwnProperty(key)) delete object[key];
			return object;
	}
	//删除对象指定键值
	$.object.cleanValues = function(object, method){
			method = method || function(value){return value != null};
			for (var key in object) 
			//console.log();
			if (!method(object[key]) && typeof object[key] !='function'){
				
				delete object[key];
			}
			
			return object;
	}
	// ################String扩展####################//
	$.string = $.string || {};
	
	
	/**
	 * 对目标字符串进行html解码
	 * 
	 * @name jQuery.string.decodeHTML
	 * @function
	 * @grammar jQuery.string.decodeHTML(source)
	 * @param {string}
	 *            source 目标字符串
	 * @shortcut decodeHTML
	 * @meta standard
	 * @see jQuery.string.encodeHTML
	 * 
	 * @returns {string} html解码后的字符串
	 */
	 
	$.string.decodeHTML = function(source) {
		var str = String(source).replace(/&quot;/g, '"').replace(/&lt;/g, '<')
					.replace(/&gt;/g, '>').replace(/&amp;/g, "&");
		// 处理转义的中文和实体字符
		return str.replace(/&#([\d]+);/g, function(_0, _1) {
			return String.fromCharCode(parseInt(_1, 10));
		});
	};
	
	/**
	 * 对目标字符串进行html编码
	 * 
	 * @name jQuery.string.encodeHTML
	 * @function
	 * @grammar jQuery.string.encodeHTML(source)
	 * @param {string}
	 *            source 目标字符串
	 * @remark 编码字符有5个：&<>"'
	 * @shortcut encodeHTML
	 * @meta standard
	 * @see jQuery.string.decodeHTML
	 * 
	 * @returns {string} html编码后的字符串
	 */
	$.string.encodeHTML = function(source) {
		return String(source).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(
				/>/g, '&gt;').replace(/"/g, "&quot;").replace(/'/g, "&#39;");
	};
	
	/**
	 * 将目标字符串中常见全角字符转换成半角字符
	 * 
	 * @name jQuery.string.toHalfWidth
	 * @function
	 * @grammar jQuery.string.toHalfWidth(source)
	 * @param {string}
	 * source 目标字符串
	 * @remark
	 * 
	 * 将全角的字符转成半角, 将"&amp;#xFF01;"至"&amp;#xFF5E;"范围的全角转成"&amp;#33;"至"&amp;#126;",
	 * 还包括全角空格包括常见的全角数字/空格/字母, 用于需要同时支持全半角的转换, 具体转换列表如下("空格"未列出)：<br>
	 * ０ => 0<br>
	 * １ => 1<br>
	 * ２ => 2<br>
	 * ３ => 3<br>
	 * ４ => 4<br>
	 * ５ => 5<br>
	 * ６ => 6<br>
	 * ７ => 7<br>
	 * ８ => 8<br>
	...more
	 * 
	 * 
	 * @returns {string} 转换后的字符串
	 */
	
	$.string.toHalfWidth = function(source) {
		return String(source).replace(/[\uFF01-\uFF5E]/g, function(c) {
			return String.fromCharCode(c.charCodeAt(0) - 65248);
		}).replace(/\u3000/g, " ");
	};
	
	$.string.getRegexForTag = function(tag, contents){
		tag = tag || '';
		var regstr = contents ? "<" + tag + "(?!\\w)[^>]*>([\\s\\S]*?)<\/" + tag + "(?!\\w)>" : "<\/?" + tag + "([^>]+)?>",
			reg = new RegExp(regstr, "gi");
		return reg;	
	};
	
	//获取标签
	$.string.getTags = function(source, tag, contents){
			return source.match($.string.getRegexForTag(tag, contents)) || [];
	};
	
	//去除标签
	$.string.stripTags = function(source, tag, contents){
			return source.replace($.string.getRegexForTag(tag, contents), '');
	};
	
	/**
	 * 将目标字符串中可能会影响正则表达式构造的字符串进行转义。
	 * 
	 * @name jQuery.string.escapeReg
	 * @function
	 * @grammar jQuery.string.escapeReg(source)
	 * @param {string}
	 *            source 目标字符串
	 * @remark 给以下字符前加上"\"进行转义：.*+?^=!:${}()|[]/\
	 * @meta standard
	 * 
	 * @returns {string} 转义后的字符串
	 */
	$.string.escapeReg = function(source) {
		return String(source).replace(
				new RegExp("([.*+?^=!:\x24{}()|[\\]\/\\\\])", "g"), '\\\x241');
	};
	
	//替换所有
	$.string.replaceAll = function(source,s1,s2,ignore) {
		return source.replace(new RegExp(s1.replace(/([\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g, function(c){return "\\" + c;}), "g"+(ignore?"i":"")), s2);
	};
	// 从左截取指定长度的字串
	$.string.left = function(source,n){
		return source.slice(0, n);
	};
	// 从右截取指定长度的字串
	$.string.right = function(source,n){ 
		return source.slice(source.length - n);
	};
	
	$.string.interpret = function(value) {
		return value == null ? '' : value;
	};
	
	$.prepareReplacement = function(replacement) {
		if ($.isFunction(replacement)) return replacement;
		var template = new Template(replacement);
		return function(match) { return template.evaluate(match) };
	};
	$.string.gsub = function(s,pattern, replacement) {
		 var result = '',
			 source = s,
			 match,
			 replacement = $.prepareReplacement(replacement);
		 while (source.length > 0) {
			 if (match = source.match(pattern)) {
				 result += source.slice(0, match.index);
				 
				 result += $.string.interpret(replacement(match));
				 // pass match (object) to replacement(function),
				 // return value replace match[0]...
				 // origin Template.evaluate function recursive invoke String.gsub function
				 source = source.slice(match.index + match[0].length);
			 } else {
				 result += source, source = '';
			 }
		 }
		 
		 return result;
	};
	
	// ################Array扩展####################//
	$.array = $.array || {};
	/**
	 * 判断一个数组中是否包含给定元素
	 * 
	 * @name jQuery.array.contains
	 * @function
	 * @grammar jQuery.array.contains(source, obj)
	 * @param {Array}
	 *            source 需要判断的数组.
	 * @param {Any}
	 *            obj 要查找的元素.
	 * @return {boolean} 判断结果.
	 * @author berg
	 */
	$.array.contains = function(source, obj) {
		return ($.inArray(obj,source) >= 0);
	};
	
	/*
	*返回一个符合指定条件的新数组	
	*/
	$.array.filter = $.grep;
	$.array.map = $.map;
	/**
	 * 从数组中寻找符合条件的第一个元素
	 * 
	 * @name jQuery.array.pick
	 * @function
	 * @grammar jQuery.array.pick(source, iterator)
	 * @param {Array}
	 *            source 需要查找的数组
	 * @param {Function}
	 *            iterator 对每个数组元素进行查找的函数，该函数有两个参数，第一个为数组元素，第二个为数组索引值，function
	 *            (item, index)，函数需要返回true或false
	 * @see jQuery.array.filter,jQuery.array.indexOf
	 * 
	 * @returns {Any|null} 符合条件的第一个元素，找不到时返回null
	 */
	$.array.pick = function(source, iterator) {
		var item, i, len = source.length;
	
		if ('function' == typeof iterator) {
			for (i = 0; i < len; i++) {
				item = source[i];
				if (true === iterator.call(source, item, i)) {
					return item;
				}
			}
		}
	
		return null;
	};
	
	/**
	 * 查询数组中指定元素的索引位置
	 * 
	 * @name jQuery.array.indexOf
	 * @function
	 * @grammar jQuery.array.indexOf(source, match[, fromIndex])
	 * @param {Array}
	 *            source 需要查询的数组
	 * @param {Any}
	 *            match 查询项
	 * @param {number}
	 *            [fromIndex] 查询的起始位索引位置，如果为负数，则从source.length+fromIndex往后开始查找
	 * @see jQuery.array.find,jQuery.array.lastIndexOf
	 * 
	 * @returns {number} 指定元素的索引位置，查询不到时返回-1
	 */
	$.array.indexOf = function(source, match, fromIndex) {
		return $.inArray(match,source,fromIndex);
	};
	/**
	 * 从后往前，查询数组中指定元素的索引位置
	 * 
	 * @name jQuery.array.lastIndexOf
	 * @function
	 * @grammar jQuery.array.lastIndexOf(source, match)
	 * @param {Array}
	 *            source 需要查询的数组
	 * @param {Any}
	 *            match 查询项
	 * @param {number}
	 *            [fromIndex] 查询的起始位索引位置，如果为负数，则从source.length+fromIndex往前开始查找
	 * @see jQuery.array.indexOf
	 * 
	 * @returns {number} 指定元素的索引位置，查询不到时返回-1
	 */
	$.array.lastIndexOf = function(source, match, fromIndex) {
		var len = source.length;
	
		fromIndex = fromIndex | 0;
	
		if (!fromIndex || fromIndex >= len) {
			fromIndex = len - 1;
		}
		if (fromIndex < 0) {
			fromIndex += len;
		}
		for (; fromIndex >= 0; fromIndex--) {
			if (fromIndex in source && source[fromIndex] === match) {
				return fromIndex;
			}
		}
	
		return -1;
	};
	
	/**
	 * 移除数组中的项
	 * 
	 * @name jQuery.array.remove
	 * @function
	 * @grammar jQuery.array.remove(source, match)
	 * @param {Array}
	 *            source 需要移除项的数组
	 * @param {Any}
	 *            match 要移除的项
	 * @meta standard
	 * @see jQuery.array.removeAt
	 * 
	 * @returns {Array} 移除后的数组
	 */
	$.array.remove = function(source, match) {
		if(!match){
			source=[];
		}else{
			var len = source.length;
			
			while (len--) {
				if (len in source && source[len] === match) {
					source.splice(len, 1);
				}
			}
		}
		return source;
	};
	/**
	 * 根据索引移除数组中的项
	 * 
	 * @name jQuery.array.removeAt
	 * @function
	 * @grammar jQuery.array.removeAt(source, index)
	 * @param {Array}
	 *            source 需要移除项的数组
	 * @param {number}
	 *            index 要移除项的索引位置
	 * @see jQuery.array.remove
	 * @meta standard
	 * @returns {Any} 被移除的数组项
	 */
	
	$.array.removeAt = function(array, from, to) {  
	  var rest = array.slice((to || from) + 1 || array.length);  
	  array.length = from < 0 ? array.length + from : from;  
	  array.push.apply(array, rest); 
	  return array;
	}; 
	/**
	 * 过滤数组中的相同项。如果两个元素相同，会删除后一个元素。
	 * 
	 * @name jQuery.array.unique
	 * @function
	 * @grammar jQuery.array.unique(source[, compareFn])
	 * @param {Array}
	 *            source 需要过滤相同项的数组
	 * @param {Function}
	 *            [compareFn] 比较两个数组项是否相同的函数,两个数组项作为函数的参数。
	 * 
	 * @returns {Array} 过滤后的新数组
	 */
	$.array.unique = function(source) {
		return $.array.combine([],source);
	};
	
	/*
	*随机打乱数
	*/
	$.array.shuffle = function(source) {
		return source.sort(function (x,y) { return Math.floor(Math.random()*3)-1; });
	};
	
	/*
	*向对象数组push一个元素，如果它在数组中不存在,大小写敏感
	*/
	$.array.include =  function(source,item){
			if (!$.array.contains(source,item)) source.push(item);
			return source;
	};
	
	/*
	*联合2个数组且去掉重复项
	*/
	$.array.combine = function(source,array){
			for (var i = 0, l = array.length; i < l; i++) $.array.include(source,array[i]);
			return source;
	};
	
	/*
	//返回2个数组的交集
	*/
	$.array.intersect = function(source,other){
			var cpy = source.slice();
			$.each(source,function(i,el) {
				if ($.array.indexOf(other,el) < 0)cpy.splice($.array.indexOf(cpy,el), 1);
			});
			return cpy;	
	};
	
	
	//在指定位置插入项
	$.array.insert = function(source,index, item){
		if(index < 0) index = 0;
		if(index > source.length) index = source.length;
		source.length++;
		for(var i = source.length - 1; i > index; i--) {
			source[i] = source[i - 1];
		}
		source[index] = item;
		return source;
	};
	
	$.array.insertAt = function(array,index,obj) {
		if(index < 0) index = 0;
		if(index > array.length) index = array.length;
		array.length++;
		for(var i = array.length - 1; i > index; i--) {
			array[i] = array[i - 1];
		}
		array[index] = obj;
		return array;
	}
	
	$.array.insertArrayAt = function(array, index, arrayToInsert) {
		Array.prototype.splice.apply(array, [index, 0].concat(arrayToInsert));
		return array;
	}
	/*
	//返回2个数组的差集
	*/
	$.array.differentiate = function(source,other){
			var src = source.slice();
			var cmp = other.slice();
			$.each(other,function(i,el) {
				if ($.array.indexOf(src,el) > -1) {
					// remove from both
					src.splice($.array.indexOf(src,el), 1);
					cmp.splice($.array.indexOf(cmp,el), 1);
				}
			});
			return $.array.combine(src,cmp);
	};
	
	/**/
	//$.array.every = function(source,fn,bind){
	//		for (var i = 0, l = source.length >>> 0; i < l; i++){
	//			if ((i in source) && !fn.call(bind, i, source[i], this)) return false;
	//		}
	//		return true;
	//};
	
	//pluck 返回指定数组里面的某元素的新数组
	$.array.pluck = function(source,key) { 
		return $.map(source, function(e) { 
			var arr;
			arr = e.nodeName ? e.getAttribute(key) : e[key];
			return arr; 
		}) 
	}
	
	//仿Linq条件查询
	//item	Object	当前回调返回的数组第index个元素
	//index	Int	可选参数,当前回调返的数组的索引
	//$.array.where(stooges,function(item,index){return item.name=="larry"})
	$.array.where = function(source,clause) {
		if (!clause)return;
		var len = source.length, newArray = [];
		for (var i = 0; i < len; i++) {
			if (clause(source[i], i)) {
				newArray[newArray.length] = source[i];
			}
		}
		return newArray;	
	} 
	
	// ###################################number操作相关函数###################################
	$.number = $.number || {};
	$.number.pad = function(source){
		return source>9?source:'0'+source;  
	};
	/**
	 * 生成随机整数，范围是[min, max]
	 * 
	 * @name jQuery.number.randomInt
	 * @function
	 * @grammar jQuery.number.randomInt(min, max)
	 * 
	 * @param {number}
	 *            min 随机整数的最小值
	 * @param {number}
	 *            max 随机整数的最大值
	 * @return {number} 生成的随机整数
	 */
	$.number.randomInt = function(min, max) {
		return Math.floor(Math.random() * (max - min + 1) + min);
	};
	$.number.times = function (number , b, c) {	
		for (var a = 0; a < number; a++) {
			b.call(c, a, number);
		}
	}
	// ###################################date操作相关函数###################################
	$.date = $.date || {};
		$.date.now = function (date) {
			return !date ? new Date() : new Date(date.replace(/-/g, "\/"));
		};
		//获取日期差
		$.date.compare = function (startTime, endTime, diffType) {
			var timet = { day: 86400000, hour: 3600000, minute: 60000, seconds: 1000 };
			if (typeof startTime == "string")
				startTime = $.date.now(startTime);
			if (typeof endTime == "string")
				endTime = $.date.now(endTime);
			diffType = diffType || "day";
			return parseInt((endTime.getTime() - startTime.getTime()) / parseInt(timet[diffType]));
		};
		//星期几
		$.date.getWeek = function(source, type) {
			var i = source.getDay();
			if (!type || type == "周" || type == "星期") {
				var nums = ["日", "一", "二", "三", "四", "五", "六"];
				type = type || "周";
				return type + nums[i];
			}
			else if (type == "En") {
				var ennmae = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
				return ennmae[i];
			}
			else if (type == "Short") {
				var enshortname = ["Sun.", "Mon.", "Tues.", "Wed.", "Thurs.", "Fri.", "Sat."];
				return enshortname[i];
			}
		};
		//是否是闰年
		$.date.isLeapYear = function(source) {
			var year = source.getFullYear();
			return (year % 4 == 0 && (year % 100 != 0 || year % 400 == 0))
		};
		//该月有多少天
		$.date.daysInMonth = function(source) {
			var month = source.getMonth() + 1;
			if (month != 2)
				return ((month <= 7 && month % 2 == 1) || (month > 7 && month % 2 == 0)) ? 31 : 30;
			else return $.date.isLeapYear(source) ? 29 : 28;
		};
	/**
	 * 对目标日期对象进行格式化
	 * 
	 * @name jQuery.date.format
	 * @function
	 * @grammar $.date.format(new Date(),'yyyy-MM-ddThh:mm:ss')
	 * @param {Date}
	 *            source 目标日期对象
	 * @param {string}
	 *            pattern 日期格式化规则
	 * @remark
	 * 
	 * <b>格式表达式，变量含义：</b><br>
	 * <br>
	 * hh: 带 0 补齐的两位 12 进制时表示<br>
	 * h: 不带 0 补齐的 12 进制时表示<br>
	 * HH: 带 0 补齐的两位 24 进制时表示<br>
	 * H: 不带 0 补齐的 24 进制时表示<br>
	 * mm: 带 0 补齐两位分表示<br>
	 * m: 不带 0 补齐分表示<br>
	 * ss: 带 0 补齐两位秒表示<br>
	 * s: 不带 0 补齐秒表示<br>
	 * yyyy: 带 0 补齐的四位年表示<br>
	 * yy: 带 0 补齐的两位年表示<br>
	 * MM: 带 0 补齐的两位月表示<br>
	 * M: 不带 0 补齐的月表示<br>
	 * dd: 带 0 补齐的两位日表示<br>
	 * d: 不带 0 补齐的日表示
	 * 
	 * 
	 * @returns {string} 格式化后的字符串
	 */
	
	$.date.format = function(source, pattern) {
		if ('string' != typeof pattern) {
			return source.toString();
		}
	
		function replacer(patternPart, result) {
			pattern = pattern.replace(patternPart, result);
		}
	
		var pad = $.number.pad, year = source.getFullYear(), month = source
				.getMonth() + 1, date2 = source.getDate(), hours = source
				.getHours(), minutes = source.getMinutes(), seconds = source
				.getSeconds();
	
		replacer(/yyyy/g, pad(year, 4));
		replacer(/yy/g, pad(parseInt(year.toString().slice(2), 10), 2));
		replacer(/MM/g, pad(month, 2));
		replacer(/M/g, month);
		replacer(/dd/g, pad(date2, 2));
		replacer(/d/g, date2);
	
		replacer(/HH/g, pad(hours, 2));
		replacer(/H/g, hours);
		replacer(/hh/g, pad(hours % 12, 2));
		replacer(/h/g, hours % 12);
		replacer(/mm/g, pad(minutes, 2));
		replacer(/m/g, minutes);
		replacer(/ss/g, pad(seconds, 2));
		replacer(/s/g, seconds);
	
		return pattern;
	};
	/**
	 * 将目标字符串转换成日期对象
	 * 
	 * @name jQuery.date.parse
	 * @function
	 * @grammar $.date.parse('2014-05-06T12:20:35')
	 * @param {string}
	 *            source 目标字符串
	 * @remark
	 * 
	 * 对于目标字符串，下面这些规则决定了 parse 方法能够成功地解析： <br>
	 * <ol>
	 * <li>短日期可以使用"/"或"-"作为日期分隔符，但是必须用月/日/年的格式来表示，例如"7/20/96"。</li>
	 * <li>以 "July 10 1995" 形式表示的长日期中的年、月、日可以按任何顺序排列，年份值可以用 2 位数字表示也可以用 4
	 * 位数字表示。如果使用 2 位数字来表示年份，那么该年份必须大于或等于 70。 </li>
	 * <li>括号中的任何文本都被视为注释。这些括号可以嵌套使用。 </li>
	 * <li>逗号和空格被视为分隔符。允许使用多个分隔符。 </li>
	 * <li>月和日的名称必须具有两个或两个以上的字符。如果两个字符所组成的名称不是独一无二的，那么该名称就被解析成最后一个符合条件的月或日。例如，"Ju"
	 * 被解释为七月而不是六月。 </li>
	 * <li>在所提供的日期中，如果所指定的星期几的值与按照该日期中剩余部分所确定的星期几的值不符合，那么该指定值就会被忽略。例如，尽管 1996 年 11
	 * 月 9 日实际上是星期五，"Tuesday November 9 1996" 也还是可以被接受并进行解析的。但是结果 date 对象中包含的是
	 * "Friday November 9 1996"。 </li>
	 * <li>JScript 处理所有的标准时区，以及全球标准时间 (UTC) 和格林威治标准时间 (GMT)。</li>
	 * <li>小时、分钟、和秒钟之间用冒号分隔，尽管不是这三项都需要指明。"10:"、"10:11"、和 "10:11:12" 都是有效的。 </li>
	 * <li>如果使用 24 小时计时的时钟，那么为中午 12 点之后的时间指定 "PM" 是错误的。例如 "23:15 PM" 就是错误的。</li>
	 * <li>包含无效日期的字符串是错误的。例如，一个包含有两个年份或两个月份的字符串就是错误的。</li>
	 * </ol>
	 * 
	 * 
	 * @returns {Date} 转换后的日期对象
	 */
	
	$.date.parse = function(source) {
		var reg = new RegExp("^\\d+(\\-|\\/)\\d+(\\-|\\/)\\d+\x24");
		if ('string' == typeof source) {
			if (reg.test(source) || isNaN(Date.parse(source))) {
				var d = source.split(/ |T/), d1 = d.length > 1 ? d[1]
						.split(/[^\d]/) : [ 0, 0, 0 ], d0 = d[0].split(/[^\d]/);
				return new Date(d0[0] - 0, d0[1] - 1, d0[2] - 0, d1[0] - 0,
						d1[1] - 0, d1[2] - 0);
			} else {
				return new Date(source);
			}
		}
	
		return new Date();
	};

	// ###################################url操作相关函数###################################
	$.url = $.url || {};
	/**
	 * 根据参数名从目标URL中获取参数值
	 * 
	 * @name jQuery.url.getQueryValue
	 * @function
	 * @grammar $.url.getQueryValue('http://user:password@www.test.com:8383/the/path.html?query=value&page=12','page');
	 * @param {string}
	 *            url 目标URL
	 * @param {string}
	 *            key 要获取的参数名
	 * @meta standard
	 * @see jQuery.url.jsonToQuery
	 * 
	 * @returns {string|null} - 获取的参数值，其中URI编码后的字符不会被解码，获取不到时返回null
	 */
	$.url.getQueryValue = function(url, key) {
		var reg = new RegExp("(^|&|\\?|#)" + $.string.escapeReg(key)
				+ "=([^&#]*)(&|\x24|#)", "");
		var match = url.match(reg);
		if (match) {
			return match[2];
		}
	
		return null;
	};
	/**
	 * 解析目标URL中的参数成json对象
	 * 
	 * @name jQuery.url.queryToJson
	 * @function
	 * @grammar jQuery.url.queryToJson(url)
	 * @param {string}
	 *            url 目标URL
	 * @see jQuery.url.jsonToQuery
	 * 
	 * @returns {Object} - 解析为结果对象，其中URI编码后的字符不会被解码，'a=%20' ==> {a:'%20'}。
	 */
	$.url.queryToJson = function(url) {
	  var url = decodeURI(url);
	  try{
		var url_data = url.match(/\?([^#]*)/i)[1];          // gets the string between '?' and '#'
	  }catch(e){
		var url_data = url;
	  }
	  // separate the data into an array, in case the are multiple pairs name=value
	  var ar_url_data = url_data.split('&');
	
	  // traverse the array, and adds into an object elements name:value
	  var data_url = {};
	  for(var i=0; i<ar_url_data.length; i++) {
			var ar_val = ar_url_data[i].split('=');
			data_url[ar_val[0]] = ar_val[1];
	  }
	
	  return data_url;
	};
	

	
	//mouse wheel
	(function($){
	//Mouse wheel Evt Ver 3.0.6
		var types = ['DOMMouseScroll', 'mousewheel'];
		
		if ($.event.fixHooks) {
			for ( var i=types.length; i; ) {
				$.event.fixHooks[ types[--i] ] = $.event.mouseHooks;
			}
		}
		
		$.event.special.mousewheel = {
			setup: function() {
				if ( this.addEventListener ) {
					for ( var i=types.length; i; ) {
						this.addEventListener( types[--i], handler, false );
					}
				} else {
					this.onmousewheel = handler;
				}
			},
			
			teardown: function() {
				if ( this.removeEventListener ) {
					for ( var i=types.length; i; ) {
						this.removeEventListener( types[--i], handler, false );
					}
				} else {
					this.onmousewheel = null;
				}
			}
		};
		
		$.fn.extend({
			mousewheel: function(fn) {
				return fn ? this.bind("mousewheel", fn) : this.trigger("mousewheel");
			},
			
			unmousewheel: function(fn) {
				return this.unbind("mousewheel", fn);
			}
		});
		
		
		function handler(event) {
			var orgEvent = event || window.event, args = [].slice.call( arguments, 1 ), delta = 0, returnValue = true, deltaX = 0, deltaY = 0;
			event = $.event.fix(orgEvent);
			event.type = "mousewheel";
			
			// Old school scrollwheel delta
			if ( orgEvent.wheelDelta ) { delta = orgEvent.wheelDelta/120; }
			if ( orgEvent.detail     ) { delta = -orgEvent.detail/3; }
			
			// New school multidimensional scroll (touchpads) deltas
			deltaY = delta;
			
			// Gecko
			if ( orgEvent.axis !== undefined && orgEvent.axis === orgEvent.HORIZONTAL_AXIS ) {
				deltaY = 0;
				deltaX = -1*delta;
			}
			
			// Webkit
			if ( orgEvent.wheelDeltaY !== undefined ) { deltaY = orgEvent.wheelDeltaY/120; }
			if ( orgEvent.wheelDeltaX !== undefined ) { deltaX = -1*orgEvent.wheelDeltaX/120; }
			
			// Add event and delta to the front of the arguments
			args.unshift(event, delta, deltaX, deltaY);
			
			return ($.event.dispatch || $.event.handle).apply(this, args);
		}	
	})(jQuery);
	//mouse wheel
	//mouse move
	// pageX:
	// pageY:     Page coordinates of pointer.
	// startX:
	// startY:    Page coordinates of pointer at movestart.
	// distX:
	// distY:     Distance the pointer has moved since movestart.
	// deltaX:
	// deltaY:    Distance the finger has moved since last event.
	// velocityX:
	// velocityY: Average velocity over last few events.
	(function($){

	    var // Number of pixels a pressed pointer travels before movestart
	        // event is fired.
	        threshold = 8,
	    
	        add = jQuery.event.add,
	    
	        remove = jQuery.event.remove,

	        // Just sugar, so we can have arguments in the same order as
	        // add and remove.
	        trigger = function(node, type, data) {
	            jQuery.event.trigger(type, data, node);
	        },

	        // Shim for requestAnimationFrame, falling back to timer. See:
	        // see http://paulirish.com/2011/requestanimationframe-for-smart-animating/
	        requestFrame = (function(){
	            return (
	                window.requestAnimationFrame ||
	                window.webkitRequestAnimationFrame ||
	                window.mozRequestAnimationFrame ||
	                window.oRequestAnimationFrame ||
	                window.msRequestAnimationFrame ||
	                function(fn, element){
	                    return window.setTimeout(function(){
	                        fn();
	                    }, 25);
	                }
	            );
	        })(),
	        
	        ignoreTags = {
	            textarea: true,
	            input: true,
	            select: true,
	            button: true
	        },
	        
	        mouseevents = {
	            move: 'mousemove',
	            cancel: 'mouseup dragstart',
	            end: 'mouseup'
	        },
	        
	        touchevents = {
	            move: 'touchmove',
	            cancel: 'touchend',
	            end: 'touchend'
	        };


	    // Constructors
	    
	    function Timer(fn){
	        var callback = fn,
	            active = false,
	            running = false;
	        
	        function trigger(time) {
	            if (active){
	                callback();
	                requestFrame(trigger);
	                running = true;
	                active = false;
	            }
	            else {
	                running = false;
	            }
	        }
	        
	        this.kick = function(fn) {
	            active = true;
	            if (!running) { trigger(); }
	        };
	        
	        this.end = function(fn) {
	            var cb = callback;
	            
	            if (!fn) { return; }
	            
	            // If the timer is not running, simply call the end callback.
	            if (!running) {
	                fn();
	            }
	            // If the timer is running, and has been kicked lately, then
	            // queue up the current callback and the end callback, otherwise
	            // just the end callback.
	            else {
	                callback = active ?
	                    function(){ cb(); fn(); } : 
	                    fn ;
	                
	                active = true;
	            }
	        };
	    }


	    // Functions
	    
	    function returnTrue() {
	        return true;
	    }
	    
	    function returnFalse() {
	        return false;
	    }
	    
	    function preventDefault(e) {
	        e.preventDefault();
	    }
	    
	    function preventIgnoreTags(e) {
	        // Don't prevent interaction with form elements.
	        if (ignoreTags[ e.target.tagName.toLowerCase() ]) { return; }
	        
	        e.preventDefault();
	    }

	    function isLeftButton(e) {
	        // Ignore mousedowns on any button other than the left (or primary)
	        // mouse button, or when a modifier key is pressed.
	        return (e.which === 1 && !e.ctrlKey && !e.altKey);
	    }

	    function identifiedTouch(touchList, id) {
	        var i, l;

	        if (touchList.identifiedTouch) {
	            return touchList.identifiedTouch(id);
	        }
	        
	        // touchList.identifiedTouch() does not exist in
	        // webkit yet… we must do the search ourselves...
	        
	        i = -1;
	        l = touchList.length;
	        
	        while (++i < l) {
	            if (touchList[i].identifier === id) {
	                return touchList[i];
	            }
	        }
	    }

	    function changedTouch(e, event) {
	        var touch = identifiedTouch(e.changedTouches, event.identifier);

	        // This isn't the touch you're looking for.
	        if (!touch) { return; }

	        // Chrome Android (at least) includes touches that have not
	        // changed in e.changedTouches. That's a bit annoying. Check
	        // that this touch has changed.
	        if (touch.pageX === event.pageX && touch.pageY === event.pageY) { return; }

	        return touch;
	    }


	    // Handlers that decide when the first movestart is triggered
	    
	    function mousedown(e){
	        var data;

	        if (!isLeftButton(e)) { return; }

	        data = {
	            target: e.target,
	            startX: e.pageX,
	            startY: e.pageY,
	            timeStamp: e.timeStamp
	        };

	        add(document, mouseevents.move, mousemove, data);
	        add(document, mouseevents.cancel, mouseend, data);
	    }

	    function mousemove(e){
	        var data = e.data;

	        checkThreshold(e, data, e, removeMouse);
	    }

	    function mouseend(e) {
	        removeMouse();
	    }

	    function removeMouse() {
	        remove(document, mouseevents.move, mousemove);
	        remove(document, mouseevents.cancel, mouseend);
	    }

	    function touchstart(e) {
	        var touch, template;

	        // Don't get in the way of interaction with form elements.
	        if (ignoreTags[ e.target.tagName.toLowerCase() ]) { return; }

	        touch = e.changedTouches[0];
	        
	        // iOS live updates the touch objects whereas Android gives us copies.
	        // That means we can't trust the touchstart object to stay the same,
	        // so we must copy the data. This object acts as a template for
	        // movestart, move and moveend event objects.
	        template = {
	            target: touch.target,
	            startX: touch.pageX,
	            startY: touch.pageY,
	            timeStamp: e.timeStamp,
	            identifier: touch.identifier
	        };

	        // Use the touch identifier as a namespace, so that we can later
	        // remove handlers pertaining only to this touch.
	        add(document, touchevents.move + '.' + touch.identifier, touchmove, template);
	        add(document, touchevents.cancel + '.' + touch.identifier, touchend, template);
	    }

	    function touchmove(e){
	        var data = e.data,
	            touch = changedTouch(e, data);

	        if (!touch) { return; }

	        checkThreshold(e, data, touch, removeTouch);
	    }

	    function touchend(e) {
	        var template = e.data,
	            touch = identifiedTouch(e.changedTouches, template.identifier);

	        if (!touch) { return; }

	        removeTouch(template.identifier);
	    }

	    function removeTouch(identifier) {
	        remove(document, '.' + identifier, touchmove);
	        remove(document, '.' + identifier, touchend);
	    }


	    // Logic for deciding when to trigger a movestart.

	    function checkThreshold(e, template, touch, fn) {
	        var distX = touch.pageX - template.startX,
	            distY = touch.pageY - template.startY;

	        // Do nothing if the threshold has not been crossed.
	        if ((distX * distX) + (distY * distY) < (threshold * threshold)) { return; }

	        triggerStart(e, template, touch, distX, distY, fn);
	    }

	    function handled() {
	        // this._handled should return false once, and after return true.
	        this._handled = returnTrue;
	        return false;
	    }

	    function flagAsHandled(e) {
	        e._handled();
	    }

	    function triggerStart(e, template, touch, distX, distY, fn) {
	        var node = template.target,
	            touches, time;

	        touches = e.targetTouches;
	        time = e.timeStamp - template.timeStamp;

	        // Create a movestart object with some special properties that
	        // are passed only to the movestart handlers.
	        template.type = 'movestart';
	        template.distX = distX;
	        template.distY = distY;
	        template.deltaX = distX;
	        template.deltaY = distY;
	        template.pageX = touch.pageX;
	        template.pageY = touch.pageY;
	        template.velocityX = distX / time;
	        template.velocityY = distY / time;
	        template.targetTouches = touches;
	        template.finger = touches ?
	            touches.length :
	            1 ;

	        // The _handled method is fired to tell the default movestart
	        // handler that one of the move events is bound.
	        template._handled = handled;
	            
	        // Pass the touchmove event so it can be prevented if or when
	        // movestart is handled.
	        template._preventTouchmoveDefault = function() {
	            //e.preventDefault();
	        };

	        // Trigger the movestart event.
	        trigger(template.target, template);

	        // Unbind handlers that tracked the touch or mouse up till now.
	        fn(template.identifier);
	    }


	    // Handlers that control what happens following a movestart

	    function activeMousemove(e) {
	        var timer = e.data.timer;

	        e.data.touch = e;
	        e.data.timeStamp = e.timeStamp;
	        timer.kick();
	    }

	    function activeMouseend(e) {
	        var event = e.data.event,
	            timer = e.data.timer;
	        
	        removeActiveMouse();

	        endEvent(event, timer, function() {
	            // Unbind the click suppressor, waiting until after mouseup
	            // has been handled.
	            setTimeout(function(){
	                remove(event.target, 'click', returnFalse);
	            }, 0);
	        });
	    }

	    function removeActiveMouse(event) {
	        remove(document, mouseevents.move, activeMousemove);
	        remove(document, mouseevents.end, activeMouseend);
	    }

	    function activeTouchmove(e) {
	        var event = e.data.event,
	            timer = e.data.timer,
	            touch = changedTouch(e, event);

	        if (!touch) { return; }

	        // Stop the interface from gesturing
	        e.preventDefault();

	        event.targetTouches = e.targetTouches;
	        e.data.touch = touch;
	        e.data.timeStamp = e.timeStamp;
	        timer.kick();
	    }

	    function activeTouchend(e) {
	        var event = e.data.event,
	            timer = e.data.timer,
	            touch = identifiedTouch(e.changedTouches, event.identifier);

	        // This isn't the touch you're looking for.
	        if (!touch) { return; }

	        removeActiveTouch(event);
	        endEvent(event, timer);
	    }

	    function removeActiveTouch(event) {
	        remove(document, '.' + event.identifier, activeTouchmove);
	        remove(document, '.' + event.identifier, activeTouchend);
	    }


	    // Logic for triggering move and moveend events

	    function updateEvent(event, touch, timeStamp, timer) {
	        var time = timeStamp - event.timeStamp;

	        event.type = 'move';
	        event.distX =  touch.pageX - event.startX;
	        event.distY =  touch.pageY - event.startY;
	        event.deltaX = touch.pageX - event.pageX;
	        event.deltaY = touch.pageY - event.pageY;
	        
	        // Average the velocity of the last few events using a decay
	        // curve to even out spurious jumps in values.
	        event.velocityX = 0.3 * event.velocityX + 0.7 * event.deltaX / time;
	        event.velocityY = 0.3 * event.velocityY + 0.7 * event.deltaY / time;
	        event.pageX =  touch.pageX;
	        event.pageY =  touch.pageY;
	    }

	    function endEvent(event, timer, fn) {
	        timer.end(function(){
	            event.type = 'moveend';

	            trigger(event.target, event);
	            
	            return fn && fn();
	        });
	    }


	    // jQuery special event definition

	    function setup(data, namespaces, eventHandle) {
	        // Stop the node from being dragged
	        //add(this, 'dragstart.move drag.move', preventDefault);
	        
	        // Prevent text selection and touch interface scrolling
	        //add(this, 'mousedown.move', preventIgnoreTags);
	        
	        // Tell movestart default handler that we've handled this
	        add(this, 'movestart.move', flagAsHandled);

	        // Don't bind to the DOM. For speed.
	        return true;
	    }
	    
	    function teardown(namespaces) {
	        remove(this, 'dragstart drag', preventDefault);
	        remove(this, 'mousedown touchstart', preventIgnoreTags);
	        remove(this, 'movestart', flagAsHandled);
	        
	        // Don't bind to the DOM. For speed.
	        return true;
	    }
	    
	    function addMethod(handleObj) {
	        // We're not interested in preventing defaults for handlers that
	        // come from internal move or moveend bindings
	        if (handleObj.namespace === "move" || handleObj.namespace === "moveend") {
	            return;
	        }
	        
	        // Stop the node from being dragged
	        add(this, 'dragstart.' + handleObj.guid + ' drag.' + handleObj.guid, preventDefault, undefined, handleObj.selector);
	        
	        // Prevent text selection and touch interface scrolling
	        add(this, 'mousedown.' + handleObj.guid, preventIgnoreTags, undefined, handleObj.selector);
	    }
	    
	    function removeMethod(handleObj) {
	        if (handleObj.namespace === "move" || handleObj.namespace === "moveend") {
	            return;
	        }
	        
	        remove(this, 'dragstart.' + handleObj.guid + ' drag.' + handleObj.guid);
	        remove(this, 'mousedown.' + handleObj.guid);
	    }
	    
	    jQuery.event.special.movestart = {
	        setup: setup,
	        teardown: teardown,
	        add: addMethod,
	        remove: removeMethod,

	        _default: function(e) {
	            var event, data;
	            
	            // If no move events were bound to any ancestors of this
	            // target, high tail it out of here.
	            if (!e._handled()) { return; }

	            function update(time) {
	                updateEvent(event, data.touch, data.timeStamp);
	                trigger(e.target, event);
	            }

	            event = {
	                target: e.target,
	                startX: e.startX,
	                startY: e.startY,
	                pageX: e.pageX,
	                pageY: e.pageY,
	                distX: e.distX,
	                distY: e.distY,
	                deltaX: e.deltaX,
	                deltaY: e.deltaY,
	                velocityX: e.velocityX,
	                velocityY: e.velocityY,
	                timeStamp: e.timeStamp,
	                identifier: e.identifier,
	                targetTouches: e.targetTouches,
	                finger: e.finger
	            };

	            data = {
	                event: event,
	                timer: new Timer(update),
	                touch: undefined,
	                timeStamp: undefined
	            };
	            
	            if (e.identifier === undefined) {
	                // We're dealing with a mouse
	                // Stop clicks from propagating during a move
	                add(e.target, 'click', returnFalse);
	                add(document, mouseevents.move, activeMousemove, data);
	                add(document, mouseevents.end, activeMouseend, data);
	            }
	            else {
	                // We're dealing with a touch. Stop touchmove doing
	                // anything defaulty.
	                e._preventTouchmoveDefault();
	                add(document, touchevents.move + '.' + e.identifier, activeTouchmove, data);
	                add(document, touchevents.end + '.' + e.identifier, activeTouchend, data);
	            }
	        }
	    };

	    jQuery.event.special.move = {
	        setup: function() {
	            // Bind a noop to movestart. Why? It's the movestart
	            // setup that decides whether other move events are fired.
	            add(this, 'movestart.move', jQuery.noop);
	        },
	        
	        teardown: function() {
	            remove(this, 'movestart.move', jQuery.noop);
	        }
	    };
	    
	    jQuery.event.special.moveend = {
	        setup: function() {
	            // Bind a noop to movestart. Why? It's the movestart
	            // setup that decides whether other move events are fired.
	            add(this, 'movestart.moveend', jQuery.noop);
	        },
	        
	        teardown: function() {
	            remove(this, 'movestart.moveend', jQuery.noop);
	        }
	    };

	    add(document, 'mousedown.move', mousedown);
	    add(document, 'touchstart.move', touchstart);

	    // Make jQuery copy touch event properties over to the jQuery event
	    // object, if they are not already listed. But only do the ones we
	    // really need. IE7/8 do not have Array#indexOf(), but nor do they
	    // have touch events, so let's assume we can ignore them.
	    if (typeof Array.prototype.indexOf === 'function') {
	        (function(jQuery, undefined){
	            var props = ["changedTouches", "targetTouches"],
	                l = props.length;
	            
	            while (l--) {
	                if (jQuery.event.props.indexOf(props[l]) === -1) {
	                    jQuery.event.props.push(props[l]);
	                }
	            }
	        })(jQuery);
	    };
	})(jQuery);	

	
	$.browser.IE7 = $.browser.msie && $.browser.version ==7;
	$.browser.oldIE = $.browser.msie && $.browser.version <=8;
	$.browser.qq = $.browser.android && $.browser.safari && !$.browser.chrome;
		

	/*!
	 * jQuery MooTools-like class plugin.
	 * Licence fall under Mootools's.
	 */
	(function($, window) {
	
		$.Class = function(classDefinition)
		{
			classDefinition = classDefinition || {};
	
			// create class structure
			var newClass = function()
			{
				// reset class variables. Clone arrays and objects
				reset(this);
	
				// run constructor
				return (this.initialize) ? this.initialize.apply(this, arguments) : this;
			};
	
			// store class definition
			newClass.$definition = classDefinition;
	
			// apply params to class
			extend(newClass.prototype, classDefinition);
	
			// parent function
			newClass.prototype.parentMethod = function() {
				if (arguments.callee.caller === this.$parent) {
					throw 'This function has no parent.';
				}
				return this.$parent.apply(this, arguments);
			};
	
			return newClass;
		};
	
		var reset = function(object){
			for (var key in object){
				var value = object[key];
				switch ($.type(value)) {
					case 'object': object[key] = $.extend(true, {}, value); break;
					case 'array':  object[key] = $.extend(true, [], value); break;
				}
			}
			return object;
		};
	
		var extend = function(target, object) {
			var key, value;
	
			for (key in object) {
	
				if (object.hasOwnProperty(key) === false || object[key] === undefined ) {
					continue;
				}
	
				if (key === 'Extends') {
					// class overloading
					$.each($.type(object.Extends) === 'array' ? object.Extends : [object.Extends], function() {
						extend(target, this.$definition);
					});
	
				}
				else if ($.isFunction(target[key]) && $.isFunction(object[key])) {
					// function overloading
					target[key] = overload(object[key], target[key]);
				} else {
					// regular assigning
					target[key] = object[key];
				}
			}
		};
	
		var overload = function(overloadFunction, parentFunction) {
			return function() {
				var oldParent = this.$parent;
				this.$parent = parentFunction;
				var result = overloadFunction.apply(this, arguments);
				this.$parent = oldParent;
				return result;
			};
		};
	
		/**
		 * @param string
		 * @returns {XML|string|void}
		 * @private
		 */
		var removeOn = function(string){
			return string.replace(/^on([A-Z])/, function(full, first){
				return first.toLowerCase();
			});
		};

	
		/**
		 * Class to send and receive events
		 *
		 * @class Events
		 */
		
		this.Events = new $.Class({
	
			$events: {},
	
			/**
			 * Add an event
			 *
			 * @param {String} type - the name of the event
			 * @param {Function} fn - the function to call
			 * @returns {*}
			 * @public
			 */
			on: function(type, fn){
				type = removeOn(type);
				var events = this.$events[type] || [];
				if ($.inArray(events, fn) < 0) {
					events.push(fn);
					this.$events[type] = events;
				}
				return this;
			},
	
			/**
			 * Remove an event
			 * @param {String} type - the name of the event
			 * @param {Function} [fn] - optional the function to be removed. Otherwise all listeners
			 * @returns {*}
			 * @public
			 */
			off: function(type, fn){
				type = removeOn(type);
				var events = this.$events[type];
				if (events){
					if (fn == undefined) {
						delete this.$events[type];
					} else {
						var index = events.indexOf(fn);
						if (index != -1) delete events[index];
					}
				}
				return this;
			},
	
			/**
			 * Fire an event
			 * @param {String} type the event name
			 * @param {Array}  args an array of arguments to send to the event function
			 * @returns {*}
			 * @public
			 */
			trigger: function(type, args){
				var events, i;
				type = removeOn(type);
				events = this.$events[type];
				if (!events) return this;
				args = $.isArray(args) ? args : [args];
				for (i = 0; i < events.length; i++) {
					if (events[i]) {
						events[i].apply(this, args);
					}
				}
				return this;
			}
		});
	
	
	})(jQuery, this);
	
	
	
	
	// ################Element扩展####################//
		/*
		ASDUI.step
		date:2014.04.22
		*/		
		$.fn.extend({
			//form 伪ajax提交
			frameSend: function(callback){
					$(this).each(function(i,el){
						
						var frameId = 'frameSend'+$.GUID(), fra = '<iframe style="position:absolute;top:100px;left:200px;" id="'+frameId+'" name="'+frameId+'" src="javascript:;"></iframe>';
						$('body').append(fra);
						$(el).attr('target',frameId);
						var frame = document.getElementById(frameId);
						
						if(document.readyState == "complete" || frame.readyState == "complete"){
							
							$('#'+frameId).on("load",function(e){
								var data = $(this).contents().find('body').html();
								try{
									data =  $.parseJSON(data);
									$.fireEvent(callback,[data]);
								}catch (e) {
								
								}
								setTimeout(function(){
									$(this).remove();
								},300);
							});
							
							$(el).submit();
						}
						
					});
			},
			/*Get plugin opts from elemnt data-option or merge width default options*/
			getDataOptions: function (properties) {
				if(!properties)return;
				var options = {};
				//第一步：首先从data-options属性中取opts去掉空格（注：data-options暂支持单引号或_ZUI_区分string
				var props = $(this).attr(properties);
				if(props){
				    s = props.replace(/^s+|s+$/g, '').replace(/\_ZUI_/g, '"');
				}else{
					throw 'Properties undefined.'
				}
				//if (s) {
					//兼容写大括号和不写大括号的写法
					if (s.substring(0, 1) != '{') {
						s = '{' + s + '}';
					}
					//利用Function函数将字符串转为化对象
					options = (new Function('return ' + s))();
				//}
				//第二步：如果properties不为空的话，则将properties中定义的属性增加或者覆盖到“第一步”中取到的属性列表中
				//    if (properties) {
				//		
				//	}
			 	return options;
			},
			unSecable: function(){
				try{
					$.browser.msie ? $(this).on('selectstart',function() { return false; }) : $(this).addClass('unSecable');
				}catch(err){
					
				}
				
				return this;
			},
			/*eg:
				$el.hasEvent('click');                  // true
				$el.hasEvent('dblclick');               // true
				$el.hasEvent('mouseover');              // true
				$el.hasEvent('trippleclick');           // false
			
				$el.hasEvent('click', fnClick);         // true
				$el.hasEvent('click', function() {});   // false
			
				$el.hasEvent('mouseover', fnMouseover); // true
			
				$el.hasEvent(fnClick);                  // true
				$el.hasEvent(fnMouseover);              // true
			*/
			hasEvent: function(evt, namespace) {
				var element = this.get(0);
				if(element.nodeType === 1 && typeof evt == "string") {
					var events = $._data(element, "events");
					if(typeof events !== "undefined") {
						if(typeof events[evt] !== "undefined") {
							var evts = events[evt];
							for(var i = 0; i < evts.length; i++) {
								if(typeof namespace === "string") {
									if(evts[i].type === evt && evts[i].namespace === namespace)return true;
								} else {
									if(evts[i].type === evt)return true;
								}
							}
						}
					}
				}
				return false;
			},
			addList: function(options){
				var defaults = {
						name: 'groupname',
						addTar:'.ai',
						delTar:'.di',
						temp:'<div class="ASDaddItem"><input id="{#myName}" name="{#myName}" type="text" class="input" value="{#myVal}"/><em class="icon24 icon di">-</em></div>',
						defVal:'www.xxx.com',
						maxium:false,
						onDel:$.noop,
						onAdd:$.noop,
						onMax:$.noop
				},
				opt = $.extend(defaults, options);
				$(this).each(function(i,el){
					var i= opt.startInx ? opt.startInx : 0,box = $(el),name = $(el).data(opt.name),va = opt.defVal;
					box.on('click',opt.addTar,function(){
						if(i >= opt.maxium){
							$.fireEvent(opt.onMax, [opt.maxium]);
							return
						}
						i++;
						var row = opt.temp.replace(/{#([^{}]+)}/g,function(a,b){
							var v;
							switch(b){
								case 'myRule':
								case 'myName':
								v = name+i;
								break;
								case 'myVal':
								v = va;
								break;
								case 'myId':
								v = 'Ru'+name+i;
								break;
								
							}
							
							return v;
						});
						box.append(row);
						
						$.fireEvent(opt.onAdd, [name+i]);
					});
					box.on('click',opt.delTar,function(){
						i--;
						$.fireEvent(opt.onDel, [name+i,$(this)]);
	
					});
					
				});
			},
			//ASDUI.highlight
			//date:2014.04.22
				
			highlight : function(pat) {
				 function innerHighlight(node, pat) {
				  var skip = 0;
				  if (node.nodeType == 3) {
					   var pos = node.data.toUpperCase().indexOf(pat);
					   if (pos >= 0) {
							var spannode = document.createElement('span');
							spannode.className = 'highlight';
							var middlebit = node.splitText(pos);
							var endbit = middlebit.splitText(pat.length);
							var middleclone = middlebit.cloneNode(true);
							spannode.appendChild(middleclone);
							middlebit.parentNode.replaceChild(spannode, middlebit);
							skip = 1;
					   }
				  }
				  else if (node.nodeType == 1 && node.childNodes && !/(script|style)/i.test(node.tagName)) {
					   for (var i = 0; i < node.childNodes.length; ++i) {
							i += innerHighlight(node.childNodes[i], pat);
					   }
				  }
				  return skip;
				 }
				 return this.length && pat && pat.length ? this.each(function() {
					innerHighlight(this, pat.toUpperCase());
				 }) : this;
			},
			/*
			eg:滚动条距离底部50以内contentH - viewH - scrollTop <=50
			滚动条距离底部5%以内scrollTop/(contentH - viewH)>=0.95
			*/
			scrollBottom: function(options){ 
				var Opt=$.extend({skew:150,callBack:$.noop},options);
				
				$(this).on('scroll',function(){
					
					var viewH = $(this).height(),contentH = typeof(this.tagName)=='undefined' ? $('body').get(0).scrollHeight : this.scrollHeight,scrollTop = $(this).scrollTop();
					if(Opt.skew<1){//百分比
						if(scrollTop/(contentH - viewH)>= Opt.skew)$.fireEvent(Opt.callBack,[$(this)]);
					}else{//像素值
						if(contentH - viewH - scrollTop <= Opt.skew)$.fireEvent(Opt.callBack,[$(this)]);	
					}
				});
			},			
			removeHighlight : function() {
				 return this.find("span.highlight").each(function() {
					  this.parentNode.firstChild.nodeName;
					  with (this.parentNode) {
						  
						   replaceChild(this.firstChild, this);
						   normalize();
					  }
				 });
			},
			cmPos: function(){
				var box = $(this);
				if($.support.aniEndEvt&&!$.browser.IE7&&!$.browser.qq){
					box.css({
						left: 0,top: 0,right: 0,bottom: 0,margin: 'auto'
					});
					
				}else if($.browser.qq){//QQ
					
					box.css({
						top: '50%',
						left:'50%',
						'-webkit-transform': 'translate(-50%,-50%)',
						'transform': 'translate(-50%,-50%)'
					});
				}else{
					box.css({
						top: '50%',
						left:'50%',
						marginTop:-box.outerHeight()/2,
						marginLeft:-box.outerWidth()/2
					}); 
					
				}
				return this;	
			},
			flpos:function(Atel,pos,skewX,skewY){
				var tipMy,tipAt,cust=false;
				var x = skewX ? skewX : 0;
				var y = skewX ? skewY : 0;
				switch(pos){
					case 'north':
						tipMy = 'left+'+x+' bottom';
						tipAt = 'left top-'+y+'';	
					break;
	
					case 'south':
						tipMy = 'left+'+x+' top';
						tipAt = 'left bottom+'+y+'';
					break;
	
					case 'east':
						tipMy = 'left+'+x+' top';
						tipAt = 'right top+'+y+'';
					break;
					case 'west':
						tipMy = 'right-'+x+' top';
						tipAt = 'left top+'+y+'';
					break;
					case 'nc':
						tipMy = 'center+'+x+' bottom';
						tipAt = 'center top-'+y+'';
					break;
					case 'sc':
						tipMy = 'center+'+x+' top';
						tipAt = 'center bottom+'+y+'';
					break;
					case 'wc':
						tipMy = 'right-'+x+' center';
						tipAt = 'left center+'+y+'';
					break;
					case 'ec':
						tipMy = 'left+'+x+' center';
						tipAt = 'right center+'+y+'';
					break;
					case 'custom':
					default:
						cust = true;
					break;
				}
				
				(!cust && Atel.is(':visible')) ? $(this).position({my: tipMy,at: tipAt,of: Atel}) : $(this).css({left:x+'px',top:y+'px',position:'absolute'});
				
				return this;		
			},		

			/**/
			measure: function() {
				var clone = $(this).clone(), result;
				clone.removeAttr('id').css({
					visibility: 'hidden',
					display:'block',
					position: 'absolute',
					zIndex:-10
				});
				clone.appendTo(document.body);
				result = {width: clone.width(),outerWidth: clone.outerWidth(),outerHeight: clone.outerHeight(),height: clone.height(),top: clone.offset().top,left: clone.offset().left};
				clone.remove();
				return result;
			},

			//input+1-1
			iVaryVal: function(iSet,CallBack){
				/*
				 * Minus:点击元素--减小
				 * Add:点击元素--增加
				 * Input:表单元素
				 * Min:表单的最小值，非负整数
				 * Max:表单的最大值，正整数
				 */
				iSet=$.extend({Minus:'.J_minus',Add:'.J_add',Input:'.qty',Tar:'data-tar',Min:0,Max:20},iSet);
				var C=null,O=null;
				//插件返回值
				var $CB={},scope = $(this);
				//增加
				scope.on('click',iSet.Add,function(e){
					e.preventDefault();
					var InputId = $(this).attr(iSet.Tar),Input = $(InputId);
					O=parseInt(Input.val());

					(O+1<=iSet.Max) || (iSet.Max==null) ? Input.val(O+1) : Input.val(iSet.Max);
					$CB.val = Input.val();
					$.fireEvent(CallBack,[$CB.val,Input]);
					//输出当前改变后的值
				});

				//减少
				scope.on('click',iSet.Minus,function(e){
					e.preventDefault();
					var InputId = $(this).attr(iSet.Tar),Input = $(InputId);
					O=parseInt(Input.val());
					O-1<iSet.Min ? Input.val(iSet.Min) : Input.val(O-1);
					$CB.val = Input.val();
					//回调函数
					$.fireEvent(CallBack,[$CB.val,Input]);
				});

				scope.on('click',iSet.Input,function(e){
					O=parseInt($(this).val());
					$(this).select();
				});

				scope.on('keyup',iSet.Input,function(e){
					if($(this).val()!=''){
						C=parseInt($(this).val());
						//非负整数判断
						if(/^[1-9]\d*|0$/.test(C)){
							$(this).val(C);
							O=C;
						}else{
							$(this).val(O);
						}
					}
					//键盘控制：上右--加，下左--减
					if(e.keyCode==38 || e.keyCode==39){
						$(this).prev(iSet.Minus).click();
					}
					if(e.keyCode==37 || e.keyCode==40){
						$(this).next(iSet.Add).click();
					}
					//输出当前改变后的值
					$CB.val=$(this).val();
					//回调函数
					$.fireEvent(CallBack,[$CB.val,$(this)])
				});

				scope.on('blur',iSet.Input,function(e){
					$(this).trigger('keyup');
					if($(this).val()==''){
						$(this).val(O);
					}
					//判断输入值是否超出最大最小值
					if(iSet.Max){
						if(O>iSet.Max){
							$(this).val(iSet.Max);
						}
					}
					if(O<iSet.Min){
						$(this).val(iSet.Min);
					}
					//输出当前改变后的值
					$CB.val=$(this).val();
					
					//回调函数
					$.fireEvent(CallBack,[$CB.val,$(this)])
				});

			},
			hint:function(tag,onHint){
				
				var label = tag ? $(this).parent().find(tag) : $(this).prev();
				if($(this).val() !='')label.hide();
				$(this).on('focus',function(){
					label.fadeOut(200);
					$.fireEvent(onHint,[$(this)]);
				});
				$(this).on('input',function(){
					label.fadeOut(200);
				});
				$(this).on('blur',function(){
					if($(this).val() =='')label.fadeIn(200);
				});
			},//input & textarea hint
			areaCode: function(code){
				$(this).each(function(i,el){
					var v = $(el).val().toString(),re = /^\+\d*\./g,secId = $(el).attr('id'),phoneId = secId.replace(':country_id','[telephone]'),input = $('#' + phoneId);
					if(v!='' && code){
						var va = input.val(),co = '+' + code[v] + '.',Nv = (va=='')? co : ( /^\+\d*\./.test(va) ? va.replace(re, co) : co+va );
						input.val(Nv);
					};
				});
				return this;
			},

			clearForm: function(){
				$(':input',$(this)).not(':button, :submit, :reset, :hidden').val('').removeAttr('checked').removeAttr('selected');  
			},
			serializeHash: function(elements){
				var hash = {};
				function stringKey(key, value) {
				  var beginBracket = key.lastIndexOf('[');
				  if (beginBracket == -1) {
					var hash = {};
					hash[key] = value;
					return hash;
				  }
				  var newKey = key.substr(0, beginBracket);
				  var newValue = {};
				  newValue[key.substring(beginBracket + 1, key.length - 1)] = value;
				  return stringKey(newKey, newValue);
				}
			
				var els = elements ? $(this).find(elements).get() : $(this).find(':input').get();
				$.each(els, function() {
					if (this.name && !this.disabled && (this.checked || /select|textarea/i.test(this.nodeName) || /hidden|text|search|tel|url|email|password|datetime|date|month|week|time|datetime-local|number|range|color/i.test(this.type))) {
						var val = $(this).val();
						$.extend(true, hash, stringKey(this.name, val));
					}
				});
				return hash;			
			},
			//Fill form with serialize
			deserialize: function(data, clearForm){
				this.each(function(){
					deser(this, data, !!clearForm);
				});
			
				function deser(element, data, clearForm){
					var splits = decodeURIComponent(data).split('&'),
						i = 0,
						split = null,
						key = null,
						value = null,
						splitParts = null;
			
					if (clearForm)
					{
						$('input[type="checkbox"],input[type="radio"]', element).removeAttr('checked');
						$('select,input[type="text"],input[type="password"],input[type="hidden"],textarea', element).val('');
					}
			
					var kv = {};
					while(split = splits[i++]){
						splitParts = split.split('=');
						key = splitParts[0] || '';
						value = (splitParts[1] || '').replace(/\+/g, ' ');
						
						if (key != ''){
							if( key in kv ){
								if( $.type(kv[key]) !== 'array' )
									kv[key] = [kv[key]];
								
								kv[key].push(value);
							}else
								kv[key] = value;				
						}
					}
					
					for( key in kv ){
						value = kv[key];
						
						$('input[type="checkbox"][name="'+ key +'"][value="'+ value +'"],input[type="radio"][name="'+ key +'"][value="'+ value +'"]', element).prop('checked', true);
						$('select[name="'+ key +'"],input[type="text"][name="'+ key +'"],input[type="password"][name="'+ key +'"],input[type="hidden"][name="'+ key +'"],textarea[name="'+ key +'"]', element).val(value);
					}
				}
			 },
			//img preload element extend
			imgpreload : function(settings){
				$.imgpreload(this,settings);
				return this;
			},	
			//Timers
			everyTime: function (interval, label, fn, times, belay) {
				return this.each(function () {
					jQuery.timer.add(this, interval, label, fn, times, belay);
				});
			},
			oneTime: function (interval, label, fn) {
				return this.each(function () {
					jQuery.timer.add(this, interval, label, fn, 1);
				});
			},
			stopTime: function (label, fn) {
				return this.each(function () {
					jQuery.timer.remove(this, label, fn);
				});
			}								
		});
	/*Timers*/	
	jQuery.extend({
		timer: {
			guid: 1,
			global: {},
			regex: /^([0-9]+)\s*(.*s)?$/,
			powers: { // Yeah this is major overkill...
				'ms': 1,
				'cs': 10,
				'ds': 100,
				's': 1000,
				'das': 10000,
				'hs': 100000,
				'ks': 1000000
			},
			timeParse: function (value) {
				if (value == undefined || value == null) return null;
				var result = this.regex.exec(jQuery.trim(value.toString()));
				if (result[2]) {
					var num = parseInt(result[1], 10);
					var mult = this.powers[result[2]] || 1;
					return num * mult;
				} else {
					return value;
				}
			},
			add: function (element, interval, label, fn, times, belay) {
				var counter = 0;
				if (jQuery.isFunction(label)) {
					if (!times) times = fn;

					fn = label;
					label = interval;
				}
				interval = jQuery.timer.timeParse(interval);
				if (typeof interval != 'number' || isNaN(interval) || interval <= 0) return;
				if (times && times.constructor != Number) {
					belay = !!times;
					times = 0;
				}
				times = times || 0;
				belay = belay || false;
				if (!element.$timers) element.$timers = {};
				if (!element.$timers[label]) element.$timers[label] = {};
				fn.$timerID = fn.$timerID || this.guid++;
				var handler = function () {
					if (belay && this.inProgress) return;
					this.inProgress = true;
					if ((++counter > times && times !== 0) || fn.call(element, counter) === false) jQuery.timer.remove(element, label, fn);
					this.inProgress = false;
				};
				handler.$timerID = fn.$timerID;
				if (!element.$timers[label][fn.$timerID]) element.$timers[label][fn.$timerID] = window.setInterval(handler, interval);
				if (!this.global[label]) this.global[label] = [];
				this.global[label].push(element);
			},
			remove: function (element, label, fn) {
				var timers = element.$timers,
					ret;
				if (timers) {
					if (!label) {
						for (label in timers) this.remove(element, label, fn);
					} else if (timers[label]) {
						if (fn) {
							if (fn.$timerID) {
								window.clearInterval(timers[label][fn.$timerID]);
								delete timers[label][fn.$timerID];
							}
						} else {
							for (var fn in timers[label]) {
								window.clearInterval(timers[label][fn]);
								delete timers[label][fn];
							}
						}
						for (ret in timers[label]) break;
						if (!ret) {
							ret = null;
							delete timers[label];
						}
					}
					for (ret in timers) break;
					if (!ret) element.$timers = null;
				}
			}
		}
	});
	$.browser.msie && $(window).one("unload", function () {
		var global = jQuery.timer.global;
		for (var label in global) {
			var els = global[label],
				i = els.length;
			while (--i) jQuery.timer.remove(els[i], label);
		}
	});	
	
	
	/*! jQuery UI - v1.10.4 - 2014-05-08
	* http://jqueryui.com
	* Includes: jquery.ui.position.js
	* Copyright 2014 jQuery Foundation and other contributors; Licensed MIT */
	
	(function(t,e){function i(t,e,i){return[parseFloat(t[0])*(p.test(t[0])?e/100:1),parseFloat(t[1])*(p.test(t[1])?i/100:1)]}function s(e,i){return parseInt(t.css(e,i),10)||0}function n(e){var i=e[0];return 9===i.nodeType?{width:e.width(),height:e.height(),offset:{top:0,left:0}}:t.isWindow(i)?{width:e.width(),height:e.height(),offset:{top:e.scrollTop(),left:e.scrollLeft()}}:i.preventDefault?{width:0,height:0,offset:{top:i.pageY,left:i.pageX}}:{width:e.outerWidth(),height:e.outerHeight(),offset:e.offset()}}t.ui=t.ui||{};var a,o=Math.max,r=Math.abs,l=Math.round,h=/left|center|right/,c=/top|center|bottom/,u=/[\+\-]\d+(\.[\d]+)?%?/,d=/^\w+/,p=/%$/,f=t.fn.position;t.position={scrollbarWidth:function(){if(a!==e)return a;var i,s,n=t("<div style='display:block;position:absolute;width:50px;height:50px;overflow:hidden;'><div style='height:100px;width:auto;'></div></div>"),o=n.children()[0];return t("body").append(n),i=o.offsetWidth,n.css("overflow","scroll"),s=o.offsetWidth,i===s&&(s=n[0].clientWidth),n.remove(),a=i-s},getScrollInfo:function(e){var i=e.isWindow||e.isDocument?"":e.element.css("overflow-x"),s=e.isWindow||e.isDocument?"":e.element.css("overflow-y"),n="scroll"===i||"auto"===i&&e.width<e.element[0].scrollWidth,a="scroll"===s||"auto"===s&&e.height<e.element[0].scrollHeight;return{width:a?t.position.scrollbarWidth():0,height:n?t.position.scrollbarWidth():0}},getWithinInfo:function(e){var i=t(e||window),s=t.isWindow(i[0]),n=!!i[0]&&9===i[0].nodeType;return{element:i,isWindow:s,isDocument:n,offset:i.offset()||{left:0,top:0},scrollLeft:i.scrollLeft(),scrollTop:i.scrollTop(),width:s?i.width():i.outerWidth(),height:s?i.height():i.outerHeight()}}},t.fn.position=function(e){if(!e||!e.of)return f.apply(this,arguments);e=t.extend({},e);var a,p,g,m,v,_,b=t(e.of),y=t.position.getWithinInfo(e.within),k=t.position.getScrollInfo(y),w=(e.collision||"flip").split(" "),D={};return _=n(b),b[0].preventDefault&&(e.at="left top"),p=_.width,g=_.height,m=_.offset,v=t.extend({},m),t.each(["my","at"],function(){var t,i,s=(e[this]||"").split(" ");1===s.length&&(s=h.test(s[0])?s.concat(["center"]):c.test(s[0])?["center"].concat(s):["center","center"]),s[0]=h.test(s[0])?s[0]:"center",s[1]=c.test(s[1])?s[1]:"center",t=u.exec(s[0]),i=u.exec(s[1]),D[this]=[t?t[0]:0,i?i[0]:0],e[this]=[d.exec(s[0])[0],d.exec(s[1])[0]]}),1===w.length&&(w[1]=w[0]),"right"===e.at[0]?v.left+=p:"center"===e.at[0]&&(v.left+=p/2),"bottom"===e.at[1]?v.top+=g:"center"===e.at[1]&&(v.top+=g/2),a=i(D.at,p,g),v.left+=a[0],v.top+=a[1],this.each(function(){var n,h,c=t(this),u=c.outerWidth(),d=c.outerHeight(),f=s(this,"marginLeft"),_=s(this,"marginTop"),x=u+f+s(this,"marginRight")+k.width,C=d+_+s(this,"marginBottom")+k.height,M=t.extend({},v),T=i(D.my,c.outerWidth(),c.outerHeight());"right"===e.my[0]?M.left-=u:"center"===e.my[0]&&(M.left-=u/2),"bottom"===e.my[1]?M.top-=d:"center"===e.my[1]&&(M.top-=d/2),M.left+=T[0],M.top+=T[1],t.support.offsetFractions||(M.left=l(M.left),M.top=l(M.top)),n={marginLeft:f,marginTop:_},t.each(["left","top"],function(i,s){t.ui.position[w[i]]&&t.ui.position[w[i]][s](M,{targetWidth:p,targetHeight:g,elemWidth:u,elemHeight:d,collisionPosition:n,collisionWidth:x,collisionHeight:C,offset:[a[0]+T[0],a[1]+T[1]],my:e.my,at:e.at,within:y,elem:c})}),e.using&&(h=function(t){var i=m.left-M.left,s=i+p-u,n=m.top-M.top,a=n+g-d,l={target:{element:b,left:m.left,top:m.top,width:p,height:g},element:{element:c,left:M.left,top:M.top,width:u,height:d},horizontal:0>s?"left":i>0?"right":"center",vertical:0>a?"top":n>0?"bottom":"middle"};u>p&&p>r(i+s)&&(l.horizontal="center"),d>g&&g>r(n+a)&&(l.vertical="middle"),l.important=o(r(i),r(s))>o(r(n),r(a))?"horizontal":"vertical",e.using.call(this,t,l)}),c.offset(t.extend(M,{using:h}))})},t.ui.position={fit:{left:function(t,e){var i,s=e.within,n=s.isWindow?s.scrollLeft:s.offset.left,a=s.width,r=t.left-e.collisionPosition.marginLeft,l=n-r,h=r+e.collisionWidth-a-n;e.collisionWidth>a?l>0&&0>=h?(i=t.left+l+e.collisionWidth-a-n,t.left+=l-i):t.left=h>0&&0>=l?n:l>h?n+a-e.collisionWidth:n:l>0?t.left+=l:h>0?t.left-=h:t.left=o(t.left-r,t.left)},top:function(t,e){var i,s=e.within,n=s.isWindow?s.scrollTop:s.offset.top,a=e.within.height,r=t.top-e.collisionPosition.marginTop,l=n-r,h=r+e.collisionHeight-a-n;e.collisionHeight>a?l>0&&0>=h?(i=t.top+l+e.collisionHeight-a-n,t.top+=l-i):t.top=h>0&&0>=l?n:l>h?n+a-e.collisionHeight:n:l>0?t.top+=l:h>0?t.top-=h:t.top=o(t.top-r,t.top)}},flip:{left:function(t,e){var i,s,n=e.within,a=n.offset.left+n.scrollLeft,o=n.width,l=n.isWindow?n.scrollLeft:n.offset.left,h=t.left-e.collisionPosition.marginLeft,c=h-l,u=h+e.collisionWidth-o-l,d="left"===e.my[0]?-e.elemWidth:"right"===e.my[0]?e.elemWidth:0,p="left"===e.at[0]?e.targetWidth:"right"===e.at[0]?-e.targetWidth:0,f=-2*e.offset[0];0>c?(i=t.left+d+p+f+e.collisionWidth-o-a,(0>i||r(c)>i)&&(t.left+=d+p+f)):u>0&&(s=t.left-e.collisionPosition.marginLeft+d+p+f-l,(s>0||u>r(s))&&(t.left+=d+p+f))},top:function(t,e){var i,s,n=e.within,a=n.offset.top+n.scrollTop,o=n.height,l=n.isWindow?n.scrollTop:n.offset.top,h=t.top-e.collisionPosition.marginTop,c=h-l,u=h+e.collisionHeight-o-l,d="top"===e.my[1],p=d?-e.elemHeight:"bottom"===e.my[1]?e.elemHeight:0,f="top"===e.at[1]?e.targetHeight:"bottom"===e.at[1]?-e.targetHeight:0,g=-2*e.offset[1];0>c?(s=t.top+p+f+g+e.collisionHeight-o-a,t.top+p+f+g>c&&(0>s||r(c)>s)&&(t.top+=p+f+g)):u>0&&(i=t.top-e.collisionPosition.marginTop+p+f+g-l,t.top+p+f+g>u&&(i>0||u>r(i))&&(t.top+=p+f+g))}},flipfit:{left:function(){t.ui.position.flip.left.apply(this,arguments),t.ui.position.fit.left.apply(this,arguments)},top:function(){t.ui.position.flip.top.apply(this,arguments),t.ui.position.fit.top.apply(this,arguments)}}},function(){var e,i,s,n,a,o=document.getElementsByTagName("body")[0],r=document.createElement("div");e=document.createElement(o?"div":"body"),s={visibility:"hidden",width:0,height:0,border:0,margin:0,background:"none"},o&&t.extend(s,{position:"absolute",left:"-1000px",top:"-1000px"});for(a in s)e.style[a]=s[a];e.appendChild(r),i=o||document.documentElement,i.insertBefore(e,i.firstChild),r.style.cssText="position: absolute; left: 10.7432222px;",n=t(r).offset().left,t.support.offsetFractions=n>10&&11>n,e.innerHTML="",i.removeChild(e)}()})(jQuery);
	
	$.popWin = function (url,win,para) {
	    var win = window.open(url,win,para);
	    win.focus();
	}
	//MagentoEE global Fn
	$.formatCurrency = function (price, format, showPlus){
		var precision = isNaN(format.precision = Math.abs(format.precision)) ? 2 : format.precision;
		var requiredPrecision = isNaN(format.requiredPrecision = Math.abs(format.requiredPrecision)) ? 2 : format.requiredPrecision;
	
		//precision = (precision > requiredPrecision) ? precision : requiredPrecision;
		//for now we don't need this difference so precision is requiredPrecision
		precision = requiredPrecision;
	
		var integerRequired = isNaN(format.integerRequired = Math.abs(format.integerRequired)) ? 1 : format.integerRequired;
	
		var decimalSymbol = format.decimalSymbol == undefined ? "," : format.decimalSymbol;
		var groupSymbol = format.groupSymbol == undefined ? "." : format.groupSymbol;
		var groupLength = format.groupLength == undefined ? 3 : format.groupLength;
	
		var s = '';
	
		if (showPlus == undefined || showPlus == true) {
			s = price < 0 ? "-" : ( showPlus ? "+" : "");
		} else if (showPlus == false) {
			s = '';
		}
	
		var i = parseInt(price = Math.abs(+price || 0).toFixed(precision)) + "";
		var pad = (i.length < integerRequired) ? (integerRequired - i.length) : 0;
		while (pad) { i = '0' + i; pad--; }
		j = (j = i.length) > groupLength ? j % groupLength : 0;
		re = new RegExp("(\\d{" + groupLength + "})(?=\\d)", "g");
	
		/**
		 * replace(/-/, 0) is only for fixing Safari bug which appears
		 * when Math.abs(0).toFixed() executed on "0" number.
		 * Result is "0.-0" :(
		 */
		var r = (j ? i.substr(0, j) + groupSymbol : "") + i.substr(j).replace(re, "$1" + groupSymbol) + (precision ? decimalSymbol + Math.abs(price - i).toFixed(precision).replace(/-/, 0).slice(2) : "")
		var pattern = '';
		if (format.pattern.indexOf('{sign}') == -1) {
			pattern = s + format.pattern;
		} else {
			pattern = format.pattern.replace('{sign}', s);
		}
	
		return pattern.replace('%s', r).replace(/^\s\s*/, '').replace(/\s\s*$/, '');
	};




}));