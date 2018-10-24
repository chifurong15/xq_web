(function(window, angular) {
	'use strict';

	angular
		.module("app")
		.controller(
			'policyDocDetail', [
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
                function policyDocDetail($localStorage, $scope,
                                          $location, $log, $q, $rootScope, $window,
                                          routeService, $http, $ajaxhttp, moduleService, globalParam) {

					/**
					 * ================================
					 * 描述说明
					 * @author yuanhaitao</br>2018/09/11
					 * @module 政策体系
					 * @version 3.0.0
					 * ================================
					 */
					
					/**
					 * 初始化数据
					 */
					
					var  docListId = $localStorage.docListId;

                    $scope.init = function () {
                        $scope.docDetail = globalParam.getter();
                        console.log($scope.docDetail)
                    }
					
					var modulePrefix = "/watersource";
					
					$scope.back = function() {
						// 跳转到菜单页面
						routeService.route(53, true);
					}
					
				}
			]);

})(window, angular);
