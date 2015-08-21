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
		<script type="text/javascript" src="js/api.js"></script>
		<script type="text/javascript" src="js/main.js"></script>
		<script type="text/javascript" src="js/WdatePicker.js"></script>
		<script type="text/javascript" src="js/jquery-1.3.2.min.js"></script>

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
			从：
		    <input type="text" name="from" value="" id="from" readonly onClick="WdatePicker({dateFmt:'yyyy-MM-dd HH:mm:ss',maxDate: getMaxDate(),minDate:getMinDate()})" class="Wdate" />
			到：
		    <input type="text" name="to" value="" id="to" readonly onClick="WdatePicker({dateFmt:'yyyy-MM-dd HH:mm:ss',maxDate: getMaxDate(),minDate:getMinDate()})" class="Wdate" />
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
		    <input id="SHOW" onClick="showGPSData()" type="button" value="显示" />
		    <input id="mdTime" type="hidden" value=""/>
		</div>
		<div id="map"></div>
	</body>     
</html>
<script type="text/javascript">
	var map = new BMap.Map("map");
	map.centerAndZoom(new BMap.Point(116.39854, 39.99458), 12);
	
	map.enableScrollWheelZoom();   //启用滚轮放大缩小，默认禁用
	map.enableContinuousZoom();    //启用地图惯性拖拽，默认禁用
</script>