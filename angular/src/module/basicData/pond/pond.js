var modulePrefix = "/watersource";
var basicUrl = modulePrefix + "/v1/drainageBasin";
var waterUrl = modulePrefix + "/v1/waterSystem";
var riverUrl = modulePrefix + "/v1/river";
var pondUrl = modulePrefix + "/v1/pond";
var reservoirUrl = modulePrefix + "/v1/reservoir";
var reachUrl = modulePrefix + "/v1/reach";
var dictionaryUrl = modulePrefix + "/v1/dictionary";
(function(window, angular) {
	'use strict';

	var app = angular.module("app").controller(
			'pondCtrl', ['$localStorage','$scope','$location','$rootScope','routeService','moduleService','$http',
				function pondCtrl($localStorage, $scope, $location, $rootScope,routeService,moduleService, $http) {
					$scope.init = function(){
						reGetProducts();
					}
					/*坑塘类型*/
					$scope.pondTypeList = function() {
						$http({
							method: "get",
							url: moduleService.getServiceUrl() + '/watersource/v1/pond/pondType',
						}).success(function(res) {
							if(res.resCode == 1){
								$scope.pondTypes = res.data;
							}else{
                    			layer.msg(res.resMsg || '请求错误,请稍后再试');
							}
						}).error(function(res){
			                layer.msg('服务器异常，请稍后再试');
			            });
					}

					$scope.regionShow = function(){
						$scope.modalTreeInfo = {'treeType': 'region'}; //通过$scope.modalTreeInfo与子组件树弹窗treeModal绑定，必填字段treeType;其他参数参考具体js
						$("#treeModal").modal('show');
					};
					$scope.$on('zTreeModalClose', function(event,data) { //树弹窗关闭事件通信 返回data = {treeNodeId,treeNodeName}
				    	if($scope.modalTreeInfo.treeType == 'region'){
				    		$scope.regionName = data.treeNodeName;
				    		$scope.regionCode = data.treeNodeId;
				    	}
				    })


					/*重置*/
					$scope.reSet = function(){
						$scope.pondName = null;
						$scope.pondType = null;
						$scope.regionCode = null;
						$scope.regionName = null;
						reGetProducts();
					}

					/*表单分页*/
					var reGetProducts = function() {
						$http({
							url: moduleService.getServiceUrl() + '/watersource/v1/pond/list',
							method: 'GET',
							params: {
                                name: $scope.pondName,
                                type: $scope.pondType,
                                regionId: $scope.regionCode,
								page: $scope.paginationConf.currentPage,
								size: $scope.paginationConf.itemsPerPage,
							},
						}).success(function(res) {
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
					$scope.$watch('paginationConf.currentPage + paginationConf.itemsPerPage', function(n,o){if(n != o){reGetProducts()}});

					// 表单删除
					$scope.pondDelete = function(id) {
						var layerIndex = layer.confirm('确定删除本条数据吗？', {
							title:'提示',
							btn: ['确定', '取消'] // 按钮
						}, function() {
							$http({
								url: moduleService.getServiceUrl() + '/watersource/v1/pond/delete',
								method: "delete",
								params: {
									id: id
								}
							}).success(function(res) {
								if(res.resCode == 1) {
									layer.msg('删除成功！');
								} else {
									layer.msg(res.resMsg || '删除失败，请重试')
								}
								reGetProducts();
							}, function(res) {
								layer.msg('服务器异常，请稍后再试');
							});
							layer.close(layerIndex);
						}, function() {});
					};

					//搜索
					$scope.find = function() {
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

					// 肯唐新增
					$scope.pondAdd = function() {
						routeService.route(1031, false);
					}
					// 坑塘详情
					$scope.pondDetail = function(id) {
						$http({
							url: moduleService.getServiceUrl() + '/watersource/v1/pond/detail',
							method: "get",
							params: {
								id: id
							}
						}).success(function(res) {
							if(res.resCode == 1){
								$localStorage.pondDetailData = res.data;
								routeService.route(1033, false);
							}else{
                    			layer.msg(res.resMsg || '请求错误,请稍后再试');
							}
						}).error(function(res){
			                layer.msg('服务器异常，请稍后再试');
			            });

					}
					// 坑塘编辑
					$scope.pondEdit = function(id) {
						$http({
							url: moduleService.getServiceUrl() + '/watersource/v1/pond/detail',
							method: "get",
							params: {
								id: id
							}
						}).success(function(res) {
							if(res.resCode == 1){
								$localStorage.pondEditData = res.data;
								routeService.route(1032, false);
							}else{
                    			layer.msg(res.resMsg || '请求错误,请稍后再试');
							}
						}).error(function(res){
			                layer.msg('服务器异常，请稍后再试');
			            });
					}

					// $scope.dataExport = function(){
		   //          	layer.confirm('是否导出数据？', {
					// 		title:'提示',
					// 		btn: ['确定', '取消'] // 按钮
					// 	}, function(index) {
					// 		var params = {
					// 			name: $scope.pondName,
     //                            type: $scope.pondType,
     //                            regionId: $scope.regionCode,
					// 		}
					// 		params = $.param(params);
					// 		console.log(moduleService.getServiceUrl() + pondUrl + '/export?'+params,'qqqqqqqqqqq')
							
					// 		window.location.href = moduleService.getServiceUrl() + pondUrl + '/export?'+params;
					// 		layer.close(index);
					// 	});
		   //          }
				}
			]);

})(window, angular);