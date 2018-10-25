(function (window, angular) {
    'use strict';

    var app = angular.module("app");
    app.filter("trustHtml", function ($sce) {
        return function (input) {
            return $sce.trustAsHtml(input);
        }
    });
    app.controller(
        'superviseEvaluateDetailMgtCtrl', [
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
            function superviseEvaluateDetailMgtCtrl($localStorage, $scope, $location, $log, $q, $rootScope, globalParam, $window, routeService, $http, $ajaxhttp, moduleService) {
				
				/**
				 * ==============================================
				 * @name  superviseEvaluateDetailMgtCtrl
				 * @author  | 2018/10/25
				 * @version 
				 * @desc  社会监督评价详情
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
					$scope.superviseList = 
						{
							'num':'2018-10',
							'region':'河西区',
							'reach':'海河河西区段',
							'supervise':'李四',
							'reason':'不满意',
							'otherReason':'排水口水质异常',
							'patrolAdress':'河西区马场街道XX桥200米处',
							'date':'2018-10-24 15:30',
						}
				}
				
				/**
				 * 返回
				 */
				$scope.getBack = function(){
					routeService.route('3-7', true);
				}
				
				
				
            }
        ]);

})(window, angular)