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

    angular.module("app").controller(
        'imReachAdd',
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
            'moduleService',
            '$http',
            'wish',
            'esriApiDeps',
            'tiandituFactory',
            'MapUtil',
            'SymbolUtil',
            'GeometryUtil',
            'ReachLakeManagerService',
            function imReachAdd($localStorage, $scope, $location, $log,$q, $rootScope,globalParam, $window, routeService,moduleService, $http,
                                wish, esriApiDeps, tiandituFactory, MapUtil, SymbolUtil, GeometryUtil, ReachLakeManagerService) {

                var promise = esriApiDeps.query();
                var w = wish.get();

                $scope.init = function(){
                    loadGisModuls();
                }

                /*地图放大缩小切换*/
                $scope.switchMapIcon = true;
                $scope.mapExpand = function(){
                    $scope.switchMapIcon = !$scope.switchMapIcon;
                    if($scope.switchMapIcon){
                        $("#mapContainer").css("height",400 + "px");
                    }else{
                        var _wrapperMdH = $('#wrapperMd').outerHeight(true);
                        $("#mapContainer").css("height",_wrapperMdH + "px");
                    }
                }

                //地图初始化
                var initExtent = new w.Extent(49.670562744140625, -2.7861714363098145, 155.13931274414062, 67.52632856369019);
                $scope.map = new w.Map('mapContainer', {
                    extent: initExtent,
                    fadeOnZoom: true
                });
                //加载天地图
                tiandituFactory.initTianditu($scope.map);

                function loadGisModuls() {
                    if (typeof $scope.map !== 'undefined') {
                        MapUtil.init($scope.map);
                        SymbolUtil.init($scope.map);
                        GeometryUtil.init($scope.map);
                        ReachLakeManagerService.init($scope.map, "reachManagerLayer");
                    } else {
                        console.error('error： $scope.map 未定义')
                    }
                }

                /*地图标绘*/
                $scope.doDraw = function(){
                    ReachLakeManagerService.cancelDrawTool();
                    ReachLakeManagerService.addPolygonMarker();
                    ReachLakeManagerService._drawTool.on("draw-end", function(){
                        // $scope.reservoirLongitude=ReachLakeManagerService.centerpointX.toFixed(4);
                        // $scope.reservoirLatitude=ReachLakeManagerService.centerpointY.toFixed(4);
                        // $scope.reservoirAcreage=ReachLakeManagerService.area;
                        // $scope.reservoirLinePoints=ReachLakeManagerService.linepoints;
                        // $scope.reservoirSpatialData=ReachLakeManagerService.spatialData;
                        // $scope.$apply();
                    });
                };
                $scope.clearDraw = function(){
                    ReachLakeManagerService.cancelDrawTool();
                    // $scope.reservoirAcreage = null;
                    // $scope.reservoirLongitude = null;
                    // $scope.reservoirLatitude = null;
                };


                $scope.reachDetailData = {};
                $scope.waterclassify = $scope.reachDetailData.classify == 'C' ? '库段' : $scope.reachDetailData.classify=="B" ? '湖段' : '河段';
                //河湖库名称
                $scope.reachNameChange = function() {
                    if (!$scope.reachDetailData.reachName || $scope.reachDetailData.reachName.substr(-2) != '河段' && $scope.reachDetailData.reachName.substr(-2) !='湖段' && $scope.reachDetailData.reachName.substr(-2) != '库段'){
                        layer.alert("请根据命名规则命名", {
                            skin: 'my-skin',
                            closeBtn: 1,
                            anim: 3
                        },function(index){
                            layer.close(index);
                            $window.document.getElementById('reachName').focus();
                        });
                    }else{
                        if($scope.reachDetailData.reachName.substr(-2) == '河段'){
                            $scope.reachDetailData.classify = 'A';
                        }else if($scope.reachDetailData.reachName.substr(-2) == '湖段'){
                            $scope.reachDetailData.classify = 'B';
                        }else if($scope.reachDetailData.reachName.substr(-2) == '库段'){
                            $scope.reachDetailData.classify = 'C';
                        }
                        //判断名称是否重复
                        $http({
                            method:'get',
                            url:$localStorage.gwUrl + reachUrl + "/isRepeat",
                            params:{
                                name:$scope.reachDetailData.reachName
                            }
                        }).success(function (res) {
                            if (res.resCode === 0){
                                layer.alert("名称重复", {
                                    skin: 'my-skin',
                                    closeBtn: 1,
                                    anim: 3
                                },function(index){
                                    layer.close(index);
                                    $window.document.getElementById('reachName').focus();
                                });
                            }
                        }).error();
                    }
                }

                //水质等级
                $scope.waterQuality = function() {
                    $http({
                        method: "get",
                        url: $localStorage.gwUrl + riverUrl + "/riverType",
                        params: {
                            type: '154'
                        },
                    }).success(
                        function(res) {
                            $scope.waterQualityList = res.data;
                        }
                    );
                }

                //淤积情况
                $scope.deposit = function() {
                    $http({
                        method: "get",
                        url: $localStorage.gwUrl +riverUrl + "/riverType",
                        params: {
                            type: '161'
                        },
                    }).success(
                        function(res) {
                            $scope.depositList = res.data;
                        }
                    );
                }

                //所属区域
                var regionTree;
                var treeNode_find, _areaCode, _grade;
                $scope.regionShow = function(){
                    $scope.areaName = '';
                    $("#region_ztree").modal('show');
                    $http({
                        method: "GET",
                        url: $localStorage.gwUrl + basicUrl + "/tree",
                        dataType:'json'
                    }).success(function(data) {
                        regionTree = $.fn.zTree.init($("#regionTree"), setting1, data.data);
                    }).error(function() {});
                    var setting1 = {
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
                            beforeExpand: zTreeOnExpands,
                            onClick: zTreeOnClicks
                        }
                    };

                    function zTreeOnClicks(event,treeId,treeNode){ //所属区域树节点点击
                        treeNode_find = treeNode.id,
                        _areaCode = treeNode.name;
                        _grade = treeNode.grade;
                        if (treeNode_find != null){
                            console.log($scope.reachDetailData.regionName);
                        }else{
                            $scope.reachDetailData.regionName= '';
                        }
                        //改变区域树数值，清空水系、河流数值
                        $scope.water_ztree = '';
                        $scope.river_ztree ='';
                        // $scope.rivePart();
                        if(MapUtil.isCoordValid(treeNode["longitude"], treeNode["latitude"])){
                            if(treeNode["grade"] != null){
                                MapUtil.center2LongLat(treeNode["longitude"],treeNode["latitude"],treeNode["grade"]);
                            }
                        }else {
                            console.warn("定位失败！坐标为空！");
                            layer.msg('定位失败！坐标为空！',{time:2000});
                        }
                    };
                    function zTreeOnExpands(treeId,treeNode){
                        var cnodes = treeNode.children;
                        if (cnodes !=null && cnodes.length > 0){
                            return;
                        }
                        $http({
                            method: "GET",
                            url: $localStorage.gwUrl + basicUrl + "/tree",
                            params: {
                                parentCode:treeNode.id
                            },
                        }).success(
                            function(res) {
                                regionTree.addNodes(treeNode,res.data,true);
                            }
                        );
                    }
                    $scope.select_region = function() { //区域模态框搜索框
                        if($scope.areaName == null || $scope.areaName == ''){
                            $scope.treeList();
                        }else{
                            $http({
                                method: "GET",
                                url: $localStorage.gwUrl + basicUrl + "/tree",
                                params: {
                                    areaName: $scope.areaName
                                },
                            }).success(
                                function (res) {
                                    var setting1 = {
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
                                            beforeExpand: zTreeOnExpands,
                                            onClick: zTreeOnClicks
                                        }
                                    };
                                    regionTree = $.fn.zTree.init($("#regionTree"), setting1, res.data);
                                    $scope.tree = res.data
                                })
                        };
                    };
                    $scope.region_modalOk = function (){//关闭所属区域模态框【确定按钮】
                        $("#region_ztree").modal('hide');
                        $scope.reachDetailData.regionName = _areaCode;
                        $scope.reachDetailData.regionCode = treeNode_find;
                        $scope.reachDetailData.grade = _grade+'';
                        $scope.river_ztree ='';
                    };
                };

                //水系选择模态
                var water_ztree_node, water_ztree_name, water_ztree_code;
                $scope.waterShow = function() {
                    $("#water_ztree").modal('show');
                    //初始化水系树
                    $http({
                        method: "get",
                        url: $localStorage.gwUrl +waterUrl + "/belongWater",
                        params: {
                            areaCode:treeNode_find
                        },
                    }).success(
                        function(res) {
                            var setting1 = {
                                enable: true,
                                callback: {
                                    onClick: zTreeOnClick_water
                                }
                            };
                            var zNodes1 = [{
                                name: "根节点",
                                icon: "/vendor/zTree_v3/css/zTreeStyle/img/diy/10.png",
                                open: true,
                                children: res.data
                            }];
                            $.fn.zTree.init($("#waterZtree"), setting1, zNodes1);
                            $scope.tree = res.data
                        }
                    );

                    //树节点点击事件
                    function zTreeOnClick_water(event, treeId, treeNode) {
                        $http({
                            method: "GET",
                            url: $localStorage.gwUrl +waterUrl + "/findByWaterCode",
                            params: {
                                waterCode: treeNode.id
                            },
                        }).success(
                            function(res) {
                                water_ztree_node = treeNode.id;
                                $scope.river_ztree ='';
                                var _resCode = res.resCode;
                                if (_resCode == 1){
                                    water_ztree_name = res.data.waterName;
                                    water_ztree_code = res.data.waterCode;
                                }else{
                                    $scope.water_ztree= '';
                                }
                            }
                        );
                    };
                    //水系模态框搜索框
                    $scope.select_water = function() {
                        $http({
                            method: "GET",
                            url: $localStorage.gwUrl +waterUrl + "/belongWater",
                            params: {
                                waterName: $scope.waterName,
                                areaCode:treeNode_find
                            },
                        }).success(
                            function(res) {
                                var setting1 = {
                                    enable: true,
                                    callback: {
                                        onClick: zTreeOnClick_water
                                    }
                                };
                                var zNodes1 = [{
                                    name: "根节点",
                                    icon: "/vendor/zTree_v3/css/zTreeStyle/img/diy/10.png",
                                    open: true,
                                    children: res.data
                                }];
                                $.fn.zTree.init($("#waterZtree"), setting1, zNodes1);
                                $scope.tree = res.data
                            }
                        );
                    };
                    //关闭模态框【确定按钮】
                    $scope.water_modalOk = function (){
                        $("#water_ztree").modal('hide');
                        $scope.reachDetailData.waterName = water_ztree_name;
                        $scope.reachDetailData.waterCode = water_ztree_code;
                    };
                };

                //河湖库级别
                $scope.rivePart = function() {
                    $http({
                        method: "get",
                        url: $localStorage.gwUrl +riverUrl + "/riverType",
                        params: {
                            type: '116'
                        },
                    }).success(function(res) {
                        $scope.rivePartList = res.data;
                    });
                }

                //是否位于山区
                $scope.mountain = function() {
                    $http({
                        method: "get",
                        url: $localStorage.gwUrl + riverUrl + "/riverType",
                        params: {
                            type: '165'
                        },
                    }).success(function(res) {
                        $scope.mountainList = res.data;
                    });
                }

                //是否虚拟
                $scope.virtual = function() {
                    $http({
                        method: "get",
                        url: $localStorage.gwUrl +riverUrl + "/riverType",
                        params: {
                            type: '165'
                        },
                    }).success(function(res) {;
                        $scope.virtualList = res.data;
                    });
                }

                //上级河段
                $scope.$watch('reachDetailData.grade+reachDetailData.classify+reachDetailData.regionCode',function(n,o){
                    if(n == 0){
                        return;
                    }
                    if(!!$scope.reachDetailData.grade && !!$scope.reachDetailData.classify && !!$scope.reachDetailData.regionCode){
                        $scope.parentReach();
                    }
                })
                $scope.parentReach = function(){
                    $http({
                        method: "get",
                        url: $localStorage.gwUrl + reachUrl + "/parentReach",
                        params: {
                            grade: $scope.reachDetailData.grade,
                            areaCode: $scope.reachDetailData.regionCode,
                            classify: $scope.reachDetailData.classify
                        }
                    }).success(function (res) {
                        if (res.data.length == 0){
                            $scope.parentReachList = [{reachName : '最大级',reachCode : null}];
                        }else {
                            $scope.parentReachList = res.data;
                        }
                    })
                };

                //河湖库段岸别
                $scope.waterShore = function() {
                    var type =  $scope.reachDetailData.classify == 'C'?'114':$scope.reachDetailData.classify == 'B'?'112':'110'
                    $http({
                        method: "get",
                        url: $localStorage.gwUrl + riverUrl + "/riverType",
                        params: {
                            type:type
                        },
                    }).success(function(res) {
                        $scope.waterShoreList = res.data;;
                    });
                }

                //河流选择模态框【show】
                var river_ztree_node, river_ztree_name, river_ztree_code;
                $scope.riverShow = function() {
                    $("#river_ztree").modal('show');
                    //生成河流树
                    $http({
                        method: "get",
                        url: $localStorage.gwUrl +waterUrl + "/riverLakesReservoir",
                        params: {
                            areaCode:treeNode_find,
                            waterCode:water_ztree_node,
                            type: $scope.reachDetailData.classify
                        },
                    }).success(
                        function(res) {
                            var setting1 = {
                                enable: true,
                                callback: {
                                    onClick: zTreeOnClick_river
                                }
                            };
                            var zNodes1 = [{
                                name: "根节点",
                                icon: "/vendor/zTree_v3/css/zTreeStyle/img/diy/10.png",
                                open: true,
                                children: res.data
                            }];
                            $.fn.zTree.init($("#riverZtree"), setting1, zNodes1);
                            $scope.tree = res.data
                        }
                    );

                    //树节点点击事件
                    function zTreeOnClick_river(event, treeId, treeNode) {
                        $http({
                            method: "GET",
                            url: $localStorage.gwUrl +waterUrl + "/findByCode",
                            params: {
                                code: treeNode.id,
                                type: $scope.reachDetailData.classify
                            },
                        }).success(
                            function(res) {
                                var _resCode = res.resCode;
                                if (_resCode == 1){
                                    river_ztree_name = res.data.name;
                                    river_ztree_code = res.data.id;
                                }else{
                                    $scope.river_ztree= '';
                                }
                            }
                        );
                    };
                    //河流模态框搜索框
                    $scope.select_river = function() {
                        $http({
                            method: "GET",
                            url: $localStorage.gwUrl +waterUrl + "/riverLakesReservoir",
                            params: {
                                areaCode: treeNode_find,
                                waterCode: water_ztree_node,
                                type: $scope.reachDetailData.classify,
                                name: $scope.riverName
                            },
                        }).success(
                            function(res) {
                                var setting1 = {
                                    enable: true,
                                    callback: {
                                        onClick: zTreeOnClick_river
                                    }
                                };
                                var zNodes1 = [{
                                    name: "根节点",
                                    icon: "/vendor/zTree_v3/css/zTreeStyle/img/diy/10.png",
                                    open: true,
                                    children: res.data
                                }];
                                $.fn.zTree.init($("#riverZtree"), setting1, zNodes1);
                                $scope.tree = res.data
                            }
                        );
                    };
                    //关闭模态框【确定按钮】
                    $scope.river_modalOk = function (){
                        $("#river_ztree").modal('hide');
                        $scope.reachDetailData.pName = river_ztree_name;
                        $scope.reachDetailData.theirCode = river_ztree_code;
                    };
                };

                //增加管理人员
                $scope.reachadmins = [];
                $scope.addReachadmin = function($index){
                    $scope.reachadmins.push({chairmanName: "",chairmanid:"",chairmanlevel:"",chairmanRole:"",administrationCoast:"",isAssess:""});
                }

                //删除管理人员
                $scope.delReachadmin = function($index){
                    $scope.reachadmins.splice($index, 1);
                }

//                      $scope.add = function() {
//                          routeService.route(56, true);
//                      }

                $scope.back = function() {
                    // 跳转到菜单页面
                    routeService.route(108, true);
                }

                //管理人员树
                var regionAndUserTree;
                $scope.adminTree = function (index) {
                    $("#myModal_ztree_one").modal('show');
                    $http({
                        method: "GET",
                        url: $localStorage.gwUrl + reachUrl + "/regionAndUserTree",
                        dataType: 'json'
                    }).success(function (data) {
                        regionAndUserTree = $.fn.zTree.init($("#regionAndUserTree"), setting, data.data);
                    }).error(function () {});
                    //河长搜索
                    $scope.select_one = function () {
                        $http({
                            method: "GET",
                            url: $localStorage.gwUrl + reachUrl + "/findByUser",
                            params: {
                                userName: $scope.waterName_one,
                            },
                        }).success(function (resp) {
                            regionAndUserTree = $.fn.zTree.init($("#regionAndUserTree"), setting, resp.data);
                        })
                    }
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
                            onClick: zTreeOnClickUser
                        }
                    };
                    function zTreeOnCheck(event, treeId, treeNode) {
                    };
                    function zTreeOnClickUser(event, treeId, treeNode) {
                        $http({
                            method: "GET",
                            url: $localStorage.gwUrl + reachUrl + "/findByUser",
                            params: {
                                userId: treeNode.id,
                            },
                        }).success(
                            function(res) {
                                if(res.resCode == 1){
                                    $scope.chairmanName = res.data.name;
                                    $scope.chairmanId = res.data.id;
                                }
                            }
                        );
                    };
                    function zTreeOnExpand(treeId, treeNode) {
                        $scope.chiefNodeId = treeNode.id;
                        var cnodes = treeNode.children;
                        if (cnodes !=null && cnodes.length > 0){
                            return;
                        }
                        $http({
                            method: "GET",
                            url: $localStorage.gwUrl + reachUrl + "/regionAndUserTree",
                            params: {
                                parentCode: treeNode.id
                            },
                        }).success(
                            function (res) {
                                regionAndUserTree.addNodes(treeNode, res.data, true);
                            }
                        );
                    }
                    //关闭模态框【确定按钮】
                    $scope.modalOk_one = function () {
                        $("#myModal_ztree_one").modal('hide');
                        $scope.reachadmins[index].chairmanid = $scope.chairmanId;
                        $scope.reachadmins[index].chairmanName = $scope.chairmanName;
                    };
                }

                //履职类型
                $scope.dutyType = function () {
                    $http({
                        method: "get",
                        url: $localStorage.gwUrl +reachUrl + "/chairmanType"
                    }).success(
                        function (res) {
                            $scope.dutyTypeList = res.data;
                        }
                    );
                }

                //新增河湖库数据
                var jsname = /^[a-zA-Z0-9_-]{4,16}$/;
                var len =/^\d+(?:\.\d{1,2})?$/;
                $scope.add = function() {
                    var param = $scope.reachDetailData;
                    param.overView = CKEDITOR.instances.editor.getData();
                    if(!param.reachName || !jsname.test(param.reachName) == null) {
                        layer.alert("请完善信息", {
                            skin: 'my-skin',
                            closeBtn: 1,
                            anim: 3
                        });
                        return;
                    }else if(param.reachName.substr(-2) != '河段' && param.reachName.substr(-2) !='湖段' && param.reachName.substr(-2) != '库段'){
                        layer.alert("请根据命名规则命名", {
                            skin: 'my-skin',
                            closeBtn: 1,
                            anim: 3
                        });
                        return;
                    }else if(!param.alias) {
                        layer.alert("请完善河湖库别名", {
                            skin: 'my-skin',
                            closeBtn: 1,
                            anim: 3
                        });
                        return;
                    }else if(param.waterGrade == null) {
                        layer.alert("请完善水质等级", {
                            skin: 'my-skin',
                            closeBtn: 1,
                            anim: 3
                        });
                        return;
                    }else if(param.silty == null) {
                        layer.alert("请完善淤积情况", {
                            skin: 'my-skin',
                            closeBtn: 1,
                            anim: 3
                        });
                        return;
                    }else if(!param.regionCode) {
                        layer.alert("请完善所属区域", {
                            skin: 'my-skin',
                            closeBtn: 1,
                            anim: 3
                        });
                        return;
                    // }else if(!param.waterCode) {
                    //     layer.alert("请完善所属水系", {
                    //         skin: 'my-skin',
                    //         closeBtn: 1,
                    //         anim: 3
                    //     });
                    //     return;
                    }else if(param.grade == null) {
                        layer.alert("请完善河湖库级别", {
                            skin: 'my-skin',
                            closeBtn: 1,
                            anim: 3
                        });
                        return;
                    }else if(param.whether == null){
                        layer.alert("请完善山区信息", {
                            skin: 'my-skin',
                            closeBtn: 1,
                            anim: 3
                        });
                        return;
                    }else if(param.isVirtual == null){
                        layer.alert("请完善虚拟信息", {
                            skin: 'my-skin',
                            closeBtn: 1,
                            anim: 3
                        });
                        return;
                    }else if(param.length != undefined && (eval(param.length) <= 0 ||!len.test(param.length))){
                        layer.alert("请完善长度,长度为正数，最大保留2位小数", {
                            skin: 'my-skin',
                            closeBtn: 1,
                            anim: 3
                        });
                        return;
                    }else if(param.width != undefined && (eval(param.width) <= 0 ||!len.test(param.width))){
                        layer.alert("请完善宽度,长度为正数，最大保留2位小数", {
                            skin: 'my-skin',
                            closeBtn: 1,
                            anim: 3
                        });
                        return;
                    }else if(!param.parentsCode) {
                        layer.alert("请完善上级"+$scope.waterclassify, {
                            skin: 'my-skin',
                            closeBtn: 1,
                            anim: 3
                        });
                        return;
                    }else if(!param.shore) {
                        layer.alert("请完善"+$scope.waterclassify+"岸别", {
                            skin: 'my-skin',
                            closeBtn: 1,
                            anim: 3
                        });
                        return;
                    }else if($scope.reachadmins.length != 0){
                        var flag = 1;
                        var reachadmins = $scope.reachadmins;
                        reachadmins = angular.forEach(reachadmins, function (each){
                            if(each.chairmanid == '') {
                                layer.alert("请完善履职人员", {
                                    skin: 'my-skin',
                                    closeBtn: 1,
                                    anim: 3
                                });
                                flag = 0;
                                return false;
                            }else if(each.chairmanlevel == '') {
                                layer.alert("请完善履职级别", {
                                    skin: 'my-skin',
                                    closeBtn: 1,
                                    anim: 3
                                });
                                flag = 0;
                                return false;
                            }else if(each.chairmanRole == '') {
                                layer.alert("请完善履职类型", {
                                    skin: 'my-skin',
                                    closeBtn: 1,
                                    anim: 3
                                });
                                flag = 0;
                                return false
                            }else if(each.administrationCoast == '') {
                                layer.alert("请完善管理岸面", {
                                    skin: 'my-skin',
                                    closeBtn: 1,
                                    anim: 3
                                });
                                flag = 0;
                                return false;
                            }
                            each.isAssess = each.isAssess == true ? 'Y':'N';
                        })
                        if(!flag) return;
                        param.reachChairmanJson = JSON.stringify(reachadmins);
                    }
                    $http({
                        method: "post",
                        url: $localStorage.gwUrl +reachUrl + "/add",
                        params: param
                    }).success(function(res) {
                        if(res.resCode == 1){
                            layer.msg('成功新增一条数据！',{time:2000});
                        }else if(res.resCode == 0){
                            layer.msg(res.resMsg,{time:2000});
                        }
                    }).error(function(res) {
                        layer.msg('服务器出错，请稍后再试！',{time:2000});
                    })
                }
            }]);
})(window, angular);