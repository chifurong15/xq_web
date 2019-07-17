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

	angular.module("app").controller('imReach', [
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
		function imReach($localStorage, $scope, $location, $log, $q, $rootScope, globalParam,$window, routeService, moduleService,$http) {

			$scope.classify = 'A'; //河湖库段 A：河段
			/*区域树模态框*/
			$scope.regionShow = function() {
				$scope.modalTreeInfo = {'treeType': 'region'};
				$("#treeModal").modal('show');
			}
		    $scope.$on('zTreeModalClose', function(event,data) {
		    	$scope.regionName = data.treeNodeName;
		    	$scope.regionCode = data.treeNodeId;
		    })



			//搜索
            $scope.moveIcon = true;
			$scope.find = function() {
                if (($scope.reachName === '' || $scope.reachName == null) && ($scope.regionName === '' || $scope.regionName == null) ){
                    $scope.moveIcon = true;
                } else if ($scope.reachName || $scope.regionName){
                    $scope.moveIcon = false;
                } else {
                    $scope.moveIcon = false;
                }
                reGetProducts();
                $scope.paginationConf.currentPage = 1;
                $('.page-num').val($scope.paginationConf.currentPage);
			}
		    $('.query-conditions-form').bind("keydown",function(e){
                var theEvent = e || window.event;
                var code = theEvent.keyCode || theEvent.which || theEvent.charCode;
                if (code == 13) {
                    $scope.find();
                }
            });
            /*重置*/
			$scope.reSet = function(){
				$scope.reachName = null;
				$scope.regionName = null;
				$scope.regionCode = regionCode;
				reGetProducts();
			}

			// 表单分页
			var regionCode =  $localStorage.userLoginInfo && $localStorage.userLoginInfo.userInfo.regionId ? $localStorage.userLoginInfo.userInfo.regionId : null;
			$scope.regionCode = regionCode;
			var reGetProducts = function() {
				$http({
					url: moduleService.getServiceUrl() +reachUrl + "/list",
					method: 'GET',
					params: {
                        reachName: $scope.reachName,
                        regionCode: $scope.regionCode,
                        classify: $scope.classify,
						page: $scope.paginationConf.currentPage,
						size: $scope.paginationConf.itemsPerPage,
						isNext: true,
						queryPatrolReach:true
					},
				}).success(function(res) {
					$scope.paginationConf.totalItems = res.data.total;
					$scope.moduleList = res.data.list;
				}).error(function(error) {});
			};

			// 配置分页基本参数
			$scope.paginationConf = {
				currentPage: $location.search().currentPage ? $location.search().currentPage : 1,
				itemsPerPage: $rootScope.tempSize == null ? 10 : $rootScope.tempSize,
				pagesLength: 5,
				perPageOptions: [5, 10, 20, 50],
				onChange: function() {
					$location.search('currentPage', $scope.paginationConf.currentPage);
                    $rootScope.tempSize  = $scope.paginationConf.itemsPerPage;
				}
			};
			// 通过$watch currentPage和itemperPage,当他们一变化的时候，重新获取数据条目
			$scope.$watch('paginationConf.currentPage + paginationConf.itemsPerPage', reGetProducts);

			// 表单删除
			$scope.moduleDelete = function(id) {
				var layerIndex = layer.confirm('确定删除本条数据吗？', {
					title:'提示',
					btn: ['确定', '取消'] // 按钮
				}, function() {
					$http({
						url: moduleService.getServiceUrl() +reachUrl + "/delete",
						method: "delete",
						params: {
							id: id
						}
					}).success(function success(res) {
						reGetProducts();
						layer.msg('删除成功', {
							time: 1000
						});
					}, function failure(res) {
						layer.msg('删除失败', {
							time: 1000
						});
					});
					layer.close(layerIndex);
				}, function() {});
			};

			$scope.reachAdd = function() {
				routeService.route(1015, false);
			};
			/* 查看河流详情 */
			$scope.reachDetail = function(id) {
				$http({
					url: moduleService.getServiceUrl() +reachUrl + "/detail",
					method: "get",
					params: {
						id: id
					}
				}).success(function(res) {
					if(res.resCode == 1){
						$localStorage.reachDetailData = res.data;
						routeService.route(1016, false);
					}else{
            			layer.msg(res.resMsg || '请求错误,请稍后再试');
					}
				}).error(function(res){
	                layer.msg('服务器异常，请稍后再试');
	            });
			};

			/* 编辑河流信息 */
			$scope.reachEdit = function(id) {
				$http({
					url: moduleService.getServiceUrl() +reachUrl + "/detail",
					method: "get",
					params: {
						id: id
					}
				}).success(function(res) {
					if(res.resCode == 1){
						$localStorage.reachEditData = res.data;
						routeService.route(1017, false);
					}else{
            			layer.msg(res.resMsg || '请求错误,请稍后再试');
					}
				}).error(function(res){
	                layer.msg('服务器异常，请稍后再试');
	            });
			};

			// 上移
            $scope.reachMoveUp = function (id) {
                $http({
                    url: moduleService.getServiceUrl() + reachUrl + "/sortOrder",
                    method: 'GET',
                    params: {
                        id:id,
                        status:0
                    },
                }).success(function(res) {
                	if(res.resCode == 1){
						reGetProducts();
                	}else if(res.resCode == 0) {
                        layer.msg('已经是第一个数据了，不能再向上移动了！');
                        return;
                    }else{
						layer.msg(res.resMsg || '请求错误,请稍后再试');
					}
                }).error(function(res) {
                    layer.msg('服务器异常，请稍后再试');
                });
            };

			// 下移
            $scope.reachDown = function (id) {
                $http({
                    url: moduleService.getServiceUrl() + reachUrl + "/sortOrder",
                    method: 'GET',
                    params: {
                        id:id,
                        status:1
                    },
                }).success(function(res) {
                    if(res.resCode == 1){
						reGetProducts();
                	}else if(res.resCode == 0) {
                        layer.msg('已经是最后一个数据了，不能再向下移动了！');
                        return;
                    }else{
						layer.msg(res.resMsg || '请求错误,请稍后再试');
					}
                }).error(function(res) {
                    layer.msg('服务器异常，请稍后再试');
                });
            };

            $scope.dataExport = function(){
            	layer.confirm('是否导出数据？', {
					title:'提示',
					btn: ['确定', '取消'] // 按钮
				}, function(index) {
					var params = {
						isNext: true,
                        reachName: $scope.reachName,
                        regionCode: $scope.regionCode,
                        classify: $scope.classify
					}
					params = $.param(params);
					window.location.href = moduleService.getServiceUrl() + reachUrl +'/export?'+params;
					layer.close(index);
				});
            }

            $scope.toFileUpload = false;
            $scope.uploadFile = function(id){
            	$scope.waterType = 'reach';
            	$scope.objId = id;
            	$scope.toFileUpload = true;
            }
            $scope.$on('toFileUpload', function(event,data){
            	if(data == false){
            		$scope.toFileUpload = false;
            	}
            });
		}
	]);

})(window, angular);