(function(window, angular) {
	'use strict';
	angular
		.module("app")
		.controller(
			'wushuiViewCtrl',
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
				function wushuiViewCtrl($localStorage, $scope,
						$location, $log, $q, $rootScope, $window,
						routeService, $http, $ajaxhttp, moduleService, globalParam) {
				
					
					var apiPrefix = $localStorage.gwUrl + '/template';
                    // var apiPrefix = 'http://10.0.9.133:8082/template';
					
					$scope.init = function () {
						var bulletin = globalParam.getter().bulletin || {};
						
						$scope.id = localStorage.getItem('id');
						$scope.title = localStorage.getItem('title');
						$scope.issue = localStorage.getItem('issue');
						
						getData();
					}
					
					//返回
					$scope.goBack=function(){
						history.back(-1);
					}	
					
					
					// 数据详情
					function getData () {
						$ajaxhttp.myhttp({
							url: apiPrefix + '/v1/SewageDisposeReport/list',
							method: 'get',
							params: {
								parentid: $scope.id,
								pageNumber: $scope.paginationConf.currentPage,
								pageSize: $scope.paginationConf.itemsPerPage
							},
							callBack: function (res) {
								$scope.dataList = res.data.list;
								$scope.paginationConf.totalItems = res.data.total;
							}
						})
					}
					
					// 获取url参数
					function  getQueryString (params, url) {
				        var url = url || location.href;
				        var search = url.split('?')[1];
				        if (search) {
				            var n = new RegExp("(^|&)" + params + "=([^(&|#)]*)((&|#)|$)", "i"),
				                r = search.match(n);
				            return null != r ? r[2] : null
				        }
				        return null;
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
	                $scope.$watch('paginationConf.currentPage + paginationConf.itemsPerPage', getData);
			} ]);
})(window, angular);
