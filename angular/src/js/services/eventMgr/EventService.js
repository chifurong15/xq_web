/**
 * @description:  事件类
 * @author: HuangSF
 * @date: 2018-8-8 23:03
 */
angular.module('app')
    .service('EventService', [
        '$rootScope',
        'wish',
        '$http',
        '$localStorage',
        'SymbolUtil',
        'MapUtil',
        function ($rootScope, wish, $http, $localStorage, SymbolUtil, MapUtil) {
            var _w = wish.get();
            this._map = null;
            this._layer = null;
            this._layerId = null;
            this._annoLayer = null; //标注
            this._isShowStationAnno = false;
            this._isShowRainValue = false;
            this._dataSource = null;
            this.isGraphicClick = false;
            var _serviceUrl = $localStorage.serviceUrl_eventMgr;
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
                dojo.connect(this._layer, "onMouseOver", dojo.hitch(this, this.showName));
                dojo.connect(this._layer, "onMouseOut", dojo.hitch(this, this.hideName));
                dojo.connect(this._layer, "onClick", dojo.hitch(this, this.showInfoWindow));
            };
            /**
             * 获取数据
             */
            this.getDataList = function () {
                if (this._dataSource && this._dataSource.length > 0) {
                    _that.addGraphic(this._dataSource);
                    return;
                }
                $http({
                    method: "GET",
                    url: _serviceUrl + 'event/v1/queryEventByReachOrRegion',
                    params: {
                        regionId: $scope.regionId,
                        regionLevel: $scope.regionGrade,
                        reachId: '',
                        reachLevel: '',
                        reportPersonId: '',
                        type: $scope.types_change,
                        status: $scope.status_change,
                        startTime: $scope.beginTime,
                        endTime: $scope.endTime
                    }
                }).success(function (data) {
                    if (data.data && data.data.length > 0) {
                        _that._dataSource = data.data;
                        _that.addGraphic(data.data);
                    } else {
                        console.warn("data is null");
                    }
                }).error(function () {
                    console.error("data query error");
                });

                /*var data1 = {
                    data: [{
                        content:"河面有垃圾",
                        eventreachid:null,
                        eventreachname:null,
                        id:"8b0ee8cb9aa611e8b494f01fafcf3a37",
                        latitude:28.95523488521576,
                        longitude:120.06867349147797,
                        reportperson:"1",
                        reporttime: "2018-08-08 09:03:19",
                        status:"B3" //县级联络员派单
                    }, {
                        content:"河岸有垃圾",
                        eventreachid:null,
                        eventreachname:null,
                        id:"916ba49f9aa511e8b494f01fafcf3a37",
                        latitude:28.95519733428955,
                        longitude:120.0691670179367,
                        reportperson:"1",
                        reporttime:"2018-08-08 08:58:36",
                        status:"B3"
                    }],
                    resCode: 1,
                    resMsg: "Success"
                };

                _that.addGraphic(data1.data);*/
            };
            this.addGraphic = function (data) {
                this.clear();
                var len = data.length;
                var item, point, iconObject, picMarkerSymbol, graphic;
                for (var i = 0; i < len; i++) {
                    if (i == 0) { //返回数据的经纬是在浙江，暂时使用位置在天津的测试数据点
                        //data[i].longitude = 117.38323361855753;
                        //data[i].latitude = 39.02436528014918;
                        //data[i].status = "县级联络员派单"
                    } else if (i == 1) {
                        //data[i].longitude = 116.7721191166044;
                        //data[i].latitude = 38.96394047546168;
                        //data[i].status = "县级联络员派单"
                    }
                    item = data[i];
                    if (MapUtil.isCoordValid(item.longitude, item.latitude)) { //数字类型
                        this.createLayerAnno(item);
                        point = new _w.Point(item.longitude, item.latitude, this._map.spatialReference);
                        iconObject = this.getIconPath(item["eventStatus"]);
                        //iconPath = "img/esri-icon/event/event-JA.png";
                        //picMarkerSymbol = SymbolUtil.getPictureMarkerSymbol(iconPath, 24, 24).setOffset(0, 0);
                        picMarkerSymbol = SymbolUtil.getPictureMarkerSymbol(iconObject.path, iconObject.sizeX, iconObject.sizeY).setOffset(0, 0);
                        graphic = new _w.Graphic(point, picMarkerSymbol);
                        item.type = "事件";
                        graphic.attributes = item;
                        this._layer.add(graphic);
                    } else {
                        console.info("无效坐标!");
                        //return;
                    }

                }
            };
            this.createLayerAnno = function (item) {
                var point = new _w.Point(item.longitude, item.latitude, this._map.spatialReference);
                var name = this.setAnnoValue(item);
                var textSymbol = this.setTextSymbol("事件", name);
                var textGraphic = new _w.Graphic(point, textSymbol);
                textGraphic.attributes = item;
                this._annoLayer.add(textGraphic);
            };
            this.setTextSymbol = function (type, name) {
                var font, textSymbol;
                if (type == "事件") {
                    font = new _w.Font("12px", _w.Font.STYLE_NORMAL, _w.Font.VARIANT_NORMAL, _w.Font.WEIGHT_LIGHTER, "微软雅黑").setDecoration("none");
                    textSymbol = new _w.TextSymbol(name, font, new _w.Color([0, 0, 0]))
                        .setAlign(_w.TextSymbol.ALIGN_START)
                        .setOffset(12, 0).setHaloColor(new _w.Color([255, 255, 255])).setHaloSize(1);
                } else {
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
            this.getIconPath = function (status) {
                var iconObject = {};
                iconObject.sizeX = 24;
                iconObject.sizeY = 24;
                if (status == "处理中") {
                    iconObject.path = "img/esri-icon/event/event-CLZ.png";
                } else if (status == "待办") {
                    iconObject.path = "img/esri-icon/event/event-DB.png";
                } else {
                    iconObject.path = "img/esri-icon/event/event-JA.png";
                }
                return iconObject;
            };
            this.showName = function (e) {
                this._map.setMapCursor("pointer");
            };
            this.hideName = function () {
                this._map.setMapCursor("default");
                //this._map.infoWindow.hide();
            };
            /**
             * 详细信息
             * @param evt
             */
            this.typeResource = function (type) {
                var text = '';
                switch (type) {
                    case 'A':
                        text = '河长APP';
                        break;
                    case 'B':
                        text = '电话上报';
                        break;
                    case 'C':
                        text = '公众APP';
                        break;
                    case 'D':
                        text = '微信号';
                        break;
                    case 'F':
                        text = '曝光台';
                        break;
                }
                ;
                return text;
            }
            this.showInfoWindow = function (e) {
                /* if(this.isGraphicClick){
                     this._map.infoWindow.hide();
                     this.isGraphicClick = false;
                 }else {
                     this._map.infoWindow.show();
                     this.isGraphicClick = true;
                 }*/

                var Graphic = e.graphic;
                var pInfoWindow = this._map.infoWindow;
                var eventresource = {
                    A: "河长APP",
                    B: "电话上报",
                    C: "公众APP",
                    D: "微信号",
                    F: "曝光台"
                }
                //pInfoWindow.setTitle(Graphic.attributes["name"]);
                pInfoWindow.setTitle("事件详情");
                var pHtml = "<div><table class='form_custom'><tr><th width='40%'>内容:</th><td>" + Graphic.attributes["content"] + "</td></tr>"
                    + "<tr><th>上报人：</th><td>" + Graphic.attributes["reportperson"] + Graphic.attributes["eventbelongcounty"] + Graphic.attributes["eventbelongtown"] + Graphic.attributes["eventbelongvillage"] + '河长' + "</td></tr>"
                    + "<tr><th>河段名称：</th><td>" + (Graphic.attributes["eventreachname"] == null ? "--" : (Graphic.attributes["eventreachname"]))
                    + "</td></tr><tr><th>状态：</th><td>" + Graphic.attributes["eventStatus"] + "</td></tr>"
                    + "<tr><th>问题来源：</th><td>" + this.typeResource(Graphic.attributes["eventresource"]) + "</td></tr>"
                    + "<tr><th>上报时间：</th><td>" + Graphic.attributes["reporttime"] + "</td></tr></table></div>"
                    + "<div style='margin: 10px;' id='eventDetail1Eve'><input type='button' value='查看详情' class='btn btn-primary btn-sm'></div>";
                pInfoWindow.resize(250, 290);
                pInfoWindow.setContent(pHtml);
                pInfoWindow.show(this._map.toScreen(Graphic.geometry));
                var evtDetail1 = e.graphic;
                var evtId1 = Graphic.attributes.id;
                $rootScope.$emit("evtDetail1", evtDetail1);
                document.getElementById('eventDetail1Eve').addEventListener('click', function () {
                    //显示图片
                    $http({
                        method: "GET",
                        url: $localStorage.serviceUrl_eventMgr + 'event/v1/findAccessoryList',
                        params: {
                            eventId: evtId1
//	                        eventId:'0ac034c4658e4f23b8d921bda0792d8f'
                        }
                    }).success(function (data) {
                        console.log(data)
                        var eventUrl1 = data;
                        $rootScope.$emit("eventUrl1", eventUrl1);
                    }).error(function () {
                        console.error("data query error");
                    });

                    //显示事件流转
                    $http({
                        method: "GET",
                        url: $localStorage.serviceUrl_eventMgr + 'event/v1/findTacheList',
                        params: {
                            eventId: evtId1
//	                        eventId:'15b70492a1ea11e8b494f01fafcf3a37'
                        }
                    }).success(function (data) {
                        console.log(data)
                        var evtItem1 = data;
                        $rootScope.$emit("evtItem1", evtItem1);
                    }).error(function () {
                        console.error("data query error");
                    });

                    //显示领导批示
                    $http({
                        method: "GET",
                        url: $localStorage.serviceUrl_eventMgr + 'event/v1/findInstructionList',
                        params: {
                            eventId: evtId1
//	                        eventId:'hlhlj'
                        }
                    }).success(function (data) {
                        console.log(data)
                        var comment1 = data;
                        $rootScope.$emit("comment1", comment1);
                    }).error(function () {
                        console.error("data query error");
                    });

                    $('#eventDetailModal').modal('show');
                    $('#eventDetailModal').on('hide.bs.modal', function () {
                    });
                });
            };
            this.showInfoWindowByTableClick = function (Graphic) {
                this.isGraphicClick = true;
                this._map.infoWindow.hide();
                if (Graphic == null || Graphic == undefined) {
                    return;
                }
                var pInfoWindow = this._map.infoWindow;
                pInfoWindow.setTitle(Graphic.attributes["事件详情"]);
                var pHtml = "<div><table class='form_custom'><tr><th width='40%'>内容:</th><td>" + Graphic.attributes["content"] + "</td></tr>"
                    + "<tr><th>上报人：</th><td>" + Graphic.attributes["reportperson"] + "</td></tr>"
                    + "<tr><th>河道:</th><td>" + (Graphic.attributes["eventreachname"] == null ? "--" : (Graphic.attributes["eventreachname"]))
                    + "</td></tr><tr><th>状态：</th><td>" + Graphic.attributes["eventStatus"] + "</td></tr>"
                    + "<tr><th>上报时间：</th><td>" + Graphic.attributes["reporttime"] + "</td></tr></table></div>"
                    + "<div style='margin: 10px;' id='eventDetail2Eve'><input type='button' value='查看详情' class='btn btn-primary btn-sm'></div>";
                pInfoWindow.resize(250, 290);
                pInfoWindow.setContent(pHtml);
                pInfoWindow.show(Graphic.geometry);
                var evtDetail2 = Graphic;
                var evtId2 = Graphic.attributes.id;
                $rootScope.$emit("evtDetail2", evtDetail2);
                document.getElementById('eventDetail2Eve').addEventListener('click', function () {

                    //显示图片
                    $http({
                        method: "GET",
                        url: $localStorage.serviceUrl_eventMgr + 'event/v1/findAccessoryList',
                        params: {
                            eventId: evtId2
//	                        eventId:'0ac034c4658e4f23b8d921bda0792d8f'
                        }
                    }).success(function (data) {
                        console.log(data)
                        var eventUrl2 = data;
                        $rootScope.$emit("eventUrl2", eventUrl2);
                    }).error(function () {
                        console.error("data query error");
                    });

                    //显示事件流转
                    $http({
                        method: "GET",
                        url: $localStorage.serviceUrl_eventMgr + 'event/v1/findTacheList',
                        params: {
                            eventId: evtId2
//	                        eventId:'15b70492a1ea11e8b494f01fafcf3a37'
                        }
                    }).success(function (data) {
                        console.log(data)
                        var evtItem2 = data;
                        $rootScope.$emit("evtItem2", evtItem2);
                    }).error(function () {
                        console.error("data query error");
                    });

                    //显示领导批示
                    $http({
                        method: "GET",
                        url: $localStorage.serviceUrl_eventMgr + 'event/v1/findInstructionList',
                        params: {
                            eventId: evtId2
//	                        eventId:'hlhlj'
                        }
                    }).success(function (data) {
                        console.log(data)
                        var comment2 = data;
                        $rootScope.$emit("comment2", comment2);
                    }).error(function () {
                        console.error("data query error");
                    });
                    $('#eventDetailModal').modal('show');
                    $('#eventDetailModal').on('hide.bs.modal', function () {
                    });
                });
            };
            /**
             * 获取图层
             * @returns {*}
             */
            this.getLayer = function () {
                return this._layer;
            };
            /**
             * 图层显隐
             */
            this.setLayerVisible = function (isVisible) {
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
                        var type = '事件';
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
            this.clear = function () {
                if (this._layer != null) {
                    this._layer.clear();
                }
            };
            /**
             * 移除图层
             */
            this.removeLayer = function () {
                if (this._layer != null) {
                    this._map.removeLayer(this._layer);
                }
            }


        }]);