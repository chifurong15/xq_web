(function(window, angular) {
	'use strict';
	angular
		.module("app")
		.controller(
			'anchaanfangViewCtrl',
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
				function anchaanfangViewCtrl($localStorage, $scope,
						$location, $log, $q, $rootScope, $window,
						routeService, $http, $ajaxhttp, moduleService, globalParam) {
				
					var apiPrefix = moduleService.getServiceUrl() + '/ancha';
					
					
					$scope.init = function () {
                        // $('.selectpicker').selectpicker({
                        //     noneSelectedText : '请选择'
                        // });
                        $scope.eventImgUrl = 'http://10.0.0.196/api/download' ;

						$ajaxhttp.myhttp({
							url: apiPrefix + '/v1/AnzhaInvestigations/detail',
							method: 'get',
							params: {
								id: localStorage.getItem('id')
							},
							callBack: function (res) {
								if(res.resCode == 1){
									setData(res.data);
								}else{
									layer.msg('服务器异常，请稍后再试');
								}
							}
						})
                        getProblemType();
                        getList();
					}
					
					//返回
					$scope.goBack = function(){
						history.back(-1);
					}

					//获取上报列表
					function getList(){
                        $ajaxhttp.myhttp({
                            url: apiPrefix + '/v1/AnzhaReport/list',
                            method: 'get',
                            params: {
                                anzhaid: localStorage.getItem('id')
                            },
                            callBack: function (res) {
                                if(res.resCode == 1){
									$scope.reportList = res.data;
                                }else{
                                    layer.msg('服务器异常，请稍后再试');
                                }
                            }
                        })
					}


					//获取上报问题类型
					function getProblemType(){
						$scope.problemTypeList = [
							{
								id: 1,
								type:'是否按要求巡河(湖)，及时解决发现问题'
							},
                            {
                                id: 1,
                                type:'是否检查、督导、考核下级河(湖)长'
                            },
							{
                                id: 3,
                                type:'是否掌握管辖河湖基本信息'
                            },
                            {
                                id: 4,
                                type:'是否清楚管辖河湖下级河(湖)长情况'
                            },
                            {
                                id: 5,
                                type:'监督电话是否能正常处理群众意见'
                            },
                            {
                                id: 6,
                                type:'管辖河湖问题整改是够及时、彻底'
                            },
                            {
                                id: 7,
                                type:'管辖河湖社会监督举报处置结果群众是否满意'
                            },
                            {
                                id: 8,
                                type:'管辖河湖公示牌信息是否及时更新'
                            },
                            {
                                id: 9,
                                type:'管辖河湖是否存在水生态环境问题'
                            },
                            {
                                id: 10,
                                type:'需暗查暗访的其他事项'
                            }
						];
                        // var select = $("#slpk");
                        // for (var i = 0; i < $scope.problemTypeList.length; i++) {
                        //     select.append("<option value='"+ $scope.problemTypeList[i].type +"'>"
                        //         + $scope.problemTypeList[i].type + "</option>");
                        // }
                        // $('.selectpicker').selectpicker('val', '');
                        // $('.selectpicker').selectpicker('refresh');

					}

                    function setData (data) {
                        $scope.selfid = data.id;
                        $scope.title = data.title;
                        $scope.date = data.date;
                        $scope.leader = data.leader;
                        $scope.region = data.reachname;
                        $scope.reach = data.reachname;
                        $scope.personnel = data.personnel;
                    }

					//tab栏切换					
					$('.js-tab li').on("click",function (){
						var index = $(this).index();
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
