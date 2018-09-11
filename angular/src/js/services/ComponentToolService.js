angular.module('app')
    .service('componentToolService', [
        '$rootScope',
        'wish',
        'ComponentTool',
        function ($rootScope,wish,ComponentTool) {
            var _w = wish.get();
            this.map = null;
            this.layers = [];

            this.init = function (map) {
                this.map = map;
            };

            this.isLayerExisted = function (map, mainClassId) {
                return this.map.getLayer(mainClassId);
            };

            this.cleanUp = function () {
                if (this.layers != null) {
                    for (var i = 0; i < this.layers.length; i++) {
                        this.layers[i].clearSingles();
                    }
                }

            };

            this.removeLayer = function (mainClassId) {
                var layer = this.map.getLayer(mainClassId);
                this.map.removeLayer(layer);
            };

            this.removeAllLayers = function () {
                if (this.layers.length > 0) {
                    for (var i = 0; i < this.layers.length; i++) {
                        this.map.removeLayer(this.layers[i]);
                    }
                }
                this.layers = [];
            };


            //污染源聚合
            this.loadPollComponents = function (data, mainClassId) {
                var picBaseUrl = "img/icon/";
                var pic1 = new _w.PictureMarkerSymbol(picBaseUrl + "pollution.png", 24, 24).setOffset(0, 15);
                var pic2 = new _w.PictureMarkerSymbol(picBaseUrl + "pollution1.png", 48, 48).setOffset(0, 15);
                var pic3 = new _w.PictureMarkerSymbol(picBaseUrl + "pollution2.png", 48, 48).setOffset(0, 15);
                var data1 = [];
                for (var i = 0, j = 0; i < data.length; i++) {
                    if (data[i].longitude != null && data[i].longitude != "" && data[i].latitude != null && data[i].latitude != "" && data[i].name != null && data[i].name != "") {/*detail(' + data[i].id + ');*/
                        var id = "'" + data[i].id + "'";
                        var infoBtn='<input type="button" style="background: none; outline: none; border: none; cursor: pointer; text-decoration: underline" onclick=_detailsInfo(' + id + ') value="查看详情"/>';
                        data1[j++] = {
                            "x": parseFloat(data[i].longitude),
                            "y": parseFloat(data[i].latitude),
                            "attributes": {
                                "name": data[i].name,
                                "link": infoBtn
                            }
                        };
                    }
                }
                var popupTemplate = new _w.PopupTemplate({
                    "fieldInfos": [{
                        "fieldName": "name",
                        "label": "名称：",
                        visible: true
                    }
                        , {
                        "fieldName": "link",
                        "label": "详细信息：",
                        visible: true
                        }
                    ]
                });
                var xlayer = new _w.ClusterLayer({
                    "data": data1,
                    "distance": 100,//distance控制的是两个点之间的距离，distance值越小，点密度越大，反之亦然；
                    "id": mainClassId,
                    "labelColor": "#000",//labelColor为个数显示的颜色；
                    "labelOffset": 10,//labelOffset默认值为0，+为向上，-为向下；
                    "resolution": this.map.extent.getWidth() / this.map.width,//resolution是一个变化的值，当前的地图范围/地图的范围即为resolution；
                    "singleTemplate": popupTemplate,
                    "spatialReference": this.map.spatialReference
                });
                xlayer.setRenderer(this.createRender(pic1, pic2, pic3));
                this.layers.push(xlayer);
                this.map.addLayer(xlayer);

                $(".close").click(function () {
                    this.cleanUp();
                });
            };

            this.createRender = function (pic1, pic2, pic3) {
                var defaultSym = new _w.SimpleMarkerSymbol().setSize(4);
                var renderer = new _w.ClassBreaksRenderer(defaultSym, "clusterCount");
                renderer.addBreak(0, 1, pic1);
                renderer.addBreak(2, 200, pic2);
                renderer.addBreak(200, 1000001, pic3);
                return renderer;
            };

            this.showComponents = function (data, imgPath, mainClassId) {
                if (data == undefined || data.length == 0) {
                    return;
                }
                for (var i = 0; i < data.length; i++) {
                    var component = data[i];
                    var layer = this.isLayerExisted(map, mainClassId);
                    if (layer == undefined) {//如果图层不存在，则先创建图层，再将部件添加到图层上
                        layer = new _w.GraphicsLayer({id: mainClassId});
                        this.layers.push(layer);
                        this.map.addLayer(layer);
                        /*  dojo.connect(layer, "onMouseOver", dojo.hitch(this, this._showComponentName));
                         dojo.connect(layer, "onMouseOut", this._hideComponentName);*/
                        dojo.connect(layer, "onClick", dojo.hitch(this, this._openDetail));
                    }
                    this.addGraphic(layer, component, imgPath);
                    layer.show();
                }
            };

            this.addGraphic = function (layer, component, imgPath) {
                if (layer.id == "30000000000000000000000000000000") {//如果部件为监测断面，则根据监测断面的当前水质显示不同的图标
                    imgPath = imgPath + "section" + (component.specificComponent.nowquality == null ? 3 : component.specificComponent.nowquality) + ".png";
                }
                var point = new _w.Point(component.longitude, component.latitude, this.map.spatialReference);
                var symbol = new _w.PictureMarkerSymbol(imgPath, 24, 24);
                var graphic = new _w.Graphic(point, symbol);
                graphic.attributes={id:component.id};
                layer.add(graphic);
            };

            this._openDetail = function (evt) {
                $rootScope.$emit("evtId",evt.graphic.attributes.id);
            };
        }
    ])
;