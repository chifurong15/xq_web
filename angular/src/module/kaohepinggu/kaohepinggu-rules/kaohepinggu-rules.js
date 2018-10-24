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
							url: apiPrefix + '/v1/assessment/list',
							method: 'get',							
							callBack: function (res) {
								$scope.scoreList = res.data;
								
							}
						})
					}					
					//评分规则模态框
					$scope.showModal1 = function () {
						$('#myModal1').modal('show');
					}
					
					//评分类型模态框
					$scope.showModal2 = function () {

						$('#myModal2').modal('show');
					}
					
					//违规细则模态框
					$scope.showModal3 = function () {
						$('#myModal3').modal('show');						
						
					}
					
					$scope.cancel = function () {
						$('#myModal1').modal('hide');						
						$('#myModal2').modal('hide');						
						$('#myModal3').modal('hide');
						clear();
					}
					
					//返回
					$scope.goBack=function(){
						history.back(-1);
					}
					
					//保存条目
					$scope.save = function () {
						alert(1)
						if (!$scope.gradetype) {
                            layer.alert("请选择评分类型", {
                                skin: 'my-skin',
                                closeBtn: 1,
                                anim: 3
                            });
						} else if (!$scope.weight) {
                            layer.alert("请输入权重", {
                                skin: 'my-skin',
                                closeBtn: 1,
                                anim: 3
                            });                            
						}else if (!$scope.totalpoints) {
                            layer.alert("请输入总分", {
                                skin: 'my-skin',
                                closeBtn: 1,
                                anim: 3
                            });                            
						}else if (!$scope.sort) {
                            layer.alert("请输入排序", {
                                skin: 'my-skin',
                                closeBtn: 1,
                                anim: 3
                            });                            
						}
						if($scope.type == 2){ //新增
							console.log($scope.type)
							
//							$ajaxhttp.myhttp({
//								url: apiPrefix + '/v1/SurfaceWaterGrade/add',
//								method: 'POST',
//								params: {
//									parentid: $scope.id,
//									popedom: $scope.area,
//									grade: $scope.score
//								},
//								callBack: function (res) {
//									if(res.resCode == 1){
//										layer.msg('新增成功', {time:2000});
//										getScoreList();										
//	                                	clear();//创建成功后清空
//	                                	$('#myModal').modal('hide');						
//									}else{
//	                                	layer.msg(res.resMsg, {time:2000});										
//									}
//								}
//							})			
					
						}else if($scope.type == 1){ //修改

//							$ajaxhttp.myhttp({
//								url: apiPrefix + '/v1/SurfaceWaterGrade/update',
//								method: 'PUT',
//								params: {
//									id: $scope.selfId,
//									popedom: $scope.area,
//									grade: $scope.score
//								},
//								callBack: function (res) {
//									if(res.resCode == 1){
//										layer.msg('修改成功', {time:2000});
//	                                	clear();//创建成功后清空
//	                                	getScoreList();	
//	                                	$('#myModal').modal('hide');						
//									}else{
//	                                	layer.msg(res.resMsg, {time:2000});										
//									}
//								}
//							})
						}
						
					}
					
					//删除单条得分条目
					$scope.delete = function (id) {
//						$ajaxhttp.myhttp({
//							url: apiPrefix + '/v1/SurfaceWaterGrade/delete',
//							method: 'DELETE',
//							params: {
//								id: id
//							},
//							callBack: function (res) {
//								if(res.resCode == 1){
//									layer.msg('删除成功', {time:2000});
//									getScoreList();
//								}
//							}
//						})	
					}
					
					
					// 新建
	                $scope.add = function () {
						globalParam.setter({
							bulletin: {}
						})

	                }
	                
	                //修改 
	                $scope.edit = function (id) {
	                	localStorage.setItem('id',id);
//						$ajaxhttp.myhttp({
//							url: apiPrefix + '/v1/SurfaceWater/detail',
//							method: 'get',
//							params: {
//								id: id
//							},
//							callBack: function (res) {
//								globalParam.setter({
//									bulletin: res.data
//								})
//							}
//						})						

	                }
	                
			} ]);
})(window, angular);
