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

                    //获取登录用户信息
                    getLoginUserInfo();
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
                
                
				var apiPrefix = $localStorage.gwUrl + '/bulletin';
				var apiPrefix1 = $localStorage.gwUrl + '/resumption';

                /*var region = {
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
                tiandituFactory.initTianditu($scope.map, region);*/

                //getLoginUserInfo();
                //获取登录用户信息
                function getLoginUserInfo(){
                    $http({
						url: $localStorage.serviceUrl_information + '/v1/administrativeRegion/list',
                        method: 'get',
                        params: {
                            areaCode: $localStorage.userLoginInfo.userInfo.regionId //=> main.js
                        }
                    }).success( function(res) {
                        if(res.data && res.resCode == 1) {
							$scope.LoginUserInfo = res.data.list[0];
							var region = $localStorage.userLoginInfo.userInfo;
							// region.id = region.regionId;
							// console.log(region.id)
							//$scope.regionChange($localStorage.userLoginInfo.userInfo.regionId);
                            $scope.regionChange(region.regionId);
                            //selectRegion($localStorage.userLoginInfo.userInfo.regionId);
                        }else {
                        	layer.msg('没有返回登录用户信息！');
                        }
                    }).error(function(res) {
                        layer.msg('登录用户信息查询失败！');
                    });
				}

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

                function loadGisModuls(){
                    MapTool.init($scope.map);
                    MapUtil.init($scope.map);
                    SymbolUtil.init($scope.map);
                    queryAdminregion.init($scope.map);
                    WorkbenchService.init($scope.map, "workbenchLayer");

				}

				function selectRegion(regionId){
                    $scope.regionChange(regionId);
				}

                $scope.mainBodyBtn = function () {
                }
				
				/**
				 * 左侧底部图表自适应
				 */
                function chartContainer () {
                	var _outH = $('#mainBody').outerHeight(true);
                	var _weatH = $('#weather').outerHeight(true);
                	var _newsH = $('#news-l').outerHeight(true);
                	var _reachH = $('#reach-table').outerHeight(true);
                	var _mapH = $('#mid-map').outerHeight(true);
                	var _rankH = $('#rank').outerHeight(true);
                	var _cityRankH = $('#cityRank').outerHeight(true);
                	
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
						url: $localStorage.serviceUrl_chiefOnline + "/chairmanOnline/v1/patrolCount",
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
						url: $localStorage.serviceUrl_chiefOnline + "/chairmanOnline/v1/regionArea",
						method: 'get'
					}).success( function(res) {
						if(res.resCode == 1) {
							$scope.regionlist = res.data;
							$scope.region ={
								id:$scope.LoginUserInfo.id
							} 
							var regionID = $scope.regionlist[0].id;
							rightStatusCount(regionID);
						}
					}).error(function(res) {
						layer.msg('获取列表失败，请稍后再试');
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
				$scope.regionChange = function(regionId){
					console.log(regionId)
					if(regionId == null) {
						return;
					}
					$http({
						url: $localStorage.serviceUrl_information + '/v1/administrativeRegion/list',
                        method: 'get',
                        params: {
                             areaCode: regionId
                        }
                    }).success( function(res) {
                        if(res.data && res.resCode == 1) {
                    		var region = res.data.list[0];
                    		console.log(region)
							regionId = region.id;
							regionName = region.name;
							regionGrade = region.grade;
							regionLat = region.latitude;
							regionLng = region.longitude;
							regionSpatialData = region.spatialData;
		
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
                        }else {
                            layer.msg('没有返回登录用户信息！');
						}
                    }).error(function(res) {
                        layer.msg('登录用户信息查询失败！');
                    });
					
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
					$http({
	                	url: apiPrefix + '/v1/bulletin/selectByFirst?type=1',
	                	method: 'get'
	                }).success(function(res){
						$scope.bulletin1 = res;
	                });
					$http({
	                	url: apiPrefix + '/v1/bulletin/selectByFirst?type=2',
	                	method: 'get'
	                }).success(function(res){
						$scope.bulletin2 = res;
	                });
					$http({
	                	url: apiPrefix + '/v1/bulletin/selectByFirst?type=3',
	                	method: 'get'
	                }).success(function(res){
						$scope.bulletin3 = res;
	                });
					$http({
	                	url: apiPrefix + '/v1/bulletin/selectByFirst?type=4',
	                	method: 'get'
	                }).success(function(res){
						$scope.bulletin4 = res;
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
				
				
				// 巡河总数
				function getCountHZOnline () {
					
					$ajaxhttp.myhttp({
//						url: 'http://10.0.9.248:51000/chairmanOnline/v1/countHZOnline',
						url: $localStorage.serviceUrl_chiefOnline +  '/chairmanOnline/v1/countHZOnline',
						method: 'get',
						callBack: function (res) {
		                	if(res.resCode == 1){
		                		$scope.countHZOnline = res.data;
		                	}
						}
					});
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
				function getData (id) {
					$ajaxhttp.myhttp({
						url: apiPrefix + '/v1/bulletin/detail',
						method: 'get',
						params: {
							id: id
						},
						callBack: function (res) {
							var attandNamePart = res.data.attandUrl.split('_');
							$scope.bulletin = res.data;
							$scope.attandName = attandNamePart.splice(1, attandNamePart.length - 1).join('');
						}
					})
				}
				
				function getProblem(){
					$http({
						url: apiPrefix1 + '/v1/resumption/listWithMoreProblemReach',
						method: 'get'
					}).success(function(res){
						$scope.problemList=res.data;
						console.log('222',$scope.problemList)
					}).error(function (error) {
	
	                })
				}				
				
				$scope.closeModal = function () {
					$('#myModal').modal('hide');
				}

            }
        ]);

})(window, angular);