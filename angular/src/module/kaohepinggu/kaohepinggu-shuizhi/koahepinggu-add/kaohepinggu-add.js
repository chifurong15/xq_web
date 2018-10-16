(function(window, angular) {
	'use strict';
	angular
		.module("app")
		.controller(
			'shuizhiAddCtrl',
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
				function shuizhiAddCtrl($localStorage, $scope,
						$location, $log, $q, $rootScope, $window,
						routeService, $http, $ajaxhttp, moduleService, globalParam) {
				
					var apiPrefix = moduleService.getServiceUrl() + '/template';
					
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
								url: apiPrefix + '/v1/WaterQuality/detail',
								method: 'get',
								params: {
									id: getQueryString('id')
								},
								callBack: function (res) {
									setData(res.data);
								}
							})
						}
						
						getDate ();
						getAllName();
						getWaterList();
						
					}
					
					var id = getQueryString('id') ? getQueryString('id') : $scope.newid ;
					//获取得分条目列表					
					function getWaterList () {
						//alert(getQueryString('id'));
						$http({
							url: apiPrefix + '/v1/WaterQualityGrade/list?parentid=' + id,
							method: 'get',
							params:{
								pageNumber: $scope.paginationConf.currentPage,
								pageSize: $scope.paginationConf.itemsPerPage
							}
						}).success(function(res){
							if(res.resCode == 1){
								$scope.waterList = res.data.list;
                    			$scope.paginationConf.totalItems = res.data.total;								
							}
						})
					}
					
					//日期					
	                var samplingTime = $('#samplingTime').datetimepicker({
	                    format: 'YYYY-MM-DD',
	                    locale: moment.locale('zh-cn')
	                }).on('dp.change', function (c) {
	                    var result = new moment(c.date).format('YYYY-MM-DD');
	                    $scope.samplingTime = result;
	                    $scope.$apply();
	                });
	                
					//期号
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
						
						// 新增水质管理					
						var params = {
								title: $scope.title,
								createtime: $scope.currentdate,
								issue: $scope.searchTime,
								createUser: $scope.author,
								remark: $scope.issuer
						}
						if (!$scope.id) {
							$ajaxhttp.myhttp({
								url: apiPrefix + '/v1/WaterQuality/add',
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
						}else{//修改水质报告
							$ajaxhttp.myhttp({
								url: apiPrefix + '/v1/WaterQuality/updatelist',
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
							$scope.type=1;//修改
							$scope.samplingTime = item.samplingTime;
							$scope.water_temperature = item.water_temperature;
							$scope.total_phosphorus = item.total_phosphorus;
							$scope.ammonia_nitrogen = item.ammonia_nitrogen;
							$scope.permanganate_index = item.permanganate_index;
							$scope.DO = item.dO;
							$scope.selfId = item.id;
						}else{
							$scope.type=2;//新增
						}
					}
					
					$scope.cancel = function () {
						$('#myModal').modal('hide');						
						clear();
					}
					
					//保存条目
					$scope.save = function () {
						
						console.log($scope.section+'-----'+$scope.riverName)
						
						
						
						if (!$scope.samplingTime) {
                            layer.alert("请选择日期", {
                                skin: 'my-skin',
                                closeBtn: 1,
                                anim: 3
                            });
						} else if (!$scope.water_temperature) {
                            layer.alert("请输入水温", {
                                skin: 'my-skin',
                                closeBtn: 1,
                                anim: 3
                            });                            
						}else if (!$scope.total_phosphorus) {
                            layer.alert("请输入总磷", {
                                skin: 'my-skin',
                                closeBtn: 1,
                                anim: 3
                            });                            
						}else if (!$scope.ammonia_nitrogen) {
                            layer.alert("请输入氨氮", {
                                skin: 'my-skin',
                                closeBtn: 1,
                                anim: 3
                            });                            
						}else if (!$scope.permanganate_index) {
                            layer.alert("请输入高锰酸盐指数", {
                                skin: 'my-skin',
                                closeBtn: 1,
                                anim: 3
                            });                            
						}else if (!$scope.DO) {
                            layer.alert("请输入溶解氧", {
                                skin: 'my-skin',
                                closeBtn: 1,
                                anim: 3
                            });                            
						}
						
						if($scope.type == 2){ //新增
							console.log($scope.type)
//							if (!$scope.name) {
//	                          layer.alert("请输入断面名称", {
//	                              skin: 'my-skin',
//	                              closeBtn: 1,
//	                              anim: 3
//	                          });
//							}else if(!$scope.riverName){
//								layer.alert("请输入河流名称", {
//	                              skin: 'my-skin',
//	                              closeBtn: 1,
//	                              anim: 3
//	                          });
//							}
							
//							$ajaxhttp.myhttp({
//								url: apiPrefix + '/v1/WaterQualityGrade/haveDistrict',
//								method: 'get',
//								params: {
//									parentid: $scope.id,
//									name: $scope.name
//								},
//								callBack: function (res) {
//									if(res.data == 10){ 
//										//可以添加
//										
//									}
//								}
//							})		

//							$ajaxhttp.myhttp({
//								url: apiPrefix + '/v1/WaterQualityGrade/add',
//								method: 'POST',
//								params: {
//									parentid: $scope.id,
//									samplingTime: $scope.samplingTime,
//									water_temperature: $scope.water_temperature,
//									total_phosphorus: $scope.total_phosphorus,
//									ammonia_nitrogen: $scope.ammonia_nitrogen,
//									permanganate_index: $scope.permanganate_index,
//									DO: $scope.DO,
//								},
//								callBack: function (res) {
//									if(res.resCode == 1){
//										layer.msg('新增成功', {time:2000});
//										//getScoreList();										
//	                                	clear();//创建成功后清空
//	                                	$('#myModal').modal('hide');						
//									}else{
//	                                	layer.msg(res.resMsg, {time:2000});										
//									}
//								}
//							})
											
					
						}else if($scope.type == 1){ //修改

							$ajaxhttp.myhttp({
								url: apiPrefix + '/v1/WaterQualityGrade/update',
								method: 'PUT',
								params: {
									id: $scope.selfId ,
									samplingTime: $scope.samplingTime ,
									water_temperature: $scope.water_temperature , 
									total_phosphorus: $scope.total_phosphorus ,
									ammonia_nitrogen: $scope.ammonia_nitrogen ,
									permanganate_index: $scope.permanganate_index ,
									DO: $scope.DO 		
								},
								callBack: function (res) {
									if(res.resCode == 1){
										layer.msg('修改成功', {time:2000});
	                                	clear();//创建成功后清空
	                                	getWaterList();	
	                                	$('#myModal').modal('hide');						
									}else{
	                                	layer.msg(res.resMsg, {time:2000});										
									}
								}
							})
						}
						
					}
					
					//删除单条水质条目
					$scope.delete = function (id) {
						$ajaxhttp.myhttp({
							url: apiPrefix + '/v1/WaterQualityGrade/delete',
							method: 'DELETE',
							params: {
								id: id
							},
							callBack: function (res) {
								if(res.resCode == 1){
									layer.msg('删除成功', {time:2000});
									getWaterList();
								}
							}
						})	
					}
					
					//获取所有的断面  河流
					function getAllName () {
						$http({
			                method: 'GET',
			                url: apiPrefix + '/v1/WaterQualityGrade/selectCascade',				               
			            }).success(function (res) {
		                	
		                	var data = res.data;
		                	//断面
		                	$scope.nameOption = [] ;
		                	//河流
		                	$scope.riverOption = [] ;
		                	data.map(function(item , index){
		                		$scope.nameOption.push(item.name);
		                		$scope.riverOption.push(item.mdSection.riverName)
		                	})		                	
		                	$scope.riverOption = removeDuplicates($scope.riverOption);
			            })
					}
					
//					 function getName() {
//						console.log($scope.name)
//						$ajaxhttp.myhttp({
//							url: apiPrefix + '/v1/WaterQualityGrade/selectRiver?name=' + $scope.name,
//							method: 'get',
//							params: {
//								name: $scope.name
//							},
//							callBack: function (res) {
//								$scope.riverName = res.data
//							}
//						})						
//					}
					
					
					
					//数组去重
					function removeDuplicates(arr) {					  
					      var temp = {}, r = [];					  
					     for (var i in arr)					 
					          temp[arr[i]] = true;					  
					      for (var k in temp)					 
					         r.push(k);					 
					     return r;					 
					}					
					
					//取消
					$scope.back = function () {
						routeService.route(3, true);
					}					
					
					//清空表单
					var clear = function () {
						$scope.title = '';
						$scope.issuer = '';
						$scope.searchTime = '';
						$scope.author = '';
						$scope.section = '',
						$scope.riverName = '',
						$scope.samplingTime = '';
						$scope.water_temperature = '';
						$scope.total_phosphorus = '';
						$scope.ammonia_nitrogen = '';
						$scope.permanganate_index = '';
						$scope.DO = '';
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
								url: apiPrefix + '/v1/WaterQualityGrade/deletelist',
								method: 'DELETE',
								params: {
									parentid: id
								},
								callBack: function (res) {
									if(res.resCode == 1){
										$http({
							                method: 'POST',
							                url: apiPrefix + '/v1/WaterQualityGrade/upload',
							                data: form,
							                headers: {'Content-Type': undefined},
							                transformRequest: angular.identity
							            }).success(function (data) {
							            	if(data.resCode == 1){							            		
							            		getWaterList()
							            	}
							            }).error(function (data) {
							                 console.log('upload fail');
							            })
									}
								}
							})
						}
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
	                $scope.$watch('paginationConf.currentPage + paginationConf.itemsPerPage', getWaterList);
			} ]);
})(window, angular);
