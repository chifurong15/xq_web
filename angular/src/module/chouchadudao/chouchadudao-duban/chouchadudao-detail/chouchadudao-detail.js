(function(window, angular) {
	'use strict';
	angular
		.module("app")
		.controller(
			'dubanViewCtrl',
			[
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
				function dubanViewCtrl($localStorage, $scope,
						$location, $log, $q, $rootScope, $window,
						routeService, $http, $ajaxhttp, moduleService, globalParam) {
				
					// var apiPrefix = moduleService.getServiceUrl() + '/template';
                    var apiPrefix = 'http://10.0.9.133:8080' + '/duban';


                    $scope.init = function () {
						var bulletin = globalParam.getter().bulletin || {};
						$scope.id = localStorage.getItem('id');
                        getBasic ();
                        getAnswer ();
                        getDeal ();
                        getResult ();
						$scope.noOps = localStorage.getItem('no-ops');
						// var selectedId = localStorage.getItem('selectedId');
						// $('.js-tab').find('li').eq(selectedId).addClass('tab-active').siblings().removeClass('tab-active');
						// $(".js-con").find('.con').hide().eq(selectedId).show();
					}
					
					// 单选按钮组
	                $scope.typeList = [
	                    {"id": 1, "typeName": "是"},
	                    {"id": 2, "typeName": "否"}
	                ];
	                $scope.radioBtn = function(type){
	                    $scope.type = type;
//	                    getDataList();
	                }
	                
					//返回
					$scope.goBack = function(){
						history.back(-1);
					}	
					
					//获取基础资料
					function getBasic (){
                        $ajaxhttp.myhttp({
							url: apiPrefix + '/v1/DubanSupervision/detail',
							method: 'get',
							params:{
								id:$scope.id
							},
							callBack: function (res) {
								$scope.res = res.data;
							}
						})
					}

                    //获取回复反馈
                    function getAnswer (){
                        $ajaxhttp.myhttp({
                            url: apiPrefix + '/v1/DubanSupervision/detailFeedbackhf',
                            method: 'get',
                            params:{
                                supervisionid:$scope.id
                            },
                            callBack: function (res) {
                                $scope.resAnswer = res.data;
                            }
                        })
                    }

                    //获取处理反馈
                    function getDeal (){
                        $ajaxhttp.myhttp({
                            url: apiPrefix + '/v1/DubanSupervision/detailFeedbackcl',
                            method: 'get',
                            params:{
                                supervisionid:$scope.id
                            },
                            callBack: function (res) {
                                $scope.resDeal = res.data;

                            }
                        })
                    }

                    //获取核查结果
                    function getResult (){
                        $ajaxhttp.myhttp({
                            url: apiPrefix + '/v1/DubanSupervision/detailFeedbackhc',
                            method: 'get',
                            params:{
                                supervisionid:$scope.id
                            },
                            callBack: function (res) {
                                $scope.resResult = res.data;
                            }
                        })
                    }




					//取消
					$scope.back = function () {
                        routeService.route('2-4', true);
                        //layer.msg("回复成功！",{time:2000});
					}

					//tab栏切换					
					$('.js-tab li').on("click",function (){
						var index = $(this).index();
						console.log(index)
						$(this).addClass('tab-active').siblings().removeClass('tab-active');
						$(".js-con").find('.con').hide().eq(index).show();						
					});

					// 获取url参数
					function  getQueryString (params, url) {
				        var url = url || location.href;
				        var search = url.split('?')[1];
				        if (search) {
				            var n = new RegExp("(^|&)" + params + "=([^(&|#)]*)((&|#)|$)", "i"),
				                r = search.match(n);
				            return null != r ? r[2] : null
				        }
				        return null;
				    }
			} ]);
})(window, angular);
