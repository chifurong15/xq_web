(function(window, angular) {
	'use strict';
	angular
		.module("app")
		.controller(
			'shuizhiListCtrl',
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
				function shuizhiListCtrl($localStorage, $scope,
						$location, $log, $q, $rootScope, $window,
						routeService, $http, $ajaxhttp, moduleService , globalParam) {
					
					var apiPrefix = $localStorage.gwUrl + '/template';
                    // var apiPrefix = 'http://10.0.9.133:8080/template';
                    $scope.userInfo = $localStorage.userLoginInfo.userInfo;

					$scope.init = function () {
                        $ajaxhttp.myhttp({
                            url: apiPrefix + '/v1/WaterQuality/userinfo1',
                            method: 'get',
                            params: {
                                id: $scope.userInfo.id
                            },
                            callBack: function (res) {
                                $scope.num = res.data;
                                console.log(res)
                                getList();
                            }
                        })

					}
					
					// 获取数据列表
					function getList () {

						let month=new moment($scope.searchTime).format('M')<10 ? '0'+ new moment($scope.searchTime).format('M') : new moment($scope.searchTime).format('M');
						$scope.date=new moment($scope.searchTime).format('YYYY') + '-' + month;
						
						$ajaxhttp.myhttp({
							url: apiPrefix + '/v1/WaterQuality/list',
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
								$scope.waterQualityList = res.data.list;
								console.log('水zhi列表',$scope.waterQualityList)
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
						routeService.route('1007', false);
	                }
	                
	                // 编辑
	                $scope.edit = function (id) {
						localStorage.setItem('id',id);					
						$ajaxhttp.myhttp({
							url: apiPrefix + '/v1/WaterQuality/detail?id=' + id,
							method: 'get',							
							callBack: function (res) {
								globalParam.setter({
									bulletin: res.data
								})
							}
						})
						routeService.route('1007', false);
	                }
	                
	                 // 查看
	                $scope.view = function (id) {
						globalParam.setter({
							bulletin: {
								id: id
							}
						})
						routeService.route('1008', false);
	                }
	                
	                 // 上报
	                $scope.report = function (id) {
						$ajaxhttp.myhttp({
							url: apiPrefix + '/v1/WaterQuality/update',
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
	                
	                //修改 水质报告
	                $scope.edit = function (id) {						
						$ajaxhttp.myhttp({
							url: apiPrefix + '/v1/WaterQuality/detail',
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
						routeService.route('1007', false);
	                }
					
					// 退回
	                $scope.sendBack = function (id) {
						$ajaxhttp.myhttp({
							url: apiPrefix + '/v1/WaterQuality/update',
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
