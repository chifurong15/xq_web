(function (window, angular) {
    'use strict';

    var app = angular.module("app");
    app.filter("trustHtml", function ($sce) {
        return function (input) {
            return $sce.trustAsHtml(input);
        }
    })

    app.controller(
        'eventMgrCtrl', [
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
            "queryAdminregion",
            'EventService',
            function eventMgrCtrl($localStorage, $scope, $location, $log, $q, $rootScope, globalParam, $window, routeService, $http,
                                  esriApiDeps, wish, tiandituFactory, MapTool, MapUtil, queryAdminregion, EventService) {

                var promise = esriApiDeps.query();
                var w = wish.get();
                // 初始化
                $scope.eventImgUrl = $localStorage.serviceUrl_fileService;
                $scope.init = function () {
                    $('#navbarBtn').show();
                	//gis模块初始化
                    MapTool.init($scope.map);
                    MapUtil.init($scope.map);
                    queryAdminregion.init($scope.map);
                    EventService.init($scope.map, "eventServiceLayer");
                	//初始化变量
                	$scope.regionId =''; 
                	$scope.regionGrade ='';
                	$scope.types_change ='';
                	$scope.status_change ='';
                	//初始化专题管理 => 问题类型
					eventTypesData();
                	//初始化专题管理 => 问题状态
					eventStatusData();
					//初始化表格数据
					initTableData();
					//自适应模态框
					modalContainer();
					$scope.regionId = $localStorage.userLoginInfo.userInfo.regionId;
                    regionTreeList();
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

                $scope.types = [
                    {num: 1, style: 'normal', "background-position": "0 0"},
                    {num: 2, style: 'earth', "background-position": "0 -60px"}
                ];

                //资源图切换
                $scope.changeMapResource = function(resourceType){
                    if(resourceType == 'imgAnno'){
                        MapTool.controlLayerVisible("cia", true);
                    }else {
                        MapTool.controlLayerVisible("cva", true);
                    }
				};

                //地图切换
                $scope.showMapTypes = function (style) {
                    $scope.selected = style;

                    if(style == 'earth'){
                        MapTool.controlLayerVisible("img", true);
                    }else {
                        MapTool.controlLayerVisible("vec", true);
                    }
                };

                /**
                 * 行政区划树
                 */
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
                    }).success(
                    function (resp) {
                        console.log(resp);
                        treeNode_find = treeNode.id;
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
//                      url: $localStorage.serviceUrl_reachTree + '/reachTreeNodesController/findReachNodesByCondition',
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
                }

                //河道树加载
                function reachTreeLoading() {
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
				
				//时间选择
                var datepicker1 = $('#beginTime').datetimepicker({
			        format: 'YYYY-MM-DD',
			        locale: moment.locale('zh-cn')
			    }).on('dp.change', function (e) {
			        var result = new moment(e.date).format('YYYY-MM-DD');
			        $scope.beginTime = result;
			        $scope.$apply();
    			});
    			
    			var datepicker2 = $('#endTime').datetimepicker({
			        format: 'YYYY-MM-DD',
			        locale: moment.locale('zh-cn')
			    }).on('dp.change', function (e) {
			        var result = new moment(e.date).format('YYYY-MM-DD');
			        $scope.endTime= result;
			        $scope.$apply();
			    });
 				
 				//动态设置最小值
				datepicker1.on('dp.change', function (e) {
			        datepicker2.data('DateTimePicker').minDate(e.date);
			    });
			    //动态设置最大值
			    datepicker2.on('dp.change', function (e) {
			        datepicker1.data('DateTimePicker').maxDate(e.date);
			    });
				
				//问题类型
				function eventTypesData (){
					$http({
						method: 'get',
						url: $localStorage.serviceUrl_eventMgr + 'v1/event/getEventTypes'
					}).success(function(res){
						console.log(res)
						if(res.resCode == 1){
							$scope.typeList = res.data;;
						}
					}).error(function(res){
						console.log(res)
					})
				}
				
				//问题类型切换
				$scope.type_Change = function(types){
					$scope.types_change = types;
					console.log($scope.types_change)
				}
				
				//问题状态
				function eventStatusData (){
					$http({
						method: 'get',
						url: $localStorage.serviceUrl_eventMgr + 'v1/event/getEheventStatus'
					}).success(function(res){
						console.log(res)
						if(res.resCode == 1){
							$scope.statusList = res.data;
						}
					}).error(function(res){
						console.log(res)
					})
				}
				
				//问题状态切换
				$scope.status_Change = function(status){
					$scope.status_change = status;
					console.log($scope.status_change)
				}
				
				//搜索
				$scope.eventSearchFuc = function(){
					$scope.regionGrade = $scope.regionGrade+"";
					initTableData();
				}
				
				//初始化表格数据
				function initTableData (){
					$http({
						method: 'get',
						url: $localStorage.serviceUrl_eventMgr + 'v1/event/queryEventByReachOrRegion',
						params:{
//							regionId:$scope.regionId,
//							regionLevel:$scope.regionGrade,
							regionId:'',
							regionLevel:'',
							reachId:'',
							reachLevel:'',
							reportPersonId:'',
							type:$scope.types_change,
							status:$scope.status_change,
							startTime:$scope.beginTime,
							endTime:$scope.endTime
						}
					}).success(function(res){
						$scope.eventCount = '';
						console.log(res)
						if(res.resCode == 1){
							$scope.eventList = res.data;
							if($scope.eventList.length > 0){
                                EventService.addGraphic($scope.eventList);
                                initCountTableData();
							}
						}else{
                                $scope.eventCount = '';
						}
					}).error(function(res){
                                $scope.eventCount = '';
								console.log(res)
					})
				}
				
				//表格高度
				var bdH = document.body.offsetHeight;
				document.getElementById("infoCon-tj").style.height = bdH - 54 +"px";
				var rSearchH = document.getElementById("r-search").offsetHeight;
				var rSearchFormH = document.getElementById("r-search-form").offsetHeight;
				var trH = document.getElementById("tr-height").offsetHeight;
				var tbHeight = bdH - rSearchH - rSearchFormH - trH - 200;
				document.getElementById("tbodyHeight").style.maxHeight = tbHeight +"px";
				//初始化表格记录
				function initCountTableData (){
					$http({
						method: 'get',
						url: $localStorage.serviceUrl_eventMgr + 'v1/event/queryCountEventByReachOrRegion',
						params:{
//							regionId:$scope.regionId,
//							regionLevel:$scope.regionGrade,
							regionId:'',
							regionLevel:'',
							reachId:'',
							reachLevel:'',
							reportPersonId:'',
							type:$scope.types_change,
							status:$scope.status_change,
							startTime:$scope.beginTime,
							endTime:$scope.endTime
						}
					}).success(function(res){
						console.log(res)
						if(res.resCode == 1){
							$scope.eventCount = res.data;
						}
					}).error(function(res){
						console.log(res)
					})
				}
				
				//列表点击
				$scope.itemClick = function(item){
					console.log(item)
					if(MapUtil.isCoordValid(item["longitude"],item["latitude"])){
                        EventService.locateToStation(item["id"]);
					}else{
						console.log("无效坐标");
                        alert("无坐标信息");
					}

				}
				
				//自适应模态框
				var modalContainer = function () {
	                var drainageWrapperH = document.body.offsetHeight;
	                var drainageWrapperW = document.body.offsetWidth;
	                console.log(drainageWrapperW)
	                console.log(drainageWrapperH)
//	                document.getElementById("remarkModalPanel").style.height = drainageWrapperH - 120 +"px";
	                document.getElementById("remarkPanel").style.width = drainageWrapperW - 650 +"px";
	                document.getElementById("remarkPanel").style.marginTop =  - ((drainageWrapperH/2)- 120)  +"px";
	                document.getElementById("remarkPanel").style.marginLeft = - ((drainageWrapperW/2)- 280) +"px";
                }
				
				window.onresize = function () {
                    modalContainer();
                }
				
				//查看详情
				$rootScope.$on("evtDetail1", function (evt, evtDetail1) {
					console.log(evtDetail1)
					$scope.evtDetails = evtDetail1.attributes;
					$scope.$apply();
				});
				
				//查看图片详情
				$rootScope.$on("eventUrl1", function (evt, eventUrl1) {
					console.log(eventUrl1)
					$scope.before = eventUrl1.data.beforeAccessory;
					$scope.after = eventUrl1.data.afterAccessory;
					console.log($scope.before)
					$scope.$apply();
				});
				//问题流转
				$rootScope.$on("evtItem1", function (evt, evtItem1) {
					console.log(evtItem1)
					if(evtItem1.resCode===1){
						$scope.evetData = evtItem1.data;
					}
					$scope.$apply();
				});
				
				//领导批示
				$rootScope.$on("comment1", function (evt, comment1) {
					console.log(comment1)
					if(comment1.resCode===1){
						$scope.commentData = comment1.data;
					}
					$scope.$apply();
				});
				
				//查看详情
				$rootScope.$on("evtDetail2", function (evt, evtDetail2) {
					console.log(evtDetail2)
					$scope.evtDetails = evtDetail2.attributes;
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
				
				//问题流转
				$rootScope.$on("evtItem2", function (evt, evtItem2) {
					console.log(evtItem2)
					if(evtItem2.resCode===1){
						$scope.evetData = evtItem2.data;
					}
					$scope.$apply();
				});
				
				//领导批示
				$rootScope.$on("comment2", function (evt, comment2) {
					console.log(comment2)
					if(comment2.resCode===1){
						$scope.commentData = comment2.data;
					}
					$scope.$apply();
				});
				
				//打印模态框
				$scope.printModal = function($event,item){
					$event.stopPropagation();   //stopPropagation是目前最常用也是最标准的解决问题冒泡的方法
					console.log(item)
					$scope.printDetail = item;
					setTimeout(function(){
						$("#printPanel").jqprint({
						     debug: true, //如果是true则可以显示iframe查看效果（iframe默认高和宽都很小，可以再源码中调大），默认是false
						     importCSS: true, //true表示引进原来的页面的css，默认是true。（如果是true，先会找$("link[media=print]")，若没有会去找$("link")中的css文件）
						     printContainer: true, //表示如果原来选择的对象必须被纳入打印（注意：设置为false可能会打破你的CSS规则）。
						     operaSupport: false//表示如果插件也必须支持歌opera浏览器，在这种情况下，它提供了建立一个临时的打印选项卡。默认是true
						});
					},0)
				}
				
            }
        ]);

})(window, angular);