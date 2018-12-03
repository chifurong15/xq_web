(function(window, angular) {
	'use strict';

	var app = angular.module("app");
		app.filter("trustHtml",function($sce){
		   return function (input){
		       return $sce.trustAsHtml(input); 
		   } 
		})
		app.controller(
			'drainageDetailCtrl', [
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
                'BasinManagerService',
                'UtilityTool',
				function drainageDetailCtrl($localStorage, $scope, $location, $log, $q, $rootScope, globalParam, $window, routeService, $http,
                                            wish, esriApiDeps, tiandituFactory, MapTool, MapUtil, SymbolUtil, GeometryUtil, BasinManagerService, UtilityTool) {

					/*流域名称*/
					$scope.drainageName = $localStorage.drainageDetailData.data.basinName;
					/*流域编码*/
//					$scope.drainageCode = $localStorage.drainageDetailData.data.basinCode;
					/*流域概述*/
					$scope.drainageOverview = $localStorage.drainageDetailData.data.overView;
					/*流域备注*/
					$scope.drainageRemark = $localStorage.drainageDetailData.data.remark;
					/*流域经度*/
					$scope.drainageLongitude = $localStorage.drainageDetailData.data.longitude;
					/*流域纬度*/
					$scope.drainageLatitude = $localStorage.drainageDetailData.data.latitude;
					/*流域面积*/
					$scope.drainageAcreage = $localStorage.drainageDetailData.data.acreage;
					/*流域经纬度集合*/
					$scope.drainageLinePoints = $localStorage.drainageDetailData.data.linePoints;
					/*流域wkt坐标*/
                    $scope.drainageSpatialData = $localStorage.drainageDetailData.data.spatialData;
					
                    /*返回按钮*/ 
					$scope.back = function() {
						routeService.route(103, true);
					}

                    var promise = esriApiDeps.query();
                    var w = wish.get();

                    $scope.init = function(){
                        loadGisModuls();
                    };

                    //地图对象
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
                            BasinManagerService.init($scope.map, "basinLayer");
                            MapTool.init($scope.map);

                            addMarker();
                        } else {
                            console.error('error： $scope.map 未定义')
                        }
                    }

                    function addMarker() {
                        var coords;
                        var spatialData = $scope.drainageSpatialData;
                        var linePoints = $scope.drainageLinePoints;
                        //coords = "MULTIPOLYGON(((93.92349243164062 41.334922313690186,119.76333618164062 41.686484813690186,127.84927368164062 24.284141063690186,93.74771118164062 17.077109813690186,78.98208618164062 35.006797313690186,93.92349243164062 41.334922313690186)),((91.98989868164062 37.643516063690186,111.32583618164062 37.291953563690186,109.74380493164062 32.370078563690186,88.47427368164062 32.721641063690186,91.98989868164062 37.643516063690186)))";

                        if(spatialData !== null && spatialData.length > 0 && spatialData.substring(0, 12) === "MULTIPOLYGON"){
                            BasinManagerService.addPolygonByWkt(spatialData);
                            return;
                        }else if(linePoints !== null && linePoints !== "" && linePoints.indexOf(";") !== -1 && linePoints.indexOf(",") !== -1){
                            BasinManagerService.addPolygonByCoords(linePoints);
                            return;
                        }else {
                            console.warn("坐标为空");
                            layer.msg('坐标为空！绘制失败...',{time:2000});
                        }
                    }




				}
			]);
})(window, angular);