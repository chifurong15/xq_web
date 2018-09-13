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
					
					// 数据详情
					function getData (id) {
						$ajaxhttp.myhttp({
							url: moduleService.getServiceUrl() + '/v1/bulletin/detail',
							method: 'get',
							params: {
								id: id
							},
							callBack: function (res) {
								var attandNamePart = res.data.attandUrl.split('_');
								$scope.bulletin = res.data;
								$scope.attandName = attandNamePart.splice(1, attandNamePart.length - 1).join('');
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
