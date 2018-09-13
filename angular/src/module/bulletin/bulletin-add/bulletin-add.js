(function(window, angular) {
	'use strict';
	angular
		.module("app")
		.controller(
			'bulletinAddCtrl',
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
				function bulletinAddCtrl($localStorage, $scope,
						$location, $log, $q, $rootScope, $window,
						routeService, $http, $ajaxhttp, moduleService, globalParam) {
					
					$scope.init = function () {
						var bulletin = globalParam.getter().bulletin || {};
						if (!!getQueryString('id')) {
							bulletin.id = getQueryString('id');
						}
						
						// 编辑时获取原数据
						if (bulletin.id) {
							$location.search('id', bulletin.id);
							getData(bulletin.id);
						}
					}
					
					// 根据id查询
					function getData(id) {
						
						$ajaxhttp.myhttp({
							url: moduleService.getServiceUrl() + '/v1/bulletin/detail',
							method: 'get',
							params: {
								id: id
							},
							callBack: function (res) {
								var data = res.data;
								var attandNamePart = data.attandUrl.split('_');
								$scope.id = data.id;
								$scope.title = data.title;
								$scope.issuer = data.issuer;
								$scope.postTime = data.postTime;
								$scope.month = data.year + '-' + data.month;
								$scope.attandUrl = data.attandUrl;
								$scope.type = data.type;
								$scope.attandName = attandNamePart.splice(1, attandNamePart.length - 1).join('');
								CKEDITOR.instances.editor.setData(data.detail);
							}
						})
					}
					
					// 保存
					$scope.submit = function() {
						
						// 取得纯文本
						var data = CKEDITOR.instances.editor.getData();
						
						if (!$scope.title) {
                            layer.alert("请输入标题", {
                                skin: 'my-skin',
                                closeBtn: 1,
                                anim: 3
                            });
						} else if (!$scope.issuer) {
                            layer.alert("请输入上传人", {
                                skin: 'my-skin',
                                closeBtn: 1,
                                anim: 3
                            });
						} else if (!$scope.postTime) {
                            layer.alert("请选择上传日期", {
                                skin: 'my-skin',
                                closeBtn: 1,
                                anim: 3
                            });
						} else if (!$scope.month) {
                            layer.alert("请选择月份", {
                                skin: 'my-skin',
                                closeBtn: 1,
                                anim: 3
                            });
						} else if (!data) {
                            layer.alert("请输入内容", {
                                skin: 'my-skin',
                                closeBtn: 1,
                                anim: 3
                            });
						} else if (!$scope.type) {
                            layer.alert("请选择类型", {
                                skin: 'my-skin',
                                closeBtn: 1,
                                anim: 3
                            });
						}
						
						// 新增
						if (!$scope.id) {
							/*$ajaxhttp.myhttp({
								url: moduleService.getServiceUrl() + '/v1/bulletin/add',
								method: 'POST',
				                headers: {'Content-Type': undefined},
				                transformRequest: angular.identity,
								params: {
									title: $scope.title,
									issuer: $scope.issuer,
									postTime: $scope.postTime,
									year: new moment($scope.month).format('YYYY'),
									month: new moment($scope.month).format('MM'),
									attandUrl: $scope.attandUrl && $scope.attandUrl.slice(0, $scope.attandUrl.length - 1),
									detail: data,
									type: $scope.type
								},
								callBack: function (res) {
								    if (res.resCode === 1) {
	                                    layer.msg('新建成功', {time:2000});
	                                    clear();//创建成功后清空
	                                }else {
	                                    layer.msg(res.resMsg, {time:2000});
	                                    clear();
	                                }
								}
							});*/
							
							$http({
								url: moduleService.getServiceUrl() + '/v1/bulletin/add',
								method: 'post',
				                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
				                transformRequest: function(obj) {  
						            var str = [];
						            for (var s in obj) {
						            	str.push(encodeURIComponent(s) + "=" + encodeURIComponent(obj[s]));
						            }
						            return str.join("&");
						        },
								data: {
									title: $scope.title,
									issuer: $scope.issuer,
									postTime: $scope.postTime,
									year: new moment($scope.month).format('YYYY'),
									month: new moment($scope.month).format('MM'),
									attandUrl: $scope.attandUrl && $scope.attandUrl.slice(0, $scope.attandUrl.length - 1),
									detail: data,
									type: $scope.type
								}
							}).success( function(res) {
							    if (res.resCode === 1) {
                                    layer.msg('新建成功', {time:2000});
                                    clear();//创建成功后清空
                                } else {
                                    layer.msg(res.resMsg, {time:2000});
                                    clear();
                                }
							});
						}
						// 编辑
						else {
							/*$ajaxhttp.myhttp({
								url: moduleService.getServiceUrl() + '/v1/bulletin/update',
								method: 'put',
								data: {
									id: $scope.id,
									title: $scope.title,
									issuer: $scope.issuer,
									postTime: $scope.postTime,
									year: new moment($scope.month).format('YYYY'),
									month: new moment($scope.month).format('MM'),
									attandUrl: $scope.attandUrl.slice(0, $scope.attandUrl.length - 1),
									detail: data,
									type: $scope.type
								},
								callBack: function (res) {
								    if (res.resCode === 1) {
	                                    layer.msg('操作成功', {time:2000});
	                                }else {
	                                    layer.msg(res.resMsg, {time:2000});
	                                }
								}
							});*/
							$http({
								url: moduleService.getServiceUrl() + '/v1/bulletin/update',
								method: 'put',
				                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
				                transformRequest: function(obj) {  
						            var str = [];
						            for (var s in obj) {
						            	str.push(encodeURIComponent(s) + "=" + encodeURIComponent(obj[s]));
						            }
						            return str.join("&");
						        },
								data: {
									id: $scope.id,
									title: $scope.title,
									issuer: $scope.issuer,
									postTime: $scope.postTime,
									year: new moment($scope.month).format('YYYY'),
									month: new moment($scope.month).format('MM'),
									attandUrl: $scope.attandUrl.slice(0, $scope.attandUrl.length - 1),
									detail: data,
									type: $scope.type
								}
							}).success( function(res) {
							    if (res.resCode === 1) {
                                    layer.msg('操作成功', {time:2000});
                                }else {
                                    layer.msg(res.resMsg, {time:2000});
                                }
							});
						}
					}
					
					$('#J-postTime').datetimepicker({
	                    format: 'YYYY-MM-DD',
	                    locale: moment.locale('zh-cn')
	                }).on('dp.change', function (c) {
	                    $scope.postTime = new moment(c.date).format('YYYY-MM-DD');
	                    $scope.$apply();
	                });
					
//					$('#J-year').datetimepicker({
//	                    format: 'YYYY',
//	                    locale: moment.locale('zh-cn')
//	                }).on('dp.change', function (c) {
//	                    $scope.year = new moment(c.date).format('YYYY');
//	                    $scope.$apply();
//	                });
					
					$('#J-month').datetimepicker({
	                    format: 'YYYY-MM',
	                    locale: moment.locale('zh-cn')
	                }).on('dp.change', function (c) {
	                    $scope.month = new moment(c.date).format('YYYY-MM');
	                    $scope.$apply();
	                });
					// 上传文件
					$scope.uploadFile = function (e) {
						
						for (var i = 0; i < e.files.length; i++) {
	            			var form = new FormData();
							var file = e.files[i];
							if (!$scope.attandName) $scope.attandName = '';
							$scope.attandName += file.name + ';';
				            form.append('file', file);
				            form.append('fileName', file.name);
				            $http({
				                method: 'POST',
				                url: moduleService.getServiceUrl() + '/v1/bulletin/upload',
				                data: form,
				                headers: {'Content-Type': undefined},
				                transformRequest: angular.identity
				            }).success(function (res) {
								if (!$scope.attandUrl) $scope.attandUrl = '';
			                	$scope.attandUrl += res.data.url + ';';
				            }).error(function (data) {
				                 console.log('upload fail');
				            })
						}
						
			            /*$ajaxhttp.myhttp({
							url: moduleService.getServiceUrl() + '/v1/bulletin/upload',
							method: 'post',
							params: {
								file: file,
								fileName: file.name
							},
							callBack: function (res) {
			                	console.log(res);
							}
						})*/
					}
					
					//清空表单
					var clear = function () {
						$scope.title = '';
						$scope.issuer = '';
						$scope.postTime = '';
						$scope.attandUrl = '';
						$scope.attandName = '';
						CKEDITOR.instances.editor.setData(" ");
					}
					
					// 返回按钮
					$scope.back = function () {
						routeService.route('1-1', true);
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
