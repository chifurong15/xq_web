(function (window, angular) {
    'use strict';

    var app = angular.module("app");
    app.filter("trustHtml", function ($sce) {
        return function (input) {
            return $sce.trustAsHtml(input);
        }
    })

    app.controller(
        'mainBodyCtrl', [
            '$sce',
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
            'SymbolUtil',
            'queryAdminregion',
            'UtilityTool',
            'WorkbenchService',
            '$ajaxhttp',
            'moduleService',
            function mainBodyCtrl($sce,$localStorage, $scope, $location, $log, $q, $rootScope, globalParam, $window, routeService, $http,
                                  wish, esriApiDeps, tiandituFactory, MapTool, MapUtil, SymbolUtil, queryAdminregion, UtilityTool, WorkbenchService, $ajaxhttp, moduleService) {

                var apiPrefix = moduleService.getServiceUrl() + '/bulletin';
                var apiPrefix1 = moduleService.getServiceUrl() + '/resumption';

                var promise = esriApiDeps.query();
                var w = wish.get();
                $scope.showImg = false;
                // 初始化
                $scope.eventImgUrl = $localStorage.serviceUrl_fileService;
                $scope.init = function () {
                    //gis模块初始化
                    MapTool.init($scope.map);
                    MapUtil.init($scope.map);
                    SymbolUtil.init($scope.map);
                    queryAdminregion.init($scope.map);
                    WorkbenchService.init($scope.map, "workbenchLayer");

                    //自适应图表
                    chartContainer();
                    /*当前巡河数据*/
                    patrolCount();
                    /*行政区域*/
                    regionList();
                    getBulletin();
                    getDate();
                    getCountHZOnline();
                    getProblem();
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

                $scope.mainBodyBtn = function () {
                };

                // 全屏操作
                $scope.fullScreen = function () {
                    var el = document.getElementById("map");

                    // Supports most browsers and their versions.
                    var requestMethod = el.requestFullScreen || el.webkitRequestFullScreen
                        || el.mozRequestFullScreen || el.msRequestFullScreen;

                    if (requestMethod) {

                        // Native full screen.
                        requestMethod.call(el);

                    } else if (typeof window.ActiveXObject !== "undefined") {

                        // Older IE.
                        var wscript = new ActiveXObject("WScript.Shell");

                        if (wscript !== null) {
                            wscript.SendKeys("{F11}");
                        }
                    }

                    $('#fullScreen').css("display", "none");
                    $('#exitScreen').css("display", "block");

                }

                //退出全屏
                $scope.exitScreen = function () {
                    if (document.exitFullscreen) {
                        document.exitFullscreen();
                    }
                    else if (document.mozCancelFullScreen) {
                        document.mozCancelFullScreen();
                    }
                    else if (document.webkitCancelFullScreen) {
                        document.webkitCancelFullScreen();
                    }
                    else if (document.msExitFullscreen) {
                        document.msExitFullscreen();
                    }
                    if (typeof cfs != "undefined" && cfs) {
                        cfs.call(el);
                    }
                    $('#fullScreen').css("display", "block");
                    $('#exitScreen').css("display", "none");
                }

                //ie低版本的全屏，退出全屏都这个方法
                function iefull() {
                    var el = document.documentElement;
                    var rfs = el.msRequestFullScreen;
                    if (typeof window.ActiveXObject != "undefined") {
                        //这的方法 模拟f11键，使浏览器全屏
                        var wscript = new ActiveXObject("WScript.Shell");
                        if (wscript != null) {
                            wscript.SendKeys("{F11}");
                        }
                    }
                }
                $scope.isShow1 = true;
                $scope.isShow2 = true;
                $scope.isShow3 = true;
                $scope.isShow4 = true;
                $scope.isShow5 = true;
                //$scope.isSelected = false;
                $scope.tab1 = function () {
                    $scope.isShow1 = !$scope.isShow1 ;
                    //$scope.isSelected = true;
                    //$('#accordion1 .panel-heading').find('h4').addClass('panel-active').parent().parent().siblings().find('h4').removeClass('panel-active')
                }
                $scope.tab2 = function () {
                    $scope.isShow2 = !$scope.isShow2 ;
                }
                $scope.tab3 = function () {
                    $scope.isShow3 = !$scope.isShow3 ;
                    //$('#accordion2 .panel-heading').find('h4').addClass('panel-active').parent().parent().siblings().find('h4').removeClass('panel-active')
                }
                $scope.tab4 = function () {
                    $scope.isShow4 = !$scope.isShow4 ;
                }
                $scope.tab5 = function () {
                    $scope.isShow5 = !$scope.isShow5 ;
                }

                /**
                 * 左侧底部图表自适应
                 */
                function chartContainer() {
                    var _outH = $('#mainBody').outerHeight(true);
                    // console.log(_outH)
                    var _weatH = $('#weather').outerHeight(true);
                    // console.log(_weatH)
                    var _newsH = $('#news-l').outerHeight(true);
                    // console.log(_newsH)
                    var _reachH = $('#reach-table').outerHeight(true);
                    // console.log(_reachH)
                    var _mapH = $('#mid-map').outerHeight(true);
                    // console.log(_mapH)
                    var _rankH = $('#rank').outerHeight(true);
                    // console.log(_rankH)
                    var _cityRankH = $('#cityRank').outerHeight(true);
                    // console.log(_cityRankH)

                    var chartHeight = _outH - _weatH - _newsH - _reachH - 60;
//	                $('#main').css('height', chartHeight);

                    var patrolHeight = _outH - _mapH - 10;
//	                $('#patrol-num').css('height', patrolHeight);

                    var checkHeight = _outH - _rankH - _cityRankH - 10;
//	                $('#check-active').css('height', checkHeight);

                    var rNewsHeight = checkHeight - 100;
//	                $('#right-news-content').css('height', rNewsHeight);

                }

                window.onresize = function () {
                    chartContainer();
                }

                /*当前巡河人数统计*/
                function patrolCount() {

                    $http({
                        // url: "http://117.8.229.5:9000/chairmanOnline/v1/patrolCount",
                        url: $localStorage.serviceUrl_chiefOnline + '/chairmanOnline/v1/patrolCount',
                        method: 'get'
                    }).success(function (res) {
                        if (res.resCode == 1) {
                            $scope.itemlist = res.data;
                        }
                    }).error(function (res) {
                        layer.msg('服务器异常，请稍后再试');
                    });

                }

                /*行政区划*/
                function regionList() {
                    $http({
                        // url: "http://117.8.229.5:9000/chairmanOnline/v1/regionArea",
                        url: $localStorage.serviceUrl_chiefOnline + '/chairmanOnline/v1/regionArea',
                        method: 'get'
                    }).success(function (res) {
                        if (res.resCode == 1) {
                            $scope.regionlist = res.data;
                            var regionID = $scope.regionlist[0].id;
                            rightStatusCount(regionID);
                        }
                    }).error(function (res) {
                        layer.msg('服务器异常，请稍后再试');
                    });

                }

                //页面销毁前清除定时
                $scope.$on('$destroy', function () {
                    //清除service中定时器
                    if (WorkbenchService.refreshDataTimer !== null) {
                        clearInterval(WorkbenchService.refreshDataTimer);
                    }

                    //clearInterval(timer);
                });

                /*行政区划切换*/
                var regionId, regionName, regionGrade, regionLng, regionLat, regionSpatialData;
                $scope.regionChange = function (region) {
                    if (region) {
                        regionId = region.id;
                        regionName = region.name;
                        regionGrade = region.grade;
                        regionLat = region.latitude;
                        regionLng = region.longitude;
                        regionSpatialData = region.spatialData;
                    }

                    if (MapTool.getflashingTimer !== null) {
                        MapTool.clearflashingTimer();
                    }

                    if (region === null) {
                        console.warn("clickRegion is null");
                        return;
                    }
                    //节点点击定位
                    if (region && MapUtil.isCoordValid(region["longitude"], region["latitude"])) {
                        if (region["grade"] !== null) {
                            MapUtil.center2LongLat(region["longitude"], region["latitude"], region["grade"]);
                            if (region["spatialData"] && region["spatialData"] !== null && region["spatialData"] !== "") {
                                WorkbenchService.addParentGraphic(region["spatialData"], true);
                            } else {
                                WorkbenchService.clearReginLayer();
                                console.warn("spatialData is null");
                            }

                        }
                    } else {
                        console.error("无效坐标");
                        alert("定位失败！无经纬度信息...");
                    }

                };


                /*巡河、在线数据*/
                function rightStatusCount(id) {
                    $http({
                        url: $localStorage.serviceUrl_chiefOnline + '/chairmanOnline/v1/countHZStatus/' + id,
                        method: 'get'
                    }).success(function (res) {
                        if (res.resCode == 1) {
                            $scope.rightStausCount = res.data;
                        }
                    });
                };

                // 调查报告
                function getBulletin() {
//					$ajaxhttp.myhttp({
//						url: apiPrefix + '/v1/bulletin/selectByFirst?type=1',
//						method: 'get',
//						callBack: function (res){
//							$scope['bulletin1'] = res;
//						}
//					});
//					$ajaxhttp.myhttp({
//						url: apiPrefix + '/v1/bulletin/selectByFirst?type=2',
//						method: 'get',
//						callBack: function (res){
//							console.log(res);
//							$scope.bulletin2 = res;
//						}
//					});
//					$ajaxhttp.myhttp({
//						url: apiPrefix + '/v1/bulletin/selectByFirst?type=3',
//						method: 'get',
//						callBack: function (res){
//							$scope['bulletin3'] = res;
//						}
//					});
//					$ajaxhttp.myhttp({
//						url: apiPrefix + '/v1/bulletin/selectByFirst?type=4',
//						method: 'get',
//						callBack: function (res){
//							$scope['bulletin4'] = res;
//						}
//					});
                    //暗查暗访
                    $http({
                        url: apiPrefix + '/v1/bulletin/selectByFirst?type=1',
                        method: 'get'
                    }).success(function (res) {
                        $scope.bulletin1 = res;
                    });
                    //工作动态
                    $http({
                        url: apiPrefix + '/v1/bulletin/selectByFirst?type=2',
                        method: 'get'
                    }).success(function (res) {
                        $scope.bulletin2 = res;
                    });
                    //工作简报
                    $http({
                        url: apiPrefix + '/v1/bulletin/selectByFirst?type=3',
                        method: 'get'
                    }).success(function (res) {
                        $scope.bulletin3 = res;
                    });
                    //考核通报
                    $http({
                        url: apiPrefix + '/v1/bulletin/selectByFirst?type=4',
                        method: 'get'
                    }).success(function (res) {
                        $scope.bulletin5 = res;
                    });

                    //督导检查
                    $http({
                        url: apiPrefix + '/v1/bulletin/selectByFirst?type=5',
                        method: 'get'
                    }).success(function (res) {
                        $scope.bulletin4 = res;
                    });
                }

                // 天气日期
                function getDate() {
                    setInterval(function () {
                        var date = new Date(),
                            year = date.getFullYear(),
                            month = date.getMonth() + 1,
                            day = date.getDate(),
                            hour = date.getHours(),
                            min = date.getMinutes(),
                            second = date.getSeconds();

                        $scope.$apply(function () {
                            $scope.weatherDate = {
                                year: year,
                                month: month,
                                day: day,
                                hour: hour < 10 ? '0' + hour : hour,
                                min: min < 10 ? '0' + min : min,
                                second: second < 10 ? '0' + second : second
                            }
                        })
                    }, 1000);
                }

                // 巡河总数
                function getCountHZOnline() {

                    $ajaxhttp.myhttp({
                        // url: 'http://117.8.229.5:9000/chairmanOnline/v1/countHZOnline',
                        url: $localStorage.serviceUrl_chiefOnline + '/chairmanOnline/v1/countHZOnline',
                        method: 'get',
                        callBack: function (res) {
                            if (res.resCode == 1) {
                                $scope.countHZOnline = res.data;
                            }
                        }
                    });
                    /*$scope.countHZOnline = {
                        townTotal: 20,
                        villageTotal: 12,
                        cityCount: 81,
                        countyCount: 2,
                        villageCount: 3,
                        countyTotal: 9,
                        cityTotal: 8,
                        townCount: 11
                    }*/
                }

                // 通报预览
                $scope.viewBulletin = function (id) {
                    globalParam.setter({
                        bulletin: {
                            id: id
                        }
                    })
                    getData(id);
                    $('#myModal').modal('show');
                }

                // 数据详情
                function getData(id) {
                    $ajaxhttp.myhttp({
                        url: apiPrefix + '/v1/bulletin/detail',
                        method: 'get',
                        params: {
                            id: id
                        },
                        callBack: function (res) {
                            $scope.bulletin = res.data;
                            //var attandNamePart = res.data.attandUrl.split('_');
                            if($scope.bulletin.detail){
                                $scope.bulletin.detail = $sce.trustAsHtml($scope.bulletin.detail)
                            }
                            if($scope.bulletin.ren){
                                var i = $scope.bulletin.ren.indexOf('.');
                                var str = $scope.bulletin.ren.slice(i+1);
                                // console.log(str)
                                if(str.toLowerCase() == 'jpg' || str.toLowerCase() == 'jpeg' || str.toLowerCase() == 'png'){
                                    $scope.showImg = true;
                                }else{
                                    $scope.showImg = false;
                                    var options = {
                                        pdfOpenParams: {
                                            pagemode: "thumbs",
                                            navpanes: 0,
                                            toolbar: 0,
                                            statusbar: 0,
                                            view: "FitV"
                                        }
                                    };
                                    PDFObject.embed($scope.bulletin.attand_url, "#pdfOb", options);
                                }
                            }
                        }
                    })
                }

                function getProblem() {
                    $http({
                        url: apiPrefix1 + '/v1/resumption/listWithMoreProblemReach',
                        method: 'get'
                    }).success(function (res) {
                        $scope.problemList = res.data;
                    }).error(function (error) {

                    })
                }

                $scope.closeModal = function () {
                    $('#myModal').modal('hide');
                }

            }
        ]);

})(window, angular);