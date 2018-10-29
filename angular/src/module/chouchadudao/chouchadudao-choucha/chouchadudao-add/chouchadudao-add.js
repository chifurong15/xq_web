(function(window, angular) {
	'use strict';
	angular
		.module("app")
		.controller(
			'chouchaAddCtrl',
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
				function chouchaAddCtrl($localStorage, $scope,
						$location, $log, $q, $rootScope, $window,
						routeService, $http, $ajaxhttp, moduleService, globalParam) {
				
					var apiPrefix = moduleService.getServiceUrl() + '/spotcheck';
					
					$scope.init = function () {	
						$('.selectpicker').selectpicker({
                            noneSelectedText : '请选择'
			            });
                        getAllRegion();
                        getAllPerson();
					}

                    //获取所有的区
                    function getAllRegion(){
                        $ajaxhttp.myhttp({
                            url: apiPrefix + '/v1/spotcheck/listRegion',
                            method: 'get',
                            callBack: function (res) {
                                $scope.RegionList = res.data;
                                var select = $("#slpk");
                                for (var i = 0; i < res.data.length; i++) {
                                    select.append("<option value='"+res.data[i]+"'>"
                                        + res.data[i] + "</option>");
                                }
                                $('.selectpicker').selectpicker('val', '');
                                $('.selectpicker').selectpicker('refresh');
                            }
                        })
                    }

                    //获取下发人员
                    function getAllPerson(){
                        $ajaxhttp.myhttp({
                            url: apiPrefix + '/v1/spotcheck/listSendPerson',
                            method: 'get',
                            callBack: function (res) {
                                $scope.personList = res.data;
                            }
                        })
                    }

                    //监听区域选择
                    $scope.getChangeRegion = function () {
                        getAllRiver();
                    }

                    //获取所有的河道
                    function getAllRiver(){
                        $ajaxhttp.myhttp({
                            url: apiPrefix + '/v1/spotcheck/listRiver',
                            method: 'get',
							params:{
                            	regionStr:$scope.region.join(',')
							},
                            callBack: function (res) {
                                $scope.riverList = res.data;
                                var select = $("#slpkRiver");
                                for (var i = 0; i < res.data.length; i++) {
                                    select.append("<option value='"+res.data[i]+"'>"
                                        + res.data[i] + "</option>");
                                }
                                $('.selectpicker1').selectpicker('val', '');
                                $('.selectpicker1').selectpicker('refresh');
                            }
                        })

                    }

                    $('#J-postTime').datetimepicker({
                        format: 'YYYY-MM-DD',
                        locale: moment.locale('zh-cn')
                    }).on('dp.change', function (c) {
                        $scope.checkDate = new moment(c.date).format('YYYY-MM-DD');
                        $scope.$apply();
                    });

					//返回
					$scope.goBack=function(){
						history.back(-1);
					}	
					
					// 保存
					$scope.submit = function() {
						// var arrCon = [] ;
						// $.each($('input:checkbox:checked'),function(){
						// 	arrCon.push($(this).val());
			           	// });

						if (!$scope.title) {
                         layer.alert("请输入标题", {
                             skin: 'my-skin',
                             closeBtn: 1,
                             anim: 3
                         });
						} else if (!$scope.checkDate) {
                         layer.alert("请选择日期", {
                             skin: 'my-skin',
                             closeBtn: 1,
                             anim: 3
                         });
						} else if (!$scope.region) {
                         layer.alert("请选择抽查区域", {
                             skin: 'my-skin',
                             closeBtn: 1,
                             anim: 3
                         });
						} else if (!$scope.river) {
                         layer.alert("请选择抽查河道", {
                             skin: 'my-skin',
                             closeBtn: 1,
                             anim: 3
                         });
						} else if (!$scope.taskType) {
                            layer.alert("请选择任务类型", {
                                skin: 'my-skin',
                                closeBtn: 1,
                                anim: 3
                            });
                        }else if (!$scope.sendPerson) {
                            layer.alert("请选择下发人员", {
                                skin: 'my-skin',
                                closeBtn: 1,
                                anim: 3
                            });
                        }
						
						// 新增抽查
						var params = {
								title: $scope.title,
                            	checkDate: $scope.checkDate,
                            	checkRiver: $scope.river ? $scope.river.join(',') : '',
                            	regionName: $scope.region ? $scope.region.join(',') : '',
								taskType: $scope.taskType,
                            	sendPerson:$scope.sendPerson

						}
                        console.log(params);

						$ajaxhttp.myhttp({
						    url: apiPrefix + '/v1/spotcheck/addSpotcheck',
						    method: 'POST',
						    params:params,
						    callBack: function (res) {
								if(res.resCode == 1){
						            layer.msg('新增成功', {time:2000});
						            routeService.route('2-2', true);
								}
						    }
						})


					}
					
					//取消
					$scope.cancel = function () {
						routeService.route('2-2', true);
					}
					
					
					//清空表单
					var clear = function () {
						$scope.title = '';
						$scope.checkDate = '';
						$scope.river = [];
						$scope.taskType = '';
						$scope.sendPerson = '';
						$scope.region = [];
					}
			} ]);
})(window, angular);
