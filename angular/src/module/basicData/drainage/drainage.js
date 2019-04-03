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
			'drainageCtrl', [
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
				function drainageCtrl($localStorage, $scope,$location, $log, $q, $rootScope, globalParam,$window,routeService, moduleService, $http) {
					/**
					 * ================================
					 * 描述说明
					 * @author yuanhaitao</br>2018/09/05
					 * @module 流域管理
					 * @version 3.0.0
					 * ================================
					 */

					/*页面初始化方法*/
					$scope.init = function(){
					}

					/*列表上移*/
					$scope.drainageMoveUp = function(id){
						$http({
							url: moduleService.getServiceUrl() + basicUrl + "/sortOrder",
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
					}

					/*列表下移*/
					$scope.drainageDown = function(id){
						$http({
							url: moduleService.getServiceUrl() + basicUrl + "/sortOrder",
							method: 'GET',
							params: {
								id:id,
								status:1
							},
						}).success(function(res) {
							if(res.resCode == 1){
								reGetProducts();
							}else if(res.resCode == 0){
                                layer.msg('已经是最后一个数据了，不能再向下移动了！');
                                return;
							}else{
								layer.msg(res.resMsg || '请求错误,请稍后再试');
							}
						}).error(function(res) {
							layer.msg('服务器异常，请稍后再试');
						});
					}

					/*重置*/
					$scope.reSet = function(){
						$scope.basinName = null;
						$scope.moveIcon = true;
						reGetProducts();
					}
					/*表单分页*/
					var reGetProducts = function() {
						$http({
							url: moduleService.getServiceUrl() + basicUrl + "/list",
							method: 'GET',
							params: {
                                basinName: $scope.basinName,
                                basinCode: $scope.basinCode,
								page: $scope.paginationConf.currentPage,
								size: $scope.paginationConf.itemsPerPage,
								status: -1
							},
						}).success( function(res) {
							if(res.resCode == 1){
								$scope.paginationConf.totalItems = res.data.total;
								$scope.moduleList = res.data.list;
								$('.page-num').val($scope.paginationConf.currentPage);
							}else{
								layer.msg('服务器异常，请稍后再试');
							}
						}).error(function(res) {
							layer.msg('服务器异常，请稍后再试');
						});
					};

					/*配置分页基本参数*/
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
					$scope.$watch('paginationConf.currentPage + paginationConf.itemsPerPage', reGetProducts);

					/*表单删除*/
					$scope.drainageDelete = function(id) {
						var layerIndex = layer.confirm('确定删除本条数据吗？', {
							title:'提示',
							btn: ['确定', '取消']
						}, function() {
							$http({
								url: moduleService.getServiceUrl() + basicUrl + "/delete",
								method: "delete",
								params: {
									id: id
								}
							}).success( function(res) {
								if(res.resCode == 0) {
									layer.msg('该流域下存在下级水系，请先删除下级内容！',{time:1000});
								}else{
									layer.msg('数据删除成功！', {time:1000});
								}
								reGetProducts();
							}).error(function(res) {
								layer.msg('服务器异常，删除失败，请稍后再试');
								layer.close(layerIndex);
							});
						}, function() {});

					};

					/*流域搜索*/
					$scope.moveIcon = true;
					$scope.basinName = '';
					$scope.getSearch = function() {
					
                        if($scope.basinName ==''){
                            $scope.moveIcon = true;
                        }else{
                            $scope.moveIcon = false;
                        }
                        $scope.paginationConf.currentPage = 1;
                        reGetProducts();
					}
				    $('.query-conditions-form').bind("keydown",function(e){
		                var theEvent = e || window.event;
		                var code = theEvent.keyCode || theEvent.which || theEvent.charCode;
		                if (code == 13) {
		                    $scope.getSearch();
		                }
		            });

					/*流域新增*/
					$scope.drainageAdd = function() {
						routeService.route(1003, false);
					}

					/*流域详情*/
					$scope.drainageDetail = function(id) {
						$http({
							url: moduleService.getServiceUrl() + basicUrl + "/detail",
							method: "get",
							params: {
								id: id
							}
						}).success( function(res) {
							if(res.resCode == 1){
								$localStorage.drainageDetailData = res.data;
								routeService.route(1004, false);
							}else{
                    			layer.msg(res.resMsg || '请求错误,请稍后再试');
							}
						}).error(function(res) {
							layer.msg('服务器异常，请稍后再试');
						});
					}

					/*流域编辑*/
					$scope.drainageEdit = function(id) {
						$http({
							url: moduleService.getServiceUrl() + basicUrl + "/detail",
							method: "get",
							params: {
								id: id
							}
						}).success( function(res) {
							if(res.resCode == 1){
								$localStorage.drainageEditData = res.data;
								routeService.route(1005, false);
							}else{
                    			layer.msg(res.resMsg || '请求错误,请稍后再试');
							}
						}).error(function(res) {
							layer.msg('服务器异常，请稍后再试');
						});
					}

					$scope.dataExport = function(){
		            	layer.confirm('是否导出数据？', {
							title:'提示',
							btn: ['确定', '取消'] // 按钮
						}, function(index) {
							var params = {
								basinName: $scope.basinName,
                                basinCode: $scope.basinCode,
							}
							params = $.param(params);
							window.location.href = moduleService.getServiceUrl() + basicUrl + '/export?'+params;
							layer.close(index);
						});
		            }
				}
			]);
})(window, angular);