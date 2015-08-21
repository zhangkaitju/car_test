<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>

<%
	String path = request.getContextPath();
	String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<style type="text/css">
			div, body, img, input, h1, h2, h3,a,iframe{
				margin:0;
				padding:0;
			}
			#content{
				width:auto;
				height:100%;
				padding:auto;
				#border:1px solid blue;
			}
			#head{
				width:420px;
				margin:0 auto;
				text-align:center;
				#border:1px solid blue;
			}
			#head h1{
				font-size:24px;
				text-align:center;
			}	
			#body{
				height:650px;
				margin-top:20px;
				margin-bottom:15px;
				border:1px solid red;
			}
			#navBar{
				width:10%;
				height:650px;
				float:left;
				border:1px solid red;
			}
			#navBar_head{
				margin:0 auto;
				text-align:center;
			}
			#navBar_head h2{
				font-size:20px;
			}
			#navBar_body{
				margin-top:25px;
				#border:1px solid black;	
			}
			input{
				margin:8px;
			}
			#foot{
				text-align:center;
				margin:0 auto;
			}
			#map_display{
				width:89%;
				height:100%;
				float:left;
				border:1px solid black;
				margin-left:10px;
			}
			iframe{
				width:100%;
				height:100%;
			}
			
			
			body, html,#allmap {width: 100%;height: 100%;overflow: hidden;margin:0;}
			#l-map{height:100%;width:78%;float:left;border-right:2px solid #bcbcbc;}
			#r-result{height:100%;width:20%;float:left;}


		</style>
		<script type="text/javascript" src="http://api.map.baidu.com/api?v=2.0&ak=XSHyInWf22eub3zzNG6SK8zv"></script>
		<script language="JavaScript" src="./js/jquery-1.4.2.js"></script>
		<script type="text/javascript">
			$(document).ready(function(){
				var map = new BMap.Map("allmap");
				map.centerAndZoom(new BMap.Point(116.404, 39.915), 13);
				map.enableScrollWheelZoom();   //启用滚轮放大缩小，默认禁用
				
				$("#b1").click(function(){
					map.clearOverlays();
					//var carid = $("#carid").val();
					//$("#title").text("车辆ID为 "+carid+" 的GPS数据");
					var xmlHttpReq=$.post("./search2",$("#form1").serialize(),function(data){
					 	//alert("data  "+data);
						//alert("textStatus  "+textStatus);
						//$("#one").text(data);
						//alert(data);
						var dataObj = eval("("+data+")");
						//var dataObj = data;
						//alert(dataObj.length);
						//for(var i=0; i<dataObj.length; i++){
						//	alert(dataObj[0].locationX);
						//	alert(dataObj[0].locationY);
						//}
						var fixedX = dataObj[0].locationX;
						var fixedY = dataObj[0].locationY;
						
						var point = new BMap.Point(fixedX, fixedY);
	
						var pointArray1 = new Array();
						var pointArray2 = new Array();
						for(var i=0; i<dataObj.length; i++){
							if(i%2==0){
								pointArray1.push(new BMap.Point(dataObj[i].locationX, dataObj[i].locationY));
							}else{
								pointArray2.push(new BMap.Point(dataObj[i].locationX, dataObj[i].locationY));
							}
						}
						alert(pointArray1.length);
						alert(pointArray2.length);
						//var polyline = new BMap.Polyline(pointArray, {strokeColor:"blue", strokeWeight:3, strokeOpacity:0.5});
						//红色表示
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
				        var date1 = new Date();
				        alert(date1);
				        
						var pointCollection1 = new BMap.PointCollection(pointArray1, options1); 
						
						pointCollection1.addEventListener('click', function (e) {
							alert('单击点的坐标为：' + e.point.lng + ',' + e.point.lat);  // 监听点击事件
				        });
				        
				       var pointCollection2 = new BMap.PointCollection(pointArray2, options2); 
						pointCollection2.addEventListener('click', function (e) {
							alert('单击点的坐标为：' + e.point.lng + ',' + e.point.lat);  // 监听点击事件
				        });
				         
				        map.addOverlay(pointCollection1);  // 添加Overlay
				        map.addOverlay(pointCollection2);  // 添加Overlay
				        
						var date2 = new Date();
				        alert(date2);
						alert(date2-date1);
						//map.addOverlay(polyline);
					 });
					// alert("xmlHttpReq.readyState"+xmlHttpReq.readyState);
					// alert("xmlHttpReq.status"+xmlHttpReq.status);
				}); 
			});
		</script>
		<title>出租车GPS轨迹</title>
	</head>
	<body>
		<div id="content">
			<div id="head">
				<h1 id="title"></h1>
			</div>
			<div id="body">
				<div id="navBar">
					<div id="navBar_head">
						<h2 id="pageName">GPS数据查询</h2>
					</div>
					<div id="navBar_body">
						<form action="" method="post" target="index_right" id="form1">

							<h3><input type="button" id="b1" value="查询"></h3>
						</form>
					</div>
	
				</div>
				<!-- div id="map_display">
					<iframe name="index_right" class="iframe"></iframe>
				</div-->
				<!-- 地图显示框 -->
				<div id="map_display">
					<div id="allmap"></div>
				</div>
			</div>
		</div>
	</body>
</html>

