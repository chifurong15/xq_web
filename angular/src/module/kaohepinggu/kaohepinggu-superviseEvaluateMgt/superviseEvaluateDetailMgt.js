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
                    $scope.showInput = false;
					$scope.reasonList = [
					    '水质发臭、水体颜色不正常',
					    '水域内有阻水障碍物',
					    '水面环境卫生差',
					    '水环境治理和水生态修复设施损坏',
					    '排水口门水质异常',
					    '偷排污染物、清洗有污染容器等影响水质行为',
					    '河长制公示牌、宣传牌内容不准确或损坏',
					    '堤岸环境卫生差',
					    '河道两岸存在违法建筑、围垦、占压等现象',
					    '其他不满'
                    ]

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
                            if(res.data.dissatisfiedReason){
                                $scope.reason = res.data.dissatisfiedReason.split('|');
                                $.each($scope.reason,function(i,item){
                                    $("input[type='checkbox'][value="+item+"]").attr("checked","checked");
                                });
                            }

                            if(res.data.isSatisfied == 0){
                                $scope.showInput = true;
                            }else{
                                $scope.showInput = false;
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