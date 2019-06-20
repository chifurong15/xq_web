angular.module('app').directive('basicMap', [
	'$http',
	'moduleService',
	'wish',
	'esriApiDeps',
	'tiandituFactory',
	'MapUtil',
	'SymbolUtil',
	'$localStorage',
	'GeometryUtil',
	'OneMapMapInit',
	'MapTool',
	'ComponentManagerService',
	'BasinManagerService',
	'RiverManagerService',
	'OneMapMapUtil',
	function($http, moduleService, wish, esriApiDeps, tiandituFactory, MapUtil, SymbolUtil, $localStorage, GeometryUtil, OneMapMapInit,
		MapTool, ComponentManagerService, BasinManagerService, RiverManagerService, OneMapMapUtil) {
		return {
			restrict: 'E',
			replace: false,
			template: '<div ng-class="{true : \'basicMapContainer\',false : \'basicMapDetail\'}[objOpera != \'view\']" id="mapContainer">' +
				'<div class="proMgr-map-tool" ng-if="objOpera != \'view\'">' +
				'<ul class="drawTool">' +
				'<li ng-click="doDraw();">' +
				'<a id="doDraw" href="javascript:void(0);" title="画面"><i class="icon-jx_mapmark"></i></a>' +
				'</li>' +
				'<li ng-click="clearDraw();">' +
				'<a id="clearDraw" href="javascript:void(0);" title="清除"><i class="icon-jx_mapremove"></i></a>' +
				'</li>' +
				'<li ng-click="showDraw();">' +
				'<a id="showDraw" href="javascript:void(0);" title="显示"><i class="icon-jx_mapinfo"></i></a>' +
				'</li>' +
				'<li ng-click="mapExpand();">' +
				'<a id="mapExpand"  href="javascript:void(0);" title="缩放"><i ng-class="{true : \'icon-jx_fullscreen\',false : \'icon-jx_narrow\' }[mapMin]"></i></a>' +
				'</li>' +
				'</ul>' +
				'</div>' +
				'<div id="getgeo"></div>' +
				'</div>',
			scope: {
				obj: '=', //绑定数据
				mapMin: '=', //地图全屏控制
				mapType: '=', //地图绘制类型  line线性  polygon多边形
				objOpera: '=', //对应页面 view和edit页面初始化之后绘制地图
			},
			link: function($scope, $element, $attrs) {
				var promise = esriApiDeps.query();
				var w = wish.get();

				$scope.map = new w.Map('mapContainer', {
					fadeOnZoom: true,
					Zoom: 11,
					extent: new w.Extent(-180, -90, 180, 90, new w.SpatialReference({
						"wkid": 4326
					})),
					logo: false
				});

				if (typeof $scope.map !== 'undefined') {
					// tiandituFactory.initTianditu($scope.map);
					OneMapMapUtil.init($scope.map);
					OneMapMapInit.initBasemap($scope.map);
					MapUtil.init($scope.map);
					// MapUtil.center2LongLat(117.328440780091, 39.300691864604, 2);
					SymbolUtil.init($scope.map);
					GeometryUtil.init($scope.map);
					BasinManagerService.init($scope.map, "basinLayer");
					RiverManagerService.init($scope.map, "riverLayer");
					ComponentManagerService.init($scope.map, "ComponentManagerLayer");
					MapTool.init($scope.map);
					addOverlyingMapLayer();
				} else {
					console.log('error： $scope.map 未定义')
				}

				if ($scope.objOpera == 'view' || $scope.objOpera == 'edit') {
					addMarker();
				}

				function addOverlyingMapLayer() {
					/* 文字标注 */
					var userLogoInfo = $localStorage.userLoginInfo.userInfo;
					var thisMapData = {
						"serverurl": "http://t0.tianditu.gov.cn/DataServer?tk=ff19838854ae3d41e75b90bb56f0aed6&T=cva_c&X=",
						"id": "d71d30f5523611e79f627845c42b5316",
						"spatialReference": 4326,
						"releaseMode": "1",
						"title": "文字标注",
						"tileMatrixSet": "文字标注"
					};
					$http({
						method: "POST",
						url: moduleService.getServiceUrl() + "/gismap/addOverlyingMapLayer",
						params: {
							mapLayerId: "d71d30f5523611e79f627845c42b5316",
							userId: userLogoInfo.id,
							longitude: userLogoInfo.longitude,
							latitude: userLogoInfo.latitude,
							name: userLogoInfo.name,
							userName: userLogoInfo.userName,
							userLevel: userLogoInfo.userLevel,
							cellPhone: userLogoInfo.cellPhone,
							regionId: userLogoInfo.regionId,
							regionName: userLogoInfo.regionName
						}
					}).success(function(res) {}).error(function() {});
					OneMapMapInit.addOverlyingMap(thisMapData);
				}


				function addMarker() {
					var coords;
					var spatialData = $scope.obj.spatialData;
					var linePoints = $scope.obj.linePoints;
					if (spatialData && spatialData.length > 0 && spatialData.substring(0, 12) === "MULTIPOLYGON") {
						if ($scope.mapType == 'polygon') {
							BasinManagerService.addPolygonByWkt(spatialData);
						} else {
							RiverManagerService.addLineByWkt(spatialData);
						}
						return;
					} else if (linePoints && linePoints.indexOf(";") !== -1 && linePoints.indexOf(",") !== -1) {
						if ($scope.mapType == 'polygon') {
							BasinManagerService.addPolygonByCoords(linePoints);
						} else {
							RiverManagerService.addLineByCoords(linePoints);
						}
						return;
					} else {
						console.log("坐标为空");
						// layer.msg('坐标为空！绘制失败');
					}
				}
				/*地图标绘*/
				$scope.doDraw = function() {
					if ($scope.mapType == 'polygon') {
						BasinManagerService.cancelDrawTool();
						BasinManagerService.addPolygonMarker();
						BasinManagerService._drawTool.on("draw-end", function() {
							$scope.obj.longitude = BasinManagerService.centerpointX.toFixed(4);
							$scope.obj.latitude = BasinManagerService.centerpointY.toFixed(4);
							$scope.obj.acreage = BasinManagerService.area;
							// console.log($scope.obj.acreage,'$scope.obj.acreage')
							$scope.obj.linePoints = BasinManagerService.linepoints;
							$scope.obj.spatialData = BasinManagerService.spatialData;
							$scope.obj.centerLongitude = BasinManagerService.centerpointX.toFixed(4);
							$scope.obj.centerLatitude = BasinManagerService.centerpointY.toFixed(4);
							$scope.$apply();
						});
					} else {
						RiverManagerService.cancelDrawTool();
						RiverManagerService.drawLineMarker();
						RiverManagerService._drawTool.on("draw-end", function() {
							$scope.obj.longitude = RiverManagerService.centerpointX.toFixed(4);
							$scope.obj.latitude = RiverManagerService.centerpointY.toFixed(4);
							$scope.obj.midPointLongitude = RiverManagerService.centerpointX.toFixed(4);
							$scope.obj.midPointLatitude = RiverManagerService.centerpointY.toFixed(4);
							$scope.obj.length = RiverManagerService.linelength;
							$scope.obj.length = parseFloat($scope.obj.length).toFixed(2);
							$scope.obj.linePoints = RiverManagerService.linepoints;
							$scope.obj.spatialData = RiverManagerService.spatialData;
							$scope.$apply();
						});
					}
				};
				$scope.clearDraw = function() {
					BasinManagerService.cancelDrawTool();
					RiverManagerService.cancelDrawTool();
					$scope.obj.length = '';
					$scope.obj.acreage = '';
					$scope.obj.longitude = '';
					$scope.obj.latitude = '';
					$scope.obj.linePoints = '';
					$scope.obj.spatialData = '';
					$scope.obj.midPointLongitude = '';
					$scope.obj.midPointLatitude = '';
					$scope.obj.centerLongitude = '';
					$scope.obj.centerLatitude = '';
				};
				$scope.showDraw = function() {
					var index = layer.open({
						content: $scope.obj.spatialData ? '绘制轨迹：' + $scope.obj.spatialData : '暂无绘制轨迹'
					})
				};

				/*地图放大缩小切换*/
				$scope.mapExpand = function() {
					$scope.mapMin = !$scope.mapMin;
					if ($scope.mapMin) {
						$("#mapContainer").css("height", 400 + "px");
					} else {
						var _wrapperMdH = $('#wrapperMd').outerHeight(true);
						$("#mapContainer").css("height", _wrapperMdH + "px");
					}
				}

				/*获取中心点*/
				$scope.getExtent = function() {
					var xmin, xmax, ymin, ymax = null;
					var x = $localStorage.userLoginInfo.userInfo.longitude;
					var y = $localStorage.userLoginInfo.userInfo.latitude;
					// var x = $localStorage.userLoginInfo.userInfo.longitude;
					// var y = $localStorage.userLoginInfo.userInfo.latitude;
					if ($localStorage.userLoginInfo.userInfo.grade == 2) {
						xmin = x - 1;
						xmax = x + 1;
						ymin = y - 1;
						ymax = y + 1;
					} else if ($localStorage.userLoginInfo.userInfo.userLevel == 3) {
						xmin = x - 0.5;
						xmax = x + 0.5;
						ymin = y - 0.5;
						ymax = y + 0.5;
					} else if ($localStorage.userLoginInfo.userInfo.userLevel == 4) {
						xmin = x - 0.1;
						xmax = x + 0.1;
						ymin = y - 0.1;
						ymax = y + 0.1;
					} else {
						xmin = x - 0.05;
						xmax = x + 0.05;
						ymin = y - 0.05;
						ymax = y + 0.05;
					}
					var extent = new w.Extent(xmin, ymin, xmax, ymax, new w.SpatialReference({
						wkid: 4326
					}));
					OneMapMapUtil.center2Extent(extent);
				}

			}
		}
	}
]);
