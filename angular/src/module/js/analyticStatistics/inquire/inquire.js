(function (window, angular) {
    'use strict';

    var app = angular.module("app");
    app.filter("trustHtml", function ($sce) {
        return function (input) {
            return $sce.trustAsHtml(input);
        }
    })

    app.controller(
        'inquireCtrl', [
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
            'wish',
            'esriApiDeps',
            'tiandituFactory',
            'PatrolRiverService',
            function inquireCtrl($localStorage, $scope, $location, $log, $q, $rootScope, globalParam, $window, routeService, $http,
                                 wish, esriApiDeps, tiandituFactory, PatrolRiverService) {


                var promise = esriApiDeps.query();
                var w = wish.get();

                $scope.init = function () {
                    PatrolRiverService.init($scope.map, "patrolRiverLayer");

                    $scope.regionId = $localStorage.userLoginInfo.userInfo.regionId;
                    reGetProducts();
                    regionTreeList();
                    clearList();
                };

                var region = {
                    "longitude": 117.19203455803067,
                    "latitude": 39.08350838137276,
                    "regionlevel": 2
                };

                var initExtent = new w.Extent({
                    "xmin": -180,
                    "ymin": -90,
                    "xmax": 180,
                    "ymax": 90,
                    "spatialReference": {
                        "wkid": 4326
                    }
                });

                $scope.map = new w.Map("patrolmap", {
                    extent: initExtent,
                    slider: false,
                    autoResize: true,
                    resizeDelay: 100,
                    logo: false
                });
                tiandituFactory.initTianditu($scope.map, region);


                var $regionCode, $regionTreeContainer = $('#regionTreeContainer');
                var regionTree, reachTree, treeNode_find, treeNode_id;
                var regionTreeUrl = $localStorage.gwUrl + '/information/v1/administrativeRegion/regionTree';

                // 开始时间
                var startTime = $('#startTime').datetimepicker({
                    format: 'YYYY-MM-DD',
                    locale: moment.locale('zh-cn')
                }).on('dp.change', function (c) {
                    var result = new moment(c.date).format('YYYY-MM-DD');
                    $scope.startTime = result;
                    $scope.$apply();
                });

                // 结束时间
                var endTime = $('#endTime').datetimepicker({
                    format: 'YYYY-MM-DD',
                    locale: moment.locale('zh-cn')
                }).on('dp.change', function (c) {
                    var result = new moment(c.date).format('YYYY-MM-DD');
                    $scope.endTime = result;
                    $scope.$apply();
                });

                //动态设置最小值
                startTime.on('dp.change', function (e) {
                    endTime.data('DateTimePicker').minDate(e.date);
                });
                //动态设置最大值
                endTime.on('dp.change', function (e) {
                    startTime.data('DateTimePicker').maxDate(e.date);
                });

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

                //河道 zTree节点设置
                var reachTreeSetting = {
                    edit: {
                        enable: false
                    },
                    view: {
                        nameIsHTML: true,
                        expandSpeed: 'slow',
                        dblClickExpand: false,
                        txtSelectedEnable: false
                    },
                    callback: {
                        onClick: reachNodesOnClick,
                        onExpand: reachNodeExpand
                    }
                };

                //河道节点异步请求成功回调函数
                function reachNodeExpand(event, treeId, treeNode) {
                    console.log(treeNode)
                    var cnodes = treeNode.children;
                    if (cnodes != null && cnodes.length > 0) {
                        return;
                    }
                    $http({
                        method: "get",
                        url: $localStorage.serviceUrl_reachTree + '/v1/reach/findReachNodesByCondition',
                        params: {
                            regionId: $scope.regionId,
                            reachId: treeNode.id,
                            isChildrenNodes: true
                        },
                    }).success(
                        function (res) {
                            reachTree.addNodes(treeNode, res.data, true);
                        }
                    );
                }

                //河道节点异步请求成功回调函数
                function reachNodesOnClick(event, treeId, treeNode) {
                    console.log(treeNode)
                    $scope.name = treeNode.name;
                    $scope.reachId = treeNode.id;
                    $scope.reachLevel = treeNode.reachLevel;
                    $scope.$apply();
                }

                $scope.regionTree = function () {
                    $('#regionTree').modal('show');

                }

                // 模态框行政区域选择
                $scope.getRegion = function (id) {
                    console.log(id);
                    $('#regionTree').modal('hide');
                }

                // 河道树加载
                $scope.reachTree = function (regionId) {
                    $('#reachTree').modal('show');
                    $http({
                        method: 'get',
                        url: $localStorage.serviceUrl_reachTree + '/v1/reach/findReachNodesByCondition',
                        params: {
                            regionId: $scope.regionId
                        },
                    }).success(function (res) {
                        console.log(res);
                        reachTree = $.fn.zTree.init($("#reachTreeContainer"), reachTreeSetting, res.data);
                    });
                }

                // 模态框河道选择
                $scope.getReach = function (id) {
                    console.log(id);
                    reGetProducts();
                    $('#reachTree').modal('hide');
                }

                // 级别转换
                $scope.gradeToZh = function (grade) {
                    if (grade === '1') {
                        return "省级";
                    } else if (grade == '2') {
                        return "市级";
                    } else if (grade == '3') {
                        return "区级";
                    } else if (grade == '4') {
                        return "镇级";
                    } else if (grade == '5') {
                        return "村级";
                    } else {
                        return "未知";
                    }

                };

                // 搜索
                $scope.search = function () {
                    reGetProducts();
                    clearList();
                    $scope.userName = '';
                };

                //清空列表
                var clearList = function () {
                    $scope.regionCode = '';
                };

                // 分页
                var patrolChart;
                var reGetProducts = function () {
                    $http({
                        url: $localStorage.serviceUrl_chiefOnline + '/charimanPatrol/v1/listChairManPatrolNumList',
                        method: 'get',
                        params: {
                            regionCode: $scope.regionId,
                            reachId: $scope.reachId,
                            queryStartTime: $scope.startTime,
                            queryEndTime: $scope.endTime,
                            userName: $scope.userName,
                            grade: $scope.grade,
                            needExtInfo: '1',
                            pageSize: $scope.paginationConf.itemsPerPage,
                            pageNumber: $scope.paginationConf.currentPage
                        }
                    }).success(function (resp) {
                        console.log(resp);
                        $scope.paginationConf.totalItems = resp.data.total;
                        $scope.riverChiefList = resp.data.list;
                    }).error(function (error) {

                    })
                };

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
                $scope.$watch('paginationConf.currentPage + paginationConf.itemsPerPage', reGetProducts);

                // 点击巡查次数列出巡查记录
                $scope.patrolListShow = function (id) {
                    console.log(id);
                    $('#patrolList').modal('show');
                    $http({
                        method: 'GET',
                        params: {
                            userId: id
                        },
                        url: $localStorage.serviceUrl_chiefOnline + '/charimanPatrol/v1/detail'
                    }).success(function (resp) {
                        console.log(resp);
                        $scope.patrolList = resp.data;
                    }).error(function (error) {
                    });
                };

                // 点击巡查记录查看详情
                $scope.patrolDetailShow = function (id) {
                    $('#patrolDetailShow').modal('show');
                    console.log(id);
                    $http({
                        method: 'GET',
                        params: {
                            locusId: id
                        },
                        url: $localStorage.serviceUrl_chiefOnline + '/charimanPatrol/v1/getLocusDetailById'
                    }).success(function (resp) {
                        $scope.patrolDetail = resp.data;
                        console.log($scope.patrolDetail);
                        PatrolRiverService.addGraphic(resp.data);
                    }).error(function (error) {
                        console.error(error);
                    });
                };

                // 点击问题次数列出问题列表
                $scope.eventListShow = function (id) {
                    console.log(id);
                    $('#eventList').modal('show');
                    $http({
                        method: 'GET',
                        params: {
                            userId: id,
                            startTime: '',
                            endTime: ''
                        },
                        url: $localStorage.serviceUrl_eventMgr + 'v1/event/queryEventByReachOrRegion'
                    }).success(function (resp) {
                        console.log(resp);
                        $scope.eventList = resp.data;
                    }).error(function (error) {
                    });
                };

                // 点击问题记录查看详情
                $scope.eventDetailShow = function (event) {
                    console.log(event);
                    $('#eventDetailShow').modal('show');
                    $scope.eventDetail = event;
                };

                //查看图片详情
                $rootScope.$on("eventUrl1", function (evt, eventUrl1) {
                    console.log(eventUrl1)
					$scope.before = eventUrl1.data.beforeAccessory;
                    $scope.after = eventUrl1.data.afterAccessory;
                    console.log($scope.before)
                    $scope.$apply();
                });

                //查看图片详情
                $rootScope.$on("eventUrl2", function (evt, eventUrl2) {
                    console.log(eventUrl2)
                    $scope.before = eventUrl2.data.beforeAccessory;
                    $scope.after = eventUrl2.data.afterAccessory;
                    console.log($scope.before)
                    $scope.$apply();
                });
            }
        ]);

})(window, angular);