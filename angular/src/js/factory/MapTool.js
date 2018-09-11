/**
 * @description:  地图工具类
 * @author: HuangSF
 * @date: 2018-8-15 14:11
 */
angular.module('app')
    .factory('MapTool', ['wish', function(wish){
        var _w = wish.get();
        var _map = null;
        var _vecLayer = null;
        var _cvaLayer = null;
        var _imgLayer = null;
        var _ciaLayer = null;
        var flashLayer = null;
        var flashingGraphic;
        var flashingIndex;
        var flashingTimer = 0;
        var that = this;

        var _init = function(map, layerId){
            _map = map;
            if(typeof layerId === "undefined"){
                layerId = "flashLayer";
            }
            flashLayer = new _w.GraphicsLayer({id: layerId});
            _map.addLayer(flashLayer, 1);
            _loadMapLayer();
        };
        var _loadMapLayer = function () {
            _vecLayer = new _w.TDTLayer({id: "vecLayer", type:"vec"});
            _imgLayer = new _w.TDTLayer({id: "imgLayer", type:"img"});
            _cvaLayer = new _w.TDTLayer({id: "cvaLayer", type:"cva"});
            _ciaLayer = new _w.TDTLayer({id: "ciaLayer", type:"cia"});
            _map.addLayers([_vecLayer, _imgLayer, _cvaLayer,  _ciaLayer]);
            _imgLayer.setVisibility(false);
            _ciaLayer.setVisibility(false);
        };
        var _controlLayerVisible = function (layerName, isShow) {
            switch (layerName){
                case "img":
                    _imgLayer.setVisibility(isShow);
                    _vecLayer.setVisibility(!isShow);
                    break;
                case "vec":
                    _imgLayer.setVisibility(!isShow);
                    _vecLayer.setVisibility(isShow);
                    break;
                case "cia":
                    _ciaLayer.setVisibility(isShow);
                    _cvaLayer.setVisibility(!isShow);
                    break;
                default:
                    _ciaLayer.setVisibility(!isShow);
                    _cvaLayer.setVisibility(isShow);
                    break;
            }
        };
        var _getAngle = function (p1, p2) {
            var x = p2[0] - p1[0];
            var y = p2[1] - p1[1];
            var hypotenuse = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
            var cos = x / hypotenuse;
            var radian = Math.acos(cos);
            var angle = 180 / (Math.PI / radian);
            if (y < 0) {
                angle = 360 - angle;
            } else if ((y == 0) && (x < 0)) {
                angle = 180;
            }
            if (angle < 0) {
                angle = 360 + angle;
            }
            angle = 360 - angle;
            return angle;
        };

        var _simplifyPath = function (graphics) {
            var graphicset = [];
            if (graphics.length > 1000) {
                for (var i = 0; i < graphics.length; i = i + 8) {
                    graphicset.push(graphics[i]);
                }
            } else if (graphics.length > 500) {
                for (var i = 0; i < graphics.length; i = i + 5) {
                    graphicset.push(graphics[i]);
                }
            } else if (graphics.length > 100) {
                for (var i = 0; i < graphics.length; i = i + 4) {
                    graphicset.push(graphics[i]);
                }
            } else if (graphics.length > 50) {
                for (var i = 0; i < graphics.length; i = i + 3) {
                    graphicset.push(graphics[i]);
                }
            } else if (graphics.length > 20) {
                for (var i = 0; i < graphics.length; i = i + 2) {
                    graphicset.push(graphics[i]);
                }
            } else {
                for (var i = 0; i < graphics.length; i++) {
                    graphicset.push(graphics[i]);
                }
            }
            return graphicset;
        };

        //闪烁
        var _graphicflashing = function (polygon) {
            flashingIndex = 0;
            if(flashLayer != undefined){
                flashLayer.clear();
            }
            if (flashingTimer) clearInterval(flashingTimer);

            var sfs = new _w.SimpleFillSymbol().setColor(
                [255, 255, 0, 0.8]).setOutline(
                new _w.SimpleLineSymbol(
                    _w.SimpleLineSymbol.STYLE_SOLID, new _w.Color(
                        [255, 0, 0, 0])), 2);

            flashingGraphic = new _w.Graphic(polygon, sfs);
            flashLayer.add(flashingGraphic);

            flashingTimer = setInterval(_doGraphicFlashing, 500);
        };

        var _doGraphicFlashing = function () {
            flashingIndex++;
            if (flashingIndex < 8) {
                flashLayer.setVisibility(!flashLayer.visible);
            } else {
                flashLayer.clear();
                clearInterval(flashingTimer);
            }
        };

        var _getflashingTimer = function () {
            return flashingTimer;
        };

        var _clearflashingTimer = function () {
            if (flashingTimer) {
                clearInterval(flashingTimer);
                flashLayer.clear();
            }
        };

        return {
            init: _init,
            getAngle: _getAngle,
            simplifyPath: _simplifyPath,
            graphicflashing: _graphicflashing,
            controlLayerVisible: _controlLayerVisible,
            getflashingTimer: _getflashingTimer,
            clearflashingTimer: _clearflashingTimer
        }

    }]);