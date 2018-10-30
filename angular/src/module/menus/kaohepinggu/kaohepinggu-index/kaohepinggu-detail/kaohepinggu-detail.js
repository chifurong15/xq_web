(function(window, angular) {
	'use strict';
	angular
		.module("app")
		.controller(
			'kaohepingfenViewCtrl',
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
				function kaohepingfenViewCtrl($localStorage, $scope,
						$location, $log, $q, $rootScope, $window,
						routeService, $http, $ajaxhttp, moduleService, globalParam) {
				
					var apiPrefix = $localStorage.gwUrl + '/template';
                   // var apiPrefix = 'http://10.0.9.133:8081/template';
					
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
					
					
					// 数据详情
					function getData (id) {
						$ajaxhttp.myhttp({
							url: apiPrefix + '/v1/SurfaceWaterGrade/list',
							method: 'get',
							params: {
								parentid: id
							},
							callBack: function (res) {
								$scope.detailList = res.data;
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
