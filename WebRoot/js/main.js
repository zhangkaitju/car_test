var selectChoice = function(){
	//判断显示方法
	var value = $("#freq").val();
	//使用百度api海量点接口
	if(value == 1){
		showGPSData();
	}
	//使用百度lbs云存储
	if(value == 2){
		//上传文件到lbs
		//baidulbs();
		//加载自定义图层
		addBMapCustomLayer();
	}
	//使用高德云图
	if(value == 3){
		//上传文件到lbs
		//baidulbs();
		//加载自定义图层
		addAMapCustomLayer();
	}
};
//显示热力图
var showHotmap = function(){
	//ajax对象，数据提交给后台
	var value = $("#maptype").val();
	if(value == 0){}
	//使用百度热力图
	if(value == 1){
		showBMapHotmap();
	}
	//使用高德热力图
	if(value == 2){
		showAMapHotmap();
	}
};
//在高德地图上展示热力图
var showAMapHotmap = function(){
	if (!isSupportCanvas()) {
		alert('热力图仅对支持canvas的浏览器适用,您所使用的浏览器不能使用热力图功能,请换个浏览器试试~');
	}
	var heatmap;
	var xmlHttpReq=$.post("./search6","",function(data){
		//回调函数解析返回数据
		var dataObj = eval("("+data+")");
		alert(dataObj.length);
		
		 map.plugin(["AMap.Heatmap"], function () {
		      //初始化heatmap对象
		      heatmap = new AMap.Heatmap(map, {
		        radius: 25, //给定半径
		        opacity: [0, 0.8]
		          /*,gradient:{
		           0.5: 'blue',
		           0.65: 'rgb(117,211,248)',
		           0.7: 'rgb(0, 255, 0)',
		           0.9: '#ffea00',
		           1.0: 'red'
		           }*/
		      });
		      //设置数据集
		      heatmap.setDataSet({
		        data: dataObj,
		        max: 100
		      });
		    });
	});
	//判断浏览区是否支持canvas
    function isSupportCanvas() {
      var elem = document.createElement('canvas');
      return !!(elem.getContext && elem.getContext('2d'));
    }
	
};
//在百度地图上展示热力图
var showBMapHotmap = function(){
	//ajax对象，数据提交给后台
	var xmlHttpReq=$.post("./search6","",function(data){
		//回调函数解析返回数据
		var dataObj = eval("("+data+")");
		alert(dataObj.length);
		if(!isSupportCanvas()){
			alert('热力图目前只支持有canvas支持的浏览器,您所使用的浏览器不能使用热力图功能~');
		}
		//详细的参数,可以查看heatmap.js的文档 https://github.com/pa7/heatmap.js/blob/master/README.md
		//参数说明如下:
		/* visible 热力图是否显示,默认为true
	     * opacity 热力的透明度,1-100
	     * radius 势力图的每个点的半径大小   
	     * gradient  {JSON} 热力图的渐变区间 . gradient如下所示
	     *	{
				.2:'rgb(0, 255, 255)',
				.5:'rgb(0, 110, 255)',
				.8:'rgb(100, 0, 255)'
			}
			其中 key 表示插值的位置, 0~1. 
			    value 为颜色值. 
	     */
	
		heatmapOverlay = new BMapLib.HeatmapOverlay({"radius":20});
		map.addOverlay(heatmapOverlay);
		heatmapOverlay.setDataSet({data:dataObj,max:100});

		function setGradient(){
		     	/*格式如下所示:
				{
			  		0:'rgb(102, 255, 0)',
			 	 	.5:'rgb(255, 170, 0)',
				  	1:'rgb(255, 0, 0)'
				}*/
			var gradient = {};
	     	var colors = document.querySelectorAll("input[type='color']");
	     	colors = [].slice.call(colors,0);
	     	colors.forEach(function(ele){
				gradient[ele.getAttribute("data-key")] = ele.value; 
	     	});
	        heatmapOverlay.setOptions({"gradient":gradient});
	    }
		//判断浏览区是否支持canvas
		function isSupportCanvas(){
	        var elem = document.createElement('canvas');
	        return !!(elem.getContext && elem.getContext('2d'));
	    }
	});
};
//按时间查询图层
var searchMap = function(from){
	loadAMapScript();
	
	var FROM_TIME = from.split(" ")[0];
	alert(FROM_TIME);
	//if (from == "" || to == "") return; //开始和结束日期都不能为空
	if(from == "") return;
	//var FROM_TIME = new Date(from.replace(/-/g, "/"));
	//var TO_TIME = new Date(to.replace(/-/g, "/"));
	//alert(FROM_TIME);
	//var timeDiff = (TO_TIME - FROM_TIME) / 1000;
	//if (timeDiff < 0) {
	//	alert(lg.distime);
	//	this.buttonAttribute(this.BUTTONS_ID[0], false, true);
	//	return;
	//}
	//加载云图层插件
	var loadDiv = document.getElementById('tip');
	loadDiv.style.display = "block";
	loadDiv.style.top = (document.documentElement.clientHeight - 20) / 2 + "px";
	loadDiv.style.left = (document.documentElement.clientWidth - 150) / 2 + "px";
	
	map.plugin('AMap.CloudDataLayer',function(){
		var layerOptions = {
				query:{keywords: FROM_TIME}, 
				clickable:true
		};
		
		var cloudDataLayer = new AMap.CloudDataLayer('55d44202e4b01ef49904320c',layerOptions); //实例化云图层类
		cloudDataLayer.setMap(map); //叠加云图层到地图
		document.getElementById('tip').style.display = "none";
	});
};
//叠加百度云数据图层
var customLayer;
var addBMapCustomLayer = function(){
	var loadDiv = document.getElementById('tip');
	loadDiv.style.display = "block";
	loadDiv.style.top = (document.documentElement.clientHeight - 20) / 2 + "px";
	loadDiv.style.left = (document.documentElement.clientWidth - 150) / 2 + "px";
	if (customLayer) {
		map.removeTileLayer(customLayer);
	}
	customLayer=new BMap.CustomLayer({
		geotableId: 118938,
		q: '', //检索关键字
		tags: '', //空格分隔的多字符串
		filter: '' //过滤条件,参考http://developer.baidu.com/map/lbs-geosearch.htm#.search.nearby
	});
	map.addTileLayer(customLayer);
	customLayer.addEventListener('hotspotclick');
	document.getElementById('tip').style.display = "none";
};
//叠加高德云数据图层
var addAMapCustomLayer = function(){
	//加载云图层插件
	var loadDiv = document.getElementById('tip');
	loadDiv.style.display = "block";
	loadDiv.style.top = (document.documentElement.clientHeight - 20) / 2 + "px";
	loadDiv.style.left = (document.documentElement.clientWidth - 150) / 2 + "px";
	
	map.plugin('AMap.CloudDataLayer',function(){
		var layerOptions = {
				clickable:true
		};
		var cloudDataLayer = new AMap.CloudDataLayer('55d44202e4b01ef49904320c',layerOptions); //实例化云图层类
		cloudDataLayer.setMap(map); //叠加云图层到地图
		document.getElementById('tip').style.display = "none";
	});
};
//使用百度api加载海量点方法
var showGPSData = function(){
	//初始化时清除所有覆盖物
	map.clearOverlays(); 
	//显示数据加载提示
	var loadDiv = document.getElementById('tip');
	loadDiv.style.display = "block";
	loadDiv.style.top = (document.documentElement.clientHeight - 20) / 2 + "px";
	loadDiv.style.left = (document.documentElement.clientWidth - 150) / 2 + "px";
	//_.ajax.jsonp(PlayBack.AJAX_URL + PlayBack.REQUESR_URL + parms + "&callback=PlayBack.getDataCallBack");
	
	//ajax对象，数据提交给后台
	var xmlHttpReq=$.post("./search4","",function(data){
		//回调函数解析返回数据
		var dataObj = eval("("+data+")");
		document.getElementById('tip').style.display = "none";
		
		//定义海量点数组，pointArray1是蓝色表示出发点，pointArray2是红色表示目的地
		var pointArray1 = new Array();
		var pointArray2 = new Array();
		//将gps数据分出发地和目的地加载
		for(var i=0; i<dataObj.length; i++){
			if(i%2==0){
				pointArray1.push(new BMap.Point(dataObj[i].locationX, dataObj[i].locationY));
			}else{
				pointArray2.push(new BMap.Point(dataObj[i].locationX, dataObj[i].locationY));
			}
		}
		//加载海量点参数
		var options1 = {
	            size: BMAP_POINT_SIZE_SMALL,
	            shape: BMAP_POINT_SHAPE_CIRCLE,
	            color: 'red'
	        };
		 var options2 = {
				 size: BMAP_POINT_SIZE_SMALL,
				 shape: BMAP_POINT_SHAPE_CIRCLE,
				 color: 'blue'
		 };
		 //PointCollection海量点数据接口
		 var pointCollection1 = new BMap.PointCollection(pointArray1, options1); 
		 //添加鼠标点击事件
		 pointCollection1.addEventListener('click', function (e) {
			 alert('单击点的坐标为：' + e.point.lng + ',' + e.point.lat);  // 监听点击事件
		 });
	        
		 var pointCollection2 = new BMap.PointCollection(pointArray2, options2); 
		 pointCollection2.addEventListener('click', function (e) {
			 alert('单击点的坐标为：' + e.point.lng + ',' + e.point.lat);  // 监听点击事件
		 });
		 //地图加载覆盖物
		 map.addOverlay(pointCollection1);
		 map.addOverlay(pointCollection2);
	});
};