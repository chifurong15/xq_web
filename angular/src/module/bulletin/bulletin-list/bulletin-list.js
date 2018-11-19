(function(window, angular) {
	'use strict';
	angular
		.module("app")
		.controller(
			'bulletinListCtrl',
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
				'moduleService',
				'globalParam',
				function bulletinListCtrl($localStorage, $scope,
						$location, $log, $q, $rootScope, $window,
						routeService, $http, $ajaxhttp, moduleService, globalParam) {
				
					var apiPrefix = moduleService.getServiceUrl() + '/bulletin';
                    //var apiPrefix = 'http://10.0.9.133:6008' + '/bulletin';

					$scope.init = function () {
						getList();
					}
					// 获取数据列表
					function getList () {
						$ajaxhttp.myhttp({
							url: apiPrefix + '/v1/bulletin/list',
							method: 'get',
							params: {
								pageNumber: $scope.paginationConf.currentPage,
								pageSize: $scope.paginationConf.itemsPerPage,
                                post_time: $scope.searchTime,
								type: $scope.type
							},
							callBack: function (res) {
								$scope.bulletinList = res.data.list;
                    			$scope.paginationConf.totalItems = res.data.total;
							}
						})
					}
					
					$('#J-searchTime').datetimepicker({
	                    format: 'YYYY-MM',
	                    locale: moment.locale('zh-cn')
	                }).on('dp.change', function (c) {
	                    $scope.searchTime = new moment(c.date).format('YYYY-MM');
	                    $scope.$apply();
	                });
	                
	                //返回
					$scope.goBack=function(){
						history.back(-1);
					}	
	                
	                // 搜索
	                $scope.search = function () {
	                    getList();
	                };

					//重置搜索条件
					$scope.reset = function () {
						$scope.searchTime = '';
                        $scope.type = '';
					}

	                // 新建
	                $scope.add = function () {
						globalParam.setter({
							bulletin: {}
						})
						routeService.route('1-2', true);
	                }
	                // 编辑
	                $scope.edit = function (id) {
						
						$ajaxhttp.myhttp({
							url: apiPrefix + '/v1/bulletin/detail',
							method: 'get',
							params: {
								id: id
							},
							callBack: function (res) {
								globalParam.setter({
									bulletin: res.data
								})
								routeService.route('1-2', true);
							}
						})
	                }
	                
	                // 删除
	                $scope.del = function (id) {
						var layerIndex = layer.confirm('确定删除本条数据吗？', {
							btn: ['确定', '取消']
						}, function () {
							$ajaxhttp.myhttp({
								url: apiPrefix + '/v1/bulletin/delete',
								method: 'DELETE',
								params: {
									id: id
								},
								callBack: function (res) {
									if(res.resCode == 1) {
										getList();
										layer.msg('删除成功！', {time:1000});										
									} else {
										layer.msg(res.resMsg,{time:1000});
									}
								}
							})
							layer.close(layerIndex);
						}, function () {

						});
	                }
	                // 查看
	                $scope.view = function (id) {
						globalParam.setter({
							bulletin: {
								id: id
							}
						})
						routeService.route('1-3', true);
	                }
	                
	                // 配置分页基本参数
	                $scope.paginationConf = {
	                    currentPage: $location.search().currentPage ? $location.search().currentPage : 1,
	                    itemsPerPage: 10,
	                    pagesLength: 10,
				        perPageOptions: [1, 2, 3, 4, 5, 10],
	                    onChange: function () {
	                        //console.log($scope.paginationConf.currentPage);
	                        $location.search('currentPage', $scope.paginationConf.currentPage);
	                    }
	                };
	                
	                // 当他们一变化的时候，重新获取数据条目
	                $scope.$watch('paginationConf.currentPage + paginationConf.itemsPerPage', getList);
			} ]);
})(window, angular);
