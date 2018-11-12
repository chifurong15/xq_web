(function(window, angular) {
	'use strict';
	angular
		.module("app")
		.controller(
			'scoreListCtrl',
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
				function scoreListCtrl($localStorage, $scope,
						$location, $log, $q, $rootScope, $window,
						routeService, $http, $ajaxhttp, moduleService , globalParam) {
					
					//var apiPrefix = moduleService.getServiceUrl() + '/assessment';
                    //var apiPrefix = 'http://10.0.9.116:7003' + '/assessment';

                    $scope.userInfo = $localStorage.userLoginInfo.userInfo;
					
					$scope.init = function () {
						$scope.num = "2";
                        		getList();

                        // $ajaxhttp.myhttp({
						// 	url: apiPrefix + '/v1/assessment/userinfo1',
						// 	method: 'get',
						// 	params:{
						// 		id: $scope.userInfo.id
						// 	},
						// 	callBack: function (res) {
						// 		$scope.num = res.data;
						// 		getList();
						// 	}
						// })
					}	
					
					// 获取数据列表
					function getList () {

						$ajaxhttp.myhttp({
							url: apiPrefix + '/v1/assessment/list',
							method: 'get',							
							callBack: function (res) {
								$scope.scoreList = res.data;
								console.log($scope.scoreList)
							}
						})
					}
					
					//清空表单
					function clear () {
						$scope.gradetype = '';
						$scope.weight = '';
						$scope.totalpoints = '';
						$scope.sort = '';
					}
					
					
					//提交
					$scope.save = function (){
						if (!$scope.gradetype) {
                            layer.alert("请输入评分类型", {
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
						} else if (!$scope.totalpoints) {
                            layer.alert("请输入总分", {
                                skin: 'my-skin',
                                closeBtn: 1,
                                anim: 3
                            });
						} else if (!$scope.sort) {
                            layer.alert("请输入排序", {
                                skin: 'my-skin',
                                closeBtn: 1,
                                anim: 3
                            });
						} 
						
						var params = {
							//id: $scope.id,
							gradetype: $scope.gradetype,
							weight: $scope.weight,
							totalpoints: $scope.totalpoints,
							sort: $scope.sort,
							parentid: $scope.parentid,
							gradelevel: $scope.gradelevel
						}
						
						if($scope.type == 2){ //新增							
							$ajaxhttp.myhttp({
								url: apiPrefix + '/v1/assessment/add',
								method: 'POST',
								params: params,
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
							
						}else if($scope.type == 1){ //修改

							$ajaxhttp.myhttp({
								url: apiPrefix + '/v1/assessment/update',
								method: 'PUT',
								params:params,
								callBack: function (res) {
									if(res.resCode == 1){
										layer.msg('修改成功', {time:2000});
	                                	clear();//创建成功后清空
	                                	getList();	
	                                	$('#myModal').modal('hide');						
									}else{
	                                	layer.msg(res.resMsg, {time:2000});										
									}
								}
							})
						}
						
					}
					
					//新增  修改  显示模态框
					$scope.showModal = function (id,item) {
                        clear ();
						$('#myModal').modal('show');						
						if(id == 2){
							$scope.type=1;//修改
							$scope.id = item.id;
							$scope.gradetype = item.gradetype;
							$scope.weight = item.weight;
							$scope.totalpoints = item.totalpoints;
							$scope.sort = item.sort;
						}else{
							$scope.type=2;//新增
							$scope.parentid = item.id;
							$scope.gradelevel = item.gradelevel;
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
					
					
					
					//删除
					$scope.delete = function (id) {
						$ajaxhttp.myhttp({
							url: apiPrefix + '/v1/assessment/delete',
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
