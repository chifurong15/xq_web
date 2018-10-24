var basicUrl = "/drainageBasin/v1";
var waterUrl = "/waterSystem/v1";
var riverUrl = "/river/v1";
var lakesUrl = "/lakes/v1";
var reservoirUrl = "/reservoir/v1";
var reachUrl = "/reach/v1";
var dictionaryUrl = "/dictionary/v1";
(function(window, angular) {
    'use strict';

    angular.module("app").controller(
        'imReachEdit',
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
            function imReachEdit($localStorage, $scope, $location, $log,$q, $rootScope, globalParam,$window, routeService, $http) {
				$scope.editId = globalParam.getter().data.id;
				console.log($scope.editId);
				//河湖库详情
				$scope.sort=globalParam.getter().data.classify;
				console.log($scope.sort);
				$scope.reachFName = globalParam.getter().data.reachName;
				$scope.alias = globalParam.getter().data.alias;
				$scope.water_quality = globalParam.getter().data.waterGradeName;
				$scope.deposit_status = globalParam.getter().data.siltyName;
				$scope.river_part = globalParam.getter().data.greadName;
				$scope.river_shore = globalParam.getter().data.shoreName;
				if($scope.sort === 'A'){
					$scope.riverBox = true;
					$scope.val='河段';
					console.log('Hello'+$scope.sort);
					$scope.region = globalParam.getter().data.regionName;
					$scope.water_ztree = globalParam.getter().data.waterName;
					$scope.river_ztree = globalParam.getter().data.pName;
					$scope.res_Change_value = globalParam.getter().data.greadName;
					
				}else if($scope.sort === 'B'){
					$scope.lakesBox = true;
					$scope.val='湖段';
					console.log('Hello'+$scope.sort);
					$scope.region = globalParam.getter().data.regionName;
					$scope.water_ztree = globalParam.getter().data.waterName;
					$scope.lakes_ztree = globalParam.getter().data.pName;
				}else if($scope.sort === 'C'){
					$scope.reservoirBox = true;
					$scope.val='库段';
					console.log('Hello'+$scope.sort);
					$scope.region = globalParam.getter().data.regionName;
					$scope.water_ztree = globalParam.getter().data.waterName;
					$scope.reservoir_ztree = globalParam.getter().data.pName;
				}else{}	
				$scope.startPoint = globalParam.getter().data.startPoint;
				$scope.endPoint = globalParam.getter().data.endPoint;
				$scope.whether_mountain = globalParam.getter().data.whetherName;
				$scope.whether_virtual = globalParam.getter().data.isVirtualName;
				$scope.length = globalParam.getter().data.length;
				$scope.width = globalParam.getter().data.width;
				$scope.throughArea = globalParam.getter().data.throughArea;
				$scope.overView = globalParam.getter().data.overView;
                CKEDITOR.instances.editor.setData($scope.overView);

				
                var riverArr = ['江', '河', '水', '川', '郭勒', '高勒', '曲', '藏布', '溪', '沟', '港', '汊', '塘', '浜', '渠', '濠'];
				var lakesArr = ['湖', '泊', '淖', '淀', '池', '塘', '潭', '渊', '沼', '泽', '荡', '洼', '淖尔', '诺尔', '海', '海子','洋', '高壁', '泡', '错', '措', '雍错', '茶卡', '那', '逊湖', '措钦', '德加'];
				var reservoirArr = ['水库'];
				// 定义对象数组
				var objArr = {
					'河段': ['河段', 'riverBox', '/riverAdd'],
					'湖段': ['湖段', 'lakesBox', '/lakesAdd'],
					'库段': ['库段', 'reservoirBox', '/reservoirAdd']
				};
				var val = '';
				var act = '';
				var _status;
				
				//初始化判断河湖库input是否有值
				$scope.reachName = function (){
					$scope.name_change();
				}
				$scope.name_change = function (){
					
	                for(var i=0; i<riverArr.length; i++){
	                	if($scope.reachFName.indexOf(riverArr[i]) != -1){
	                		val = '河段';
                            $scope.bankSides = $scope.riveShores;
	                		_status =1 ;
//			                		 return;
	                	}
	                }
	
	                for(var j=0; j<lakesArr.length; j++){
	                	if($scope.reachFName.indexOf(lakesArr[j]) != -1){
	                		val = '湖段';
                            $scope.bankSides = $scope.lakesShores;
	                		_status =2 ;
//			                		 return;
	                	}
	                }
	
	                for(var k=0; k<reservoirArr.length; k++){
	                	if($scope.reachFName.indexOf(reservoirArr[k]) != -1){
	                		val = '库段';
                            $scope.bankSides = $scope.reservoirShores;
	                		_status =3 ;
//			                		 return;
	                	}
	                }
	                
					act = !!objArr[val] && objArr[val].length > 0 ? objArr[val][2] : '';
					$('#arrForm').attr("action", act);
					console.log(act);
					$('#val').html(val);
					for(var i in objArr){
						
		                if(val === objArr[i][0]){
		                	console.log('block: '+objArr[i][1]);
		                    $('#'+objArr[i][1]).css('display', 'block');	// div显示
		                }else{
		                	console.log('none: '+objArr[i][1]);
		                    $('#'+objArr[i][1]).css('display', 'none');		// div隐藏
		                }
		            }
		            val = '';	// 还原
		            console.log(val);
				};


                //判断名称是否重复
                $scope.isRepeat = function(){
                    var oldName = $scope.reachFName;
                    var newName = globalParam.getter().data.reachName;
                    if(oldName.toUpperCase() === newName.toUpperCase()){
                        return;
                    }
                    $http({
                        method:'get',
                        url:$localStorage.serviceUrl_watersource +reachUrl + "/isRepeat",
                        params:{
                            name:$scope.reachFName
                        }
                    }).success(
                        function (res) {
                            if (res.resCode === 0){
                                layer.msg('名称重复',{time:2000});
                                clear();
                            }
                        }).error();
                };

                //清空表单
                var clear = function() {
                    $scope.reachFName='';

                }
				
				//水质等级
				$scope.waterQualityGrade = globalParam.getter().data.waterGrade;
            	console.log($scope.waterQualityGrade);  //取出当前数据 mainClassId
				$scope.waterQuality = function() {
					$http({
						method: "get",
						url: $localStorage.serviceUrl_watersource +dictionaryUrl + "/findDictionary",
						params: {
							type: 7
						},
					}).success(
						function(res) {
							console.log(res);
							$scope.waterQualitys = res.data;
							console.log($scope.waterQualitys);
						}
					);
				}
				$scope.water_quality = {
                    dictValue:$scope.waterQualityGrade+ "" //""字符串拼接
                }
				
                $scope.quality_Change = function (x) {
				    if (x == null){
                        $scope.quality_Change_x = null;
                    } else {

                        $scope.quality_Change_x = x;
                        console.log($scope.quality_Change_x);
                    }
			    }
                
				//淤积情况
				$scope.depositCase = globalParam.getter().data.silty;
            	console.log($scope.depositCase);  //取出当前数据 silty
				$scope.deposit = function() {
					$http({
						method: "get",
						url: $localStorage.serviceUrl_watersource +dictionaryUrl + "/findDictionary",
						params: {
							type: 8
						},
					}).success(
						function(res) {
							console.log(res);
							$scope.deposits = res.data;
							console.log($scope.deposits);
						}
					);
				}
				
				$scope.deposit_status = {
                    dictValue:$scope.depositCase + "" //""字符串拼接
                }
				
                $scope.deposit_Change = function (x) {
				    if (x == null){
                        $scope.deposit_Change_x = null;
                    } else {

                        $scope.deposit_Change_x = x;
                        console.log($scope.deposit_Change_x);
                    }
			    }
				
				//河湖库级别
				$scope.rivePartLevel = globalParam.getter().data.grade;
            	console.log($scope.rivePartLevel);  //取出当前数据grade
				$scope.rivePart = function() {
					$http({
						method: "get",
						url: $localStorage.serviceUrl_watersource +dictionaryUrl + "/findDictionary",
						params: {
						type: 1
						},
					}).success(
						function(res) {
							console.log(res);
							$scope.riveParts = res.data;
                            $scope.dutyLevels = $scope.riveParts;
							console.log($scope.riveParts);
						}
					);
				}
				
				$scope.river_part = {
                    dictValue:$scope.rivePartLevel + "" //""字符串拼接
                }
				
                $scope.rp_Change = function (x) {
				    if (x == null){
                        $scope.rp_Change_x = null;
                    } else {

                        $scope.rp_Change_x = x;
                        console.log($scope.rp_Change_x);
                    }
			    }
                
				
				//是否位于山区
				$scope.isMountain = globalParam.getter().data.whether;
            	console.log($scope.isMountain);  //取出当前数据
				$scope.mountain = function() {
					$http({
						method: "get",
						url: $localStorage.serviceUrl_watersource +dictionaryUrl + "/findDictionary",
						params: {
						type: 6
						},
					}).success(
						function(res) {
							console.log(res);
							$scope.mountains = res.data;
							console.log($scope.mountains);
						}
					);
				}
				
				$scope.whether_mountain = {
                    dictValue:$scope.isMountain + "" //""字符串拼接
                }
				
				$scope.wm_Change = function(x) {
				    if (x == null){
                        $scope.wm_Change_x = null;
                    } else {

                        $scope.wm_Change_x = x;
                        console.log($scope.wm_Change_x);
                    }
				}
				
				//是否虚拟
				$scope.isVirtual = globalParam.getter().data.isVirtual;
            	console.log($scope.isVirtual);  //取出当前数据
				$scope.virtual = function() {
					$http({
						method: "get",
						url: $localStorage.serviceUrl_watersource +dictionaryUrl + "/findDictionary",
						params: {
						type: 6
						},
					}).success(
						function(res) {
							console.log(res);
							$scope.virtuals = res.data;
							console.log($scope.virtuals);
						}
					);
				}
				
				$scope.whether_virtual = {
                    dictValue:$scope.isVirtual + "" //""字符串拼接
                }
				
				$scope.wv_Change = function(x) {
				    if (x == null){
                        $scope.wv_Change_x = null;
                    } else {

                        $scope.wv_Change_x = x;
                        console.log($scope.wv_Change_x);
                    }
				}
				
				//河段岸别
				$scope.rivePartShore = globalParam.getter().data.shore;
            	console.log($scope.rivePartShore);  //取出当前数据shore
				$scope.riveShore = function() {
					$http({
						method: "get",
						url: $localStorage.serviceUrl_watersource +dictionaryUrl + "/findDictionary",
						params: {
						    type:4
						},
					}).success(
						function(res) {
							console.log(res);
							$scope.riveShores = res.data;
							$scope.bankSides = $scope.riveShores;
							console.log($scope.riveShores);
						}
					);
				}
				
				$scope.river_shore = {
                    dictValue:$scope.rivePartShore + "" //""字符串拼接
                }
				
				$scope.rs_Change = function(x) {
				    if (x == null){
                        $scope.rs_Change_x = null;
                    } else {

                        $scope.rs_Change_x = x;
                        console.log($scope.rs_Change_x);
                    }
				}
				
				//湖段岸别
				$scope.lakesPartShore = globalParam.getter().data.shore;
            	console.log($scope.lakesPartShore);  //取出当前数据shore
				$scope.lakesShore = function() {
					$http({
						method: "get",
						url: $localStorage.serviceUrl_watersource +dictionaryUrl + "/findDictionary",
						params: {
						type:2
						},
					}).success(
						function(res) {
							console.log(res);
							$scope.lakesShores = res.data;
							$scope.bankSides = $scope.lakesShores;
							console.log($scope.lakesShores);
						}
					);
				}
				
				$scope.lakes_shore = {
                    dictValue:$scope.lakesPartShore + "" //""字符串拼接
                }
				
				$scope.ls_Change = function(x) {
				    if (x == null){
                        $scope.ls_Change_x = null;
                    } else {

                        console.log($scope.ls_Change_x);
                        $scope.ls_Change_x = x;
                    }
                }

				//库段岸别
				$scope.reservoirPartShore = globalParam.getter().data.shore;
            	console.log($scope.reservoirPartShore);  //取出当前数据shore
				$scope.reservoirShore = function() {
					$http({
						method: "get",
						url: $localStorage.serviceUrl_watersource +dictionaryUrl + "/findDictionary",
						params: {
						type:3
						},
					}).success(
						function(res) {
							console.log(res);
							$scope.reservoirShores = res.data;
                            $scope.bankSides = $scope.reservoirShores;
							console.log($scope.reservoirShores);
						}
					);
				}
				
				$scope.reservoir_shore = {
                    dictValue:$scope.reservoirPartShore + "" //""字符串拼接
                }
				
				$scope.res_Change = function(x) {
				    if (x == null){
                        $scope.res_Change_x = null;
                    } else {

                        $scope.res_Change_x = x;
                        console.log($scope.res_Change_x);
                    }
				}



                var regionAndUserTree;
                //所属区域树模态框【show】
                $scope.regionShow = function(){
                	$scope.areaName = '';
                    $("#region_ztree").modal('show');
                    $scope.treeList();
                };
                var setting1 = {
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
                        beforeExpand: zTreeOnExpands,
                        onClick: zTreeOnClicks
                    }
                };
                //所属区域树节点点击
                var treeNode_find,
                    _areaCode,
                    _grade;
                function zTreeOnClicks(event,treeId,treeNode){
                    console.log(treeNode)
                    console.log(treeNode.regionLevel)
                    console.log('===========zTreeOnClick===========')
                    $http({
                        method: "GET",
                        url: $localStorage.serviceUrl_watersource +basicUrl + "/tree",
                        params: {
                            parentCode: treeNode.id,
                        },
                    }).success(
                        function(res) {
                            console.log(res);
                            treeNode_find = treeNode.id,
                                console.log(res);
                            _areaCode = treeNode.name;
                            console.log(_areaCode);
                            var _resCode = res.resCode;
                            _grade = res.data.grade;
                            console.log(_grade);
                            if (_resCode == 1){
                                // $scope.region = _areaCode;
                                console.log($scope.region);
                            }else{
                                $scope.region= '';
                            }
                            //改变区域树数值，清空水系、河流数值
                            $scope.water_ztree = '';
                            $scope.river_ztree ='';
                            // $scope.rivePart();

                        }
                    );
                };


                function zTreeOnExpands(treeId,treeNode){
                    console.log('===========zTreeOnExpand===========')
                    var cnodes = treeNode.children;
                    if (cnodes !=null && cnodes.length > 0){
                        return;
                    }
                    $http({
                        method: "GET",
                        url: $localStorage.serviceUrl_watersource +basicUrl + "/tree",
                        params: {
                            parentCode:treeNode.id
                        },
                    }).success(
                        function(res) {
                            console.log(res);
                            regionAndUserTree.addNodes(treeNode,res.data,true);
                        }
                    );
                }

                $scope.treeList = function(regionTreeUrl){
                    console.log(regionTreeUrl)
                    $http({
                        method: "GET",
                        url: $localStorage.serviceUrl_watersource +basicUrl + "/tree",
                        dataType:'json'
                    }).success(
                        function(data) {
                            regionAndUserTree = $.fn.zTree.init($("#regionTree"), setting1, data.data);
                            console.log(regionAndUserTree)
                        }
                    ).error(function() {});
                }
				//区域模态框搜索框
				$scope.select_region = function() {
					if($scope.areaName == null || $scope.areaName == ''){
						$scope.treeList_region(regionTreeUrl);
					}else{
						$http({
							method: "GET",
							url: $localStorage.serviceUrl_watersource +basicUrl + "/fingByRegionName",
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
                    $scope.rivePart();
                };
				
				
				//水系选择模态框【show】
				var    water_ztree_node,
						water_ztree_name,
						water_ztree_code;
				$scope.waterShow = function() {
					$("#water_ztree").modal('show');
					//初始化水系树
					$http({
						method: "get",
						url: $localStorage.serviceUrl_watersource +waterUrl + "/belongWater",
						params: {
							areaCode:treeNode_find
						},
					}).success(
						function(res) {
							console.log(treeNode_find);
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
							url: $localStorage.serviceUrl_watersource +waterUrl + "/findByWaterCode",
							params: {
								waterCode: treeNode.id
							},
						}).success(
							function(res) {
								water_ztree_node = treeNode.id;
								console.log(water_ztree_node);
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
							url: $localStorage.serviceUrl_watersource +waterUrl + "/belongWater",
							params: {
								waterName: $scope.waterName,
								areaCode:treeNode_find
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
				
				//河流选择模态框【show】
				var 	river_ztree_node,
						river_ztree_name,
						river_ztree_code;
				$scope.riverShow = function() {
					$("#river_ztree").modal('show');
					//生成河流树
					$http({
						method: "get",
						url: $localStorage.serviceUrl_watersource +waterUrl + "/riverLakesReservoir",
						params: {
							areaCode:treeNode_find,
							waterCode:water_ztree_node,
							type:"A"
						},
					}).success(
						function(res) {
							console.log(treeNode_find);
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
							$.fn.zTree.init($("#riverZtree"), setting1, zNodes1);
							$scope.tree = res.data
						}
					);
					
					//树节点点击问题
					function zTreeOnClick_water(event, treeId, treeNode) {
						$http({
							method: "GET",
							url: $localStorage.serviceUrl_watersource +waterUrl + "/findByCode",
							params: {
								code: treeNode.id,
								type:"A"
							},
						}).success(
							function(res) {
								console.log(res);
								console.log(treeNode.id);
								var _resCode = res.resCode;
								if (_resCode == 1){
									river_ztree_name = res.data.name;
									console.log(river_ztree_name);
									river_ztree_code = res.data.id;
									console.log(river_ztree_code);

									console.log($scope.river_ztree);
								}else{
									$scope.river_ztree= '';
								}
							}
						);
					};
					//河流模态框搜索框
					$scope.select_river = function() {
						$http({
							method: "GET",
							url: $localStorage.serviceUrl_watersource +waterUrl + "/riverLakesReservoir",
							params: {
								areaCode:treeNode_find,
								waterCode:water_ztree_node,
								type:"A",
								name:$scope.riverName
							},
						}).success(
							function(res) {
								console.log($scope.riverName);
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
								$.fn.zTree.init($("#riverZtree"), setting1, zNodes1);
								$scope.tree = res.data
							}
						);
					};
					
					//关闭模态框【确定按钮】
					$scope.river_modalOk = function (){
						$("#river_ztree").modal('hide');
                        $scope.river_ztree = river_ztree_name;
					};
				};
				
				
				//湖泊选择模态框【show】
				var 	lakes_ztree_node,
						lakes_ztree_name,
						lakes_ztree_code;
				$scope.lakesShow = function() {
					$("#lakes_ztree").modal('show');
					//生成湖泊树
					$http({
						method: "get",
						url: $localStorage.serviceUrl_watersource +waterUrl + "/riverLakesReservoir",
						params: {
							areaCode:treeNode_find,
							waterCode:water_ztree_node,
							type:"B"
						},
					}).success(
						function(res) {
							console.log(treeNode_find);
							console.log(res);
							var setting1 = {
								enable: true,
								callback: {
									onClick: zTreeOnClick_lakes
								}
							};
							var zNodes1 = [{
								name: "根节点",
								icon: "/vendor/zTree_v3/css/zTreeStyle/img/diy/10.png",
								open: true,
								children: res.data
							}];
							$.fn.zTree.init($("#lakesZtree"), setting1, zNodes1);
							$scope.tree = res.data
						}
					);
					
					//树节点点击问题
					function zTreeOnClick_lakes(event, treeId, treeNode) {
						$http({
							method: "GET",
							url: $localStorage.serviceUrl_watersource +waterUrl + "/findByCode",
							params: {
								code: treeNode.id,
								type:"B"
							},
						}).success(
							function(res) {
								console.log(res);
								console.log(treeNode.id);
								var _resCode = res.resCode;
								if (_resCode == 1){
									lakes_ztree_name = res.data.name;											
									console.log(lakes_ztree_name);
									lakes_ztree_code = res.data.id;
									console.log(lakes_ztree_code);

									console.log($scope.river_ztree);
								}else{
									$scope.lakes_ztree= '';
								}
							}
						);
					};
					//河流模态框搜索框
					$scope.select_lakes = function() {
						$http({
							method: "GET",
							url: $localStorage.serviceUrl_watersource +waterUrl + "/riverLakesReservoir",
							params: {
								areaCode:treeNode_find,
								waterCode:water_ztree_node,
								type:"B",
								name:$scope.lakesName
							},
						}).success(
							function(res) {
								console.log($scope.lakesName);
								console.log(res);
								var setting1 = {
									enable: true,
									callback: {
										onClick: zTreeOnClick_lakes
									}
								};
								var zNodes1 = [{
									name: "根节点",
									icon: "/vendor/zTree_v3/css/zTreeStyle/img/diy/10.png",
									open: true,
									children: res.data
								}];
								$.fn.zTree.init($("#lakesZtree"), setting1, zNodes1);
								$scope.tree = res.data
							}
						);
					};
					
					//关闭模态框【确定按钮】
					$scope.lakes_modalOk = function (){
						$("#lakes_ztree").modal('hide');
                        $scope.lakes_ztree = lakes_ztree_name;
					};
				};
				
				//水库选择模态框【show】
				var 	reservoir_ztree_node,
						reservoir_ztree_name,
						reservoir_ztree_code;
				$scope.reservoirShow = function() {
					$("#reservoir_ztree").modal('show');
					//生成水库树
					$http({
						method: "get",
						url: $localStorage.serviceUrl_watersource +waterUrl + "/riverLakesReservoir",
						params: {
							areaCode:treeNode_find,
							waterCode:water_ztree_node,
							type:"C"
						},
					}).success(
						function(res) {
							console.log(treeNode_find);
							console.log(res);
							var setting1 = {
								enable: true,
								callback: {
									onClick: zTreeOnClick_reservoir
								}
							};
							var zNodes1 = [{
								name: "根节点",
								icon: "/vendor/zTree_v3/css/zTreeStyle/img/diy/10.png",
								open: true,
								children: res.data
							}];
							$.fn.zTree.init($("#reservoirZtree"), setting1, zNodes1);
							$scope.tree = res.data
						}
					);
					
					//树节点点击问题
					function zTreeOnClick_reservoir(event, treeId, treeNode) {
						$http({
							method: "GET",
							url: $localStorage.serviceUrl_watersource +waterUrl + "/findByCode",
							params: {
								code: treeNode.id,
								type:"C"
							},
						}).success(
							function(res) {
								console.log(res);
								console.log(treeNode.id);
								var _resCode = res.resCode;
								if (_resCode == 1){
									reservoir_ztree_name = res.data.name;											
									console.log(lakes_ztree_name);
									reservoir_ztree_code = res.data.id;
									console.log(reservoir_ztree_code);

									console.log($scope.reservoir_ztree);
								}else{
									$scope.reservoir_ztree= '';
								}
							}
						);
					};
					//河流模态框搜索框
					$scope.select_reservoir = function() {
						$http({
							method: "GET",
							url: $localStorage.serviceUrl_watersource +waterUrl + "/riverLakesReservoir",
							params: {
								areaCode:treeNode_find,
								waterCode:water_ztree_node,
								type:"C",
								name:$scope.reservoirName
							},
						}).success(
							function(res) {
								console.log($scope.reservoirName);
								console.log(res);
								var setting1 = {
									enable: true,
									callback: {
										onClick: zTreeOnClick_reservoir
									}
								};
								var zNodes1 = [{
									name: "根节点",
									icon: "/vendor/zTree_v3/css/zTreeStyle/img/diy/10.png",
									open: true,
									children: res.data
								}];
								$.fn.zTree.init($("#reservoirZtree"), setting1, zNodes1);
								$scope.tree = res.data
							}
						);
					};
					
					//关闭模态框【确定按钮】
					$scope.reservoir_modalOk = function (){
						$("#reservoir_ztree").modal('hide');
                        $scope.reservoir_ztree = reservoir_ztree_name;
					};
				};
					
				//新增河湖库数据
				var jsname = /^[a-zA-Z0-9_-]{4,16}$/;
                var len =/^\d+(?:\.\d{1,2})?$/;
				$scope.add = function() {
					if(!$scope.reachFName || !jsname.test($scope.reachFName) == null) {
						layer.alert("请完善信息", {
							skin: 'my-skin',
							closeBtn: 1,
							anim: 3
						});
					} else if ($scope.reachFName.substr(-2) != '河段' && $scope.reachFName.substr(-2) !='湖段' && $scope.reachFName.substr(-2) != '库段'){
                        layer.alert("请根据命名规则命名", {
                            skin: 'my-skin',
                            closeBtn: 1,
                            anim: 3
                        });
                    }else if(_status == 1){//新增河流
                        var data = CKEDITOR.instances.editor.getData();

                        if (!$scope.alias) {
                            layer.alert("请完善河湖库别名", {
                                skin: 'my-skin',
                                closeBtn: 1,
                                anim: 3
                            });
                        } else if (!$scope.water_quality) {
                            layer.alert("请完善水质等级", {
                                skin: 'my-skin',
                                closeBtn: 1,
                                anim: 3
                            });
                        } else if (!$scope.deposit_status) {
                            layer.alert("请完善淤积情况", {
                                skin: 'my-skin',
                                closeBtn: 1,
                                anim: 3
                            });
                        } else if (!$scope.river_shore) {
                            layer.alert("请完善河段岸别", {
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
                        } else if (!$scope.river_ztree) {
                            layer.alert("请完善所属河流", {
                                skin: 'my-skin',
                                closeBtn: 1,
                                anim: 3
                            });
                        } else if (!$scope.river_part.dictValue) {
                            layer.alert("请完善河湖库级别", {
                                skin: 'my-skin',
                                closeBtn: 1,
                                anim: 3
                            });
                        }  else if (!$scope.whether_mountain.dictValue){
                            layer.alert("请完善山区信息", {
                                skin: 'my-skin',
                                closeBtn: 1,
                                anim: 3
                            });
                        } else if (!$scope.whether_virtual.dictValue){
                            layer.alert("请完善虚拟信息", {
                                skin: 'my-skin',
                                closeBtn: 1,
                                anim: 3
                            });
                        } else if ($scope.length == null || $scope.length === '' || eval($scope.length)<=0 ||!len.test($scope.length)){
                            layer.alert("请完善长度,长度为正数，最大保留2位小数", {
                                skin: 'my-skin',
                                closeBtn: 1,
                                anim: 3
                            });
                        } else if ($scope.width == null || $scope.width === '' || eval($scope.width)<=0 ||!len.test($scope.width)){
                            layer.alert("请完善宽度,长度为正数，最大保留2位小数", {
                                skin: 'my-skin',
                                closeBtn: 1,
                                anim: 3
                            });
                        } else {
                            $http({
                                method: "post",
                                url: $localStorage.serviceUrl_watersource +reachUrl + "/update",
                                params: {
                                    id: $scope.editId,
                                    reachName: $scope.reachFName,
                                    alias: $scope.alias,
                                    waterGrade: $scope.quality_Change_x,
                                    silty: $scope.deposit_Change_x,
                                    grade: $scope.rp_Change_x,
                                    shore: $scope.rs_Change_x,
                                    regionCode: treeNode_find,
                                    waterCode: water_ztree_node,
                                    theirCode: river_ztree_code,
                                    startPoint: $scope.startPoint,
                                    endPoint: $scope.endPoint,
                                    whether: $scope.wm_Change_x,
                                    isVirtual: $scope.wv_Change_x,
                                    length: $scope.length,
                                    width: $scope.width,
                                    throughArea: $scope.throughArea,
                                    overView: $scope.overView
                                },
                            }).success(
                                function () {
                                    layer.msg('修改成功！', {time: 2000});
                                    routeService.route(52, true);
                                })
                        }
					}else if(_status == 2){//新增湖泊
                        var data = CKEDITOR.instances.editor.getData();

                        if (!$scope.alias) {
                            layer.alert("请完善河湖库别名", {
                                skin: 'my-skin',
                                closeBtn: 1,
                                anim: 3
                            });
                        } else if (!$scope.water_quality) {
                            layer.alert("请完善水质等级", {
                                skin: 'my-skin',
                                closeBtn: 1,
                                anim: 3
                            });
                        } else if (!$scope.deposit_status) {
                            layer.alert("请完善淤积情况", {
                                skin: 'my-skin',
                                closeBtn: 1,
                                anim: 3
                            });
                        } else if (!$scope.lakes_shore) {
                            layer.alert("请完善湖段岸别", {
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
                        } else if (!$scope.lakes_ztree) {
                            layer.alert("请完善所属湖泊", {
                                skin: 'my-skin',
                                closeBtn: 1,
                                anim: 3
                            });
                        } else if (!$scope.river_part.dictValue) {
                            layer.alert("请完善河湖库级别", {
                                skin: 'my-skin',
                                closeBtn: 1,
                                anim: 3
                            });
                        } else {

                            $http({
                                method: "post",
                                url: $localStorage.serviceUrl_watersource +reachUrl + "/update",
                                params: {
                                    id: $scope.editId,
                                    reachName: $scope.reachFName,
                                    alias: $scope.alias,
                                    waterGrade: $scope.quality_Change_x,
                                    silty: $scope.deposit_Change_x,
                                    grade: $scope.rp_Change_x,
                                    shore: $scope.ls_Change_x,
                                    regionCode: treeNode_find,
                                    waterCode: water_ztree_node,
                                    theirCode: lakes_ztree_code,
                                    startPoint: $scope.startPoint,
                                    endPoint: $scope.endPoint,
                                    whether: $scope.wm_Change_x,
                                    isVirtual: $scope.wv_Change_x,
                                    length: $scope.length,
                                    width: $scope.width,
                                    throughArea: $scope.throughArea,
                                    overView: $scope.overView
                                },
                            }).success(
                                function () {
                                    layer.msg('修改成功！', {time: 2000});
                                    routeService.route(52, true);
                                }
                            );
                        }
					}else if(_status == 3){//新增水库
                        var data = CKEDITOR.instances.editor.getData();

                        if (!$scope.alias) {
                            layer.alert("请完善河湖库别名", {
                                skin: 'my-skin',
                                closeBtn: 1,
                                anim: 3
                            });
                        } else if (!$scope.water_quality) {
                            layer.alert("请完善水质等级", {
                                skin: 'my-skin',
                                closeBtn: 1,
                                anim: 3
                            });
                        } else if (!$scope.deposit_status) {
                            layer.alert("请完善淤积情况", {
                                skin: 'my-skin',
                                closeBtn: 1,
                                anim: 3
                            });
                        } else if (!$scope.reservoir_shore) {
                            layer.alert("请完善库段岸别", {
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
                        } else if (!$scope.reservoir_ztree) {
                            layer.alert("请完善所属水库", {
                                skin: 'my-skin',
                                closeBtn: 1,
                                anim: 3
                            });
                        } else if (!$scope.river_part.dictValue) {
                            layer.alert("请完善河湖库级别", {
                                skin: 'my-skin',
                                closeBtn: 1,
                                anim: 3
                            });
                        }else {

                            $http({
                                method: "post",
                                url: $localStorage.serviceUrl_watersource +reachUrl + "/update",
                                params: {
                                    id: $scope.editId,
                                    reachName: $scope.reachFName,
                                    alias: $scope.alias,
                                    waterGrade: $scope.quality_Change_x,
                                    silty: $scope.deposit_Change_x,
                                    grade: $scope.rp_Change_x,
                                    shore: $scope.res_Change_x,
                                    regionCode: treeNode_find,
                                    waterCode: water_ztree_node,
                                    theirCode: reservoir_ztree_code,
                                    startPoint: $scope.startPoint,
                                    endPoint: $scope.endPoint,
                                    whether: $scope.wm_Change_x,
                                    isVirtual: $scope.wv_Change_x,
                                    length: $scope.length,
                                    width: $scope.width,
                                    throughArea: $scope.throughArea,
                                    overView: $scope.overView
                                },
                            }).success(
                                function () {
                                    layer.msg('修改成功！', {time: 2000});
                                    routeService.route(56, true);
                                }
                            );
                        }
					}else{
						layer.msg('数据失败！',{time:2000});
					}

				}


                //增加管理人员
                $scope.reachadmins = [{chairman: "",dutyLevel:"",dutyType:"",bankSide:"",check:""}];
                $scope.addReachadmin = function($index){
                    $scope.reachadmins.splice($index + 1, 0,
                        {chairman: "",dutyLevel:"",dutyType:"",bankSide:"",check:""});
                }

                //删除管理人员
                $scope.delReachadmin = function($index){
                    $scope.reachadmins.splice($index, 1);
                }

                $scope.back = function() {
                    // 跳转到菜单页面
                    routeService.route(56, true);
                }


                var regionTree;
                $scope.adminTree = function () {
                    $("#myModal_ztree_one").modal('show');
                    //行政区划树初始化
                    var regionAndUserTreeUrl = $localStorage.serviceUrl_watersource +basicUrl + "/regionAndUserTree";
                    $scope.treeLists(regionAndUserTreeUrl);
                }

                //搜索
                $scope.find = function () {
                    $http({
                        method: "GET",
                        url: $localStorage.serviceUrl_watersource +basicUrl + "/findByUser",
                        params: {
                            fullName: $scope.pAreaName,
                            areaName: $scope.areaName,
                            page: $scope.paginationConf.currentPage,
                            size: $scope.paginationConf.itemsPerPage,
                            status: -1
                        },
                    }).success(
                        function (resp) {
                            $scope.moveStatus = false;
                            console.log(resp);
                            $scope.paginationConf.totalItems = resp.data.total;
                            $scope.moduleList = resp.data.list;
                        })
                }

                //行政区划树数据
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

                function zTreeOnCheck(event, treeId, treeNode) {
                };

                function zTreeOnClick(event, treeId, treeNode) {
                    console.log(treeNode)
                    console.log(treeNode.regionLevel)
                    console.log('===========zTreeOnClick===========')

                };

                function zTreeOnExpand(treeId, treeNode) {
                    console.log('===========zTreeOnExpand===========')
                    var cnodes = treeNode.children;
                    if (cnodes !=null && cnodes.length > 0){
                        return;
                    }
                    $http({
                        method: "GET",
                        url: $localStorage.serviceUrl_watersource +basicUrl + "/regionAndUserTree",
                        params: {
                            code: treeNode.id,
                            chairmanLevel: treeNode.regionLevel + 1
                        },
                    }).success(
                        function (res) {
                            regionTree.addNodes(treeNode, res.data, true);
                        }
                    );
                }

                $scope.treeLists = function (regionAndUserTreeUrl) {
                    console.log(regionAndUserTreeUrl);
                    $http({
                        method: "GET",
                        url: regionAndUserTreeUrl,
                        dataType: 'json'
                    }).success(
                        function (data) {
                            console.log(data.data)
                            regionTree = $.fn.zTree.init($("#regionTrees"), setting, data.data);
                            console.log(regionTree)
                        }
                    ).error(function () {
                    });
                }

                //履职类型
                $scope.dutyType = function () {
                    $http({
                        method: "get",
                        url: $localStorage.serviceUrl_watersource +reachUrl + "/chairmanType"
                    }).success(
                        function (res) {
                            console.log(res);
                            $scope.dutyTypes = res.data;
                            console.log($scope.dutyTypes);
                        }
                    );
                }
            } ]);

})(window, angular);