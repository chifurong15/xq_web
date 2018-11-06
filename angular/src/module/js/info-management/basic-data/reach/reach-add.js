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


                var riverArr = ['江', '河', '水', '川', '郭勒', '高勒', '曲', '藏布', '溪', '沟', '港', '汊', '塘', '浜', '渠', '濠'];
                var lakesArr = ['湖', '泊', '淖', '淀', '池', '塘', '潭', '渊', '沼', '泽', '荡', '洼', '淖尔', '诺尔', '海', '海子','洋', '高壁', '泡', '错', '措', '雍错', '茶卡', '那', '逊湖', '措钦', '德加'];
                var reservoirArr = ['库段'];
                // 定义对象数组
                var objArr = {
                    '河段': ['河段', 'riverBox', '/riverAdd'],
                    '湖段': ['湖段', 'lakesBox', '/lakesAdd'],
                    '库段': ['库段', 'reservoirBox', '/reservoirAdd']
                };
                var val = '';
                var act = '';
                var _status;
                $scope.name_change = function (){

                    for(var i=0; i<riverArr.length; i++){
                        if($scope.reachFName.indexOf(riverArr[i]) != -1){
                            val = '河段';
                            _status =1 ;
                            $scope.bankSides = $scope.riveShores;
//			                		 return;
                        }
                    }

                    for(var j=0; j<lakesArr.length; j++){
                        if($scope.reachFName.indexOf(lakesArr[j]) != -1){
                            val = '湖段';
                            $scope.bankSides = $scope.lakesShores;
                            _status =2 ;
//			                		 return;
                        }
                    }

                    for(var k=0; k<reservoirArr.length; k++){
                        if($scope.reachFName.indexOf(reservoirArr[k]) != -1){
                            val = '库段';
                            $scope.bankSides = $scope.reservoirShores;
                            _status =3 ;
//			                		 return;
                        }
                    }



                    act = !!objArr[val] && objArr[val].length > 0 ? objArr[val][2] : '';
                    $('#arrForm').attr("action", act);
                    console.log(act);
                    $('#val').html(val);
                    for(var i in objArr){

                        if(val === objArr[i][0]){
                            console.log('block: '+objArr[i][1]);
                            $('#'+objArr[i][1]).css('display', 'block');	// div显示
                        }else{
                            console.log('none: '+objArr[i][1]);
                            $('#'+objArr[i][1]).css('display', 'none');		// div隐藏
                        }
                    }
                    val = '';	// 还原
                    console.log(val);
                };


                //判断名称是否重复
                $scope.isRepeat = function(){
                    $http({
                        method:'get',
                        url:$localStorage.gwUrl +reachUrl + "/isRepeat",
                        params:{
                            name:$scope.reachFName
                        }
                    }).success(
                        function (res) {
                            if (res.resCode === 0){
                                layer.msg('名称重复',{time:2000});
                                clear();
                            }
                        }).error();
                };

                //清空表单
                var clear = function() {
                    $scope.reachFName='';

                };

                //上级河段
                $scope.parentReach = function(classify){
                    $http({
                        method: "get",
                        url: $localStorage.gwUrl + reachUrl + "/parentReach",
                        params: {
                            grade: $scope.river_part.typeValue,
                            areaCode: treeNode_find,
                            classify:classify
                        }
                    }).success(
                        function (res) {
                            console.log(res);
                            var a={
                                reachName : '最大级',
                                reachCode : null
                            };
                            var b = [];
                            b.push(a);
                            if (res.data.length == 0){
                                $scope.parentReachs = b;
                            }else {
                                $scope.parentReachs = res.data;
                            }
                        }
                    )
                };

                //上级河段改变
                $scope.parentReach_Change = function(parentReach){
                    if (parentReach == null){
                        $scope.parentReach_Change_name = null;
                        $scope.parentReach_Change_value = null;
                    } else {
                        $scope.parentReach_Change_name = parentReach.reachName;
                        $scope.parentReach_Change_value = parentReach.reachCode;
                        console.log($scope.parentReach_Change_name);
                        console.log($scope.parentReach_Change_value);
                    }
                };


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
                            console.log(res);
                            $scope.waterQualitys = res.data;
                            console.log($scope.waterQualitys);
                        }
                    );
                }
                $scope.quality_Change = function(water_quality) {
                    if (water_quality == null){
                        $scope.quality_Change_name = null;
                        $scope.quality_Change_value = null;
                    } else {

                        $scope.quality_Change_name = water_quality.typeName;
                        $scope.quality_Change_value = water_quality.typeValue;
                        console.log($scope.quality_Change_name);
                        console.log($scope.quality_Change_value);
                    }
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
                            console.log(res);
                            $scope.deposits = res.data;
                            console.log($scope.deposits);
                        }
                    );
                }
                $scope.deposit_Change = function(deposit_status) {
                    if (deposit_status == null){
                        $scope.deposit_Change_name = null;
                        $scope.deposit_Change_value = null;
                    } else {

                        $scope.deposit_Change_name = deposit_status.typeName;
                        $scope.deposit_Change_value = deposit_status.typeValue;
                        console.log($scope.deposit_Change_name);
                        console.log($scope.deposit_Change_value);
                    }
                }

                //是否位于山区
                $scope.mountain = function() {
                    $http({
                        method: "get",
                        url: $localStorage.gwUrl + riverUrl + "/riverType",
                        params: {
                            type: '165'
                        },
                    }).success(
                        function(res) {
                            console.log(res);
                            $scope.mountains = res.data;
                            console.log($scope.mountains);
                        }
                    );
                }
                $scope.wm_Change = function(whether_mountain) {
                    if (whether_mountain == null){
                        $scope.wm_Change_name = null;
                        $scope.wm_Change_value = null;
                    }else {

                        $scope.wm_Change_name = whether_mountain.typeName;
                        $scope.wm_Change_value = whether_mountain.typeValue;
                        console.log($scope.wm_Change_name);
                        console.log($scope.wm_Change_value);
                    }
                }

                //是否虚拟
                $scope.virtual = function() {
                    $http({
                        method: "get",
                        url: $localStorage.gwUrl +riverUrl + "/riverType",
                        params: {
                            type: '165'
                        },
                    }).success(
                        function(res) {
                            console.log(res);
                            $scope.virtuals = res.data;
                            console.log($scope.virtuals);
                        }
                    );
                }
                $scope.wv_Change = function(whether_virtual) {
                    if (whether_virtual == null){
                        $scope.wv_Change_name = null;
                        $scope.wv_Change_value = null;
                    } else {

                        $scope.wv_Change_name = whether_virtual.typeName;
                        $scope.wv_Change_value = whether_virtual.typeValue;
                        console.log($scope.wv_Change_name);
                        console.log($scope.wv_Change_value);
                    }
                }



                //河段岸别
                $scope.riveShore = function() {
                    $http({
                        method: "get",
                        url: $localStorage.gwUrl + riverUrl + "/riverType",
                        params: {
                            type:'110'
                        },
                    }).success(
                        function(res) {
                            console.log(res);
                            $scope.riveShores = res.data;
                            console.log($scope.riveShores);
                        }
                    );
                }
                $scope.rs_Change = function(river_shore) {
                    if (river_shore == null){
                        $scope.rs_Change_name = null;
                        $scope.rs_Change_value = null;
                    } else {

                        $scope.rs_Change_name = river_shore.typeName;
                        $scope.rs_Change_value = river_shore.typeValue;
                        console.log($scope.rs_Change_name);
                        console.log($scope.rs_Change_value);
                    }
                }

                //湖段岸别
                $scope.lakesShore = function() {
                    $http({
                        method: "get",
                        url: $localStorage.gwUrl +riverUrl + "/riverType",
                        params: {
                            type:'112'
                        },
                    }).success(
                        function(res) {
                            console.log(res);
                            $scope.lakesShores = res.data;
                            console.log($scope.lakesShores);
                        }
                    );
                }
                $scope.ls_Change = function(lakes_shore) {
                    if (lakes_shore == null){
                        $scope.ls_Change_name = null;
                        $scope.ls_Change_value = null;
                    } else {

                        $scope.ls_Change_name = lakes_shore.typeName;
                        $scope.ls_Change_value = lakes_shore.typeValue;
                        console.log($scope.ls_Change_name);
                        console.log($scope.ls_Change_value);
                    }
                }

                //库段岸别
                $scope.reservoirShore = function() {
                    $http({
                        method: "get",
                        url: $localStorage.gwUrl +riverUrl + "/riverType",
                        params: {
                            type:'114'
                        },
                    }).success(
                        function(res) {
                            console.log(res);
                            $scope.reservoirShores = res.data;
                            console.log($scope.reservoirShores);
                        }
                    );
                }
                $scope.res_Change = function(reservoir_shore) {
                    $scope.res_Change_name = reservoir_shore.typeName;
                    $scope.res_Change_value = reservoir_shore.typeValue;
                    console.log($scope.res_Change_name);
                    console.log($scope.res_Change_value);
                }


                var regionAndUserTree;
                //所属区域树模态框【show】
                $scope.regionShow = function(){
                    $scope.areaName = '';
                    $("#region_ztree").modal('show');
                    $scope.treeList();
                };
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
                //所属区域树节点点击
                var treeNode_find,
                    _areaCode,
                    _grade;
                function zTreeOnClicks(event,treeId,treeNode){

                    treeNode_find = treeNode.id,
                        console.log(treeNode);
                    _areaCode = treeNode.name;
                    console.log(_areaCode);
                    // $scope.region = _areaCode;
                    _grade = treeNode.grade;
                    console.log(_grade);
                    if (treeNode_find != null){

                        console.log($scope.region);
                    }else{
                        $scope.region= '';
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
                    console.log('===========zTreeOnExpand===========')
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
                            console.log(res);
                            regionAndUserTree.addNodes(treeNode,res.data,true);
                        }
                    );
                }

                $scope.treeList = function(regionTreeUrl){
                    console.log(regionTreeUrl)
                    $http({
                        method: "GET",
                        url: $localStorage.gwUrl + basicUrl + "/tree",
                        dataType:'json'
                    }).success(
                        function(data) {
                            regionAndUserTree = $.fn.zTree.init($("#regionTree"), setting1, data.data);
                            console.log(regionAndUserTree)
                        }
                    ).error(function() {});
                }

                //河湖库级别
                $scope.rivePart = function() {
                    $http({
                        method: "get",
                        url: $localStorage.gwUrl +riverUrl + "/riverType",
                        params: {
                            type: '116'
                        },
                    }).success(
                        function(res) {
                            console.log(res);
                            $scope.riveParts = res.data;
                            $scope.dutyLevels = $scope.riveParts;
                            console.log($scope.riveParts);
                            console.log(_grade);
                            $scope.river_part = {
                                typeValue:_grade + "" //""字符串拼接
                            }
                            var classify;
                            if(_status == 1){
                                classify = 'A';
                            }else if(_status == 2){
                                classify = 'B';
                            }else if(_status == 3){
                                classify = 'C';
                            }else{
                                classify = null;
                            }
                            $scope.parentReach(classify);
                        }
                    );
                }

                $scope.rp_Change = function(x) {
                    if (x == null){
                        $scope.rp_Change_value = null;
                    } else {

                        $scope.rp_Change_value = x;
                        console.log($scope.rp_Change_value);
                    }
                }

                //区域模态框搜索框
                $scope.select_region = function() {
                    if($scope.areaName == null || $scope.areaName == ''){
                        $scope.treeList_region(regionTreeUrl);
                    }else{
                        $http({
                            method: "GET",
                            url: $localStorage.gwUrl + basicUrl + "/tree",
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
                $scope.region_modalOk = function (){
                    $("#region_ztree").modal('hide');
                    $scope.region = _areaCode;
                    $scope.rivePart();
                    $scope.river_ztree ='';
                };


                //水系选择模态框【show】
                var    water_ztree_node,
                    water_ztree_name,
                    water_ztree_code;
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
                            console.log(treeNode_find);
                            console.log(res);
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
                                console.log(res);
                                water_ztree_node = treeNode.id;
                                console.log(water_ztree_node);
                                $scope.river_ztree ='';
                                var _resCode = res.resCode;
                                if (_resCode == 1){
                                    water_ztree_name = res.data.waterName;
                                    water_ztree_code = res.data.waterCode;
                                    console.log(water_ztree_code);

                                    console.log($scope.water_ztree);
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
                                console.log($scope.waterName);
                                console.log(res);
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
                        $scope.water_ztree = water_ztree_name;
                    };
                };

                //河流选择模态框【show】
                var 	river_ztree_node,
                    river_ztree_name,
                    river_ztree_code;
                $scope.riverShow = function() {
                    $("#river_ztree").modal('show');
                    //生成河流树
                    $http({
                        method: "get",
                        url: $localStorage.gwUrl +waterUrl + "/riverLakesReservoir",
                        params: {
                            areaCode:treeNode_find,
                            waterCode:water_ztree_node,
                            type:"A"
                        },
                    }).success(
                        function(res) {
                            console.log(treeNode_find);
                            console.log(res);
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
                                type:"A"
                            },
                        }).success(
                            function(res) {
                                console.log(res);
                                var _resCode = res.resCode;
                                if (_resCode == 1){
                                    river_ztree_name = res.data.name;
                                    console.log(river_ztree_name);
                                    river_ztree_code = res.data.id;
                                    console.log(river_ztree_code);

                                    console.log($scope.river_ztree);
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
                                areaCode:treeNode_find,
                                waterCode:water_ztree_node,
                                type:"A",
                                name:$scope.riverName
                            },
                        }).success(
                            function(res) {
                                console.log($scope.riverName);
                                console.log(res);
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
                        $scope.river_ztree = river_ztree_name;
                    };
                };


                //湖泊选择模态框【show】
                var 	lakes_ztree_node,
                    lakes_ztree_name,
                    lakes_ztree_code;
                $scope.lakesShow = function() {
                    $("#lakes_ztree").modal('show');
                    //生成湖泊树
                    $http({
                        method: "get",
                        url: $localStorage.gwUrl +waterUrl + "/riverLakesReservoir",
                        params: {
                            areaCode:treeNode_find,
                            waterCode:water_ztree_node,
                            type:"B"
                        },
                    }).success(
                        function(res) {
                            console.log(treeNode_find);
                            console.log(res);
                            var setting1 = {
                                enable: true,
                                callback: {
                                    onClick: zTreeOnClick_lakes
                                }
                            };
                            var zNodes1 = [{
                                name: "根节点",
                                icon: "/vendor/zTree_v3/css/zTreeStyle/img/diy/10.png",
                                open: true,
                                children: res.data
                            }];
                            $.fn.zTree.init($("#lakesZtree"), setting1, zNodes1);
                            $scope.tree = res.data
                        }
                    );

                    //树节点点击事件
                    function zTreeOnClick_lakes(event, treeId, treeNode) {
                        $http({
                            method: "GET",
                            url: $localStorage.gwUrl +waterUrl + "/findByCode",
                            params: {
                                code: treeNode.id,
                                type:"B"
                            },
                        }).success(
                            function(res) {
                                console.log(res);
                                console.log(treeNode.id);
                                var _resCode = res.resCode;
                                if (_resCode == 1){
                                    lakes_ztree_name = res.data.name;
                                    console.log(lakes_ztree_name);
                                    lakes_ztree_code = res.data.id;
                                    console.log(lakes_ztree_code);

                                    console.log($scope.river_ztree);
                                }else{
                                    $scope.lakes_ztree= '';
                                }
                            }
                        );
                    };
                    //河流模态框搜索框
                    $scope.select_lakes = function() {
                        $http({
                            method: "GET",
                            url: $localStorage.gwUrl +waterUrl + "/riverLakesReservoir",
                            params: {
                                areaCode:treeNode_find,
                                waterCode:water_ztree_node,
                                type:"B",
                                name:$scope.lakesName
                            },
                        }).success(
                            function(res) {
                                console.log($scope.lakesName);
                                console.log(res);
                                var setting1 = {
                                    enable: true,
                                    callback: {
                                        onClick: zTreeOnClick_lakes
                                    }
                                };
                                var zNodes1 = [{
                                    name: "根节点",
                                    icon: "/vendor/zTree_v3/css/zTreeStyle/img/diy/10.png",
                                    open: true,
                                    children: res.data
                                }];
                                $.fn.zTree.init($("#lakesZtree"), setting1, zNodes1);
                                $scope.tree = res.data
                            }
                        );
                    };

                    //关闭模态框【确定按钮】
                    $scope.lakes_modalOk = function (){
                        $("#lakes_ztree").modal('hide');
                        $scope.lakes_ztree = lakes_ztree_name;
                    };
                };

                //水库选择模态框【show】
                var 	reservoir_ztree_node,
                    reservoir_ztree_name,
                    reservoir_ztree_code;
                $scope.reservoirShow = function() {
                    $("#reservoir_ztree").modal('show');
                    //生成水库树
                    $http({
                        method: "get",
                        url: $localStorage.gwUrl +waterUrl + "/riverLakesReservoir",
                        params: {
                            areaCode:treeNode_find,
                            waterCode:water_ztree_node,
                            type:"C"
                        },
                    }).success(
                        function(res) {
                            console.log(treeNode_find);
                            console.log(res);
                            var setting1 = {
                                enable: true,
                                callback: {
                                    onClick: zTreeOnClick_reservoir
                                }
                            };
                            var zNodes1 = [{
                                name: "根节点",
                                icon: "/vendor/zTree_v3/css/zTreeStyle/img/diy/10.png",
                                open: true,
                                children: res.data
                            }];
                            $.fn.zTree.init($("#reservoirZtree"), setting1, zNodes1);
                            $scope.tree = res.data
                        }
                    );

                    //树节点点击事件
                    function zTreeOnClick_reservoir(event, treeId, treeNode) {
                        $http({
                            method: "GET",
                            url: $localStorage.gwUrl +waterUrl + "/findByCode",
                            params: {
                                code: treeNode.id,
                                type:"C"
                            },
                        }).success(
                            function(res) {
                                console.log(res);
                                console.log(treeNode.id);
                                var _resCode = res.resCode;
                                if (_resCode == 1){
                                    reservoir_ztree_name = res.data.name;
                                    console.log(lakes_ztree_name);
                                    reservoir_ztree_code = res.data.id;
                                    console.log(reservoir_ztree_code);

                                    console.log($scope.reservoir_ztree);
                                }else{
                                    $scope.reservoir_ztree= '';
                                }
                            }
                        );
                    };
                    //河流模态框搜索框
                    $scope.select_reservoir = function() {
                        $http({
                            method: "GET",
                            url: $localStorage.gwUrl +waterUrl + "/riverLakesReservoir",
                            params: {
                                areaCode:treeNode_find,
                                waterCode:water_ztree_node,
                                type:"C",
                                name:$scope.reservoirName
                            },
                        }).success(
                            function(res) {
                                console.log($scope.reservoirName);
                                console.log(res);
                                var setting1 = {
                                    enable: true,
                                    callback: {
                                        onClick: zTreeOnClick_reservoir
                                    }
                                };
                                var zNodes1 = [{
                                    name: "根节点",
                                    icon: "/vendor/zTree_v3/css/zTreeStyle/img/diy/10.png",
                                    open: true,
                                    children: res.data
                                }];
                                $.fn.zTree.init($("#reservoirZtree"), setting1, zNodes1);
                                $scope.tree = res.data
                            }
                        );
                    };

                    //关闭模态框【确定按钮】
                    $scope.reservoir_modalOk = function (){
                        $("#reservoir_ztree").modal('hide');
                        $scope.reservoir_ztree = reservoir_ztree_name;
                    };
                };

                //增加管理人员
                $scope.reachadmins = [{chairman: "",dutyLevel:"",dutyType:"",bankSide:"",check:""}];
                $scope.addReachadmin = function($index){
                    $scope.reachadmins.splice($index + 1, 0, {chairman: "",dutyLevel:"",dutyType:"",bankSide:"",check:""});
                }

                //删除管理人员
                $scope.delReachadmin = function($index){
                    $scope.reachadmins.splice($index, 1);
                }

//                      $scope.add = function() {
//							routeService.route(56, true);
//						}

                $scope.back = function() {
                    // 跳转到菜单页面
                    routeService.route(12, true);
                }

                //管理人员树
                var regionTree;
                $scope.adminTree = function () {
                    $("#myModal_ztree_one").modal('show');
                    var regionAndUserTreeUrl = $localStorage.gwUrl + reachUrl + "/regionAndUserTree";
                    $scope.treeLists(regionAndUserTreeUrl);
                }

                //河长搜索
                $scope.select_one = function () {
                    $http({
                        method: "GET",
                        url: $localStorage.gwUrl + reachUrl + "/findByUser",
                        params: {
                            userName: $scope.waterName_one,
                        },
                    }).success(
                        function (resp) {
                            console.log($scope.waterName_one);
                            console.log(resp);
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
                            regionTree = $.fn.zTree.init($("#regionTrees"), setting, resp.data);
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
                        onClick: zTreeOnClick
                    }
                };

                function zTreeOnClick(event, treeId, treeNode) {
                    console.log(treeNode)
                    $http({
                        method: "GET",
                        url: $localStorage.gwUrl + reachUrl + "/findByUser",
                        params: {
                            userId: treeNode.id,
                        },
                    }).success(
                        function(res) {
                            console.log(res);
                            if(res.resCode == 1){
                                $scope.chairmanName = res.data.name;
                                console.log($scope.chairmanName)
                                $scope.chairmanId = res.data.id;
                                console.log($scope.chairmanId)
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
                            regionTree.addNodes(treeNode, res.data, true);
                        }
                    );
                }

                $scope.treeLists = function (regionAndUserTreeUrl) {
                    console.log(regionAndUserTreeUrl);
                    $http({
                        method: "GET",
                        url: regionAndUserTreeUrl,
                        dataType: 'json'
                    }).success(
                        function (data) {
                            console.log(data.data)
                            regionTree = $.fn.zTree.init($("#regionTrees"), setting, data.data);
                            console.log(regionTree)
                        }
                    ).error(function () {
                    });
                }

                //关闭模态框【确定按钮】
                $scope.modalOk_one = function () {
                    $("#myModal_ztree_one").modal('hide');
                };
                // };

                //履职级别
                // $scope.dutyLevel = function () {
                //    $http({
                //        method: "get",
                //        url: $localStorage.gwUrl +watersourceServiceUrl + "/smDictionary/riverType",
                //        params: {
                //            type: 1
                //        }
                //    }).success(
                //        function (res) {
                //            console.log(res);
                //            $scope.dutyLevels = res.data;
                //            console.log($scope.dutyLevels);
                //        }
                //    );
                // }

                //履职类型
                $scope.dutyType = function () {
                    $http({
                        method: "get",
                        url: $localStorage.gwUrl +reachUrl + "/chairmanType"
                    }).success(
                        function (res) {
                            console.log(res);
                            $scope.dutyTypes = res.data;
                            console.log($scope.dutyTypes);
                        }
                    );
                }

                //履职级别
                $scope.level_Change = function(d_Level) {
                    if (d_Level == null){
                        $scope.level_Change_name = null;
                        $scope.level_Change_value = null;
                    } else {

                        $scope.level_Change_value = d_Level.typeValue;
                        console.log($scope.level_Change_name);
                        console.log($scope.level_Change_value);
                        $scope.level_Change_name = d_Level.typeName;
                    }
                }

                //履职类型
                $scope.dutyType_Change = function(d_Level) {
                    if (d_Level == null){
                        $scope.dutyType_Change_name = null;
                        $scope.dutyType_Change_value = null;
                    } else {

                        $scope.dutyType_Change_name = d_Level.typeName;
                        $scope.dutyType_Change_value = d_Level.typeValue;
                        console.log($scope.dutyType_Change_name);
                        console.log($scope.dutyType_Change_value);
                    }
                }

                //管理岸面
                $scope.side_Change = function(d_Level) {
                    if (d_Level == null){
                        $scope.side_Change_name = null;
                        $scope.side_Change_value = null;
                    } else {

                        $scope.side_Change_name = d_Level.typeName;
                        $scope.side_Change_value = d_Level.typeValue;
                        console.log($scope.side_Change_name);
                        console.log($scope.side_Change_value);
                    }
                }

                //checkbox 选中/未选中  取值
                $scope.chiefCheckBtn = function($event){
                    var Y,N,checked = $event.target;
                    if(checked.checked){
                        $scope.chiefCheck = "Y"
                        console.log($scope.chiefCheck)
                    }else{
                        $scope.chiefCheck = "N"
                        console.log($scope.chiefCheck)
                    };
                };

                //新增河湖库数据
                var jsname = /^[a-zA-Z0-9_-]{4,16}$/;
                var len =/^\d+(?:\.\d{1,2})?$/;
                $scope.add = function() {

                    if(!$scope.reachFName || !jsname.test($scope.reachFName) == null) {
                        layer.alert("请完善信息", {
                            skin: 'my-skin',
                            closeBtn: 1,
                            anim: 3
                        });

                    } else if ($scope.reachFName.substr(-2) != '河段' && $scope.reachFName.substr(-2) !='湖段' && $scope.reachFName.substr(-2) != '库段'){
                        layer.alert("请根据命名规则命名", {
                            skin: 'my-skin',
                            closeBtn: 1,
                            anim: 3
                        });
                    }else if(_status == 1) {//新增河流
                        if (!$scope.alias) {
                            layer.alert("请完善河湖库别名", {
                                skin: 'my-skin',
                                closeBtn: 1,
                                anim: 3
                            });
                        } else if (!$scope.water_quality) {
                            layer.alert("请完善水质等级", {
                                skin: 'my-skin',
                                closeBtn: 1,
                                anim: 3
                            });
                        } else if (!$scope.deposit_status) {
                            layer.alert("请完善淤积情况", {
                                skin: 'my-skin',
                                closeBtn: 1,
                                anim: 3
                            });
                        } else if (!$scope.river_shore) {
                            layer.alert("请完善河段岸别", {
                                skin: 'my-skin',
                                closeBtn: 1,
                                anim: 3
                            });
                        } else if (!$scope.region) {
                            layer.alert("请完善所属区域", {
                                skin: 'my-skin',
                                closeBtn: 1,
                                anim: 3
                            });
                        } else if (!$scope.water_ztree) {
                            layer.alert("请完善所属水系", {
                                skin: 'my-skin',
                                closeBtn: 1,
                                anim: 3
                            });
                        }
//                              else if (!$scope.river_ztree) {
//                                  layer.alert("请完善所属河流", {
//                                      skin: 'my-skin',
//                                      closeBtn: 1,
//                                      anim: 3
//                                  });
//                              }
                        else if (!$scope.river_part.typeValue) {
                            layer.alert("请完善河湖库级别", {
                                skin: 'my-skin',
                                closeBtn: 1,
                                anim: 3
                            });
                        } else if (!$scope.whether_mountain){
                            layer.alert("请完善山区信息", {
                                skin: 'my-skin',
                                closeBtn: 1,
                                anim: 3
                            });
                        } else if (!$scope.whether_virtual){
                            layer.alert("请完善虚拟信息", {
                                skin: 'my-skin',
                                closeBtn: 1,
                                anim: 3
                            });
                        } else if ($scope.length == null || $scope.length === '' || eval($scope.length)<=0 ||!len.test($scope.length)){
                            layer.alert("请完善长度,长度为正数，最大保留2位小数", {
                                skin: 'my-skin',
                                closeBtn: 1,
                                anim: 3
                            });
                        } else if ($scope.width == null || $scope.width === '' || eval($scope.width)<=0 ||!len.test($scope.width)){
                            layer.alert("请完善宽度,长度为正数，最大保留2位小数", {
                                skin: 'my-skin',
                                closeBtn: 1,
                                anim: 3
                            });
                        } else if (!$scope.chairmanName) {
                            layer.alert("请完善履职人员", {
                                skin: 'my-skin',
                                closeBtn: 1,
                                anim: 3
                            });
                        } else if (!$scope.dutyLevels.typeValue) {
                            layer.alert("请完善履职级别", {
                                skin: 'my-skin',
                                closeBtn: 1,
                                anim: 3
                            });
                        } else if (!$scope.dutyTypes.typeValue) {
                            layer.alert("请完善履职类型", {
                                skin: 'my-skin',
                                closeBtn: 1,
                                anim: 3
                            });
                        } else if (!$scope.bankSides.typeValue) {
                            layer.alert("请完善管理岸面", {
                                skin: 'my-skin',
                                closeBtn: 1,
                                anim: 3
                            });
                        } else{
                            $http({
                                method: "post",
                                url: $localStorage.gwUrl +reachUrl + "/add",
                                params: {
                                    reachName: $scope.reachFName,
                                    alias: $scope.alias,
                                    waterGrade: $scope.quality_Change_value,
                                    silty: $scope.deposit_Change_value,
                                    grade: $scope.river_part.typeValue,
                                    shore: $scope.rs_Change_value,
                                    regionCode: treeNode_find,
                                    waterCode: water_ztree_node,
                                    theirCode: river_ztree_code,
                                    startPoint: $scope.startPoint,
                                    endPoint: $scope.endPoint,
                                    whether: $scope.wm_Change_value,
                                    isVirtual: $scope.wv_Change_value,
                                    length: $scope.length,
                                    width: $scope.width,
                                    throughArea: $scope.throughArea,
                                    overView: $scope.overView,
                                    chairmanid: $scope.chairmanId,
                                    chairmanName: $scope.chairmanName,
                                    chairmanlevel: $scope.level_Change_value,
                                    chairmanRole: $scope.dutyType_Change_value,
                                    administrationCoast: $scope.side_Change_value,
                                    isAssess: $scope.chiefCheck,
                                    parentsCode: $scope.parentReach_Change_value,
                                    classify:'A'
                                },
                            }).success(
                                function () {
                                    layer.msg('成功新增一条数据！', {time: 2000});
                                })
                        }
                    }else if(_status == 2){//新增湖泊

                        if (!$scope.alias) {
                            layer.alert("请完善河湖库别名", {
                                skin: 'my-skin',
                                closeBtn: 1,
                                anim: 3
                            });
                        } else if (!$scope.parentReach){
                            layer.alert("请完善上级河段", {
                                skin: 'my-skin',
                                closeBtn: 1,
                                anim: 3
                            });
                        } else if (!$scope.water_quality) {
                            layer.alert("请完善水质等级", {
                                skin: 'my-skin',
                                closeBtn: 1,
                                anim: 3
                            });
                        } else if (!$scope.deposit_status) {
                            layer.alert("请完善淤积情况", {
                                skin: 'my-skin',
                                closeBtn: 1,
                                anim: 3
                            });
                        } else if (!$scope.lakes_shore) {
                            layer.alert("请完善湖段岸别", {
                                skin: 'my-skin',
                                closeBtn: 1,
                                anim: 3
                            });
                        } else if (!$scope.region) {
                            layer.alert("请完善所属区域", {
                                skin: 'my-skin',
                                closeBtn: 1,
                                anim: 3
                            });
                        } else if (!$scope.water_ztree) {
                            layer.alert("请完善所属水系", {
                                skin: 'my-skin',
                                closeBtn: 1,
                                anim: 3
                            });
                        } else if (!$scope.lakes_ztree) {
                            layer.alert("请完善所属湖泊", {
                                skin: 'my-skin',
                                closeBtn: 1,
                                anim: 3
                            });
                        } else if (!$scope.river_part.typeValue) {
                            layer.alert("请完善河湖库级别", {
                                skin: 'my-skin',
                                closeBtn: 1,
                                anim: 3
                            });
                        } else if (!$scope.chairmanName) {
                            layer.alert("请完善履职人员", {
                                skin: 'my-skin',
                                closeBtn: 1,
                                anim: 3
                            });
                        } else if (!$scope.dutyLevels.typeValue) {
                            layer.alert("请完善履职级别", {
                                skin: 'my-skin',
                                closeBtn: 1,
                                anim: 3
                            });
                        } else if (!$scope.dutyTypes.typeValue) {
                            layer.alert("请完善履职类型", {
                                skin: 'my-skin',
                                closeBtn: 1,
                                anim: 3
                            });
                        } else if (!$scope.bankSides.typeValue) {
                            layer.alert("请完善管理岸面", {
                                skin: 'my-skin',
                                closeBtn: 1,
                                anim: 3
                            });
                        }else {
                            $http({

                                method: "post",
                                url: $localStorage.gwUrl +reachUrl + "/v1/add",
                                params: {
                                    reachName: $scope.reachFName,
                                    alias: $scope.alias,
                                    waterGrade: $scope.quality_Change_value,
                                    silty: $scope.deposit_Change_value,
                                    grade: $scope.river_part.typeValue,
                                    shore: $scope.ls_Change_value,
                                    regionCode:treeNode_find,
                                    waterCode:water_ztree_node,
                                    theirCode:lakes_ztree_code,
                                    startPoint:$scope.startPoint,
                                    endPoint:$scope.endPoint,
                                    whether:$scope.wm_Change_value,
                                    isVirtual:$scope.wv_Change_value,
                                    length:$scope.length,
                                    width:$scope.width,
                                    throughArea:$scope.throughArea,
                                    overView:$scope.overView,
                                    chairmanid: $scope.chairmanId,
                                    chairmanName: $scope.chairmanName,
                                    chairmanlevel: $scope.level_Change_value,
                                    chairmanRole: $scope.dutyType_Change_value,
                                    administrationCoast:$scope.side_Change_value,
                                    isAssess:$scope.chiefCheck,
                                    parentsCode: $scope.parentReach_Change_value,
                                    classify:'B'
                                },
                            }).success(
                                function() {
                                    layer.msg('成功新增一条数据！',{time:2000});
                                }
                            );
                        }
                    }else if(_status == 3){//新增水库

                        if (!$scope.alias) {
                            layer.alert("请完善河湖库别名", {
                                skin: 'my-skin',
                                closeBtn: 1,
                                anim: 3
                            });
                        } else if (!$scope.water_quality) {
                            layer.alert("请完善水质等级", {
                                skin: 'my-skin',
                                closeBtn: 1,
                                anim: 3
                            });
                        } else if (!$scope.deposit_status) {
                            layer.alert("请完善淤积情况", {
                                skin: 'my-skin',
                                closeBtn: 1,
                                anim: 3
                            });
                        } else if (!$scope.reservoir_shore) {
                            layer.alert("请完善库段岸别", {
                                skin: 'my-skin',
                                closeBtn: 1,
                                anim: 3
                            });
                        } else if (!$scope.region) {
                            layer.alert("请完善所属区域", {
                                skin: 'my-skin',
                                closeBtn: 1,
                                anim: 3
                            });
                        } else if (!$scope.water_ztree) {
                            layer.alert("请完善所属水系", {
                                skin: 'my-skin',
                                closeBtn: 1,
                                anim: 3
                            });
                        } else if (!$scope.reservoir_ztree) {
                            layer.alert("请完善所属水库", {
                                skin: 'my-skin',
                                closeBtn: 1,
                                anim: 3
                            });
                        } else if (!$scope.river_part.typeValue) {
                            layer.alert("请完善河湖库级别", {
                                skin: 'my-skin',
                                closeBtn: 1,
                                anim: 3
                            });
                        } else if (!$scope.chairmanName) {
                            layer.alert("请完善履职人员", {
                                skin: 'my-skin',
                                closeBtn: 1,
                                anim: 3
                            });
                        } else if (!$scope.dutyLevels.typeValue) {
                            layer.alert("请完善履职级别", {
                                skin: 'my-skin',
                                closeBtn: 1,
                                anim: 3
                            });
                        } else if (!$scope.dutyTypes.typeValue) {
                            layer.alert("请完善履职类型", {
                                skin: 'my-skin',
                                closeBtn: 1,
                                anim: 3
                            });
                        } else if (!$scope.bankSides.typeValue) {
                            layer.alert("请完善管理岸面", {
                                skin: 'my-skin',
                                closeBtn: 1,
                                anim: 3
                            });
                        }else {

                            $http({
                                method: "post",
                                url: $localStorage.gwUrl + reachUrl + "/add",
                                params: {
                                    reachName: $scope.reachFName,
                                    alias: $scope.alias,
                                    waterGrade: $scope.quality_Change_value,
                                    silty: $scope.deposit_Change_value,
                                    grade: $scope.river_part.typeValue,
                                    shore: $scope.res_Change_value,
                                    regionCode: treeNode_find,
                                    waterCode: water_ztree_node,
                                    theirCode: reservoir_ztree_code,
                                    startPoint: $scope.startPoint,
                                    endPoint: $scope.endPoint,
                                    whether: $scope.wm_Change_value,
                                    isVirtual: $scope.wv_Change_value,
                                    length: $scope.length,
                                    width: $scope.width,
                                    throughArea: $scope.throughArea,
                                    overView: $scope.overView,
                                    chairmanid: $scope.chairmanId,
                                    chairmanName: $scope.chairmanName,
                                    chairmanlevel: $scope.level_Change_value,
                                    chairmanRole: $scope.dutyType_Change_value,
                                    administrationCoast: $scope.side_Change_value,
                                    isAssess: $scope.chiefCheck,
                                    parentsCode: $scope.parentReach_Change_value,
                                    classify:'C'
                                },
                            }).success(
                                function (res) {
                                    if(res.resCode === 1){
                                        layer.msg('创建成功', {time:2000});
                                    }else {
                                        layer.msg(res.resMsg, {time:2000});
                                    }
                                }
                            );
                        }
                    }else{
                        layer.msg('数据失败！',{time:2000});
                    }

                }



            }]);

})(window, angular);