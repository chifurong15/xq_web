(function (window, angular) {
    'use strict';

    var app = angular.module("app");
    app.filter("trustHtml", function ($sce) {
        return function (input) {
            return $sce.trustAsHtml(input);
        }
    })

    app.controller(
        'riverChiefOnlineCtrl', [
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
            'MapTool',
            'MapUtil',
            'EventService',
            'PatrolRiverService',
            'RiverChiefOnlineService',
            'ReachService',
            'GeometryUtil',
            'queryAdminregion',
            function riverChiefOnlineCtrl($localStorage, $scope, $location, $log, $q, $rootScope, globalParam, $window, routeService, $http,
                                          wish, esriApiDeps, tiandituFactory, MapTool, MapUtil, EventService, PatrolRiverService, RiverChiefOnlineService,
                                          ReachService, GeometryUtil, queryAdminregion) {

                var promise = esriApiDeps.query();
                var w = wish.get();

                // 初始化
                $scope.init = function () {
                    //gis模块初始化
                    queryAdminregion.init($scope.map);
                    MapTool.init($scope.map);
                    MapUtil.init($scope.map);
                    GeometryUtil.init($scope.map);
                    EventService.init($scope.map, "eventServiceLayer");
                    PatrolRiverService.init($scope.map, "patrolRiverLayer");
                    ReachService.init($scope.map, $scope.checkRegionId);
                    RiverChiefOnlineService.init($scope.map, "riverChiefOnlineLayer");
                    //自适应模态框
                    modalContainer();
                };
                $('#historyDetailModalContent').css('width',document.body.clientWidth*0.7 + 'px');
                //自适应模态框
                var modalContainer = function () {
                    var drainageWrapperH = document.body.offsetHeight;
                    var drainageWrapperW = document.body.offsetWidth;
                    //console.log(drainageWrapperW)
                    //console.log(drainageWrapperH)
//                  document.getElementById("remarkModalPanel").style.height = drainageWrapperH - 120 +"px";
                    $('#remarkPanel').css({
                        width: drainageWrapperW - 650 +"px",
                        marginTop: - ((drainageWrapperH/2)- 120)  +"px",
                        marginLeft: - ((drainageWrapperW/2)- 280) +"px"
                    })
                    // document.getElementById("remarkPanel")[0].style.width = drainageWrapperW - 650 +"px";
                    // document.getElementById("remarkPanel")[0].style.marginTop =  - ((drainageWrapperH/2)- 120)  +"px";
                    // document.getElementById("remarkPanel")[0].style.marginLeft = - ((drainageWrapperW/2)- 280) +"px";
                };

                window.onresize = function () {
                    modalContainer();
                };
                var region = {
                    "longitude": 117.19203455803067,
                    "latitude": 39.08350838137276,
                    "regionlevel": 2
                };

                $scope.map = new w.Map("map", {
                    slider: false,
                    autoResize: true,
                    resizeDelay: 100,
                    logo: false
                });
                tiandituFactory.initTianditu($scope.map, region);
                
                dojo.connect($scope.map, 'onClick', function (evt) {
                    console.log("click XY：" + evt.mapPoint.x+", "+ evt.mapPoint.y);
                });

                // 地图工具菜单点击
                var measureTool = null;
                $scope.measureFunc = function (type) {
                    if (measureTool == null) {
                        measureTool = new w.MeasureTools({
                            map: $scope.map
                        });
                    };

                    if (type == "area") {
                        measureTool._startMeasureArea();
                    } else if (type == "distance") {
                        measureTool._startMeasureDistance();
                    } else {
                        measureTool._clearMeasure();
                        RiverChiefOnlineService.clearAll();
                        //清除infowindow
                        if(EventService.isGraphicClick){
                            $scope.map.infoWindow.hide();
                            EventService.isGraphicClick = false;
                        }
                    };
                };

                // 开始时间
                var beginTime = $('#beginTime').datetimepicker({
                    format: 'YYYY-MM-DD hh:mm:ss',
                    locale: moment.locale('zh-cn')
                }).on('dp.change', function (c) {
                    var result = new moment(c.date).format('YYYY-MM-DD hh:mm:ss');
                    $scope.beginTime = result;
                    $scope.$apply();
                });

                // 结束时间
                var endTime = $('#endTime').datetimepicker({
                    format: 'YYYY-MM-DD hh:mm:ss',
                    locale: moment.locale('zh-cn')
                }).on('dp.change', function (c) {
                    var result = new moment(c.date).format('YYYY-MM-DD hh:mm:ss');
                    $scope.endTime = result;
                    $scope.$apply();
                    console.log(result);
                });

				/**
				 * zTree节点基本设置
				 */
				var setting = {
					async: {
						enable: true,
						type: 'get',
						dataType: 'json',
					},
					data: {
						key: {
							title: 'title'
						},
						simpleData: {
							enable: true
						}
					},
					edit: {
						enable: false
					},
					view: {
						nameIsHTML: true,
						expandSpeed: 'slow',
						dblClickExpand: false,
						txtSelectedEnable: false,
					}
				};
				/**
				 * 区域节点异步请求数据URL
				 */
				function asyncGetRegionNodesURL(treeId, treeNode) {
					return $localStorage.serviceUrl_chiefOnline + '/chairmanOnline/v1/loadRegion?regionId=' + treeNode.id;
				};
				/**
				 * 区域节点点击问题
				 */
				function dblClickRegionNodes(event, treeId, treeNode) {
//					$scope.checkRegionId = treeNode.id;
//					$scope.searchRiverChief();
//					rightStatusCount();
				};
                var timer;
                $scope.online = false;//在线
                $scope.patrol = true;//巡查
                $scope.offLine = false;//离线
                $scope.areaLevel = true;//区县级
                $scope.townLevel = false;//镇级
                $scope.villLevel = false; //村级
                $scope.cityLevel = true;//市级
                var reigonCheckArr = ['2','3'];
				function onClickRegionNodes(event, treeId, treeNode){
                    clearInterval(timer);
                    if(treeNode.grade == 2){
                        $scope.cityLevel = true;
                        $scope.areaLevel = false;
                        $scope.townLevel = false;
                        $scope.villLevel = false;
                        reigonCheckArr = ['2'];
                    }else if(treeNode.grade == 3){
                        $scope.cityLevel = false;
                        $scope.areaLevel = true;
                        $scope.townLevel = false;
                        $scope.villLevel = false;
                        reigonCheckArr = ['3'];
                    }else if(treeNode.grade == 4){
                        $scope.cityLevel = false;
                        $scope.areaLevel = false;
                        $scope.townLevel = true;
                        $scope.villLevel = false;
                        reigonCheckArr = ['4'];
                    }else if(treeNode.grade == 5){
                        $scope.cityLevel = false;
                        $scope.areaLevel = false;
                        $scope.townLevel = false;
                        $scope.villLevel = true;
                        reigonCheckArr = ['5'];
                    };
					$scope.checkRegionId = treeNode.id;
                    //节点点击定位
                    if(MapUtil.isCoordValid(treeNode["longitude"],treeNode["latitude"])){
                        if(treeNode["grade"] != null){
                            MapUtil.center2LongLat(treeNode["longitude"],treeNode["latitude"],treeNode["grade"]);
                        }
                    }else{
                        console.error("无效坐标");
                        alert("定位失败！无经纬度信息...");
                    }
                    //查询河道
                    //ReachService.getReachList();


					$scope.searchRiverChief();
                    rightStatusCount();
				};
				/**
				 * 区域节点展开问题
				 */
				function regionNodeExpand(event, treeId, treeNode) {
//					console.log(treeNode);
				};

				/**
				 * 区域节点异步请求成功回调函数
				 */
				function asyncGetRegionNodesSuccess(event, treeId, treeNode, res) {
					var treeObj = $.fn.zTree.getZTreeObj(treeId);
					//更新节点数据
					treeObj.addNodes(treeNode, -1, res.data);
					if (treeNode.children[0].resCode) {
						treeObj.removeNode(treeNode.children[0]);
						treeObj.updateNode(treeNode);
					};
				};
				/**
				 * 区域 zTree节点补充设置
				 */
				var regionSetting = {
					async: {
						url: asyncGetRegionNodesURL
					},
					callback: {
						onAsyncSuccess: asyncGetRegionNodesSuccess,
						onDblClick: dblClickRegionNodes,
						onClick: onClickRegionNodes,
						onExpand: regionNodeExpand
					}
				};
				/**
				 * zTree 节点深拷贝
				 */
				var regionTreeSetting = $.extend(true, {}, setting, regionSetting);
				/**
				 * 区域树加载
				 */
                var treeInit = function(){
                    $http({
                        method: 'get',
                        url: $localStorage.serviceUrl_chiefOnline + '/chairmanOnline/v1/loadRegion',
    //                  url: $localStorage.serviceUrl_chiefOnline + '/chairmanOnline/v1/region'
                    }).success(function (data) {
                        $scope.checkRegionId = data.data[0].id;
                        //区划边界
                        if(data.data[0].spatialData !== "" && data.data[0].spatialData !== "[]"){
                            var spatialData = data.data[0].spatialData;
                            var g = queryAdminregion.addParentGraphic(spatialData);
                            queryAdminregion.adminregionLayer.add(g);
                        }else {
                            console.log("当前区划边界坐标为空");
                        }
                        ReachService.getReachList();
                        leftStatusCount();
                        rightStatusCount();
                        $.fn.zTree.init($('#regionTreeContainer'), regionTreeSetting, data.data);
                        $scope.searchRiverChief();
                    });
                };
				treeInit();
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
                    if($('#toolbarClose').hasClass('toolbar-6')){
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
                $scope.changeMapResource = function(resourceType){
                    if(resourceType == 'imgAnno'){
                        MapTool.controlLayerVisible("cia", true);
                    }else {
                        MapTool.controlLayerVisible("cva", true);
                    }
                };

                $scope.types = [
                    {num: 1, style: 'normal', "background-position": "0 0"},
                    {num: 2, style: 'earth', "background-position": "0 -60px"}
                ];

                $scope.showMapTypes = function (style) {
                    $scope.selected = style;

                    if(style == 'earth'){
                        MapTool.controlLayerVisible("img", true);
                    }else {
                        MapTool.controlLayerVisible("vec", true);
                    }
                }

                //左侧人员状态及数量统计
                var leftStatusCount = function(){
                    $http({
                        url: $localStorage.serviceUrl_chiefOnline + '/chairmanOnline/v1/countHZOnline',
                        method: 'get'
                    }).success(function(res){
                        if(res.resCode == 1){
                            $scope.leftStausCount = res.data;
                        };
                    });
                };
				//右侧人员状态及数据统计
				var rightStatusCount = function(){
					$http({
	                	url: $localStorage.serviceUrl_chiefOnline + '/chairmanOnline/v1/countHZStatus/' + $scope.checkRegionId,
	                	method: 'get'
	                }).success(function(res){
	                	if(res.resCode == 1){
	                		$scope.rightStausCount = res.data;
	                	}
	                });
				};
                //勾选筛选条件的问题
                $scope.changeCheck = function(type){
                	switch (type){
                		case 'online':
                			$scope.online = !$scope.online;
                			break;
                			case 'patrol':
                			$scope.patrol = !$scope.patrol;
                			break;
                			case 'offLine':
                			$scope.offLine = !$scope.offLine;
                			break;
                			case 'areaLevel':
                			$scope.areaLevel = !$scope.areaLevel;
                            if($scope.areaLevel){
                                if(reigonCheckArr.indexOf('3')<0){
                                    reigonCheckArr.push('3');
                                };
                            }else{
                                if(reigonCheckArr.indexOf('3')>=0){
                                    var len = reigonCheckArr.indexOf('3');
                                    reigonCheckArr.splice(len,1);
                                };
                            };
                			break;
                			case 'townLevel':
                			$scope.townLevel = !$scope.townLevel;
                            if($scope.townLevel){
                                if(reigonCheckArr.indexOf('4')<0){
                                    reigonCheckArr.push('4');
                                };
                            }else{
                                if(reigonCheckArr.indexOf('4')>=0){
                                    var len = reigonCheckArr.indexOf('4');
                                    reigonCheckArr.splice(len,1);
                                };
                            };
                			break;
                			case 'villLevel':
                			$scope.villLevel = !$scope.villLevel;
                            if($scope.villLevel){
                                if(reigonCheckArr.indexOf('5')<0){
                                    reigonCheckArr.push('5');
                                };
                            }else{
                                if(reigonCheckArr.indexOf('5')>=0){
                                    var len = reigonCheckArr.indexOf('5');
                                    reigonCheckArr.splice(len,1);
                                };
                            };
                			break;
                            case 'cityLevel':
                            $scope.cityLevel = !$scope.cityLevel;
                            if($scope.cityLevel){
                                if(reigonCheckArr.indexOf('2')<0){
                                    reigonCheckArr.push('2');
                                };
                            }else{
                                if(reigonCheckArr.indexOf('2')>=0){
                                    var len = reigonCheckArr.indexOf('2');
                                    reigonCheckArr.splice(len,1);
                                };
                            };
                            break;
                		default:
                			break;
                	};
                };
                //获取河长表格数据的函数
                var getRiverChiefTabData = function() {
                    var reigonCheckArrString = reigonCheckArr.toString();
                    var params = {
                        hzname: $scope.riverChiefName,
                        reachName: $scope.riverReachName,
                        status: 'Y,O',
                        level: reigonCheckArrString
                    };
                    //河长在线状态参数
                    if($scope.online && !$scope.patrol && !$scope.offLine){
                        //只勾选在线
                        params.status = 'L';
                    }else if($scope.online && $scope.patrol && !$scope.offLine){
                        //勾选在线和巡查
                        params.status = 'L,Y';
                    }else if($scope.online && $scope.patrol && $scope.offLine){
                        //勾选在线巡查和离线
                        params.status = 'L,Y,O';
                    }else if(!$scope.online && $scope.patrol && !$scope.offLine){
                        //只勾选巡查
                        params.status = 'Y';
                    }else if(!$scope.online && $scope.patrol && $scope.offLine){
                        //勾选巡查和离线的
                        params.status = 'Y,O';
                    }else if(!$scope.online && !$scope.patrol && $scope.offLine){
                        //只勾选离线
                        params.status = 'O';
                    }else if(!$scope.online && !$scope.patrol && !$scope.offLine){
                        //全部不勾选
                        params.status = '';
                    }else if($scope.online && !$scope.patrol && $scope.offLine){
                        //勾选在线和离线
                        params.status = 'L,O';
                    };
                    $http({
                        method: 'GET',
                        url: $localStorage.serviceUrl_chiefOnline + '/chairmanOnline/v1/search/' + $scope.checkRegionId,
                        params: params
                    }).success(function(res){
                        if(res.resCode == 1){
                            //列表数据赋值
                            $scope.riverChiefList = res.data
                            rightStatusCount();
                            //根据列表在地图中显示河长
                            if(res.data && res.data.length > 0){
                                console.log(res.data);
                                //刷新轨迹
                                if(RiverChiefOnlineService.getClickPatrolId() !== null){
                                    RiverChiefOnlineService.getRefreshPatrol();
                                }
                                RiverChiefOnlineService.addGraphic(res.data);
                            }else{
                                RiverChiefOnlineService.clear();
                                console.error("chiefOnline data is null");
                            }

                        }else{
                        }
                    }).error(function(res){
                    })
                };
                //点击搜索按钮搜索列表数据
                $scope.searchRiverChief = function(){
                    getRiverChiefTabData();
                	updateDataFunc();
                };
                //河长级别转化函数
                $scope.riverChiefLevel = function(level){
                	var levelText = '';
                	switch (level){
                		case 2:
                    		levelText = '市级'
                    		break;
                		case 3:
                		levelText = '区级'
                			break;
                		case 4:
                		levelText = '镇级'
                			break;
                		case 5:
                		levelText = '村级'
                			break;
                		default:
                			break;
                	};
                	return levelText;
                };
                //获取巡河数据函数
                var getPatrolData = function(){
                	//巡河数据参数
                	var params = {
                		userId: $scope.userId,
                		startTime: $scope.beginTime,
                		endTime: $scope.endTime
                	};
                	$http({
                		method: 'GET',
                		url: $localStorage.serviceUrl_patrolMgr + '/charimanPatrol/v1/patrolDetail',
                		params: params
                	}).success(function(res){
                		if(res.resCode == 1){
                			$scope.patrolList = res.data;
                            for(let i = 0;i<$scope.patrolList.length;i++){
                                $scope.patrolList[i].isCheck = false;
                            }
                		}
                	}).error(function(res){
                		
                	})
                };
                //点击巡河搜索按钮重新获取巡河数据
                $scope.searchPatrolData = function(){
                	getPatrolData();
                };
                //获取河长详情数据
                var getRiverChiefData = function(){
                	//河长详情参数
                	var params = {
                		userId: $scope.userId,
                	};
                	$http({
                		method: 'GET',
                		url: $localStorage.serviceUrl_chiefOnline + '/chairmanOnline/v1/getHZDetail',
                		params: params
                	}).success(function(res){
                		if(res.resCode == 1){
                			$scope.riverChiefDetail = res.data;
                			switch (res.data.level){
		                		case 2:
		                		$scope.riverChiefLevelData = '市级'
		                			break;
		                			case 3:
		                		$scope.riverChiefLevelData = '区级'
		                			break;
		                			case 4:
		                		$scope.riverChiefLevelData = '镇级'
		                			break;
		                			case 5:
		                		$scope.riverChiefLevelData = '村级'
		                			break;
		                		default:
		                			break;
		                	};
                		}
                	}).error(function(res){
                		
                	})
                };
                // 开始时间
                var beginTimeEve = $('#beginTimeEve').datetimepicker({
                    format: 'YYYY-MM-DD hh:mm:ss',
                    locale: moment.locale('zh-cn')
                }).on('dp.change', function (c) {
                    var result = new moment(c.date).format('YYYY-MM-DD hh:mm:ss');
                    $scope.beginTimeEve = result;
                    $scope.$apply();
                });

                // 结束时间
                var endTimeEve = $('#endTimeEve').datetimepicker({
                    format: 'YYYY-MM-DD hh:mm:ss',
                    locale: moment.locale('zh-cn')
                }).on('dp.change', function (c) {
                    var result = new moment(c.date).format('YYYY-MM-DD hh:mm:ss');
                    $scope.endTimeEve = result;
                    $scope.$apply();
                });
                //获取问题列表数据
                var getEveList = function(){
                	//问题参数
                	var params = {
                		reportPersonId: $scope.userId,
                		startTime: $scope.beginTimeEve,
            			endTime: $scope.endTimeEve        
                	};
                	$http({
                		method: 'GET',
                		url: $localStorage.serviceUrl_eventMgr + '/v1/event/queryEventByReachOrRegion',
                		params: params
                	}).success(function(res){
                		if(res.resCode == 1){
                			$scope.riverChiefEveList= res.data;
                            for(let i = 0;i<$scope.riverChiefEveList.length;i++){
                                $scope.riverChiefEveList[i].isCheck = false;
                            }
                		}
                	}).error(function(res){
                		
                	})
                };
                //点击问题搜索按钮搜索问题列表数据
                $scope.searchEveData = function(){
                	getEveList();
                };
                //点击河长获取河长相关详细数据
                $scope.patrolDataList = function(item){
                    //点击定位
                    if(MapUtil.isCoordValid(item["longitude"],item["latitude"])){
                        /*if(item["chairmanlevel"] != null){
                            MapUtil.center2LongLat(item["longitude"],item["latitude"],item["chairmanlevel"]);
                        }*/
                        MapUtil.center2point(item["longitude"],item["latitude"]);
                    }else{
                        if(item["status"] !== 0) {
                            console.warn("无效坐标...");
                            alert("定位失败！无经纬度信息...");
                        }else {
                            console.warn("离线无法定位...");
                        }
                    }

                    var newReachStr = '';
                    for(let str of item.reach){
                        if(str == ','){
                            newReachStr += "<br/>";
                        }else{
                            newReachStr += str;
                        };
                    };
                	$scope.userId = item.id;
                	$scope.detailRiverChiefName = item.rolename;
                	$scope.detailReachName = newReachStr;
                    $scope.searchRiverChief();
                	getPatrolData();
                	getRiverChiefData();
                	getEveList();
                };
				// 打开部件详情模态框
				$scope.showComponentDetail = function (id) {
					$('#componentDetail').modal('show');
				};
                //轮询函数
                var updateDataFunc = function(){
                    clearInterval(timer);
                    timer = setInterval(function(){
                        // treeInit();
                        leftStatusCount();
                        if($scope.checkRegionId && $scope.checkRegionId != ''){
                            rightStatusCount();
                        }
                        getRiverChiefTabData();
                    },10000);
                };
                //页面销毁前清除定时
                $scope.$on('$destroy', function () {
                    //清除service中定时器
                    // if(RiverChiefOnlineService.refreshDataTimer != null){
                    //     clearInterval(RiverChiefOnlineService.refreshDataTimer);
                    // }

                    clearInterval(timer);
                });
                $scope.eventImgUrl = $localStorage.serviceUrl_fileService;
                //问题点击函数
                $scope.eventClick = function(data){
                    $scope.map.infoWindow.hide();
                    //RiverChiefOnlineService.addEventGraphic(data);
                    $scope.evtDetails = data;
                };
                var mouseDownX;//记录鼠标点下时鼠标点X轴的位置
                var leftSlideW;//鼠标点下时左侧的宽度
                var mouseMoveX;//鼠标移动偏移量
                var flag = false;//判断鼠标点下和松开状态
                $('.dragDiv').mouseover(function(){
                    if($('#onlineChiefAside')[0].offsetWidth<=200){
                        $(this).css('cursor','e-resize');//当左边栏宽度不大于200时鼠标点显示向右的箭头
                    }else{
                        $(this).css('cursor','col-resize');//当左边栏宽度大于200时显示左右箭头
                    };
                    $(this).css('background','#428bca');//鼠标移动到改标签背景显示蓝色
                });
                $('.dragDiv').mouseleave(function(){
                     $('.dragDiv').css('background','#d9e4ee');//鼠标离开背景为边框色
                });
                $('.dragDiv').mousedown(function(e){
                    leftSlideW = $('#onlineChiefAside')[0].offsetWidth;//鼠标点下时记录左边栏宽度
                    mouseDownX = e.clientX;//鼠标点下时的x轴位置
                    flag = true;
                });
                $(document).mousemove(function(e){
                    if(flag){
                        mouseMoveX = e.clientX - mouseDownX;//记录鼠标移动的距离
                        if(mouseMoveX>0){//鼠标向右拖动
                            $('#onlineChiefAside').css({
                                width: leftSlideW + mouseMoveX + 'px' //鼠标拖动时左边栏的宽度
                            });
                            $('.container-tj').css({
                                left: leftSlideW + mouseMoveX + 'px'
                            });
                            $('.tree-body-btn').css({
                                left: leftSlideW + mouseMoveX + 'px'
                            });
                        }else{//鼠标向左拖动
                            if($('#onlineChiefAside')[0].offsetWidth >200){
                                if(leftSlideW + mouseMoveX>=200){
                                    $('#onlineChiefAside').css({
                                        width: leftSlideW + mouseMoveX + 'px'
                                    });
                                    $('.container-tj').css({
                                        left: leftSlideW + mouseMoveX + 'px'
                                    });
                                    $('.tree-body-btn').css({
                                        left: leftSlideW + mouseMoveX + 'px'
                                    });
                                };
                            };
                        };
                    };
                });
                $(document).mouseup(function(e){
                    flag = false;//鼠标松开取消拖动效果
                    $('.dragDiv').css('background','#d9e4ee');
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
                //关闭查看轨迹模态框点击问题
                $scope.closeCheckModal = function(){
                    RiverChiefOnlineService.clearRefreshInterval();
                    $('#checkCircle').modal('hide');
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
					// console.log(eventUrl2)
					$scope.before = eventUrl2.data.beforeAccessory;
                    $scope.after = eventUrl2.data.afterAccessory;
					// console.log($scope.before)
					$scope.$apply();
				});
                 //判断是否所有的值都相同的函数
                function attrOnly(array, attr){
    //              var first;
                    if(array.length>0){
                        //获取第一个元素的对应的属性
    //                  first = array[0][attr];
                        //都跟第一个元素做比对，只要有一个不对应，那说明不是唯一属性值了
                        return array.every(function(item){
                            if(item[attr] == true){
                                return true;
                            }else{
                                return false;
                            };
                            
                        });
                    };
                };
                var eventCheckArr=[];
                $scope.checkAll = false;
                $scope.eventTableCheck = function(ind){
                    if(ind == 'checkAll'){
                        $scope.checkAll = !$scope.checkAll;
                        if($scope.checkAll){
                            for(let i = 0;i<$scope.riverChiefEveList.length;i++){
                                $scope.riverChiefEveList[i].isCheck = true;
                            };
                            eventCheckArr = $scope.riverChiefEveList;
                        }else{
                            eventCheckArr = [];
                            for(let i = 0;i<$scope.riverChiefEveList.length;i++){
                                $scope.riverChiefEveList[i].isCheck = false;
                            };
                        };
                    }else{
                        $scope.riverChiefEveList[ind].isCheck = !$scope.riverChiefEveList[ind].isCheck;
                        eventCheckArr=[];
                        for(let c = 0; c<$scope.riverChiefEveList.length;c++){
                            if($scope.riverChiefEveList[c].isCheck == true){
                                eventCheckArr.push($scope.riverChiefEveList[c]);
                            };
                        };
                        $scope.checkAll = attrOnly(eventCheckArr,'isCheck');
                    };

                    //绘制问题
                    if($scope.riverChiefEveList[ind].isCheck){
                        RiverChiefOnlineService.addEventsByTableSelect(eventCheckArr);
                    }else {
                        var selectGraphic = $scope.riverChiefEveList[ind];
                        RiverChiefOnlineService.clearEventLayerBySelect(selectGraphic);
                    }
                };
                var patrolArr = [];
                var ids = [];
                $scope.checkPatrolAll = false;
                $scope.patrolCheck = function(ind){
                    if(ind == 'checkPatrolAll'){
                        $scope.checkPatrolAll = !$scope.checkPatrolAll;
                        if($scope.checkPatrolAll){
                            for(let i = 0;i<$scope.patrolList.length;i++){
                                $scope.patrolList[i].isCheck = true;
                            };
                            patrolArr = $scope.patrolList;
                        }else{
                            patrolArr = [];
                            for(let i = 0;i<$scope.patrolList.length;i++){
                                $scope.patrolList[i].isCheck = false;
                            };
                        };
                    }else{
                        $scope.patrolList[ind].isCheck = !$scope.patrolList[ind].isCheck;
                        patrolArr=[];
                        for(let c = 0; c<$scope.patrolList.length;c++){
                            if($scope.patrolList[c].isCheck == true){
                                patrolArr.push($scope.patrolList[c]);
                            };
                        };
                        $scope.checkAll = attrOnly(patrolArr,'isCheck');
                        
                    };
                    
                    //绘制勾选的历史轨迹
                    if($scope.patrolList[ind].isCheck){
                        //RiverChiefOnlineService.addGraphicByTableSelect(patrolArr);           //单条轨迹
                        RiverChiefOnlineService.addOneDayHistoryPatrolByTableSelect(patrolArr); //一天轨迹
                    }else {
                        var selectGraphic = $scope.patrolList[ind];
                        //RiverChiefOnlineService.clearHistoryPatrolLayerBySelect(selectGraphic);     //单条轨迹
                        RiverChiefOnlineService.clearOneDayHistoryPatrolLayerBySelect(selectGraphic); //一天轨迹
                    }
                };

                //获取点击的在线河长, 查询实时轨迹
                $rootScope.$on("evtDetail", function (evt, evtDetail) {
                    $('#myTab a[href="#riverChiefDetail"]').tab('show');
                    var newReachStr = '';
                    for(let str of evtDetail.attributes.reach){
                        if(str == ','){
                            newReachStr += "<br/>";
                        }else{
                            newReachStr += str;
                        };
                    };
                    $scope.userId = evtDetail.attributes.id;
                    $scope.detailRiverChiefName = evtDetail.attributes.rolename;
                    $scope.detailReachName = newReachStr;
                    getPatrolData();
                    getRiverChiefData();
                    getEveList();
                });
                //获取河长日志详情
                $scope.getChiefLogDetail = function(id){
                    $http({
                        method: 'GET',
                        url: $localStorage.serviceUrl_patrolMgr + '/v1/worklog/workLogDetail?logWorkId=' + id
                    }).success(function(res){
                        if(res.resCode == 1){
                            $scope.chiefLogDetail = res.data.logWorkInfo;
                        }
                    }).error(function(res){
                        
                    })
                };
                //查看日志附件
                $scope.getLogAccessory = function(id){
                    $http({
                        method: 'POST',
                        url: $localStorage.serviceUrl_patrolMgr + '/v1/logAccessory/list?workLogId=' + id
                    }).success(function(res){
                        if(res.resCode == 1){
                            var arr = res.data;
                            $scope.logImgArr = [];
                            $scope.mediaArr = [];
                            for(let i = 0;i< arr.length; i++){
                                if(arr[i].accessorytype == 2 || arr[i].accessorytype == 1){
                                    $scope.logImgArr.push(arr[i].accessoryurl);
                                }else{
                                    $scope.mediaArr.push(arr[i]);
                                }
                            }
                        }
                    }).error(function(res){
                        
                    })
                };
                //请求巡河时间及长度
                 $scope.getDisAndTime = function(id){
                    $http({
                        method: 'GET',
                        url: $localStorage.serviceUrl_patrolMgr + '/v1/resumption/totalTimeAndDistance?userId=' + id
                    }).success(function(res){
                        if(res.resCode == 1){
                            $scope.disAndTime = res.data;
                        }
                    }).error(function(res){
                        
                    })
                };
                //点击的地图中历史轨迹线, 显示详细信息窗口
                $rootScope.$on("historyPatrolDetail", function (evt, historyPatrolDetail) {
                    $scope.TraclEventDetail = true;
                    $scope.userId = historyPatrolDetail.attributes.userid;
                    $scope.evtDetails = historyPatrolDetail.attributes;
                    console.log($scope.evtDetails)
                    $scope.getChiefLogDetail(historyPatrolDetail.attributes.worklogid);
                    $scope.getLogAccessory(historyPatrolDetail.attributes.worklogid);
                    $scope.getDisAndTime(historyPatrolDetail.attributes.userid);
                    $scope.getPatrolEventDetail(historyPatrolDetail.attributes);
                    getRiverChiefData();
                    $scope.$apply();
                });
                //点击问题图标查看详情
                $rootScope.$on("evtDetail1", function (evt, evtDetail1) {
                    $scope.TraclEventDetail = false;
                    $scope.evtDetails = evtDetail1.attributes;
                    $scope.$apply();
                });
                
                //问题状态类型
                $scope.statusEvent = function(val){
                    var text = '';
                    var statusObj = {
                        A: "问题上报",
                        B1: "省级联络员派单",
                        B2: "市级联络员派单",
                        B3: "县级联络员派单",
                        B4: "镇级联络员派单",
                        B5: "村级联络员派单",
                        E1: "省级河长派单 ",
                        E2: "市级河长派单",
                        E3: "县级河长派单",
                        E4: "镇级河长派单",
                        E5: "村级河长派单",
                        H1: "省级河长确认",
                        H2: "市级河长确认",
                        H3: "县级河长确认",
                        H4: "镇级河长确认",
                        H5: "村级河长确认",
                        G1: "省级联络员反馈求助",
                        G2: "市级联络员反馈求助",
                        G3: "县级联络员反馈求助",
                        G4: "镇级联络员反馈求助",
                        G5: "工作人员反馈求助",
                        K1: "省级河长反馈求助",
                        K2: "市级河长反馈求助",
                        K3: "县级河长反馈求助",
                        K4: "镇级河长反馈求助",
                        K5: "工作人员反馈求助",
                        M1: "省级河长助理结案",
                        M2: "市级河长助理结案",
                        M3: "县级河长助理结案",
                        M4: "镇级河长助理结案",
                        F: "工作人员处理",
                        Z1: "省级河长确认结案",
                        Z2: "市级河长确认结案",
                        Z3: "县级河长确认结案",
                        Z4: "镇级河长确认结案",
                        Z5: "村级河长确认结案",
                        B: "受理",
                        C: "核实",
                        D: "确认",
                        E: "派单",
                        G: "已处理",
                        H: "审核",
                        I: "结案",
                        Z: "已结案",
                        X: "无效问题",
                        T: "事务锁定",
                        J1: "省级河长办审核",
                        J2: "市级河长办审核",
                        J3: "区级河长办审核",
                        J4: "镇级河长办审核",
                        J5: "村级河长办审核",
                        L1: "省级河长办处理",
                        L2: "市级河长办处理",
                        L3: "县级河长办处理",
                        L4: "镇级河长办处理",
                        L5: "村级河长办处理",
                    };
                    for (let key in statusObj) {
                        if(key == val){
                            text = statusObj[key];
                        };
                    };
                    return text;
                };
                $scope.getPatrolEventDetail = function(data){
                    $('#historyDetailModal').show();
                    $http({
                        method: 'GET',
                        url: $localStorage.serviceUrl_eventMgr + 'v1/event/findReachDTOWithEvent',
                        params:{
                            reportPersonId: data.userid,
                            startTime: data.startTime,
                            endTime: data.endTime
                        },
                    }).success(function(res){
                        $('#historyDetailModal').modal('show');
                        $scope.patrolModalList = res.data;
                        console.log(res);
                    })
                };
                $scope.closeHisModal = function(){
                    $('#historyDetailModal').modal('hide');
                };
                // 点击查看进入问题详情页面
                $scope.goEventDetail = function(data){
                    $scope.evtDetails = data;
                    $('#historyDetailModal').modal('hide');
                    $('#eventDetailModal').modal('show');
                };
                //点击关闭问题模态框
                $scope.closeEveModal = function(){
                    $('#eventDetailModal').modal('hide');
                    if($scope.TraclEventDetail == true){
                        $('#historyDetailModal').modal('show');
                        $scope.TraclEventDetail = false;
                    };
                    
                };
                // 音视频播放
                // $scope.play = function(item){
                //     $('#videoPlayerBox').show();
                //     $scope.videoUrl = $scope.eventImgUrl + item.url;
                // }
                
            }
        ]);
})(window, angular);