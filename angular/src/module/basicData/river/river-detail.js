(function(window, angular) {
	'use strict';

	var app = angular.module("app");
		app.filter("trustHtml",function($sce){
		   return function (input){
		       return $sce.trustAsHtml(input); 
		   } 
		})
		app.controller(
					'imRiverDetail',
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
                        	// 'RiverManagerService',
                            'OneMapMapInit',
							function imRiverDetail($localStorage, $scope, $location, $log, $q, $rootScope, globalParam,$window, routeService, $http,
												   wish, esriApiDeps, tiandituFactory, MapTool, MapUtil, SymbolUtil, GeometryUtil, OneMapMapInit) {
								//获取当前数据详情字段
								if(!$localStorage.riverDetailData){
                                    layer.msg('获取数据失败,请重试')
                                }
                                $scope.river = $localStorage.riverDetailData;
								// 返回按钮
								$scope.back = function() {
									routeService.route(105, true);
								}


                                var promise = esriApiDeps.query();
                                var w = wish.get();

                                $scope.init = function(){
                                   
                                    // loadGisModuls();
                                };

                                /**
                                 *  地图初始化
                                 *  @author: hsf
                                 *  @time: 2018-09-06 9:05
                                 */
                                // $scope.map = new w.Map('mapContainer', {
                                //     fadeOnZoom: true
                                // });
                                // OneMapMapInit.initBasemap($scope.map);

                                //加载GIS模块
                                function loadGisModuls() {
                                    if (typeof $scope.map !== 'undefined') {
                                        MapUtil.init($scope.map);
                                        SymbolUtil.init($scope.map);
                                        GeometryUtil.init($scope.map);
                                        RiverManagerService.init($scope.map, "riverLayer");
                                        MapTool.init($scope.map);

                                        addMarker();
                                    } else {
                                        console.error('error： $scope.map 未定义')
                                    }
                                }

                                function addMarker() {
                                    var coords;
                                    var spatialData = $scope.river.spatialData;
                                    var linePoints = $scope.river.linePoints;
                                    if(spatialData !== null && spatialData.length > 0 && spatialData.substring(0, 15) === "MULTILINESTRING"){
                                        RiverManagerService.addLineByWkt(spatialData);
                                        return;
                                    }else if(linePoints !== null && linePoints !== "" && linePoints.indexOf(";") !== -1 && linePoints.indexOf(",") !== -1){
                                        RiverManagerService.addLineByCoords(linePoints);
                                        return;
                                    }else {
                                        console.warn("坐标为空");
                                        // layer.msg('坐标为空！绘制失败');
                                    }
                                }
							} ]);

})(window, angular);