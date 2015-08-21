//function PlayBack() {}
//PlayBack.prototype.

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