(function(window, angular) {
	'use strict';
	angular
		.module("app")
		.controller(
			'anchaanfangAddCtrl',
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
				function anchaanfangAddCtrl($localStorage, $scope,
						$location, $log, $q, $rootScope, $window,
						routeService, $http, $ajaxhttp, moduleService, globalParam) {
				
					var apiPrefix = moduleService.getServiceUrl() + '/ancha';
					//var apiPrefix = 'http://10.0.9.133:7021' + '/ancha';
					$scope.init = function () {
						
						var bulletin = globalParam.getter().bulletin || {};
						
						$scope.id = bulletin.id;
                        console.log('000',$scope.id);
                        $('.selectpicker').selectpicker({
                            noneSelectedText : '请选择',
                            dropupAuto: false
                        });
                        $('.selectpicker1').selectpicker({
                            noneSelectedText : '请选择',
                            dropupAuto: false
                        });

						// 编辑时获取原数据

						if ($scope.id) {
                            // 根据id查询
                            $ajaxhttp.myhttp({
                                url: apiPrefix + '/v1/AnzhaInvestigations/detail',
                                method: 'get',
                                params: {
                                    id: $scope.id
                                },
                                callBack: function (res) {
                                    setData(res.data);
                                }
                            })
						}

                        getRegion();

                        getAllRiver();

                        getPerson();
					}


                    // 获取所有区
                    function getRegion() {
                        $ajaxhttp.myhttp({
                            url: apiPrefix + '/v1/AnzhaInvestigations/districtlist',
                            method: 'get',
                            callBack: function (res) {
                                $scope.regionList = res.data;
                                var select = $("#slpk");
                                for (var i = 0; i < res.data.length; i++) {
                                    select.append("<option value='"+res.data[i].regionId+"'>"
                                        + res.data[i].regionName + "</option>");
                                }
                                $('.selectpicker').selectpicker('val', '');
                                $('.selectpicker').selectpicker('refresh');
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
                            url: apiPrefix + '/v1/AnzhaInvestigations/reachlist',
                            method: 'get',
                            params:{
                                regionStr:$scope.region ? $scope.region.join(',') : ''
                            },
                            callBack: function (res) {
                                $scope.riverList = res.data;
                                var select = $("#slpkRiver");
                                for (var i = 0; i <res.data.length; i++) {
                                    select.append("<option value='"+res.data[i]+"'>"
                                        + res.data[i] + "</option>");
                                }
                                $('.selectpicker1').selectpicker('val', '');
                                $('.selectpicker1').selectpicker('refresh');
                            }
                        })
                    }

                    //获取所有下发人员
					function getPerson () {
                        $ajaxhttp.myhttp({
							url: apiPrefix + '/v1/AnzhaInvestigations/selectPersonnel',
							method: 'get',
							callBack: function (res) {
								$scope.personList = res.data.records;
							}
						})
					}


					
					$('#J-searchTime').datetimepicker({
	                    format: 'YYYY-MM-DD',
	                    locale: moment.locale('zh-cn')
	                }).on('dp.change', function (c) {
	                    $scope.searchTime = new moment(c.date).format('YYYY-MM-DD');
	                    $scope.$apply();
	                });
					
					// 还原编辑数据
					function setData (data) {
						$scope.selfid = data.id;
						$scope.title = data.title;
						$scope.searchTime = data.date;
						$scope.coordinate = data.coordinate;
                        $scope.region = data.regionid.split(',');
                        $scope.reach = data.reachname.split(',');
                        $("#slpk").selectpicker('val',$scope.region);
                        getAllRiver();
                        $("#slpkRiver").selectpicker('val',$scope.reach);
                        $("#slpkRiver").selectpicker('refresh');
						$scope.personnel = data.personnel;
						$('#personnel').val(data.personnel)
                        console.log($scope.region);
                        console.log($scope.reach);
                        console.log($scope.personnel);
                    }

					
					//返回
					$scope.goBack=function(){
						history.back(-1);
					}	
					
					// 保存
					$scope.submit = function() {

						if (!$scope.title) {
                         layer.alert("请输入标题", {
                             skin: 'my-skin',
                             closeBtn: 1,
                             anim: 3
                         });
						}else if (!$scope.region) {
                            layer.alert("请选择检查区域", {
                                skin: 'my-skin',
                                closeBtn: 1,
                                anim: 3
                            });
                        } else if (!$scope.searchTime) {
                         layer.alert("请选择检查日期", {
                             skin: 'my-skin',
                             closeBtn: 1,
                             anim: 3
                         });
						}else if (!$scope.reach) {
                            layer.alert("请选择检查河道", {
                                skin: 'my-skin',
                                closeBtn: 1,
                                anim: 3
                            });
                        }
                        // else if (!$scope.coordinate) {
                         // layer.alert("请输入坐标位置", {
                         //     skin: 'my-skin',
                         //     closeBtn: 1,
                         //     anim: 3
                         // });
						// }
						// else if (!$scope.personnel) {
                         // layer.alert("请选择下发人员", {
                         //     skin: 'my-skin',
                         //     closeBtn: 1,
                         //     anim: 3
                         // });
						// }
						
						// 新增任务
						var params = {
                            	schemeid:localStorage.getItem('id'),
								title: $scope.title,
                                regionid: $scope.region ? $scope.region.join(',') : '',
								date: $scope.searchTime,
                                reachname: $scope.reach ? $scope.reach.join(',') : '',
                                // coordinate: $scope.coordinate,
                                personnel:$scope.personnel
						}
						// console.log(params)
						if (!$scope.id) {
                            $ajaxhttp.myhttp({
                                url: apiPrefix + '/v1/AnzhaInvestigations/add',
                                method: 'post',
								params:params,
                                callBack: function (res) {
                                    if(res.resCode == 1){
                                        layer.msg('新增成功', {time:2000});
                                        routeService.route('2-1-4', false);
                                        clear();
                                    }else{
                                        layer.msg('服务器异常，请稍后再试');
									}
                                }
                            })
						}else{//修改任务
                            $ajaxhttp.myhttp({
                                url: apiPrefix + '/v1/AnzhaInvestigations/update',
                                method: 'put',
                                params:{
                                	id:$scope.selfid,
                                    schemeid:localStorage.getItem('id'),
                                    title: $scope.title,
                                    regionid: $scope.region ? $scope.region.join(',') : '',
                                    date: $scope.searchTime,
                                    reachname: $scope.reach ? $scope.reach.join(',') : '',
                                    leader: $scope.leader,
                                    personnel:$scope.personnel

                                },
                                callBack: function (res) {
                                    if(res.resCode == 1){
                                        layer.msg('修改成功', {time:2000});
                                        routeService.route('2-1-4', false);
                                        clear();
                                    }else{
                                        layer.msg('服务器异常，请稍后再试');
									}
                                }
                            })
							
						}
					}
				
					//取消
					$scope.back = function () {
						routeService.route('2-1-4', false);
					}
					
					
					//清空表单
					var clear = function () {
						$scope.title = '';
						$scope.region = '';
						$scope.reach = '';
						$scope.searchTime = '';
						$scope.coordinate = '';
						$scope.personnel = '';
					}					


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
