/*
 * 通用脚本库
 * 引入目的：解决内存泄漏问题，提升脚本执行性能。
 */
function _(id) {
		return document.getElementById(id);
	}
	/*
	 * @description 跨浏览器getElementsByClassName实现
	 * @param searchClass  '{tag}.{className}'
	 * @param node 共搜索的的目标父节点
	 */
_._ = function(searchClass, node) {
	var result = [],
		sc = searchClass.split('.'),
		tag;
	if (sc.length === 2) {
		searchClass = sc[1];
		tag = sc[0] || '*';
	} else {
		return null;
	}
	if (document.getElementsByClassName) {
		var nodes = (node || document).getElementsByClassName(searchClass);
		for (var i = 0; node = nodes[i++];) {
			if (tag !== "*" && node.tagName === tag.toUpperCase()) {
				result.push(node);
			} else {
				result.push(node);
			}
		}
	} else {
		if (node == null)
			node = document;
		var els = node.getElementsByTagName(tag);
		var elsLen = els.length;
		var pattern = new RegExp("(^|\\s)" + searchClass + "(\\s|$)");
		for (i = 0, j = 0; i < elsLen; i++) {
			if (pattern.test(els[i].className)) {
				result[j] = els[i];
				j++;
			}
		}
	}
	return result;
};
/*
 * @description 判断是否是IE，如果是返回具体版本号
 * @return IE的版本号，W3C系列返回undefined
 * */
_.isIE = (function() {
	var undef, v = 3,
		div = document.createElement('div'),
		all = div.getElementsByTagName('i');
	while (
		div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->',
		all[0]
	);
	return v > 4 ? v : undef;
}());
/*
 * @description 判断是否是数组
 */
_.isArray = function(o) {
	return Object.prototype.toString.call(o) === '[object Array]';
};
/*
 * @description 批量设置样式表
 * @param el HTML节点
 * @param cssText style样式
 * @param overWrite 是否重写现有节点style属性，默认为false
 */
_.css = function(el, cssText, overWrite) {
	if (el && el.style) {
		if (overWrite)
			el.style.cssText = cssText;
		else
			el.style.cssText += ';' + cssText;
	}
};
/*
 * @description 动态插入样式表到head
 * @param cssText css
 * @param id style节点id
 */
_.css.append = function(cssText, id) {
	var css = document.createElement('style'),
		head = document.head || document.getElementsByTagName("head")[0];
	if (id) {
		css.setAttribute('id', id);
	}
	css.setAttribute('type', 'text/css');
	//IE
	if (css.styleSheet) {
		css.styleSheet.cssText = cssText;
	} else {
		css.appendChild(document.createTextNode(cssText));
	}
	head.appendChild(css);
};
/*
 * @description 切换样式表，移除所有包含此样式的元素；给当前节点加上此样式
 * @param node 当前节点
 * @param clas 样式表
 * @param context 移除样式表元素的父节点
 */
_.css.toggle = function(node, cls, context) {
	context = context || document.body;
	var clsArr = cls.split('.');
	if (clsArr.length != 2) return;
	var tag = clsArr[0],
		className = clsArr[1];
	var olds = _._(cls, context),
		len = olds.length,
		i = 0;
	for (; i < len; i++) {
		olds[i].className = olds[i].className.replace(className, '');
	}
	var current = node.className;
	if (current.indexOf(className) == -1) {
		node.className = current + ' ' + className;
	}
};
_.dom = function() {};
/**
 * @description 调用此方法来保证插入节点后再设置节点的innerHTML，避免在IE中的内存泄漏
 */
_.dom.append = function(parent, tagName) {
	var node = document.createElement(tagName);
	parent.appendChild(node);
	return node;
};
/*
 * @description 采用ext的处理方式，也可以对删除的元素使用outerHTML=''，但是此方法不通用，某些元素的outerHTML属性只读
 * @param n 要删除的HTML节点
 */
_.dom.remove = function(n) {
	var d;
	if (_.isIE) {
		if (n && n.tagName != 'BODY') {
			d = d || document.createElement('div');
			d.appendChild(n);
			d.innerHTML = '';
		}
	} else {
		if (n && n.parentNode && n.tagName != 'BODY') {
			n.parentNode.removeChild(n);
		}
	}
};
/*
 * @description 移除要删除节点的所有事件，防止IE内存泄漏
 * @param d 要删除的节点
 */
_.dom.purdge = function(d) {
	var a = d.attributes,
		i, l, n;
	if (a) {
		l = a.length;
		for (i = 0; i < l; i += 1) {
			n = a[i].name;
			if (typeof d[n] === 'function') {
				d[n] = null;
			}
		}
	}
	a = d.childNodes;
	if (a) {
		l = a.length;
		for (i = 0; i < l; i += 1) {
			_.dom.purdge(d.childNodes[i]);
		}
	}
};
_.ajax = function() {};
/******** JSONP轮询内存泄漏 ********
 * 为IE添加重用的动态script标签，标准浏览器无法重用script标签
 * 重用的script标签可能被占用，也可能请求时发送网络错误，因此需要添加额外的处理机制；
 * W3C浏览器JSONP没有内存泄漏，所以onload完成后直接删除即可。
 */
//TODO:为标准浏览器添加onerror统计超时请求，
(function() {
	//存储超时或异常的JSONP请求
	_.ajax.TIMEOUT_REQUEST = [];
	if (_.isIE) {
		//JSONP重用标签的id
		_.ajax.SCRIPT_ID = 'ie_script_for_jsonp';
		//重用标签是否被JSONP请求占用
		_.ajax.SCRIPT_USED = false;
		//被占用时JSONP请求等待的时间
		_.ajax.WAIT_TIME = 100;
		//超时设定
		_.ajax.TIMEOUT = 1500;

		//上次JSONP请求的时间
		_.ajax.LAST_USED_TIME = 0;
		var script = document.createElement('script'),
			head = document.head || document.getElementsByTagName('head')[0];
		script.setAttribute('id', _.ajax.SCRIPT_ID);
		script.onreadystatechange = function() {
			if (this.readyState == "loaded" || this.readyState == "complete") {
				_.ajax.SCRIPT_USED = false;
			}
		};
		head.appendChild(script);
	}
})();
/*
 * @description 轮询JSONP请求调用，IE浏览器采用重用Script节点方式。
 * @param url 手动加上callback参数，自动追加了时间戳
 */
_.ajax.jsonp = function(url) {
	var script, now = new Date().getTime(),
		requestUrl = url + (url.indexOf('?') > -1 ? '&timestamp=' : '?timestamp=') + now,
		head = document.head || document.getElementsByTagName('head')[0];
	if (_.isIE) {
		script = document.getElementById(_.ajax.SCRIPT_ID);
		//节点被占用
		if (_.ajax.SCRIPT_USED) {
			if (_.ajax.LAST_USED_TIME === 0)
				_.ajax.LAST_USED_TIME = now;
			//已经超时
			if ((now - _.ajax.LAST_USED_TIME) > _.ajax.TIMEOUT) {
				_.ajax.LAST_USED_TIME = now;
				if (_.ajax.TIMEOUT_REQUEST.length >= 1000)
					_.ajax.TIMEOUT_REQUEST.length = 0;
				_.ajax.TIMEOUT_REQUEST.push(script.src.split('&timestamp=')[0]);
				script.src = requestUrl;
				//没有超时则等待
			} else {
				setTimeout(function() {
					_.ajax.jsonp(url);
				}, _.ajax.WAIT_TIME);
			}
		} else {
			_.ajax.SCRIPT_USED = true;
			_.ajax.LAST_USED_TIME = now;
			script.src = requestUrl;
		}
	} else {
		script = document.createElement('script');
		head.appendChild(script);
		script.onload = function() {
			this.onload = null;
			this.parentNode.removeChild(this);
		};
		script.onerror = function() {
			_.ajax.TIMEOUT_REQUEST.push(this.src);
		};
		script.src = requestUrl;
	}
};
/*
 * @description 获取远程脚本，只适合加载一次的脚本，轮询请使用_.ajax.jsonp。JSONP请求默认加上时间戳；普通AJAX不加时间戳
 * @param callback JSONP加载脚本的回调函数
 * */
_.ajax.getScript = function(url, callback) {
	var script, head = document.head || document.getElementsByTagName('head')[0],
		now = new Date().getTime();
	script = _.dom.append(head, 'script');
	if (callback) {
		if (url.indexOf("?") > -1) {
			url = "&callback=" + callback;
		} else {
			url = "?callback=" + callback;
		}
	}
	//如果是JSONP
	if (url.indexOf('callback=') > 0) {
		url += "&timestamp=" + now;
	}
	script.src = url;
};
/*
 * @description 获取多个远程脚本文件，只适合加载一次。轮询请使用_.ajax.jsonp
 * */
_.ajax.getScripts = function(urlArray) {
	if (_.isArray(urlArray)) {
		for (var index in urlArray) {
			_.ajax.getScript(urlArray[index]);
		}
	}
};
/*
 * @description 类继承，子类持有父类原型
 * @param child 子类
 * @param parent 父类
 */
_.extend = function(child, parent) {
	var F = function() {};
	F.prototype = parent.prototype;
	child.prototype = new F();
	child.prototype.constructor = child;
	//hold parent prototype ref
	child.pp = parent.prototype;
};
/*
 * @description 复写子类的方法，如果父类有该方法，增强匿名函数的参数与父类函数参数顺序一致。如果增强函数有返回值，则默认返回。
 * @param className 类名
 * @param methodName 要复写的方法名称
 * @param extraFunc 额外执行的函数，上下文环境为className的实例
 */
_.extendM = function(className, methodName, extraFunc) {
	//如果有父类且父类有同名的方法
	if (className.pp && className.pp[methodName]) {
		className.prototype[methodName] = function() {
			var result = extraFunc.apply(this, arguments);
			className.pp[methodName].apply(this, arguments);
			return result;
		};
	} else {
		className.prototype[methodName] = function() {
			return extraFunc.apply(this, arguments);
		};
	}
};
_.trim = function(text) {
	if (String.prototype.trim) {
		return text == null ? "" : String.prototype.trim.call(text);
	} else {
		return text == null ? "" : text.toString().replace(/^\s+/, "").replace(/\s+$/, "");
	}
};
/*
 * @description from jquery.cookie.js
 * @param options {expires,path,domain,secure}
 */
_.cookie = function(name, value, options) {
	if (typeof value != 'undefined') { // name and value given, set cookie
		options = options || {};
		if (value === null) {
			value = '';
			options.expires = -1;
		}
		var expires = '';
		if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
			var date;
			if (typeof options.expires == 'number') {
				date = new Date();
				date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
			} else {
				date = options.expires;
			}
			expires = '; expires=' + date.toUTCString(); // use expires attribute, max-age is not supported by IE
		}
		var path = options.path ? '; path=' + options.path : '';
		var domain = options.domain ? '; domain=' + options.domain : '';
		var secure = options.secure ? '; secure' : '';
		document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
	} else { // only name given, get cookie
		var cookieValue = '';
		if (document.cookie && document.cookie != '') {
			var cookies = document.cookie.split(';');
			for (var i = 0; i < cookies.length; i++) {
				var cookie = _.trim(cookies[i]);
				// Does this cookie string begin with the name we want?
				if (cookie.substring(0, name.length + 1) == (name + '=')) {
					cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
					break;
				}
			}
		}
		return cookieValue;
	}
};