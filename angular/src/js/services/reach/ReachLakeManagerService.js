/**
 * @description:  河湖库段类
 * @author: hsf
 * @date: 2018-9-11 17:52
 */
angular.module('app')
    .service('ReachLakeManagerService',
        ['$q', '$http', 'SymbolUtil','GeometryUtil', 'MapTool', 'wish', 'BasinManagerService',
            function($q, $http, SymbolUtil, GeometryUtil, MapTool, wish, BasinManagerService){
                var child = Object.create(BasinManagerService);
                return child;
    }]);