(function(window, angular) {
	'use strict';

	angular.module("app")
			.controller(
					'eventAdd',
					[
							'$localStorage',
							'$scope',
							'$location',
							'$log',
							'$q',
							'$rootScope',
							'$window',
							'routeService',
							'$http',
							'$ajaxhttp',
							'wish',
							'esriApiDeps',
							'tiandituFactory',
							'MapUtil',
							'SymbolUtil',
							'GeometryUtil',
							'ComponentManagerService',
							function eventAdd($localStorage, $scope,$location, $log, $q, $rootScope, $window,routeService, $http, $ajaxhttp,
                                              wish, esriApiDeps, tiandituFactory, MapUtil, SymbolUtil, GeometryUtil, ComponentManagerService) {
								var typeTree;
								//问题类型数据
							    var setting = {
							        view:{
							            selectedMulti:true,
							            showLine:true,
							            showIcon:true
							        },
							        data:{
							            simpleData: {enable: true},
							            keep: {parent: true}
							        },
							        callback:{
							            onClick:zTreeOnClick
							        }
							    };
							    function zTreeOnClick(event,treeId,treeNode){
							    	$scope.eventTypeName = treeNode.name;
							        $scope.eventTypeId = treeNode.id;
							        $scope.$apply();
							    };
							    var treeList = function(){
							    	$ajaxhttp.myhttp({
										url: $localStorage.serviceUrl_eventMgr + 'v1/event/getEventTypes',
										method: 'GET',
										callBack: function(res){
											typeTree = $.fn.zTree.init($('#typeTree'), setting, res.data);
										}
									});
							    };
							    treeList();
							    var reachTree;
								//河道树数据
							    var setting2 = {
							        view:{
							            selectedMulti:true,
							            showLine:true,
							            showIcon:true
							        },
							        data:{
							            simpleData: {enable: true},
							            keep: {parent: true}
							        },
							        callback:{
							        	beforeExpand:zTreeOnExpand,
							            onClick:zTreeOnClick2
							        }
							    };
							    function zTreeOnClick2(event,treeId,treeNode){
							    	$scope.reachName = treeNode.name;
							        $scope.reachId = treeNode.id;
							        $scope.$apply();
							    };
							    function zTreeOnExpand(treeId,treeNode){
							        var cnodes = treeNode.children;
							        if (cnodes !=null && cnodes.length > 0){
							            return;
							        };
							        $ajaxhttp.myhttp({
										url: $localStorage.gwUrl + '/watersource/v1/reach/findReachNodesByCondition',
										method: 'GET',
										params:{
											isChildrenNodes: true,
											reachId: treeNode.id,
											regionId: $scope.regionId
										},
										callBack: function(res){
											reachTree.addNodes(treeNode,res.data,true);
										}
									});
							    };
							    $scope.regionId = $localStorage.userLoginInfo.userInfo.regionId;
							    var treeList2 = function(id){
							    	$ajaxhttp.myhttp({
										url: $localStorage.gwUrl + '/watersource/v1/reach/findReachNodesByCondition?regionId=' + $scope.regionId,
										method: 'GET',
										callBack: function(res){
											reachTree = $.fn.zTree.init($('#reachNameTree'), setting2, res.data);
										}
									});
							    };
							    $scope.getReachData = function(){
							    	treeList2()
							    };
								var datepicker1 = $('#datetimepicker1')
									.datetimepicker({
										format: 'YYYY-MM-DD hh:mm:ss',
										locale: moment.locale('zh-cn')
									}).on('dp.change', function(e) {
										var result = new moment(e.date).format('YYYY-MM-DD hh:mm:ss');
										$scope.dateOne = result;
										$scope.$apply();
									});
								//选择是否保密问题
								$scope.isPrivaryClick = function(num){
									$scope.isPrivary = num;
								};
								$scope.back = function(){
			                        window.history.back();
			                    };
								$scope.submit = function() {
									console.log($scope.component_longitude)
									$ajaxhttp.myhttp({
										url: $localStorage.serviceUrl_eventMgr + 'v1/event/add',
										method: 'POST',
										params: {
											regionId: $scope.regionId,
											eventTypeId: $scope.eventTypeId,
											reachId: $scope.reachId,
											eventResource: $scope.eventResource,
											reportPersonCellPhone: $scope.reportTel,
											content: $scope.eventDescription,
											address: $scope.eventLocation,
											eventLevel: $scope.eventLevel,
											createTime: $scope.dateOne,
											isPrivary: $scope.isPrivary,
											contactWay: $scope.contactType,
											contactAddress: $scope.contactAddress,
											longitude: $scope.component_longitude,
											latitude: $scope.component_latitude
										},
										callBack: function(res){
											if(res.resCode == 1){
												console.log(222)
												layer.open({
						                            title:'提示',
						                            content: "新增成功"
						                        });
											}
										}
									})
								};


                                //====================================地图显示======================================================
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
                                        ComponentManagerService.init($scope.map, "ComponentManagerLayer");
                                    } else {
                                        console.error('error： $scope.map 未定义')
                                    }
                                }

                                //地图标绘
                                $scope.doDraw = function(){
                                    ComponentManagerService.drawPointMarker();
                                    ComponentManagerService._drawTool.on("draw-end", function(){
                                        $scope.component_longitude=ComponentManagerService.pointXY[0].toFixed(4);
                                        $scope.component_latitude=ComponentManagerService.pointXY[1].toFixed(4);
                                        $scope.$apply();
                                    });
                                };
                                $scope.clearDraw = function(){
                                    ComponentManagerService.clear();
                                };


                                /*地图放大缩小切换*/
                                $scope.switchMapIcon = true;
                                $scope.mapExpand = function(){
                                    // console.log($scope.switchMapIcon)
                                    $scope.switchMapIcon = !$scope.switchMapIcon;
                                    if($scope.switchMapIcon){
                                        $("#mapContainer").css("height",400 + "px");
                                        $('.proMgr-basin_map').css('width','35%');
                                        $('.proMgr-basin_map').css('top','15px');
                                        $('.proMgr-basin_map').css('right','15px');
                                    }else{
                                        // var _wrapperMdH = $('#wrapperMd').height();
                                        $('.proMgr-basin_map').css('width',$('#wrapperMd').width());
                                        $('.proMgr-basin_map').css('top','-15px');
                                        $('.proMgr-basin_map').css('right','-15px');
                                        // console.log(_wrapperMdH)
                                        $("#mapContainer").css("height",$('#wrapperMd').height());
                                    }
                                };
                                $scope.$watch('regionId', function(n,o){
                                    console.log($scope.regionInfo)
                                    if($scope.regionInfo != undefined){
                                        locationToSelectRegion($scope.regionInfo);
                                    }								});
                                function locationToSelectRegion(treeNode){
                                    if(MapUtil.isCoordValid(treeNode["longitude"], treeNode["latitude"])){
                                        if(treeNode["grade"] != null){
                                            MapUtil.center2LongLat(treeNode["longitude"],treeNode["latitude"],treeNode["grade"]);
                                        }
                                    }else {
                                        console.warn("定位失败！坐标为空！");
                                        layer.msg('定位失败！坐标为空！',{time:2000});
                                    }
                                }




							}]);

})(window, angular);
