/**
 * @description:  地图公共类
 * @author: huangshuifa
 * @date: 2018-5-25 19:15
 */
angular.module('app')
    .factory('MapUtil',['wish', function(wish){
        var _w = wish.get();
        var _map = null;
        //var _defaults = null;
        var that = this;

        var _init = function(map, options){
            this._map = map;
            // if(typeof options === "undefined"){
            //     _defaults = { //天津市
            //         "longitude": 117.19203455803067,
            //         "latitude": 39.08350838137276,
            //         "regionlevel": 2
            //     };
            //     this.center2LongLat(_defaults.longitude, _defaults.latitude, _defaults.regionlevel)
            // }else {
            //     this.center2LongLat(options.longitude, options.latitude, options.regionlevel)
            // }
        };
        var _addLayer = function(layer, index){
            this._map.addLayer(layer, index);
        };
        /**
         * 定位到点
         * @param x
         * @param y
         */
        var _center2point = function(x, y){
            if(_isCoordValid(x, y)){
                var point  = new _w.Point(x, y, this._map.spatialReference);
                this._map.centerAt(point);
            }else{
                return;
            }
        };
        /**
         * 定位到指定点,缩放级别
         * @param point
         * @param regionLevel
         * @private
         */
        var _center2zoom = function(point, regionLevel){
            this._map.centerAndZoom(point, regionLevel * 2 + 4);
        };
        /**
         * 根据x,y定位
         * @param long
         * @param lat
         * @param regionLevel
         * @private
         */
        var _center2LongLat = function(long, lat, regionLevel){
            if(this.isCoordValid(long, lat)){
                var point  = new _w.Point(long, lat);
                if(regionLevel){
                    this.center2zoom(point, regionLevel);
                }else {
                    this.center2point(point);
                }

            }
        };

        var _centerToLevel = function(point, level){
            if(level){
                (this._map.getLevel() > level)?this._map.centerAt(point):this._map.centerAndZoom(point, level);
            }
        };

        /**
         * 判断点坐标是否有效
         * @param x
         * @param y
         * @returns {boolean}
         * @private
         */
        var _isCoordValid = function(x, y){
            if(x && y && !isNaN(x) && !isNaN(y) && Math.abs(x)<=180 && Math.abs(y)<=90 && (x!=0 && y!=0)){
                return true;
            } else {
                return false;
            }
        };

        return {
            init: _init,
            addLayer: _addLayer,
            center2point: _center2point,
            center2zoom: _center2zoom,
            center2LongLat: _center2LongLat,
            isCoordValid: _isCoordValid,
            centerToLevel:_centerToLevel
        }




    }]);
