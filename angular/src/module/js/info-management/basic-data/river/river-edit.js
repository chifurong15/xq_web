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

	angular
			.module("app")
			.controller(
					'imRiverEdit',
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
							function imRiverEdit($localStorage, $scope, $location,
									$log, $q, $rootScope,globalParam, $window,
									routeService, $http) {
								//获取当前数据
								$scope.riverDetail = $localStorage.riverDetailData;
                                CKEDITOR.instances.editor.setData($scope.riverDetail.overView);

								//所属区域树模态框【show】
								$scope.regionShow = function(){
									$scope.areaName = '';
									$("#region_ztree").modal('show');
		                            var regionTreeUrl = $localStorage.gwUrl +basicUrl + "/tree";
		                            treeList_region(regionTreeUrl);
		                            var setting = {
		                                view: {
		                                    selectedMulti: true,
		                                    showLine: true,
		                                    showIcon: true
		                                },
		                                data: {
		                                    simpleData: {enable: true},
		                                    keep: {parent: true}
		                                },
		                                callback: {
		                                    beforeExpand: zTreeOnExpand,
		                                    onClick: zTreeOnClick
		                                }
		                            };
		                            //生成区域树
									function treeList_region(regionTreeUrl) {
		      	                        $http({
		                                    method: "GET",
		                                    url: regionTreeUrl,
		                                    dataType: 'json'
		                                }).success(function (data) {
		                                    regionTree = $.fn.zTree.init($("#regionTree"), setting, data.data);
		                                }).error(function () {});
									};

									//所属区域树节点点击
		                            function zTreeOnClick(event, treeId, treeNode) {
										treeNode_find = treeNode.id,
		                            	_areaCode = treeNode.name;
		                                //改变区域树数值，清空水系、河流数值
		                                $scope.water_ztree = '';
									};

		                            function zTreeOnExpand(treeId, treeNode) {
		                                var cnodes = treeNode.children;
		                                if (cnodes !=null && cnodes.length > 0){
		                                    return;
		                                }
		                                $http({
		                                    method: "GET",
		                                    url: regionTreeUrl,
		                                    params: {
		                                        parentCode: treeNode.id,
		                                    }
		                                }).success(function (res) {
		                                    regionTree.addNodes(treeNode, res.data, true);
		                                });
		                            }

									//区域模态框搜索框
									$scope.select_region = function() {
										if($scope.areaName == null || $scope.areaName == ''){
											$scope.treeList_region(regionTreeUrl);
										}else{
											$http({
												method: "GET",
												url: $localStorage.gwUrl + basicUrl + "/fingByRegionName",
												params: {
													regionName: $scope.areaName
												},
											}).success(function(res) {
												regionTree = $.fn.zTree.init($("#regionTree"), setting, res.data);
											});
										}
									};
									//关闭所属区域模态框【确定按钮】
									$scope.region_modalOk = function (){
										$("#region_ztree").modal('hide');
		                                $scope.riverDetail.regionCode = treeNode_find;
		                                $scope.riverDetail.regionName = _areaCode;
									};
								};

		                        $scope.$watch('riverDetail.remark', function (newValue) {
		                        	if(newValue == undefined || newValue == ''){
		                        		return;
		                        	}else if (newValue.length >= 512) {
		                                layer.msg('总共可以输入512个字符',{time:2000});
		                            }
		                        });

                                //判断名称是否重复
                                $scope.isRepeat = function(){
                                    $http({
                                        method:'get',
                                        url:$localStorage.gwUrl + riverUrl + "/isRepeat",
                                        params:{
                                            name: $scope.riverDetail.riverName
                                        }
                                    }).success(function (res) {
                                        if (res.resCode === 0){
                                            layer.msg('河流名称重复');
                                            $window.document.getElementById('riverName').focus();
                                        }
                                    }).error();
                                };


								//水系选择模态框【show】
								var _treeNode_find,water_ztree_name,water_ztree_code;
								$scope.waterShow = function() {
									var _treeNode_find = treeNode_find;
									$scope.waterName = '';
									$("#water_ztree").modal('show');
									waterTreelist();
									//初始化水系树
									function waterTreelist(){
										$http({
											method: "get",
											url: $localStorage.gwUrl +waterUrl + "/belongWater",
											params: {
												areaCode:_treeNode_find
											},
										}).success(function(res) {;
											var setting1 = {
												enable: true,
												callback: {
													onClick: zTreeOnClick_water
												}
											};
											var zNodes1 = [{
												name: "根节点",
												icon: "/vendor/zTree_v3/css/zTreeStyle/img/diy/10.png",
												open: true,
												children: res.data
											}];
											$.fn.zTree.init($("#waterZtree"), setting1, zNodes1);
										});
									}

									//树节点点击问题
									function zTreeOnClick_water(event, treeId, treeNode) {
										$http({
											method: "GET",
											url: $localStorage.gwUrl + waterUrl + "/findByWaterCode",
											params: {
												waterCode: treeNode.id
											},
										}).success(function(res) {
											if (res.resCode == 1){
												water_ztree_name = res.data.waterName;
												water_ztree_code = res.data.waterCode;
											}else{
												$scope.water_ztree = '';
											}
										});
									};
									//水系模态框搜索框
									$scope.select_water = function() {
										if($scope.waterName == null || $scope.waterName == ''){
											waterTreelist();
										}else{
											$http({
												method: "GET",
												url: $localStorage.gwUrl +waterUrl + "/belongWater",
												params: {
													waterName: $scope.waterName
												},
											}).success(function(res) {
												var setting1 = {
													enable: true,
													callback: {
														onClick: zTreeOnClick_water
													}
												};
												var zNodes1 = [{
													name: "根节点",
													icon: "/vendor/zTree_v3/css/zTreeStyle/img/diy/10.png",
													open: true,
													children: res.data
												}];
												$.fn.zTree.init($("#waterZtree"), setting1, zNodes1);
											});
										}
									};
									//关闭模态框【确定按钮】
									$scope.water_modalOk = function (){
										$("#water_ztree").modal('hide');
                                        $scope.riverDetail.waterName = water_ztree_name;
                                        $scope.riverDetail.waterCode = water_ztree_code;
									};
								};

								//河流类型
								$scope.riverType = function () {
							    	$http({
							            method: "get",
                                        url: $localStorage.gwUrl + riverUrl + "/riverType",
										params: {
                                            type: '104'
										},
							    	}).success(function (res) {
									    $scope.riverTypes = res.data;
									});
							    }

								/* 修改 */
                                var jsname = /^[a-zA-Z0-9_-]{4,16}$/;
                                var len =/^\d+(?:\.\d{1,2})?$/;
								$scope.submit = function() {
                                    var overView = CKEDITOR.instances.editor.getData();
                                    if (!$scope.riverDetail.riverName || !jsname.test($scope.riverDetail.riverName) == null) {
                                        layer.alert("请完善河流名称", {
                                            skin: 'my-skin',
                                            closeBtn: 1,
                                            anim: 3
                                        });
                                    } else if ($scope.riverDetail.length == null || $scope.riverDetail.length == '' || eval($scope.riverDetail.length)<=0 ||!len.test($scope.riverDetail.length)) {
                                        layer.alert("河流长度请输入正数，最多保留两位小数！", {
                                            skin: 'my-skin',
                                            closeBtn: 1,
                                            anim: 3
                                        });
                                    } else if (!$scope.riverDetail.riverType) {
                                        layer.alert("请完善河流类型", {
                                            skin: 'my-skin',
                                            closeBtn: 1,
                                            anim: 3
                                        });
                                    } else if (!$scope.riverDetail.regionName) {
                                        layer.alert("请完善所属区域", {
                                            skin: 'my-skin',
                                            closeBtn: 1,
                                            anim: 3
                                        });
                                    } else if (!$scope.riverDetail.waterName) {
                                        layer.alert("请完善所属水系", {
                                            skin: 'my-skin',
                                            closeBtn: 1,
                                            anim: 3
                                        });
                                    } else {
                                        $http({
                                            url: $localStorage.gwUrl +riverUrl + "/update",
                                            method: "post",
                                            params: {
                                                id: $scope.riverDetail.editId,
                                                riverName: $scope.riverDetail.riverName,
                                                length: $scope.riverDetail.length,
                                                riverType: $scope.riverDetail.riverType,
                                                regionCode: $scope.riverDetail.regionCode,
                                                waterCode: $scope.riverDetail.waterCode,
                                                startPoint: $scope.riverDetail.startPoint,
                                                endPoint: $scope.riverDetail.endPoint,
                                                overView: overView,
                                                remark: $scope.riverDetail.remark
                                            }
                                        }).success(
                                            function () {
                                                layer.msg('修改成功', {time: 1000});
                                                routeService.route(51, true);
                                            }
                                        );
                                    }
                                }
								// 返回按钮
								$scope.back = function() {
									routeService.route(11, true);
								}
							} ]);
})(window, angular);