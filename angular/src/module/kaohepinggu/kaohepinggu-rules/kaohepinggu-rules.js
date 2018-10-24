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
                    var apiPrefix = 'http://10.0.9.116:8080/assessment';
					
					$scope.init = function () {
						getList();
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
							console.log('0000',item)
							$scope.id = 3;//新增违规细则
							$scope.index1 = index;
							$scope.gradeIllegal1 = item.gradeillegal;
							$scope.gradetype1 = item.childList[0].gradetype;
							
						}else if(id == 4){
							console.log(item)
							$scope.id = 4;//修改评分细则
							$scope.index2 = index;
							$scope.gradeIllegal1 = item.gradeillegal;
							$scope.gradetype1 = item.childList[0].gradetype;							
							$scope.gradedetailed = item.gradedetailed;
							$scope.gradeway = item.gradeway;
							$scope.deductMarks = item.deductMarks;
							$scope.processLimitted = item.processLimitted;
						
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
							}else if (!$scope.processLimited) {
	                            layer.alert("请输入处理时限", {
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
								processLimitted: $scope.processLimited
							}
							
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
								processLimitted: $scope.processLimited
							}							
							console.log($scope.gradeIllegal1)
							console.log($scope.gradetype1)
//							$ajaxhttp.myhttp({
//								url: apiPrefix + '/v1/IllegalXize/update',
//								method: 'PUT',
//								params:params,
//								callBack: function (res) {
//									if(res.resCode == 1){
//										layer.msg('修改成功', {time:2000});
//										getList();										
//	                                	clear();//创建成功后清空
//	                                	$('#myModal').modal('hide');						
//									}else{
//	                                	layer.msg(res.resMsg, {time:2000});										
//									}
//								}
//							})
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
