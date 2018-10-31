(function (window, angular) {
    'use strict';

    var app = angular.module("app");
    app.filter("trustHtml", function ($sce) {
        return function (input) {
            return $sce.trustAsHtml(input);
        }
    });
    app.controller(
        'superviseReportDetailMgtCtrl', [
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
            function superviseReportDetailMgtCtrl($localStorage, $scope, $location, $log, $q, $rootScope, globalParam, $window, routeService, $http, $ajaxhttp, moduleService) {

        		var apiPrefix = moduleService.getServiceUrl() + '/supervise';

                /**
				 * ==============================================
				 * @name  superviseReportDetailMgtCtrl
				 * @author  | 2018/10/25
				 * @version 
				 * @desc  社会监督举报详情
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
                    $ajaxhttp.myhttp({
                        url: apiPrefix + '/v1/socialReport/detailReport',
                        method: 'get',
                        params: {
                            id: localStorage.getItem('id')
                        },
                        callBack: function (res) {
                            $scope.reportList = res.data;
                            //console.log($scope.imgList)
                        }
                    })

					$scope.reportList = 
						{
							'date':'2018-10-24 15:35',
							'region':'天津市河西区',
							'reach':'海河河西区段',
							'reportPerson':'李四',
							'contact':'13732288520',
							'reportProblem':'暂无',
							'problemAdress':'河西区马场街道XX桥200米处',
							'suggestion':'河西区马场街道XX桥200米处',
							'deal':'河西区马场街道XX桥200米处',
							'status':'二次处理',
							'reportAssess':'满意'
						}
				}
				
				/**
				 * 查看附件
				 */
				$scope.getFile = function(){
					$('#fileModal').modal('show');
				}
				
				/**
				 * 关闭模态框
				 */
				$scope.getModalOk = function(){
                	$('#fileModal').modal('hide');
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