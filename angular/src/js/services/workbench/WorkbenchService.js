/**
 * @description:  工作台类
 * @author: hsf
 * @date: 2018-9-6 16:32
 */
angular.module('app')
    .service('WorkbenchService',[
        'wish',
        '$http',
        '$localStorage',
        'SymbolUtil',
        'MapUtil',
        'MapTool',
        function (wish, $http, $localStorage, SymbolUtil, MapUtil, MapTool) {
            var _w = wish.get();
            this._map = null;
            this._layer = null;
            this._layerId = null;
            this._regionLayer = null;
            // var _serviceUrl = $localStorage.serviceUrl_chiefOnline;
            var _serviceUrl = "http://117.8.229.5:9000" + "/chiefOnline";
            var timeout = null;
            this.refreshDataTimer = null;
            var _refreshTime = 30000;
            var _that = this;

            this.init = function (map, layerId) {
                this._map = map;
                this._layerId = layerId;
                //this.userRegionId = userRegionId;
                this._layer = new _w.GraphicsLayer({id: this._layerId, visible: true});
                this._regionLayer = new _w.GraphicsLayer({id: "regionLayer"});
                this._map.addLayers([this._regionLayer, this._layer]);
                //dojo.connect(this._layer, "onMouseOver", dojo.hitch(this, this.showName));
                //dojo.connect(this._layer, "onMouseOut", dojo.hitch(this, this.hideName));

                this.getDataList();
                this.refreshData();
            };
            this.getDataList = function () {
                if(this._layer != null){
                    this.clear();
                    // if(this.isGraphicClick){
                    //     this._map.infoWindow.hide();
                    //     this.isGraphicClick = false;
                    // }
                }
                this.userRegionId = 120100000000;
                $http({
                    method: "GET",
                    url: _serviceUrl + "/chairmanOnline/v1/search/" + this.userRegionId,
                    params: {
                        hzname: "",
                        status: "Y,L", //Y在线,L巡河,O离线
                        level: "2,3,4,5"
                    }
                }).success(function (data) {
                    if(data.data && data.data.length > 0){
                        _that.addGraphic(data.data);
                    }else{
                        console.warn("data is null");
                    }
                }).error(function(){
                    console.error("data query error");
                });
            };
            this.addGraphic = function (data) {
                //this.clear();
                if(this._layer !== null){
                    this.clear();
                    /*if(this.isGraphicClick){
                        this._map.infoWindow.hide();
                        this.isGraphicClick = false;
                    }*/
                }

                var len = data.length;
                var item,coords,point,iconObject,picMarkerSymbol,graphic;
                for(var i=0;i<len;i++){
                    item = data[i];
                    if(item["status"] === 0){
                        return;
                    }
                    if(MapUtil.isCoordValid(item.longitude, item.latitude)){
                        var regionName = this.getRegionInfo(item);
                        item.regionName = regionName;
                        //this.createLayerAnno(item);
                        point = new _w.Point(item.longitude, item.latitude, this._map.spatialReference);
                        iconObject = this.getIconPath(item["status"]);
                        picMarkerSymbol = SymbolUtil.getPictureMarkerSymbol(iconObject.path, iconObject.sizeX, iconObject.sizeY).setOffset(0, 0);
                        graphic = new _w.Graphic(point, picMarkerSymbol);
                        //item.type = "河长在线";
                        graphic.attributes = item;
                        this._layer.add(graphic);

                    }else{
                        //console.info("无效坐标!");
                    }

                }
            };
            //刷新河长数据
            this.refreshData = function () {
                this.refreshDataTimer = null;
                clearInterval(this.refreshDataTimer);
                this.refreshDataTimer = setInterval(function(){
                    _that.getDataList();
                    }, _refreshTime);
            };
            this.getRegionInfo = function (item) {
                if(item["chairmanlevel"] == 5){
                    return item["villagename"];
                }else if(item["chairmanlevel"] == 4){
                    return item["townname"];
                }else if(item["chairmanlevel"] == 3){
                    return item["countyname"];
                }else if(item["chairmanlevel"] == 2){
                    return item["cityname"];
                }else {
                    return item["provincename"];
                }
            };
            this.getIconPath = function(status){
                var iconObject = {};
                iconObject.sizeX = 24;
                iconObject.sizeY = 24;
                switch (status) {
                    case 0: //离线
                        iconObject.path = "img/esri-icon/hzstatus/riverChief-off.png";
                        break;
                    case 1: //在线
                        iconObject.path = "img/esri-icon/hzstatus/riverChief.png";
                        break;
                    case 2: //巡河中
                        //iconObject.path = "img/esri-icon/hzstatus/riverChief-patrol.png";
                        iconObject.path = "img/esri-icon/patrol/walkR.gif";
                        iconObject.sizeX = 36;
                        iconObject.sizeY = 36;
                        break;
                }

                return iconObject;
            };
            this.showName = function (evt) {
                this._map.setMapCursor("pointer");
                var g = evt.graphic;
                var symbol = g.symbol;
                var attributes = g.attributes;
                var point = this._map.toScreen(evt.mapPoint);

                var css = {
                    "position":"absolute",
                    "top":point.y + 8 +'px',
                    "left":point.x + 8 + 'px',
                    "width":"auto",
                    "height":"30px",
                    "display":"block",
                    "line-height":"34px",
                    "padding-left":"10px",
                    "padding-right":"10px",
                    "background-color":'#4fa184',
                    "color":'#fff',
                    "z-index":1
                };
                $("#mapTips").html(attributes["username"]);
                $("#mapTips").css(css);

                //g.setSymbol(new _w.PictureMarkerSymbol(symbol.url.replace("_1.png", ".png"), 35, 35).setOffset(0, 15));
                //this.highLightReachLine(evt);
            };
            this.hideName = function (evt) {
                this._map.setMapCursor("default");
                var g = evt.graphic;
                var symbol = g.symbol;
                //g.setSymbol(new _w.PictureMarkerSymbol(symbol.url.replace(".png", "_1.png"), 35, 35).setOffset(0, 15));
                //this.removeHighLightReachLine(evt);

                $("#mapTips").css("display","none");
            };
            this.addParentGraphic = function (spatialData, isShowing) {
                if(this._regionLayer !== null){
                    this._regionLayer.clear();
                }
                var polygon = new _w.Polygon(new _w.SpatialReference({wkid: 4326}));
                var sfs = new _w.SimpleFillSymbol(_w.SimpleFillSymbol.STYLE_SOLID,
                    new _w.SimpleLineSymbol(_w.SimpleLineSymbol.STYLE_SOLID, new _w.Color([56,168,0])).setWidth(1),new _w.Color([255, 255, 255, 0])
                );
                var primitive = Terraformer.WKT.parse(spatialData);
                if(spatialData.indexOf("MULTIPOLYGON") >= 0){
                    polygon.addRing(primitive.coordinates[0][0]);
                }else{
                    polygon.addRing(primitive.coordinates[0]);
                }
                var g = new _w.Graphic(polygon, sfs);
                this._regionLayer.add(g);

                // var extent = polygon.getExtent();
                // $scope.map.centerAt(extent.getCenter());
                // $scope.map.setExtent(extent.expand(1.2));

                MapTool.graphicflashing(polygon);

                if (!isShowing) {
                    g.hide();
                }

            };
            this.clear = function(){
                if(this._layer != null){
                    this._layer.clear();
                }
            };
            this.clearReginLayer = function () {
                if(this._regionLayer !== null){
                    this._regionLayer.clear();
                }
            };




        }]);