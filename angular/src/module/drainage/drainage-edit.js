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
			'drainageEditCtrl', [
				'$localStorage',
				'$scope',
				'$location',
				'$log',
				'$q',
				'$rootScope',
				'globalParam',
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
				'UtilityTool',
				'MapTool',
				function drainageEditCtrl($localStorage, $scope, $location, $log, $q, $rootScope,globalParam, $window, routeService,moduleService, $http,
                                          wish, esriApiDeps, tiandituFactory, MapUtil, SymbolUtil, GeometryUtil, BasinManagerService, UtilityTool, MapTool) {
	
					//获取当前数据进行编辑操作
					$scope.editId = $localStorage.drainageEditData.data.id;
					$scope.drainageName = $localStorage.drainageEditData.data.basinName;
					$scope.drainageOverview = $localStorage.drainageEditData.data.overView;
					$scope.drainageRemark = $localStorage.drainageEditData.data.remark;
					$scope.drainageLongitude = $localStorage.drainageEditData.data.longitude;
					$scope.drainageLatitude = $localStorage.drainageEditData.data.latitude;
					$scope.drainageAcreage = $localStorage.drainageEditData.data.acreage;
					$scope.drainageLinePoints = $localStorage.drainageEditData.data.linePoints;
                    $scope.drainageSpatialData = $localStorage.drainageEditData.data.spatialData;
                    CKEDITOR.instances.editor.setData($scope.drainageOverview);
                    
					
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
					
					/* 修改*/
                    var jsname = /^[a-zA-Z0-9_-]{4,16}$/;
					$scope.drainageEdit = function() {
                        var data = CKEDITOR.instances.editor.getData();
                        if (!$scope.drainageName || !jsname.test($scope.drainageName) == null) {
                            layer.alert("请完善信息", {
                                skin: 'my-skin',
                                closeBtn: 1,
                                anim: 3
                            });
                        } else {
                        $http({
                            url: moduleService.getServiceUrl() +basicUrl + "/update",
                            method: "post",
                            params: {
                                id: $scope.editId,
                                basinName: $scope.drainageName,
								remark: $scope.drainageRemark,
								overView:data,
								longitude:$scope.drainageLongitude,
								latitude:$scope.drainageLatitude,
								acreage:$scope.drainageAcreage,
								linePoints:$scope.drainageLinePoints,
                                spatialData:$scope.drainageSpatialData
                            }
                        }).success(
                            function success(result) {
                                layer.msg('修改成功！', {time: 2000});
                                routeService.route(103, true);
                            });
                    }
					};

                    /*备注信息*/
                    $scope.countNum = 512 - $scope.drainageRemark.length;
				    $scope.checkRemark = function () {
				    	$scope.countNum = 512 - $scope.drainageRemark.length;
				        if ($scope.drainageRemark.length > 512) {
				            layer.msg("你好，描述字数控制在255字以内！",{time:2000});
				            $scope.drainageRemark = $scope.drainageRemark.substr(0, 512);
				            $scope.countNum = 0;
				        }
				    };

                    /*判断名称是否重复*/
                    $scope.isRepeat = function(){
                        var oldName = $scope.drainageName;
                        var newName = $localStorage.drainageEditData.data.basinName;
                        if(oldName.toUpperCase() === newName.toUpperCase()){
                            return;
                        }
                        $http({
                            method:'get',
                            url:moduleService.getServiceUrl() +basicUrl + "/isRepeat",
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

                    /*清空表单*/
                    var clear = function() {
                        $scope.drainageName='';

                    }
					
					/*返回按钮*/ 
					$scope.back = function() {
						routeService.route(103, true);
					}

                    //标绘
                    $scope.doDraw = function(){
                        BasinManagerService.addPolygonMarker();
                        BasinManagerService._drawTool.on("draw-end", function(){
                            $scope.drainageLongitude=BasinManagerService.centerpointX.toFixed(4);
                            $scope.drainageLatitude=BasinManagerService.centerpointY.toFixed(4);
                            $scope.drainageAcreage=BasinManagerService.area;
                            $scope.drainageLinePoints=BasinManagerService.linepoints;
                            $scope.drainageSpatialData = BasinManagerService.spatialData;
                            $scope.$apply();
                        });
                    };
                    //清除
                    $scope.clearDraw = function(){
                        BasinManagerService.cancelDrawTool();
                        $scope.drainageAcreage = null;
                        $scope.drainageLongitude = null;
                        $scope.drainageLatitude = null;
                    };

                    //获取登录用户信息
                    function loadUserInfo(){
                        $http({
                            method: "GET",
                            url: $localStorage.serviceUrl_LR+ "/mdAdminregion",
                            dataType:'json'
                        }).success(
                            function(res) {
                                //regionTree = $.fn.zTree.init($("#regionTree"), setting, res.data);
                                //获取用户经纬度、行政等级等相关信息
                                if(!res.data.hasOwnProperty('longitude') && !res.data.hasOwnProperty
                                ('latitude')){
                                    //测试用
                                    res.data.longitude = 120.75;
                                    res.data.latitude = 30.75;
                                }
                                var point = new w.Point(res.data.longitude, res.data.latitude);
                                MapUtil.center2zoom(point, res.data.regionLevel);

                            }
                        ).error(function() {console.log("no data response")});

                    };

                    var promise = esriApiDeps.query();
                    var w = wish.get();

                    $scope.init = function(){
                        //gis模块初始化
                        loadGisModuls();
                        //loadUserInfo();
                    };
                    //地图初始化
                    var initExtent = new w.Extent(49.670562744140625, -2.7861714363098145, 155.13931274414062, 67.52632856369019);
                    $scope.map = new w.Map('mapContainer',{
                        extent: initExtent,
                        fadeOnZoom: true
                    });
                    //加载天地图
                    tiandituFactory.initTianditu($scope.map);

                    //加载gis模块
                    function loadGisModuls() {
                        if (typeof $scope.map !== 'undefined') {
                            MapUtil.init($scope.map);
                            SymbolUtil.init($scope.map);
                            GeometryUtil.init($scope.map);
                            BasinManagerService.init($scope.map, "basinLayer");
                            MapTool.init($scope.map);

                            addMarker();
                        } else {
                            console.error('error： $scope.map is undefined')
                        }
                    };

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