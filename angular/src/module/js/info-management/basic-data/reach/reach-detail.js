(function(window, angular) {
    'use strict';
    var app = angular.module("app");
    app.filter("trustHtml",function($sce){
        return function (input){
            return $sce.trustAsHtml(input);
        }
    })
    app.controller(
        'imReachDetail',
        [
            '$localStorage',
            '$scope',
            '$location',
            '$log',
            '$q',
            '$rootScope',
            'globalParam',
            '$window',
            'routeService',
            '$http',
            'wish',
            'esriApiDeps',
            'tiandituFactory',
            'MapTool',
            'MapUtil',
            'SymbolUtil',
            'GeometryUtil',
            'ReachLakeManagerService',
            function imReachDetail($localStorage, $scope, $location, $log,$q, $rootScope,globalParam, $window, routeService, $http,
                                   wish, esriApiDeps, tiandituFactory, MapTool, MapUtil, SymbolUtil, GeometryUtil, ReachLakeManagerService) {

                var promise = esriApiDeps.query();
                var w = wish.get();

                $scope.init = function(){
                    loadGisModuls();
                }

                //地图初始化
                var initExtent = new w.Extent(49.670562744140625, -2.7861714363098145, 155.13931274414062, 67.52632856369019);
                $scope.map = new w.Map('mapContainer', {
                    extent: initExtent,
                    fadeOnZoom: true
                });
                //加载天地图
                tiandituFactory.initTianditu($scope.map);

                //加载GIS模块
                function loadGisModuls() {
                    if (typeof $scope.map !== 'undefined') {
                        MapUtil.init($scope.map);
                        SymbolUtil.init($scope.map);
                        GeometryUtil.init($scope.map);
                        ReachLakeManagerService.init($scope.map, "reachManagerLayer");
                        MapTool.init($scope.map);

                        addMarker();
                    } else {
                        console.error('error： $scope.map 未定义')
                    }
                }

                function addMarker() {
                    var spatialData = $scope.reachSpatialData;
                    var linePoints = $scope.reachLinePoints;

                }

                $scope.reachDetailData = $localStorage.reachDetailData;
                $scope.classify = $localStorage.reachDetailData.classify;
                $scope._codeText = $localStorage.reachDetailData.displayReachCode;
                // CKEDITOR.instances.editor.setData($scope.overView);
                //河湖库编码展示
                $('#codeView').on('mouseover', function(){
                    var that = this;
                    layer.tips($scope._codeText,that, {
                        tips: [1, '#58666e']
//							  time: 2000
                    });
                });

                $scope.back = function() {
                    // 跳转到菜单页面
                    routeService.route(12, true);
                }

            } ]);

})(window, angular);