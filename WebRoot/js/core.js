var speedForStill = [4, 10],
	mousePos = {
		x: 0,
		y: 0
	}
	//,
	//    geocoder = new google.maps.Geocoder();

function parseAddress(weidu, jingdu, arr, name) {
	if (document.getElementById(arr) != null) {
		geocoder.geocode({
			"address": weidu + "," + jingdu
		}, function(results, status) {
			_str = " ";
			if (status == google.maps.GeocoderStatus.OK) {
				_str = name + "," + lg.p + ":" + results[0].formatted_address
			} else {
				_str = lg.isGetting
			}
			document.getElementById(arr).innerHTML = _str
		})
	}
}

function getHangXiang(dusu, sudu) {
	if (sudu < 0 || dusu == "") return "......";
	var z = 5,
		fz = 10,
		p = 30;
	var hangxiang = lg.hangxiang;
	var qujian1 = [z, fz, fz, p, 90 - p, 90 - z, 90 - fz, 90 + fz, 90 + p, 180 - p, 180 - z, 180 - fz, 180 + fz, 180 + p, 270 - p, 270 - z, 270 - fz, 270 + fz, 270 + p, 360 - p];
	var qujian2 = [360 - z, 360 - fz, p, 90 - p, 90 - fz, 90 + z, 90 + fz, 90 + p, 180 - p, 180 - fz, 180 + z, 180 + fz, 180 + p, 270 - p, 270 - fz, 270 + z, 270 + fz, 270 + p, 360 - p, 360 - fz];
	for (var i = 0; i < qujian1.length; i++) {
		if (i == 0 || i == 1) {
			if (qujian2[i] <= dusu || dusu <= qujian1[i]) return hangxiang[i]
		} else {
			if (qujian1[i] <= dusu && dusu <= qujian2[i]) return hangxiang[i]
		}
	}
	return dusu
}

function exchangeTime(msecond) {
	var dd, hh, mm, ss;
	dd = Math.round(msecond / 86400 + 0.5) - 1;
	hh = Math.round((msecond - dd * 86400) / 3600 + 0.5) - 1;
	mm = Math.round((msecond - dd * 86400 - hh * 3600) / 60 + 0.5) - 1;
	ss = Math.round(msecond - dd * 86400 - hh * 3600 - mm * 60);
	var strtip = "";
	if (dd > 0) strtip = strtip + dd + lg.d;
	if (hh > 0) strtip = strtip + hh + lg.h;
	if (mm > 0) {
		strtip = strtip + mm + lg.m;
		if (dd > 0) return strtip
	}
	if (ss > 0) strtip = strtip + ss + lg.s;
	return strtip
}

function getTimeDiff(serverTime, objTime) {
	var timeDiff = (new Date((serverTime.split("."))[0].replace(/-/g, "/")).getTime() - new Date((objTime.split("."))[0].replace(/-/g, "/")).getTime()) / 1000;
	return timeDiff
}

function getRoom(diff) {
	var room = new Array(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14);
	var diffArr = new Array(360, 180, 90, 45, 22, 11, 5, 2.5, 1.25, 0.6, 0.3, 0.15, 0.07, 0.03, 0);
	for (var i = 0; i < diffArr.length; i++) {
		if ((diff - diffArr[i]) >= 0) {
			return room[i]
		}
	}
	return 14
}

function getCenterPoint(maxJ, minJ, maxW, minW) {
	if (maxJ == minJ && maxW == minW) return [maxJ, maxW, 0];
	var diff = maxJ - minJ;
	if (diff < (maxW - minW)) diff = maxW - minW;
	diff = parseInt(10000 * diff) / 10000;
	var centerJ = minJ * 1000000 + 1000000 * (maxJ - minJ) / 2;
	var centerW = minW * 1000000 + 1000000 * (maxW - minW) / 2;
	return [centerJ / 1000000, centerW / 1000000, diff]
}

function mouseCoords(ev) {
	ev = ev || window.event;
	if (ev.pageX || ev.pageY) {
		mousePos = {
			x: ev.pageX + 10,
			y: ev.pageY + 10
		}
	}
	mousePos = {
		x: ev.clientX + document.documentElement.scrollLeft - document.body.clientLeft + 10,
		y: ev.clientY + document.documentElement.scrollTop - document.body.clientTop + 10
	}
}

function getStatic(datetime, servertime, sys_time, heart_time) {
	stopover_time = getTimeDiff(servertime, datetime);
	var heart_time = getTimeDiff(servertime, heart_time);
	var dingwei_time = getTimeDiff(servertime, sys_time);
	if (dingwei_time < heart_time) heart_time = dingwei_time;
	return [heart_time, stopover_time]
}

function dblclickSetRoomCenter(weidu, jingdu, map) {
	var _zoom = map.getZoom();
	if (_zoom < 11) {
		map.setCenter(new google.maps.LatLng(Number(weidu), Number(jingdu)));
		map.setZoom(11)
	} else if (_zoom >= 11 && _zoom <= 18) {
		map.setCenter(new google.maps.LatLng(Number(weidu), Number(jingdu)));
		map.setZoom(_zoom + 2)
	} else {
		alert(lg.zoomMax)
	}
}

function status_(heart_stime, speed, stopover_time, endServerTimeCount) {
	var speed = Number(speed);
	var _arr = ["white", lg.srun1, 0, false];
	var oneDay = 60 * 60 * 24;
	var servenDays = -(60 * 60 * 24 * 7);
	var offlineSeconds = 900;
	if (endServerTimeCount > (oneDay * 7)) {
		return ["white", lg.arrear, 0, false]
	}
	var statusWord = "-1";
	if (endServerTimeCount <= (oneDay * 7) && endServerTimeCount > 0) {
		var days = (endServerTimeCount / oneDay) + lg.d;
		statusWord = lg.serviceEnd[0] + days
	}
	if (endServerTimeCount <= 0 && endServerTimeCount > servenDays) {
		var days = Math.abs(endServerTimeCount) / oneDay;
		statusWord = days + lg.serviceEnd[2];
		if (endServerTimeCount == 0) {
			statusWord = lg.serviceEnd[3]
		}
	}
	if (speed == -9 && heart_stime > offlineSeconds) {
		if (statusWord == "-1") return ["white", lg.srun0, speed, false];
		else return ["white", statusWord, speed, false]
	}
	if (speed == -9 && heart_stime <= offlineSeconds) {
		if (statusWord == "-1") return ["gray", lg.srun2, 0, true];
		else return ["gray", statusWord, 0, true]
	}
	if (speed < 0 || heart_stime > offlineSeconds) {
		if (statusWord == "-1") return ["white", lg.srun1, 0, false];
		else return ["white", statusWord, 0, false]
	}
	if ((speed >= 0 && speed < speedForStill[1]) || 35 < stopover_time) {
		if (statusWord == "-1") return ["gray", lg.srun2, 0, true];
		else return ["gray", statusWord, 0, true]
	}
	if (speed >= speedForStill[1] && speed <= 80) {
		if (statusWord == "-1") return ["green", lg.srun3, speed, true];
		else return ["green", statusWord, speed, true]
	}
	if (speed > 80 && speed <= 120) {
		if (statusWord == "-1") return ["yellow", lg.srun4, speed, true];
		else return ["yellow", statusWord, speed, true]
	}
	if (speed > 120) {
		if (statusWord == "-1") return ["red", lg.srun5, speed, true];
		else return ["red", lstatusWord, speed, true]
	}
	return _arr
}

function direction(speed, iconType, hangxiang) {
	var direction = "west";
	if (iconType.charAt(0) == "2") {
		var speed = Number(speed);
		var hangxiang = Number(hangxiang);
		if (speed == -1) {
			direction = "west"
		} else {
			if (hangxiang <= 45 || hangxiang > 315) {
				direction = "north"
			} else if (hangxiang > 45 && hangxiang <= 135) {
				direction = "east"
			} else if (hangxiang > 135 && hangxiang <= 225) {
				direction = "south"
			} else if (hangxiang > 225 && hangxiang <= 315) {
				direction = "west"
			}
		}
	}
	return direction
}

function getIconURL(iconType, status, hangxiang) {
	var imgURL = "green_01.gif";
	if (iconType.charAt(0) == "2") {
		imgURL = status + "_" + hangxiang + "_" + iconType + ".gif"
	} else {
		imgURL = status + "_" + iconType + ".gif"
	}
	return imgURL
}

function getAccStatus(val, p, record) {
	if ((typeof record) == "undefined" || record.data["product_type"] == "GT06") {
		var stem = parseInt(val.substr(0, 2), 16);
		var tem = stem.toString(2);
		if (tem.length < 2 || tem.substr(tem.length - 2, 1) == "0") {
			return lg.off
		} else {
			return lg.on
		}
	} else {
		return "..."
	}
}

function distance(lat1, lon1, lat2, lon2, len) {
	var R = 6371;
	var dLat = (lat2 - lat1) * Math.PI / 180;
	var dLon = (lon2 - lon1) * Math.PI / 180;
	var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	var d = R * c;
	return d + len
}

function formatKm2M(v) {
	if (v > 1) return Math.round(v * 1000) / 1000 + lg.km;
	else if (v <= 1) return Math.round(v * 1000) + lg.mi
}

function parseGt06Staust(val) {
		var val = val + "";
		if ((typeof val) == "undefined") return lg.sdw0;
		var stem = parseInt(val.substr(0, 2), 16);
		var tem = stem.toString(2);
		if (tem.length < 7 || (tem.length == 7 && tem.substr(0, 1) == "0") || (tem.length == 8 && tem.substr(1, 1) == "0")) return lg.sdw0;
		else return lg.sdw1
	}
	//function addMAPabc(map) {
	//    var tileSize = new google.maps.Size(256, 256);
	//    var getTileUrl = function (tile, zoom) {
	//            return " http://emap" + ((tile.x + tile.y) % 4) + ".mapabc.com/mapabc/maptile?v=w2.99&x=" + tile.x + "&y=" + tile.y + "&zoom=" + (17 - zoom)
	//        };
	//    var imageMapType = new google.maps.ImageMapType({
	//        alt: "MAPabc",
	//        isPng: true,
	//        maxZoom: 18,
	//        minZoom: 1,
	//        name: "MAPabc",
	//        tileSize: tileSize,
	//        opacity: 1.0,
	//        getTileUrl: getTileUrl
	//    });
	//    map.mapTypes.set('MAPabc', imageMapType)
	//}
	//function addMarkerLayersTile(map) {
	//    var label = new google.maps.ImageMapType({
	//        getTileUrl: function (tile, zoom) {
	//            var arr = ["mt0", "mt1", "mt2", "mt3"];
	//            var _u = arr[Math.floor(Math.random() * arr.length)];
	//            return "http://" + _u + ".google.com/vt/imgtp=png32&lyrs=h@140&hl=zh-CN&gl=cn&x=" + (tile.x) + "&y=" + (tile.y) + "&z=" + zoom + "&s=Galil"
	//        },
	//        tileSize: new google.maps.Size(256, 256),
	//        isPng: true
	//    });
	//    map.overlayMapTypes.insertAt(0, label)
	//}
	//function addMAPType(map, id, text) {
	//    var tileSize = new google.maps.Size(256, 256);
	//    var getTileUrl = function (tile, zoom) {
	//            var arr = ["mt0", "mt1", "mt2", "mt3"];
	//            var _u = arr[Math.floor(Math.random() * arr.length)];
	//            return "http://" + _u + ".google.com/vt/lyrs=s@76&gl=cn&x=" + tile.x + "&y=" + tile.y + "&z=" + zoom
	//        };
	//    var imageMapType = new google.maps.ImageMapType({
	//        alt: text,
	//        isPng: true,
	//        maxZoom: 20,
	//        name: text,
	//        tileSize: tileSize,
	//        opacity: 1.0,
	//        getTileUrl: getTileUrl
	//    });
	//    map.mapTypes.set(id, imageMapType)
	//}

//UTC + 时区差 ＝ 本地时间 
//将后台utc时间毫秒转为本地时间
function utcToLocal(utc) {
	if (isNaN(Number(utc))) return utc;
	var t = new Date(Number(utc));
	d = [t.getFullYear(), t.getMonth() + 1, t.getDate()].join('/');
	var mm = t.getMinutes(),
		ss = t.getSeconds();
	d += ' ' + ([t.getHours(), mm > 9 ? mm : '0' + mm, ss > 9 ? ss : '0' + ss].join(':'));
	return d;
}

//将本地时间时间转为utc时间毫秒
function localToUtc(local) {
	if (!isNaN(Number(local))) return local;
	var l = new Date(local.replace(/\-/g, '/')).getTime();
	return l;
}