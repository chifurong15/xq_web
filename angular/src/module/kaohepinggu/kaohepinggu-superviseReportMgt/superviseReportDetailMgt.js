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

        		// var apiPrefix = moduleService.getServiceUrl() + '/supervise';
                var apiPrefix = 'http://10.0.9.116:7023' + '/supervise';

                /**
				 * ==============================================
				 * @name  superviseReportDetailMgtCtrl
				 * @author  | 2018/10/25
				 * @version 
				 * @desc  社会监督举报详情
				 * ==============================================
				 */
				$scope.init = function(){
                    $scope.eventImgUrl = 'http://10.0.0.196/api/download' ;
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
				}
				
				/**
				 * 查看附件
				 */
				$scope.getFile = function(id){
					//alert($localStorage.serviceUrl)
                 	$('#fileModal').modal('show');
                 	if(id == 1){
						$scope.problemAttant =  $scope.reportList.problemAttant;
					}else if( id == 2){
                        $scope.problemAttant =  "http://10.0.0.196/files" + $scope.reportList.proposedTreatment;
					}else if( id == 3){
                        $scope.problemAttant =  "http://10.0.0.196/files" + $scope.reportList.processingResults;
					}

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