(function(window, angular) {
	'use strict';
	angular
		.module("app")
		.controller(
			'chouchaViewCtrl',
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
				function chouchaViewCtrl($localStorage, $scope,
						$location, $log, $q, $rootScope, $window,
						routeService, $http, $ajaxhttp, moduleService, globalParam) {
				
					var apiPrefix = moduleService.getServiceUrl() + '/template';
					
					
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
						
						var selectedId = localStorage.getItem('selectedId');
						$('.js-tab').find('li').eq(1).addClass('tab-active').siblings().removeClass('tab-active');
						$(".js-con").find('.con').hide().eq(1).show();
						
					}
					
					//返回
					$scope.goBack = function(){
						history.back(-1);
					}	
					
					
					// 数据详情
					function getData (id) {
						
					}
					
					//tab栏切换					
					$('.js-tab li').on("click",function (){
						var index = $(this).index();
						console.log(index)
						$(this).addClass('tab-active').siblings().removeClass('tab-active');
						$(".js-con").find('.con').hide().eq(index).show();						
					});
					
					
					
					
					
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
