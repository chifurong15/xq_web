/**
 * @description:  部件管理类
 * @author: hsf
 * @date: 2018-9-6 9:18
 */
angular.module('app')
    .service('ComponentManagerService', ['$q', '$http', 'SymbolUtil','GeometryUtil','MapTool', 'MapUtil','wish',
        function($q, $http, SymbolUtil,GeometryUtil, MapTool, MapUtil, wish){
            var _w = wish.get();
            this._map = null;
            this._layer = null;
            this._layerId = null;
            this._drawTool = null;
            var _that= this;

            this.init = function(map, layerId){
                this._map = map;
                this._layerId = layerId;
                this._layer = _w.GraphicsLayer({id: this._layerId});
                // this._map.addLayer(this._layer);
            };
            /**
             * 画点
             */
            this.drawPointMarker = function(){
                this._drawTool = new _w.Draw(this._map,{ showTooltips: false });
                this._drawTool.activate(_w.Draw.POINT);
                var imgPath = "esri-map-icon/reservoir.png";
                // 点击标记中心点时，鼠标光标变为该种图标，且在地图范围内有效
                //$("#mapContainer_container").css('cursor','url('+imgPath+'),auto');
                //this.handle = dojo.connect(this._map, 'onClick', function(evt){
                   //finishDraw = toolbar.on("draw-complete", drawEndEvent);
                   this._drawTool.on("draw-end", dojo.hitch(this, this.addPointToMap));
                   /*try{
                       mapPointCallback ?_that.addPointToMap(evt,mapPointCallback) :_that.addPointToMap(evt) ;
                   }catch(e){
                       _that.addPointToMap(evt);
                   }
                });*/
            };
            /**
             * 绘制线
             */
            this.drawLineMarker = function(){
                this.clear();
                this._drawTool = new _w.Draw(this._map,{ showTooltips: false });
                this._drawTool.setFillSymbol(new _w.SimpleFillSymbol(_w.SimpleFillSymbol.STYLE_SOLID,
                    new _w.SimpleLineSymbol(_w.SimpleLineSymbol.STYLE_SOLID,
                        new _w.Color([0,0,255]), 2),new _w.Color([65,105,225,0.55])));
                this._drawTool.activate(_w.Draw.POLYLINE);
                this._drawTool.on("draw-end", dojo.hitch(this, this.addLineToMap));
            };
            this.addPointToMap = function (evt) {
                this.clear();
                if(this._drawTool!=null){
                    this._drawTool.deactivate();
                }

                var point = GeometryUtil.getPoint(evt.geometry.x, evt.geometry.y);
                var iconPath = "img/esri-icon/patrol/event.png";
                var symbol = SymbolUtil.getPictureMarkerSymbol(iconPath, 25, 36);
                var g = new _w.Graphic(point, symbol);
                this._layer.add(g);
                //this.addCenterPointToMap(evt.geometry);

                this.pointXY = [evt.geometry.x,evt.geometry.y];
                this._map.addLayer(this._layer);
            };
            this.addLineToMap = function(evt){
                if(this._drawTool!=null){
                    this._drawTool.deactivate();
                }

                var symbol = SymbolUtil.getLineSymbol("solid", [65,105,225,0.8], 3);
                var g = new _w.Graphic(evt.geometry, symbol);
                this._layer.add(g);
                this.addCenterPointToMap(evt.geometry);
                this._map.addLayer(this._layer);
            };
            this.addCenterPointToMap = function(polyline){
                if(polyline && polyline.paths[0].length >= 2){
                    this.centerpoint = GeometryUtil.getPolylineCenter(polyline);
                    var point = GeometryUtil.getPoint(this.centerpoint[0], this.centerpoint[1]);
                    var imgPath = "img/esri-icon/patrol/event.png";
                    var symbol = SymbolUtil.getPictureMarkerSymbol(imgPath, 25, 36);
                    this._layer.add(new _w.Graphic(point, symbol));
                }
                var lengths = _w.geodesicUtils.geodesicLengths([polyline], _w.Units.KILOMETERS);
                this.linelength = lengths[0].toFixed(4);
            };
            this.addPointByCoords = function (long, lat){
                if(MapUtil.isCoordValid(long, lat)){
                    var geometry = GeometryUtil.getPoint(long, lat);
                    var imgPath = "img/esri-icon/patrol/event.png";
                    var symbol = SymbolUtil.getPictureMarkerSymbol(imgPath, 25, 36);
                    this._layer.add(new _w.Graphic(geometry, symbol));
                    this._map.addLayer(this._layer);
                }else {
                    console.warn("坐标为空");
                    layer.msg('坐标为空！绘制失败...',{time:2000});
                }
            };
            this.addPolygonByCoords = function (coords) {
                var rings = GeometryUtil.coordsToRing(coords);
                var geometry = new _w.Polygon().addRing(rings);

                var polygonSymbol = SymbolUtil.getFillSymbol("solid", "solid", "#00f", 2, [65,105,225,0.55]);
                var g = new _w.Graphic(geometry, polygonSymbol);
                this._layer.add(g);

                var centerXY = geometry.getCentroid();
                var imgPath = "img/esri-map-icon/lake.png";
                var symbol = SymbolUtil.getPictureMarkerSymbol(imgPath, 25, 25);
                this._layer.add(new _w.Graphic(centerXY, symbol));

                var extent = geometry.getExtent();
                this._map.centerAt(extent.getCenter());
                this._map.setExtent(extent.expand(2));
                this._map.addLayer(this._layer);

                MapTool.graphicflashing(geometry, "polygon");

            };

            /**
             * 取消绘图
             */
            this.cancelDrawTool = function(){
                if(this._drawTool !== null){
                    this._drawTool.deactivate();
                }
            };
            /**
             * 清除图层
             */
            this.clear = function(){
                this._map.graphics.clear();
                this._layer.clear();
            }











        }]);