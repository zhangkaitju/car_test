(function(window) {
	window.goome = window.goome || {};
	goome.maps = goome.maps || {};
	goome.maps.event = {};
	var isBMap, mapperKey, tempMaps;
	if (typeof BMap != "undefined") {
		tempMaps = BMap;
		goome.maps.event = {};
		isBMap = true;
		mapperKey = "baidu"
	} else {
		if (typeof google != "undefined" && google.maps) {
			tempMaps = google.maps;
			isBMap = false;
			mapperKey = "google"
		}
	}
	goome.maps.event.addListener = function(map, name, handler) {
		var self = map._source || map;
		if (self.addEventListener) {
			self.addEventListener(name, function(event) {
				event.latLng = new goome.maps.LatLng(event.point);
				handler.call(map, event)
			})
		} else {
			google.maps.event.addListener(self, name, function(event) {
				event.latLng = new goome.maps.LatLng(event.latLng);
				handler.call(map, event)
			})
		}
	};
	var objectMapping = {
		Map: {
			google: "Map",
			baidu: "Map"
		},
		LatLng: {
			google: "LatLng",
			baidu: "Point"
		},
		Point: {
			google: "Point",
			baidu: "Pixel"
		},
		Size: {
			google: "Size",
			baidu: "Size"
		},
		LatLngBounds: {
			google: "LatLngBounds",
			baidu: "Bounds"
		},
		InfoWindow: {
			google: "InfoWindow",
			baidu: "InfoWindow"
		},
		OverlayView: {
			google: "OverlayView",
			baidu: "Overlay"
		},
		Circle: {
			google: "Circle",
			baidu: "Circle"
		},
		Polyline: {
			google: "Polyline",
			baidu: "Polyline"
		},
		Marker: {
			google: "Marker",
			baidu: "Marker"
		}
	};
	for (var key in objectMapping) {
		goome.maps[key] = eval(key)
	}

	function OverlayView() {}
	OverlayView.prototype.setMap = function(map) {
		if (this._source.setMap) {
			this._source.setMap(map ? (map._source || map) : null)
		} else {
			if (map) {
				map = map._source || map;
				if (map.addOverlay) {
					map.addOverlay(this._source)
				}
			} else {
				map = this._source.getMap();
				if (map) {
					map.removeOverlay(this._source)
				}
			}
		}
	};
	OverlayView.prototype.getMap = function() {
		var map = this._source.getMap();
		return map ? new goome.maps.Map(map) : null
	};
	for (var key in {
		Circle: "",
		Polyline: "",
		Marker: ""
	}) {
		goome.maps[key].prototype.setMap = goome.maps.OverlayView.prototype.setMap;
		goome.maps[key].prototype.getMap = goome.maps.OverlayView.prototype.getMap
	}

	function Map(options) {
		if (this === window) {
			throw Error("use constructor to create a map instance")
		}
		if (options && options.setZoom) {
			this._source = options;
			return
		}
		if (typeof options != "object" || !options.id) {
			throw Error("Map:parameter type error or required property missed")
		}
		var defaults = {
			lang: "cn",
			sandbox: false,
			lat: {
				google: 36.87962060502676,
				baidu: 39.915
			},
			lng: {
				google: 111.6015625,
				baidu: 116.404
			},
			zoom: {
				google: 14,
				baidu: 13
			}
		};
		var sandbox = options.sandbox || defaults.sandbox,
			lang = options.lang || defaults.lang,
			node = (typeof options.id === "string") ? document.getElementById(options.id) : options.id;
		var map;
		if (isBMap) {
			map = new BMap.Map(node, {
				zoomLevelMin: 5,
				zoomLevelMax: 17
			});
			map.centerAndZoom(
				options.center || new BMap.Point(defaults.lng.baidu, defaults.lat.baidu),
				options.zoom || defaults.zoom.baidu);
			map.enableScrollWheelZoom();
			map.enableKeyboard();
			map.addControl(new BMap.NavigationControl());
			map.addControl(new BMap.ScaleControl());
			map.addControl(new BMap.OverviewMapControl());
			map.addControl(new BMap.MapTypeControl({
				type: BMAP_MAPTYPE_CONTROL_HORIZONTAL,
				mapTypes: [BMAP_NORMAL_MAP, BMAP_SATELLITE_MAP, BMAP_HYBRID_MAP]
			}))
		} else {
			var opts = {
				zoom: options.zoom || defaults.zoom.google,
				scaleControl: true,
				center: options.center || new google.maps.LatLng(defaults.lat.google, defaults.lng.google),
				mapTypeId: google.maps.MapTypeId.ROADMAP,
				mapTypeControlOptions: {
					mapTypeIds: [google.maps.MapTypeId.ROADMAP, google.maps.MapTypeId.SATELLITE]
				}
			};
			if (lang == "cn") {
				opts.mapTypeId = google.maps.MapTypeId.ROADMAP;
				map = new google.maps.Map(node, opts)
			} else {
				map = new google.maps.Map(node, opts)
			}
			if (typeof overlay === "undefined") {
				overlay = new google.maps.OverlayView();
				overlay.draw = function() {};
				overlay.setMap(map)
			} else {
				if (sandbox) {
					var ol = new google.maps.OverlayView();
					ol.draw = function() {};
					ol.setMap(map);
					sandbox.overlay = ol
				}
			}
		}
		this._source = map;
	}
	Map.prototype.getMap = function() {
		return this._source
	};
	Map.prototype.getDiv = function() {
		return this._source.getDiv ? this._source.getDiv() : this._source.getContainer()
	};
	Map.prototype.setZoom = function(m) {
		this._source.setZoom(m)
	};
	Map.prototype.getZoom = function() {
		return this._source.getZoom()
	};
	Map.prototype.panBy = function(x, y) {
		this._source.panBy(x, y)
	};
	Map.prototype.addOverlay = function(o) {
		this._source.addOverlay(o)
	};
	Map.prototype.getMapTypeId = function() {
		return this._source.getMapTypeId ? this._source.getMapTypeId() : this._source.getMapType()
	};
	Map.prototype.getBounds = function() {
		return new goome.maps.LatLngBounds(this._source.getBounds())
	};
	Map.prototype.getCenter = function() {
		return new goome.maps.LatLng(this._source.getCenter())
	};
	Map.prototype.setCenter = function(latlng) {
		this._source.setCenter(latlng._source || latlng)
	};
	Map.prototype.panTo = function(latlng) {
		this._source.panTo(latlng._source || latlng)
	};
	Map.prototype.panTo = function(latlng) {
		this._source.panTo(latlng._source || latlng)
	};
	Map.prototype.fromLatLngToDivPixel = function(latlng) {
		if (this._source.pointToOverlayPixel) {
			return new goome.maps.Point(this._source.pointToOverlayPixel(latlng._source || latlng))
		} else {
			return new goome.maps.Point(overlay.getProjection().fromLatLngToDivPixel(latlng._source || latlng))
		}
	};

	function LatLng(lat, lng) {
		if (arguments.length !== 1) {
			var k = objectMapping.LatLng[mapperKey];
			this._source = isBMap ? (new tempMaps[k](lng, lat)) : (new tempMaps[k](lat, lng))
		} else {
			this._source = lat
		}
	}
	LatLng.prototype.equals = function(latlng) {
		return this._source.equals(latlng._source || latlng)
	};
	LatLng.prototype.lat = function() {
		return (typeof this._source.lat === "function") ? this._source.lat() : this._source.lat
	};
	LatLng.prototype.lng = function() {
		return (typeof this._source.lng === "function") ? this._source.lng() : this._source.lng
	};

	function Size(w, h) {
		if (arguments.length === 1) {
			this._source = w
		} else {
			this._source = new tempMaps[objectMapping.Size[mapperKey]](w, h)
		}
		this.width = this._source.width;
		this.height = this._source.height
	}
	Size.prototype.equals = function(size) {
		return this._source.equals(size._source || size)
	};

	function LatLngBounds(sw, ne) {
		if (arguments.length === 1) {
			this._source = sw
		} else {
			this._source = new tempMaps[objectMapping.LatLngBounds[mapperKey]](sw._source, ne._source)
		}
	}
	LatLngBounds.prototype.contains = function(latlng) {
		if (this._source.contains) {
			return this._source.contains(latlng._source || latlng)
		} else {
			if (this._source.containsPoint) {
				return this._source.containsPoint(latlng._source || latlng)
			}
		}
	};
	LatLngBounds.prototype.getCenter = function() {
		return new goome.maps.LatLng(this._source.getCenter())
	};
	LatLngBounds.prototype.getNorthEast = function() {
		return new goome.maps.LatLng(this._source.getNorthEast())
	};
	LatLngBounds.prototype.getSouthWest = function() {
		return new goome.maps.LatLng(this._source.getSouthWest())
	};

	function Point(x, y) {
		if (arguments.length === 2) {
			this._source = new tempMaps[objectMapping.Point[mapperKey]](x, y)
		} else {
			this._source = x
		}
		this.x = this._source.x;
		this.y = this._source.y
	}
	Point.prototype.equals = function(point) {
		if (point._source) {
			return this._source.equals(point.source)
		} else {
			return this._source.equals(point)
		}
	};

	function Circle(opts) {
		if (opts && opts.getMap) {
			this._source = opts;
			return
		}
		if (!opts.radius || !opts.center) {
			throw Error("Circle:required options property missed!")
		}
		opts.center = opts.center._source || opts.center;
		var circle;
		if (isBMap) {
			circle = new tempMaps[objectMapping.Circle[mapperKey]](opts.center, opts.radius, opts)
		} else {
			circle = new tempMaps[objectMapping.Circle[mapperKey]](opts)
		} if (opts.map) {
			opts.map = opts.map._source || opts.map;
			if (opts.map.addOverlay) {
				opts.map.addOverlay(circle)
			}
		}
		this._source = circle
	}
	Circle.prototype.getBounds = function() {
		return new goome.maps.LatLngBounds(this._source.getBounds())
	};
	Circle.prototype.getCenter = function() {
		return new goome.maps.LatLng(this._source.getCenter())
	};
	Circle.prototype.setCenter = function(latlng) {
		this._source.setCenter(latlng._source || latlng)
	};
	Circle.prototype.getRadius = function() {
		return this._source.getRadius()
	};
	Circle.prototype.setRadius = function(radius) {
		this._source.setRadius(radius)
	};
	Circle.prototype.setOptions = function(opts) {
		var props = {
			strokeColor: "StrokeColor",
			strokeOpacity: "StrokeOpacity",
			strokeWeight: "StrokeWeight",
			fillColor: "FillColor",
			fillOpacity: "FillOpacity"
		};
		if (this._source.setOptions) {
			this._source.setOptions(opts)
		} else {
			for (var key in opts) {
				if (props.hasOwnProperty(key)) {
					this._source["set" + props[key]](opts[key])
				}
			}
		}
	};

	function Polyline(opts) {
		if (opts && opts.setMap) {
			this._source = opts;
			return
		}
		if (!opts.path) {
			opts.path = []
		}
		var apiPath = [],
			polyline;
		for (var index in opts.path) {
			var item = opts.path[index];
			apiPath.push(item._source || item)
		}
		opts.path = apiPath;
		if (isBMap) {
			polyline = new tempMaps[objectMapping.Polyline[mapperKey]](opts.path, opts)
		} else {
			if (opts.map && opts.map._source) {
				opts.map = opts.map._source
			}
			polyline = new tempMaps[objectMapping.Polyline[mapperKey]](opts)
		} if (opts.map) {
			var m = opts.map._source || opts.map;
			if (m.addOverlay) {
				m.addOverlay(polyline)
			}
		}
		this._source = polyline
	}
	Polyline.prototype.setOptions = function(opts) {
		var props = {
			strokeColor: "StrokeColor",
			strokeOpacity: "StrokeOpacity",
			strokeWeight: "StrokeWeight",
			path: "path"
		};
		if (this._source.setOptions) {
			this._source.setOptions(opts)
		} else {
			for (var key in opts) {
				if (props.hasOwnProperty(key)) {
					this._source["set" + props[key]](opts[key])
				}
			}
		}
	};
	Polyline.prototype.getPath = function() {
		if (this._source.setOptions) {
			var arr = [],
				gRet = this._source.getPath(),
				len = gRet.getLength(),
				i = 0;
			for (; i < len; i++) {
				arr.push(new goome.maps.LatLng(gRet.getAt(i)))
			}
			return arr
		}
		var ret = [];
		var result = this._source.getPath();
		for (var index in result) {
			ret.push(new goome.maps.LatLng(result[index]))
		}
		return ret
	};
	Polyline.prototype.setPath = function(latlngs) {
		if (latlngs.length < 1) {
			return
		}
		if (latlngs[0]._source) {
			var origin = [];
			for (var index in latlngs) {
				origin.push(latlngs[index]._source)
			}
			this._source.setPath(origin)
		} else {
			this._source.setPath(latlngs)
		}
	};
	Polyline.prototype.addPath = function(latlng, map) {
		var path = this._source.getPath();
		path.push(latlng && latlng._source);
		if (isBMap) {
			this._source.setPath(path);
			(map && map._source || this._source.getMap()).addOverlay(this._source)
		}
	};
	Polyline.prototype.clear = function() {
		if (isBMap) {
			var map = this._source.getMap();
			if (!map) {
				return
			}
			this._source.setPath([]);
			map.addOverlay(this._source)
		} else {
			var path = this._source.getPath();
			while (path.length) {
				path.removeAt(0)
			}
		}
	};

	function Marker(opts, size, anchor) {
		if (typeof opts === "object" && opts.getMap) {
			this._source = opts;
			return
		}
		if (!opts.position) {
			throw Error("Marker:required options property missed!")
		}
		var position = opts.position._source || opts.position,
			marker;
		if (isBMap) {
			if (opts.icon) {
				var param;
				if (anchor && anchor.width && anchor.height) {
					param = {
						anchor: new BMap.Size(anchor.width, anchor.height)
					}
				}
				if (size && size.width && size.height) {
					opts.icon = new BMap.Icon(opts.icon, new BMap.Size(size.width, size.height), param)
				} else {
					throw Error("Marker:parameter size with props width and height missed")
				}
			}
			marker = new tempMaps[objectMapping.Marker[mapperKey]](position, opts);
			if (opts.map) {
				var map = opts.map._source || opts.map;
				map.addOverlay(marker)
			}
		} else {
			opts.position = position;
			if (opts.map) {
				opts.map = opts.map._source || opts.map
			}
			marker = new tempMaps[objectMapping.Marker[mapperKey]](opts)
		}
		this._source = marker
	}
	Marker.prototype.getPosition = function() {
		return new goome.maps.LatLng(this._source.getPosition())
	};
	Marker.prototype.setPosition = function(latlng) {
		this._source.setPosition(latlng._source || latlng)
	};
	Marker.prototype.getPosition = function() {
		return new goome.maps.LatLng(this._source.getPosition())
	};
	Marker.prototype.setTitle = function(title) {
		this._source.setTitle(title)
	};
	Marker.prototype.getTitle = function() {
		return this._source.getTitle()
	};
	Marker.prototype.setIcon = function(url, size) {
		if (isBMap && arguments.length != 2) {
			throw Error("Marker:parameter size:{width,height} for baidu map is missed")
		}
		if (this._source.setOptions) {
			this._source.setIcon(url)
		} else {
			if (size && size.width && size.height) {
				this._source.setIcon(new BMap.Icon(url, new BMap.Size(size.width, size.height)))
			} else {
				throw Error("Marker:required parameter size:property -width and height}")
			}
		}
	};
	Marker.prototype.getIcon = function() {
		var icon = this._source.getIcon();
		return typeof icon === "string" ? icon : icon.imageUrl
	};
	Marker.prototype.setDraggable = function(flag) {
		if (this._source.setDraggable) {
			this._source.setDraggable(flag)
		} else {
			if (this._source.enableDragging) {
				flag ? this._source.enableDragging() : this._source.disableDragging()
			}
		}
	};
	Marker.prototype.setVisible = function(flag) {
		if (this._source.setVisible) {
			this._source.setVisible(flag)
		} else {
			if (this._source.show) {
				flag ? this._source.show() : this._source.hide()
			}
		}
	};
	Marker.prototype.setZIndex = function(index) {
		this._source.setZIndex(index)
	};
	Marker.prototype.setOptions = function(opts) {
		if (this._source.setOptions) {
			this._source.setOptions(opts)
		} else {
			throw Error("Marker:not supported method - setOptions,use setter method directly")
		}
	};

	function InfoWindow(opts) {
		if (opts && opts.setContent) {
			this._source = opts;
			return
		}
		if (!opts.hasOwnProperty("content")) {
			throw Error("InfoWindow:options required property missed!")
		}
		if (isBMap) {
			this._source = new tempMaps[objectMapping.InfoWindow[mapperKey]](opts.content, opts)
		} else {
			this._source = new tempMaps[objectMapping.InfoWindow[mapperKey]](opts)
		}
	}
	InfoWindow.prototype.open = function(map, marker) {
		marker = marker._source || marker;
		map = map._source || map;
		if (this._source.open) {
			this._source.open(map, marker)
		} else {
			if (marker.openInfoWindow) {
				marker.openInfoWindow(this._source)
			}
		}
	};
	InfoWindow.prototype.close = function() {
		if (this._source.close) {
			this._source.close()
		} else {
			if (this._source.hide) {
				this._source.hide()
			}
		}
	};
	InfoWindow.prototype.getContent = function() {
		this._source.getContent()
	};
	InfoWindow.prototype.getPosition = function() {
		return new goome.maps.LatLng(this._source.getPosition())
	};
	InfoWindow.prototype.setContent = function(node) {
		this._source.setContent(node)
	};
	InfoWindow.prototype.setZIndex = function(index) {
		this._source.setZIndex(index)
	};
	InfoWindow.prototype.setPosition = function(latlng) {
		this._source.setPosition(latlng._source || latlng)
	};
	InfoWindow.prototype.setOptions = function(opts) {
		if (this._source.setOptions) {
			this._source.setOptions(opts)
		} else {
			throw Error("InfoWindow:not supported method - setOptions,use setter method directly")
		}
	}
})(window);