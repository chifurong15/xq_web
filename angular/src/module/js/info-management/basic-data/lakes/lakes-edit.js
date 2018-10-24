var basicUrl = "/drainageBasin/v1";
var waterUrl = "/waterSystem/v1";
var riverUrl = "/river/v1";
var lakesUrl = "/lakes/v1";
var reservoirUrl = "/reservoir/v1";
var reachUrl = "/reach/v1";
var dictionaryUrl = "/dictionary/v1";
(function(window, angular) {
	'use strict';

	angular.module("app")
		.controller(
			'lakesEditCtrl', [
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
				function lakesEditCtrl($localStorage, $scope,$location, $log, $q, $rootScope,globalParam, $window,routeService, $http) {
					//湖泊名称
					$scope.lakesName=globalParam.getter().data.lakesName;
					//所属区域
					$scope.region = globalParam.getter().data.regionName;
					//所属水系
					$scope.water_ztree = globalParam.getter().data.waterName;
					//湖泊类型
					$scope.lake_type = globalParam.getter().data.lakesTypeName;
					//湖泊岸别
					$scope.shore_type = globalParam.getter().data.lakeShoreName;
					//经度
					$scope.longitude = globalParam.getter().data.longitude;
					//维度
					$scope.latitude = globalParam.getter().data.latitude;
					//湖泊面积
					$scope.acreage = globalParam.getter().data.acreage;
					//湖泊概述
					$scope.overView= globalParam.getter().data.overView;
					//湖泊备注
					$scope.remark=globalParam.getter().data.remark;
					
					$scope.editId = globalParam.getter().data.id;
                    CKEDITOR.instances.editor.setData($scope.overView);
					
					//湖泊类型
					$scope._lakesType = globalParam.getter().data.lakesType;
					console.log($scope._lakesType);
					$scope.lakeType = function() {
						$http({
							method: "get",
							url: $localStorage.serviceUrl +dictionaryUrl + "/findDictionary",
							params: {
								type: 10
							},
						}).success(
							function(res) {
								console.log(res);
								$scope.lakeTypes = res.data;
								console.log($scope.lakeTypes);
							}
						);
					}
					
					$scope.lake_type = {
	                    dictValue:$scope._lakesType+ "" //""字符串拼接
	                }
					
					$scope.lake_Change = function(x) {
					    if (x == null){
                            $scope.lake_Change_dictValue = null;
                        } else {

                            $scope.lake_Change_dictValue = x;
                            console.log($scope.lake_Change_dictValue);
                        }
					};


                    //判断名称是否重复
                    $scope.isRepeat = function(){
                        var oldName = $scope.lakesName;
                        var newName = globalParam.getter().data.lakesName;
                        if(oldName.toUpperCase() === newName.toUpperCase()){
                            return;
                        }
                        $http({
                            method:'get',
                            url:$localStorage.serviceUrl +lakesUrl + "/isRepeat",
                            params:{
                                name:$scope.lakesName
                            }
                        }).success(
                            function (res) {
                                if (res.resCode === 0){
                                    layer.msg('湖泊名称重复',{time:2000});
                                    clear();
                                }
                            }).error();
                    };

                    $scope.length = 0;
                    $scope.$watch('remark', function (newValue) {
                        $scope.length = newValue.length;
                        if ($scope.length === 512) {
                            layer.msg('总共可以输入512个字符',{time:2000});
                        }
                    });

                    //清空表单
                    var clear = function() {
                        $scope.lakesName='';

                    }
					
					//湖泊岸别
					$scope._lakeshore = globalParam.getter().data.lakeshore;
					console.log($scope._lakeshore);
					$scope.shoreType = function() {
						$http({
							method: "get",
							url: $localStorage.serviceUrl +dictionaryUrl + "/findDictionary",
							params: {
								type: 2
							},
						}).success(
							function(res) {
								console.log(res);
								$scope.shoreTypes = res.data;
								console.log($scope.shoreTypes);
							}
						);
					}
					
					$scope.shore_type = {
	                    dictValue:$scope._lakeshore+ "" //""字符串拼接
	                }
					
					$scope.shore_Change = function(x) {
						$scope.shore_Change_dictValue = x;
						console.log($scope.shore_Change_dictValue);
					}
					//所属区域树模态框【show】
					$scope.regionShow = function(){
						$scope.areaName = '';
						$("#region_ztree").modal('show');
                        $scope.treeList_region(regionTreeUrl);
					};

					//所属区域树节点点击
					var treeNode_find,
						_areaCode;
					function zTreeOnClick(event, treeId, treeNode) {
						$http({
							method: "GET",
							url: $localStorage.serviceUrl +basicUrl + "/findByAreaCode",
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
									url: $localStorage.serviceUrl +basicUrl + "/tree",
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
                    var regionTreeUrl = $localStorage.serviceUrl +basicUrl + "/tree";
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
					$scope.treeList_region = function(id) {
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
								url: $localStorage.serviceUrl +basicUrl + "/fingByRegionName",
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
							url: $localStorage.serviceUrl +waterUrl + "/belongWater",
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
								url: $localStorage.serviceUrl +waterUrl + "/findByWaterCode",
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
								url: $localStorage.serviceUrl +waterUrl + "/belongWater",
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
					
					/* 修改 */
                    var jsname = /^[a-zA-Z0-9_-]{4,16}$/;
                    var len =/^\d+$/;
                    var longrg = /^(\-|\+)?(((\d|[1-9]\d|1[0-7]\d|0{1,3})\.\d{0,6})|(\d|[1-9]\d|1[0-7]\d|0{1,3})|180\.0{0,6}|180)$/;
                    var latreg = /^(\-|\+)?([0-8]?\d{1}\.\d{0,6}|90\.0{0,6}|[0-8]?\d{1}|90)$/;
					$scope.submit = function() {
                        var data = CKEDITOR.instances.editor.getData();

                        if(!$scope.lakesName || !jsname.test($scope.lakesName) == null) {
                            layer.alert("请完善湖泊名称", {
                                skin: 'my-skin',
                                closeBtn: 1,
                                anim: 3
                            });
                        } else if (!$scope.region){
                            layer.alert("请完善所属区域", {
                                skin: 'my-skin',
                                closeBtn: 1,
                                anim: 3
                            });
                        } else if (!$scope.water_ztree){
                            layer.alert("请完善所属水系", {
                                skin: 'my-skin',
                                closeBtn: 1,
                                anim: 3
                            });
                        } else if (!$scope.lake_type.dictValue){
                            layer.alert("请完善湖泊类型", {
                                skin: 'my-skin',
                                closeBtn: 1,
                                anim: 3
                            });
                        } else if (!$scope.shore_type.dictValue){
                            layer.alert("请完善湖泊岸别", {
                                skin: 'my-skin',
                                closeBtn: 1,
                                anim: 3
                            });
                        } else if ($scope.acreage == null || $scope.acreage === '' || eval($scope.acreage)<=0 ||!len.test($scope.acreage)){
                            layer.alert("湖泊面积请输入正数", {
                                skin: 'my-skin',
                                closeBtn: 1,
                                anim: 3
                            });
                        } else if (!longrg.test($scope.longitude)){
                            layer.alert("经度整数部分为0-180,小数部分为0到6位!", {
                                skin: 'my-skin',
                                closeBtn: 1,
                                anim: 3
                            });
                        } else if (!latreg.test($scope.latitude)){
                            layer.alert("纬度整数部分为0-90,小数部分为0到6位!", {
                                skin: 'my-skin',
                                closeBtn: 1,
                                anim: 3
                            });
                        }else {
                            $http({
                                url: $localStorage.serviceUrl +lakesUrl + "/update",
                                method: "post",
                                params: {
                                    id: $scope.editId,
                                    lakesName: $scope.lakesName,
                                    regionCode: treeNode_find,
                                    waterCode: water_ztree_code,
                                    lakesType: $scope.lake_Change_dictValue,
                                    lakeshore: $scope.shore_Change_dictValue,
                                    acreage: $scope.acreage,
                                    longitude: $scope.longitude,
                                    latitude: $scope.latitude,
                                    overView: data,
                                    remark: $scope.remark
                                }
                            }).success(
                                function () {
                                    layer.msg('修改成功', {time: 1000});
                                    routeService.route(535, true);
                                }
                            );
                        }
					}
					
					
					
					// 返回按钮
					$scope.back = function() {
						routeService.route(535, true);
					}

				}
			]);

})(window, angular);