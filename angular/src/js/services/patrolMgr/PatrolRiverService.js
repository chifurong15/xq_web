/**
 * @description:  巡河轨迹类
 * @author: HuangSF
 * @date: 2018-8-7 9:14
 */
angular.module('app')
    .service('PatrolRiverService',[
        'wish',
        '$http',
        '$localStorage',
        'SymbolUtil',
        'MapUtil',
        function (wish, $http, $localStorage, SymbolUtil, MapUtil) {
            var _w = wish.get();
            this._map = null;
            this._layer = null;
            this._layerId = null;
            this._annoLayer = null; //标注
            this._isShowStationAnno = false;
            this._isShowRainValue = false;
            this._dataSource = null;
            //var _serviceUrl = $localStorage.integratedServer;
            var _serviceUrl = $localStorage.serviceUrl_patrolMgr;
            //http://10.0.9.149:8080/charimanPatrol/v1/getLocusDetailById

            var _patrolEventGraphicArray = [];
            var coordsArr;
            var patrolSymbolGraphic; //巡查轨迹图标
            var startImgPath, walkImgPath, endImgPath;
            var trackPbIndex;
            var timeout = null;
            var _that = this;

            this.init = function (map, layerId) {
                this._map = map;
                this._layerId = layerId;
                this._layer = new _w.GraphicsLayer({id: this._layerId, visible: true});
                this._annoLayer = new _w.GraphicsLayer({
                    id: this._layerId + "Anno",
                    minScale: 1154287.494417322456,
                    visible: true //需判断加载时，是否勾选
                });
                this._map.addLayers([this._layer, this._annoLayer]);
                //this.getDataList();
            };
            /**
             * 获取数据
             */
            this.getDataList = function () {
                /*if(this._dataSource && this._dataSource.length > 0){
                    _that.addGraphic(this._dataSource);
                    return;
                }
                $http({
                    method: "GET",
                    url: _serviceUrl + "charimanPatrol/v1/getLocusDetailById",
                    params: {locusId: "31a73d188bf94cd98a36a7748b3525f0"} //测试先取一条
                }).success(function (data) {debugger;
                    if(data.data && data.data.length > 0){
                        _that._dataSource = data.data;
                        _that.addGraphic(data.data);
                    }else{
                        console.warn("data is null");
                    }
                }).error(function(){
                    console.error("data query error");
                });*/

                /*var data1 = {
                    "coords": [{"x":117.4999248698455,"y":38.99397526482071,"t":1476951084000},
                        {"x":117.49597665817558,"y":38.998610121998446,"t":1476951089000},
                        {"x":117.49357339889823,"y":39.002901656422274,"t":1476951094000},
                        {"x":117.49082681686698,"y":39.008394820484774,"t":1476951099000},
                        {"x":117.48662111313163,"y":39.01277218559708,"t":1476951104000},
                        {"x":117.48104211838066,"y":39.011141402516024,"t":1476951109000},
                        {"x":117.47383234054863,"y":39.009853942188876,"t":1476951114000},
                        {"x":117.46336099655448,"y":39.01131306389298,"t":1476951119000},
                        {"x":117.45666620285331,"y":39.01474629143204,"t":1476951124000}],
                    "ehEvents": [{"x":117.49082681686698,"y":39.008394820484774,"ed":"生活垃圾事件"},
                        {"x":117.46336099655448,"y":39.01131306389298,"ed":"工业垃圾事件、工业垃圾事件、工业垃圾事件"},
                        {"x":117.49597665817558,"y":38.998610121998446,"ed":"今天天气不错真美"}
                    ]
                };


                dojo.connect(this._map, "onLoad", dojo.hitch(this, _that.addGraphic(data1)));*/
            };
            this.addGraphic = function(data){
                this.clear();
                var coords;
                if(data.coords != null && data.coords != "" && data.coords != "[]") {
                    coords = JSON.parse(data.coords);
                }
                var eventList = data.ehEvents;
                coordsArr = [];
                _patrolEventGraphicArray = [];

                startImgPath = "img/esri-icon/patrol/start.png";
                walkImgPath = "img/esri-icon/patrol/walk.png";
                endImgPath = "img/esri-icon/patrol/end.png";
                var startPoint, endPoint, startSymbol, endSymbol;
                if(timeout != null){
                    clearTimeout(timeout);
                }
                var polyline = new _w.Polyline(this._map.spatialReference);
                var lineSymbol = new _w.SimpleLineSymbol(_w.SimpleLineSymbol.STYLE_SOLID,
                    new esri.Color([253,1,1]),3);

                for(var i=0;i<coords.length;i++){
                    coordsArr.push([parseFloat(coords[i].x),parseFloat(coords[i].y)]);
                    var point = new _w.Point(parseFloat(coords[i].x), parseFloat(coords[i].y), this._map.spatialReference);
                    if(i == 0){
                        startSymbol = new _w.PictureMarkerSymbol(startImgPath,25,36).setOffset(0, 18);
                        startPoint = point;
                    }else if(i == (coords.length-1)){
                        endSymbol = new _w.PictureMarkerSymbol(endImgPath,25,36).setOffset(0, 18);
                        endPoint = point;
                    }/*else{
                        markerSymbol= new _w.SimpleMarkerSymbol({
                            "color": [255,255,255,64],
                            "size": 3,
                            "angle": -30,
                            "xoffset": 0,
                            "yoffset": 0,
                            "type": "esriSMS",
                            "style": "esriSMSCircle",
                            "outline": {
                                "color": [0,0,0,255],
                                "width": 1,
                                "type": "esriSLS",
                                "style": "esriSLSSolid"
                            }
                        });
                    }*/

                }
                polyline.addPath(coordsArr);

                var line = new _w.Graphic(polyline,lineSymbol);
                var g1 = new _w.Graphic(startPoint, startSymbol);
                var g2 = new _w.Graphic(endPoint, endSymbol);
                this._layer.add(line);
                this._layer.add(g1);
                this._layer.add(g2);

                if(eventList.length > 0) {
                    for(var i=0;i<eventList.length;i++){
                        if(MapUtil.isCoordValid(eventList[i].longitude, eventList[i].latitude)){
                            this.addPatrolEventPoint(eventList[i].longitude, eventList[i].latitude, eventList[i].content);
                        }else {
                            console.log("无效坐标");
                        }
                    }
                }
                if(_patrolEventGraphicArray != null && _patrolEventGraphicArray.length > 0) {
                    this.addPatrolEventPointToMap();
                }

                var x = (polyline.getExtent().xmax+polyline.getExtent().xmin)/2;
                var y = (polyline.getExtent().ymax+polyline.getExtent().ymin)/2;
                var centerPoint = new _w.Point(x,y,this._map.spatialReference);
                //this._map.setExtent(polyline.getExtent());
                this._map.centerAndZoom(centerPoint,13);

                this.displayTrackPlayback(this._map);
            };
            /**
             * 轨迹回放
             */
            this.displayTrackPlayback = function(map){
                //移除上一次轨迹回放时的巡查图标
                this._layer.remove(patrolSymbolGraphic);
                //轨迹数组下标
                trackPbIndex = 0;

                var that = this;
                //轨迹回放定时器
                function displayTrackPlaybackTimer(){
                    //存放轨迹数据
                    var trackPbArrTemp = [];
                    trackPbArrTemp.push(coordsArr[trackPbIndex]);
                    trackPbArrTemp.push(coordsArr[++trackPbIndex]);
                    //移除上一个终点图标
                    that._layer.remove(patrolSymbolGraphic);
                    //巡查图标
                    var patrolPoint = new _w.Point(parseFloat(trackPbArrTemp[1][0]), parseFloat(trackPbArrTemp[1][1]), that._map.spatialReference);
                    var patrolMarkerSymbol = new _w.PictureMarkerSymbol(walkImgPath,25,36).setOffset(0, 18);
                    patrolSymbolGraphic = new _w.Graphic(patrolPoint, patrolMarkerSymbol);
                    that._layer.add(patrolSymbolGraphic);

                    //检测当前坐标是否超出地图，若超出将其设为地图中心
                    var extent = that._map.extent;
                    if(!extent.contains(patrolSymbolGraphic.geometry)){
                        that._map.centerAndZoom(patrolPoint);
                    }
                    //循环播放轨迹
                    if(trackPbIndex == (coordsArr.length -1)){
                        //trackPbIndex = 0;
                        return;
                    }
                    timeout = setTimeout(displayTrackPlaybackTimer,500);
                }
                //开始画轨迹
                displayTrackPlaybackTimer();
            };
            //增加巡查轨迹事件
            this.addPatrolEventPoint = function (x, y, eventname) {
                var path = "img/esri-icon/patrol/event.png";
                var content = eventname;
                var reg = /[\u4E00-\u9FA5]/g;
                var num = content.match(reg).length;
                console.log(num);
                var sizey = 0;

                if(x > 0 && y > 0){
                    var symbol = new _w.PictureMarkerSymbol(path,25,36).setOffset(0,18);
                    var font = new _w.Font().setSize("12px").setWeight(_w.Font.WEIGHT_BOLD).setFamily("微软雅黑");//.setDecoration("underline");
                    var textsymbol = new _w.TextSymbol(eventname, font, new _w.Color([0, 0, 0]))
                        .setAlign(_w.TextSymbol.ALIGN_START)
                        .setOffset(14, 8).setHaloColor(new _w.Color([255, 255, 255])).setHaloSize(1);
                    var point = new _w.Point(x,y,this._map.spatialReference);
                    var g = new _w.Graphic(point, symbol);
                    var textgraphic = new _w.Graphic(point,textsymbol);

                    //var initColor = "#00ff00";
                    //var outColor = '#ffff00';
                    //var size = sizex*2;

                    var size = num*14;
                    var angle = 0;
                    //var path = "M512.04998 170.633346c-188.526357 0-341.166732 152.740336-341.166732 341.266693 0 188.426396 152.640375 341.166732 341.166732 341.166732s341.166732-152.740336 341.166732-341.166732C853.216712 323.373682 700.576337 170.633346 512.04998 170.633346zM512.04998 796.188989c-157.038657 0-284.28895-127.350254-284.28895-284.28895 0-157.138618 127.250293-284.388911 284.28895-284.388911 157.038657 0 284.28895 127.250293 284.28895 284.388911C796.33893 668.838735 669.088637 796.188989 512.04998 796.188989zM512.04998 0c-282.689574 0-511.800078 229.210465-511.800078 511.900039 0 282.689574 229.110504 511.700117 511.800078 511.700117 282.689574 0 511.800078-229.110504 511.800078-511.700117C1023.850059 229.210465 794.739555 0 512.04998 0zM512.04998 966.722374C260.848106 966.722374 57.127684 763.101913 57.127684 511.900039 57.127684 260.598204 260.848106 56.877782 512.04998 56.877782c251.301835 0 454.922296 203.720422 454.922296 455.022257C966.972276 763.101913 763.351816 966.722374 512.04998 966.722374zM512.04998 398.144475c-62.775478 0-113.755564 50.880125-113.755564 113.755564 0 62.775478 50.980086 113.755564 113.755564 113.755564 62.775478 0 113.755564-50.980086 113.755564-113.755564C625.805545 449.0246 574.825459 398.144475 512.04998 398.144475z";
                    var path = "img/esri-icon/patrol/event1.png";
                    //var markerSymbol = new _w.PictureMarkerSymbol(path,size,22).setOffset(5 + size*0.5,10);
                     var markerSymbol = new _w.PictureMarkerSymbol(path,size,20).setOffset(10 + size*0.5,11);
                    //markerSymbol.setPath(path);
                    //markerSymbol.setColor(new _w.Color(initColor));
                    //markerSymbol.setOutline(new _w.SimpleLineSymbol(_w.SimpleLineSymbol.STYLE_SOLID, new _w.Color(outColor), 1));
                    //markerSymbol.setSize(size);
                    //markerSymbol.setAngle(angle);
                    var g2 = new _w.Graphic(point, markerSymbol);
                    _patrolEventGraphicArray.push(g2);
                    _patrolEventGraphicArray.push(g);
                    _patrolEventGraphicArray.push(textgraphic);
                }
            };
            this.addPatrolEventPointToMap = function (){
                if(_patrolEventGraphicArray != null && _patrolEventGraphicArray.length > 0){
                    for(var i = 0;i<_patrolEventGraphicArray.length;i++){
                        this._layer.add(_patrolEventGraphicArray[i]);
                    }
                }
            };
            /**
             * 清除图层
             */
            this.clear = function(){
                this._layer.clear();
            };


}]);