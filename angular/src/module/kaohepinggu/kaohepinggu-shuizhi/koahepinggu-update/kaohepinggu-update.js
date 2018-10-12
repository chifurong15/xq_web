(function(window, angular) {
	'use strict';
	angular
		.module("app")
		.controller(
			'shuizhiUpdateCtrl',
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
				function shuizhiUpdateCtrl($localStorage, $scope,
						$location, $log, $q, $rootScope, $window,
						routeService, $http, $ajaxhttp, moduleService, globalParam) {
				
					var apiPrefix = moduleService.getServiceUrl() + '/bulletin';
					
					$scope.init = function () {	
						
						getDate ()
						
						var bulletin = globalParam.getter().bulletin || {};
						console.log(bulletin);
						// 编辑时获取原数据
						if (bulletin.id) {
							$location.search('id', bulletin.id);
							setData(bulletin);
						} else if (!bulletin.id && !!getQueryString('id')) {
							// 根据id查询
							$ajaxhttp.myhttp({
								url: apiPrefix + '/v1/bulletin/detail',
								method: 'get',
								params: {
									id: getQueryString('id')
								},
								callBack: function (res) {
									setData(res.data);
								}
							})
						}
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
						var attandNamePart = data.attandUrl.split('_');
						$scope.id = data.id;
						$scope.title = data.title;
						$scope.issuer = data.issuer;
						$scope.postTime = data.postTime;
						$scope.month = data.year + '-' + data.month;
						$scope.attandUrl = data.attandUrl;
						$scope.type = data.type;
						$scope.attandName = attandNamePart.splice(1, attandNamePart.length - 1).join('');
						CKEDITOR.instances.editor.setData(data.detail || ' ');
						
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
						// 新增
						if (!$scope.id) {
							var data={
									title: $scope.title,
									createTime: $scope.currentdate,
									searchTime:$scope.searchTime,
									author: $scope.author,
									issuer: $scope.issuer
							}
							console.log('打印数据',data);
							clear();
							
							
							
//							$http({
//								url: apiPrefix + '/v1/bulletin/add',
//								method: 'post',
//				                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
//				                transformRequest: function(obj) {  
//						            var str = [];
//						            for (var s in obj) {
//						            	str.push(encodeURIComponent(s) + "=" + encodeURIComponent(obj[s]));
//						            }
//						            return str.join("&");
//						        },
//								data: {
//									title: $scope.title,
//									issuer: $scope.issuer,
//									postTime: $scope.postTime,
//									year: new moment($scope.month).format('YYYY'),
//									month: new moment($scope.month).format('MM'),
////									attandUrl: $scope.attandUrl && $scope.attandUrl.slice(0, $scope.attandUrl.length - 1),
//									attandUrl: $scope.attandUrl,
//									detail: data,
//									type: $scope.type
//								}
//							}).success( function(res) {
//							    if (res.resCode === 1) {
//                                  layer.msg('新建成功', {time:2000});
//                                  clear();//创建成功后清空
//                              } else {
//                                  layer.msg(res.resMsg, {time:2000});
//                                  clear();
//                              }
//							});
						}
						// 编辑
//						else {
//							$http({
//								url: apiPrefix + '/v1/bulletin/update',
//								method: 'put',
//				                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
//				                transformRequest: function(obj) {  
//						            var str = [];
//						            for (var s in obj) {
//						            	str.push(encodeURIComponent(s) + "=" + encodeURIComponent(obj[s]));
//						            }
//						            return str.join("&");
//						        },
//								data: {
//									id: $scope.id,
//									title: $scope.title,
//									issuer: $scope.issuer,
//									postTime: $scope.postTime,
//									year: new moment($scope.month).format('YYYY'),
//									month: new moment($scope.month).format('MM'),
////									attandUrl: $scope.attandUrl.slice(0, $scope.attandUrl.length - 1),
//									attandUrl: $scope.attandUrl,
//									detail: data,
//									type: $scope.type
//								}
//							}).success( function(res) {
//							    if (res.resCode === 1) {
//                                  layer.msg('操作成功', {time:2000});
//                              }else {
//                                  layer.msg(res.resMsg, {time:2000});
//                              }
//							});
//						}
					}
					
					//新增条目
					$scope.addOne = function () {
						$('#myModal').modal('show');
					}
					
					//保存条目
					$scope.save = function () {
						if (!$scope.area) {
                            layer.alert("请选择区域", {
                                skin: 'my-skin',
                                closeBtn: 1,
                                anim: 3
                            });
						} else if (!$scope.score) {
                            layer.alert("请输入分数", {
                                skin: 'my-skin',
                                closeBtn: 1,
                                anim: 3
                            });                            
						}
						$('#myModal').modal('hide');						
						clear();
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
						$scope.area='';
						$scope.score='';
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
