(function (window, angular) {
    'use strict';

    var app = angular.module("app");
    app.filter("trustHtml", function ($sce) {
        return function (input) {
            return $sce.trustAsHtml(input);
        }
    });
    app.controller(
        'patrolMgtCtrl', [
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
			'$ajaxhttp',
			'moduleService',
            'esriApiDeps',
            'wish',
            'tiandituFactory',
            'MapUtil',
            'SymbolUtil',
            'GeometryUtil',
            'MapTool',
            function patrolMgtCtrl($localStorage, $scope, $location, $log, $q, $rootScope, globalParam, $window, routeService, $http, $ajaxhttp, moduleService,
                                   esriApiDeps, wish,tiandituFactory,MapUtil, SymbolUtil, GeometryUtil,MapTool) {

        		var apiPrefix = moduleService.getServiceUrl() + '/patrol';
        		// var apiPrefix = 'http://10.0.9.203:7027' + '/patrol';
                var regionTreeUrl = moduleService.getServiceUrl() + '/information/v1/administrativeRegion/list';

                var promise = esriApiDeps.query();
                var w = wish.get();
                $scope.patrolLayer = new w.GraphicsLayer({id: "patrolLayer"});
                $scope.markSymbolLayer = new w.GraphicsLayer({id:"markSymbolLayer"});

                /**
				 * ==============================================
				 * @name  patrolMgtCtrl
				 * @author  | 2018/10/25
				 * @version 
				 * @desc  巡查管理
				 * ==============================================
				 */
				$scope.init = function(){
				    $('#river').attr('disabled',true)
				    $('#reach').attr('disabled',true)

                    $('.selectpicker').selectpicker({
                        noneSelectedText : '请选择',
                        dropupAuto: false,
                        deselectAllText:'取消全选',
                        selectAllText: '全选',
                    });
                    loadGisModuls();
                    getRegion ();
					/**
					 * 获取列表数据
					 */
					getModuleList();
                    getUnit ();
                }

                //监听区域
                $scope.getChangeRegion = function (r) {
                    if(r){
                        $('#river').attr('disabled',false)
                        getRiver (r);
                    }else{
                        $('#river').attr('disabled',true)
                        $('#reach').attr('disabled',true)
                    }
                    $scope.riverName = '';
                    $scope.reachName = '';
                }

                //监听河湖
                $scope.getChangeRiver = function (river) {
                    if($scope.regionName && river){
                        $('#reach').attr('disabled',false)
                        getReach (river);
                    }else{
                        $('#reach').attr('disabled',true)
                    }
                }

                //获取所属区域
                function getRegion (){
                    $ajaxhttp.myhttp({
                        url:regionTreeUrl,
                        method:'get',
                        params:{
                            pageNum:-1,
                            pageSize:-1,
                            grade:3
                        },
                        callBack:function (res) {
                            $scope.regionList = res.data.list;

                            var select = $("#slpkRegion");
                            for (var i = 0; i < $scope.regionList.length; i++) {
                                select.append("<option value='"+$scope.regionList[i].areaCode+"'>"
                                    + $scope.regionList[i].areaName + "</option>");
                            }
                            $('.selectpicker').selectpicker('val', '');
                            $('.selectpicker').selectpicker('refresh');

                        }
                    })
                }




			    //搜索
			    $scope.getMdSearch = function () {
                    getModuleList();
                }
				
                //重置
				$scope.getReSet = function () {
					$scope.reachName = '';
					$scope.riverName = '';
					$scope.regionName = '';
					$scope.beginTime = '';
                    $scope.endTime = '';
                    $scope.unitName = '';
                }


				/**
				 * 列表数据
				 */
				function getModuleList(){
                    $ajaxhttp.myhttp({
                        url: apiPrefix + '/v1/ExeAssPatrolRecord/selectList',
                        method: 'get',
                        params: {
                            pageNumber: $scope.paginationConf.currentPage,
                            pageSize: $scope.paginationConf.itemsPerPage,
                            riverId: $scope.riverName,
                            reachId:$scope.reachName,
                            unit:$scope.unitName,
                            regionId:$scope.regionName,
                            patrolDateStart:$scope.beginTime,
                            patrolDateEnd:$scope.endTime,
                        },
                        callBack: function (res) {
                            $scope.moduleList = res.data.list;
                            $scope.paginationConf.totalItems = res.data.total;
                        }
                    })
				}

                //查询河湖
                function getRiver(r) {
                    $ajaxhttp.myhttp({
                        url: apiPrefix + '/v1/ExeAssPatrol/selectRiver',
                        method: 'get',
                        params:{
                            regionId:r
                        },
                        callBack: function (res) {
                            if(res.data){
                                $scope.riverList = res.data;
                                var select = $("#slpkRiver");
                                select.html('')
                                if($scope.sentRegion){
                                    for (var i = 0; i < $scope.riverList.length; i++) {
                                        select.append("<option value='"+$scope.riverList[i].reachCode+"'>"
                                            + $scope.riverList[i].reachName + "</option>");
                                    }
                                    $('.selectpicker1').selectpicker('val', '');
                                    $('.selectpicker1').selectpicker('refresh');
                                }
                            }
                        }
                    })
                }

                //查询河段
                function getReach(river) {
                    $ajaxhttp.myhttp({
                        url: apiPrefix + '/v1/ExeAssPatrol/selectReachDetail',
                        method: 'get',
                        params:{
                            regionId:$scope.regionName,
                            riverId:river
                        },
                        callBack: function (res) {
                            if(res.data){
                                $scope.reachList = res.data;
                            }
                        }
                    })
                }

                //查询考核单位
                function getUnit() {
                    $ajaxhttp.myhttp({
                        url: apiPrefix + '/v1/ExeAssPatrolRecord/selectUnit',
                        method: 'get',
                        callBack: function (res) {
                            if(res.data){
                                $scope.unitList = res.data;
                            }
                        }
                    })
                }

                //修改巡查
                $scope.edit = function (id) {
                    $('#myModal').modal('show');
                    $ajaxhttp.myhttp({
                        url: apiPrefix + '/v1/ExeAssPatrolRecord/detail',
                        method: 'get',
                        params:{
                            id:id
                        },
                        callBack: function (res) {
                            $scope.patrolDetail = res.data;
                            $scope.patrolDetail.mileage = $scope.patrolDetail.mileage.toFixed(3);
                            $scope.sentRegion = $scope.patrolDetail.regionId.split(',')
                            $('.selectpicker').selectpicker('val',$scope.sentRegion);
                            $('.selectpicker').selectpicker('refresh');
                            $('.selectpicker').selectpicker('render');

                            getRiver($scope.patrolDetail.regionId)

                            setTimeout(function (){
                                $scope.sentRiver = $scope.patrolDetail.riverId.split(',')
                                $('.selectpicker1').selectpicker('val',$scope.sentRiver);
                                $('.selectpicker1').selectpicker('refresh');
                                $('.selectpicker1').selectpicker('render');
                            },1000)
                        }
                    })

                }


                $scope.getChangeRegionlistener = function (region) {
                    getRiver(region.join(','))
                };

                //保存修改
                $scope.save = function () {
				    var params = {
				        id: $scope.patrolDetail.id,
                        regionId:$scope.sentRegion.join(','),
                        riverId:$scope.sentRiver.join(',')
                    }

                    $ajaxhttp.myhttp({
                        url: apiPrefix + '/v1/ExeAssPatrolRecord/update',
                        method: 'put',
                        params:params,
                        callBack: function (res) {
                            if(res.resCode == 1){
                                getModuleList();
                                $('#myModal').modal('hide')
                            }
                        }
                    })
                };

                //加载GIS模块
                function loadGisModuls() {
                    if (typeof $scope.map !== 'undefined') {
                        MapUtil.init($scope.map);
                        SymbolUtil.init($scope.map);
                        GeometryUtil.init($scope.map);
                    } else {
                        // console.error('error： $scope.map 未定义')
                    }
                }

                //初始化地图对象
                $scope.map = new w.Map('map', {
                    // extent: initExtent,
                    fadeOnZoom: true,
                    spatialReference:4326
                });

                //加载天地图底图
                tiandituFactory.initTianditu($scope.map);

                /**
                 * 加载巡河轨迹
                 * @param id
                 */
                $scope.getRiverPatrolLocus = function(module){
				    $("#riverPatrolLocus").modal('show');
				    $scope.topData = module;
                    $http({
                        method: "GET",
                        url: moduleService.getServiceUrl() + '/patrol/v1/ExeAssPatrolRecord/getLocus',
                        cache:true,
                        params:{
                            locusId:module.id
                        }
                    }).success(
                        function(res) {
                            $scope.patrolLayer.clear();
                            $scope.markSymbolLayer.clear();
                            var patrolArr = res.data;
                            var len = patrolArr.length;
                            var coords = [];
                            var item = patrolArr;
                            if (item.coords == "[]") {
                                return;
                            }
                            var coordsParseArr = item.coords.split(";");
                            var patrolArray = [];
                            var lineExtent = null;
                            for (var j = 0; j < coordsParseArr.length; j++) {
                                if (coordsParseArr[j] !== [] && coordsParseArr[j] !== null && coordsParseArr[j] !== "" && coordsParseArr[j] !== "[]") {
                                    if (typeof coordsParseArr[j] === "string" && coordsParseArr[j] !== "[]") {
                                        coords = JSON.parse(coordsParseArr[j]);
                                    } else {
                                        coords = coordsParseArr[j];
                                    }
                                    //轨迹只有一个点时，不绘制
                                    if (coords.length === 1 && coords == "[]") {
                                        continue;
                                    }
                                    if (j === 0) {



                                        lineExtent = addGraphicToMap(coords, item);
                                    } else {
                                        lineExtent = lineExtent.union(addGraphicToMap(coords, item));
                                    }
                                    patrolArray.push(coords);
                                } else {
                                    continue;
                                }
                            }
                            if (patrolArray.length === 1 && patrolArray == "[]") {
                                return;
                            }

                            $scope.map.centerAt(lineExtent.getCenter());
                            $scope.map.setExtent(lineExtent.expand(2));
                        }
                    ).error(function() {});
                };

                /**
                 * 将轨迹添加到地图中
                 * @param coords
                 * @param item
                 * @returns {*}
                 */
                var addGraphicToMap = function (coords, item) {
                    var tmpC =[];
                    var count = 0;
                    var has = -1;

                    for(var i=0;i<coords.length;i++){
                        has = -1;
                        if(tmpC.length === 0 ){
                            tmpC[count] = coords[i];
                            count++;
                        }else{
                            for(var j = 0; j < tmpC.length; j++){
                                if(tmpC[j].x === coords[i].x && tmpC[j].y === coords[i].y ){
                                    has = 1;
                                }
                            }
                            if(has === -1){
                                tmpC[count] = coords[i];
                                count++;
                            }
                        }
                    }

                    var coordsArr = [];
                    var lineSymbol = SymbolUtil.getLineSymbol("solid", [253, 1, 1], 3);
                    for(var i=0;i<tmpC.length;i++){
                        var point = new w.Point(parseFloat(tmpC[i].x), parseFloat(tmpC[i].y), $scope.map.spatialReference);
                        if(MapUtil.isCoordValid(point.x, point.y)){ //过滤为0的无效坐标
                            coordsArr.push(point);
                        }

                    }

                    var startImgPath = "img/esri-icon/patrol/start.png";
                    var walkImgPath = "img/esri-icon/patrol/arrow.png";
                    var endImgPath = "img/esri-icon/patrol/end.png";

                    var pt1 = new Array();
                    var pt2 = new Array();
                    var angle = null;
                    var pt = null;

                    if (parseFloat(coordsArr[0].x) != parseFloat(coordsArr[coordsArr.length-1].x)
                        && parseFloat(coordsArr[0].y) != parseFloat(coordsArr[coordsArr.length-1].y)){
                        var startPoint = new w.Point(parseFloat(coordsArr[0].x),parseFloat(coordsArr[0].y),$scope.map.spatialReference);
                        var endPoint = new w.Point(parseFloat(coordsArr[coordsArr.length-1].x),parseFloat(coordsArr[coordsArr.length-1].y),$scope.map.spatialReference);
                        var startSymbol = new w.PictureMarkerSymbol(startImgPath,25,36).setOffset(0, 18);
                        var endSymbol = new w.PictureMarkerSymbol(endImgPath,25,36).setOffset(0, 18);

                        pt1[0] = parseFloat(coordsArr[0].x);
                        pt1[1] = parseFloat(coordsArr[0].y);
                        pt2[0] = parseFloat(coordsArr[1].x);
                        pt2[1] = parseFloat(coordsArr[1].y);
                        pt = new w.Point(parseFloat(coordsArr[0].x),parseFloat(coordsArr[0].y),$scope.map.spatialReference);

                        angle = MapTool.getAngle(pt1,pt2);
                        walkImgPath = getIconPathByAngle(angle);

                        // var picMarkerSymbol = SymbolUtil.getPictureMarkerSymbol(walkImgPath,iconObject.sizeX,iconObject.sizeY);
                        var picMarkerSymbol = new w.PictureMarkerSymbol(walkImgPath,24,24).setOffset(0, 5);

                        var g1 = new w.Graphic(startPoint, startSymbol);
                        var g2 = new w.Graphic(endPoint, endSymbol);
                        var g3 = new w.Graphic(pt,picMarkerSymbol);
                        g1.attributes = item;
                        g2.attributes = item;
                        g3.attributes = item;
                        $scope.markSymbolLayer.add(g1);
                        $scope.markSymbolLayer.add(g2);
                        $scope.markSymbolLayer.add(g3);
                    }

                    var polyline = new w.Polyline().addPath(coordsArr);
                    var line = new w.Graphic(polyline,lineSymbol);
                    line.attributes = item;
                    $scope.patrolLayer.add(line);
                    $scope.map.addLayers([$scope.patrolLayer,$scope.markSymbolLayer]);
                    var extent = polyline.getExtent();
                    return extent;

                };

                /**
                 * 根据角度获取起点和终点符号
                 * @param angle
                 * @returns {string}
                 */
                var getIconPathByAngle = function (angle) {
                    if(angle && angle !== null) {
                        var _path;
                        if(angle>=337.5 || angle<22.5 ){ //东
                            _path = "img/esri-icon/patrol/walkE.gif";
                        }else if(angle>=22.5 && angle<67.5){ //东南
                            _path = "img/esri-icon/patrol/walkSE.gif";
                        }else if(angle>=67.5 && angle<112.5){ //南
                            _path = "img/esri-icon/patrol/walkS.gif";
                        }else if(angle>=112.5 && angle<157.5){ //西南
                            _path = "img/esri-icon/patrol/walkSW.gif";
                        }else if(angle>=157.5 && angle<202.5){ //西
                            _path = "img/esri-icon/patrol/walkW.gif";
                        }else if(angle>=202.5 && angle<247.5){ //西北
                            _path = "img/esri-icon/patrol/walkNW.gif";
                        }else if(angle>=247.5 && angle<292.5){ //北
                            _path = "img/esri-icon/patrol/walkN.gif";
                        }else if(angle>=292.5 && angle<337.5){ //东北
                            _path = "img/esri-icon/patrol/walkNE.gif";
                        }
                    }else {
                        _path = "img/esri-icon/patrol/walkL.gif";
                    }
                    return _path;
                };


				/**
				 * 查看巡查问题列表
				 */
				$scope.getHydrologicDetail = function(id){
					localStorage.setItem('listId',id);
					routeService.route('3-13', true);
				};
				
				
				/**
				 * 巡查删除
				 */
				
				$scope.getHydrologicDelete = function(id) {
					var layerIndex = layer.confirm('确定删除本条数据吗？', {
	                      btn: ['确定', '取消']
	                      // 按钮
	                  }, function () {
                        $ajaxhttp.myhttp({
                            url: apiPrefix + '/v1/ExeAssPatrolRecord/delete',
                            method: 'DELETE',
                            params: {
								id: id
                            },
                            callBack: function (res) {
                            	if(res.resCode == 1){
                                    layer.msg("删除成功！",{time:2000});
                                    getModuleList();
                            	}
                            }
                        })
	                 }, function () {});
				}


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
                $scope.$watch('paginationConf.currentPage + paginationConf.itemsPerPage', getModuleList);

                /**
                 * 时间选择
                 */

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

                /**
                 * 动态设置最小值
                 */
                datepicker1.on('dp.change', function (e) {
                    datepicker2.data('DateTimePicker').minDate(e.date);
                });
                /**
                 * 动态设置最大值
                 */
                datepicker2.on('dp.change', function (e) {
                    datepicker1.data('DateTimePicker').maxDate(e.date);
                });
            }
        ]);

})(window, angular)