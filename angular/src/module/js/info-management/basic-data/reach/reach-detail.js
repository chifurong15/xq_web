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
                var initExtent;
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

                    //测试用
                    // spatialData = "MULTIPOLYGON(((93.92349243164062 41.334922313690186,119.76333618164062 41.686484813690186,127.84927368164062 24.284141063690186,93.74771118164062 17.077109813690186,78.98208618164062 35.006797313690186,93.92349243164062 41.334922313690186)),((91.98989868164062 37.643516063690186,111.32583618164062 37.291953563690186,109.74380493164062 32.370078563690186,88.47427368164062 32.721641063690186,91.98989868164062 37.643516063690186)))";
                    if(spatialData !== null && spatialData.length > 0 && spatialData.substring(0, 12) === "MULTIPOLYGON"){
                        ReachLakeManagerService.addPolygonByWkt(spatialData);
                        return;
                    }else if(linePoints !== null && linePoints !== "" && linePoints.indexOf(";") !== -1 && linePoints.indexOf(",") !== -1){
                        ReachLakeManagerService.addPolygonByCoords(linePoints);
                        return;
                    }else {
                        console.warn("坐标为空");
                        layer.msg('坐标为空！绘制失败...',{time:2000});
                    }
                }

                $scope.sort=$localStorage.reachDetailData.data.classify;
                console.log($scope.sort);
                $scope._codeText=$localStorage.reachDetailData.data.displayReachCode;
                console.log($scope._codeText);
                console.log($scope._codeText);
                //河湖库编码展示
                $('#codeView').on('mouseover', function(){
                    var that = this;
                    layer.tips($scope._codeText,that, {
                        tips: [1, '#58666e']
//							  time: 2000
                    });
                });
                if($scope.sort === 'A'){
                    $scope.riverBox = true;
                    $scope.val='河段';
                    console.log('Hello'+$scope.sort);
                    $scope.reachFName = $localStorage.reachDetailData.data.reachName;
                    $scope.alias = $localStorage.reachDetailData.data.alias;
                    $scope.water_quality = $localStorage.reachDetailData.data.waterGradeName;
                    $scope.deposit_status = $localStorage.reachDetailData.data.siltyName;
                    $scope.river_part = $localStorage.reachDetailData.data.greadName;
                    $scope.river_shore = $localStorage.reachDetailData.data.shoreName;
                    $scope.region = $localStorage.reachDetailData.data.regionName;
                    $scope.river_ztree = $localStorage.reachDetailData.data.pName;
                    $scope.res_Change_value = $localStorage.reachDetailData.data.greadName;
                    $scope.startPoint = $localStorage.reachDetailData.data.startPoint;
                    $scope.endPoint = $localStorage.reachDetailData.data.endPoint;
                    $scope.whether_mountain = $localStorage.reachDetailData.data.whetherName;
                    $scope.whether_virtual = $localStorage.reachDetailData.data.isVirtualName;
                    $scope.length = $localStorage.reachDetailData.data.length;
                    $scope.width = $localStorage.reachDetailData.data.width;
                    $scope.throughArea = $localStorage.reachDetailData.data.throughArea;
                    $scope.overView = $localStorage.reachDetailData.data.overView;
//                          CKEDITOR.instances.editor.setData($scope.overView);
                    $scope.reachCode = $localStorage.reachDetailData.data.reachCode;
                    console.log($scope.reachCode);

                }else if($scope.sort === 'B'){
                    $scope.lakesBox = true;
                    $scope.val='湖段';
                    console.log('Hello'+$scope.sort);
                    $scope.reachFName = $localStorage.reachDetailData.data.reachName;
                    $scope.alias = $localStorage.reachDetailData.data.alias;
                    $scope.water_quality = $localStorage.reachDetailData.data.waterGradeName;
                    $scope.deposit_status = $localStorage.reachDetailData.data.siltyName;
                    $scope.river_part = $localStorage.reachDetailData.data.greadName;
                    $scope.lakes_shore = $localStorage.reachDetailData.data.shoreName;
                    $scope.region = $localStorage.reachDetailData.data.regionName;
                    $scope.lakes_ztree = $localStorage.reachDetailData.data.pName;
                    $scope.res_Change_value = $localStorage.reachDetailData.data.greadName;
                    $scope.startPoint = $localStorage.reachDetailData.data.startPoint;
                    $scope.endPoint = $localStorage.reachDetailData.data.endPoint;
                    $scope.whether_mountain = $localStorage.reachDetailData.data.whetherName;
                    $scope.whether_virtual = $localStorage.reachDetailData.data.isVirtualName;
                    $scope.length = $localStorage.reachDetailData.data.length;
                    $scope.width = $localStorage.reachDetailData.data.width;
                    $scope.throughArea = $localStorage.reachDetailData.data.throughArea;
                    $scope.overView = $localStorage.reachDetailData.data.overView;
                    CKEDITOR.instances.editor.setData($scope.overView);
                    $scope.reachCode = $localStorage.reachDetailData.data.reachCode;
                    console.log($scope.reachCode);
                }else if($scope.sort === 'C'){
                    $scope.reservoirBox = true;
                    $scope.val='库段';
                    console.log('Hello'+$scope.sort);
                    $scope.reachFName = $localStorage.reachDetailData.data.reachName;
                    $scope.alias = $localStorage.reachDetailData.data.alias;
                    $scope.water_quality = $localStorage.reachDetailData.data.waterGradeName;
                    $scope.deposit_status = $localStorage.reachDetailData.data.siltyName;
                    $scope.river_part = $localStorage.reachDetailData.data.greadName;
                    $scope.reservoir_shore = $localStorage.reachDetailData.data.shoreName;
                    $scope.region = $localStorage.reachDetailData.data.regionName;
                    $scope.reservoir_ztree = $localStorage.reachDetailData.data.pName;
                    $scope.res_Change_value = $localStorage.reachDetailData.data.greadName;
                    $scope.startPoint = $localStorage.reachDetailData.data.startPoint;
                    $scope.endPoint = $localStorage.reachDetailData.data.endPoint;
                    $scope.whether_mountain = $localStorage.reachDetailData.data.whetherName;
                    $scope.whether_virtual = $localStorage.reachDetailData.data.isVirtualName;
                    $scope.length = $localStorage.reachDetailData.data.length;
                    $scope.width = $localStorage.reachDetailData.data.width;
                    $scope.throughArea = $localStorage.reachDetailData.data.throughArea;
                    $scope.overView = $localStorage.reachDetailData.data.overView;
                    CKEDITOR.instances.editor.setData($scope.overView);
                    $scope.reachCode = $localStorage.reachDetailData.data.reachCode;
                    console.log($scope.reachCode);
                }else{}


                $scope.back = function() {
                    // 跳转到菜单页面
                    routeService.route(12, true);
                }

            } ]);

})(window, angular);