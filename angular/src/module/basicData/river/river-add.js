var modulePrefix = "/watersource";
var riverUrl = modulePrefix + "/v1/river";
(function(window, angular) {
	'use strict';
	angular.module("app").controller(
		'imRiverAdd',['$localStorage','$scope','$rootScope','routeService','moduleService','$http','MapUtil','OneMapqueryAdminregionFromMysql',
		function imRiverAdd($localStorage, $scope, $rootScope, routeService, moduleService,$http,MapUtil,OneMapqueryAdminregionFromMysql) {
			$scope.river = {};
			 /*判断名称是否重复*/
            $scope.isRepeat = function(){
            	if(!$scope.river.riverName){
                    return;
                }
                $http({
                    method:'get',
                    url:moduleService.getServiceUrl() + riverUrl + "/isRepeat",
                    params:{
                        name:$scope.river.riverName
                    }
                }).success(function (res) {
                    if (res.resCode === 0){
                        layer.msg('河流名称重复',{time:2000});
                        $scope.river.riverName = '';
                    }
                }).error();
            };
			/*河流类型*/
			$scope.riverTypeList = function() {
				$http({
					method: "get",
					url: moduleService.getServiceUrl() + riverUrl + "/riverType",
                    params:{
					    type: '104'
                    }
				}).success(function(res) {
					if(res.resCode == 1){
						$scope.riverTypes = res.data;
					}else{
            			layer.msg(res.resMsg || '请求错误,请稍后再试');
					}
				}).error(function(res){
	                layer.msg('服务器异常，请稍后再试');
	            });
			}
			$scope.riverFeatureList = function() {
				$http({
					method: "get",
					url: moduleService.getServiceUrl() + riverUrl + "/riverFeature",
				}).success(function(res) {
					if(res.resCode == 1){
						$scope.riverFeatureList = res.data;
					}else{
            			layer.msg(res.resMsg || '请求错误,请稍后再试');
					}
				}).error(function(res){
	                layer.msg('服务器异常，请稍后再试');
	            });
			}

			/*所属区域树模态框*/
			$scope.regionShow = function(type){
				if(type == 'multiple'){
					$scope.modalTreeInfo = {'treeType': 'region' ,'setting': {'check': {'enable': true,'chkStyle': "checkbox",'chkboxType': { "Y": "", "N": "" }}}};
				}else{
					$scope.modalTreeInfo = {'treeType': 'region'};
				}
				$("#treeModal").modal('show');
			};
			/*水系树模态框*/
			$scope.waterShow = function() {
				$scope.modalTreeInfo = {'treeType': 'water'};
				$("#treeModal").modal('show');
			}
			/*断面模态框*/
			$scope.sectionShow = function(section) {
				$scope.section = section;
                $scope.modalTreeInfo = {'treeType': 'section'};
                $("#treeModal").modal('show');
            }
			$scope.$on('zTreeOnClick', function(event,treeNode) { //点击事件通信 返回treeNode参数
				if($scope.modalTreeInfo.treeType == 'region'){
					OneMapqueryAdminregionFromMysql.getRegionData(treeNode.id, treeNode.regionLevel);
					if(MapUtil.isCoordValid(treeNode["longitude"], treeNode["latitude"])){
						if ($localStorage.mapType != "arcgisDynamic") {
                            MapUtil.center2LongLat(treeNode["longitude"],treeNode["latitude"],treeNode["grade"]);
                        }
                    }else {
                        console.warn("定位失败！坐标为空！");//父级能得到值
                        // layer.msg('坐标为空！绘制失败');
                    }
				}
		    });
		    $scope.$on('zTreeModalClose', function(event,data) { //树弹窗关闭事件通信 返回data = {treeNodeId,treeNodeName}
		    	if($scope.modalTreeInfo.treeType == 'region'){
		    		if($scope.modalTreeInfo.setting && $scope.modalTreeInfo.setting.check && $scope.modalTreeInfo.setting.check.enable == true){
		    			$scope.river.throughAreaName = data.treeNodeNames.join(',');
		    			$scope.river.throughArea = data.treeNodeIds.join(',');
		    		}else{
		    			$scope.river.regionName = data.treeNodeName;
		    			$scope.river.regionCode = data.treeNodeId;
		    		}
		    	}else if($scope.modalTreeInfo.treeType == 'water'){
		    		$scope.river.waterName = data.treeNodeName;
		    		$scope.river.waterCode = data.treeNodeId;
		    	}else if($scope.modalTreeInfo.treeType == 'section'){
		    		if($scope.section == 1){
		    			$scope.river.startSectionName = data.treeNodeName;
		    			$scope.river.startSection = data.treeNodeId;
		    		}else if($scope.section == 2){
		    			$scope.river.endSectionName = data.treeNodeName;
		    			$scope.river.endSection = data.treeNodeId;
		    		}
		    	}
		    })

			/*河流新增*/
			var jsname = /^[\u4e00-\u9fa5_a-zA-Z0-9_]{2,16}$/;
			$scope.submit = function() {
				// $scope.river.overView = CKEDITOR.instances.editor.getData();
				if(!$scope.river.riverName || !jsname.test($scope.river.riverName)) {
					layer.msg('河流名称输入有误');
                    return;
				} else if (!$scope.river.regionName){
                    layer.msg('请完善所属区域');
                    return;
                } else if (!$scope.river.waterName){
                	layer.msg('请完善所属水系');
                    return;
                }
                $http({
					method: "post",
					url: moduleService.getServiceUrl() + riverUrl + "/add",
					data: {
                        riverName: $scope.river.riverName,
                        riverCode: $scope.river.riverCode,
						length: $scope.river.length,
						area: $scope.river.area,
						riverType: $scope.river.riverType,
						feature: $scope.river.feature,
						regionCode: $scope.river.regionCode,
						waterCode: $scope.river.waterCode,
						startPoint: $scope.river.startPoint,
						endPoint: $scope.river.endPoint,
						startSection: $scope.river.startSection,
						endSection: $scope.river.endSection,
						throughArea: $scope.river.throughArea,
                        midPointLongitude: $scope.river.midPointLongitude,
                        midPointLatitude: $scope.river.midPointLatitude,
						linePoints: $scope.river.linePoints,
                        spatialData: $scope.river.spatialData,
						overView: $scope.river.overView,
						remark: $scope.river.remark,
						jsonFiles: JSON.stringify($scope.river.jsonFiles),
                        jsonImages: JSON.stringify($scope.river.jsonImages)
					},
					headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                	transformRequest:function(obj){return $.param(obj)}
				}).success(function(res) {
					if (res.resCode === 1){
                        layer.msg('新增成功',{shift:-1},function(){
                        	$scope.back();
                        });
                    } else {
                        layer.msg(res.resMsg || '请求错误,请稍后再试');
                    }
				}).error(function(res){
					layer.msg('服务器异常，请稍后再试');
				});
			};

			// 返回按钮
			$scope.back = function() {
				routeService.route(105, true);
			}
		}
	]);
})(window, angular);