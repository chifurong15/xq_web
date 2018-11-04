var basicUrl = "/drainageBasin/v1";
var waterUrl = "/waterSystem/v1";
var riverUrl = "/river/v1";
var lakesUrl = "/lakes/v1";
var reservoirUrl = "/reservoir/v1";
var reachUrl = "/reach/v1";
var dictionaryUrl = "/dictionary/v1";
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
								$scope.riverName = globalParam.getter().data.riverName;
								$scope.length = globalParam.getter().data.length;
								$scope.riverTypeName = globalParam.getter().data.riverTypeName;
								$scope.gradeName = globalParam.getter().data.gradeName;
								$scope.water_ztree = globalParam.getter().data.waterName;
								$scope.region = globalParam.getter().data.regionName;
								$scope.startPoint = globalParam.getter().data.startPoint;
								$scope.endPoint = globalParam.getter().data.endPoint;
								$scope.overView = globalParam.getter().data.overView;
                                CKEDITOR.instances.editor.setData($scope.overView);
								$scope.remark = globalParam.getter().data.remark;
								$scope.editId = globalParam.getter().data.id;
								console.log($scope.editId);
								
								//所属区域树模态框【show】
								$scope.regionShow = function(){
									$scope.areaName = '';
									$("#region_ztree").modal('show');
                                    $scope.treeList_region(regionTreeUrl);
								};

                                $scope.remark_length = 0;
                                $scope.$watch('remark', function (newValue) {
                                    $scope.remark_length = newValue.length;
                                    if ($scope.remark_length === 512) {
                                        layer.msg('总共可以输入512个字符',{time:2000});
                                    }
                                });

                                //判断名称是否重复
                                $scope.isRepeat = function(){
                                    var oldName = $scope.riverName;
                                    var newName = globalParam.getter().data.riverName;
                                    if(oldName.toUpperCase() === newName.toUpperCase()){
                                        return;
                                    }
                                    $http({
                                        method:'get',
                                        url:$localStorage.gwUrl +riverUrl + "/isRepeat",
                                        params:{
                                            name:$scope.riverName
                                        }
                                    }).success(
                                        function (res) {
                                            if (res.resCode === 0){
                                                layer.msg('河流名称重复',{time:2000});
                                                clear();
                                            }
                                        }).error();
                                };

                                //清空表单
                                var clear = function() {
                                    $scope.riverName='';
                                }

								//所属区域树节点点击
								var treeNode_find,
									_areaCode;
								function zTreeOnClick(event, treeId, treeNode) {
									$http({
										method: "GET",
										url: $localStorage.gwUrl +basicUrl + "/findByAreaCode",
										params: {
											areaCode: treeNode.id,
										},
									}).success(
										function(res) {
											console.log(res);
											treeNode_find = treeNode.id,
											console.log(treeNode_find );
											$http({
												method: "get",
												url: $localStorage.gwUrl +basicUrl + "/tree",
												params: {
													areaCode:treeNode_find
												},
											}).success(
												function(res) {
													console.log(res);
													_areaCode = treeNode.name;
													console.log(_areaCode);

													$scope.tree = res.data
												}
											);
											
										}
									);
								};

                                var regionTree;
                                var regionTreeUrl = $localStorage.gwUrl +basicUrl + "/tree";
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

                                function zTreeOnExpand(treeId, treeNode) {
                                    console.log('===========zTreeOnExpand===========')
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
                                    }).success(
                                        function (res) {
                                            regionTree.addNodes(treeNode, res.data, true);
                                        }
                                    );
                                }
								//生成区域树
								$scope.treeList_region = function(regionTreeUrl) {
                                    console.log(regionTreeUrl);
                                    $http({
                                        method: "GET",
                                        url: regionTreeUrl,
                                        dataType: 'json'
                                    }).success(
                                        function (data) {
                                            console.log(data.data)
                                            regionTree = $.fn.zTree.init($("#regionTree"), setting, data.data);
                                            console.log(regionTree)
                                        }
                                    ).error(function () {
                                    });
								};
								//区域模态框搜索框
								$scope.select_region = function() {
									if($scope.areaName == null || $scope.areaName == ''){
										$scope.treeList_region(regionTreeUrl);
									}else{
										$http({
											method: "GET",
											url: $localStorage.gwUrl +basicUrl + "/fingByRegionName",
											params: {
												regionName: $scope.areaName
											},
										}).success(
											function(res) {
												console.log(res);
												regionTree = $.fn.zTree.init($("#regionTree"), setting, res.data);
												$scope.tree = res.data
											}
										);
									}
								};
								//关闭所属区域模态框【确定按钮】
								$scope.region_modalOk = function (){
									
									$("#region_ztree").modal('hide');
                                    $scope.region = _areaCode;
								};
								
								//水系选择模态框【show】
								var _treeNode_find,
										water_ztree_name,
										water_ztree_code;
								$scope.waterShow = function() {
									var _treeNode_find = treeNode_find;
									console.log(_treeNode_find);
									$("#water_ztree").modal('show');
									//初始化水系树
									$http({
										method: "get",
										url: $localStorage.gwUrl +waterUrl + "/belongWater",
										params: {
											areaCode:_treeNode_find
										},
									}).success(
										function(res) {
											console.log(_treeNode_find);
											console.log(res);
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
											$scope.tree = res.data
										}
									);
									
									//树节点点击问题
									function zTreeOnClick_water(event, treeId, treeNode) {
										$http({
											method: "GET",
											url: $localStorage.gwUrl +waterUrl + "/findByWaterCode",
											params: {
												waterCode: treeNode.id
											},
										}).success(
											function(res) {
												console.log(treeNode.id);
												console.log(res);
												var _resCode = res.resCode;
												if (_resCode == 1){
													water_ztree_name = res.data.waterName;
													water_ztree_code = res.data.waterCode;
													console.log(water_ztree_code);

													console.log($scope.water_ztree);
												}else{
													$scope.water_ztree= '';
												}
											}
										);
									};
									//水系模态框搜索框
									$scope.select_water = function() {
										$http({
											method: "GET",
											url: $localStorage.gwUrl +waterUrl + "/belongWater",
											params: {
												waterName: $scope.waterName
											},
										}).success(
											function(res) {
												console.log($scope.waterName);
												console.log(res);
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
												$scope.tree = res.data
											}
										);
									};
									//关闭模态框【确定按钮】
									$scope.water_modalOk = function (){
										$("#water_ztree").modal('hide');
                                        $scope.water_ztree = water_ztree_name;
									};
								};
								
								//河流类型
								$scope._riverType = globalParam.getter().data.riverType;
								console.log($scope._riverType);
								$scope.riverType = function () {
							    	$http({
							            method: "get",
										url: $localStorage.gwUrl +dictionaryUrl + "/findDictionary",
										params: {
											type: 9
										},
							    		}).success(
											function (res) {
											console.log(res);
									        $scope.riverTypes = res.data;
									        console.log($scope.riverTypes);
									  }
									);
							    }
								
								$scope.river_type = {
				                    dictValue:$scope._riverType+ "" //""字符串拼接
				                }
								
								$scope.river_Change = function (x) {
								    if (x == null){
                                        $scope.river_Change_dictValue = null;
                                    } else {
                                        console.log(x)
                                        $scope.river_Change_dictValue = x;
                                        console.log($scope.river_Change_dictValue);
                                    }
							    };
								
								//河流等级
								$scope.riverGrade = function () {
							    	$http({
							            method: "get",
										url: $localStorage.gwUrl +dictionaryUrl + "/findDictionary",
										params: {
											type: 1
										},
							    		}).success(
											function (res) {
											console.log(res);
									        $scope.gradeTypes = res.data;
									        console.log($scope.gradeTypes);
									  }
									);
							    }
								$scope.grade_Change = function (river_grade) {
									$scope.grade_Change_name = river_grade.dictName;
									$scope.grade_Change_dictValue = river_grade.dictValue;
									console.log($scope.grade_Change_name);
									console.log($scope.grade_Change_id);
							    }
								
								
								/* 修改 */
                                var jsname = /^[a-zA-Z0-9_-]{4,16}$/;
                                var len =/^\d+(?:\.\d{1,2})?$/;
								$scope.submit = function() {
                                    var data = CKEDITOR.instances.editor.getData();
									console.log(!$scope.length);
                                    console.log(len.test($scope.length));
                                    if (!$scope.riverName || !jsname.test($scope.riverName) == null) {
                                        layer.alert("请完善河流名称", {
                                            skin: 'my-skin',
                                            closeBtn: 1,
                                            anim: 3
                                        });
                                    } else if ($scope.length == null || $scope.length === '' || eval($scope.length)<=0 ||!len.test($scope.length)) {
                                        layer.alert("河流长度请输入正数，最多保留两位小数！", {
                                            skin: 'my-skin',
                                            closeBtn: 1,
                                            anim: 3
                                        });
                                    } else if (!$scope.river_type.dictValue) {
                                        layer.alert("请完善河流类型", {
                                            skin: 'my-skin',
                                            closeBtn: 1,
                                            anim: 3
                                        });
                                    } else if (!$scope.region) {
                                        layer.alert("请完善所属区域", {
                                            skin: 'my-skin',
                                            closeBtn: 1,
                                            anim: 3
                                        });
                                    } else if (!$scope.water_ztree) {
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
                                                id: $scope.editId,
                                                riverName: $scope.riverName,
                                                length: $scope.length,
                                                riverType: $scope.river_Change_dictValue,
                                                regionCode: treeNode_find,
                                                waterCode: water_ztree_code,
                                                startPoint: $scope.startPoint,
                                                endPoint: $scope.endPoint,
                                                overView: data,
                                                remark: $scope.remark
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