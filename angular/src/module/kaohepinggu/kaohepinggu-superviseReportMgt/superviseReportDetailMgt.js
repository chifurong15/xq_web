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
                // var apiPrefix = 'http://10.0.9.133:7023' + '/supervise';

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
                    $scope.showImg = false;
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
                        if($scope.reportList.problemAttant){
                            var str = $scope.reportList.problemAttant.substring($scope.reportList.problemAttant.length-3);
                            var str1 = $scope.reportList.problemAttant.substring($scope.reportList.problemAttant.length-4);
                            if(str.toLowerCase() == 'jpg' || str.toLowerCase() == 'jpeg' || str.toLowerCase() == 'png'  || str1.toLowerCase() == 'jpeg'){
                                $scope.showImg = true;
                                $scope.imgUrl = $scope.reportList.problemAttant;
                            }else{
                                $scope.showImg = false;
                            }
                        }
                        PDFObject.embed($scope.reportList.problemAttant, "#file", options);
                    }else if(id ==2){
                        $scope.showImg = false;
                        if($scope.reportList.proposedTreatment){
                            var str = $scope.reportList.proposedTreatment.substring($scope.reportList.proposedTreatment.length-3);
                            var str1 = $scope.reportList.proposedTreatment.substring($scope.reportList.proposedTreatment.length-4);
                            if(str.toLowerCase() == 'jpg' || str.toLowerCase() == 'jpeg' || str.toLowerCase() == 'png'  || str1.toLowerCase() == 'jpeg'){
                                $scope.showImg = true;
                                $scope.imgUrl = $scope.reportList.proposedTreatment;
                            }else{
                                $scope.showImg = false;
                            }
                        }
                        PDFObject.embed($scope.reportList.proposedTreatment, "#file", options);
                    }else if(id ==3){
                        $scope.showImg = false;
                        if($scope.reportList.processingResults){
                            var str = $scope.reportList.processingResults.substring($scope.reportList.processingResults.length-3);
                            var str1 = $scope.reportList.processingResults.substring($scope.reportList.processingResults.length-4);
                            if(str.toLowerCase() == 'jpg' || str.toLowerCase() == 'jpeg' || str.toLowerCase() == 'png'  || str1.toLowerCase() == 'jpeg'){
                                $scope.showImg = true;
                                $scope.imgUrl = $scope.reportList.processingResults;
                            }else{
                                $scope.showImg = false;
                            }
                        }
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