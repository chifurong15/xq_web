(function(window, angular) {
	'use strict';
	angular
		.module("app")
		.controller(
			'kaohepingfenViewCtrl',
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
				function kaohepingfenViewCtrl($localStorage, $scope,
						$location, $log, $q, $rootScope, $window,
						routeService, $http, $ajaxhttp, moduleService, globalParam) {
				
					var apiPrefix = moduleService.getServiceUrl() + '/water';

                    $scope.userInfo = $localStorage.userLoginInfo.userInfo;
					
					$scope.init = function () {
						var bulletin = globalParam.getter().bulletin || {};
						$scope.id = bulletin.id;
                        $ajaxhttp.myhttp({
                            url: apiPrefix + '/v1/SurfaceWater/userinfo1',
                            method: 'get',
                            params:{
                                id: $scope.userInfo.id
                            },
                            callBack: function (res) {
                                $scope.num = res.data;
                                //$scope.num = '';
                            }
                        })
						getData($scope.id);
                        getAllArea();
					}
					
					//返回
					$scope.goBack=function(){
						history.back(-1);
					}	
					
					
					// 数据详情
					function getData (id) {
						$ajaxhttp.myhttp({
							url: apiPrefix + '/v1/SurfaceWaterGrade/list',
							method: 'get',
							params: {
								parentid: id
							},
							callBack: function (res) {
								$scope.detailList = res.data;
							}
						})
					}

					//新增得分条目
					$scope.add = function () {
                        $scope.type = 2 ; //新增
						$("#myModal").modal('show');
                    }

                    //修改得分条目
					$scope.edit = function (item) {
                        $scope.type=1;//修改
						$('#myModal').modal('show');
						if(item){
                            $scope.area = item.popedom;
                            $scope.score = item.grade;
                            $scope.selfId = item.id;
						}

					}

					//保存
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

                        if($scope.type == 2){ //新增
                            $ajaxhttp.myhttp({
                                url: apiPrefix + '/v1/SurfaceWaterGrade/haveDistrict',
                                method: 'get',
                                params: {
                                    parentid: $scope.id,
                                    popedom: $scope.area
                                },
                                callBack: function (res) {
                                    if(res.data == 10){ //可以添加
                                        $ajaxhttp.myhttp({
                                            url: apiPrefix + '/v1/SurfaceWaterGrade/add',
                                            method: 'POST',
                                            params: {
                                                parentid: $scope.id,
                                                popedom: $scope.area,
                                                grade: $scope.score
                                            },
                                            callBack: function (res) {
                                                if(res.resCode == 1){
                                                    layer.msg('新增成功', {time:2000});
                                                    getData($scope.id);
                                                    clear();//创建成功后清空
                                                    $('#myModal').modal('hide');
                                                }else{
                                                    layer.msg(res.resMsg, {time:2000});
                                                }
                                            }
                                        })
                                    }else{
                                        layer.msg('行政区域不能相同', {time:2000});
                                    }
                                }
                            })

                        }else if($scope.type == 1){ //修改

                            $ajaxhttp.myhttp({
                                url: apiPrefix + '/v1/SurfaceWaterGrade/update',
                                method: 'PUT',
                                params: {
                                    id: $scope.selfId,
                                    popedom: $scope.area,
                                    grade: $scope.score
                                },
                                callBack: function (res) {
                                    if(res.resCode == 1){
                                        layer.msg('修改成功', {time:2000});
                                        clear();//创建成功后清空
                                        getData($scope.id);
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
                            url: apiPrefix + '/v1/SurfaceWaterGrade/delete',
                            method: 'DELETE',
                            params: {
                                id: id
                            },
                            callBack: function (res) {
                                if(res.resCode == 1){
                                    layer.msg('删除成功', {time:2000});
                                    getData($scope.id);
                                }
                            }
                        })
                    }

                    // 上传文件
                    $scope.uploadFile = function (e) {
                        for (var i = 0; i < e.files.length; i++) {
                            var form = new FormData();
                            var file = e.files[i];
                            $scope.attandName = file.name;
                            form.append('file', file);
                            form.append('fileName', file.name);
                            form.append('parentid', $scope.id);
                            $ajaxhttp.myhttp({
                                url: apiPrefix + '/v1/SurfaceWaterGrade/deletelist',
                                method: 'DELETE',
                                params: {
                                    parentid: $scope.id
                                },
                                callBack: function (res) {
                                    if(res.resCode == 1){
                                        $http({
                                            method: 'POST',
                                            url: apiPrefix + '/v1/SurfaceWaterGrade/upload',
                                            data: form,
                                            headers: {'Content-Type': undefined},
                                            transformRequest: angular.identity
                                        }).success(function (data) {
                                            if(data.resCode == 1){
                                                getData($scope.id)
                                            }
                                        }).error(function (data) {
                                            console.log('upload fail');
                                        })
                                    }
                                }
                            })
                        }
                    }

                    //清空表单
					function clear () {
                        $scope.area='';
                        $scope.score='';
                    }

                    $scope.cancel = function () {
                        $('#myModal').modal('hide');
                        clear();
                    }

                    //获取所有的区
                    function getAllArea () {
                        $http({
                            method: 'GET',
                            url: apiPrefix + '/v1/SurfaceWaterGrade/districtlist',
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
			} ]);
})(window, angular);
