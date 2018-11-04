/**
 * @description:  河流管理类
 * @author: hsf
 * @date: 2018-9-5 1:12
 */
angular.module('app')
    .service('RiverManagerService', ['$q', '$http', 'SymbolUtil','GeometryUtil','MapTool','wish',
        function($q, $http, SymbolUtil,GeometryUtil, MapTool, wish){
            var _w = wish.get();
            this._map = null;
            this._layer = null;
            this._layerId = null;
            this._drawTool = null;
            this._finalData = [];
            var _that= this;

            this.init = function(map, layerId){
                this._map = map;
                this._layerId = layerId;
                this._layer = _w.GraphicsLayer({id: this._layerId});
                this._map.addLayer(this._layer, 0);
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
            /**
             * 绘制到地图中
             * @param evt
             */
            this.drawIndex = 0;
            this.addLineToMap = function(evt){
                // if(this._drawTool!=null){
                //     this._drawTool.deactivate();
                // }

                if(this.drawIndex === 0){
                    this._finalData = evt.geometry;
                    this.drawIndex++;
                }else {
                    this._finalData.paths.push(evt.geometry.paths[0]);
                }

                var symbol = SymbolUtil.getLineSymbol("solid", [65,105,225,0.8], 3);
                var g = new _w.Graphic(this._finalData, symbol);
                this.clear();
                this._layer.add(g);
                //this.addCenterPointToMap(evt.geometry);
                this.calculationGeometry(this._finalData);
            };
            this.calculationGeometry = function (geometry) {
                var centerpoint = GeometryUtil.getPolylineCenter(geometry);
                this.centerpointX = centerpoint[0];
                this.centerpointY = centerpoint[1];
                var stringcoords = "";
                var stringWkt = "";
                var linepoints = "";
                var spatialData = "";
                if(geometry.paths.length === 1 && geometry.paths[0].length > 0){
                    var len = geometry.paths[0].length;
                    for(var i = 0;i < len;i++){
                        stringcoords +=  geometry.paths[0][i][0] + "," + geometry.paths[0][i][1] +";";
                        stringWkt += geometry.paths[0][i][0] + " " + geometry.paths[0][i][1] +",";
                    }
                    linepoints = stringcoords.substring(0, stringcoords.length-1);
                    spatialData = "MULTILINESTRING((" + stringWkt.substring(0, stringWkt.length-1) + "))";
                }else {
                    var len = geometry.paths.length;
                    var wktArray = [];
                    var wktStr;
                    for(var i = 0;i < len;i++){
                        wktStr = "";
                        var len2 = geometry.paths[i].length;
                        for(var j = 0;j < len2;j++){
                            //stringcoords +=  polygon.rings[i][j][0] + "," + polygon.rings[i][j][1] +";";
                            wktStr += geometry.paths[i][j][0] + " " + geometry.paths[i][j][1] +",";
                        }
                        wktArray.push("(" + wktStr.substring(0, wktStr.length-1) + ")");
                    }

                    var wktString2 = "";
                    if(wktArray.length > 0){
                        for(var i=0;i<wktArray.length;i++) {
                            wktString2 += wktArray[i] + ",";
                        }
                        spatialData = "MULTILINESTRING(" + wktString2.substring(0, wktString2.length-1) + ")";
                    }

                }

                var lengths = _w.geodesicUtils.geodesicLengths([geometry], _w.Units.KILOMETERS);
                this.linelength = lengths[0].toFixed(4);
                this.linepoints = linepoints;
                this.spatialData = spatialData;

            };
            this.addCenterPointToMap = function(polyline){
                if(polyline && polyline.paths[0].length >= 2){
                    var centerpoint = GeometryUtil.getPolylineCenter(polyline);
                    this.centerpointX = centerpoint[0];
                    this.centerpointY = centerpoint[1];
                    var point = GeometryUtil.getPoint(centerpoint);
                    var imgPath = "img/esri-map-icon/reservoir.png";
                    var symbol = SymbolUtil.getPictureMarkerSymbol(imgPath, 25, 25);
                    this._layer.add(new _w.Graphic(point, symbol));
                }
                var lengths = _w.geodesicUtils.geodesicLengths([polyline], _w.Units.KILOMETERS);
                this.linelength = lengths[0].toFixed(4);
            };
            this.addLineByWkt = function (wkt) {
                var primitive = Terraformer.WKT.parse(wkt);
                var geometry = new _w.Polyline();
                var lineSymbol = SymbolUtil.getLineSymbol("solid", [21,170,241], 3); //[21,170,241]..[65,105,225]

                for (var i = 0; i < primitive.coordinates.length; i++) {
                    geometry.addPath(primitive.coordinates[i]);
                }

                var g = new _w.Graphic(geometry, lineSymbol);
                this._map.graphics.add(g);

                var extent = geometry.getExtent();
                this._map.centerAt(extent.getCenter());
                this._map.setExtent(extent.expand(1.5));

                MapTool.graphicflashing(geometry, 'polyline');
            };
            this.addLineByCoords = function (coords) {
                var rings = GeometryUtil.coordsToRing(coords);
                var geometry = new _w.Polyline().addPath(rings);

                //var polygonSymbol = SymbolUtil.getFillSymbol("solid", "solid", "#00f", 2, [65,105,225,0.55]);
                var polylineSymbol = SymbolUtil.getLineSymbol("solid", [65,105,225], 3);
                var g = new _w.Graphic(geometry, polylineSymbol);
                this._layer.add(g);

                var centerXY = GeometryUtil.getPolylineCenter(geometry);
                var imgPath = "img/esri-map-icon/lake.png";
                var symbol = SymbolUtil.getPictureMarkerSymbol(imgPath, 25, 25);
                this._layer.add(new _w.Graphic(centerXY, symbol));

                var extent = geometry.getExtent();
                //this.centerpointX = extent.getCenter().x;
                //this.centerpointY = extent.getCenter().y;

                this.centerpointX = centerXY[0];
                this.centerpointY = centerXY[1];
                this._map.centerAt(extent.getCenter());
                this._map.setExtent(extent.expand(1.5));

                //闪烁线，还没做
                MapTool.graphicflashing(geometry, "polyline");
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
                //this.centerpointX = extent.getCenter().x;
                //this.centerpointY = extent.getCenter().y;

                this.centerpointX = centerXY[0];
                this.centerpointY = centerXY[1];
                this._map.centerAt(extent.getCenter());
                this._map.setExtent(extent.expand(1.5));

                MapTool.graphicflashing(geometry, "polygon");

            };

            /**
             * 取消绘图
             */
            this.cancelDrawTool = function(){
                this.clear();
                if(this._drawTool !== null){
                    this._drawTool.deactivate();
                }
                if(this._finalData && this._finalData.length !== 0){
                    this._finalData.rings = [];
                    this.drawIndex = 0;
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