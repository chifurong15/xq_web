(function(window, angular) {
	'use strict';
	angular
		.module("app")
		.controller(
			'dubanListCtrl',
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
				function dubanListCtrl($localStorage, $scope,
						$location, $log, $q, $rootScope, $window,
						routeService, $http, $ajaxhttp, moduleService , globalParam) {
					
					var apiPrefix = moduleService.getServiceUrl() + '/duban';
					//var apiPrefix = 'http://10.0.9.133:7026' + '/duban';
                    $scope.userInfo = $localStorage.userLoginInfo.userInfo;

                    $scope.init = function () {
                        getList();
                        getStatus ();
                        //$scope.num = 2; //02 市河长办  05 区

						$ajaxhttp.myhttp({
							url: apiPrefix + '/v1/DubanSupervision/userinfo',
							method: 'get',
							callBack: function (res) {
								$scope.num = res.data;
							}
						})
					}
					
					// 获取数据列表
					function getList () {
						$ajaxhttp.myhttp({
							url: apiPrefix + '/v1/DubanSupervision/list',
							method: 'get',
							params: {
								pageNumber: $scope.paginationConf.currentPage,
								pageSize: $scope.paginationConf.itemsPerPage,
								objectname:$scope.objectname,
								issuedtime:$scope.searchTime,
								status:$scope.status,
                                objectid: $scope.num == 5 ? $scope.userInfo.id : ''
							},
							callBack: function (res) {
								$scope.moduleList = res.data.list;
								if($scope.num == 2 || $scope.num == 5){
                                    $scope.paginationConf.totalItems = res.data.total;
								}else{
                                    $scope.paginationConf.totalItems = 0;
                                }
							}
						})
					}

					//获取状态
					function getStatus (){
						$scope.statusList = [
							{
								id:0,
								status:'已下发'
							},
                            {
                                id:1,
                                status:'已回复'
                            },
                            {
                                id:2,
                                status:'已处理'
                            },
                            {
                                id:3,
                                status:'未按期'
                            },
                            {
                                id:4,
                                status:'已完结'
                            },
                            {
                                id:5,
                                status:'已退回'
                            },
						]
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

                    //重置搜索条件
                    $scope.reset = function () {
                        $scope.searchTime = '';
                        $scope.status = '';
                        $scope.objectname = '';
                    }
					
					// 新建
	                $scope.add = function () {
						globalParam.setter({
							bulletin: {}
						})
						routeService.route('2-4-1', false);
	                }
	                	               
	                 // 查看    检查
	                $scope.view = function (id , status) {
						localStorage.setItem('id',id);
						localStorage.setItem('status',status);
						routeService.route('2-4-2', false);
	                }
                    // 回复 处理
                    $scope.oprate = function (id ,tag , status) {
                        localStorage.setItem('id',id);
                        localStorage.setItem('tag',tag);
                        localStorage.setItem('status',status);
                        routeService.route('2-4-3', false);
                    }
	                $scope.report = function (){
                        routeService.route('2-4-3', false);
                    }
	                //返回
					$scope.goBack=function(){
						history.back(-1);
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
