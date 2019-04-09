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

	var app = angular.module("app");
		app.filter("trustHtml",function($sce){
		   return function (input){
		       return $sce.trustAsHtml(input);
		   }
		})
		app.controller(
			'waterCtrl', [
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
				function waterCtrl($localStorage, $scope,$location, $log, $q, $rootScope,globalParam, $window,routeService,moduleService, $http) {
					$scope.init = function(){}
					// 所属流域
					$scope.belongDrainage = function () {
				    	$http({
				            method: "get",
							url: moduleService.getServiceUrl() + basicUrl + "/findByBasinName",
				    	}).success(function (res) {
						    $scope.belongDrainages = res.data.list;
						    // console.log($scope.belongDrainages,'$scope.belongDrainages')
						});
				    }
					// 表单分页
					var reGetProducts = function() {
						$http({
							url: moduleService.getServiceUrl() + waterUrl + "/list",
							method: 'GET',
							params: {
                                waterName: $scope.water_name,
                                basinCode: $scope.b_Water,
								page: $scope.paginationConf.currentPage,
								size: $scope.paginationConf.itemsPerPage
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
					$scope.overView = function(id){
						$("#overViewBox").modal('show');
						$http({
							url: moduleService.getServiceUrl() + waterUrl + "/detail",
							method: "get",
							params: {
								id: id
							}
						}).success(function(res) {
							if(res.resCode == 1){
								$scope.detailContent = res.data.overView;
							}else{
								layer.msg(res.resMsg || '请求失败,请稍后再试')
							}
						});
					};
					// 表单删除
					$scope.moduleDelete = function(id) {
						var layerIndex = layer.confirm('确定删除本条数据吗？', {
							title:'提示',
							btn: ['确定', '取消'] // 按钮
						}, function() {
							$http({
								url: moduleService.getServiceUrl() +waterUrl + "/delete",
								method: "delete",
								params: {
									id: id
								}
							}).success(function success(res) {
								if(res.resCode == 0) {
										layer.msg('该水系下存在下级河流，请先删除下级内容！',{time:1000});
									} else {
										layer.msg('删除成功！', {time:1000});
									}
									reGetProducts();
								}, function failure(res) {
									layer.msg('删除失败！', {time:1000});
								});
								layer.close(layerIndex);
							}, function() {
						});
					};
					//上移
					$scope.moveUp = function(id){
						$http({
							url: moduleService.getServiceUrl() +waterUrl + "/sortOrder",
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
						}).error(function(error) {});
					}
					//下移
					$scope.moveDown = function(id){
						$http({
							url: moduleService.getServiceUrl() +waterUrl + "/sortOrder",
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
						}).error(function(error) {});
					}

					//搜索
                    $scope.moveIcon = true;
                    $scope.find = function() {
                        if (($scope.b_Water == '' || $scope.b_Water == null) && $scope.water_name == '' ){
                            $scope.moveIcon = true;
                        } else if($scope.water_name || $scope.b_Water){
                            $scope.moveIcon = false;
                        }else {
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
						$scope.water_name = null;
						$scope.b_Water = null;
						$scope.moveIcon = true;
						reGetProducts();
					}
					// 水系新增
					$scope.waterAdd = function() {
						routeService.route(1006, false);
					}
					// 水系详情
					$scope.waterDetail = function(id) {
						$http({
							url: moduleService.getServiceUrl() + waterUrl + "/detail",
							method: "get",
							params: {
								id: id
							}
						}).success(function(res) {
							if(res.resCode == 1){
								$localStorage.waterDetailData = res.data;
								routeService.route(1007, false);
							}else{
								layer.msg(res.resMsg || '请求失败,请稍后再试')
							}
						});
					}
					// 水系编辑
					$scope.waterEdit = function(id) {
						$http({
							url: moduleService.getServiceUrl() + waterUrl + "/detail",
							method: "get",
							params: {
								id: id
							}
						}).success(function(res) {
							if(res.resCode == 1){
								$localStorage.waterEditData = res.data;
								routeService.route(1008, false);
							}else{
								layer.msg(res.resMsg || '请求失败,请稍后再试')
							}
						});
					}

					$scope.dataExport = function(){
		            	layer.confirm('是否导出数据？', {
							title:'提示',
							btn: ['确定', '取消'] // 按钮
						}, function(index) {
							var params = {
								waterName: $scope.water_name,
                                basinCode: $scope.b_Water,
							}
							params = $.param(params);
							window.location.href = moduleService.getServiceUrl() + waterUrl +'/export?'+params;
							layer.close(index);
						});
		            }
				}
			]);
})(window, angular);