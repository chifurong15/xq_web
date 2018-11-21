/**
 * @description:  行政边界类
 * @author: huangshuifa
 * @date: 2018-8-8 15:50
 */
angular.module('app')
    .service('queryAdminregion', ['$http','$q', 'MapUtil', 'SymbolUtil', 'wish', '$localStorage', function($http, $q, MapUtil, SymbolUtil, wish, $localStorage){
        var w = wish.get();
        var serviceURL = $localStorage.wfsServiceUrl;
        this.map = null;
        this.adminregionLayer = null;
        this.textLayer = null;
        this.miniScale = 1154287.494417322456;
        this.centralCityAnnoLayer = null;
        this.centerlCityOtherAnnoLayer = null;
        //this.isShowText = true;//是否显示注记
        this.regionLevel = null;
        this.isLoading = false; //是否正在加载
        var that = this;

        this.init = function(map){
            this.map = map;
            this.adminregionLayer = new w.GraphicsLayer({id: "adminregionLayer"});
            this.textLayer = new w.GraphicsLayer({
                id: "textLayer",
                minScale: this.miniScale,
                visible: true
            });
            this.centralCityAnnoLayer = new w.GraphicsLayer({
                id: "centralCityAnnoLayer",
                minScale: this.miniScale,
                visible: true
            });
            this.map.addLayer(this.adminregionLayer, 0);
            this.map.addLayer(this.textLayer, 1);
            this.map.addLayer(this.centralCityAnnoLayer, 2);
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
                 url: serviceURL,
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
                url: serviceURL
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
            if(data.hasOwnProperty("children") && data["children"] != null){
                this.createGraphic(data, isShowText);
            }
        };
        this.createGraphic = function (data, isShowText) {
            this.clear();
            var len = data.children.length;
            console.time('test');
            isShowText = true; //是否显示标注
            if(isShowText){
                var font = new w.Font().setSize("18px").setWeight(w.Font.WEIGHT_BOLD).setFamily("微软雅黑");
            }

            var point, polygon;
                polygon = new w.Polygon(new w.SpatialReference({
                wkid: 4326
            }));

            var date1 = new Date().getTime();
            for (var i = 0;i < len; i++) {
                /*polygon = new w.Polygon(new w.SpatialReference({
                    wkid: 4326
                }));*/

                var sfs = new w.SimpleFillSymbol(w.SimpleFillSymbol.STYLE_SOLID,
                    new w.SimpleLineSymbol(w.SimpleLineSymbol.STYLE_DOT, new w.Color([123, 122, 119])).setWidth(0.1),new w.Color([255, 255, 255, 0])
                );

                var attributes = data.children[i];
                if(attributes.hasOwnProperty("spatialData") && attributes["spatialData"] == "") {
                    this.addRegionName(data["name"], data["longitude"], data["latitude"]);
                    return;
                }
                var spatialData = attributes.spatialData;
                //textsymbol = new w.TextSymbol(attributes.name, font, new w.Color([39, 100, 65, 1]));
                //point = new w.Point(attributes.longitude, attributes.latitude);

                var primitive = Terraformer.WKT.parse(spatialData);
                if(spatialData.indexOf("MULTIPOLYGON") >= 0){
                    polygon.addRing(primitive.coordinates[0][0]);
                }else{
                    polygon.addRing(primitive.coordinates[0]);
                }
                var g = new w.Graphic(polygon, sfs);
                //var text = new w.Graphic(point, textsymbol);
                this.adminregionLayer.add(g);
                this.addRegionName(attributes["name"], attributes["longitude"], attributes["latitude"]);
                //this.textLayer.add(text);
                //themeLayer.setOpacity(0.5);

                //绘制自身
                if(data.hasOwnProperty("spatialData") && data["spatialData"] != ""){
                    var g2 = this.addParentGraphic(data.spatialData);
                    this.adminregionLayer.add(g2);
                }
            }
            console.timeEnd('test');
            var date2 = new Date().getTime();
            console.info("遍历耗时: " + (date2 - date1) + "ms");
        };
        this.addParentGraphic = function (spatialData) {
            var polygon = new w.Polygon(new w.SpatialReference({wkid: 4326}));
            var sfs = new w.SimpleFillSymbol(w.SimpleFillSymbol.STYLE_SOLID,
                new w.SimpleLineSymbol(w.SimpleLineSymbol.STYLE_SOLID, new w.Color([56,168,0])).setWidth(5),new w.Color([255, 255, 255, 0])
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
        this.addRegionName = function (name, longitude, latitude) {
            var centerArea = ["红桥区","河北区","和平区","河东区","南开区","河西区"];

            var font = new w.Font().setSize("18px").setWeight(w.Font.WEIGHT_BOLD).setFamily("微软雅黑");
            var textsymbol = new w.TextSymbol(name, font, new w.Color([39, 100, 65, 1]));
            var point = new w.Point(longitude, latitude);
            var text2, textsymbol;
            //加一个中心城区
            if(name === "和平区"){
                var name2 = "中心城区";
                textsymbol = new w.TextSymbol(name2, font, new w.Color([39, 100, 65, 1]));
                text2 = new w.Graphic(point, textsymbol);
                this.textLayer.add(text2);
            }
            var text = new w.Graphic(point, textsymbol);
            //for()
            console.log(this.isInArray(centerArea, name));
            if(this.isInArray(centerArea, name)){

                //if(name === "和平区") {
                    this.centralCityAnnoLayer.add(text);
                //}
            }else {
                this.textLayer.add(text);
            }

            console.log(this.map.getScale());
            if(this.map.getScale() < 1154287.4944173226){ //1154287.4944173226  577143.7472086613
                this.centralCityAnnoLayer.show();
                //this.centralCityAnnoLayer.redraw()
            }else{
                this.centralCityAnnoLayer.hide();
            }

        };
        this.isInArray = function (array, name) {debugger;
            var index = array.length;
            while (index--) {
                if (array[index] === name) {
                    return true;
                }
            }
            return false;
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
            this.adminregionLayer.clear();
            this.textLayer.clear();
        };
        //测试
        this.log = function(){
            //console.log('test: queryAdminregion service');
        };


    }]);