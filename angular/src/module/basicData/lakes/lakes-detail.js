(function(window, angular) {
	'use strict';
	var app = angular.module("app");
		app.filter("trustHtml",function($sce){
		   return function (input){
		       return $sce.trustAsHtml(input); 
		   } 
		})
		app.controller(
			'lakesDetailCtrl', [
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
                // 'LakeManagerService',
                'OneMapMapInit',
				function lakesDetailCtrl($localStorage, $scope, $location, $log, $q, $rootScope, globalParam, $window, routeService, $http,
                                         wish, esriApiDeps, tiandituFactory, MapTool, MapUtil, SymbolUtil, GeometryUtil,OneMapMapInit) {

					//获取当前数据详情字段
					if(!$localStorage.lakeDetailData){
                        layer.msg('获取数据失败,请重试')
                    }
                    $scope.lake = $localStorage.lakeDetailData;
					// 返回按钮
					$scope.back = function() {
						routeService.route(106, true);
					}


                    var promise = esriApiDeps.query();
                    var w = wish.get();

                    $scope.init = function(){
                        // loadGisModuls();
                    };

                    /**
                     *  地图初始化
                     *  @author: hsf
                     *  @time: 2018-9-11 14:35
                     */

                     
                    // $scope.map = new w.Map('mapContainer', {
                    //     fadeOnZoom: true,
                    //     Zoom:11,
                    //     extent: new w.Extent(-180, -90, 180, 90, new w.SpatialReference({"wkid":4326})),
                    //     logo:false,
                    // });
                    // OneMapMapInit.initBasemap($scope.map);

                    //加载GIS模块
                    function loadGisModuls() {
                        if (typeof $scope.map !== 'undefined') {
                            MapTool.init($scope.map);
                            MapUtil.init($scope.map);
                            SymbolUtil.init($scope.map);
                            GeometryUtil.init($scope.map);
                            LakeManagerService.init($scope.map, "lakeManagerLayer");

                            addMarker();
                        } else {
                            console.error('error： $scope.map 未定义')
                        }
                    }

                    function addMarker() {
                        var spatialData = $scope.lake.spatialData;
                        var linePoints = $scope.lake.linePoints;

                        //spatialData = "MULTIPOLYGON(((93.92349243164062 41.334922313690186,119.76333618164062 41.686484813690186,127.84927368164062 24.284141063690186,93.74771118164062 17.077109813690186,78.98208618164062 35.006797313690186,93.92349243164062 41.334922313690186)),((91.98989868164062 37.643516063690186,111.32583618164062 37.291953563690186,109.74380493164062 32.370078563690186,88.47427368164062 32.721641063690186,91.98989868164062 37.643516063690186)))";
                        if(spatialData !== null && spatialData.length > 0 && spatialData.substring(0, 12) === "MULTIPOLYGON"){
                            LakeManagerService.addPolygonByWkt(spatialData);
                            return;
                        }else if(linePoints !== null && linePoints !== "" && linePoints.indexOf(";") !== -1 && linePoints.indexOf(",") !== -1){
                            LakeManagerService.addPolygonByCoords(linePoints);
                            return;
                        }else {
                            console.warn("坐标为空");
                            // layer.msg('坐标为空！绘制失败');
                        }
                    }




				}
			]);

})(window, angular);