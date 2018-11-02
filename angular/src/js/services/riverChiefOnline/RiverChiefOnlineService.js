/**
 * @description:  河长在线类
 * @author: HuangSF
 * @date: 2018-8-7 10:40
 */
angular.module('app')
    .service('RiverChiefOnlineService', [
        'wish',
        '$http',
        '$rootScope',
        '$localStorage',
        'SymbolUtil',
        'MapTool',
        'MapUtil',
        'tiandituFactory',
        'EventService',
        'PatrolRiverService',
        function (wish, $http, $rootScope, $localStorage, SymbolUtil, MapTool, MapUtil, tiandituFactory, EventService, PatrolRiverService) {
            var _w = wish.get();
            this._map = null;
            this._layer = null;
            this._layerId = null;
            this.userRegionId = null;
            this._annoLayer = null; //标注
            this._miniMap = null;
            this._reachLayer = null;
            this._patrolLayer = null;
            this._historyPatrolLayer = null;//历史轨迹
            this._highlightLayer = null;
            this._arrowLayer = null;
            this._eventLayer = null;
            this._isShowStationAnno = false;
            this._isShowRainValue = false;
            this._dataSource = null;
            this._oldCoords = [];//前一时刻的巡查轨迹点
            this._hasInfoWindow = false;  //是否有infowindow
            this._curHzId = null; //当前的河长
            this._patrolRefreshTime = 10000;

            this._markSymbolLayer = null;//点符号图层

            this._patrolSymbolGraphic = null; //巡查轨迹图标
            this._endPointGraphic = null; //终点图标
            this._patrolLine = null; //轨迹线
            this._patrolLineInterval = null; //轨迹线刷新的interval
            this._patrolEventGraphicArray = [];

            this.isGraphicClick = false;
            this._lastTwoPointsAngle = null;
            var _serviceUrl = $localStorage.serviceUrl_chiefOnline;
            var _patrolServiceUrl = $localStorage.serviceUrl_patrolMgr; //查询河道接口Url
            var _eventServiceUrl = $localStorage.serviceUrl_eventMgr;
            var coordsArr;

            var startImgPath, walkImgPath, endImgPath;
            var trackPbIndex;
            var timeout = null;
            //this.refreshDataTimer = null; //河长点位数据的计时器
            var refreshTime = 30000;
            var _that = this;
            //var _serviceUrl = "http://10.0.9.248:8088/";

            this.init = function (map, layerId, userRegionId) {
                this._map = map;
                this._layerId = layerId;
                this.userRegionId = userRegionId;
                this._layer = new _w.GraphicsLayer({id: this._layerId, visible: true});
                this._annoLayer = new _w.GraphicsLayer({
                    id: this._layerId + "Anno",
                    minScale: 1154287.494417322456,
                    visible: true //需判断加载时，是否勾选
                });
                this._reachLayer = new _w.GraphicsLayer({id: "reachLayer"});
                this._patrolLayer = new _w.GraphicsLayer({id: "patrolLayer"});
                this._historyPatrolLayer = new _w.GraphicsLayer({id: "historyPatrolLayer"});
                this._highlightLayer = new _w.GraphicsLayer({id: "highlightLayer"});
                this._arrowLayer = new _w.GraphicsLayer({id: "arrowLayer"});
                this._eventLayer = new _w.GraphicsLayer({id: "eventLayer"});
                this._markSymbolLayer = new _w.GraphicsLayer({id:"markSymbolLayer"});
                this._map.addLayers([this._annoLayer, this._patrolLayer, this._historyPatrolLayer, this._highlightLayer, this._eventLayer, this._layer,this._markSymbolLayer]);
                this.createMiniMap();
                //this._miniMap.addLayers([this._reachLayer, this._patrolLayer, this._arrowLayer]);
                dojo.connect(this._layer, "onMouseOver", dojo.hitch(this, this.showName));
                dojo.connect(this._layer, "onMouseOut", dojo.hitch(this, this.hideName));
                //dojo.connect(this._layer, "onClick", dojo.hitch(this, this.showInfoWindow));
                dojo.connect(this._layer, "onClick", dojo.hitch(this, this.showCurrentClickPatrol));
                dojo.connect(this._historyPatrolLayer, "onClick", dojo.hitch(this, this.showClickHistoryPatrolDetail));
                dojo.connect(this._historyPatrolLayer, "onMouseOver", dojo.hitch(this, this.showHighlightGraphic));
                dojo.connect(this._historyPatrolLayer, "onMouseOut", dojo.hitch(this, this.removeHighlightGraphic));

                //dojo.connect(this._eventLayer, "onClick", dojo.hitch(this, this.showEventInfoWindow));
                dojo.connect(this._eventLayer, "onClick", dojo.hitch(EventService, EventService.showInfoWindow));
                //this.getDataList();
                //this.refreshData();
            };
            /**
             * 获取数据
             */
            this.getDataList = function () {
                /*if(this._dataSource && this._dataSource.length > 0){
                    _that.addGraphic(this._dataSource);
                    return;
                }*/
                console.log('refresh DataList');
                if(this._layer != null){
                    this.clear();
                    if(this.isGraphicClick){
                        this._map.infoWindow.hide();
                        this.isGraphicClick = false;
                    }
                }
                $http({
                    method: "GET",
                    url: _serviceUrl + "/chairmanOnline/v1/search/" + this.userRegionId,
                    params: {
                        hzname: "",
                        status: "Y,L", //Y,L,O
                        level: "2,3,4,5"
                    }
                }).success(function (data) {
                    if(data.data && data.data.length > 0){
                        //_that._dataSource = data.data;
                        _that.addGraphic(data.data);
                    }else{
                        console.warn("data is null");
                    }
                }).error(function(){
                    console.error("data query error");
                });


                //----------------------------测试数据----------------------------------------------------
                /*var data1 = {
                    data: [
                        {
                            cellphone: "15378377507",
                            chairmanlevel: 2,
                            cityid: 120100000000,
                            cityname: "天津市",
                            countyid: null,
                            countyname: "",
                            duty: "--",
                            id: "0dc9db2293bf11e88338fa163e29a9e1",
                            latitude: 38.89399422121651, //116.88167078849942, 38.89399422121651
                            longitude: 116.88167078849942,
                            offtime: "2018-08-12 17:13:27",
                            ontime: "2018-08-12 17:12:43",
                            provinceid: 120000000000,
                            provincename: "天津直辖市",
                            reach: "海河",//"卫津河",
                            river: "海河",
                            rolename: "河长",
                            status: 2, //1在线2巡河
                            townid: null,
                            townname: "",
                            username: "市级河长",
                            villageid: null,
                            villagename: ""
                        },
                        {
                            cellphone: "15378377507",
                            chairmanlevel: 3,
                            cityid: 120100000000,
                            cityname: "天津市",
                            countyid: 120103000000,
                            countyname: "津南区",//"河西区",
                            duty: "--",
                            id: "0dc9db2293bf11e88338fa163e29a9e1_1",
                            latitude: 39.01277218559708,
                            longitude: 117.48662111313163,
                            offtime: "2018-08-12 17:13:27",
                            ontime: "2018-08-12 17:12:43",
                            provinceid: 120000000000,
                            provincename: "天津直辖市",
                            reach: "海河",//"卫津河",
                            river: "海河",
                            rolename: "河长",
                            status: 2,
                            townid: null,
                            townname: "",
                            username: "县级河长",
                            villageid: null,
                            villagename: ""
                        },
                        {
                            cellphone: "15378377507",
                            chairmanlevel: 3,
                            cityid: 120100000000,
                            cityname: "天津市",
                            countyid: 120103000000,
                            countyname: "津南区",//"河西区",
                            duty: "--",
                            id: "0dc9db2293bf11e88338fa163e29a9e1_2",
                            latitude: 39.52296150637276, //117.17006190178067, 39.52296150637276
                            longitude: 117.17006190178067,
                            offtime: "2018-08-12 17:13:27",
                            ontime: "2018-08-12 17:12:43",
                            provinceid: 120000000000,
                            provincename: "天津直辖市",
                            reach: "海河",//"卫津河",
                            river: "海河",
                            rolename: "河长",
                            status: 1,
                            townid: null,
                            townname: "",
                            username: "县级河长",
                            villageid: null,
                            villagename: ""
                        },
                        {
                            cellphone: "15378377507",
                            chairmanlevel: 4,
                            cityid: 120100000000,
                            cityname: "天津市",
                            countyid: 120103000000,
                            countyname: "津南区",//"河西区",
                            duty: "--",
                            id: "0dc9db2293bf11e88338fa163e29a9e1_3",
                            latitude: 38.77262440887299, //117.24421961662443, 38.77262440887299
                            longitude: 117.24421961662443,
                            offtime: "2018-08-12 17:13:27",
                            ontime: "2018-08-12 17:12:43",
                            provinceid: 120000000000,
                            provincename: "天津直辖市",
                            reach: "海河",//"卫津河",
                            river: "海河",
                            rolename: "河长",
                            status: 1,
                            townid: 120101001000,
                            townname: "劝业场街道",//劝业场街道
                            username: "县级河长",
                            villageid: null,
                            villagename: ""
                        }
                    ],
                        resCode: 1,
                    resMsg: "Success"
                };

                _that.addGraphic(data1.data);*/
            };
            this.getDataById = function (id) {
                if(this._curHzId != null){
                    if(this._curHzId !== id){
                        if(this._patrolLayer !== null){
                            this._patrolLayer.clear();
                        }
                    }
                }

                var patrolId;
                $http({
                    method: "GET",
                    url: _serviceUrl + "/chairmanOnline/v1/getTrackDetail",
                    params: {userId: id}
                }).success(function (data) {
                    if(data.data && data.resCode == 1){
                        _that._curHzId = id;
                        _that.getRefreshPatrol();
                        _that.addPatrolLineToMap(data.data);
                        patrolId = data.data.patrolId;

                        //查询巡河河道信息
                        _that.getReachLineByPatrolId(patrolId);
                    }else{
                        console.error("PatrolLine data is null");
                    }
                }).error(function(){
                    console.error("data query error");
                });

                //实时轨迹测试数据
                /*var item;
                if(iii === 0){
                    item = {
                        coords: [{"x": 117.4999248698455, "y": 38.99397526482071, "t": 1476951084000},
                            {"x": 117.49597665817558, "y": 38.998610121998446, "t": 1476951089000},
                            {"x": 117.49357339889823, "y": 39.002901656422274, "t": 1476951094000},
                            {"x": 117.49082681686698, "y": 39.008394820484774, "t": 1476951099000},
                            {"x": 117.48662111313163, "y": 39.01277218559708, "t": 1476951104000},
                            {"x": 117.48104211838066, "y": 39.011141402516024, "t": 1476951109000},
                            {"x": 117.47383234054863, "y": 39.009853942188876, "t": 1476951114000},
                            {"x": 117.46336099655448, "y": 39.01131306389298, "t": 1476951119000},
                            {"x": 117.45666620285331, "y": 39.01474629143204, "t": 1476951124000}]
                    };
                    iii++;
                }else {
                    item = {
                        coords: [{"x": 117.4999248698455, "y": 38.99397526482071, "t": 1476951084000},
                            {"x": 117.49597665817558, "y": 38.998610121998446, "t": 1476951089000},
                            {"x": 117.49357339889823, "y": 39.002901656422274, "t": 1476951094000},
                            {"x": 117.49082681686698, "y": 39.008394820484774, "t": 1476951099000},
                            {"x": 117.48662111313163, "y": 39.01277218559708, "t": 1476951104000},
                            {"x": 117.48104211838066, "y": 39.011141402516024, "t": 1476951109000},
                            {"x": 117.47383234054863, "y": 39.009853942188876, "t": 1476951114000},
                            {"x": 117.46336099655448, "y": 39.01131306389298, "t": 1476951119000},
                            {"x": 117.45666620285331, "y": 39.01474629143204, "t": 1476951124000},
                            {"x": 117.44782564194023, "y": 39.01993904808487, "t": 1476951119000}, //117.44782564194023, 39.01993904808487
                            {"x": 117.4625885203582, "y": 39.02328644493546, "t": 1476951124000},//117.4625885203582, 39.02328644493546
                            {"x": 117.47816679031669, "y": 39.01966009834732, "t": 1476951124000}]//117.47816679031669, 39.01966009834732


                    };
                }


                _that.addPatrolLineToMap(item);*/

            };
            this.getRefreshPatrol = function(){
                console.log("getRefreshPatrol");
                $http({
                    method: "GET",
                    url: _serviceUrl + "/chairmanOnline/v1/getTrackDetail",
                    params: {userId: this._curHzId}
                }).success(function (data) {
                    //if(data.resCode == 1){
                    if(data.data && data.resCode == 1){
                        var item = data.data;
                        var coords;
                        if(item.coords != [] && item.coords != null && item.coords != "") {
                            if (typeof item["coords"] === "string" && item["coords"] != "[]") {
                                coords = JSON.parse(item.coords);
                            } else {
                                coords = item.coords
                            }
                        }

                        //测试数据
                        //var coords =[{"x":117.4999248698455,"y":38.99397526482071,"t":1476951084000},
                        //    {"x":117.49597665817558,"y":38.998610121998446,"t":1476951089000},
                        //    {"x":117.49357339889823,"y":39.002901656422274,"t":1476951094000},
                        //    {"x":117.49082681686698,"y":39.008394820484774,"t":1476951099000},
                        //    {"x":117.48662111313163,"y":39.01277218559708,"t":1476951104000},
                        //    {"x":117.48104211838066,"y":39.011141402516024,"t":1476951109000},
                        //    {"x":117.47383234054863,"y":39.009853942188876,"t":1476951114000},
                        //    {"x":117.46336099655448,"y":39.01131306389298,"t":1476951119000},
                        //    {"x":117.45666620285331,"y":39.01474629143204,"t":1476951124000},
                        //    {"x":117.48656620286331,"y":39.05475629183204,"t":1476951124000},
                        //    {"x":117.47676620276331,"y":39.03476629383204,"t":1476951124000},
                        //    {"x":117.49676620276331,"y":39.05476629383204,"t":1476951124000}];

                        //轨迹变化测试
                        /*var coords = [{"x": 117.4999248698455, "y": 38.99397526482071, "t": 1476951084000},
                                {"x": 117.49597665817558, "y": 38.998610121998446, "t": 1476951089000},
                                {"x": 117.49357339889823, "y": 39.002901656422274, "t": 1476951094000},
                                {"x": 117.49082681686698, "y": 39.008394820484774, "t": 1476951099000},
                                {"x": 117.48662111313163, "y": 39.01277218559708, "t": 1476951104000},
                                {"x": 117.48104211838066, "y": 39.011141402516024, "t": 1476951109000},
                                {"x": 117.47383234054863, "y": 39.009853942188876, "t": 1476951114000},
                                {"x": 117.46336099655448, "y": 39.01131306389298, "t": 1476951119000},
                                {"x": 117.45666620285331, "y": 39.01474629143204, "t": 1476951124000},
                                {"x": 117.44782564194023, "y": 39.01993904808487, "t": 1476951119000}, //117.44782564194023, 39.01993904808487
                                {"x": 117.4625885203582, "y": 39.02328644493546, "t": 1476951124000},//117.4625885203582, 39.02328644493546
                                {"x": 117.47816679031669, "y": 39.01966009834732, "t": 1476951124000}];//117.47816679031669, 39.01966009834732*/


                        if(coords.length === 1 && coords !== "[]"){
                            return;
                        }
                        var tmpC =[];
                        var count = 0;
                        var has = -1;
                        for(var i=0;i<coords.length;i++){
                            has = -1;
                            if(tmpC.length == 0 ){
                                tmpC[count] = coords[i];
                                count++;
                            }else{
                                for(var j = 0; j < tmpC.length; j++){
                                    if(tmpC[j].x == coords[i].x && tmpC[j].y == coords[i].y ){
                                        has = 1;
                                        this._markSymbolLayer.clear();
                                    }
                                }
                                if(has == -1){
                                    tmpC[count] = coords[i];
                                    count++;
                                }
                            }
                        }

                        var coordsArr = [];
                        var point;
                        endImgPath = "img/esri-icon/patrol/end.png";
                        for(var i=0;i<tmpC.length;i++){
                            coordsArr.push([parseFloat(tmpC[i].x),parseFloat(tmpC[i].y)]);
                        }
                        if(_that._oldCoords.length == 0 &&coordsArr.length > 2 ){
                            _that.getDataById(_that._curHzId);
                        }
                        else if(coordsArr.length == _that._oldCoords.length){
                            return;
                        }else{
                            //_that._patrolLayer.remove(_that.endPointGraphic);
                            point = new _w.Point(parseFloat(coordsArr[coordsArr.length-1][0]), parseFloat(coordsArr[coordsArr.length-1][1]), _that._miniMap.spatialReference);
                            //point = new _w.Point(parseFloat(coordsArr[coordsArr.length-1][0]), parseFloat(coordsArr[coordsArr.length-1][1]), _that._miniMap.spatialReference);
                            //var endSymbol = new _w.PictureMarkerSymbol(endImgPath,25,36).setOffset(0, 18);
                            //var endPoint = point;
                            //_that._endPointGraphic = new _w.Graphic(endPoint, endSymbol);
                            var newCoord = [];
                            for(var j =  _that._oldCoords.length; j < coordsArr.length; j++){
                                point = new _w.Point(parseFloat(coordsArr[j][0]), parseFloat(coordsArr[j][1]), _that._miniMap.spatialReference);
                                //point = new _w.Point(parseFloat(coordsArr[j][0]), parseFloat(coordsArr[j][1]), _that._miniMap.spatialReference);
                                _that._patrolLine.insertPoint(0, j, point);
                                newCoord.push(coordsArr[j]);
                            }
                            _that._patrolLayer.redraw();
                            _that.changeExtentByPatrolLine();
                            //_that._patrolLayer.add(_that._endPointGraphic);
                            if(newCoord.length > 1){//需求不显示轨迹最后点
                                //_that.displayTrackPlayback(newCoord,2000);
                            }
                            _that._oldCoords = coordsArr;
                        }
                    }else{
                        console.error("data is null");
                    }
                }).error(function(){
                    console.error("data query error");
                });

            };
            /*var i = 0;
            this.refreshData = function () {
                this.refreshDataTimer = null;
                clearInterval(this.refreshDataTimer);
                this.refreshDataTimer = setInterval(function(){
                    _that.getDataList();
                    },refreshTime);

            };*/
            this.refreshPatrolLine = function(){
                _that._patrolLineInterval = null;
                clearInterval(_that._patrolLineInterval);

                if(_that._hasInfoWindow == true){
                    _that._patrolLineInterval = setInterval(function(){
                        _that.getRefreshPatrol();
                    }, _that._patrolRefreshTime);
                }
            };

            this.addGraphic = function(data){
                //this.clear();
                if(this._layer !== null){
                    this.clear();
                    if(this.isGraphicClick){
                        this._map.infoWindow.hide();
                        this.isGraphicClick = false;
                    }
                }

                var len = data.length;
                var item,coords,point,iconObject,picMarkerSymbol,graphic;
                for(var i=0;i<len;i++){
                    item = data[i];
                    // console.log("河长在线["+ i +"]坐标: " + item.longitude + ", " + item.latitude);
                    if(item["status"] == 0){
                        continue;
                    }
                    if(MapUtil.isCoordValid(item.longitude, item.latitude)){ //数字类型
                        var regionName = this.getRegionInfo(item);
                        item.regionName = regionName;
                        this.createLayerAnno(item);
                        point = new _w.Point(item.longitude, item.latitude, this._map.spatialReference);
                        iconObject = this.getIconPath(item["status"]);
                        if(this._curHzId !== null && item["status"] == 2){
                            /*if(this._lastTwoPointsAngle && this._lastTwoPointsAngle !== null && this._lastTwoPointsAngle > 90 && this._lastTwoPointsAngle < 270) {
                                iconObject.path = "img/esri-icon/patrol/walkL.gif";
                            }else {
                                iconObject.path = "img/esri-icon/patrol/walkR.gif";
                            }*/
                            iconObject.path = this.getIconPathByAngle(this._lastTwoPointsAngle);
                        }
                        picMarkerSymbol = SymbolUtil.getPictureMarkerSymbol(iconObject.path, iconObject.sizeX, iconObject.sizeY);
                        graphic = new _w.Graphic(point, picMarkerSymbol);
                        if(item["status"] == 1){
                            item.type = "河长在线";
                        } else if(item["status"] == 2){
                            item.type = "河长巡河";
                        }
                        graphic.attributes = item;
                        this._layer.add(graphic);

                    }else{
                        console.info("无效坐标!");
                    }

                }
            };
            this.getIconPathByAngle = function (angle) {
                if(angle && angle !== null) {
                    var _path;
                    if(angle>=337.5 && angle<22.5){ //东
                        _path = "img/esri-icon/patrol/walkE.gif";
                    }else if(angle>=22.5 && angle<67.5){ //东南
                        _path = "img/esri-icon/patrol/walkSE.gif";
                    }else if(angle>=67.5 && angle<112.5){ //南
                        _path = "img/esri-icon/patrol/walkS.gif";
                    }else if(angle>=112.5 && angle<157.5){ //西南
                        _path = "img/esri-icon/patrol/walkSE.gif";
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
            this.addEventGraphic = function (item) {
                //判断是否已存在
                if(this._eventLayer != null){
                    this._eventLayer.clear();
                }

                var point,iconObject,picMarkerSymbol,graphic;
                if(MapUtil.isCoordValid(item.longitude, item.latitude)){ //数字类型
                    point = new _w.Point(item.longitude, item.latitude, this._map.spatialReference);
                    iconObject = EventService.getIconPath(item["eventStatus"]);
                    picMarkerSymbol = SymbolUtil.getPictureMarkerSymbol(iconObject.path, iconObject.sizeX, iconObject.sizeY).setOffset(0, 0);
                    graphic = new _w.Graphic(point, picMarkerSymbol);
                    item.type = "事件";
                    graphic.attributes = item;
                    this._eventLayer.add(graphic);

                    MapUtil.centerAtPoint(point);
                }else{
                    console.info("无效坐标!");
                    alert("无坐标信息");
                }
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
            this.createLayerAnno = function (item) {
                var point = new _w.Point(item.longitude, item.latitude, this._map.spatialReference);
                var name = this.setAnnoValue(item);
                var textSymbol = this.setTextSymbol("河长在线", name);
                var textGraphic = new _w.Graphic(point, textSymbol);
                textGraphic.attributes = item;
                this._annoLayer.add(textGraphic);
            };
            this.setTextSymbol = function (type ,name) {
                var font, textSymbol;
                if(type == "河长在线") {
                    font = new _w.Font("12px", _w.Font.STYLE_NORMAL, _w.Font.VARIANT_NORMAL, _w.Font.WEIGHT_LIGHTER, "微软雅黑").setDecoration("none");
                    textSymbol = new _w.TextSymbol(name, font, new _w.Color([0, 0, 0]))
                        .setAlign(_w.TextSymbol.ALIGN_START)
                        .setOffset(12, 0).setHaloColor(new _w.Color([255, 255, 255])).setHaloSize(1);
                }else {
                    font = new _w.Font("12px", _w.Font.STYLE_NORMAL, _w.Font.VARIANT_NORMAL, _w.Font.WEIGHT_LIGHTER, "微软雅黑").setDecoration("none");
                    textSymbol = new _w.TextSymbol(name, font, new _w.Color([0, 0, 0]))
                        .setAlign(_w.TextSymbol.ALIGN_START)
                        .setOffset(12, 0).setHaloColor(new _w.Color([255, 255, 255])).setHaloSize(1);
                }

                return textSymbol;
            };
            /**
             * 获取图标路径
             */
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
                        iconObject.path = "img/esri-icon/patrol/walkL.gif";
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
                    "left":point.x + 210 + 'px',
                    "width":"auto",
                    "height":"30px",
                    "display":"block",
                    //"line-height":"34px",
                    "padding-left":"10px",
                    "padding-right":"10px",
                    "background-color":'#4fa184',
                    "color":'#fff',
                    "z-index":1000
                };
                $("#mapTips").html(attributes["username"]);
                $("#mapTips").css(css);
            };
            this.hideName = function (evt) {
                this._map.setMapCursor("default");
                var g = evt.graphic;
                var symbol = g.symbol;

                $("#mapTips").css("display","none");
            };
            /**
             * 详细信息，一次只能看到一个在线河长的详情
             * @param e
             */
            this.showInfoWindow = function(e){
                this._map.infoWindow.hide();
                this.isGraphicClick = true;
                this._map.setMapCursor("pointer");
                var Graphic = e.graphic;
                var isPatroling = "";
                var pInfoWindow = this._map.infoWindow;
                pInfoWindow.setTitle("详情");
                if(Graphic.attributes["status"] === 1){
                    //isPatroling = "<div style='margin: 10px;'><input type='button' disabled value='不可用' class='btn btn-default btn-sm'></div>";
                    isPatroling = "";
                }else {
                    isPatroling = "<div style='margin: 10px;' id='checkCircleEve'><input type='button' value='查看轨迹' class='btn btn-primary btn-sm' style='cursor:pointer;'></div>";
                }
                var pHtml = "<div><table class='form_custom'>"
                    + "<tr><th width='40%'>河长姓名:</th><td>" + Graphic.attributes["username"] + "</td></tr>"
                    + "<tr><th>所属区域:</th><td>" + Graphic.attributes["regionName"] + "</td></tr>"
                    + "<tr><th>级&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;别:</th><td>" + this.getGradeName(Graphic.attributes["chairmanlevel"]) + "</td></tr>"
                    + "<tr><th>角&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;色:</th><td>" + Graphic.attributes["rolename"] + "</td></tr>"
                    + "<tr><th>职&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;务:</th><td>" + ((Graphic.attributes["duty"] === "") ? "--" : Graphic.attributes["duty"]) + "</td></tr>"
                    + "</td></tr><tr><th>责任河段：</th><td>" + Graphic.attributes["reach"] + "</td></tr>"
                    + "</table></div>" + isPatroling;

                pInfoWindow.resize(220, 290);
                pInfoWindow.setContent(pHtml);
                pInfoWindow.show(this._map.toScreen(Graphic.geometry));
                var oDiv = document.getElementById('checkCircleEve');
                if(oDiv != null){
                    oDiv.addEventListener('click',function(){
                        //var _miniMap = _that.createMiniMap(Graphic.attributes["id"]);
                        $('#checkCircle').modal('show');
                        //$("#checkCircle").modal({show:true, backdrop:'static'});
                        //_that.addPatrolLineToMap(Graphic.attributes["coords"]);
                        _that.getDataById(Graphic.attributes["id"]);
                        _that._curHzId = Graphic.attributes["id"];
                        _that._hasInfoWindow = true;
                        _that.refreshPatrolLine();
                        $('#checkCircle').on('hide.bs.modal', function () {
                        });
                    });
                }
            };
            this.addGraphicByTableSelect = function (patrolArr) {
                console.log(patrolArr);
                if(patrolArr.length !== 0){
                    var len = patrolArr.length;
                    var coords = [];
                    for(var i=0;i<len;i++){
                        var item = patrolArr[i];
                        if(item.coords == "[]"){
                            continue;
                        }
                        //判断是否已在地图中
                        if(this._historyPatrolLayer.graphics.length !== 0){
                            if(MapTool.graphicOnMap(this._historyPatrolLayer, item["id"])){
                                continue;
                            }
                        }

                        if(item.coords !== [] && item.coords !== null && item.coords !== "") {
                            if (typeof item["coords"] === "string" && item["coords"] !== "[]") {
                                coords = JSON.parse(item.coords);
                            } else {
                                coords = item.coords;
                            }
                        }

                        //轨迹只有一个点时，不绘制
                        if(coords.length === 1 && coords == "[]"){
                            return;
                        }

                        //测试数据
                        /*coords =[{"x":117.4999248698455,"y":38.99397526482071,"t":1476951084000},
                            {"x":117.49597665817558,"y":38.998610121998446,"t":1476951089000},
                            {"x":117.49357339889823,"y":39.002901656422274,"t":1476951094000},
                            {"x":117.49082681686698,"y":39.008394820484774,"t":1476951099000},
                            {"x":117.48662111313163,"y":39.01277218559708,"t":1476951104000},
                            {"x":117.48104211838066,"y":39.011141402516024,"t":1476951109000},
                            {"x":117.47383234054863,"y":39.009853942188876,"t":1476951114000},
                            {"x":117.46336099655448,"y":39.01131306389298,"t":1476951119000},
                            {"x":117.45666620285331,"y":39.01474629143204,"t":1476951124000},
                            {"x":117.48656620286331,"y":39.05475629183204,"t":1476951124000},
                            {"x":117.47676620276331,"y":39.03476629383204,"t":1476951124000},
                            {"x":117.49676620276331,"y":39.05476629383204,"t":1476951124000}];*/

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
                            var point = new _w.Point(parseFloat(tmpC[i].x), parseFloat(tmpC[i].y), this._map.spatialReference);
                            coordsArr.push(point);
                        }

                        var polyline = new _w.Polyline().addPath(coordsArr);
                        var line = new _w.Graphic(polyline,lineSymbol);
                        line.attributes = item;
                        this._historyPatrolLayer.add(line);

                        var extent = polyline.getExtent();
                        this._map.centerAt(extent.getCenter());
                        this._map.setExtent(extent.expand(2));


                        /*var testEvents = [{"x":117.49082681686698,"y":39.008394820484774,"ed":"生活垃圾事件"},
                            {"x":117.46336099655448,"y":39.01131306389298,"ed":"工业垃圾事件、工业垃圾事件、工业垃圾事件"},
                            {"x":117.49597665817558,"y":38.998610121998446,"ed":"今天天气不错真美"}
                        ];*/


                        var eventData = { data: [
                                {
                                    acceptdate: null,
                                    acceptdateStr: "",
                                    acceptperson: "",
                                    acceptpersonid: "",
                                    addCount: 0,
                                    address: "金华市浦江县",
                                    cityreachid: "26d5b22193aa11e88338fa163e29a9e1",
                                    clicknumber: null,
                                    componentid: "",
                                    contactaddress: "浙江省",
                                    contactway: "18626889010",
                                    content: "今天天气不错",
                                    count: 0,
                                    countyreachid: "",
                                    createtime: "2018-09-13 09:41:31",
                                    createtimeEnd: null,
                                    createtimeStart: null,
                                    createtimeStr: "",
                                    datasrccode: null,
                                    datatype: null,
                                    dataupflag: null,
                                    endtime: null,
                                    eventDTO: null,
                                    eventStatus: "处理中", //"未知",
                                    eventbasinid: "",
                                    eventbasinname: "",
                                    eventbelongcity: "天津市",
                                    eventbelongcityid: 120100000000,
                                    eventbelongcounty: "",
                                    eventbelongcountyid: null,
                                    eventbelongprovince: "天津市",
                                    eventbelongprovinceid: 120000000000,
                                    eventbelongtown: "",
                                    eventbelongtownid: null,
                                    eventbelongvillage: "",
                                    eventbelongvillageid: null,
                                    eventgridid: "",
                                    eventgridname: "",
                                    eventlevel: "0",
                                    eventoccurareaid: 120100000000,
                                    eventreachid: "06deb4ff9c9611e88338fa163e39a9e1",
                                    eventreachname: "卫津河天津市段",
                                    eventresource: "A",
                                    eventriverid: "fea3e45293a511e88338fa163e29a9e1",
                                    eventrivername: "卫津河",
                                    eventrivertype: "1",
                                    eventversion: "simpleProcess",
                                    finishCount: 0,
                                    handlerid: "",
                                    id: "ea3dd5d1b6f511e8b494f01fafcf3a37",
                                    inspectdesc: "",
                                    inspector: "",
                                    inspectorid: "",
                                    inspectstatus: "",
                                    inspecttime: null,
                                    instructionId: "",
                                    isRddbEvent: "",
                                    isexposure: "",
                                    isinstruction: "",
                                    isprivary: "0",
                                    issupervise: "",
                                    istrue: null,
                                    latitude: 39.008394820484774,  //{"x":117.49082681686698,"y":39.008394820484774
                                    longitude: 117.49082681686698,
                                    month: "",
                                    nextStatus: "",
                                    patrolid: "26dadc9393aa11e88338fa163e29a9e1", //关联事件，取消事件有用
                                    percent: 0,
                                    praisenumber: null,
                                    processingtime: null,
                                    provincereachid: "d8e5537693bd11e88338fa163e29a9e1",
                                    recver: null,
                                    region: "",
                                    regionName: "",
                                    reportperson: "天津市河长办1",
                                    reportpersonid: "a93d9c733e02448187814df7e8f433c9",
                                    reportphone: "13562545879",
                                    reporttime: "2018-09-13 09:41:31",
                                    reporttimeStr: "",
                                    resourceName: "",
                                    respContent: "",
                                    respUser: "",
                                    respUsername: "",
                                    serialno: "330000201809130001",
                                    simpleflag: null,
                                    src: "",
                                    srcid: "",
                                    starttime: null,
                                    status: "J2",
                                    submitRoleId: "",
                                    totalCount: 0,
                                    townreachid: "",
                                    type: "100000016",
                                    typename: "堤岸垃圾",
                                    uploadtime: null,
                                    villagereachid: "",
                                    worklogid: "",
                                    year: "",
                                    yearMonth: ""
                                },
                                {
                                    acceptdate: null,
                                    acceptdateStr: "",
                                    acceptperson: "",
                                    acceptpersonid: "",
                                    addCount: 0,
                                    address: "金华市浦江县",
                                    cityreachid: "26d5b22193aa11e88338fa163e29a9e1",
                                    clicknumber: null,
                                    componentid: "",
                                    contactaddress: "浙江省",
                                    contactway: "18626889010",
                                    content: "河水清澈",
                                    count: 0,
                                    countyreachid: "",
                                    createtime: "2018-09-12 21:00:26",
                                    createtimeEnd: null,
                                    createtimeStart: null,
                                    createtimeStr: "",
                                    datasrccode: null,
                                    datatype: null,
                                    dataupflag: null,
                                    endtime: null,
                                    eventDTO: null,
                                    eventStatus: "未知",
                                    eventbasinid: "",
                                    eventbasinname: "",
                                    eventbelongcity: "天津市",
                                    eventbelongcityid: 120100000000,
                                    eventbelongcounty: "",
                                    eventbelongcountyid: null,
                                    eventbelongprovince: "天津市",
                                    eventbelongprovinceid: 120000000000,
                                    eventbelongtown: "",
                                    eventbelongtownid: null,
                                    eventbelongvillage: "",
                                    eventbelongvillageid: null,
                                    eventgridid: "",
                                    eventgridname: "",
                                    eventlevel: "0",
                                    eventoccurareaid: 120100000000,
                                    eventreachid: "06deb4ff9c9611e88338fa163e39a9e1",
                                    eventreachname: "卫津河天津市段",
                                    eventresource: "A",
                                    eventriverid: "fea3e45293a511e88338fa163e29a9e1",
                                    eventrivername: "卫津河",
                                    eventrivertype: "1",
                                    eventversion: "simpleProcess",
                                    finishCount: 0,
                                    handlerid: "",
                                    id: "9820d524b68b11e8b494f01fafcf3a37",
                                    inspectdesc: "",
                                    inspector: "",
                                    inspectorid: "",
                                    inspectstatus: "",
                                    inspecttime: null,
                                    instructionId: "",
                                    isRddbEvent: "",
                                    isexposure: "",
                                    isinstruction: "",
                                    isprivary: "0",
                                    issupervise: "",
                                    istrue: null,
                                    latitude: 39.01131306389298, //{"x":117.46336099655448,"y":39.01131306389298,
                                    longitude: 117.46336099655448,
                                    month: "",
                                    nextStatus: "",
                                    patrolid: "26dadc9393aa11e88338fa163e29a9e1",
                                    percent: 0,
                                    praisenumber: null,
                                    processingtime: null,
                                    provincereachid: "d8e5537693bd11e88338fa163e29a9e1",
                                    recver: null,
                                    region: "",
                                    regionName: "",
                                    reportperson: "天津市河长办1",
                                    reportpersonid: "a93d9c733e02448187814df7e8f433c9",
                                    reportphone: "13562545879",
                                    reporttime: "2018-09-12 21:00:26",
                                    reporttimeStr: "",
                                    resourceName: "",
                                    respContent: "",
                                    respUser: "",
                                    respUsername: "",
                                    serialno: "330000201809120009",
                                    simpleflag: null,
                                    src: "",
                                    srcid: "",
                                    starttime: null,
                                    status: "L2",
                                    submitRoleId: "",
                                    totalCount: 0,
                                    townreachid: "",
                                    type: "100000016",
                                    typename: "堤岸垃圾",
                                    uploadtime: null,
                                    villagereachid: "",
                                    worklogid: "",
                                    year: "",
                                    yearMonth: ""
                                }]};


                        //绘制当前历史轨迹上的事件
                        //查询轨迹事件接口  线上26dadc9393aa11e88338fa163e29a9e1   本地0a4c419187314a8ca6a0b2723c6df8e9
                        //http://10.0.9.248:20001/v1/event/findEventByPatrolIds?patrolIds=0a4c419187314a8ca6a0b2723c6df8e9
                        $http({
                            method: "GET",
                            url: _eventServiceUrl + "v1/event/findEventByPatrolIds",
                            params: {patrolIds: patrolArr[0].reachid}
                        }).success(function (data) {
                            if(data.data && data.data.length > 0){
                                _that.addCurrentHistoryPatrolEvents(data.data);
                            }else{
                                console.warn("event data is null");
                            }
                        }).error(function(){
                            console.error("event data query error");
                        });

                        //事件测试
                        //this.addCurrentHistoryPatrolEvents(eventData.data);

                    }
                }else {
                    return;
                }
            };
            this.addOneDayHistoryPatrolByTableSelect = function (patrolArr) {
                console.log(patrolArr);
                debugger;
                if(patrolArr.length !== 0){
                    var len = patrolArr.length;
                    var coords = [];
                    for(var i=0;i<len;i++){
                        var item = patrolArr[i];
                        if(item.coords == "[]"){
                            continue;
                        }
                        //判断是否已在地图中
                        if(this._historyPatrolLayer.graphics.length !== 0){
                            if(MapTool.graphicOnMap(this._historyPatrolLayer, item["id"])){
                                continue;
                            }
                        }

                        var coordsParseArr = item.coords.split(";");
                        /*var test = '[{"x":120.19599804100037,"y":30.18658635965576,"t":1476951084000},' +
                            '{"x":120.19616433795929,"y":30.185663679754636,"t":1476951089000},' +
                            '{"x":120.1981652658844,"y":30.18576560369720,"t":1476951094000}]';

                        coordsParseArr.push(test);*/
                        var historyPatrolArray = [];
                        var lineExtent = null;
                        for(var j = 0;j<coordsParseArr.length;j++){
                            if(coordsParseArr[j] !== [] && coordsParseArr[j] !== null && coordsParseArr[j] !== "" && coordsParseArr[j] !== "[]") {
                                if (typeof coordsParseArr[j] === "string" && coordsParseArr[j] !== "[]") {
                                    coords = JSON.parse(coordsParseArr[j]);
                                } else {
                                    coords = coordsParseArr[j];
                                }
                                //轨迹只有一个点时，不绘制
                                if(coords.length === 1 && coords == "[]"){
                                    continue;
                                }
                                if(j === 0){
                                    debugger;
                                    lineExtent = this.addGraphicToMap(coords, item);
                                }else {
                                    debugger;
                                    lineExtent = lineExtent.union(this.addGraphicToMap(coords, item));
                                }
                                historyPatrolArray.push(coords);
                            }else {
                                continue;
                            }
                        }
                        if(historyPatrolArray.length === 1 && historyPatrolArray == "[]"){
                            return;
                        }

                        this._map.centerAt(lineExtent.getCenter());
                        this._map.setExtent(lineExtent.expand(2));

                        /*var testEvents = [{"x":117.49082681686698,"y":39.008394820484774,"ed":"生活垃圾事件"},
                            {"x":117.46336099655448,"y":39.01131306389298,"ed":"工业垃圾事件、工业垃圾事件、工业垃圾事件"},
                            {"x":117.49597665817558,"y":38.998610121998446,"ed":"今天天气不错真美"}
                        ];*/

                        //绘制某天上报的事件
                        //查询轨迹事件接口
                        //http://10.0.0.198/eventMgr/v1/event/findReachDTOWithEvent?reportPersonId=b6987cf2a47711e88338fa163e29a9e1&startTime=2018-09-13%2000:00:00&endTime=2018-09-19%2000:00:00
                        $http({
                            method: "GET",
                            url: _eventServiceUrl + "v1/event/findReachDTOWithEvent",
                            params:{
                                reportPersonId: item.userid,
                                startTime: item.startTime,
                                endTime: item.endTime
                            }
                        }).success(function (data) {
                            debugger;
                            if(data.data && data.data.length > 0){
                                //_that.addCurrentHistoryPatrolEvents(data.data);
                                _that.addCurrentOneDayHistoryPatrolEvents(data.data);
                            }else{
                                console.warn("event data is null");
                            }
                        }).error(function(){
                            console.error("event data query error");
                        });


                    }
                }else {
                    return;
                }

            };
            this.addGraphicToMap = function (coords, item) {
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
                    var point = new _w.Point(parseFloat(tmpC[i].x), parseFloat(tmpC[i].y), this._map.spatialReference);
                    if(MapUtil.isCoordValid(point.x, point.y)){ //过滤为0的无效坐标
                        coordsArr.push(point);
                    }

                }

                startImgPath = "img/esri-icon/patrol/start.png";
                var arrowImgPath = "img/esri-icon/patrol/arrow.png";
                endImgPath = "img/esri-icon/patrol/end.png";

                if (parseFloat(coordsArr[0].x) != parseFloat(coordsArr[coordsArr.length-1].x)
                    && parseFloat(coordsArr[0].y) != parseFloat(coordsArr[coordsArr.length-1].y)){
                    var startPoint = new _w.Point(parseFloat(coordsArr[0].x),parseFloat(coordsArr[0].y),this._map.spatialReference);
                    var endPoint = new _w.Point(parseFloat(coordsArr[coordsArr.length-1].x),parseFloat(coordsArr[coordsArr.length-1].y),this._map.spatialReference);
                    var startSymbol = new _w.PictureMarkerSymbol(startImgPath,25,36).setOffset(0, 18);
                    var endSymbol = new _w.PictureMarkerSymbol(endImgPath,25,36).setOffset(0, 18);
                    debugger;
                    console.log(13/2);

                    var g1 = new _w.Graphic(startPoint, startSymbol);
                    var g2 = new _w.Graphic(endPoint, endSymbol);
                    g1.attributes = item;
                    g2.attributes = item;
                    this._markSymbolLayer.add(g1);
                    this._markSymbolLayer.add(g2);
                }

                var polyline = new _w.Polyline().addPath(coordsArr);
                var line = new _w.Graphic(polyline,lineSymbol);
                line.attributes = item;
                this._historyPatrolLayer.add(line);
                debugger;
                var extent = polyline.getExtent();
                return extent;

            };
            this.getDataFromType = function (item) {
                var _coords = null;
                if(item.coords !== [] && item.coords !== null && item.coords !== "") {
                    if (typeof item["coords"] === "string" && item["coords"] !== "[]") {
                        _coords = JSON.parse(item.coords);
                    } else {
                        _coords = item.coords;
                    }

                    return _coords;
                }
            };
            this.addCurrentHistoryPatrolEvents = function (data) {
                var len = data.length;
                var item,point,iconObject,picMarkerSymbol,graphic;
                for(var i=0;i<len;i++){
                    item = data[i];
                    if(MapUtil.isCoordValid(item.longitude, item.latitude)){
                        PatrolRiverService.addPatrolEventPoint(item);
                    }else{
                        console.info("事件["+ i +"]无效坐标!");
                        continue;
                    }

                }

                if(PatrolRiverService.patrolEventGraphicArray != null && PatrolRiverService.patrolEventGraphicArray.length > 0){
                    for(var i = 0;i<PatrolRiverService.patrolEventGraphicArray.length;i++){
                        this._eventLayer.add(PatrolRiverService.patrolEventGraphicArray[i]);
                    }
                }

            };
            this.addCurrentOneDayHistoryPatrolEvents = function (data) {
                var len = data.length;
                var item,point,iconObject,picMarkerSymbol,graphic,eventList;
                for(var i=0;i<len;i++){
                    item = data[i];
                    eventList = data[i].eventList;
                    if(eventList && eventList.length > 0){
                        debugger;
                        for(var j = 0;j<eventList.length;j++){
                            if(MapUtil.isCoordValid(eventList[j].longitude, eventList[j].latitude)){
                                PatrolRiverService.addPatrolEventPoint(eventList[j]);
                            }else{
                                console.info("事件["+ j +"]无效坐标!");
                                continue;
                            }
                        }
                    }


                }

                if(PatrolRiverService.patrolEventGraphicArray != null && PatrolRiverService.patrolEventGraphicArray.length > 0){
                    console.log(PatrolRiverService.patrolEventGraphicArray);
                    debugger;
                    for(var i = 0;i<PatrolRiverService.patrolEventGraphicArray.length;i++){
                        this._eventLayer.add(PatrolRiverService.patrolEventGraphicArray[i]);
                    }
                }

            };
            //点击巡河河长图标，显示实时轨迹
            this.showCurrentClickPatrol = function (evt) {
                console.time();
                //通过id查询轨迹、轨迹上事件
                console.log(evt);
                var g = evt.graphic;
                var symbol = g.symbol;
                var attributes = g.attributes;
                if(attributes.type === "河长在线"){
                    return;
                }
                //传到js控制器
                $rootScope.$emit("evtDetail", g);

                //this._curHzId = attributes.id;
                //查询实时轨迹
                this.getDataById(attributes.id);

                console.timeEnd();

            };
            //点击历史轨迹，显示详细窗口
            this.showClickHistoryPatrolDetail = function(evt){
                console.log(evt);
                var g = evt.graphic;
                var symbol = g.symbol;
                var attributes = g.attributes;
                //传到js控制器
                $rootScope.$emit("historyPatrolDetail", g);
            };

            //事件列表勾选
            this.addEventsByTableSelect = function (eventCheckArr) {
                console.log(eventCheckArr);

                if(eventCheckArr.length !== 0) {
                    var len = eventCheckArr.length;
                    for (var i = 0; i < len; i++) {
                        var item = eventCheckArr[i];
                        //console.log("事件["+ i +"]坐标：" + item["longitude"] + ", " + item["latitude"]);
                        if(!MapUtil.isCoordValid(item["longitude"],item["latitude"])){
                            continue;
                        }
                        //判断是否已在地图中
                        if(this._eventLayer.graphics.length !== 0){
                            if(MapTool.graphicOnMap(this._eventLayer, item["id"])){
                                continue;
                            }
                        }

                        var point = new _w.Point(item["longitude"],item["latitude"], this._map.spatialReference);
                        var iconObject = EventService.getIconPath(item["eventStatus"]);
                        var picMarkerSymbol = SymbolUtil.getPictureMarkerSymbol(iconObject.path, iconObject.sizeX, iconObject.sizeY);
                        var graphic = new _w.Graphic(point, picMarkerSymbol);
                        item.type = "事件";
                        graphic.attributes = item;
                        this._eventLayer.add(graphic);
                        this._map.centerAt(point);

                    }
                }

            };
            this.getReachLineByPatrolId = function (id) {
                //var id = "beaa64689aa311e8b494f01fafcf3a38";
                $http({
                    method: "GET",
                    url: _patrolServiceUrl + "/v1/patrol/getReachOnPatroling",
                    params: {patrolId: id}
                }).success(function (data) {
                    if(data.data && data.resCode == 1){
                        _that.addReachLineToMap(data.data, true);
                    }else{
                        console.error("data is null");
                    }
                }).error(function(){
                    console.error("data query error");
                });
            };
            this.addReachLineToMap = function (data, isVisible) {
                if(this._reachLayer !== null){
                    this._reachLayer.clear();
                }

                if (this.reachNotOnMap(data)) {
                    if (data.hasOwnProperty("linePoints") && data["linePoints"] !== null && data["linePoints"] !== "") {
                        this.createReachLine(data, isVisible);
                    } else if (data.hasOwnProperty("spatialData") && data["spatialData"].length > 0 && data["spatialData"] !== null && data["spatialData"] !== "") {
                        if ((data.spatialData).substring(0, 15) === "MULTILINESTRING" || (data.spatialData).substring(0, 10) === "LINESTRING" || (data.spatialData).substring(0, 12) === "MULTIPOLYGON") {
                            this.createReachLineByWkt(data, isVisible);
                        }
                    } else {
                        console.warn("ReachLine data is null");
                    }
                }


            };
            this.reachNotOnMap = function (reach) {
                var graphics = this._reachLayer.graphics;
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
            this.createReachLineByWkt = function(reach, isVisible){
                var primitive = Terraformer.WKT.parse(reach.spatialData);
                var arcgis = Terraformer.ArcGIS.convert(primitive);
                var reachGeometry = _w.geometryJsonUtils.fromJson(arcgis);

                var lineSymbol = SymbolUtil.getLineSymbol(_w.SimpleLineSymbol.STYLE_SOLID, new _w.Color([48,164,254]), 3);
                var reachLine = new _w.Graphic(reachGeometry, lineSymbol);
                reachLine.setAttributes(reach);
                this._reachLayer.add(reachLine);

                if (!isVisible) {
                    reachLine.hide();
                }
            };
            this.createReachLine = function (reach, isVisible) {
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
                var reachGeometry = new _w.Polyline(this._map.spatialReference);
                var lineSymbol = SymbolUtil.getLineSymbol(_w.SimpleLineSymbol.STYLE_SOLID, new _w.Color([48,164,254]), 3);
                reachGeometry.addPath(rings);
                var reachLine = new _w.Graphic(reachGeometry, lineSymbol);
                reachLine.setAttributes(reach);
                this._reachLayer.add(reachLine);

                if (!isVisible) {
                    reachLine.hide();
                }
            };
            this.addArrow = function(path) {
                if(this._arrowLayer != null){
                    this._arrowLayer.clear();
                }
                var graphics = [];
                for (var i = 1; i < path.length; i++) {
                    var angle = MapTool.getAngle(path[i - 1], path[i]);
                    var arrowsymbol = new _w.PictureMarkerSymbol("img/esri-icon/patrol/arrow.png",
                        15, 15);
                    arrowsymbol.setAngle(angle);
                    var arrowpoint = new _w.Point(this.getMiddle(path[i - 1], path[i]));
                    var graphic = new _w.Graphic(arrowpoint, arrowsymbol);
                    graphics.push(graphic);
                }
                var graphicset = MapTool.simplifyPath(graphics);
                for (var i = 0; i < graphicset.length; i++) {
                    this._arrowLayer.add(graphicset[i]);
                }

            };
            this.getMiddle = function (p1, p2) {
                var x = (p2[0] + p1[0]) / 2;
                var y = (p2[1] + p1[1]) / 2;
                return [x, y];
            };
            /**
             * 事件详情
             * @param e
             */
            this.showEventInfoWindow = function(e){
                var Graphic = e.graphic;
                var pInfoWindow = this._map.infoWindow;
                pInfoWindow.setTitle("事件详情");
                var pHtml = "<div><table class='form_custom'><tr><th width='40%'>内容:</th><td>" + Graphic.attributes["content"] + "</td></tr>"
                    + "<tr><th>上报人：</th><td>" + Graphic.attributes["reportperson"] + "</td></tr>"
                    + "<tr><th>河道:</th><td>" + (Graphic.attributes["eventreachname"] == null ? "--" : (Graphic.attributes["eventreachname"] ))
                    + "</td></tr><tr><th>状态：</th><td>" + Graphic.attributes["status"] + "</td></tr>"
                    + "<tr><th>上报时间：</th><td>" + Graphic.attributes["reporttime"] + "</td></tr></table></div>"
                    + "<div style='margin: 10px;'><input type='button' value='查看详情' class='btn btn-primary btn-sm'></div>";
                pInfoWindow.resize(250, 290);
                pInfoWindow.setContent(pHtml);
                pInfoWindow.show(this._map.toScreen(Graphic.geometry));
            };
            this.createMiniMap = function (id) {
                this._miniMap = new _w.Map("patrolmap",{
                    slider: false,
                    autoResize: true,
                    resizeDelay: 100,
                    logo: false
                });
                var region = {
                    "longitude": 117.19203455803067,
                    "latitude": 39.08350838137276,
                    "regionlevel": 2
                };
                tiandituFactory.initTianditu(this._miniMap, region);
            };
            //点击图标，看当前点击的河长实时轨迹
            this.addPatrolLineToMap = function (item) {
                //this.miniClear();
                this.clearPatrolLineClear();

                //实时轨迹测试数据
                /* var coords = [{"x": 117.4999248698455, "y": 38.99397526482071, "t": 1476951084000},
                    {"x": 117.49597665817558, "y": 38.998610121998446, "t": 1476951089000},
                    {"x": 117.49357339889823, "y": 39.002901656422274, "t": 1476951094000},
                    {"x": 117.49082681686698, "y": 39.008394820484774, "t": 1476951099000},
                    {"x": 117.48662111313163, "y": 39.01277218559708, "t": 1476951104000},
                    {"x": 117.48104211838066, "y": 39.011141402516024, "t": 1476951109000},
                    {"x": 117.47383234054863, "y": 39.009853942188876, "t": 1476951114000},
                    {"x": 117.46336099655448, "y": 39.01131306389298, "t": 1476951119000},
                    {"x": 117.45666620285331, "y": 39.01474629143204, "t": 1476951124000}];*/

                //var coords;
                //coords = JSON.parse(coord);
                if(item.coords != [] && item.coords != null && item.coords != "") {
                    if (typeof item["coords"] === "string" && item["coords"] != "[]") {
                        coords = JSON.parse(item.coords);
                    } else {
                        coords = item.coords;
                    }
                }
                console.log(coords);
                console.log("实时轨迹最后坐标：" + coords[coords.length-1].x + ", "+  coords[coords.length-1].y);
                if (coords.length == 1 || coords == "[]") {
                    return;
                }
                var tmpC =[];
                var count = 0;
                var has = -1;
                for(var i=0;i<coords.length;i++){
                    has = -1;
                    if(tmpC.length == 0 ){
                        tmpC[count] = coords[i];
                        count++;
                    }else{
                        for(var j = 0; j < tmpC.length; j++){
                            if(tmpC[j].x == coords[i].x && tmpC[j].y == coords[i].y ){
                                has = 1;
                            }
                        }
                        if(has == -1){
                            tmpC[count] = coords[i];
                            count++;
                        }
                    }
                }


                var coordsArr = [];

                startImgPath = "img/esri-icon/patrol/start.png";
                walkImgPath = "img/esri-icon/patrol/walkL.gif";
                endImgPath = "img/esri-icon/patrol/end.png";
                var startPoint, endPoint, startSymbol, endSymbol;

                this._patrolLine = new _w.Polyline(this._miniMap.spatialReference);
                var lineSymbol = new _w.SimpleLineSymbol(_w.SimpleLineSymbol.STYLE_DASH,
                    new _w.Color([1, 184, 33]), 3); //[1, 184, 33]  [253, 1, 1]

                for (var i = 0; i < tmpC.length; i++) {
                    coordsArr.push([parseFloat(tmpC[i].x), parseFloat(tmpC[i].y)]);
                    var point = new _w.Point(parseFloat(tmpC[i].x), parseFloat(tmpC[i].y), this._miniMap.spatialReference);
                    if (i == 0) {
                        startSymbol = new _w.PictureMarkerSymbol(startImgPath, 25, 36).setOffset(0, 18);
                        startPoint = point;
                    } else if (i == (tmpC.length - 1)) {
                        //endSymbol = new _w.PictureMarkerSymbol(endImgPath, 25, 36).setOffset(0, 18);
                        endPoint = point;
                        //this._endPointGraphic = new _w.Graphic(endPoint, endSymbol);
                        //var patrolMarkerSymbol = new _w.PictureMarkerSymbol(walkImgPath, 25, 36).setOffset(0, 18);

                        if(tmpC && tmpC.length >= 2) {
                            if (Object.prototype.toString.call(tmpC) === '[object Array]') {
                                var tmpCArray = [];
                                tmpCArray.push([parseFloat(tmpC[i - 1].x), parseFloat(tmpC[i - 1].y)]);
                                tmpCArray.push([parseFloat(tmpC[i].x), parseFloat(tmpC[i].y)]);
                            }
                            if (tmpCArray && tmpCArray.length >= 2) {
                                var angle = MapTool.getAngle(tmpCArray[0], tmpCArray[1]);
                                this._lastTwoPointsAngle = angle;
                                if (angle > 90 && angle < 270) {
                                    walkImgPath = "img/esri-icon/patrol/walkL.gif";
                                } else {
                                    walkImgPath = "img/esri-icon/patrol/walkR.gif";
                                }
                            }
                        }

                        var patrolMarkerSymbol = new _w.PictureMarkerSymbol(walkImgPath, 36, 36).setOffset(0, 18);
                        this._patrolSymbolGraphic = new _w.Graphic(endPoint, patrolMarkerSymbol);
                    }
                }


                this._patrolLine.addPath(coordsArr);
                var line = new _w.Graphic(this._patrolLine, lineSymbol);
                var g1 = new _w.Graphic(startPoint, startSymbol);
                this._patrolLayer.add(line);
                this._patrolLayer.add(g1);
                //this._patrolLayer.add(this._endPointGraphic);
                //this._patrolLayer.add(this._patrolSymbolGraphic);

                this.changeExtentByPatrolLine();
                this._oldCoords = coordsArr;
                if(typeof coordsArr != "undefined" && coordsArr.length > 0){
                    this.addArrow(coordsArr);
                }
                //this.displayTrackPlayback(coordsArr,500);
            };
            this.changeExtentByPatrolLine = function(){
                var extent = this._patrolLine.getExtent();
                /*this._miniMap.centerAt(extent.getCenter());
                this._miniMap.setExtent(extent.expand(2));*/

                this._map.centerAt(extent.getCenter());
                this._map.setExtent(extent.expand(2));
            };
            this.displayTrackPlayback = function(coordsArr,refreshInterval){

                if(timeout != null){
                    clearTimeout(timeout);
                }
                //移除上一次轨迹回放时的巡查图标
                this._patrolLayer.remove(this._patrolSymbolGraphic);
                //轨迹数组下标
                trackPbIndex = 0;

                var that = this;
                //轨迹回放定时器
                function displayTrackPlaybackTimer(){
                    var angle = 0;
                    var LastPointArray = [];
                    //存放轨迹数据
                    var trackPbArrTemp = [];
                    trackPbArrTemp.push(coordsArr[trackPbIndex]);
                    trackPbArrTemp.push(coordsArr[++trackPbIndex]);
                    //移除上一个终点图标
                    that._patrolLayer.remove(that._patrolSymbolGraphic);
                    //巡查图标
                    var patrolPoint = new _w.Point(parseFloat(trackPbArrTemp[1][0]), parseFloat(trackPbArrTemp[1][1]), that._miniMap.spatialReference);
                    if(coordsArr && coordsArr.length == 1){
                        LastPointArray.push(this._oldCoords[this._oldCoords.length - 1]);
                        LastPointArray.push(coordsArr[0]);
                        angle = MapTool.getAngle(LastPointArray[0], LastPointArray[1]);
                    }else {
                        LastPointArray.push(coordsArr[coordsArr.length - 2]);
                        LastPointArray.push(coordsArr[coordsArr.length - 1]);
                        angle = MapTool.getAngle(LastPointArray[0], LastPointArray[1]);
                    }
                    if (angle > 90 && angle < 270) {
                        walkImgPath = "img/esri-icon/patrol/walkL.gif";
                    } else {
                        walkImgPath = "img/esri-icon/patrol/walkR.gif";
                    }
                    var patrolMarkerSymbol = new _w.PictureMarkerSymbol(walkImgPath,36,36).setOffset(0, 18);
                    that._patrolSymbolGraphic = new _w.Graphic(patrolPoint, patrolMarkerSymbol);
                    that._patrolLayer.add(that._patrolSymbolGraphic);

                    //检测当前坐标是否超出地图，若超出将其设为地图中心
                    var extent = that._miniMap.extent;
                    if(!extent.contains(that._patrolSymbolGraphic.geometry)){
                        that._miniMap.centerAndZoom(patrolPoint);
                    }
                    //循环播放轨迹
                    if(trackPbIndex == (coordsArr.length -1)){
                        //trackPbIndex = 0;
                        return;
                    }
                    timeout = setTimeout(displayTrackPlaybackTimer,refreshInterval);
                }
                //开始画轨迹
                displayTrackPlaybackTimer();
            };
            this.showInfoWindowByTableClick = function (Graphic) {
                this._map.infoWindow.hide();
                this.isGraphicClick = true;
                if (Graphic == null || Graphic == undefined || Graphic.attributes["status"] == 0) {
                    return;
                }
                var isPatroling = "";
                var pInfoWindow = this._map.infoWindow;
                pInfoWindow.setTitle("详情");
                if(Graphic.attributes["status"] == 1){
                    //isPatroling = "<div style='margin: 10px;'><input type='button' disabled value='不可用' class='btn btn-default btn-sm'></div>";
                    isPatroling = "";
                }else {
                    isPatroling = "<div style='margin: 10px;' id='checkCircleEve'><input type='button' value='查看轨迹' class='btn btn-primary btn-sm' style='cursor:pointer;'></div>";
                }
                var pHtml = "<div><table class='form_custom'>"
                    + "<tr><th width='40%'>河长姓名:</th><td>" + Graphic.attributes["username"] + "</td></tr>"
                    + "<tr><th>所属区域:</th><td>" + Graphic.attributes["regionName"] + "</td></tr>"
                    + "<tr><th>级&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;别:</th><td>" + this.getGradeName(Graphic.attributes["chairmanlevel"]) + "</td></tr>"
                    + "<tr><th>角&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;色:</th><td>" + Graphic.attributes["rolename"] + "</td></tr>"
                    + "<tr><th>职&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;务:</th><td>" + ((Graphic.attributes["duty"] == "") ? "--" : Graphic.attributes["duty"]) + "</td></tr>"
                    + "</td></tr><tr><th>责任河段：</th><td>" + Graphic.attributes["reach"] + "</td></tr>"
                    + "</table></div>" + isPatroling;
                pInfoWindow.resize(220, 290);
                pInfoWindow.setContent(pHtml);
                pInfoWindow.show(this._map.toScreen(Graphic.geometry));
                var oDiv = document.getElementById('checkCircleEve');
                if(typeof oDiv != null){
                    oDiv.addEventListener('click',function(){
                        $('#checkCircle').modal('show');
                        //var _miniMap = _that.createMiniMap();
                        //_that.addPatrolLineToMap(Graphic.attributes["coords"]);
                        _that.getDataById(Graphic.attributes["id"]);
                        _that._curHzId = Graphic.attributes["id"];
                        _that._hasInfoWindow = true;
                        _that.refreshPatrolLine();
                        $('#checkCircle').on('hide.bs.modal', function () {
                        });
                    });
                }
            };
            this.showHighlightGraphic = function (evt) {
                this._map.setMapCursor("pointer");
                /*console.log(evt);
                var recid = evt.graphic.attributes.id;
                for (var i = 0; i < this._historyPatrolLayer.graphics.length; i++) {
                    var g = this._historyPatrolLayer.graphics[i];
                    if (g.attributes.id == recid) {
                        var color = new _w.Color([255, 153, 18]);
                        var lineSymbol = new _w.SimpleLineSymbol(_w.SimpleLineSymbol.STYLE_SOLID,
                            color, 4);

                        var graphic = new _w.Graphic(g.geometry, lineSymbol);
                        graphic.setSymbol(lineSymbol);
                        this._highlightLayer.add(graphic);
                    }
                }*/
            };
            this.removeHighlightGraphic = function(evt){
                this._map.setMapCursor("default");
                /*console.log(evt);
                this._highlightLayer.clear();
                for (var i = 0; i < this._historyPatrolLayer.graphics.length; i++) {
                    var g = this._historyPatrolLayer.graphics[i];
                    //var lineSymbol = this.getSymbolByLevel(3);
                    var lineSymbol = SymbolUtil.getLineSymbol("solid", [253, 1, 1], 3);

                    g.setSymbol(lineSymbol);
                }*/
            };
            this.getGradeName = function (grade) {
                var gradeLevel;
                switch (grade){
                    case 1:
                        gradeLevel = "省级";
                        break;
                    case 2:
                        gradeLevel = "市级";
                        break;
                    case 3:
                        gradeLevel = "区级";
                        break;
                    case 4:
                        gradeLevel = "镇级";
                        break;
                    case 5:
                        gradeLevel = "村级";
                        break;
                    default:
                        gradeLevel = "--";
                        break;
                }
                return gradeLevel;
            };

            /**
             * 获取图层
             * @returns {*}
             */
            this.getLayer = function(){
                return this._layer;
            };
            /**
             * 获取当前巡河河长id
             * @returns {null|*}
             */
            this.getClickPatrolId = function () {
                return this._curHzId;
            };
            /**
             * 图层显隐
             */
            this.setLayerVisible = function(isVisible){
                this._layer.setVisibility(isVisible);
                this._annoLayer.setVisibility(isVisible);
            };
            /**
             * 标注显隐
             * @param isVisible
             */
            this.setAnnoVisible = function (isVisible) {
                this._isShowStationAnno = isVisible;
                //this._annoLayer.setVisibility(isVisible);
                this.setLayerAnno(this._annoLayer);
            };
            /**
             * 控制降雨量值显隐
             * @param isVisible
             */
            this.setRainValueAnnoVisible = function (isVisible) {
                this._isShowRainValue = isVisible;
                //this._annoLayer.setVisibility(isVisible);
                this.setLayerAnno(this._annoLayer);
            };
            this.setLayerAnno = function (layer) {
                var graphicList = layer.graphics;
                if (graphicList && graphicList.length > 0) {
                    for (var i = 0; i < graphicList.length; i++) {
                        var g = graphicList[i];
                        var attr = g.attributes;
                        var name = this.setAnnoValue(attr);
                        var type = '河长在线';
                        var textSymbol = this.setTextSymbol(type, name);
                        g.setSymbol(textSymbol);
                    }
                }
            };
            /**
             * 根据注记勾选情况设置标注值
             * @param attr
             * @returns {string}
             */
            this.setAnnoValue = function (attr) {
                var name = '';
                if (this._isShowStationAnno) {
                    name += attr["name"];
                }
                if (this._isShowRainValue) {
                    name += " " + attr["drp"];
                }
                return name;
            };
            this.locateToStation = function (id) {
                var arr = $.grep(this._layer.graphics, function (n, i) {
                    return n.attributes['id'] == id;
                });
                var _self = this;
                if (arr && arr.length > 0) {
                    var g = arr[0];
                    this._map.centerAt(g.geometry);
                    setTimeout(function () {
                        _self.showInfoWindowByTableClick(g);
                    }, 500);
                }
            };
            /**
             * 清除图层
             */
            this.clear = function(){
                if(this._layer != null){
                    this._layer.clear();
                }
            };
            this.clearAll = function () {
                this.clearPatrolLineClear();
                this.clearHistoryPatrolLayer();
                this.clearEventLayer();
            };
            this.clearPatrolLineClear = function(){
                if(this._patrolLayer != null){
                    this._patrolLayer.clear();
                }
            };
            this.clearHistoryPatrolLayer = function(){
                if(this._historyPatrolLayer != null){
                    this._historyPatrolLayer.clear();
                }
            };
            this.clearHistoryPatrolLayerBySelect = function(item){
                this.clearGraphicByCancelSelect(this._historyPatrolLayer, "id", item["id"]);
                this.clearGraphicByCancelSelect(this._eventLayer, "patrolid", item["reachid"]);
            };
            this.clearOneDayHistoryPatrolLayerBySelect = function(item){
                this.clearGraphicByCancelSelect(this._historyPatrolLayer, "id", item["id"]);
                this.clearGraphicByCancelSelect(this._eventLayer, "reportpersonid", item["userid"]);
                this.clearGraphicByCancelSelect(this._markSymbolLayer, "id", item["id"]);
            };
            this.clearGraphicByCancelSelect = function (layer, key, val) {
                var graphics = layer.graphics;
                var len = graphics.length;
                if (graphics.length > 0) {
                    for(var i = len-1;i >= 0 ;i--){
                        if(graphics[i].attributes !== undefined){
                            var field = graphics[i].attributes[key];
                            if (field == val) {
                                layer.remove(graphics[i])
                            }
                        }
                    }
                }
            };
            this.clearEventLayer = function () {
                if(this._eventLayer != null){
                    this._eventLayer.clear();
                }
            };
            this.clearEventLayerBySelect = function (item) {
                this.clearGraphicByCancelSelect(this._eventLayer, "id", item["id"]);
            };
            this.miniClear = function(){
                if(this._patrolLayer != null){
                    this._patrolLayer.clear();
                }
            };
            /**
             * 移除图层
             */
            this.removeLayer = function () {
                if(this._layer != null){
                    this._map.removeLayer(this._layer);
                }
            }

            /**
             * 移除图层
             */
            this.clearRefreshInterval = function () {
                if(this._patrolLineInterval != null){
                    clearInterval(this._patrolLineInterval);
                }
            }

        }]);