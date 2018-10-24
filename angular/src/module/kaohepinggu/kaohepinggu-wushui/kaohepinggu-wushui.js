(function(window, angular) {
	'use strict';
	angular
		.module("app")
		.controller(
			'wushuiListCtrl',
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
				function wushuiListCtrl($localStorage, $scope,
						$location, $log, $q, $rootScope, $window,
						routeService, $http, $ajaxhttp, moduleService , globalParam) {
					
					// var apiPrefix = moduleService.getServiceUrl() + '/template';
                    var apiPrefix = 'http://10.0.9.133:8082/template';
                    $scope.userInfo = $localStorage.userLoginInfo.userInfo;
					
					$scope.init = function () {
						getList();
					}
					
					// 获取数据列表
					function getList () {
						
						$scope.num = '';//02市长办登录
						
						$ajaxhttp.myhttp({
							url: apiPrefix + '/v1/SewageDispose/userinfo',
							method: 'get',					
							callBack: function (res) {
								$scope.num = res.grade;
							}
						})
						let month=new moment($scope.searchTime).format('M')<10 ? '0'+ new moment($scope.searchTime).format('M') : new moment($scope.searchTime).format('M');
						$scope.date=new moment($scope.searchTime).format('YYYY') + '-' + month;

						$ajaxhttp.myhttp({
							url: apiPrefix + '/v1/SewageDispose/list',
							method: 'get',
							params: {
								pageNumber: $scope.paginationConf.currentPage,
								pageSize: $scope.paginationConf.itemsPerPage,
								issue: $scope.searchTime && $scope.date,
								status: $scope.type,
								num: $scope.num,
								createUser:$scope.createuser
							},
							callBack: function (res) {
								$scope.sewageWaterList = res.data.list;
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
					
					
					// 搜索
	                $scope.search = function () {
	                    getList();
	                };
					
					// 新建
	                $scope.add = function () {
						globalParam.setter({
							bulletin: {}
						})
						routeService.route('3-3-2', false);
	                }
	                
	                //修改 污水报告
	                $scope.edit = function (id) {
	                	localStorage.setItem('id',id);
						$ajaxhttp.myhttp({
							url: apiPrefix + '/v1/SewageDispose/detail',
							method: 'get',
							params: {
								id: id
							},
							callBack: function (res) {
								globalParam.setter({
									bulletin: res.data
								})
							}
						})						
						routeService.route('3-3-2', false);
	                }
	                
	                 // 查看
	                $scope.view = function (id , title , issue) {
	                	localStorage.setItem('id',id);
	                	localStorage.setItem('title',title);
	                	localStorage.setItem('issue',issue);						
						routeService.route('3-3-3', false);
	                }
	                
	                 // 上报
	                $scope.report = function (id) {
						$ajaxhttp.myhttp({
							url: apiPrefix + '/v1/SewageDispose/update',
							method: 'PUT',
							params: {
								id: id ,
								status:0
							},
							callBack: function (res) {
								if(res.resCode == 1){
									getList();
								}
							}
						})
	                }
	                
	                 // 退回
	                $scope.sendBack = function (id) {
						$ajaxhttp.myhttp({
							url: apiPrefix + '/v1/SewageDispose/update',
							method: 'PUT',
							params: {
								id: id ,
								status:1
							},
							callBack: function (res) {
								if(res.resCode == 1){
									getList();
								}
							}
						})
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
