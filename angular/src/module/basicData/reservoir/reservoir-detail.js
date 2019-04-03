(function(window, angular) {
	'use strict';

	var app = angular.module("app");
		app.filter("trustHtml",function($sce){
		   return function (input){
		       return $sce.trustAsHtml(input); 
		   } 
		})
		app.controller(
			'reservoirDetailCtrl', [
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
                // 'ReservoirManagerService',
                'OneMapMapInit',
				function reservoirDetailCtrl($localStorage, $scope,$location, $log, $q, $rootScope, globalParam,$window,routeService, $http,
											 wish, esriApiDeps, tiandituFactory, MapTool, MapUtil, SymbolUtil, GeometryUtil,OneMapMapInit) {

					//获取当前数据详情字段
					if(!$localStorage.reservoirDatailData){
                        layer.msg('获取数据失败,请重试')
                    }
                    $scope.reservoir = $localStorage.reservoirDatailData;

					// 返回按钮
					$scope.back = function() {
						routeService.route(107, true);
					}


                    var promise = esriApiDeps.query();
                    var w = wish.get();

                    $scope.init = function(){
                        //gis模块初始化
                        // loadGisModuls();
                    };

                    //地图对象

                    // $scope.map = new w.Map('mapContainer', {
                    //     fadeOnZoom: true
                    // });
                    // OneMapMapInit.initBasemap($scope.map);

                    //加载GIS模块
                    function loadGisModuls() {
                        if (typeof $scope.map !== 'undefined') {
                            MapTool.init($scope.map);
                            MapUtil.init($scope.map);
                            SymbolUtil.init($scope.map);
                            GeometryUtil.init($scope.map);
                            ReservoirManagerService.init($scope.map, "reservoirManagerLayer");

                            addMarker();
                        } else {
                            console.error('error： $scope.map 未定义')
                        }
                    }

                    function addMarker() {
                        var spatialData = $scope.reservoir.spatialData;
                        var linePoints = $scope.reservoir.linePoints;

                        //测试用
                        //spatialData = "MULTIPOLYGON(((93.92349243164062 41.334922313690186,119.76333618164062 41.686484813690186,127.84927368164062 24.284141063690186,93.74771118164062 17.077109813690186,78.98208618164062 35.006797313690186,93.92349243164062 41.334922313690186)),((91.98989868164062 37.643516063690186,111.32583618164062 37.291953563690186,109.74380493164062 32.370078563690186,88.47427368164062 32.721641063690186,91.98989868164062 37.643516063690186)))";
                        if(spatialData !== null && spatialData.length > 0 && spatialData.substring(0, 12) === "MULTIPOLYGON"){
                            ReservoirManagerService.addPolygonByWkt(spatialData);
                            return;
                        }else if(linePoints !== null && linePoints !== "" && linePoints.indexOf(";") !== -1 && linePoints.indexOf(",") !== -1){
                            ReservoirManagerService.addPolygonByCoords(linePoints);
                            return;
                        }else {
                            console.warn("坐标为空");
                            // layer.msg('坐标为空！绘制失败');
                        }
                    }


				}
			]);
})(window, angular);