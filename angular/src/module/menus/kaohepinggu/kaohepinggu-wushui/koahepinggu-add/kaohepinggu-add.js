(function(window, angular) {
	'use strict';
	angular
		.module("app")
		.controller(
			'wushuiAddCtrl',
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
				function wushuiAddCtrl($localStorage, $scope,
						$location, $log, $q, $rootScope, $window,
						routeService, $http, $ajaxhttp, moduleService, globalParam) {
				
					// var apiPrefix = $localStorage.gwUrl + '/template';
                    var apiPrefix = 'http://10.0.9.133:8082/template';
					
					$scope.init = function () {	
						
						var bulletin = globalParam.getter().bulletin || {};
						
						$scope.id = bulletin.id;
						console.log(bulletin);

						// 编辑时获取原数据
						if (bulletin.id) {
							$location.search('id', bulletin.id);
							setData(bulletin);
						} else if (!bulletin.id && !!getQueryString('id')) {
							// 根据id查询
							$ajaxhttp.myhttp({
								url: apiPrefix + '/v1/SewageDispose/detail',
								method: 'get',
								params: {
									id: getQueryString('id')
								},
								callBack: function (res) {
									//console.log('要修改的数据',res.data)									
									setData(res.data);
								}
							})
						}
						
						getDate ();
						getAllArea();
						getScoreList();
						getAllName ();
						
					}
					
					var id = localStorage.getItem('id');
					
					//获取得分条目列表
					function getScoreList () {
						$http({
							url: apiPrefix + '/v1/SewageDisposeReport/list?parentid=' + id,
							method: 'get',
							params:{
								pageNumber: $scope.paginationConf.currentPage,
								pageSize: $scope.paginationConf.itemsPerPage
							}
						}).success(function(res){
							if(res.resCode == 1){
								$scope.detailList = res.data.list;
								$scope.paginationConf.totalItems = res.data.total;
							}
						})
					}
					
					//获取所有的污水处理厂
					function getAllName () {
						$http({
							url: apiPrefix + '/v1/SewageDisposeReport/selectWorks',
							method: 'get'
						}).success(function(res){
							$scope.dataList = res.data;
						})
					}
					
					$('#J-searchTime').datetimepicker({
	                    format: 'YYYY-MM',
	                    locale: moment.locale('zh-cn')
	                }).on('dp.change', function (c) {
	                    $scope.searchTime = new moment(c.date).format('YYYY-MM');
	                    $scope.$apply();
	                });
					
					// 还原编辑数据
					function setData (data) {
						$scope.id = data.id;
						$scope.title = data.title;
						$scope.searchTime = data.issue;
						$scope.issuer = data.remark;
						$scope.author = data.createuser;
					}
					
					//获取当前时间
					 function getDate () {
	                    setInterval(function () {
							var date = new Date(),
								year = date.getFullYear(),
								month = date.getMonth() + 1,
								day = date.getDate(),
								hour = date.getHours(),
								min = date.getMinutes(),
								second = date.getSeconds();
								
							$scope.$apply(function () {
								$scope.currentdate=year + '-' + month  + '-' + day + ' ' + 
								(hour < 10 ? '0' + hour : hour) + ':' +
								(min < 10 ? '0' + min : min) + ':' +
								(second < 10 ? '0' + second : second) ;
							})
	                    }, 1000);
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
						} else if (!$scope.searchTime) {
                            layer.alert("请选择期号", {
                                skin: 'my-skin',
                                closeBtn: 1,
                                anim: 3
                            });
						} else if (!$scope.author) {
                            layer.alert("请输入创建人", {
                                skin: 'my-skin',
                                closeBtn: 1,
                                anim: 3
                            });
						} else if (!$scope.issuer) {
                            layer.alert("请输入备注", {
                                skin: 'my-skin',
                                closeBtn: 1,
                                anim: 3
                            });
						} 
						
						// 新增评分管理					
						var params = {
								title: $scope.title,
								createtime: $scope.currentdate,
								issue: $scope.searchTime,
								createUser: $scope.author,
								remark: $scope.issuer
						}
						if (!$scope.id) {
							$ajaxhttp.myhttp({
								url: apiPrefix + '/v1/SewageDispose/add',
								method: 'POST',
								params: params,
								callBack: function (res) {
									if(res.resCode == 1){
										$scope.newid = res.data.id;
										layer.msg('新建成功', {time:2000});
	                                	clear();//创建成功后清空
									}else{
	                                	layer.msg(res.resMsg, {time:2000});										
									}
								}
							})							
						}else{//修改污水报告
							$ajaxhttp.myhttp({
								url: apiPrefix + '/v1/SewageDispose/updatelist',
								method: 'PUT',
								params: {
									id: $scope.id,
									title: $scope.title,
									createtime: $scope.currentdate,
									issue: $scope.searchTime,
									createUser: $scope.author,
									remark: $scope.issuer
								},
								callBack: function (res) {
									if(res.resCode == 1){
										layer.msg('修改成功', {time:2000});
	                                	clear();//创建成功后清空
									}else{
	                                	layer.msg(res.resMsg, {time:2000});										
									}
								}
							})
							
						}
					}
					
					//新增条目  修改条目 显示模态框
					$scope.showModal = function (item) {
						$('#myModal').modal('show');						
						if(item){
							$scope.type = 1;//修改
							$scope.name = item.name;
							$scope.region = item.region;
							$scope.assess = item.assess;
							$scope.reason = item.reason;
							$scope.status = item.status;
							$scope.selfId = item.id;
						}else{
							$scope.type = 2;//新增
						}
					}
					
					$scope.cancel = function () {
						$('#myModal').modal('hide');						
						clear();
					}
					
					//保存条目
					$scope.save = function () {
						if (!$scope.name) {
                            layer.alert("请输入名称", {
                                skin: 'my-skin',
                                closeBtn: 1,
                                anim: 3
                            });
						} else if (!$scope.region) {
                            layer.alert("请选择行政区", {
                                skin: 'my-skin',
                                closeBtn: 1,
                                anim: 3
                            });                            
						}else if (!$scope.assess) {
                            layer.alert("请选择考核区", {
                                skin: 'my-skin',
                                closeBtn: 1,
                                anim: 3
                            });                            
						}else if (!$scope.status) {
                            layer.alert("请选择是否达标", {
                                skin: 'my-skin',
                                closeBtn: 1,
                                anim: 3
                            });                           
						}else if (!$scope.region) {
	                            layer.alert("请输入不达标原因", {
	                                skin: 'my-skin',
	                                closeBtn: 1,
	                                anim: 3
	                            });                            
							}

						if($scope.type == 2){ //新增
							console.log($scope.type)
							
							$ajaxhttp.myhttp({
								url: apiPrefix + '/v1/SewageDisposeReport/haveSewage',
								method: 'get',
								params: {
									parentid: $scope.id,
									name: $scope.name
								},
								callBack: function (res) {
									if(res.data == 10){ //可以添加
										$ajaxhttp.myhttp({
											url: apiPrefix + '/v1/SewageDisposeReport/add',
											method: 'POST',
											params: {
												parentid:$scope.id,
												name: $scope.name,
												region: $scope.region,
												assess:$scope.assess,
												status:$scope.status ? $scope.status : 0,
												reason:$scope.reason
											},
											callBack: function (res) {
												if(res.resCode == 1){
													layer.msg('新增成功', {time:2000});
													getScoreList();										
				                                	clear();//创建成功后清空
				                                	$('#myModal').modal('hide');						
												}else{
				                                	layer.msg(res.resMsg, {time:2000});										
												}
											}
										})			
									}else{
										layer.msg('不能添加已有的处理厂', {time:2000});
									}
								}
							})					
					
						}else if($scope.type == 1){ //修改

							$ajaxhttp.myhttp({
								url: apiPrefix + '/v1/SewageDisposeReport/update',
								method: 'PUT',
								params: {
									id: $scope.selfId,
									name: $scope.name,
									region: $scope.region,
									assess:$scope.assess,
									status:$scope.status,
									reason:$scope.reason
								},
								callBack: function (res) {
									if(res.resCode == 1){
										layer.msg('修改成功', {time:2000});
	                                	clear();//创建成功后清空
	                                	getScoreList();	
	                                	$('#myModal').modal('hide');						
									}else{
	                                	layer.msg(res.resMsg, {time:2000});										
									}
								}
							})
						}
						
					}
					
					//删除单条得分条目
					$scope.delete = function (id) {
						$ajaxhttp.myhttp({
							url: apiPrefix + '/v1/SewageDisposeReport/delete',
							method: 'DELETE',
							params: {
								id: id
							},
							callBack: function (res) {
								if(res.resCode == 1){
									layer.msg('删除成功', {time:2000});
									getScoreList();
								}
							}
						})	
					}
					
					//取消
					$scope.back = function () {
						routeService.route(95, true);
					}
					
					
					//清空表单
					var clear = function () {
						$scope.title = '';
						$scope.issuer = '';
						$scope.searchTime = '';
						$scope.author = '';
						$scope.name='';
						$scope.region='';
						$scope.assess='';
						$scope.status='';
						$scope.reason='';
						
					}					
					
					// 上传文件
					$scope.uploadFile = function (e) {						
						for (var i = 0; i < e.files.length; i++) {
	            			var form = new FormData();
							var file = e.files[i];
							$scope.attandName = file.name;
				            form.append('file', file);
				            form.append('fileName', file.name);	
				            form.append('parentid', getQueryString('id'));
				            $ajaxhttp.myhttp({
								url: apiPrefix + '/v1/SewageDisposeReport/deletelist',
								method: 'DELETE',
								params: {
									parentid: id
								},
								callBack: function (res) {
									if(res.resCode == 1){
										$http({
							                method: 'POST',
							                url: apiPrefix + '/v1/SewageDisposeReport/upload',
							                data: form,
							                headers: {'Content-Type': undefined},
							                transformRequest: angular.identity
							            }).success(function (data) {
							            	if(data.resCode == 1){							            		
							            		getScoreList()
							            	}
							            }).error(function (data) {
							                 console.log('upload fail');
							            })
									}
								}
							})
						}
					}
					
					//获取所有的区
					 function getAllArea () {
					 	    $http({
				                method: 'GET',
				                url: apiPrefix + '/v1/SewageDisposeReport/districtlist',				               
				            }).success(function (res) {
			                	$scope.allArea = res.data;
				            })
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
					
					// 配置分页基本参数
	                $scope.paginationConf = {
	                    currentPage: $location.search().currentPage ? $location.search().currentPage : 1,
	                    itemsPerPage: 10,
	                    pagesLength: 10,
				        perPageOptions: [1, 2, 3, 4, 5, 10],
	                    onChange: function () {
	                        //console.log($scope.paginationConf.currentPage);
	                        $location.search('currentPage', $scope.paginationConf.currentPage);
	                    }
	                };
	                // 当他们一变化的时候，重新获取数据条目
	                $scope.$watch('paginationConf.currentPage + paginationConf.itemsPerPage', getScoreList);
			} ]);
})(window, angular);
