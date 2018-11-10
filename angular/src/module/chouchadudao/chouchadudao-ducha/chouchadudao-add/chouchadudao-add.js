(function(window, angular) {
	'use strict';
	angular
		.module("app")
		.controller(
			'duchaAddCtrl',
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
				function duchaAddCtrl($localStorage, $scope,
						$location, $log, $q, $rootScope, $window,
						routeService, $http, $ajaxhttp, moduleService, globalParam) {
				
					var apiPrefix = moduleService.getServiceUrl() + '/inspection';
                    //var apiPrefix = 'http://10.0.9.203:8081' + '/inspection';

                    $scope.init = function () {
                        getAllArea ();
                        getCheckType ();

					}

					
					$('#J-searchTime').datetimepicker({
	                    format: 'YYYY-MM-DD',
	                    locale: moment.locale('zh-cn')
	                }).on('dp.change', function (c) {
	                    $scope.searchTime = new moment(c.date).format('YYYY-MM-DD');
	                    $scope.$apply();
	                });

                    /**
                     * 上传附件
                     */
                    $scope.getUploadFile = function(){
                        $('#coverModal').modal('show');
                    }

                    /**
                     * 关闭上传附件
                     */
                    $scope.getUpload = function(){

                        $('#coverModal').modal('hide');

                        var formFile = new FormData();
                        var fileObj = document.querySelector('input[type=file]').files[0];

                        formFile.append("files", fileObj); //加入文件对象
                        $http({
                                method: 'post',
                                url: apiPrefix + '/v1/Inspection/upload',
                                data:formFile,
                                headers: {'Content-Type': undefined},
                                transformRequest: angular.identity
                            }
                        ).success(function (res) {
                            if (res.resCode == 1) {
                                $scope.accessory = res.data[0];
                            } else {
                                layer.msg("服务器异常，请稍后再试");
                            }
                        }).error(function (res) {
                            layer.msg('服务器异常，请稍后再试');
                        });
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
						} else if (!$scope.renumber) {
                         layer.alert("请输入文号", {
                             skin: 'my-skin',
                             closeBtn: 1,
                             anim: 3
                         });
						} else if (!$scope.searchTime) {
                         layer.alert("请选择印发日期", {
                             skin: 'my-skin',
                             closeBtn: 1,
                             anim: 3
                         });
						} else if (!$scope.inspectType) {
                         layer.alert("请选择检查方式", {
                             skin: 'my-skin',
                             closeBtn: 1,
                             anim: 3
                         });
						}else if (!$scope.content) {
                            layer.alert("请输入检查内容", {
                                skin: 'my-skin',
                                closeBtn: 1,
                                anim: 3
                            });
                        }else if (!$scope.sentRegion) {
                            layer.alert("请选择下发区域", {
                                skin: 'my-skin',
                                closeBtn: 1,
                                anim: 3
                            });
                        }
						
						// 新增评分管理					
						var params = {
								title: $scope.title,
								printDate:$scope.searchTime,
								renumber: $scope.renumber,
								inspectType: $scope.inspectType,
								sentRegion: $scope.sentRegion,
                            	content:$scope.content,
								accessory: $scope.accessory
						}
                        console.log(params);
                        $ajaxhttp.myhttp({
                            url: apiPrefix + '/v1/Inspection/add',
                            method: 'post',
                            params:params,
                            callBack: function (res) {
                                if(res.resCode == 1){
                                    clear();
                                    routeService.route('2-3', true);
                                    layer.msg("新增成功！",{time:2000});
                                }else{
                                    layer.msg("服务器异常，请稍后再试");
                                }

                            }
                        })

					}
					
					$scope.cancel = function () {
						$('#myModal').modal('hide');						
						clear();
					}
				
					//取消
					$scope.back = function () {
                    	clear();
						routeService.route('2-3', true);
					}
					
					
					//清空表单
					var clear = function () {
						$scope.title = '';
						$scope.searchTime = '';
						$scope.renumber = '';
						$scope.inspectType = '';
						$scope.sentRegion='';
						$scope.content='';
					}

					//获取检查方式
					function getCheckType () {
                    	$scope.CheckTypeList = [
							{
								id:1,
								type:'督导检查'
							},
                            {
                                id:2,
                                type:'全面检查'
                            },
                            {
                                id:3,
                                type:'专项检查'
                            },
						]
                    }

					//获取所有的区
					 function getAllArea () {
                         $ajaxhttp.myhttp({
                             url: apiPrefix + '/v1/Supervise/selectArea',
                             method: 'get',
                             callBack: function (res) {
                             	$scope.regionList = res.data;
                             }
                         })
					 }

			} ]);
})(window, angular);
