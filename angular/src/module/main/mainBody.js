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
            function mainBodyCtrl($localStorage, $scope, $location, $log, $q, $rootScope, globalParam, $window, routeService, $http,
                                  wish, esriApiDeps, tiandituFactory, MapTool, MapUtil, SymbolUtil, queryAdminregion, UtilityTool, WorkbenchService, $ajaxhttp, moduleService) {
				
				var promise = esriApiDeps.query();
                var w = wish.get();
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
                }
				
				/**
				 * 左侧底部图表自适应
				 */
                function chartContainer () {
                	var _outH = $('#mainBody').outerHeight(true);
                	console.log(_outH)
                	var _weatH = $('#weather').outerHeight(true);
                	console.log(_weatH)
                	var _newsH = $('#news-l').outerHeight(true);
                	console.log(_newsH)
                	var _reachH = $('#reach-table').outerHeight(true);
                	console.log(_reachH)
                	var _mapH = $('#mid-map').outerHeight(true);
                	console.log(_mapH)
                	var _rankH = $('#rank').outerHeight(true);
                	console.log(_rankH)
                	var _cityRankH = $('#cityRank').outerHeight(true);
                	console.log(_cityRankH)
                	
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
				function patrolCount (){

					$http({
						url: "http://10.0.9.248:51000/chairmanOnline/v1/patrolCount",
						method: 'get'
					}).success( function(res) {
							console.log(res)
						if(res.resCode == 1) {
							console.log(res)
							$scope.itemlist = res.data;
						}
					}).error(function(res) {
						layer.msg('服务器异常，请稍后再试');
					});

				}

				/*行政区划*/
				function regionList (){
					$http({
						url: "http://10.0.9.248:51000/chairmanOnline/v1/regionArea",
						method: 'get'
					}).success( function(res) {
							console.log(res)
						if(res.resCode == 1) {
							console.log(res)
							$scope.regionlist = res.data;
							var regionID = $scope.regionlist[0].id;
							rightStatusCount(regionID);
						}
					}).error(function(res) {
						layer.msg('服务器异常，请稍后再试');
					});

				}

                //页面销毁前清除定时
                $scope.$on('$destroy', function () {
                     //清除service中定时器
                     if(WorkbenchService.refreshDataTimer !== null){
                         clearInterval(WorkbenchService.refreshDataTimer);
                     }

                    //clearInterval(timer);
                });

				/*行政区划切换*/
				var regionId,regionName,regionGrade,regionLng,regionLat,regionSpatialData;
				$scope.regionChange = function(region){
					if(region){
						regionId = region.id;
						regionName = region.name;
						regionGrade = region.grade;
						regionLat = region.latitude;
						regionLng = region.longitude;
						regionSpatialData = region.spatialData;
					}

					if(MapTool.getflashingTimer !== null){
                        MapTool.clearflashingTimer();
                    }

                    if(region === null){
					    console.warn("clickRegion is null");
					    return;
                    }
                    //节点点击定位
                    if(region && MapUtil.isCoordValid(region["longitude"],region["latitude"])){
                        if(region["grade"] !==null){
                            MapUtil.center2LongLat(region["longitude"],region["latitude"],region["grade"]);
                            if(region["spatialData"] && region["spatialData"] !== null && region["spatialData"] !== ""){
                                WorkbenchService.addParentGraphic(region["spatialData"], true);
                            }else {
                                WorkbenchService.clearReginLayer();
                                console.warn("spatialData is null");
                            }

                        }
                    }else{
                        console.error("无效坐标");
                        alert("定位失败！无经纬度信息...");
                    }

				};


				/*巡河、在线数据*/
				function rightStatusCount (id){
					$http({
	                	url: $localStorage.serviceUrl_chiefOnline + '/chairmanOnline/v1/countHZStatus/' + id,
	                	method: 'get'
	                }).success(function(res){
	                	if(res.resCode == 1){
	                		$scope.rightStausCount = res.data;
	                	}
	                });
				};
				
				// 调查报告
				function getBulletin () {
					$ajaxhttp.myhttp({
						url: moduleService.getServiceUrl() + '/v1/bulletin/selectByFirst?type=1',
						method: 'get',
						callBack: function (res){
							$scope['bulletin1'] = res.data;
						}
					});
					$ajaxhttp.myhttp({
						url: moduleService.getServiceUrl() + '/v1/bulletin/selectByFirst?type=2',
						method: 'get',
						callBack: function (res){
							$scope['bulletin2'] = res.data;
						}
					});
					$ajaxhttp.myhttp({
						url: moduleService.getServiceUrl() + '/v1/bulletin/selectByFirst?type=3',
						method: 'get',
						callBack: function (res){
							$scope['bulletin3'] = res.data;
						}
					});
					$ajaxhttp.myhttp({
						url: moduleService.getServiceUrl() + '/v1/bulletin/selectByFirst?type=4',
						method: 'get',
						callBack: function (res){
							$scope['bulletin4'] = res.data;
						}
					});
				}
				// 天气日期
				function getDate () {
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

            }
        ]);

})(window, angular);