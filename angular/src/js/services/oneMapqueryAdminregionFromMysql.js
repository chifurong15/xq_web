/**
 * @description:  行政边界类--从mysql取数据
 * @author: hsf
 * @date: 2018-9-27 14:45
 */
angular.module('app')
    .service('OneMapqueryAdminregionFromMysql', ['$http','$q','wish', '$localStorage', 'moduleService',function($http, $q, wish, $localStorage,moduleService){
        var w = wish.get();
        var modulePrefix = "/gismap";
        var _serviceURL = moduleService.getServiceUrl() + modulePrefix;
        this.map = null;
        this._regionId = null;
        this._grade = null;
        this.adminregionLayer = null;
        this.textLayer = null;
        //this.isShowText = true;//是否显示注记
        this.regionLevel = null;
        this.isLoading = false; //是否正在加载
        this._sr = null;
        var that = this;

        this.init = function(map, regionId, grade){
            this.map = map;
            this._regionId = regionId;
            this._grade = grade;
            this.adminregionLayer = new w.GraphicsLayer({id: "adminregionLayer"});
            this.textLayer = new w.GraphicsLayer({id: "textLayer"});
            this.map.addLayer(this.adminregionLayer, 0);
            this.map.addLayer(this.textLayer, 1);
            this.getRegionData(this._regionId, this._grade);
        };
        this.getRegionData = function(regionId,grade){
            $http({
                method: 'get',
                url: _serviceURL + '/datashow/getRegionInfoByID',
                params: {area_code: regionId, grade: grade}
            }).success(function (res) {
                //区划边界
                if(res.data && res.data[0].spatial_data && res.data[0].spatial_data !== "" && res.data[0].spatial_data !== "[]"){
                    var spatialData = res.data[0].spatial_data;
                    var regionLevel = res.data[0].grade;
                    var g = that.addParentGraphic(spatialData,regionLevel);
                    that.adminregionLayer.add(g);
                }else {
                    //layer.msg("绘制失败！数据为空!", {time:2000});
                    return;
                }

            }).error(function(){
                console.error("regionData query error");
            });
        };
        this.queryAdminregionXY = function(treeNode, needLocation){
            var condition = this.getQueryLayerParam(treeNode, needLocation);
            this.getAdminregionXY(condition);
        };
        /**
         * 当区划树中经纬度为空时，使用返回的区划数据标注点点位
         * @param condition
         */
        this.getAdminregionXY = function(condition){
            $http({
                 method: "GET",
                 url: _serviceURL,
                 params: condition
            }).then(function successCallback(response) {
                 var data = response.data;
                 if(response.data.features.length == 0){
                    return;
                 }
                 var point = new w.Point(data.features[0].properties.labelx, data.features[0].properties.labely);
                 MapUtil.center2zoom(point, that.regionLevel);
            }, function errorCallback(response) {
                 console.log('query data error');
            });
        };

        this.queryBoundary = function(treeNode, needLocation){
            this.regionLevel = treeNode.regionLevel;
            var condition = this.getQueryLayerParam(treeNode, needLocation);
            this.loadAdminregionData(condition);
        };
        /**
         * 根据用户点击行政树在地图上显示边界及定位
         * @param treeNode
         * @param needLocation
         */
        this.getQueryLayerParam = function(treeNode, needLocation){
            var currentcode = treeNode.id.toString();
            var params, layerName, filterParam;
            if(currentcode.indexOf('00') === 2) { //查询省
                layerName = 'ZheJiangHzz:view_city';
                if(needLocation == 'location'){
                    filterParam = "xzqdm=" + currentcode;
                    params = {
                        "service": "WFS",
                        "verison": "1.0.0",
                        "request": "GetFeature",
                        "typename": layerName,
                        "srsname": "EPSG:4326",
                        "outputFormat": "json",
                        "cql_filter": filterParam
                    };
                }else{
                    filterParam = "parents=" + currentcode;
                    params = {
                        "service": "WFS",
                        "verison": "1.0.0",
                        "request": "GetFeature",
                        "typename": layerName,
                        "srsname": "EPSG:4326",
                        "outputFormat": "json",
                        "cql_filter": filterParam
                    };
                }
                return params;

            }else if(currentcode.indexOf('00') === 4){ //查询市
                layerName = 'ZheJiangHzz:view_county';
                if(needLocation == 'location'){
                    layerName = 'ZheJiangHzz:city';
                    filterParam = "xzqdm=" + currentcode;
                    params = {
                        "service": "WFS",
                        "verison": "1.0.0",
                        "request": "GetFeature",
                        "typename": layerName,
                        "srsname": "EPSG:4326",
                        "outputFormat": "json",
                        "cql_filter": filterParam
                    };
                }else {
                    filterParam = "parents=" + currentcode;
                    params = {
                        "service": "WFS",
                        "verison": "1.0.0",
                        "request": "GetFeature",
                        "typename": layerName,
                        "srsname": "EPSG:4326",
                        "outputFormat": "json",
                        "cql_filter": filterParam
                    };
                }
                return params;
            }else if(currentcode.indexOf('00') === 6){ //查询县
                layerName = 'ZheJiangHzz:view_town';
                if(needLocation == 'location'){
                    layerName = 'ZheJiangHzz:city';
                    filterParam = "xzqdm=" + currentcode;
                    params = {
                        "service": "WFS",
                        "verison": "1.0.0",
                        "request": "GetFeature",
                        "typename": layerName,
                        "srsname": "EPSG:4326",
                        "outputFormat": "json",
                        "cql_filter": filterParam
                    };
                }else {
                    filterParam = "parents=" + currentcode;
                    params = {
                        "service": "WFS",
                        "verison": "1.0.0",
                        "request": "GetFeature",
                        "typename": layerName,
                        "srsname": "EPSG:4326",
                        "outputFormat": "json",
                        "cql_filter": filterParam
                    };
                }
                return params;
            }else if(currentcode.indexOf('00') === 5){ //查询镇
                //do something
                console.warn("village：zoom to point");
            }
        };
        //请求行政区划数据
        this.loadAdminregionData = function(condition){
            var defer = $q.defer();
            var promise = defer.promise;
            if (this.isLoading){
                return;
            }
            //显示加载层
            this.isLodingShow(true);
            $http({
                method: "get",
                params: condition,
                url: _serviceURL
            }).success(function(data){
                defer.resolve(data);
            }).error(function(data){
                console.error('error: query data error');
                return;
            });
            promise.then(function(data){
                that.isLodingShow(false);
                if(data.features.length == 0){
                    console.warn("无边界数据！");
                    return;
                }
                that.addPolygonToMap(data);
            })
        };
        //增加图形到地图中
        this.addPolygonToMap = function(data, isShowText){
            var len = data.features.length;
            this.clear();
            console.time('test');
            isShowText = true; //是否显示标注
            if(isShowText){
                var font = new w.Font().setSize("18px").setWeight(w.Font.WEIGHT_BOLD).setFamily("微软雅黑");
            }

            var polygon = new w.Polygon(new w.SpatialReference({
                wkid: 4326
            }));
            var point,sfs;
            var date1 = new Date().getTime();
            var x = 255;
            var y = 0;
            for (var i = 0;i < len; i++) {
                polygon = new w.Polygon(new w.SpatialReference({
                    wkid: 4326
                }));
                var r = parseInt(Math.random() * (x - y + 1) + y);
                var g = parseInt(Math.random() * (x - y + 1) + y);
                var b = parseInt(Math.random() * (x - y + 1) + y);

                //var sfs = new w.SimpleFillSymbol(w.SimpleFillSymbol.STYLE_SOLID,
                //    new w.SimpleLineSymbol(w.SimpleLineSymbol.STYLE_DOT, new w.Color([255, 0, 0])).setWidth(1),new w.Color([r, g, b, 1])
                //);
                sfs= new w.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID,
                    new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_LONGDASH, new dojo.Color([56,168,0]), 5), new dojo.Color([125,125,125,0]));

                var attributes = data.features[i].properties;
                var coordArray = data.features[i].geometry.coordinates[0];
                textsymbol = new w.TextSymbol(attributes.name, font, new w.Color([39, 100, 65, 1]));
                point = new w.Point(attributes.labelx, attributes.labely);
                polygon.addRing(coordArray);
                var g = new w.Graphic(polygon, sfs);
                var text = new w.Graphic(point, textsymbol);
                this.adminregionLayer.add(g);
                this.textLayer.add(text);
                //themeLayer.setOpacity(0.5);
            }
            console.timeEnd('test');
            var date2 = new Date().getTime();
            console.info("遍历耗时: " + (date2 - date1) + "ms");
        };
        this.addParentGraphic = function (spatialData,regionLevel) {
            this.clear();
            var polygon = new w.Polygon(new w.SpatialReference({wkid: 4326}));
            var sfs = new w.SimpleFillSymbol(w.SimpleFillSymbol.STYLE_NULL,
                new w.SimpleLineSymbol(w.SimpleLineSymbol.STYLE_DASH, new w.Color([56,168,0]), 5), new w.Color([255,127,127, 0])  //[56,168,0]
            );
            var primitive = Terraformer.WKT.parse(spatialData);
            if(spatialData.indexOf("MULTIPOLYGON") >= 0){
                polygon.addRing(primitive.coordinates[0][0]);
            }else{
                polygon.addRing(primitive.coordinates[0]);
            }

            var g = new w.Graphic(polygon, sfs);

            var extent = polygon.getExtent();

            if ($localStorage.mapType == "arcgisDynamic"){
                if (regionLevel != 1){
                    this.map.centerAt(extent.getCenter());
                    this.map.setExtent(extent.expand(2));
                }else {
                    this.map.centerAt(extent.getCenter());
                    this.map.setExtent(extent);
                }
            }else {
                this.map.centerAt(extent.getCenter());
                this.map.setExtent(extent);
            }
            return g;
        };
        this.addRegionBoundary = function (spatialData) {
            this.clear();
            var polygon = new w.Polygon(new w.SpatialReference({wkid: 4326}));
            var sfs = new w.SimpleFillSymbol(w.SimpleFillSymbol.STYLE_NULL,
                new w.SimpleLineSymbol(w.SimpleLineSymbol.STYLE_SOLID, new w.Color([85,85,85]), 3), new w.Color([255, 255, 255, 0])
            );
            var primitive = Terraformer.WKT.parse(spatialData);
            if(spatialData.indexOf("MULTIPOLYGON") >= 0){
                polygon.addRing(primitive.coordinates[0][0]);
            }else{
                polygon.addRing(primitive.coordinates[0]);
            }
            var g = new w.Graphic(polygon, sfs);
            return g;
        };
        //加载层控制显隐
        this.isLodingShow = function(isLoading){
            if (isLoading){
                this.isLoading = true;
                $("#arcgisLoading").show();
            }else{
                this.isLoading = false;
                $("#arcgisLoading").hide();
            }
        };
        //清除图层
        this.clear = function(){
            that.adminregionLayer.clear();
            that.textLayer.clear();
        };
        //测试
        this.log = function(){
            //console.log('test: queryAdminregion service');
        };


    }]);