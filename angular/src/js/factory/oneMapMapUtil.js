/**
 * @description:  地图公共类
 * @author: huangshuifa
 * @date: 2018-5-25 19:15
 */
angular.module('app')
    .factory('OneMapMapUtil',['wish','OneMapMinScaleType','$localStorage', function(wish,OneMapMinScaleType,$localStorage){
        var _w = wish.get();
        var _map = null;
        var that = this;


        this.regionLevel1MinScale = OneMapMinScaleType.Scale7;
        this.regionLevel2MinScale = OneMapMinScaleType.Scale9;
        this.regionLevel3MinScale = OneMapMinScaleType.Scale11;
        this.regionLevel4MinScale = OneMapMinScaleType.Scale13;

        var _init = function(map){
            this._map = map;
        };
        var _addLayer = function(layer, index){
            this._map.addLayer(layer, index);
        };
        /**
         * 定位[x,y]到指定点
         * @param point
         * @param regionLevel
         * @private
         */
        var _center2zooUsingLevel = function(point, regionLevel){

            switch (regionLevel)
            {
                case "1":
                case 1:
                    this._map.centerAndZoom(point,7);
                    break;
                case "2":
                case 2:
                    this._map.centerAndZoom(point,9);
                    break;
                case "3":
                case 3:
                    this._map.centerAndZoom(point,11);
                    break;
                case "4":
                case 4:
                    this._map.centerAndZoom(point,13);
                    break;
            }
        };
        /**
         * 定位到指定点,缩放级别
         * @param point
         * @param regionLevel
         * @private
         */
        var _center2zoom = function(point, regionLevel){
            if (regionLevel == 1){
                this._map.centerAndZoom(point, regionLevel * 2 + 4 );
            } else {
                this._map.centerAndZoom(point, regionLevel * 2 + 5 );
            }
            $localStorage.mapInitGrade = regionLevel * 2 + 5;
        };
        /**
         * 定位到点
         * @param x
         * @param y
         */
        var _center2point = function(x, y){
            if(_isCoordValid(x, y)){
                var point  = new esri.geometry.Point(x, y, this._map.spatialReference);
                this._map.centerAt(point);
            }else{
                return;
            }
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
                this.center2zoom(point, regionLevel);
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

        var _center2Extent = function (_Extent) {
            // var _Extent = new _w.Extent(
            //     109.62508432909704,
            //     26.028627444915656,
            //     122.25852387711964,
            //     29.779179810734867,
            //     new _w.SpatialReference({wkid:4326})
            // );
            this._map.centerAt(_Extent.getCenter());
            this._map.setExtent(_Extent);
        };



        return {
            init: _init,
            addLayer: _addLayer,
            center2point: _center2point,
            center2zoom: _center2zoom,
            center2LongLat: _center2LongLat,
            isCoordValid: _isCoordValid,
            centerToLevel:_centerToLevel,
            center2Extent:_center2Extent
        }




    }]);
