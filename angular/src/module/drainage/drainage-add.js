var modulePrefix = "/watersource";
var basicUrl = modulePrefix + "/v1/drainageBasin";
var waterUrl = modulePrefix + "/v1/waterSystem";
var riverUrl = modulePrefix + "/v1/river";
var lakesUrl = modulePrefix + "/v1/lakes";
var reservoirUrl = modulePrefix + "/v1/reservoir";
var reachUrl = modulePrefix + "/v1/reach";
var dictionaryUrl = modulePrefix + "/v1/dictionary";
(function(window, angular) {
	'use strict';

	angular.module("app")
		.controller(
			'drainageAddCtrl', [
				'$localStorage',
				'$scope',
				'$location',
				'$log',
				'$q',
				'$rootScope',
				'$window',
				'routeService',
				'moduleService',
				'$http',
                'wish',
				'esriApiDeps',
		        'tiandituFactory',
		        'MapUtil',
		        'SymbolUtil',
		        'GeometryUtil',
				'BasinManagerService',
				function drainageAddCtrl($localStorage, $scope, $location, $log, $q, $rootScope, $window, routeService, moduleService, $http,
                                         wish, esriApiDeps, tiandituFactory, MapUtil, SymbolUtil, GeometryUtil, BasinManagerService) {

                    /**
                     * ================================
                     * 描述说明
                     * @author yuanhaitao</br>2018/09/05
                     * @module 流域管理
                     * @version 3.0.0
                     * ================================
                     */

					var promise = esriApiDeps.query();
            		var w = wish.get();
					
					$scope.init = function(){
                		loadGisModuls();
					};
					
					/**
		             *  地图初始化
		             *  @author: hsf
		             *  @time: 2018-09-04 17:35
		             */
		            var initExtent = new w.Extent(49.670562744140625, -2.7861714363098145, 155.13931274414062, 67.52632856369019);
		            $scope.map = new w.Map('mapContainer', {
		                extent: initExtent,
		                fadeOnZoom: true
		            });
		            
		            /*加载天地图*/
		            tiandituFactory.initTianditu($scope.map);

					/*加载GIS模块*/
		            function loadGisModuls() {
		                if (typeof $scope.map !== 'undefined') {
		                    MapUtil.init($scope.map);
		                    SymbolUtil.init($scope.map);
		                    GeometryUtil.init($scope.map);
		                    BasinManagerService.init($scope.map, "basinLayer");
		                } else {
		                    console.error('error： $scope.map is undefined')
		                }
		            }
					
					/*地图标绘*/
					$scope.doDraw = function(){
                        BasinManagerService.cancelDrawTool();
						BasinManagerService.addPolygonMarker();
						BasinManagerService._drawTool.on("draw-end", function(){
							$scope.drainageLongitude=BasinManagerService.centerpointX.toFixed(4);
							$scope.drainageLatitude=BasinManagerService.centerpointY.toFixed(4);
							$scope.drainageAcreage=BasinManagerService.area;
							$scope.drainageLinePoints=BasinManagerService.linepoints;
							$scope.drainageSpatialData=BasinManagerService.spatialData;
							$scope.$apply();
						});
					};
					$scope.clearDraw = function(){
                        BasinManagerService.cancelDrawTool();
						$scope.drainageAcreage = null;
						$scope.drainageLongitude = null;
						$scope.drainageLatitude = null;
					};
					
					/*地图放大缩小切换*/
					$scope.switchMapIcon = true;
					$scope.mapExpand = function(){
						$scope.switchMapIcon = !$scope.switchMapIcon;
						if($scope.switchMapIcon){
							$("#mapContainer").css("height",400 + "px");
						}else{
							var _wrapperMdH = $('#wrapperMd').outerHeight(true);
							$("#mapContainer").css("height",_wrapperMdH + "px");
						}
					}
					
					/*流域新增*/
					var jsname = /^[a-zA-Z0-9_-]{4,16}$/;
					$scope.submit = function() {
						var data = CKEDITOR.instances.editor.getData();
						console.log(data);
						if(!$scope.drainageName || !jsname.test($scope.drainageName) == null) {
							layer.alert("流域名称不能为空，请填完善相关信息，再提交表单哦!", {
								skin: 'my-skin',
								closeBtn: 1,
								anim: 3
							});
						} else {
							$http({
								method: "post",
								url: moduleService.getServiceUrl() + basicUrl + "/add",
								params: {
									basinName: $scope.drainageName,
									remark: $scope.drainageRemark,
									overView:data,
									longitude:$scope.drainageLongitude,
									latitude:$scope.drainageLatitude,
									acreage:$scope.drainageAcreage,
									linePoints:$scope.drainageLinePoints,
                                    spatialData:$scope.drainageSpatialData
								},
							}).success(
							function(res) {
							    if (res.resCode === 1){
                                    layer.msg('成功新增一条数据！',{time:2000});
                                    clear();
                                } else {
                                    layer.msg(res.resMsg,{time:2000});
                                    clear();
                                }

							});
						}
					};

                    /*判断名称是否重复*/
                    $scope.isRepeat = function(){
                        $http({
                            method:'get',
                            url:moduleService.getServiceUrl() + basicUrl + "/isRepeat",
                            params:{
                                name:$scope.drainageName
                            }
                        }).success(
                            function (res) {
                                if (res.resCode === 0){
                                    layer.msg('流域名称重复',{time:2000});
                                    clear();
                                }
                            }).error();
                    };
					
					/*备注信息*/
                    $scope.countNum = 512;
				    $scope.checkRemark = function () {
				    	$scope.countNum = 512 - $scope.drainageRemark.length;
				        if ($scope.drainageRemark.length > 512) {
				            layer.msg("你好，描述字数控制在255字以内！",{time:2000});
				            $scope.drainageRemark = $scope.drainageRemark.substr(0, 512);
				            $scope.countNum = 0;
				        }
				    };
                    
					/*清空表单*/
					var clear = function() {
						$scope.drainageName='';
						$scope.drainageOverview='';
						$scope.drainageRemark='';
						CKEDITOR.instances.editor.setData(" ");
					}
					
					/*返回按钮*/ 
					$scope.back = function() {
						routeService.route(103, true);
					}
					
					
				}
			]);
})(window, angular);