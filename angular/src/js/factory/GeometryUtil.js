/**
 * @description:  图形类
 * @author: hsf
 * @date: 2018-9-3 10:37
 */
angular.module('app')
    .factory('GeometryUtil', ['wish', function(wish){
        var _w = wish.get();
        var _map = null;
        var _sr = null;
        var _that = this;

        var _init = function(map){
            _map = map;
            _sr = map.spatialReference || new _w.SpatialReference(4326);
        };
        /**
         * 点对象
         * @param x
         * @param y
         * @returns {_w.Point}
         * @private
         */
        var _getPoint = function(x, y){
            var point = new _w.Point(x, y, _sr);
            return point;
        };
        /**
         * 根据坐标字符串, 生成点对象
         * @param xy => 格式：120.2,30.2
         * @returns {*}
         * @private
         */
        var _getPointByCoords = function(xy) {
            var pointArray = xy.split(",");
            if (pointArray.length > 1 && pointArray !== "") {
                return this.getPoint(pointArray[0]*1, pointArray[1]*1);
            }
            return null;
        };
        /**
         * 两点的中点坐标 => 格式：[x1,y1],[x2,y2]
         * @param point1
         * @param point2
         * @returns {Array}
         */
        var _getPointCenter = function (point1, point2) {
            var point = [];
            point[0] = (point1[0] + point2[0])/2;
            point[1] = (point1[1] + point2[1])/2;
            return point;
        };
        /**
         * 线对象
         * @returns {_w.Polyline}
         * @private
         */
        var _getPolyline = function() {
            var line = new _w.Polyline();
            return line;
        };
        /**
         * 根据坐标字符串生成polyline
         * @param coords
         * @returns {_w.Polyline}
         * @private
         */
        var _getPolylineByCoords = function (coords) {
            if (coords !== null && coords.length > 0) {
                var ring = this.coordsToRing(coords);
                var polyline = this.getPolyline().addPath(ring);

                return polyline;
            }

            return null;
        };
        /**
         * 获取线的中心点
         * @param polyline
         * @returns {*}
         * @private
         */
        var _getPolylineCenter = function (polyline) {
            if(polyline && polyline.paths[0].length >= 2){
                var len = polyline.paths[0].length;
                var centerPoint;
                if(len % 2 === 0){
                    centerPoint = this.getPointCenter(polyline.paths[0][(len/2)-1], polyline.paths[0][len/2]);
                }else {
                    centerPoint = [polyline.paths[0][(len-1)/2][0], polyline.paths[0][(len-1)/2][1]];
                }
            }

            return centerPoint;
        };
        /**
         * wkt格式获取线
         * @param wkt
         * @returns {_w.Polyline}
         * @private
         */
        var _getPolylineByMultiPolyline = function (wkt) {
            var primitive = Terraformer.WKT.parse(wkt);
            var geometry = new _w.Polyline();
            for (var i = 0; i < primitive.coordinates.length; i++) {
                geometry.addPath(primitive.coordinates[i]);
            }
            return geometry;
        };
        /**
         * 计算属性
         * @param geometry
         * @param geoType
         * @returns {null}
         * @private
         */
        var _calGeometryProperties = function (geometry, geoType) {
            var o = {};
            if(geoType !== "polygon"){
                var centerpoint =  geometry.getCentroid();
                var area = _w.geodesicUtils.geodesicAreas([geometry], _w.Units.SQUARE_KILOMETERS);
                o.centerpointX=centerpoint.x;
                o.centerpointY=centerpoint.y;
                o.area=area[0].toFixed(0); //页面表单验证只能取整数问题
                return o;
            }else if(geoType !== "polyline"){
                var centerpoint = this.getPolylineCenter(geometry);
                var lengths = _w.geodesicUtils.geodesicLengths([geometry], _w.Units.KILOMETERS);
                o.centerpointX = centerpoint[0];
                o.centerpointY = centerpoint[1];
                o.linelength = lengths[0].toFixed(4);
                return o;
            }

            return null;

        };
        /**
         * 拼接单线、多线wkt格式
         * @param geometry
         * @returns {{linepoints: string, spatialData: string}}
         * @private
         */
        var _createPolylineWktFormat = function (geometry) {
            var stringcoords = "";
            var stringWkt = "";
            var linepoints = "";
            var spatialData = "";
            if(geometry.paths.length === 1 && geometry.paths[0].length > 0){
                var len = geometry.paths[0].length;
                for(var i = 0;i < len;i++){
                    stringcoords +=  geometry.paths[0][i][0] + "," + geometry.paths[0][i][1] +";";
                    stringWkt += geometry.paths[0][i][0] + " " + geometry.paths[0][i][1] +",";
                }
                linepoints = stringcoords.substring(0, stringcoords.length-1);
                spatialData = "MULTILINESTRING((" + stringWkt.substring(0, stringWkt.length-1) + "))";
            }else {
                var len = geometry.paths.length;
                var wktArray = [];
                var wktStr;
                for(var i = 0;i < len;i++){
                    wktStr = "";
                    var len2 = geometry.paths[i].length;
                    for(var j = 0;j < len2;j++){
                        wktStr += geometry.paths[i][j][0] + " " + geometry.paths[i][j][1] +",";
                    }
                    wktArray.push("(" + wktStr.substring(0, wktStr.length-1) + ")");
                }

                var wktString2 = "";
                if(wktArray.length > 0){
                    for(var i=0;i<wktArray.length;i++) {
                        wktString2 += wktArray[i] + ",";
                    }
                    spatialData = "MULTILINESTRING(" + wktString2.substring(0, wktString2.length-1) + ")";
                }

            }
            var object = {
                linepoints: linepoints,
                spatialData: spatialData
            };

            return object;
        };
        /**
         * 拼接单面、多面wkt格式
         * @param polygon
         * @returns {{linepoints: string, spatialData: string}}
         * @private
         */
        var _createPolygonWktFormat = function (polygon) {
            var linepoints = "";
            var spatialData = "";
            var wktString = "";
            var wktStr = "";
            var stringcoords = "";
            if(polygon.rings.length === 1 && polygon.rings[0].length > 0){
                var len = polygon.rings[0].length;
                for(var i = 0;i < len;i++){
                    stringcoords +=  polygon.rings[0][i][0] + "," + polygon.rings[0][i][1] +";";
                    wktString += polygon.rings[0][i][0] + " " + polygon.rings[0][i][1] +",";
                }
                linepoints = stringcoords.substring(0, stringcoords.length-1);
                spatialData = "MULTIPOLYGON(((" + wktString.substring(0, wktString.length-1) + ")))";
            }else {
                var len = polygon.rings.length;
                var wkt = [];
                for(var i = 0;i < len;i++){
                    wktStr = "";
                    var len2 = polygon.rings[i].length;
                    for(var j = 0;j < len2;j++){
                        wktStr += polygon.rings[i][j][0] + " " + polygon.rings[i][j][1] +",";
                    }
                    var data = wktStr.substring(0, wktStr.length-1);
                    wkt.push("((" + data + "))");
                }

                linepoints = "";
                var wktString2 = "";
                if(wkt.length > 1){
                    for(var i=0;i<wkt.length;i++) {
                        wktString2 += wkt[i] + ",";
                    }
                    spatialData = "MULTIPOLYGON(" + wktString2.substring(0, wktString2.length-1) + ")";
                }
            }

            var object = {
                linepoints: linepoints,
                spatialData: spatialData
            };

            return object;
        };

        /**
         * 多边形
         * @returns {_w.Polygon}
         * @private
         */
        var _getPolygon = function() {
            var polygon = new _w.Polygon();
            return polygon;
        };
        /**
         * 根据坐标字符串生成polygon
         * @param coords  => 格式：120.2,30.2;122.5;32.5;
         * @returns {_w.Polygon}
         * @private
         */
        var _getPolygonByCoords = function(coords){
            if (coords !== null && coords.length > 0) {
                var ring = this.coordsToRing(coords);
                var polygon = this.getPolygon();
                polygon.addRing(ring);

                return polygon;
            }

            return null;
        };
        /**
         * wkt格式获取面
         * @param wkt
         * @returns {_w.Polygon}
         * @private
         */
        var _getPolygonByMultiPolygon = function (wkt) {
            var primitive = Terraformer.WKT.parse(wkt);
            var polygon = new _w.Polygon();
            if (primitive.coordinates.length === 1) {
                for (var i = 0; i < primitive.coordinates[0].length; i++) {
                    polygon.addRing(primitive.coordinates[0][i]); //正常的、有空心的面是这个格式
                }
            }else {
                for (var i = 0; i < primitive.coordinates.length; i++) {
                    polygon.addRing(primitive.coordinates[i][0]);  //union、merge是这个格式
                }
            }

            return polygon;
        };
        /**
         * 将坐标串转为ring数组
         * @param coords
         * @returns {Array}
         * @private
         */
        var _coordsToRing = function(coords) {
            var ring = [];
            var arr = coords.split(";");
            for (var i = 0; i < arr.length; i++) {
                if(arr[i] !== ""){
                    ring[i] = this.getPointByCoords(arr[i]);
                }
            }

            return ring;
        };
        /**
         * 矩形范围
         * @param xmin
         * @param ymin
         * @param xmax
         * @param ymax
         * @returns {_w.Extent}
         * @private
         */
        var _getExtent = function(xmin, ymin, xmax, ymax) {
            var extent = new _w.Extent(xmin, ymin, xmax, ymax,
                _sr);

            return extent;
        };

        return {
            init: _init,
            getPoint: _getPoint,
            getPointByCoords: _getPointByCoords,
            getPointCenter: _getPointCenter,
            getPolyline: _getPolyline,
            getPolylineByCoords: _getPolylineByCoords,
            getPolylineCenter: _getPolylineCenter,
            getPolylineByMultiPolyline: _getPolylineByMultiPolyline,
            calGeometryProperties: _calGeometryProperties,
            createPolylineWktFormat: _createPolylineWktFormat,
            createPolygonWktFormat: _createPolygonWktFormat,
            getPolygon: _getPolygon,
            getPolygonByCoords: _getPolygonByCoords,
            getPolygonByMultiPolygon: _getPolygonByMultiPolygon,
            coordsToRing: _coordsToRing,
            getExtent: _getExtent
        }
    }]);