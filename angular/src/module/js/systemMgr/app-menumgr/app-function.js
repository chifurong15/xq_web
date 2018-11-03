'use strict';
var app = angular.module('app');
app.controller(
    'sysMgrAppMenuManagerController',
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
        'moduleService',
        function sysMgrAppMenuManagerController($localStorage, $scope, $location, $log,
                                                $q, $rootScope, globalParam, $window, routeService, $http, moduleService) {

            var functionUrlPrefix = $localStorage.serviceUrl  + '/appFunction/';
            $scope.reloadRoute = function () {
                $window.location.reload();
            };
            $scope.appFunctionOperate = function (id, editFlag) {
                //参数1 ：为 对应 config.json文件的 menus或pages里面的seqId ,
                //参数false:代表是否为menus,false就是去pages的seqId，true取menus的seqId;
                var param = {id: id, editFlag: editFlag};
                //新增
                if (!editFlag) {
                    param.parentNode = $scope.treeNodes;
                    if (!$scope.treeNodes || $scope.treeNodes.functionType != 'M') {
                        layer.alert('不能在非菜单节点下添加子菜单！', {
                            skin: 'layui-layer-lan',
                            closeBtn: 0,
                            anim: 4
                        });
                        return;
                    }
                }
                globalParam.setter(param);
                routeService.route(808, false);
            }

            $scope.init = function () {
                $scope.treeList();
            };
            $scope.treeList = function (pid) {
                // var serviceUrl = $localStorage.platformRouterConfig['serviceUrl'];
                $http({
                    method: HTTP.METHOD.GET,
                    url: functionUrlPrefix + "queryAppFunctionTree",
                    params: {
                        pid: pid ? pid : '',
                        status: -1
                    },
                }).success(
                    function (res) {
                        if (!HTTP.actionForResCode(res.resCode)) {
                            return;
                        }
                        var setting1 = {
                            enable: true,
                            callback: {
                                onClick: zTreeOnClick,
                                onExpand: expandNode,
                            }
                        };
                        $scope.tree = $.fn.zTree.init($("#tree1"), setting1, res.data);
                        var nodes = $scope.tree.getNodes();
                        //选择根节点
                        if (nodes.length > 0) {
                            $scope.tree.selectNode(nodes[0]);
                            setting1.callback.onClick(null, $scope.tree.setting.treeId, nodes[0]);
                            //listAppFunctions(nodes[0].id)
                        }
                    }
                );
            };
            function expandNode(event, treeId, treeNode) {
                var cNodes = treeNode.children;
                if (cNodes != null && cNodes.length > 0) {
                    return;
                }
                //$scope.treeNodes = treeNode;
                $http({
                    method: HTTP.METHOD.GET,
                    url: functionUrlPrefix + "queryAppFunctionTree",
                    params: {
                        pid: treeNode.id,
                        status: -1
                    },
                }).success(
                    function (res) {
                        if (!HTTP.actionForResCode(res.resCode)) {
                            return;
                        }
                        $scope.tree.addNodes(treeNode, res.data, true);
                    }
                );
            };
            function zTreeOnClick(event, treeId, treeNode) {
                // var serviceUrl = $localStorage.platformRouterConfig['serviceUrl'];
                $scope.treeNodes = treeNode;
                listAppFunctions(treeNode.id);
            };
            // 删除node
            function removeNode(id) {
                var nodes = $scope.tree.getNodeByParam("id", id, null);

                if (nodes) {
                    $scope.tree.removeNode(nodes);
                }
            }

            //分页
            var listAppFunctions = function (pid) {
                var params = {
                    pid: pid ? pid : 0,
                    pageNumber: $scope.paginationConf.currentPage,
                    pageSize: $scope.paginationConf.itemsPerPage,
                    status: -1
                }
                if ($scope.keywords) {
                    params.name = $scope.keywords;
                }
                $http({
                    url: functionUrlPrefix + 'listAppFunctions',
                    method: 'get',
                    params: params,
                }).success(function (res) {
                    if (!HTTP.actionForResCode(res.resCode)) {
                        return;
                    }
                    $scope.paginationConf.totalItems = res.data.total;
//		            // 变更产品条目
                    $scope.appFunctionsList = res.data.list;
                }).error(function (error) {
                });
            };
            /**
             * 关键字搜索
             */
            $scope.find = function () {
                $scope.paginationConf.currentPage = '';
                $scope.paginationConf.itemsPerPage = '';
                listAppFunctions(0);
            }
            $scope.getImageUrl = function (imageUrl) {
                return moduleService.getFileUrl(imageUrl);
            }

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
            $scope.$watch('paginationConf.currentPage + paginationConf.itemsPerPage', listAppFunctions);

            //删除
            $scope.deletes = function (id) {
                var layerIndex = layer.confirm('确定要删除功能？删除该功能会将其子功能一起删除！', {
                    btn: ['确定', '取消']
                    // 按钮
                }, function () {
                    $http({
                        url: functionUrlPrefix + "delete",
                        method: HTTP.METHOD.DELETE,
                        params: {id: id}
                    }).success(function success(result) {
                        //删除节点
                        removeNode(id);
                        listAppFunctions();
                        //alert("删除成功")
                        layer.alert("删除成功", {
                            skin: 'layui-layer-lan',
                            closeBtn: 1,
                            anim: 4
                        });
                    }, function failure(result) {
                        layer.alert('删除失败！', {
                            skin: 'layui-layer-lan',
                            closeBtn: 0,
                            anim: 4
                        });
                    });
                    layer.close(layerIndex);
                }, function () {

                });
            };
            /**
             * 禁用
             * @param id id
             * @param status 状态
             */
            $scope.enabledFunction = function (id, status) {
                $http({
                    method: HTTP.METHOD.PUT,
                    url: functionUrlPrefix + "update",
                    params: {id: id, status: status}
                }).success(
                    function (res) {
                        if (HTTP.actionForResCode(res.resCode)) {
                            listAppFunctions();
                        }
                    }
                );
            }


        }
    ]);

