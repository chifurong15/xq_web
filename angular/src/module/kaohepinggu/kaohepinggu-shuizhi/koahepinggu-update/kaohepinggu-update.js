(function(window, angular) {
	'use strict';
	angular
		.module("app")
		.controller(
			'shuizhiUpdateCtrl',
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
				function shuizhiUpdateCtrl($localStorage, $scope,
						$location, $log, $q, $rootScope, $window,
						routeService, $http, $ajaxhttp, moduleService, globalParam) {
				
					var apiPrefix = moduleService.getServiceUrl() + '/template';
					
					$scope.init = function () {						
						
						var bulletin = globalParam.getter().bulletin || {};	
						$scope.id = bulletin.id;
						getData(getQueryString('id'));
						getDate ();
						getAllName();
					}
					
					//搜索
					$scope.search = function () {
						console.log($scope.section+'-----'+$scope.riverName)
						getData();
					}
					
					// 数据详情
					function getData () {
						$ajaxhttp.myhttp({
							url: apiPrefix + '/v1/WaterQualityGrade/list?parentid=' + $scope.id,
							method: 'get',
							params: {								
								name:$scope.section,
								riverName:$scope.riverName,
								pageNumber: $scope.paginationConf.currentPage,
								pageSize: $scope.paginationConf.itemsPerPage
							},
							callBack: function (res) {
								$scope.detailList = res.data.list;
                    			$scope.paginationConf.totalItems = res.data.total;
							}
						})
					}
					
					//获取所有的断面  河流
					function getAllName () {
						$http({
			                method: 'GET',
			                url: apiPrefix + '/v1/WaterQualityGrade/selectCascade',				               
			            }).success(function (res) {
		                	
		                	var data = res.data;
		                	//断面
		                	$scope.nameOption = [] ;
		                	//河流
		                	$scope.riverOption = [] ;
		                	data.map(function(item , index){
		                		$scope.nameOption.push(item.name);
		                		$scope.riverOption.push(item.mdSection.riverName)
		                	})		                	
		                	$scope.riverOption = removeDuplicates($scope.riverOption);
			            })
					}
					$('#J-searchTime').datetimepicker({
	                    format: 'YYYY-MM',
	                    locale: moment.locale('zh-cn')
	                }).on('dp.change', function (c) {
	                    $scope.searchTime = new moment(c.date).format('YYYY-MM');
	                    $scope.$apply();
	                });
					
					//获取当前时间
					 function getDate () {
	                    setInterval(function () {
							var date = new Date(),
								year = date.getFullYear(),
								month = date.getMonth() + 1,
								day = date.getDate(),
								hour = date.getHours(),
								min = date.getMinutes(),
								second = date.getSeconds();
								
							$scope.$apply(function () {
								$scope.currentdate=year + '-' + month  + '-' + day + ' ' + 
								(hour < 10 ? '0' + hour : hour) + ':' +
								(min < 10 ? '0' + min : min) + ':' +
								(second < 10 ? '0' + second : second) ;
							})
	                    }, 1000);
					}
					
					//数组去重
					function removeDuplicates(arr) {					  
					      var temp = {}, r = [];					  
					     for (var i in arr)					 
					          temp[arr[i]] = true;					  
					      for (var k in temp)					 
					         r.push(k);					 
					     return r;					 
					}					
					//返回
					$scope.goBack=function(){
						history.back(-1);
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
