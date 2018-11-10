(function(window, angular) {
	'use strict';
	angular
		.module("app")
		.controller(
			'duchaListCtrl',
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
				function duchaListCtrl($localStorage, $scope,
						$location, $log, $q, $rootScope, $window,
						routeService, $http, $ajaxhttp, moduleService , globalParam) {
					
					var apiPrefix = moduleService.getServiceUrl() + '/inspection';
					//var apiPrefix = 'http://10.0.9.203:8081' + '/inspection';
					$scope.init = function () {
                        //$scope.num = 2; //2市河长办 5区河长办
                        //getList();

                        $ajaxhttp.myhttp({
							url: apiPrefix + '/v1/Inspection/userinfo',
							method: 'get',
							callBack: function (res) {
								$scope.num = res.data;
								getList();
							}
						})
                        getState ();
					}
					
					// 获取数据列表
					function getList () {
						$ajaxhttp.myhttp({
							url: apiPrefix + '/v1/Inspection/selectList',
							method: 'get',
							params: {
								pageNumber: $scope.paginationConf.currentPage,
								pageSize: $scope.paginationConf.itemsPerPage,
								renumber: $scope.renumber,
								state: $scope.state,
								printDate: $scope.searchTime
							},
							callBack: function (res) {
								$scope.moduleList = res.data.list;
                 				$scope.paginationConf.totalItems = res.data.total;
							}
						})
					}
					
					$('#J-searchTime').datetimepicker({
	                    format: 'YYYY-MM-DD',
	                    locale: moment.locale('zh-cn')
	                }).on('dp.change', function (c) {
	                    $scope.searchTime = new moment(c.date).format('YYYY-MM-DD');
	                    $scope.$apply();
	                });
					
					
					// 搜索
	                $scope.search = function () {
	                    getList();
	                };

	                //重置
					$scope.reset = function () {
						$scope.searchTime = '';
						$scope.state = '';
						$scope.renumber = '';
					}
					
					// 新建
	                $scope.add = function () {
						globalParam.setter({
							bulletin: {}
						})
						routeService.route('2-3-1', false);
	                }
	                	               
	                 // 查看
	                $scope.view = function (id,oneregion,state) {
						localStorage.setItem('id',id);
						localStorage.setItem('state',state);
						localStorage.setItem('oneregion',oneregion);
						routeService.route('2-3-2', false);
	                }
	                //区河长办 上报    市河长办 建组
	                $scope.oprate = function (id ,tag ,oneregion ,state) {
	                	localStorage.setItem('id',id);
	                	localStorage.setItem('tag',tag);
	                	localStorage.setItem('oneregion',oneregion);
	                	localStorage.setItem('state',state);
                        routeService.route('2-3-3', false);
                    }

	                //返回
					$scope.goBack=function(){
						history.back(-1);
					} 

					function getState () {
	                	$scope.stateList = [
							{
								id:0,
								state:'已上报'
							},
                            {
                                id:1,
                                state:'已下发'
                            },
                            {
                                id:2,
                                state:'已通知'
                            },
                            {
                                id:3,
                                state:'已通报'
                            },
                            {
                                id:4,
                                state:'已处理'
                            },
						]
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
