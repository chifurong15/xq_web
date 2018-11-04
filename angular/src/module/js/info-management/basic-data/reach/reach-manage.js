var modulePrefix = "/watersource";
var basicUrl = modulePrefix + "/v1/drainageBasin";
var waterUrl = modulePrefix + "/v1/waterSystem";
var riverUrl = modulePrefix + "/v1/river";
var lakesUrl = modulePrefix + "/v1/lakes";
var reservoirUrl = modulePrefix + "/v1/reservoir";
var reachUrl = modulePrefix + "/v1/reach";
var dictionaryUrl = modulePrefix + "/v1/dictionary";
(function(window, angular) {
    'use strict';

    angular.module("app").controller('imReach', [
        '$localStorage',
        '$scope',
        '$location',
        '$log',
        '$q',
        '$rootScope',
        'globalParam',
        '$window',
        'routeService',
        'moduleService',
        '$http',
        function imReach($localStorage, $scope, $location, $log, $q, $rootScope, globalParam,$window, routeService, moduleService,$http) {

            //所属区域树模态框【show】
            $scope.regionShow = function() {
                $scope.areaName = '';
                $("#region_ztree").modal('show');
                $scope.treeList_region(regionTreeUrl);
            };

            /*重置*/
            $scope.reSet = function(){
                $scope.reachName = null;
                $scope.region = null;
                treeNode_find = null;
                reGetProducts();
            }

            //所属区域树节点点击
            var treeNode_find,
                _areaCode;
            function zTreeOnClick(event, treeId, treeNode) {

                treeNode_find = treeNode.id;
                console.log(treeNode_find);

                _areaCode = treeNode.name;
                console.log(_areaCode);

            };

            var regionTree;
            var regionTreeUrl = $localStorage.gwUrl + basicUrl + "/tree";
            var setting = {
                view: {
                    selectedMulti: true,
                    showLine: true,
                    showIcon: true
                },
                data: {
                    simpleData: {enable: true},
                    keep: {parent: true}
                },
                callback: {
                    beforeExpand: zTreeOnExpand,
                    onClick: zTreeOnClick
                }
            };

            function zTreeOnExpand(treeId, treeNode) {
                console.log('===========zTreeOnExpand===========')
                var cnodes = treeNode.children;
                if (cnodes !=null && cnodes.length > 0){
                    return;
                }
                $http({
                    method: "GET",
                    url: regionTreeUrl,
                    params: {
                        parentCode: treeNode.id,
                    }
                }).success(
                    function (res) {
                        regionTree.addNodes(treeNode, res.data, true);
                    }
                );
            }

            //生成区域树
            $scope.treeList_region = function(regionTreeUrl) {
                console.log(regionTreeUrl);
                $http({
                    method: "GET",
                    url: regionTreeUrl,
                    dataType: 'json'
                }).success(
                    function (data) {
                        console.log(data.data)
                        regionTree = $.fn.zTree.init($("#regionTree"), setting, data.data);
                        console.log(regionTree)
                    }
                ).error(function () {
                });
            };


            //区域模态框搜索框
            $scope.select_region = function() {
                if($scope.areaName == null || $scope.areaName == ''){
                    $scope.treeList_region(regionTreeUrl);
                }else{
                    $http({
                        method: "GET",
                        url: regionTreeUrl,
                        params: {
                            areaName: $scope.areaName
                        },
                    }).success(
                        function(res) {
                            console.log(res);
                            regionTree = $.fn.zTree.init($("#regionTree"), setting, res.data);
                            $scope.tree = res.data
                        }
                    );
                }
            };
            //关闭所属区域模态框【确定按钮】
            $scope.region_modalOk = function() {
                $("#region_ztree").modal('hide');
                $scope.region = _areaCode;
            };

            //搜索
            $scope.find = function() {
                reGetProducts();
                $scope.paginationConf.currentPage = 1;
                $('.page-num').val($scope.paginationConf.currentPage);
            }

            // 表单分页
            var reGetProducts = function() {
                $http({
                    url: $localStorage.gwUrl +reachUrl + "/list",
                    method: 'GET',
                    params: {
                        reachName: $scope.reachName,
                        regionCode: treeNode_find,
                        page: $scope.paginationConf.currentPage,
                        size: $scope.paginationConf.itemsPerPage,
                        isNext: true
                    },
                }).success(
                    function(resp) {
                        console.log(resp);
                        console.log($scope.paginationConf.currentPage);
                        console.log($scope.paginationConf.itemsPerPage);
                        $scope.paginationConf.totalItems = resp.data.total;
                        console.log($scope.paginationConf.totalItems);
                        $scope.moduleList = resp.data.list;
                        console.log($scope.moduleList);
                    }).error(function(error) {});
            };

            // 配置分页基本参数
            $scope.paginationConf = {
                currentPage: $location.search().currentPage ? $location.search().currentPage : 1,
                itemsPerPage: $rootScope.tempSize == null ? 10 : $rootScope.tempSize,
                pagesLength: 5,
                perPageOptions: [5, 10, 20, 50],
                onChange: function() {
                    $location.search('currentPage', $scope.paginationConf.currentPage);
                    $rootScope.tempSize  = $scope.paginationConf.itemsPerPage;
                }
            };
            // 通过$watch currentPage和itemperPage,当他们一变化的时候，重新获取数据条目
            $scope.$watch('paginationConf.currentPage + paginationConf.itemsPerPage', reGetProducts);

            // 表单删除
            $scope.moduleDelete = function(id) {
                var layerIndex = layer.confirm('确定删除本条数据吗？', {
                    btn: ['确定', '取消']
                    // 按钮
                }, function() {
                    $http({
                        url: $localStorage.gwUrl +reachUrl + "/delete",
                        method: "delete",
                        params: {
                            id: id
                        }
                    }).success(function success(result) {
                        reGetProducts();
                        layer.msg('删除成功', {
                            time: 1000
                        });
                    }, function failure(result) {
                        layer.msg('删除失败', {
                            time: 1000
                        });
                    });
                    layer.close(layerIndex);
                }, function() {

                });
            };

            $scope.reachAdd = function() {
                routeService.route(509, false);
            };
            /* 查看河流详情 */
            $scope.reachDetail = function(id) {
                $http({
                    url: $localStorage.gwUrl +reachUrl + "/detail",
                    method: "get",
                    params: {
                        id: id
                    }
                }).success(
                    function success(result) {
                        console.log(result);
                        $localStorage.reachDetailData = result;
                        routeService.route(510, false);
                    });
            };

            /* 编辑河流信息 */
            $scope.reachEdit = function(id) {
                $http({
                    url: $localStorage.gwUrl +reachUrl + "/detail",
                    method: "get",
                    params: {
                        id: id
                    }
                }).success(
                    function success(result) {
                        console.log(result);
                        $localStorage.reachEditData = result;
                        routeService.route(511, false);
                    });
            };

            /*上传文档*/
            $scope.reachDocument = function(id) {
                $localStorage.reachId= id;
                console.log($localStorage.reachId)
                routeService.route(1024, false);
            };


        }
    ]);

})(window, angular);