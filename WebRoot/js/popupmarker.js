PopupMarker.IS_BAIDU_MAP = typeof BMap !== 'undefined';
PopupMarker.YPOS = 0;
PopupMarker.LEFT_TOP_HEIGHT = 7;
PopupMarker.YPOS2 = PopupMarker.YPOS + PopupMarker.LEFT_TOP_HEIGHT;
PopupMarker.POPUP_TBL = {
	leftTop: {
		"left": 0,
		"top": PopupMarker.YPOS,
		"width": 19,
		"height": PopupMarker.LEFT_TOP_HEIGHT
	},
	leftTopFill: {
		"left": 16,
		"top": 3,
		"width": 4,
		"height": 4
	},
	rightTop: {
		"left": 19,
		"top": PopupMarker.YPOS,
		"width": 10,
		"height": PopupMarker.LEFT_TOP_HEIGHT
	},
	rightTopImg: {
		"left": -125,
		"top": 0,
		"width": 10,
		"height": PopupMarker.LEFT_TOP_HEIGHT
	},
	centerTopFill: {
		"left": 19,
		"top": PopupMarker.YPOS,
		"width": 0,
		"height": PopupMarker.LEFT_TOP_HEIGHT
	},
	leftBody: {
		"left": 11,
		"top": PopupMarker.YPOS2,
		"width": 8,
		"height": 0
	},
	centerBodyFill: {
		"left": 19,
		"top": PopupMarker.YPOS2,
		"width": 40,
		"height": 15
	},
	rightBody: {
		"left": 19,
		"top": PopupMarker.YPOS2,
		"width": 9,
		"height": 0
	},
	leftBottom: {
		"left": 0,
		"top": PopupMarker.YPOS2,
		"width": 20,
		"height": 21
	},
	leftBottomImg: {
		"left": 0,
		"top": -13,
		"width": 20,
		"height": 21
	},
	leftBottomFill: {
		"left": 16,
		"top": 0,
		"width": 4,
		"height": 6
	},
	rightBottom: {
		"left": 19,
		"top": PopupMarker.YPOS2,
		"width": 10,
		"height": PopupMarker.LEFT_TOP_HEIGHT
	},
	rightBottomImg: {
		"left": -125,
		"top": -13,
		"width": 10,
		"height": PopupMarker.LEFT_TOP_HEIGHT
	},
	centerBottomFill: {
		"left": 19,
		"top": (PopupMarker.YPOS2 + (_.isIE ? -1 : 0)),
		"width": 0,
		"height": (6 + (_.isIE ? 1 : 0))
	}
};
PopupMarker.prototype = PopupMarker.IS_BAIDU_MAP ? (new BMap.Overlay()) : (new google.maps.OverlayView());
/*
 * @decription setMap填充覆盖物到地图放在最后一步，百度似乎有点问题
 * @param opts {map:goome.maps.Map,position:goome.maps.LatLng,text:string}
 */
function PopupMarker(opts) {
	this.ICON_WIDTH = opts.ICON_WIDTH || 12;
	this.ICON_HEIGHT = opts.ICON_HEIGHT || 20;
	this.map_ = opts.map;
	this.latlng_ = opts.position;
	this.icon_ = opts.icon;
	this.text_ = opts.text || "";
	this.showpop = opts.showpop || false;
	this.popupImgSrc_ = "images/1280.png";
	//是否已经执行过updatePopLayerText，在此函数结束时设置为true
	this.updatedPop = false;
	if (document.getElementById('dummyTextNode')) {
		this.dummyTextNode = document.getElementById('dummyTextNode');
	} else {
		var dummyTextNode = document.createElement("span");
		dummyTextNode.id = 'dummyTextNode';
		dummyTextNode.style.display = 'none';
		this.map_.getDiv().appendChild(dummyTextNode);
		this.dummyTextNode = dummyTextNode;
		dummyTextNode = null;
	}
	this.setMap(PopupMarker.IS_BAIDU_MAP ? this.map_ : this.map_._source);
};
//百度需要额外推荐一些方法
if (PopupMarker.IS_BAIDU_MAP) {
	PopupMarker.prototype.initialize = function(map) {
		var spanContainer = document.createElement("span");
		this.container_ = document.createElement("div");
		this.iconContainer = document.createElement("div");

		var panes = this.map_._source.getPanes();
		panes.floatShadow.appendChild(spanContainer);
		spanContainer.appendChild(this.iconContainer);
		spanContainer.appendChild(this.container_);

		this.iconContainer.style.width = this.ICON_WIDTH + "px";
		this.iconContainer.style.height = this.ICON_HEIGHT + "px";
		this.iconContainer.innerHTML = "<img src='" + this.icon_ + "'>";
		this.iconContainer.style.position = "absolute";

		//panes.floatPane.appendChild(this.container_);
		this.container_.style.position = "absolute";
		if (!this.showpop) this.container_.style.visibility = "hidden";
		this.makeNormalPopup_();
		return spanContainer;
		//this.onAdd();
	};
	PopupMarker.prototype.setMap = function(obj) {
		if (obj == null)
			this.map_._source.removeOverlay(this);
		else {
			obj._source.addOverlay(this);
		}
	};
}
PopupMarker.prototype.onAdd = function() {
	this.container_ = document.createElement("div");
	this.iconContainer = document.createElement("div");
	var panes = this.getPanes ? this.getPanes() : this.map_._source.getPanes();
	panes.floatShadow.appendChild(this.iconContainer);
	panes.floatPane.appendChild(this.container_);

	this.iconContainer.style.width = this.ICON_WIDTH + "px";
	this.iconContainer.style.height = this.ICON_HEIGHT + "px";
	this.iconContainer.innerHTML = "<img src='" + this.icon_ + "'>";
	this.iconContainer.style.position = "absolute";

	this.container_.style.position = "absolute";
	if (!this.showpop) this.container_.style.visibility = "hidden";
	this.makeNormalPopup_();
};
PopupMarker.prototype.draw = function() {
	this.redrawNormalPopup_(this.text_);
};
PopupMarker.prototype.onRemove = function() {
	_.dom.remove(this.container_);
	_.dom.remove(this.iconContainer);
};

PopupMarker.prototype.makeNormalPopup_ = function() {
	var frag = document.createDocumentFragment();
	//0
	var leftTop_ = this.makeImgDiv_(this.popupImgSrc_, PopupMarker.POPUP_TBL.leftTop);
	leftTop_.appendChild(this.fillDiv_(PopupMarker.POPUP_TBL.leftTopFill));
	frag.appendChild(leftTop_);
	//1
	var leftBody_ = this.fillDiv_(PopupMarker.POPUP_TBL.leftBody);
	_.css(leftBody_, 'border-width:0 0 0 1px;border-style:none none none solid;border-color:#000');
	frag.appendChild(leftBody_);
	//2
	var leftBottom_ = this.makeImgDiv_(this.popupImgSrc_, PopupMarker.POPUP_TBL.leftBottomImg);
	leftBottom_.appendChild(this.fillDiv_(PopupMarker.POPUP_TBL.leftBottomFill));
	_.css(leftBottom_, 'left:' + PopupMarker.POPUP_TBL.leftBottom.left + 'px;top:' + PopupMarker.POPUP_TBL.leftBottom.top + 'px;width:' + PopupMarker.POPUP_TBL.leftBottom.width + 'px;height:' + PopupMarker.POPUP_TBL.leftBottom.height + 'px;');
	frag.appendChild(leftBottom_);
	//3
	var bodyContainer_ = document.createElement("div");
	_.css(bodyContainer_, 'position:absolute;background-color:#fff;overflow:hidden;left:' + PopupMarker.POPUP_TBL.centerBodyFill.left + 'px;top:' + PopupMarker.POPUP_TBL.centerBodyFill.top + 'px;width:' + PopupMarker.POPUP_TBL.centerBodyFill.width + 'px;height:' + PopupMarker.POPUP_TBL.centerBodyFill.height + 'px;');
	frag.appendChild(bodyContainer_);
	//4
	var rightTop_ = this.makeImgDiv_(this.popupImgSrc_, PopupMarker.POPUP_TBL.rightTopImg);
	_.css(rightTop_, 'left:' + PopupMarker.POPUP_TBL.rightTop.left + 'px;top:' + PopupMarker.POPUP_TBL.rightTop.top + 'px;width:' + PopupMarker.POPUP_TBL.rightTop.width + 'px;height:' + PopupMarker.POPUP_TBL.rightTop.height + 'px;');
	frag.appendChild(rightTop_);
	//5
	var rightBottom_ = this.makeImgDiv_(this.popupImgSrc_, PopupMarker.POPUP_TBL.rightBottomImg);
	_.css(rightBottom_, 'left:' + PopupMarker.POPUP_TBL.rightBottom.left + 'px;top:' + PopupMarker.POPUP_TBL.rightBottom.top + 'px;width:' + PopupMarker.POPUP_TBL.rightBottom.width + 'px;height:' + PopupMarker.POPUP_TBL.rightBottom.height + 'px;');
	frag.appendChild(rightBottom_);
	//6
	var rightBody_ = this.fillDiv_(PopupMarker.POPUP_TBL.rightBody);
	_.css(rightBody_, 'border-width:0 1px 0 0;border-style:none solid none none;border-color:#000');
	frag.appendChild(rightBody_);
	//7
	var centerBottom_ = this.fillDiv_(PopupMarker.POPUP_TBL.centerBottomFill);
	_.css(centerBottom_, 'border-width:0 0 1px 0;border-style:none none solid none;border-color:#000');
	frag.appendChild(centerBottom_);
	//8
	var centerTop_ = this.fillDiv_(PopupMarker.POPUP_TBL.centerTopFill);
	_.css(centerTop_, 'border-width:1px 0 0 0;border-style:solid none none none;border-color:#000');
	frag.appendChild(centerTop_);

	this.container_.appendChild(frag);
};
PopupMarker.prototype.redrawNormalPopup_ = function(text) {
	if (this.beforeNormalPopupText_ !== text) {
		var bodyContainer_ = this.container_.children[3],
			leftBottom_ = this.container_.children[2],
			leftBody_ = this.container_.children[1],
			rightTop_ = this.container_.children[4],
			rightBottom_ = this.container_.children[5],
			rightBody_ = this.container_.children[6],
			centerBottom_ = this.container_.children[7],
			centerTop_ = this.container_.children[8];
		bodyContainer_.innerHTML = text;
		if (!_.isIE && text) {
			if (bodyContainer_.firstChild.nodeType === 1) {
				bodyContainer_.firstChild.style.margin = 0;
			}
		}
		var offsetBorder = _.isIE ? 2 : 0;
		var cSize = this.getHtmlSize_(text);
		var rightX = PopupMarker.POPUP_TBL.leftTop.width + cSize.width;
		leftBottom_.style.top = (cSize.height + PopupMarker.POPUP_TBL.leftBody.top) + "px";
		leftBody_.style.height = cSize.height + "px";
		bodyContainer_.style.width = cSize.width + "px";
		bodyContainer_.style.height = cSize.height + "px";
		bodyContainer_.style.top = PopupMarker.POPUP_TBL.leftBody.top;
		rightTop_.style.left = rightX + "px";
		rightBottom_.style.left = rightTop_.style.left;
		rightBottom_.style.top = leftBottom_.style.top;
		rightBody_.style.left = rightX + "px";
		rightBody_.style.height = leftBody_.style.height;
		centerBottom_.style.top = leftBottom_.style.top;
		centerBottom_.style.width = cSize.width + "px";
		centerTop_.style.width = cSize.width + "px";
		this.size_ = {
			"width": (rightX + PopupMarker.POPUP_TBL.rightTop.width),
			"height": (cSize.height + PopupMarker.POPUP_TBL.leftTop.height + PopupMarker.POPUP_TBL.leftBottom.height)
		};
		this.container_.style.width = this.size_.width + "px";
		this.container_.style.height = this.size_.height + "px";
	}
	bodyContainer_ = leftBottom_ = leftBody_ = rightTop_ = rightBottom_ = rightBody_ = centerBottom_ = centerTop_ = null;
	this.setPosition(this.latlng_);
	this.beforeNormalPopupText_ = text;
};

/*
 * @description 获得文字内容的基本宽度和高度，如果遇见marker没有正确的显示出来，很有可能是这里出问题了
 * @return goome.maps.Size
 */
PopupMarker.prototype.getHtmlSize_ = function(html) {
	var size = {};
	this.dummyTextNode.innerHTML = html;
	this.dummyTextNode.style.display = '';
	size.width = this.dummyTextNode.offsetWidth;
	size.height = this.dummyTextNode.offsetHeight;
	this.dummyTextNode.style.display = 'none';
	var ret, lines = html.split(/\n/i),
		totalSize = new goome.maps.Size(1, 1);
	for (var i = 0; i < lines.length; i++) {
		totalSize.width += size.width;
		totalSize.height += size.height;
	}
	return totalSize;
};
PopupMarker.prototype.makeImgDiv_ = function(imgSrc, params) {
	var imgDiv = document.createElement("div");
	imgDiv.style.position = "absolute";
	imgDiv.style.overflow = "hidden";
	if (params.width) {
		imgDiv.style.width = params.width + "px";
	}
	if (params.height) {
		imgDiv.style.height = params.height + "px";
	}
	var img = null;
	if (!_.isIE) {
		img = new Image();
		img.src = imgSrc;

	} else {
		img = document.createElement("div");
		if (params.width) {
			img.style.width = params.width + "px";

		}
		if (params.height) {
			img.style.height = params.height + "px";
		}
	}
	img.style.position = "relative";
	img.style.left = params.left + "px";
	img.style.top = params.top + "px";
	img.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + imgSrc + "')";
	imgDiv.appendChild(img);
	img = null;
	return imgDiv;
};
PopupMarker.prototype.fillDiv_ = function(params) {
	var bgDiv = document.createElement("div");
	bgDiv.style.position = "absolute";
	bgDiv.style.backgroundColor = "#FFF";
	bgDiv.style.fontSize = "1px";
	bgDiv.style.lineHeight = "1px";
	bgDiv.style.overflow = "hidden";
	bgDiv.style.left = params.left + "px";
	bgDiv.style.top = params.top + "px";
	bgDiv.style.width = params.width + "px";
	bgDiv.style.height = params.height + "px";
	return bgDiv;
};
PopupMarker.prototype.hide = function() {
	if (this.container_) {
		this.container_.style.visibility = "hidden";
	}
};
PopupMarker.prototype.show = function() {
	if (this.container_) {
		this.container_.style.visibility = "visible";
	}
};
PopupMarker.prototype.toggle = function() {
	if (this.container_) {
		if (this.container_.style.visibility == "hidden") {
			this.show();
		} else {
			this.hide();
		}
	}
};
PopupMarker.prototype.setPosition = function(latlng) {
	if (!latlng._source) {
		throw Error('PopupMarker:use wrapped LatLng');
	}
	var pxPos = this.map_.fromLatLngToDivPixel(latlng);
	this.container_.style.left = pxPos.x + "px";
	this.container_.style.top = (pxPos.y - this.size_.height) + "px";
	var icon = this.icon_;
	if (icon.indexOf('east') > -1) {
		this.iconContainer.style.left = (pxPos.x - this.ICON_WIDTH * 0.75) + "px";
	} else {
		this.iconContainer.style.left = (pxPos.x - this.ICON_WIDTH / 2) + "px";
	}
	this.iconContainer.style.top = (pxPos.y - this.ICON_HEIGHT) + "px";
	this.latlng_ = latlng;
};
PopupMarker.prototype.update = function(obj) {
	if ((typeof obj.icon) != "undefined") {
		if (this.icon_ != obj.icon) {
			this.iconContainer.innerHTML = "<img src='" + obj.icon + "'>";
			this.icon_ = obj.icon;
		}
	}
	if ((typeof obj.position) != "undefined") {
		this.latlng_ = obj.position;
		this.setPosition(this.latlng_);
	}
	if ((typeof obj.text) != "undefined") {
		this.text_ = obj.text;
		this.redrawNormalPopup_(obj.text);

	}
};
PopupMarker.prototype.setZIndex = function(index) {
	this.container_.style.zIndex = index;
	this.iconContainer.style.zIndex = index;
};
PopupMarker.prototype.latlng = function() {
	return this.latlng_;
};
PopupMarker.prototype.hideMarker = function() {
	this.container_.style.visibility = "hidden";
	this.iconContainer.style.visibility = "hidden";
};
PopupMarker.prototype.showMarker = function() {
	this.container_.style.visibility = "visible";
	this.iconContainer.style.visibility = "visible";
};