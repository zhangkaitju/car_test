//加载百度云图层操作

var customLayer;

function addCustomLayer(){
	if (customLayer) {
		map.removeTileLayer(customLayer);
	}
	customLayer=new BMap.CustomLayer({
		geotableId: 118177,
		q: '', //检索关键字
		tags: '', //空格分隔的多字符串
		filter: '' //过滤条件,参考http://developer.baidu.com/map/lbs-geosearch.htm#.search.nearby
	});

	map.addTileLayer(customLayer);
	//customLayer.addEventListener('hotspotclick',callback);
}

function callback(e){//单击热点图层
	var customPoi = e.customPoi;//poi的默认字段
	var contentPoi=e.content;//poi的自定义字段
	var content = '<p style="width:280px;margin:0;line-height:20px;">时间：' + customPoi.label +'</p>';
	var searchInfoWindow = new BMapLib.SearchInfoWindow(map, content, {
		title: customPoi.title, //标题
		width: 290, //宽度
		height: 40, //高度
		panel : "panel", //检索结果面板
		enableAutoPan : true, //自动平移
		enableSendToPhone: true, //是否显示发送到手机按钮
		searchTypes :[
			BMAPLIB_TAB_SEARCH,   //周边检索
			BMAPLIB_TAB_TO_HERE,  //到这里去
			BMAPLIB_TAB_FROM_HERE //从这里出发
		]
	});
	var point = new BMap.Point(customPoi.point.lng, customPoi.point.lat);
	searchInfoWindow.open(point);
};