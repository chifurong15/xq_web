(function(window, angular) {
	'use strict';
	angular
		.module("app")
		.controller(
			'wushuiViewCtrl',
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
				function wushuiViewCtrl($localStorage, $scope,
						$location, $log, $q, $rootScope, $window,
						routeService, $http, $ajaxhttp, moduleService, globalParam) {
				
					var apiPrefix = moduleService.getServiceUrl() + '/sewage';
                    //var apiPrefix = 'http://10.0.9.116:7005' + '/sewage';


                    $scope.userInfo = $localStorage.userLoginInfo.userInfo;

					$scope.init = function () {
						var bulletin = globalParam.getter().bulletin || {};
                        $ajaxhttp.myhttp({
                            url: apiPrefix + '/v1/SewageDispose/userinfo1',
                            method: 'get',
                            params:{
                                id: $scope.userInfo.id
                            },
                            callBack: function (res) {
                                $scope.num = res.data;
                                //$scope.num = '';
                            }
                        })
						$scope.id = localStorage.getItem('id');
						$scope.title = localStorage.getItem('title');
						$scope.issue = localStorage.getItem('issue');
						
						getData();
                        getAllArea();
                        getAllName ();
					}
					
					//返回
					$scope.goBack=function(){
						history.back(-1);
					}	
					
					
					// 数据详情
					function getData () {
						$ajaxhttp.myhttp({
							url: apiPrefix + '/v1/SewageDisposeReport/list',
							method: 'get',
							params: {
								parentid: $scope.id,
								pageNumber: $scope.paginationConf.currentPage,
								pageSize: $scope.paginationConf.itemsPerPage
							},
							callBack: function (res) {
								$scope.dataList = res.data.list;
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
                            $scope.dataLists = res.data;
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
                            $scope.name = item.name;
                            $scope.region = item.region;
                            $scope.assess = item.assess;
                            $scope.reason = item.reason;
                            $scope.status = item.status;
                            $scope.selfId = item.id;
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
                                    getData();
                                }
                            }
                        })
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
                                                    getData();
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
                                        getData();
                                        $('#myModal').modal('hide');
                                    }else{
                                        layer.msg(res.resMsg, {time:2000});
                                    }
                                }
                            })
                        }

                    }

                    // 上传文件
                    $scope.uploadFile = function (e) {
                        for (var i = 0; i < e.files.length; i++) {
                            var form = new FormData();
                            var file = e.files[i];
                            $scope.attandName = file.name;
                            form.append('file', file);
                            form.append('fileName', file.name);
                            form.append('parentid', $scope.id ? $scope.id : $scope.pid);
                            $ajaxhttp.myhttp({
                                url: apiPrefix + '/v1/SewageDisposeReport/deletelist',
                                method: 'DELETE',
                                params: {
                                    parentid: $scope.id ? $scope.id : $scope.pid
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
                                                getData()
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
	                $scope.$watch('paginationConf.currentPage + paginationConf.itemsPerPage', getData);
			} ]);
})(window, angular);
