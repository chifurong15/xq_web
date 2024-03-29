(function(window, angular) {
	'use strict';
	angular
		.module("app")
		.controller(
			'rulesListCtrl',
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
				function rulesListCtrl($localStorage, $scope,
						$location, $log, $q, $rootScope, $window,
						routeService, $http, $ajaxhttp, moduleService , globalParam) {
					
					var apiPrefix = moduleService.getServiceUrl() + '/assessment';
					// var apiPrefix = 'http://10.0.9.133:7003' + '/assessment';
                    $scope.userInfo = $localStorage.userLoginInfo.userInfo;
					
					$scope.init = function () {

                        // $scope.num = "2";
                        // getList();

                        $ajaxhttp.myhttp({
							url: apiPrefix + '/v1/assessment/userinfo1',
							method: 'get',
							params:{
								id: $scope.userInfo.id
							},
							callBack: function (res) {
								$scope.num = res.data;
								getList();
							}
                        })
					}					
					
					
					// 获取数据列表
					function getList () {
						
						$ajaxhttp.myhttp({
							url: apiPrefix + '/v1/IllegalXize/list1',
							method: 'get',							
							callBack: function (res) {
								$scope.rulesList = res.data;
								
							}
						})
					}	
					
					
					$scope.showModal = function (id , index ,item) {

						$('#myModal').modal('show');
						if(id == 1){
							$scope.id = 1;//新增评分规则
						}else if(id == 2){
							$scope.id = 2;//新增评分类型
							$scope.index = index;
						}else if(id == 3){
							//console.log('0000',item)
							$scope.id = 3;//新增违规细则
							$scope.index1 = index;
							$scope.gradeIllegal1 = item.gradeillegal;
							$scope.gradetype1 = item.childList[0].gradetype;

						}else if(id == 4){
							//console.log(item)
							$scope.id = 4;//修改评分细则
                            $scope.index2 = index;
                            $ajaxhttp.myhttp({
                                url: apiPrefix + '/v1/IllegalXize/detail',
                                method: 'get',
                                params:{
                                    id: index
                                },
                                callBack: function (res) {
                                    if(res.resCode == 1){
                                        //console.log(res)
                                        $scope.gradeIllegal1 = res.data.gradeillegal;
                                        $scope.gradetype1 = res.data.gradetype;
                                        $scope.gradedetailed = res.data.gradedetailed;
                                        $scope.gradeway = res.data.gradeway;
                                        $scope.deductMarks = res.data.deductMarks;
                                        $scope.processLimitted = res.data.processLimitted;
                                        $scope.assesstype = res.data.assesstype;

                                    }else{
                                        layer.msg(res.resMsg, {time:2000});
                                    }
                                }
                            })
						
						}
						
					}

					$scope.cancel = function () {
						$('#myModal').modal('hide');
						clear();
					}
					
					//返回
					$scope.goBack=function(){
						history.back(-1);
					}
					
					function clear (){
						$scope.gradeIllegal = '';
						$scope.gradetype = '';						
						$scope.gradedetailed = '';
						$scope.gradeway = '';
						$scope.deductMarks = '';
						$scope.processLimitted = '';
						$scope.assesstype = '';
					}
					
					//保存条目
					$scope.save = function () {
						if($scope.id == 1){
							if (!$scope.gradeIllegal) {
	                            layer.alert("请输入评分规则", {
	                                skin: 'my-skin',
	                                closeBtn: 1,
	                                anim: 3
	                            });	                            
							}
							$ajaxhttp.myhttp({
								url: apiPrefix + '/v1/IllegalXize/add',
								method: 'POST',
								params:{
									gradeIllegal: $scope.gradeIllegal
								},
								callBack: function (res) {
									if(res.resCode == 1){
										layer.msg('新增成功', {time:2000});
										getList();										
	                                	clear();//创建成功后清空
	                                	$('#myModal').modal('hide');						
									}else{
	                                	layer.msg(res.resMsg, {time:2000});										
									}
								}
							})
							
						}else if ($scope.id == 2){
							if (!$scope.gradetype) {
	                            layer.alert("请输入评分类型", {
	                                skin: 'my-skin',
	                                closeBtn: 1,
	                                anim: 3
	                            });
							}
							$ajaxhttp.myhttp({
								url: apiPrefix + '/v1/IllegalXize/add1',
								method: 'POST',
								params:{
									id:$scope.index ,
									gradetype: $scope.gradetype
								},
								callBack: function (res) {
									if(res.resCode == 1){
										layer.msg('新增成功', {time:2000});
										getList();										
	                                	clear();//创建成功后清空
	                                	$('#myModal').modal('hide');						
									}else{
	                                	layer.msg(res.resMsg, {time:2000});										
									}
								}
							})							
														
						}else if($scope.id == 3){							
                            if (!$scope.gradedetailed) {
	                            layer.alert("请输入违规细则名称", {
	                                skin: 'my-skin',
	                                closeBtn: 1,
	                                anim: 3
	                            });
                            } else if (!$scope.gradeway) {
	                            layer.alert("请选择评分方式", {
	                                skin: 'my-skin',
	                                closeBtn: 1,
	                                anim: 3
	                            });
                            }else if (!$scope.deductMarks) {
	                            layer.alert("请输入扣分", {
	                                skin: 'my-skin',
	                                closeBtn: 1,
	                                anim: 3
	                            });
                            }else if (!$('#processLimitted').val()) {
	                            layer.alert("请输入处理时限", {
	                                skin: 'my-skin',
	                                closeBtn: 1,
	                                anim: 3
	                            });
                            }else if (!$scope.assesstype) {
                                layer.alert("请选择考核类型", {
                                    skin: 'my-skin',
                                    closeBtn: 1,
                                    anim: 3
                                });
                            }

                            var params = {
								id: $scope.index1,
								gradedetailed: $scope.gradedetailed,
								gradeway: $scope.gradeway,
								deductMarks: $scope.deductMarks,
								processLimitted: $('#processLimitted').val(),
                                assesstype:$scope.assesstype
							}
							// console.log(params)
							$ajaxhttp.myhttp({
								url: apiPrefix + '/v1/IllegalXize/add2',
								method: 'POST',
								params:params,
								callBack: function (res) {
									if(res.resCode == 1){
										layer.msg('新增成功', {time:2000});
										getList();										
	                                	clear();//创建成功后清空
	                                	$('#myModal').modal('hide');						
									}else{
	                                	layer.msg(res.resMsg, {time:2000});										
									}
								}
							})
							
						}else if($scope.id == 4){
							if (!$scope.gradedetailed) {
	                            layer.alert("请输入违规细则名称", {
	                                skin: 'my-skin',
	                                closeBtn: 1,
	                                anim: 3
	                            });
							} else if (!$scope.gradeway) {
	                            layer.alert("请选择评分方式", {
	                                skin: 'my-skin',
	                                closeBtn: 1,
	                                anim: 3
	                            });                            
							}else if (!$scope.deductMarks) {
	                            layer.alert("请输入扣分", {
	                                skin: 'my-skin',
	                                closeBtn: 1,
	                                anim: 3
	                            });                            
							}else if (!$scope.processLimited) {
	                            layer.alert("请输入处理时限", {
	                                skin: 'my-skin',
	                                closeBtn: 1,
	                                anim: 3
	                            });                            
							}
							
							var params = {
								id: $scope.index2,
								gradedetailed: $scope.gradedetailed,
								gradeway: $scope.gradeway,
								deductMarks: $scope.deductMarks,
								processLimitted: $scope.processLimitted,
                                assesstype:$scope.assesstype
                            }
							// console.log($scope.gradeIllegal1)
							// console.log(params)
							$ajaxhttp.myhttp({
								url: apiPrefix + '/v1/IllegalXize/update',
								method: 'PUT',
								params:params,
								callBack: function (res) {
									if(res.resCode == 1){
										layer.msg('修改成功', {time:2000});
										getList();										
	                                	clear();//创建成功后清空
	                                	$('#myModal').modal('hide');						
									}else{
	                                	layer.msg(res.resMsg, {time:2000});										
									}
								}
							})
						}
						
					}
					
					//删除
					$scope.delete = function (id) {
						$ajaxhttp.myhttp({
							url: apiPrefix + '/v1/IllegalXize/delete',
							method: 'DELETE',
							params: {
								id: id
							},
							callBack: function (res) {
								if(res.resCode == 1){
									layer.msg('删除成功', {time:2000});
									getList();
								}
							}
						})	
					}
				
	                
			} ]);
})(window, angular);
