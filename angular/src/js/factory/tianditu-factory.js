angular.module('app')
    .factory('tiandituFactory', [function () {

        var tilemap, tilemapAnnoLayer, tdtImgLayer, tdtImgAnnoLayer;
        var spatialReference;

        var ourMapService = "http://122.224.129.34:8399/arcgis/rest/services/zhejiangJJMapService/MapServer"; //未使用
        var lods = [{
            "level": 0,
            "resolution": 0.703125,
            "scale": 295497593.05875,
            "regionname": ""
        }, {
            "level": 1,
            "resolution": 0.3515625,
            "scale": 147748796.529375,
            "regionname": ""
        }, {
            "level": 2,
            "resolution": 0.17578125,
            "scale": 73874398.264688,
            "regionname": ""
        }, {
            "level": 3,
            "resolution": 0.087890625,
            "scale": 36937199.132344,
            "regionname": ""
        }, {
            "level": 4,
            "resolution": 0.0439453125,
            "scale": 18468599.566172,
            "regionname": ""
        }, {
            "level": 5,
            "resolution": 0.02197265625,
            "scale": 9234299.783086,
            "regionname": ""
        },
        //{"level" : 6, "resolution" : 0.010986328125, "scale" : 4617149.891543},
        //{"level" : 7, "resolution" : 0.0059486525145756985, "scale" : 2500000.945771,"regionname":"省I"},
        //{"level" : 8, "resolution" : 0.00274658203125, "scale" : 1154287.472886,"regionname":"省II"},
        {
            "level": 6,
            "resolution": 0.010986328125,
            "scale": 4617149.891543,
            "regionname": ""
        }, {
            "level": 7,
            "resolution": 0.0054931640625,
            "scale": 2308574.98883464491,
            "regionname": "省"
        }, {
            "level": 8,
            "resolution": 0.00274658203125,
            "scale": 1154287.494417322456,
            "regionname": ""
        }, {
            "level": 9,
            "resolution": 0.001373291015625,
            "scale": 577143.7472086612280,
            "regionname": ""
        }, {
            "level": 10,
            "resolution": 0.0006866455078125,
            "scale": 288571.8736043306,
            "regionname": "市"
        }, {
            "level": 11,
            "resolution": 0.00034332275390625,
            "scale": 144285.93680216531,
            "regionname": ""
        }, {
            "level": 12,
            "resolution": 0.000171661376953125,
            "scale": 72142.9684010826535,
            "regionname": ""
        }, {
            "level": 13,
            "resolution": 8.58306884765625e-005,
            "scale": 36071.483527679447,
            "regionname": "县"
        }, {
            "level": 14,
            "resolution": 4.291534423828125e-005,
            "scale": 18035.741763839724,
            "regionname": ""
        }, {
            "level": 15,
            "resolution": 2.1457672119140625e-005,
            "scale": 9017.8708819198619,
            "regionname": ""
        }, {
            "level": 16,
            "resolution": 1.0728836059570313e-005,
            "scale": 4508.9354409599309,
            "regionname": "镇"
        }, {
            "level": 17,
            "resolution": 5.3644180297851563e-006,
            "scale": 2254.4677204799655,
            "regionname": ""
        }
        ];


        var _initTianditu = function (mymap, region, type) {

            var initExtent = new esri.geometry.Extent({
                "xmin": 65.3447265625,
                "ymin": 4.21875,
                "xmax": 135.7470703125,
                "ymax": 53.61328125,
                "spatialReference": {
                    "wkid": 4326
                }
            });


            spatialReference = new esri.SpatialReference({
                wkid: 4326
            });

            //地图
            dojo.declare("TianDiTiledMapServiceLayer", esri.layers.TiledMapServiceLayer, {
                constructor: function (type) {
                    this.type = type;
                    this.spatialReference = spatialReference;
                    this.initialExtent = (this.fullExtent =
                        new esri.geometry.Extent(-180.0, -90.0, 180.0, 90.0, this.spatialReference));
                    this.tileInfo = new esri.layers.TileInfo({
                        "rows": 256,
                        "cols": 256,
                        "compressionQuality": 0,
                        "origin": {
                            "x": -180,
                            "y": 90
                        },
                        "spatialReference": {
                            "wkid": 4326
                        },
                        "lods": lods
                    });
                    this.loaded = true;
                    this.onLoad(this);
                },
                getTileUrl: function (level, row, col) {
                    var levelMap = "";
                    if (level < 10) {
                        levelMap = "A0512_EMap";
                    } else if (level < 12) {
                        levelMap = "B0627_EMap1112";
                    } else if (level < 18) {
                        levelMap = "siwei0608";
                    }
                    //地形图http://42.121.35.57:8084/services/wmts/chinaemap/chinaemap/default/esritilematirx/{TileMatrix}/{TileRow}/{TileCol}
		            /*if (level >= 7 && level < 17) {
		                //return "http://www.zjditu.cn:88/wsgz_jx/wmts?Service=WMTS&Request=GetTile&Version=1.0.0&Layer=wsgz&Style=default&Format=image/png&TileMatrixSet=TileMatrixSet0&TileMatrix="+(level+1)+"&TileRow="+row+"&TileCol="+col;
		                //return "http://ditu.zj.cn/ZXZ_D/wmts.asmx/wmts?Service=WMTS&Request=GetTile&Version=1.0.0&Layer=ZXZ&Style=default&Format=image/png&TileMatrixSet=TileMatrixSet0&TileMatrix="+(level+1)+"&TileRow="+row+"&TileCol="+col;
		                //return "http://42.121.35.57:8084/services/wmts/chinaemap/chinaemap/default/esritilematirx/"+(level+1)+"/"+row+"/"+col;
		                return "http://59.202.25.22/services/wmts/qtjyx/" + (level + 1) + "/" + row + "/" + col;
		                //return "http://172.17.70.75/services/tilecache/zjemap_ter/"+(level+1)+"/"+row+"/"+col;
		                //return "http://ditu.zj.cn/services/wmts/zjemap_ter?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=zjemap&STYLE=default&TILEMATRIXSET=esritilematirx&TILEMATRIX="+(level+1)+"&TILEROW="+row+"&TILECOL="+col;
		            } else {
		                //return "http://t0.tianditu.cn/DataServer?T=vec_c&"+levelMap+"&X=" + col + "&Y=" + row + "&L=" + (level*1+1);
		                return "http://www.hangzhoumap.gov.cn/Tile/WMTS/HZTDTVECTORBLEND.gis?service=wmts&request=getTile&tilematrixset=hztdtvectorblend&tilematrix=" + (level + 1) + "&tilerow=" + row + "&tilecol=" + col;
		            }*/
                    // 全国天地图 可以外网访问
                    if (this.type === 1) {
                        return "http://t" + col % 8 + ".tianditu.gov.cn/vec_c/wmts?tk=ff19838854ae3d41e75b90bb56f0aed6&SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=c&TILEMATRIX=" + (level + 1) + "&TILEROW=" + row + "&TILECOL=" + col + "&FORMAT=tiles";
                    } else {
                        return "http://t" + col % 8 + ".tianditu.gov.cn/img_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=c&TILEMATRIX=" + (level + 1) + "&TILEROW=" + row + "&TILECOL=" + col + "&FORMAT=tiles";
                    }

                }
            });
            // 全国 文字标注s
            //可以外网访问
            dojo.declare("TianDiBiaoZhuMapServiceLayer", TianDiTiledMapServiceLayer, {
                getTileUrl: function (level, row, col) {
                    return "http://t" + col % 8 + ".tianditu.gov.cn/cva_c/wmts?tk=ff19838854ae3d41e75b90bb56f0aed6&SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cva&STYLE=default&TILEMATRIXSET=c&TILEMATRIX=" + (level + 1) + "&TILEROW=" + row + "&TILECOL=" + col + "&FORMAT=tiles";
                }
            });
            // 全国影像 文字标注
            //可以外网访问
            dojo.declare("TianDiBiaoZhuImgMapServiceLayer", TianDiTiledMapServiceLayer, {
                getTileUrl: function (level, row, col) {
                    return "http://t" + col % 8 + ".tianditu.cn/cia_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cia&STYLE=default&TILEMATRIXSET=c&TILEMATRIX=" + (level + 1) + "&TILEROW=" + row + "&TILECOL=" + col + "&FORMAT=tiles";

                }
            });
            //境界服务
            //http://ditu.zj.cn//services/wmts/zjemap_bou/zjemap_bou/default/esritilematirx/{TileMatrix}/{TileRow}/{TileCol}
            dojo.declare("TianDiJingjieMapServiceLayer", TianDiTiledMapServiceLayer, {
                getTileUrl: function (level, row, col) {
                    return "http://172.17.70.75//services/wmts/zjemap_bou/zjemap_bou/default/esritilematirx/" + (level + 1) + "/" + row + "/" + col;
                }
            });

            //影像地图
            dojo.declare("TianDiYXMapServiceLayer", TianDiTiledMapServiceLayer, {
                getTileUrl: function (level, row, col) { //wmts
                    //return "http://t0.tianditu.cn/DataServer?T=img_c&X=" + col + "&Y=" + row + "&L=" + (level*1+1);
                    return "http://172.17.70.75//services/tilecache/imgmap/" + (level + 1) + "/" + row + "/" + col;
                }
            });
            //地形地图
            dojo.declare("TianDiDXMapServiceLayer", TianDiTiledMapServiceLayer, {
                getTileUrl: function (level, row, col) { //wmts
                    return "http://42.121.35.57:8084/services/wmts/chinaemap/chinaemap/default/esritilematirx/" + (level + 1) + "/" + row + "/" + col;
                }
            });
            //水系地图
            dojo.declare("TianDiSXMapServiceLayer", TianDiTiledMapServiceLayer, {
                getTileUrl: function (level, row, col) { //wmts
                    //                return "http://172.17.70.75/services/tilecache/zjemap_hyd/"+(level+1)+"/"+row+"/"+col;
                }
            });

            //浙江标注地图
            dojo.declare("TianDiBZMapServiceLayer", TianDiTiledMapServiceLayer, {
                getTileUrl: function (level, row, col) { //wmts
                    return "http://172.17.70.75//services/tilecache/zjemap_poi/" + (level + 1) + "/" + row + "/" + col;
                }
            });
            //河段名称标注地图
            dojo.declare("HeDaoBZMapServiceLayer", TianDiTiledMapServiceLayer, {
                getTileUrl: function (level, row, col) { //wmts
                    return "http://59.202.25.22/services/wmts/qtjhzxd/" + (level + 1) + "/" + row + "/" + col;
                }
            });
            //浙江省晕渲图
            dojo.declare("ZheJiangMapServiceLayer", TianDiTiledMapServiceLayer, {
                getTileUrl: function (level, row, col) { //wmts
                    return "http://172.17.70.75/services/tilecache/zjemap_ter/" + (level + 1) + "/" + row + "/" + col;
                }
            });

            tilemap = new TianDiTiledMapServiceLayer(1);
            tilemapAnnoLayer = new TianDiBiaoZhuMapServiceLayer();
            //tdtImgLayer = new TianDiTiledMapServiceLayer();
            //tdtImgAnnoLayer = new TianDiBiaoZhuImgMapServiceLayer();
            mymap.addLayers([tilemap, tilemapAnnoLayer]);
            //mymap.addLayers([tdtImgLayer, tdtImgAnnoLayer]);
            var startExtent = new esri.geometry.Extent({
                "xmin": 118.15759521249123,
                "ymin": 28.429609188753727,
                "xmax": 121.44482059204574,
                "ymax": 30.84595184017437,
                "spatialReference": {
                    "wkid": 4326
                }
            });

            if (region) {
                var point1 = new esri.geometry.Point(region.longitude, region.latitude, spatialReference);
                mymap.centerAndZoom(point1, region.regionlevel * 2 + 4);
            }
        };

        return {
            initTianditu: _initTianditu
        };
    }]);