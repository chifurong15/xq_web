(function (window, angular) {
    'use strict';

    var app = angular.module("app");
    app.filter("trustHtml", function ($sce) {
        return function (input) {
            return $sce.trustAsHtml(input);
        }
    })

    app.controller(
        'patrolMgrCtrl', [
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
            'esriApiDeps',
            'wish',
            'tiandituFactory',
            'MapTool',
            'MapUtil',
            'PatrolRiverService',
            function patrolMgrCtrl($localStorage, $scope, $location, $log, $q, $rootScope, globalParam, $window, routeService, $http,
                                   esriApiDeps, wish, tiandituFactory, MapTool, MapUtil, PatrolRiverService) {

                var promise = esriApiDeps.query();
                var w = wish.get();

                // 初始化
                $scope.init = function () {
                    //gis模块初始化
                    MapTool.init($scope.map);
                    MapUtil.init($scope.map);
                    PatrolRiverService.init($scope.map, "patrolRiverLayer");
                    clearList();
                    $scope.regionId = $localStorage.userLoginInfo.userInfo.regionId;
                    regionTreeList();
                    reachTreeLoading();
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

                $scope.map = new w.Map("map", {
                    extent: initExtent,
                    slider: false,
                    autoResize: true,
                    resizeDelay: 100,
                    logo: false
                });
                tiandituFactory.initTianditu($scope.map, region);

                dojo.connect($scope.map, "onClick", function (evt) {
                    console.log(evt.mapPoint.x + ", " + evt.mapPoint.y);
                });

                // 地图工具菜单点击
                var measureTool = null;
                $scope.measureFunc = function (type) {
                    console.log(type);
                    if (measureTool == null) {
                        measureTool = new w.MeasureTools({
                            map: $scope.map
                        });
                    }

                    if (type == "area") {
                        measureTool._startMeasureArea();
                    } else if (type == "distance") {
                        measureTool._startMeasureDistance();
                    } else {
                        measureTool._clearMeasure();
                    }
                };

                // 开始时间
                var startTime = $('#startTime').datetimepicker({
                    format: 'YYYY-MM-DD',
                    locale: moment.locale('zh-cn')
                }).on('dp.change', function (c) {
                    var result = new moment(c.date).format('YYYY-MM-DD');
                    $scope.startTime = result;
                    $scope.$apply();
                    console.log(result);
                });

                // 结束时间
                var endTime = $('#endTime').datetimepicker({
                    format: 'YYYY-MM-DD',
                    locale: moment.locale('zh-cn')
                }).on('dp.change', function (c) {
                    var result = new moment(c.date).format('YYYY-MM-DD');
                    $scope.endTime = result;
                    $scope.$apply();
                    console.log(result);
                });

                //动态设置最小值
                startTime.on('dp.change', function (e) {
                    endTime.data('DateTimePicker').minDate(e.date);
                });
                //动态设置最大值
                endTime.on('dp.change', function (e) {
                    startTime.data('DateTimePicker').maxDate(e.date);
                });

                // 右侧区域收缩
                $scope.infoTjShow = function (event) {
                    if ($('.iconRight').hasClass('fa-angle-right')) {
                        $('.iconRight').removeClass('fa-angle-right').addClass('fa-angle-left');
                        $('.infoCon-tj').animate({'right': '-360px'}, 1000);
                        $('.container-tj').animate({'right': '0'}, 1000);

                    } else {
                        $('.iconRight').removeClass('fa-angle-left').addClass('fa-angle-right');
                        $('.infoCon-tj').animate({'right': '0'}, 1000);
                        $('.container-tj').animate({'right': '360px'}, 1000);
                    }
                };

                // 地图工具条收缩
                $scope.toolbarClose = function () {
                    if ($('#toolbarClose').hasClass('toolbar-6')) {
                        $('#toolbarClose').removeClass('toolbar-6').addClass('toolbar-7');
                        $('#measureTools').animate({'width': '40px'}, 1000);
                    } else {
                        $('#toolbarClose').removeClass('toolbar-7').addClass('toolbar-6');
                        $('#measureTools').animate({'width': '240px'}, 1000);
                    }
                };

                // 显示地图资源层列表
                $scope.mapResourceShow = function () {
                    $('#mapResource').slideToggle();
                    $('#mapTypes').hide();
                }

                // 显示地图底图列表
                $scope.mapTypeShow = function () {
                    $('#mapTypes').slideToggle();
                    $('#mapResource').hide();
                }

                //资源图切换
                $scope.changeMapResource = function (resourceType) {
                    console.log(resourceType);

                    if (resourceType == 'imgAnno') {
                        MapTool.controlLayerVisible("cia", true);
                    } else {
                        MapTool.controlLayerVisible("cva", true);
                    }
                };

                $scope.types = [
                    {num: 1, style: 'normal', "background-position": "0 0"},
                    {num: 2, style: 'earth', "background-position": "0 -60px"}
                ];

                $scope.showMapTypes = function (style) {
                    $scope.selected = style;

                    if (style == 'earth') {
                        MapTool.controlLayerVisible("img", true);
                    } else {
                        MapTool.controlLayerVisible("vec", true);
                    }
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

                var $regionCode, $regionTreeContainer = $('#regionTreeContainer');
                var regionTree, reachTree, treeNode_find, treeNode_id;
                var regionTreeUrl = $localStorage.gwUrl + '/information/v1/administrativeRegion/regionTree';

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
                    }).success(function (resp) {
                        console.log(resp);
                        treeNode_find = treeNode.id;
                    });
                    $scope.regionId = treeNode.id;
                    $scope.regionName = treeNode.name;
                    $scope.grade = treeNode.grade;
                    //节点点击定位
                    if(MapUtil.isCoordValid(treeNode["longitude"],treeNode["latitude"])){
                        if(treeNode["grade"] != null){
                            MapUtil.center2LongLat(treeNode["longitude"],treeNode["latitude"],treeNode["grade"]);
                        }
                    }else{
                        console.error("无效坐标");
                        alert("定位失败！无经纬度信息...");
                    }

                    reachTreeLoading();
                    reGetProducts();
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
                    console.log($scope.regionId)
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

                //河道 zTree节点补充设置
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
                        // url: $localStorage.serviceUrl_reachTree + '/reachTreeNodesController/findReachNodesByCondition',
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
                    $scope.reachId = treeNode.id;
                    $scope.reachLevel = treeNode.reachLevel;
                    $scope.$apply();
                    reGetProducts();
                }

                //河道树加载
                function reachTreeLoading() {
                    $http({
                        method: 'get',
                        // url: $localStorage.serviceUrl_reachTree + '/reachTreeNodesController/findReachNodesByCondition',
                        url: $localStorage.serviceUrl_reachTree + '/v1/reach/findReachNodesByCondition',
                        params: {
                            regionId: $scope.regionId
                        },
                    }).success(function (res) {
                        console.log(res);
                        reachTree = $.fn.zTree.init($("#reachTreeContainer"), reachTreeSetting, res.data);
                    });
                }

                //清空列表
                var clearList = function () {
                    $scope.patrolList = undefined;
                    $scope.logWorkList = undefined;
                }

                /**
                 * 点击巡查次数列出巡查记录
                 */
                $scope.patrolListShow = function (userid) {
                    console.log(userid);
                    $http({
                        method: 'GET',
                        params: {
                            userId: userid,
                            queryStartTime: $scope.startTime,
                            queryEndTime: $scope.endTime
                        },
                        url: $localStorage.serviceUrl_chiefOnline + '/charimanPatrol/v1/detail'
                    }).success(function (resp) {
                        console.log(resp);
                        $scope.patrolList = resp.data;
                    }).error(function (error) {
                    });
                    $('#patrolLists').addClass('active').siblings().removeClass('active');
                    $('#patrolList').addClass('active').siblings().removeClass('active');
                };

                /**
                 * 点击日志数列出日志列表
                 */
                $scope.logWorkListShow = function (userid) {
                    console.log(userid);
                    $http({
                        method: 'GET',
                        params: {
                            chairmanid: userid
                        },
                        url: $localStorage.serviceUrl_chiefOnline + '/worklog/v1/listLogWorklogByCondition'
                    }).success(function (resp) {
                        console.log(resp);
                        $scope.logWorkList = resp.data.list;
                    }).error(function (error) {
                    });
                    $('#logWorkLists').addClass('active').siblings().removeClass('active');
                    $('#logWorkList').addClass('active').siblings().removeClass('active');
                };

                // 分页
                var reGetProducts = function () {
                    $http({
                        url: $localStorage.serviceUrl_chiefOnline + '/charimanPatrol/v1/listChairManPatrolNumList',
                        method: 'get',
                        params: {
                            regionCode: $scope.regionId,
                            queryStartTime: $scope.startTime,
                            queryEndTime: $scope.endTime,
                            userName: $scope.userName,
                            grade: $scope.grade,
                            pageSize: $scope.paginationConf.itemsPerPage,
                            pageNumber: $scope.paginationConf.currentPage
                        }
                    }).success(function (resp) {
                        $scope.paginationConf.totalItems = resp.data.total;
                        $scope.riverChiefList = resp.data.list;
                    }).error(function (error) {

                    })
                };

                // 搜索
                $scope.search = function () {
                    reGetProducts();
                    clearList();
                    $scope.userName = '';
                    $scope.startTime = '';
                    $scope.endTime = ''
                };

                // 配置分页基本参数
                $scope.paginationConf = {
                    currentPage: $location.search().currentPage ? $location.search().currentPage : 1,
                    itemsPerPage: 10,
                    pagesLength: 10,
                    onChange: function () {
                        //console.log($scope.paginationConf.currentPage);
                        $location.search('currentPage', $scope.paginationConf.currentPage);
                    }
                };

                // 当他们一变化的时候，重新获取数据条目
                $scope.$watch('paginationConf.currentPage + paginationConf.itemsPerPage', reGetProducts);

                // 点击巡查记录查看详情
                $scope.patrolDetailShow = function (id) {
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

                // 点击巡查记录查看详情
                $scope.logWorkDetailShow = function (id) {
                    $('#logWorkDetail').modal('show');
                    console.log(id);
                    $http({
                        method: 'GET',
                        params: {
                            chairmanid: id
                        },
                        url: $localStorage.serviceUrl_chiefOnline + '/worklog/v1/listLogWorklogByCondition'
                    }).success(function (resp) {
                        $scope.logWorkDetail = resp.data;
                        console.log($scope.patrolDetail);
                    }).error(function (error) {
                        console.error(error);
                    });
                };


                var mouseDownX;//记录鼠标点下时鼠标点X轴的位置
                var leftSlideW;//鼠标点下时左侧的宽度
                var mouseMoveX;//鼠标移动偏移量
                var flag = false;//判断鼠标点下和松开状态
                $('.dragDiv').mouseover(function () {
                    if ($('#onlineChiefAside')[0].offsetWidth <= 200) {
                        $(this).css('cursor', 'e-resize');//当左边栏宽度不大于200时鼠标点显示向右的箭头
                    } else {
                        $(this).css('cursor', 'col-resize');//当左边栏宽度大于200时显示左右箭头
                    }
                    ;
                    $(this).css('background', '#428bca');//鼠标移动到改标签背景显示蓝色
                });
                $('.dragDiv').mouseleave(function () {
                    $('.dragDiv').css('background', '#d9e4ee');//鼠标离开背景为边框色
                });
                $('.dragDiv').mousedown(function (e) {
                    leftSlideW = $('#onlineChiefAside')[0].offsetWidth;//鼠标点下时记录左边栏宽度
                    mouseDownX = e.clientX;//鼠标点下时的x轴位置
                    flag = true;
                });
                $(document).mousemove(function (e) {
                    if (flag) {
                        mouseMoveX = e.clientX - mouseDownX;//记录鼠标移动的距离
                        if (mouseMoveX > 0) {//鼠标向右拖动
                            $('#onlineChiefAside').css({
                                width: leftSlideW + mouseMoveX + 'px' //鼠标拖动时左边栏的宽度
                            });
                            $('.container-tj').css({
                                left: leftSlideW + mouseMoveX + 'px'
                            });
                            $('.tree-body-btn').css({
                                left: leftSlideW + mouseMoveX + 'px'
                            });
                        } else {//鼠标向左拖动
                            if ($('#onlineChiefAside')[0].offsetWidth > 200) {
                                if (leftSlideW + mouseMoveX >= 200) {
                                    $('#onlineChiefAside').css({
                                        width: leftSlideW + mouseMoveX + 'px'
                                    });
                                    $('.container-tj').css({
                                        left: leftSlideW + mouseMoveX + 'px'
                                    });
                                    $('.tree-body-btn').css({
                                        left: leftSlideW + mouseMoveX + 'px'
                                    });
                                }
                                ;
                            }
                            ;
                        }
                        ;
                    }
                    ;
                });
                $(document).mouseup(function (e) {
                    flag = false;//鼠标松开取消拖动效果
                    $('.dragDiv').css('background', '#d9e4ee');
                });
                // 左侧区域收缩
                $scope.treeBodyShow = function (event) {
                    var handleLeaveW = $('#onlineChiefAside')[0].offsetWidth + 'px';//鼠标拖动离开时左边栏的宽度
                    if ($('.iconRight').hasClass('fa-angle-left')) {
                        $('.iconRight').removeClass('fa-angle-left').addClass('fa-angle-right');
                        $('.aside-info').animate({'left': '-' + handleLeaveW}, 1000);
                        $('.container-tj').animate({'left': '0'}, 1000);
                        $('.tree-body-btn').animate({'left': '0'}, 1000);

                    } else {
                        $('.iconRight').removeClass('fa-angle-right').addClass('fa-angle-left');
                        $('.aside-info').animate({'left': '0'}, 1000);
                        $('.container-tj').animate({'left': handleLeaveW}, 1000);
                        $('.tree-body-btn').animate({'left': handleLeaveW}, 1000);
                    }
                };
            }
        ]);

})(window, angular);