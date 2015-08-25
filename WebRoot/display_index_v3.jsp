<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>

<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
		<meta http-equiv="X-UA-Compatible" content="IE=7" />
		<title>GPS数据</title>
		<style type="text/css">
			*{font-size:12px;}
			body,html{margin:0px;padding:0px;overflow:hidden;}
			#tip{position:absolute;z-index:100000;width:auto;padding:5px;color:#039;font-weight:bold;background:#FFF;display:none;}
		</style>
		<!-- 百度地图依赖js文件和css文件 -->
		<script type="text/javascript" src="js/api.js"></script>
		<!-- 地图图层显示、热力图生成 -->
		<script type="text/javascript" src="js/main.js"></script>
		<!-- 日历控件 -->
		<script type="text/javascript" src="js/WdatePicker.js"></script>
		<!-- 百度地图、高德地图切换 -->
		<script type="text/javascript" src="js/selectMap.js"></script>
		<!-- 自定义百度云图层 -->
		<script type="text/javascript" src="js/customlayer.js"></script>
		<script type="text/javascript" src="js/jquery-1.3.2.min.js"></script>
		<!-- 热力图第三方工具 -->
		<script type="text/javascript" src="js/Heatmap_min.js"></script>

		<script type="text/javascript">
			//定义窗体大小，菜单栏大小
			function restFrame(){
				var w = document.documentElement.clientWidth;
				var h = document.documentElement.clientHeight;
				var topMenuHeight = 32;//顶部菜单区域的整体高度
				var divCanvas = document.getElementById("map");
				divCanvas.style.height= (h-topMenuHeight)+"px";
				divCanvas.style.width= w+"px";
			}
			//初始化地图，地图中心点是北京
			function init(){
				restFrame();
				loadBMapJScript();
			}
			
			//getMaxDate生成客户端本地时间
			function getMaxDate(){
				var t = new Date();
				var maxDate = [t.getFullYear(), t.getMonth()+1, t.getDate()].join('-');
				maxDate += ' ' + t.toLocaleTimeString();
				return maxDate; 
			}
			//getMinDate生成客户端本地时间
			function getMinDate(){
				var t = new Date();
				t.setMonth(t.getMonth() - 2);//最小时间少2个月
				var maxDate = [t.getFullYear(), t.getMonth()+1, t.getDate()].join('-');
				maxDate += ' ' + t.toLocaleTimeString();
				return maxDate; 
			}
		</script>
	</head>
	<body onResize="restFrame();" onLoad="init();">
		<span id="tip">正在加载数据,请耐心等待.......</span>
		<div style="font-size:12px;height:30px;text-align:center;background:#C5CFD6;border-bottom:1px solid #999;">
			<!-- 
			从：
		    <input type="text" name="from" value="" id="from" readonly onClick="WdatePicker({dateFmt:'yyyy-MM-dd HH:mm:ss',maxDate: getMaxDate(),minDate:getMinDate()})" class="Wdate" />
			到：
		    <input type="text" name="to" value="" id="to" readonly onClick="WdatePicker({dateFmt:'yyyy-MM-dd HH:mm:ss',maxDate: getMaxDate(),minDate:getMinDate()})" class="Wdate" />
		    -->
		    时间：
		    <input type="text" name="from" value="" id="from" readonly onClick="WdatePicker({dateFmt:'yyyy-MM-dd HH:mm:ss',maxDate: getMaxDate(),minDate:getMinDate()})" class="Wdate" />
			 <input id="SHOW" onClick="searchMap(document.getElementById('from').value)" type="button" value="查询" />
			<!-- 
			频    率：
		    <select name="freq" id="freq" onchange="PlayBack.Frequency = this.value">
		        <option value="10000">正常-10</option>
		        <option value="5000">2倍正常-5</option>
		        <option value="3000">快-3</option>
		        <option value="1000">比较快-1</option>
		        <option value="500" >很快-0.5</option>
		        <option value="100">非常快-0.1</option>
		        <option value="10" selected>快得不得了</option>
		    </select>
			秒
			 -->
		     <select name="maptype" id="maptype" onchange="">
		        <option value="1" selected="selected">百度地图</option>
		        <option value="2">高德地图</option>
		    </select>
		    <input id="SHOW" onClick="selectMap()" type="button" value="切换" />
		    方法：
			 <select name="choice" id="freq" onchange="">
		        <option value="1" selected="selected">正常</option>
		        <option value="2">百度LBS云</option>
		        <option value="3">高德云图</option>
		    </select>
		    <input id="SHOW" onClick="selectChoice()" type="button" value="显示" />
		    <input id="SHOW" onClick="showHotmap()" type="button" value="热力图" />
		    <input id="mdTime" type="hidden" value=""/>
		</div>
		<div id="map"></div>
		
		<script type="text/javascript">
			//百度地图API功能
			var map = null;
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
		</script>
	</body>     
</html>
