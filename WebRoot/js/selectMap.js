var selectMap = function(){
	//判断显示方法
	var value = $("#maptype").val();
	if(value == 0){}
	//使用百度api海量点接口
	if(value == 1){
		loadBMapJScript();
	}
	//使用百度lbs云存储
	if(value == 2){
		//上传文件到lbs
		//baidulbs();
		//加载自定义图层
		loadAMapScript();
	}
};

//百度地图API功能
function loadBMapJScript() {
	var script = document.createElement("script");
	script.type = "text/javascript";
	script.src = "http://api.map.baidu.com/api?v=2.0&ak=XSHyInWf22eub3zzNG6SK8zv&callback=initBMap";
	document.body.appendChild(script);
}
function initBMap() {
	map = new BMap.Map("map");            // 创建Map实例
	var point = new BMap.Point(116.404, 39.915); // 创建点坐标
	map.centerAndZoom(point,12);                 
	map.enableScrollWheelZoom();                 //启用滚轮放大缩小
}  

function initAMap() {
	  map = new AMap.Map("map", {
	  view:new AMap.View2D({
	    center: new AMap.LngLat(116.39, 39.9),
	    zoom:11
	   })
	  });
	}
	function loadAMapScript() {
	  var script = document.createElement("script");
	  script.type = "text/javascript";
	  script.src = "http://webapi.amap.com/maps?v=1.3&key=303d1cd8897853608dca6d2527993ae2&callback=initAMap";
	  document.body.appendChild(script);
	}
//window.onload = loadJScript;  //异步加载地图