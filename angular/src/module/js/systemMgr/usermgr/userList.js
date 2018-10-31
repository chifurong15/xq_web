'use strict';
var app = angular.module('app');
app.controller(
    'userListController',
    [
        '$localStorage',
        '$scope',
        '$location',
        '$log',
        '$q',
        '$rootScope',
        'globalParam',
        '$window',
        'routeService',
        '$http',
        function userListController($localStorage, $scope, $location, $log,
                                    $q, $rootScope, globalParam, $window, routeService, $http) {
            //刷新
            $scope.reloadRoute = function () {
                $window.location.reload();

            };
            var $regionCode, $regionTreeContainer = $('#regionTreeContainer');
            var regionTree, treeNode_find, treeNode_id;
            var regionTreeUrl = $localStorage.gwUrl + '/information/v1/administrativeRegion/regionTree';

            $scope.init = function () {
                $scope.regionId = $localStorage.userLoginInfo.userInfo.regionId;
                regionTreeList();
            };

            // 模态框行政区域选择
            $scope.regionTree = function () {
                $('#regionTree').modal('show');

            }
            $scope.getRegion = function (id) {
                console.log(id);
                $('#regionTree').modal('hide');
            }

            // 行政区域树配置
            var regionTreeSetting = {
                data: {
                    simpleData: {enable: true},
                    keep: {parent: true}
                },
                view: {
                    nameIsHTML: true,
                    expandSpeed: 'slow',
                    dblClickExpand: false,
                    txtSelectedEnable: false
                },
                callback: {
                    beforeExpand: regionTreeOnExpand,
                    onClick: regionTreeOnClick
                }
            };

            // 捕获行政区域节点被点击
            function regionTreeOnClick(event, treeId, treeNode) {
                console.log(treeNode);
                $http({
                    method: 'get',
                    url: regionTreeUrl
                }).success(
                    function (resp) {
                        console.log(resp);
                        treeNode_find = treeNode.id;
                        $scope.regionId = treeNode.id;
                        $scope.regionName = treeNode.name;
                        $scope.grade = treeNode.grade;
                    })
            }

            // 用于捕获行政区域父节点展开之前的问题回调函数，并且根据返回值确定是否允许展开操作
            function regionTreeOnExpand(treeId, treeNode) {
                console.log('===========regionTreeOnExpand===========');
                var cnodes = treeNode.children;
                if (cnodes != null && cnodes.length > 0) {
                    return;
                }
                $http({
                    method: 'get',
                    url: regionTreeUrl,
                    params: {
                        parentCode: treeNode.id
                    },
                }).success(
                    function (res) {
                        console.log(res);
                        regionTree.addNodes(treeNode, res.data, true);
                    }
                );
            }

            // 区域树获取
            var regionTreeList = function () {
                $http({
                    method: 'get',
                    url: regionTreeUrl,
                    params: {
                        regionCode: $scope.regionId
                    }
                }).success(function (data) {
                    console.log(data)
                    $scope.regionList = data.data;
                    console.log($scope.regionList);
                    regionTree = $.fn.zTree.init($("#regionTreeContainer"), regionTreeSetting, $scope.regionList);
                }).error(function () {
                });
            };

            //分页
            var reGetProducts = function () {
                // var serviceUrl = $localStorage.platformRouterConfig['serviceUrl'];
                $http({
                    url: $localStorage.serviceUrl + '/smUser/queryUserList',
                    method: 'get',
                    params: {
                        regionId: $scope.regionId,
                        name: $scope.name,
                        pageNumber: $scope.paginationConf.currentPage,
                        pageSize: $scope.paginationConf.itemsPerPage
                    },
                }).success(function (res) {
                    if (res.resCode == 1) {
                        $scope.paginationConf.totalItems = res.data.totalNum;
                    // 变更产品条目
                        $scope.userList = res.data.records;
                    } else {
                        alert("服务器异常!");
                    }
                }).error(function (error) {
                });
            };

            // 配置分页基本参数
            $scope.paginationConf = {
                currentPage: $location.search().currentPage ? $location.search().currentPage : 1,
                itemsPerPage: 10,
                pagesLength: 5,
                perPageOptions: [5, 10, 15, 20, 25, 50],
                onChange: function () {
                    console.log($scope.paginationConf.currentPage);
                    $location.search('currentPage', $scope.paginationConf.currentPage);
                }
            };

            // 通过$watch currentPage和itemperPage 当他们一变化的时候，重新获取数据条目
            $scope.$watch('paginationConf.currentPage + paginationConf.itemsPerPage', reGetProducts);

            var datas;

            // 搜索
            $scope.search = function () {
                reGetProducts();
            };

            //修改
            $scope.revise = function (id) {
                globalParam.setter(id);
                routeService.route(805, false);
                // var serviceUrl = $localStorage.platformRouterConfig['serviceUrl'];
                //  	$http({
                //          method: "get",
                //          url:  $localStorage.serviceUrl + "/smUser/getById",
                //          params: {id:id}
                //  		}).success(
                // 	function (res) {
                // 	datas = res;
                // 	globalParam.setter(datas)
                // 	routeService.route(805, false);
                // }
                //  	);
            };
            //详情
            $scope.details = function (id) {
                globalParam.setter(id);
                routeService.route(806, false);

            };
            //删除
            $scope.deletes = function (id) {
                layui.use('layer', function () {
                    var layer = layui.layer;
                    var layerIndex = layer.confirm('确定删除本条数据吗？', {
                        btn: ['确定', '取消']
                        // 按钮
                    }, function () {
                        $http({
                            url: $localStorage.serviceUrl + "/smUser/deleteById",
                            method: "delete",
                            params: {id: id}
                        }).success(function success(result) {
                            reGetProducts();
                            alert("删除成功")
                        }, function failure(result) {
                            alert("删除失败！")
                        });
                        layer.close(layerIndex);
                    }, function () {

                    });
                });

            };
            //重置密码
            $scope.reset = function (id) {
                var layerIndex = layer.confirm('确定重置当前密码吗？', {
                    btn: ['确定', '取消']
                    // 按钮
                }, function () {
                    $http({
                        url: $localStorage.serviceUrl + "/smUser/resetPassword",
                        method: "put",
                        params: {id: id}
                    }).success(function success(result) {

                        alert("重置成功")
                    }, function failure(result) {
                        alert("重置失败！")
                    });
                    layer.close(layerIndex);
                }, function () {

                });
            };
            //注销启用
            // $scope.cancel = function (id) {
            //        // var serviceUrl = $localStorage.platformRouterConfig['serviceUrl'];
            //        $http({
            //            method: "get",
            //            url:  $localStorage.serviceUrl + "/smUser/getById",
            //            params: {id:id}
            //            }).success(
            //                function (res) {
            //                    status = res.data.status;
            //                    if(status == 1){
            //                        status = 2
            //                    }else{
            //                        status = 1
            //                    }
            //                    $http({
            //                        method: "put",
            //                        url:  $localStorage.serviceUrl + "/smUser/updateById",
            //                        params: {id:id,status:status}
            //                        }).success(
            //                            function (){
            //                                reGetProducts();
            //                            }
            //                        );
            //                    }
            //            );
            //    };
            $scope.addUser = function () {
                //参数1 ：为 对应 config.json文件的 menus或pages里面的seqId ,
                //参数false:代表是否为menus,false就是去pages的seqId，true取menus的seqId;
                routeService.route(804, false);
            };

            $scope.userType = function () {
                // var serviceUrl = $localStorage.platformRouterConfig['serviceUrl'];
                $http({
                    method: "GET",
                    url: $localStorage.serviceUrl + "/smRole/queryRoleList",
                    params: {pageNumber: -1, pageSize: -1},
                }).success(
                    function (res) {
                        if (res.resCode == 1) {
                            $scope.users = res.data.records;
                        } else {
                            alert("服务器异常!");
                        }
                    }
                );
            }
            $scope.userTypeFind = function (x) {
                if (x == null) {
                    $http({
                        url: $localStorage.serviceUrl + '/smUser/queryUserList',
                        method: 'get',
                        params: {
                            pageNumber: $scope.paginationConf.currentPage,
                            pageSize: $scope.paginationConf.itemsPerPage
                        },
                    }).success(function (res) {
                        if (res.resCode == 1) {
                            $scope.paginationConf.totalItems = res.data.totalNum;
//		            // 变更产品条目
                            $scope.userList = res.data.records;
                        } else {
                            alert("服务器异常!");
                        }
                    }).error(function (error) {
                    });
                } else {
                    $http({
                        method: "GET",
                        url: $localStorage.serviceUrl + "/smUser/queryUserList",
                        params: {roleId: x.id},
                    }).success(
                        function (res) {
                            if (res.resCode == 1) {
                                $scope.paginationConf.totalItems = res.data.totalNum;
                                $scope.userList = res.data.records;
                            } else {
                                alert("服务器异常!");
                            }
                        }
                    );
                }
            }

            //   $scope.find = function () {
            // // var serviceUrl = $localStorage.platformRouterConfig['serviceUrl'];
            //   	$http({
            //           url:  $localStorage.serviceUrl + "/smUser/queryUserList",
            //           method:'get',
            //           params:{name:$scope.name,pageNumber: $scope.paginationConf.currentPage,pageSize: $scope.paginationConf.itemsPerPage},
            //   		}).success(
            // 		function (res) {
            // 		   $scope.paginationConf.totalItems = res.data.totalNum;
            //         $scope.userList = res.data.records;
            //     }
            // );
            //   }
        }]);

