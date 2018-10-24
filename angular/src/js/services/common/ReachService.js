/**
 * @description:  河道类
 * @author: hsf
 * @date: 2018-8-31 10:24
 */
angular.module('app')
    .service('ReachService', ['$http', 'GeometryUtil', 'SymbolUtil', 'wish','$localStorage','$q','$rootScope', function($http, GeometryUtil, SymbolUtil, wish, $localStorage,$q,$rootScope){
        var w = wish.get();
        this._map = null;
        this.layer = null;
        this.reachLineLayer = null;
        this.selectedReachLine = null;
        this.highLineLayer = null;
        this.isLoading = false; //是否正在加载
        this.reachexisthz = true;// 该河道存在河长
        this.getData = null;
        //var serviceURL = $localStorage.wfsServiceUrl;
        var serviceURL = 'http://117.8.229.5:9000/watersource';
        var serviceName = $localStorage.wfsWorkSpaceName;
        this.needDisplayReachLevel = "1,2,3,4,5";
        this.userClickRegionId = null;
        var that = this;

        this.init = function(map, userClickRegionId){// checkRegionId
            this._map = map;
            this.userClickRegionId = userClickRegionId;
            this.layer = new w.GraphicsLayer({id: "reachLayer"});//河道中心点图层
            this.reachLineLayer = new w.GraphicsLayer({id: "reachLineLayer"});//河道线图层
            this.highLineLayer = new w.GraphicsLayer({id: "highLineLayer"}); //高亮河道线图层
            //this.startAndEndLayer = new w.GraphicsLayer({id: "startAndEndLayer"}); //河道起止点图层
            this._map.addLayer(this.reachLineLayer, 1);
            this._map.addLayer(this.highLineLayer, 2);
            //this._map.addLayer(this.startAndEndLayer);
            this._map.addLayer(this.layer, 3);
            //this.getReachListByFilter(7);
            dojo.connect(this.layer, "onMouseOver", dojo.hitch(this, this.showReachName));
            dojo.connect(this.layer, "onMouseOut", dojo.hitch(this, this.hideReachName));

            //dojo.connect(this.layer, "onClick", dojo.hitch(this, this.showInfoWindow));
            //dojo.connect(this.reachLineLayer, "onMouseOver", dojo.hitch(this, this.highLightReachLine));
            //dojo.connect(this.reachLineLayer, "onMouseOut", dojo.hitch(this, this.removeHighLightReachLine));
            //dojo.connect(this._map, "onZoomEnd", dojo.hitch(this, this.reloadReaches));
        };
        this.reloadReaches = function(){
            var level = this._map.getLevel();
            if (level < 7 || level >= 16) {
                return;
            }
            //$("#title_reach").remove();
            this.hiddenGraphicsCenterPointByMapLevel(this.layer, level, "center");
            this.hiddenGraphicsByMapLevel(this.reachLineLayer, level, "line");
            //this.getReachList(map.getLevel(), map.extent, true);
            this.getReachListByFilter(level);
        };
        this.getReachList = function (level, extent, isShowing) {
            //地图上的河道加载
            var curMapLevel = parseInt((level - 5) / 2);
            if (extent && extent.xmin < 0) {
                return;
            }
            if (this.needDisplayReachLevel == "1,2,3,4,5") {
                this.getReachUrl = "/datashow/loadReachList";
            } else {
                this.getReachUrl = "/datashow/loadReachListByReachLevel";
            }
            if (this.isLoading) return;//如果地图在加载中则不再次请求，避免地图未加载完成时拖动地图导致数据重请求
            this.isLoading = true;
            $("#mapLoadingDiv").show();

            $http({
                method: "GET",
                /*url: serviceURL + "/v1/reach/findByNameAndRegionCode", //?regionCode=120103000000&page=-1&size=-1&isNext=false
                params: {
                    regionCode: 120103000000,
                    page: -1,
                    size: -1,
                    isNext: false //为true时，仅查询当前级及下一个级别的河道
                }*/
                url: serviceURL + "/v1/reach/loadReachList", //xmin=-180&ymin=-90&xmax=180&ymax=90&regionid=120103000000
                params: {
                    xmin: -180,
                    ymin: -90,
                    xmax: 180,
                    ymax: 90,
                    regionid: 120103000000
                }

            }).success(function (data) {
                that.isLoading = false;
                $("#arcgisLoading").hide();
                if(data.data && data.data.length > 0){
                    //_that._dataSource = data.data;
                    that.addGraphic(data.data);
                }else{
                    console.warn("Reach data is null");
                }
            }).error(function(){
                console.error("data query error");
                that.isLoading = false;
                $("#arcgisLoading").hide();
            });

            //that.addGraphic();

        };
        this.addGraphic = function(reachList){
            //测试
            /*var reachList = [
                {
                    alias: "",
                    centerPointLatitude: 39.09222453,
                    centerPointLongitude: 117.23695044,
                    chairmanId: "",
                    chairmanName: "",
                    classify: "A",
                    countryCode: "",
                    createId: "1",
                    createTime: "2018-08-29 14:11:37",
                    displayReachCode: "",
                    endPoint: "双林引水河",
                    endPointLatitude: 39.07604545,
                    endPointLongitude: 117.28620653,
                    governTime: null,
                    grade: 3,
                    greadName: "县级",
                    id: "63441baaab5211e88338fa163e29a9e1",
                    isBind: "",
                    isSection: null,
                    isVirtual: 0,
                    isVirtualName: "是",
                    length: 8.63,
                    linePoints: "117.21611504,39.11632150;117.21698408,39.11553829;117.21778874,39.11470144;117.21916203,39.11318868;117.22309952,39.10839289;117.22572808,39.10582870;117.23082428,39.10155862;117.23445062,39.09800738;117.23695044,39.09222453;117.23967557,39.08709615;117.24374180,39.08442467;117.24957828,39.08158153;117.25555425,39.07939284;117.26105814,39.07875984;117.26794605,39.07820194;117.28529458,39.07630294;117.28620653,39.07604545;",
            modifyId: "",
                modifyTime: null,
                overView: "",
                pName: "",
                parents: "FAA0030AA000001A1#120000000000|EAA0002AA000002A2#120100000000|FAA0022BA000001A3#120103000000",
                parentsCode: "EAA0002AA000002A2#120100000000",
                reachCode: "FAA0022BA000001A3#120103000000",
                reachName: "海河河西区段段",
                regionCode: 120103000000,
                regionName: "河西区",
                remark: "",
                riverChiefCard: [ ],
                riverPolicy: "",
                rowVersion: "",
                shore: "A",
                shoreName: "",
                silty: null,
                siltyName: "",
                sortOrder: 0,
                spatialData: [ ],
                startPoint: "徐州道",
                startPointLatitude: 39.1163215,
                startPointLongitude: 117.21611504,
                state: 1,
                theirCode: "FAA0022BA",
                throughArea: "",
                userId: "",
                waterCode: "",
                waterGrade: null,
                waterGradeName: "",
                waterName: "",
                whether: null,
                whetherName: "",
                width: null
        },
            {
                alias: "",
                    centerPointLatitude: 39.07459831,
                centerPointLongitude: 117.22792849,
                chairmanId: "",
                chairmanName: "",
                classify: "A",
                countryCode: "",
                createId: "1",
                createTime: "2018-08-29 14:11:38",
                displayReachCode: "",
                endPoint: "五号堤路",
                endPointLatitude: 39.07798862,
                endPointLongitude: 117.26101622,
                governTime: null,
                grade: 3,
                greadName: "县级",
                id: "63b1bf38ab5211e88338fa163e29a9e1",
                isBind: "",
                isSection: null,
                isVirtual: 0,
                isVirtualName: "是",
                length: 5.7,
                linePoints:
                "117.19908938,39.06988425;117.20030173,39.07115025;117.20151409,39.07169742;117.20230803,39.07193346;117.20576271,39.07271666;117.20884189,39.07315655;117.21325144,39.07344623;117.22398028,39.07429790;117.22792849,39.07459831;117.23050341,39.07395458;117.23174795,39.07399749;117.23475203,39.07515620;117.24015936,39.07537078;117.24728331,39.07481288;117.25131735,39.07446956;117.25372061,39.07451247;117.25616678,39.07476997;117.25732550,39.07528495;117.26101622,39.07798862;",
                modifyId: "",
                    modifyTime: null,
                overView: "",
                pName: "",
                parents: "FAA0030AA000001A1#120000000000|EAA0002AA000002A2#120100000000|FAA0022BA000001A3#120103000000",
                parentsCode: "EAA0002AA000002A2#120100000000",
                reachCode: "FAA0022BA000001A3#120103000000",
                reachName: "复兴河河西区段段",
                regionCode: 120103000000,
                regionName: "河西区",
                remark: "",
                riverChiefCard: [ ],
                riverPolicy: "",
                rowVersion: "",
                shore: "A",
                shoreName: "",
                silty: null,
                siltyName: "",
                sortOrder: 0,
                spatialData: [ ],
                startPoint: "紫金山路与郁江道交口",
                startPointLatitude: 39.06988425,
                startPointLongitude: 117.19908938,
                state: 1,
                theirCode: "FAA0022BA",
                throughArea: "",
                userId: "",
                waterCode: "",
                waterGrade: null,
                waterGradeName: "",
                waterName: "",
                whether: null,
                whetherName: "",
                width: null
            }];*/


            for(var i = 0; i < reachList.length; i++) {
                var reach = reachList[i];
                //if(reach.grade == level){//显示与maplevel匹配的河道
                    this.createReachLine(reachList[i], true);
                    if (reach.centerPointLongitude !== null && reach.centerPointLongitude > 0 && reach.centerPointLatitude !== null && reach.centerPointLatitude > 0) {
                        this.createGraphic(reach, true);
                    }
                //}else{

                //}
            }
        };
        /**
         * 加载河道数据
         */
        this.getReachListByFilter = function(level){
            var reachlevel = parseInt((level - 5) / 2);
            var layerName =serviceName +  ':md_reach';
            var params = {
                "service": "WFS",
                "verison": "1.0.0",
                "request": "GetFeature",
                "typename": layerName,
                "srsname": "EPSG:4326",
                "outputFormat": "json",
                "cql_filter": "grade='"+ reachlevel +"'"
            };
            if (this.isLoading){
                return;
            }
            this.isLoading = true;
            $("#arcgisLoading").show();
            $http({
                method: "GET",
                url: serviceURL,
                params: params
            }).then(function successCallback(response) {
                that.isLoading = false;
                $("#arcgisLoading").hide();
                if(response.data.features.length == 0){
                    return;
                }else{
                    that.addReachesToMap(response.data, true);
                }
            }, function errorCallback(response) { //请求失败时，隐藏加载提示
                that.isLoading = false;
                $("#arcgisLoading").hide();
            });
        };
        /**
         * 将河道加到河道图层中
         */
        this.addReachesToMap = function (reachList, isShowing) {
            /*for (var i = 0; i < reachList.length; i++) {
                var reach = reachList[i];
                if (this.reachNotOnMap(reach)) {//判断该河道是否已经在地图上
                    if (reach.reachLinePoints != null && reach.reachLinePoints.length > 0) {
                        //如果有ogc数据则使用ogc数据，否则使用linephints数据
                        if ((reach.reachLinePoints).substring(0, 15) == "MULTILINESTRING"||(reach.reachLinePoints).substring(0, 12) == "MULTIPOLYGON") {
                            this.createReachLineByWkt(reach, isShowing);
                        } else {
                            this.createReachLine(reach, isShowing);
                        }
                    }
                    if (reach.centerlong != null && reach.centerlong > 0) {
                        this.createGraphic(reach, isShowing);
                    }
                }
            }*/
            //dojo.connect(map,"onZoomEnd",Reach.redrawReaches);

            var currentLevel = this._map.getLevel();
            var level = parseInt((currentLevel - 5) / 2);
            console.log(currentLevel);
            console.log(level);
            var provinceReach = [], cityReach = [];
            for(var i = 0; i < reachList.features.length; i++) {
                var reach = reachList.features[i].properties;
                if(reach.grade == level){//显示与maplevel匹配的河道
                    provinceReach.push(reachList.features[i]);
                    this.createReachLine(reachList.features[i], true);
                    if (reach.centerlong != null && reach.centerlong > 0 && reach.centerlat != null && reach.centerlat > 0) {
                        this.createGraphic(reach, true);
                    }
                }else{

                }
            }

        };
        this.findReachByCurrentMapLevel = function(maplevel){

        };
        /**
         * 判断河道是否已在地图中
         * @returns {boolean}
         */
        this.reachNotOnMap = function(){
            var graphics = this.layer.graphics;
            if (graphics.length > 0) {
                for (var i = 0; i < graphics.length; i++) {
                    var id = graphics[i].attributes.id;
                    if (id == reach.id) {
                        return false;
                    }
                }
            }
            return true;
        };
        this.createReachLine = function(reach, isShowing) {
            var rings = [];
            var array = [];
            var lineCoords = reach.linePoints;
            if(lineCoords != undefined && lineCoords != null && lineCoords != ''){
                array = lineCoords.split(";");
            }
            for (var i = 0; i < array.length; i++) {
                var pointArray = array[i].split(",");
                if (pointArray != "") {
                    var p = [pointArray[0] * 1, pointArray[1] * 1];
                    rings.push(p);
                }
            }
            var reachGeometry = new w.Polyline(this._map.spatialReference);
            var lineSymbol = SymbolUtil.getLineSymbol(w.SimpleLineSymbol.STYLE_SOLID, new w.Color([48,164,254]), 3);
            reachGeometry.addPath(rings);
            var reachLine = new w.Graphic(reachGeometry, lineSymbol);
            reachLine.setAttributes(reach);
            this.reachLineLayer.add(reachLine);

            if (!isShowing) {
                reachLine.hide();
            }
        };
        /**
         * 根据linepoints生成河道线
         */
        this.createReachLineByWfsService = function(reach, isShowing) {
            var rings = reach.geometry.coordinates;
            //解析
            //var primitive = Terraformer.WKT.parse(rings);
            //var arcgis = Terraformer.ArcGIS.convert(primitive);
            //var reachGeometry = w.fromJson(arcgis);
            var reachGeometry = GeometryUtil.getPolyline();
            reachGeometry.addPath(rings);

            var lineSymbol;
            if (reach.properties.reachexisthz == "1") {
                this.reachexisthz = true;
                lineSymbol = this.getSymbolByLevel(reach.properties.grade);
            } else {
                this.reachexisthz = false;
                lineSymbol = this.getSymbolByLevel(reach.properties.grade);
            }

            var reachLine = new w.Graphic(reachGeometry, lineSymbol);

            reachLine.setAttributes(reach.properties);
            this.reachLineLayer.add(reachLine);

            if (!isShowing) {
                reachLine.hide();
            }
        };
        /**
         * 根据wkt值生成河道线
         */
        this.createReachLineByWkt = function(){

        };
        /**
         * 显示河道起止点
         */
        this.showStartAndEndPoiont = function(){

        };
        /**
         * 不同级别的河道采用不同颜色宽度的线条
         * @param level
         * @returns {esri.symbol.SimpleLineSymbol}
         */
        this.getSymbolByLevel = function (level) {
            var color, size, lineSymbol;
            switch (level) {
                case "1":
                    color = new w.Color([54,137,219]);
                    size = 4;
                    break;
                case "2":
                    color = new w.Color([102,197,242]);
                    size = 4;
                    break;
                case "3":
                    color = new w.Color([133,190,39]);
                    size = 4;
                    break;
                case "4":
                    color = new w.Color([217,207,42]);
                    size = 4;
                    break;
                case "5":
                    color = new w.Color([242,141,46]);
                    size = 4;
                    break;
                case "6":
                    color = new w.Color([225,71,50]);
                    size = 4;
                    break;
                default :
                    //color = new dojo.Color([157,115,226]); 紫色
                    color = new w.Color([21,170,241]);
                    size = 4;
                    break;
            }

            //if (this.reachexisthz == true) {
                lineSymbol = SymbolUtil.getLineSymbol(w.SimpleLineSymbol.STYLE_SOLID, color, size);
            //} else {
                //color = new w.Color([255, 0, 0]);
                //lineSymbol = SymbolUtil.getLineSymbol(w.SimpleLineSymbol.STYLE_DASH, color, size);
            //}
            return lineSymbol;
        };
        /**
         * 创建graphic
         * @param reach
         * @param isShowing
         */
        this.createGraphic = function (reach, isShowing) {
            var point = new w.Point(reach.centerPointLongitude, reach.centerPointLatitude, this._map.spatialReference);
            //var symbol = this.getCenterPointSymbol(reach.grade);
            var symbol = this.getCenterPointSymbol(3);
            var attr = {};
            // var infoTemplate = new w.InfoTemplate(reach.name, Reach.createReachInfoWindow(reach));
            var graphic = new w.Graphic(point, symbol, attr);
            graphic.attributes = reach;
            this.layer.add(graphic);
            //if (parseInt((this._map.getLevel() - 5) / 2) != reach.reachlevel) {
            //    graphic.hide();
            //}
            if (!isShowing) {
                graphic.hide();
            }
        };
        /**
         * 根据河道等级获取图标路径
         */
        this.getCenterPointSymbol = function (level) {
            var path = "";
            switch (level) {
                case 1:
                    path = "img/esri-icon/reach/province_1.png";
                    break;
                case 2:
                    path = "img/esri-icon/reach/city_1.png";
                    break;
                case 3:
                    path = "img/esri-icon/reach/county_1.png";
                    break;
                case 4:
                    path = "img/esri-icon/reach/town_1.png";
                    break;
                case 5:
                    path = "img/esri-icon/reach/village_1.png";
                    break;
                default:
                    path = "img/esri-icon/reach/III_1.png";
                    break;
            }
            var symbol = new w.PictureMarkerSymbol(path, 35, 35).setOffset(0, 15);
            return symbol;
        };
        /**
         * 显示河道名称
         * @param evt
         */
        this.showReachName = function(evt){
            var g = evt.graphic;
            var symbol = g.symbol;
            var attributes = g.attributes;
            var point = this._map.toScreen(evt.mapPoint);
            //调用div
//          layui.use('layer', function() {
//				var layer = layui.layer;
//				//tips层-左
//				layer.tips('在上面', '#reachLayer_layer', {
//				  tips: [1, '#78BA32']
//				});
//
//			});


            var css = {
                "position":"absolute",
                "top":point.y + 8 +'px',
                "left":point.x + 200 + 'px',
                "width":"auto",
                "height":"30px",
                "display":"block",
                "line-height":"34px",
                "padding-left":"10px",
                "padding-right":"10px",
                "background-color":'#4fa184',
                "color":'#fff'
            };
            $("#mapTips").html(attributes["reachName"]);
            $("#mapTips").css(css);

            //$(".map").append(createTitleDiv("title_reach", attributes.name, point));
            //$("#region_name").hide();//隐藏行政区划名称
            g.setSymbol(new w.PictureMarkerSymbol(symbol.url.replace("_1.png", ".png"), 35, 35).setOffset(0, 15));
            this.highLightReachLine(evt);
        };
        /**
         * 河道高亮
         * @param evt
         */
        this.highLightReachLine = function(evt){
            var recid = evt.graphic.attributes.id;
            for (var i = 0; i < this.reachLineLayer.graphics.length; i++) {
                var g = this.reachLineLayer.graphics[i];
                //var reachlevel = evt.graphic.attributes.reachlevel;
                if (g.attributes.id == recid) {
                    var color = new w.Color([255, 153, 18]);
                    var lineSymbol = new w.SimpleLineSymbol(w.SimpleLineSymbol.STYLE_SOLID,
                        color, 4);

                    /*if (g.getLayer().id == "reachLineLayer" && !$("#title_reach").is(":visible")) {
                        if (parseInt((map.getLevel() - 5) / 2) == reachlevel || (map.getLevel() >= 15 && reachlevel >=
                            4)) {
                            g.setSymbol(lineSymbol);
                        }
                        var point = map.toScreen(evt.mapPoint);
                        $(".map").append(createTitleDiv("title_reach", g.attributes.name, point));
                    } else {
                        var graphic = new esri.Graphic(g.geometry, lineSymbol);
                        graphic.setSymbol(lineSymbol);
                        Reach.highLineLayer.add(graphic);
                        //Reach.selectedReachLine = graphic;
                    }
                    return;*/

                    var graphic = new w.Graphic(g.geometry, lineSymbol);
                    graphic.setSymbol(lineSymbol);
                    this.highLineLayer.add(graphic);
                }
            }
        };
        /**
         * 去除河道高亮
         * @param evt
         */
        this.removeHighLightReachLine = function(evt){
            this.highLineLayer.clear();
            //$("#title_reach").remove();
            for (var i = 0; i < this.reachLineLayer.graphics.length; i++) {
                var g = this.reachLineLayer.graphics[i];
                //var color = this.getColor(g.attributes.waterlevel);
                /*if (g.attributes.reachexisthz != null && g.attributes.reachexisthz != "" && g.attributes.reachexisthz == "1") {
                    this.reachexisthz = true;
                } else {
                    this.reachexisthz = false;
                }*/
                //var lineSymbol = this.getSymbolByLevel(g.attributes.grade);
                var lineSymbol = this.getSymbolByLevel(3);
                g.setSymbol(lineSymbol);
            }
        };
        /**
         * 隐藏河道名称
         * @param evt
         */
        this.hideReachName = function(evt){
            var g = evt.graphic;
            var symbol = g.symbol;
            //if (type == "center") {
            g.setSymbol(new w.PictureMarkerSymbol(symbol.url.replace(".png", "_1.png"), 35, 35).setOffset(0, 15));
            //}
            //$("#title_reach").remove();
            this.removeHighLightReachLine(evt);

            $("#mapTips").css("display","none");


        };
        /**
         * 显示详情
         */

        this.showInfoWindow = function(evt){
            console.log(evt.graphic.attributes)
            //省级区域弹窗详情
            var parentName,
                reachidMap = evt.graphic.attributes.id,
                parentsMap = evt.graphic.attributes.parents_code;
            getData(reachidMap,parentsMap);
            $localStorage.reachidMap = reachidMap;
        };

        var getData = function(reachidMap,parentsMap){ //暴露一个接口
            //获取数据，并缓存数据
            var d = $q.defer();

            $http({
                method: "GET",
                url: $localStorage.serviceURL + "/datashow/reachwindow",
                dataType:'json',
                params:{
                    reachid:reachidMap,
                    parents:parentsMap
                }
            }).success(
                function(data) {
                    d.resolve(data);
                    if(data.resCode === 1){
                        var _reachData = data.data.reach;
                        parentName = data.data.reach.parentName;

                        $rootScope.$emit('reachData',_reachData);

                        layui.use('layer', function() {
                            var layer = layui.layer;
                            layer.open({
                                id: "2001",
                                type: 1,
                                anim: 1,
                                title: parentName,
                                shade: 0,
                                area: ['750px', '350px'],
                                offset: 'auto',
                                content: $("#layui-region-form"),
                                scrollbar: false,
                                cancel: function() {
                                    $("#layui-region-form").css("display", "none");
                                }
                            });
                        });
                    }

                }
            ).error(
                function(data) {
                    d.reject("error");
                });

            return d.promise;
        };


        /**
         * 清除图层
         */
        this.clear = function () {
            this.layer.clear();
            this.reachLineLayer.clear();
            if (this.selectedReachLine != null) {
                this.selectedReachLine.clear();
            }
            this.highLineLayer.clear();
        };

    }]);
