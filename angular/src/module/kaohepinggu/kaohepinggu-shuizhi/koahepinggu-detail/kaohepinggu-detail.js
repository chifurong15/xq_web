(function(window, angular) {
	'use strict';
	angular
		.module("app")
		.controller(
			'shuizhiDetailCtrl',
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
				function shuizhiDetailCtrl($localStorage, $scope,
						$location, $log, $q, $rootScope, $window,
						routeService, $http, $ajaxhttp, moduleService, globalParam) {
				
					var apiPrefix = moduleService.getServiceUrl() + '/template';
					
					$scope.init = function () {	
						$scope.type = 2;
						getList();
						
					}
					
					// 单选按钮组
	                $scope.typeList = [
	                    {"id": 1, "typeName": "实时"},
	                    {"id": 2, "typeName": "当日"},
	                    {"id": 3, "typeName": "当月"}
	                ];
	                $scope.isSelected = '2';
	                $scope.radioBtn = function(type){
	                    $scope.type = type;
	                    getList();
	                }
	              	
	              	//获取数据列表
					function getList () {
						if($scope.type == 1){
							$ajaxhttp.myhttp({
								url: apiPrefix + '/v1/WaterQualityGrade/selectRealTime',
								method: 'get',
								params: {
									pageNumber: $scope.paginationConf.currentPage,
									pageSize: $scope.paginationConf.itemsPerPage
								},
								callBack: function (res) {
									$scope.dataList = res.data.rows;
	                    			$scope.paginationConf.totalItems = res.data.total;
								}
							})
						}else if($scope.type == 2){
							$ajaxhttp.myhttp({
								url: apiPrefix + '/v1/WaterQualityGrade/selectDaily',
								method: 'get',
								params: {
									pageNumber: $scope.paginationConf.currentPage,
									pageSize: $scope.paginationConf.itemsPerPage
								},
								callBack: function (res) {
									$scope.dataList = res.data.rows;
	                    			$scope.paginationConf.totalItems = res.data.total;
								}
							})
						}else if($scope.type == 3){
							$ajaxhttp.myhttp({
								url: apiPrefix + '/v1/WaterQualityGrade/selectMonthly',
								method: 'get',
								params: {
									pageNumber: $scope.paginationConf.currentPage,
									pageSize: $scope.paginationConf.itemsPerPage
								},
								callBack: function (res) {
									$scope.dataList = res.data.rows;
	                    			$scope.paginationConf.totalItems = res.data.total;
								}
							})
						}						
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
					
					
					
					//返回
					$scope.goBack=function(){
						history.back(-1);
					}	
					
			} ]);
})(window, angular);
