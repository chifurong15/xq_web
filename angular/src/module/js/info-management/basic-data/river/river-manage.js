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

    var app = angular.module("app");
    app.filter("trustHtml",function($sce){
        return function (input){
            return $sce.trustAsHtml(input);
        }
    })
    app.controller(
        'imRiver', [
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
            function imRiver($localStorage, $scope, $location, $log, $q, $rootScope, globalParam, $window, routeService,moduleService, $http) {

                /**
                 * ================================
                 * 描述说明
                 * @author yuanhaitao</br>2018/09/05
                 * @module 河流管理
                 * @version 3.0.0
                 * ================================
                 */

                /*页面初始化方法*/
                $scope.init = function() {
                    /*调用查看详情模态框自适应方法*/
                    modalContainer();
                    /*默认显示第一页*/
                    $scope.paginationConf.currentPage = 1;
                    /*河流类型*/
                    // riverTypeItem();
                    /*水系树*/
                    riverTreeList();
                };

                /*河流类型*/
                $scope.riverChange = function() {
                    $http({
                        method: "get",
                        url: $localStorage.gwUrl + riverUrl + "/riverType",
                        params:{
                            type: '104'
                        }
                    }).success(function(res) {
                        if(res.resCode == 1){
                            console.log(res);
                            $scope.riverTypes = res.data;
                        }else{
                            layer.msg("服务器异常，请稍后再试");
                        }
                    }).error(function(res){
                        layer.msg('服务器异常，请稍后再试');
                    });

                }

                /*水系选择模态框*/
                $scope.waterTreeShow = function() {
                    $("#riverTreePanel").modal('show');
                };

                /*水系树配置*/
                var riverTreeSetting = {
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
                        beforeExpand: riverTreeOnExpand,
                        onClick: riverTreeOnClick
                    }
                };

                /*树节点点击事件*/
                var water_ztree_name,
                    water_ztree_code;
                function riverTreeOnClick(event, treeId, treeNode) {
                    console.log('===========riverTreeOnClick===========');
                    water_ztree_name = treeNode.name;
                    water_ztree_code = treeNode.id;
                };

                /*树节点展开事件*/
                function riverTreeOnExpand(event, treeId, treeNode) {
                    console.log('===========riverTreeOnExpand===========');
                };

                /*生成水系树*/
                function riverTreeList () {
                    $http({
                        method: "get",
                        url: $localStorage.gwUrl +waterUrl + "/belongWater"
                    }).success(function(res) {
                        if(res.resCode == 1){
                            console.log(res);
                            $.fn.zTree.init($("#riverTree"), riverTreeSetting, res.data);
                        }else{
                            layer.msg("服务器异常，请稍后再试");
                        }
                    }).error(function(res){
                        layer.msg('服务器异常，请稍后再试');
                    });

                };

                /*关闭模态框*/
                $scope.modalOk = function (){
                    $("#riverTreePanel").modal('hide');
                    $scope.waterSearchName = water_ztree_name;
                };

                /*水系模态框搜索框*/
                $scope.select = function() {
                    $http({
                        method: "get",
                        url: $localStorage.gwUrl +waterUrl + "/belongWater",
                        params: {
                            waterName: $scope.waterName
                        },
                    }).success(function(res) {
                        if(res.resCode == 1){
                            console.log(res);
                            console.log(res.data);
                            if(res.data){
                                console.log(111)
                                $.fn.zTree.init($("#riverTree"), riverTreeSetting, res.data);
                            }else{
                                console.log(132)
                                layer.msg('暂无查询到你想要的数据！',{time:2000});
                            }
                        }else{
                            layer.msg("服务器异常，请稍后再试");
                        }
                    }).error(function(res){
                        layer.msg('服务器异常，请稍后再试');
                    });

                };
                /*查看详情模块图*/
                var modalContainer = function () {
                    var drainageWrapperH = document.body.offsetHeight;
                    var drainageWrapperW = document.body.offsetWidth;
                    $("#remarkModalPanel").css("height",drainageWrapperH - 300 +"px");
                    $("#remarkPanel").css({
                        width:drainageWrapperW - 250 +"px",
                        marginTop:- ((drainageWrapperH/2)- 120)  +"px",
                        marginLeft:- ((drainageWrapperW/2)- 220) +"px",
                    });
                }
                window.onresize = function () {
                    modalContainer();
                }

                /*查看详情*/
                $scope.viewDetailFuc = function(id){
                    $("#viewDetailModal").modal('show');
                    $http({
                        url: $localStorage.gwUrl +riverUrl + "/detail",
                        method: "get",
                        params: {
                            id: id
                        }
                    }).success(function(res) {
                        if(res.resCode == 1){
                            $scope.detailContent=res.data.overView;
                        }else{
                            layer.msg("服务器异常，请稍后再试");
                        }
                    }).error(function(res){
                        layer.msg("服务器异常，请稍后再试");
                    });
                };

                /*向上移动*/
                $scope.riverMoveUp = function(id){
                    $http({
                        url: $localStorage.gwUrl +riverUrl + "/sortOrder",
                        method: 'put',
                        params: {
                            id:id,
                            status:0
                        },
                    }).success( function(res) {
                        if(res.resCode != 1) {
                            layer.msg('已经是第一个数据了，不能再向上移动了！',{time:2000});
                            return;
                        }
                        reGetProducts()
                    }).error(function(res) {
                        layer.msg('服务器异常，请稍后再试');
                    });
                }

                /*向下移动*/
                $scope.riverMoveDown = function(id){
                    $http({
                        url: $localStorage.gwUrl +riverUrl + "/sortOrder",
                        method: 'put',
                        params: {
                            id:id,
                            status:1
                        },
                    }).success( function(res) {
                        if(res.resCode != 1){
                            layer.msg('已经是最后一个数据了，不能再向下移动了！',{time:2000});
                            return;
                        }
                        reGetProducts()
                    }).error(function(res) {
                        layer.msg('服务器异常，请稍后再试');
                    });
                }


                /*表单搜索*/
                $scope.moveIcon = true;
                $scope.waterName = '';
                $scope.riverType = '';
                $scope.waterSearchName = '';
                $scope.riverSearch = function() {
                    if (($scope.riverType == '' || $scope.riverType == null) && $scope.waterSearchName == '' && $scope.waterSearchName == ''){
                        $scope.moveIcon = true;
                    } else if ($scope.riverName || $scope.riverType || $scope.waterName) {
                        $scope.moveIcon = false;
                    }else {
                        $scope.moveIcon = false;
                    }
                    reGetProducts();
                    $scope.paginationConf.currentPage = 1;
                    $('.page-num').val($scope.paginationConf.currentPage);
                }

                /*监测所属水系数据*/
                $scope.reSet = function(){
                    $scope.riverName = null;
                    $scope.riverType = null;
                    $scope.riverChangeId = null;
                    $scope.waterSearchName = null;
                    water_ztree_code = null;
                    reGetProducts();
                }


                /*表单分页*/
                var reGetProducts = function() {
                    $http({
                        url: $localStorage.gwUrl +riverUrl + "/list",
                        method: 'GET',
                        params: {
                            riverName: $scope.riverName,
                            riverType: $scope.riverChangeId,
                            waterCode: water_ztree_code,
                            page: $scope.paginationConf.currentPage,
                            size: $scope.paginationConf.itemsPerPage,
                            status: -1
                        },
                    })
                        .success( function(res) {
                            if(res.resCode == 1){
                                $scope.paginationConf.totalItems = res.data.total;
                                $scope.moduleList = res.data.list;
                            }else{
                                layer.msg('服务器异常，请稍后再试');
                            }
                        }).error(function(res) {
                        layer.msg('服务器异常，请稍后再试');
                    });
                };

                /*配置分页基本参数*/
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
                $scope.$watch('paginationConf.currentPage + paginationConf.itemsPerPage', reGetProducts);

                /*表单删除*/
                $scope.riverDelete = function(id) {
                    var layerIndex = layer.confirm('确定删除本条数据吗？', {
                        btn: ['确定', '取消']
                    }, function() {
                        $http({
                            url: $localStorage.gwUrl +riverUrl + "/delete",
                            method: "delete",
                            params: {
                                id: id
                            }
                        }).success(function success(result) {
                            if(result.resCode == 0) {
                                layer.msg('该河流下存在下级河流或河段，请先删除下级内容！',{time:1000});
                            } else {
                                layer.msg('删除成功！', {time:1000});
                            }
                            reGetProducts();
                        }, function failure(result) {
                            console.log(result);
                            layer.alert('api=>err', {
                                skin: 'my-skin',
                                closeBtn: 0,
                                anim: 4
                            });
                        });
                        layer.close(layerIndex);
                    }, function() {

                    });
                };

                /*河流新增*/
                $scope.riverAdd = function() {
                    routeService.route(506, false);
                }

                /*河流详情*/
                $scope.riverDetail = function(id) {
                    $http({
                        url: $localStorage.gwUrl +riverUrl + "/detail",
                        method: "get",
                        params: {
                            id: id
                        }
                    }).success(function success(result) {
                        console.log(result);
                        $localStorage.riverDetailData = result;
                        routeService.route(507, false);
                    });
                }

                /*河流编辑*/
                $scope.riverEdit = function(id) {
                    $http({
                        url: $localStorage.gwUrl +riverUrl + "/detail",
                        method: "get",
                        params: {
                            id: id
                        }
                    }).success(function success(result) {
                        console.log(result);
                        $localStorage.riverEditData = result;
                        routeService.route(508, false);
                    });
                }
            }
        ]);

})(window, angular);