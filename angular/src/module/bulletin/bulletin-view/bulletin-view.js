(function(window, angular) {
	'use strict';
	angular
		.module("app")
		.controller(
			'bulletinViewCtrl',
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
				function bulletinViewCtrl($localStorage, $scope,
						$location, $log, $q, $rootScope, $window,
						routeService, $http, $ajaxhttp, moduleService, globalParam) {
				
					var apiPrefix = moduleService.getServiceUrl() + '/bulletin';
                    //var apiPrefix = 'http://10.0.9.133:8080' + '/bulletin';

                    $scope.getServiceUrl= moduleService.getServiceUrl();
					$scope.init = function () {
						var bulletin = globalParam.getter().bulletin || {};
						if (!!getQueryString('id')) {
							bulletin.id = getQueryString('id');
						}
						
						// 编辑时获取原数据
						if (bulletin.id) {
							$location.search('id', bulletin.id);
						}
						getData(bulletin.id);
					}
					
					//返回
					$scope.goBack=function(){
						history.back(-1);
					}

					//附件预览
					$scope.lookLine = function () {
						//$('#myModal').modal('show');
						var params={
							attandUrl:$scope.bulletin.attandUrl
						}
	                	$http({
	                        url: apiPrefix + '/v1/bulletin/lookload',
	                        method: 'get',
	                        params:params
	                   }).success(function (res) {	                    	
	                    		//$scope.lookLineContent=res;
	                        
	                    }).error(function (error) {
	
	                    })
	                }
					
					// 数据详情
					function getData (id) {
						$ajaxhttp.myhttp({
							url: apiPrefix + '/v1/bulletin/detail',
							method: 'get',
							params: {
								id: id
							},
							callBack: function (res) {
								//var attandNamePart = res.data.attandUrl.split('_');
								$scope.bulletin = res.data;
                                console.log($scope.bulletin);
                                $scope.attandName = localStorage.getItem('attandName');
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
			} ]);
})(window, angular);
