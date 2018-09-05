/**
 * @description:  部件工具类
 * @author: HuangSF
 * @date: 2018-8-9 16:33
 */
angular.module('app')
    .factory('ComponentTool', ['wish','$rootScope', function(wish,$rootScope){
        var _w = wish.get();
        var _map = null;
        var that = this;

        var _init = function(map){
            this._map = map;
        };
        /**
         * 判断图层是否存在,存在则返回layer
         * @param layerId 图层id
         */
        var _isLayerExisted = function(layerId){
            return this._map.getLayer(layerId);
        };

        //重点污染详情
        _detailsInfo = function(id){
            console.log(id);
            $rootScope.$emit("evtId",id);
        };
        _detailsVideoWaterInfo = function(id){
            console.log(id);
            
        };
        _getJkMonitor = function(id){
            console.log(id);
        };

        return {
            init: _init,
            isLayerExisted: _isLayerExisted,
            detailsInfo: _detailsInfo,
            detailsVideoWaterInfo: _detailsVideoWaterInfo,
            getJkMonitor: _getJkMonitor

        }

}]);