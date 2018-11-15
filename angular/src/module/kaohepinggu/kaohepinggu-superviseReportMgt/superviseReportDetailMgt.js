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
                //var apiPrefix = 'http://10.0.9.116:7023' + '/supervise';

                /**
				 * ==============================================
				 * @name  superviseReportDetailMgtCtrl
				 * @author  | 2018/10/25
				 * @version 
				 * @desc  社会监督举报详情
				 * ==============================================
				 */

                var options = {
                    pdfOpenParams: {
                        pagemode: "thumbs",
                        navpanes: 0,
                        toolbar: 0,
                        statusbar: 0,
                        view: "FitV"
                    }
                };


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
                        	if(res.data){
                                $scope.reportList = res.data;
                                //console.log($scope.imgList)
							}

                        }
                    })
				}
				
				/**
				 * 查看附件
				 */
				$scope.viewFile = function(id){
                 	$('#myModal').modal('show');
                 	if(id ==1){
                        PDFObject.embed($scope.reportList.problemAttant, "#file", options);
                    }else if(id ==2){
                        PDFObject.embed($scope.reportList.proposedTreatment, "#file", options);
                    }else if(id ==3){
                        PDFObject.embed($scope.reportList.processingResults, "#file", options);
                    }
				}

                //取消查看
                $scope.cancel = function () {
                    $('#myModal').modal('hide');
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