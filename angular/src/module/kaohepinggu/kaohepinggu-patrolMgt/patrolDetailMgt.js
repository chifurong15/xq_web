(function (window, angular) {
    'use strict';

    var app = angular.module("app");
    app.filter("trustHtml", function ($sce) {
        return function (input) {
            return $sce.trustAsHtml(input);
        }
    });
    app.controller(
        'patrolDetailMgtCtrl', [
            '$localStorage',
            '$scope',
            '$location',
            '$log',
            '$q',
            '$rootScope',
            'globalParam',
            '$window',
            'routeService',
            '$http',
			'$ajaxhttp',
			'moduleService',
            function patrolDetailMgtCtrl($localStorage, $scope, $location, $log, $q, $rootScope, globalParam, $window, routeService, $http, $ajaxhttp, moduleService) {

        		var apiPrefix = moduleService.getServiceUrl() + '/patrol';

				/**
				 * ==============================================
				 * @name  patrolDetailMgtCtrl
				 * @author  | 2018/10/25
				 * @version 
				 * @desc  巡查详情
				 * ==============================================
				 */
				$scope.init = function(){
					
					/**
					 * 获取详情
					 */
					// localStorage.getItem('id');
					getDetalList();
				}
				
				/**
				 * 获取详情
				 */
				function getDetalList(){
                    $ajaxhttp.myhttp({
                        url: apiPrefix + '/v1/ExeAssPatrol/detail',
                        method: 'get',
                        params: {
                            id: localStorage.getItem('id')
                        },
                        callBack: function (res) {
                              $scope.problemList = res.data;
                              if(res.data.photoUrl){
                                  $scope.problemList.photoUrl = res.data.photoUrl.split(',')
                              }
                        }
                    })
				}

                /**
				 * 返回
				 */
				$scope.getBack = function(){
					routeService.route('3-6', true);
				}
				
				
				
            }
        ]);

})(window, angular)