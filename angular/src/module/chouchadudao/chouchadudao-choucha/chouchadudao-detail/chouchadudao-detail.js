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
				
					var apiPrefix = moduleService.getServiceUrl() + '/spotcheck';
					
					
					$scope.init = function () {
						var bulletin = globalParam.getter().bulletin || {};
						$scope.id = bulletin.id;

						$ajaxhttp.myhttp({
							url: apiPrefix + '/v1/spotcheck/detailSpotcheck',
							method: 'get',
							params:{
								id: $scope.id
							},
							callBack: function (res) {
                                $scope.detail = res.data;
                                $scope.taskType = res.data.taskType == 0 ? '临时任务' : '常规任务';
							}
						})

						getData($scope.id);
						// var selectedId = localStorage.getItem('selectedId');
						// $('.js-tab').find('li').eq(selectedId).addClass('tab-active').siblings().removeClass('tab-active');
						// $(".js-con").find('.con').hide().eq(selectedId).show();
						
					}
					
					//返回
					$scope.goBack = function(){
						history.back(-1);
					}


					// 数据详情
					function getData (id) {
                        $ajaxhttp.myhttp({
                            url: apiPrefix + '/v1/spotcheck/detailCheckResult',
                            method: 'get',
                            params:{
                                id: id
                            },
                            callBack: function (res) {
                            	$scope.checkTime = res.data.checkDate;
                            	$scope.checkPerson = res.data.sendPerson;
                                $scope.checkList = res.data.problemList;
                            }
                        })
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
