/**
 * @description:  流域管理类
 * @author: hsf
 * @date: 2018-8-31 9:14
 */
angular.module('app')
    .service('BasinManagerService', ['$q', '$http', 'SymbolUtil','GeometryUtil','MapTool','wish',
        function($q, $http, SymbolUtil,GeometryUtil, MapTool, wish){
            var _w = wish.get();
            this._map = null;
            this._layer = null;
            this._layerId = null;
            this._drawTool = null;
            this._finalData = [];
            var _that = this;

            this.init = function(map, layerId){
                this._map = map;
                this._layerId = layerId;
                this._layer = _w.GraphicsLayer({id: this._layerId});
                this._map.addLayer(this._layer, 0);
            };
            /**
             * 绘制面
             */
            this.addPolygonMarker = function(){
                this.clear();
                var coordsArray = [];
                this._drawTool = new _w.Draw(this._map,{ showTooltips: true });
                this._drawTool.setFillSymbol(new _w.SimpleFillSymbol(_w.SimpleFillSymbol.STYLE_SOLID,
                    new _w.SimpleLineSymbol(_w.SimpleLineSymbol.STYLE_SOLID,
                        new _w.Color([0,0,255]), 2),new _w.Color([65,105,225,0.55])));
                this._drawTool.activate(_w.Draw.POLYGON);
                this._drawTool.on("draw-end", dojo.hitch(this, this.addPolygonToMap));
            };
            /**
             * 增加中心点
             */
            this.addPointMarker = function(){
                //this._drawTool = new _w.Draw(this._map,{ showTooltips: false });
                //this._drawTool.activate(_w.Draw.POINT);
                //var imgPath = "../../../src/img/esri-map-icon/reservoir.png";
                //// 点击标记中心点时，鼠标光标变为该种图标，且在地图范围内有效
                //$("#mapContainer_container").css('cursor','url('+imgPath+'),auto');
                //this.handle = dojo.connect(this._map, 'onClick', function(evt){
                //    //finishDraw = toolbar.on("draw-complete", drawEndEvent);
                //    //that._drawTool.on("draw-end", that.addPointToMap);
                //
                //    try{
                //        mapPointCallback ?that.addPointToMap(evt,mapPointCallback) :that.addPointToMap(evt) ;
                //    }catch(e){
                //        that.addPointToMap(evt);
                //    }
                //});
            };
            this.addPointToMap = function(evt){
                if(this._drawTool!==null){
                    this._drawTool.deactivate();
                }
                var imgPath = "img/esri-map-icon/reservoir.png";
                var symbol = SymbolUtil.getPictureMarkerSymbol(imgPath, 25, 25);
                var screenPoint = this._map.toScreen(evt.geometry);
                screenPoint.setY(screenPoint.y+18);//由于页面布局问题，直接获取geometry会不准确
                screenPoint.setX(screenPoint.x+18);
                geometry = this._map.toMap(screenPoint);
                var point = GeometryUtil.getPoint(geometry.x, geometry.y);
                this._layer.add(new _w.Graphic(point, symbol));
            };
            this.addCenterPointToMap = function(polygon){
                var centerpoint =  polygon.getCentroid();
                var point = GeometryUtil.getPoint(centerpoint.x, centerpoint.y);
                var imgPath = "img/esri-map-icon/reservoir.png";
                var symbol = SymbolUtil.getPictureMarkerSymbol(imgPath, 25, 25);
                this._layer.add(new _w.Graphic(point, symbol));
            };
            /**
             * 绘制面到地图中
             * @param evt
             */
            this.drawIndex = 0;
            this.addPolygonToMap = function(evt){
                if(this.drawIndex === 0){
                    this._finalData = evt.geometry;
                    this.drawIndex++;
                }else {
                    this._finalData.rings.push(evt.geometry.rings[0]);
                }

                /*if(this._drawTool!=null){
                    this._drawTool.deactivate();
                }*/

                var polygonSymbol = new _w.SimpleFillSymbol(_w.SimpleFillSymbol.STYLE_SOLID,
                    new _w.SimpleLineSymbol(_w.SimpleLineSymbol.STYLE_SOLID,
                        new _w.Color([0,0,255]), 2),new _w.Color([65,105,225,0.55]));
                this.clear();
                var g = new _w.Graphic(this._finalData, polygonSymbol);
                this._layer.add(g);
                //this.addCenterPointToMap(evt.geometry);
                this.calculationGeometry(this._finalData);

            };
            /**
             * 计算属性
             * @param polygon
             */
            this.calculationGeometry = function (polygon) {
                var centerpoint =  polygon.getCentroid();
                var area = _w.geodesicUtils.geodesicAreas([polygon], _w.Units.SQUARE_KILOMETERS);
                this.centerpointX=centerpoint.x;
                this.centerpointY=centerpoint.y;
                this.area=area[0].toFixed(0); //页面表单验证只能取整数问题
                var linepoints = "";
                var spatialData = "";

                var wktString = "";
                var wktStr = "";
                var stringcoords = "";
                if(polygon.rings.length === 1 && polygon.rings[0].length > 0){
                    var len = polygon.rings[0].length;
                    for(var i = 0;i < len;i++){
                        stringcoords +=  polygon.rings[0][i][0] + "," + polygon.rings[0][i][1] +";";
                        wktString += polygon.rings[0][i][0] + " " + polygon.rings[0][i][1] +",";
                    }
                    linepoints = stringcoords.substring(0, stringcoords.length-1);
                    spatialData = "MULTIPOLYGON(((" + wktString.substring(0, wktString.length-1) + ")))";
                }else { //多面
                    var len = polygon.rings.length;
                    var wkt = [];
                    for(var i = 0;i < len;i++){
                        wktStr = "";
                        var len2 = polygon.rings[i].length;
                        for(var j = 0;j < len2;j++){
                            wktStr += polygon.rings[i][j][0] + " " + polygon.rings[i][j][1] +",";
                        }
                        var data = wktStr.substring(0, wktStr.length-1);
                        wkt.push("((" + data + "))");
                    }

                    linepoints = "";
                    //this.spatialData = "MULTIPOLYGON((" + wktString.substring(0, wktString.length-1) + "))";
                    var wktString2 = "";
                    if(wkt.length > 1){
                        for(var i=0;i<wkt.length;i++) {
                            wktString2 += wkt[i] + ",";
                        }
                        spatialData = "MULTIPOLYGON(" + wktString2.substring(0, wktString2.length-1) + ")";
                    }
                }

                this.linepoints = linepoints;
                this.spatialData = spatialData;

            };
            this.addPolygonByWkt = function (wkt) {
                var primitive = Terraformer.WKT.parse(wkt);

                var polygon = new _w.Polygon();
                var polygonSymbol = SymbolUtil.getFillSymbol("solid", "solid", "#00f", 2, [65,105,225,0.55]);

                if (primitive.coordinates.length === 1) {
                    for (var i = 0; i < primitive.coordinates[0].length; i++) {
                        polygon.addRing(primitive.coordinates[0][i]); //正常的、有空心的面是这个格式
                    }
                }else {
                    for (var i = 0; i < primitive.coordinates.length; i++) {
                        polygon.addRing(primitive.coordinates[i][0]);  //union、merge是这个格式
                    }
                }

                var g = new _w.Graphic(polygon, polygonSymbol);
                //g.setAttributes(reach);
                this._layer.add(g);

                var extent = polygon.getExtent();
                this._map.centerAt(extent.getCenter());
                this._map.setExtent(extent.expand(2));

                MapTool.graphicflashing(polygon, "polygon");
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

                MapTool.graphicflashing(geometry, "polygon");

            };
            /**
             * 加载信息
             * @param id
             */
            this.loadInfoById = function(id){
                var defer = $q.defer();
                var promise = defer.promise;
                $http({
                    method: "get",
                    params: {"id": id},
                    url: that.reservoirURL
                }).success(function(data){
                    defer.resolve(data);
                });
                promise.then(function(data){
                    if(data.features.length === 0){
                        console.warn("无边界数据！");
                        return;
                    }
                })
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
             * 清除绘制层
             */
            this.clear = function(){
                this._map.graphics.clear();
                this._layer.clear();
            }




    }]);
