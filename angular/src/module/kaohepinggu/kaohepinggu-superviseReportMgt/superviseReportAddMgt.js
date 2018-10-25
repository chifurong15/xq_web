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
					getDetalList();
				}
				
				/**
				 * 获取详情
				 */
				function getDetalList(){
					$scope.problemList = 
						{
							'reachName':'海河河西区段',
							'partrolRegion':'天津市河西区',
							'partrolProblem':'堤岸水面环境日常保洁情况',
							'partrolType':' 固定分值',
							'partrolScore':'2',
							'patrolPerson':'张三',
							'patrolDate':'2018-10-24 15:30',
							'patrolAdress':'河西区马场街道XX桥200米处'
						}
				}
				
				/**
				 * 返回
				 */
				$scope.getBack = function(){
					routeService.route('3-8', true);
				}
				
				
				
            }
        ]);

})(window, angular)