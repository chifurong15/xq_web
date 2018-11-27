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

                var apiPrefix = moduleService.getServiceUrl() + '/supervise';
                //var apiPrefix = 'http://10.0.9.116:7023' + '/supervise';


                /**
				 * ==============================================
				 * @name  superviseEvaluateDetailMgtCtrl
				 * @author  | 2018/10/25
				 * @version 
				 * @desc  社会监督评价详情
				 * ==============================================
				 */
				$scope.init = function(){

                    $scope.eventImgUrl = 'http://10.0.0.196/api/download';

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
                        url: apiPrefix + '/v1/SocialEvaluation/detailEvaluation',
                        method: 'get',
                        params: {
                            id: localStorage.getItem('id')
                        },
                        callBack: function (res) {
                            $scope.superviseList = res.data;
                            $scope.imgList = [];
                            if($scope.superviseList.problemPics){
                                $scope.imgList = $scope.superviseList.problemPics.split(',');
                            }
                            //console.log($scope.imgList)
                        }
                    })

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