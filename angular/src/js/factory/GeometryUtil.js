/**
 * @description:  图形类
 * @author: hsf
 * @date: 2018-8-31 13:37
 */
angular.module('app')
    .factory('GeometryUtil', ['wish', function(wish){
        var that = this;
        var _w = wish.get();
        var _map = null;
        //var _sr = null;

        var _init = function(map){
            this._map = map;
            //this._sr = this._map.SpatialReference;
        };
        //返回点对象
        var _getPoint = function(x, y){
            var point = new w.Point(x, y, new _w.SpatialReference({wkid: 4326}));
            return point;
        };
        //返回线对象
        var _getPolyline = function() {
            var line = new _w.Polyline(new _w.SpatialReference({wkid: 4326}));
            return line;
        };
        //返回多边形
        var _getPolygon = function() {
            var polygon = new w.Polygon(new _w.SpatialReference({wkid: 4326}));
            return polygon;
        };
        //矩形范围
        var _getExtent = function(xmin, ymin, xmax, ymax) {
            var extent = new w.Extent(xmin, ymin, xmax, ymax,
                new w.SpatialReference({wkid: 4326}));

            return extent;
        };

        return {
            init: _init,
            getPoint: _getPoint,
            getPolyline: _getPolyline,
            getPolygon: _getPolygon,
            getExtent: _getExtent
        };
    }]);