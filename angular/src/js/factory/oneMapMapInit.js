/**
 * @description:  底图图层类
 * @author: huangshuifa
 * @date: 2018-7-2 9:49
 */
angular.module('app')
    .factory('OneMapMapInit', ['wish','OneMapMapUtil','$localStorage', 'OneMapArrayMapService', 'moduleService','OneMapqueryAdminregionFromMysql',
        function(wish,OneMapMapUtil,$localStorage, OneMapArrayMapService,moduleService,OneMapqueryAdminregionFromMysql){
        var w = wish.get();
        var _map = null;
        var basemap = null;
        var basemapUrl = null;
        var basemapResource = null;
        var mapLevel = null;
        var longitude = null;
        var latitude = null;
        var modulePrefix = "/gismap";
        var javaServiceUrl =  moduleService.getServiceUrl() + modulePrefix;
        var spatialReference = null;
        var coordinatesHandler = null;
        var overViewMap = null;
        var mapSourceType = "wtms";
        var basemapArr = [];
        var lods = [
            {"level" : 0, "resolution" : 0.703125, "scale" : 295497593.05875,"regionname":""},
            {"level" : 1, "resolution" : 0.3515625, "scale" : 147748796.529375,"regionname":""},
            {"level" : 2, "resolution" : 0.17578125, "scale" : 73874398.264688,"regionname":""},
            {"level" : 3, "resolution" : 0.087890625, "scale" : 36937199.132344,"regionname":""},
            {"level" : 4, "resolution" : 0.0439453125, "scale" : 18468599.566172,"regionname":""},
            {"level" : 5, "resolution" : 0.02197265625, "scale" : 9234299.783086,"regionname":""},
            {"level" : 6, "resolution" : 0.010986328125, "scale" : 4617149.891543,"regionname":""},
            {"level" : 7, "resolution" : 0.0054931640625, "scale" : 2308574.98883464491,"regionname":"省"},
            {"level" : 8, "resolution" : 0.00274658203125, "scale" : 1154287.494417322456,"regionname":""},
            {"level" : 9, "resolution" : 0.001373291015625, "scale" : 577143.7472086612280,"regionname":""},
            {"level" : 10, "resolution" : 0.0006866455078125, "scale" : 288571.8736043306,"regionname":"市"},
            {"level" : 11, "resolution" : 0.00034332275390625, "scale" : 144285.93680216531,"regionname":""},
            {"level" : 12, "resolution" : 0.000171661376953125, "scale" : 72142.9684010826535,"regionname":""},
            {"level" : 13, "resolution" : 8.58306884765625e-005, "scale" : 36071.483527679447,"regionname":"县"},
            {"level" : 14, "resolution" : 4.291534423828125e-005, "scale" : 18035.741763839724,"regionname":""},
            {"level" : 15, "resolution" : 2.1457672119140625e-005, "scale" : 9017.8708819198619,"regionname":""},
            {"level" : 16, "resolution" : 1.0728836059570313e-005, "scale" : 4508.9354409599309,"regionname":"镇"},
            {"level" : 17, "resolution" : 5.3644180297851563e-006, "scale" : 2254.4677204799655,"regionname":""}
        ];

        var region = {
            regionCode: $localStorage.userLoginInfo.userInfo.regionId,
            longitude: $localStorage.userLoginInfo.userInfo.longitude,
            latitude: $localStorage.userLoginInfo.userInfo.latitude,
            grade: $localStorage.userLoginInfo.userInfo.userLevel
        };

        var _initBasemap = function (map) {
            _map = map;
            OneMapqueryAdminregionFromMysql.init(_map, region.regionCode, region.grade);
            this.spatialReference = new w.SpatialReference({"wkid": 4326});
            var userLogoInfo = $localStorage.userLoginInfo.userInfo;
            //初始化获取用户的自定义底图信息
            $.ajax({
                async: false,
                type: 'GET',
                dataType: "json",
                url: javaServiceUrl + "/findBaseMap",
                data: {
                    userId:userLogoInfo.id,
                    longitude:userLogoInfo.longitude,
                    latitude:userLogoInfo.latitude,
                    name:userLogoInfo.name,
                    userName:userLogoInfo.userName,
                    userLevel:userLogoInfo.userLevel,
                    cellPhone:userLogoInfo.cellPhone,
                    regionId:userLogoInfo.regionId,
                    regionName:userLogoInfo.regionName
                },
                error: function () {
                    console.error("error： findBaseMap no data response");
                    //加载天地图
                    var defaultTdMapData = {
                        //"serverurl":"http://59.202.25.22/services/wmts/qtjyx/",
                        "serverurl": "http://172.17.70.75/services/tilecache/zjemap_ter/",
                        "longitude": 120.1611366,
                        "latitude": 30.2792241,
                        "mapLevel": 12,
                        "spatialReference": 4326
                    };
                    loadWtmsMap(_map, defaultTdMapData, 0);
                    //加载影像底图
                    var defaultYxMapData = {
                        "serverurl": "http://172.17.70.75//services/tilecache/imgmap/",
                        "longitude": 120.1611366,
                        "latitude": 30.2792241,
                        "mapLevel": 12,
                        "spatialReference": 4326
                    };
                    loadWtmsMap(_map, defaultYxMapData, 1);
                    //this.basemapUrl = "http://59.202.25.22/services/wmts/qtjyx/";
                    basemapUrl = "http://172.17.70.75/services/tilecache/zjemap_ter/";
                    longitude = "120.1611366";
                    latitude = "30.2792241";
                    mapLevel = "12";
                    layer.alert('请求失败！使用默认地图类型');
                }
            }).done(function (data1) {
                var data2 = data1.data;
                if (data2.baseMapList && data2.baseMapList) {
                    var baseMapList = data2.baseMapList;
                    var organizationid = data2.organizationid;
                    for (var i = 0; i < baseMapList.length; i++) {
                        var data = baseMapList[i];
                        //根据图层发布方式加载图层
                        switch (data.releasemode) {
                            case "0" ://wms
                                loadWtmsMap(_map, data, i);
                                break;
                            case "1" ://wtms
                                loadWtmsMap(_map, data, i);
                                break;
                            case "2" :
                                loadArcGISTiledMap(_map, data, i);
                                break;
                            case "3" ://arcgisDynamic
                                loadArcGISDynamicMap(_map, data, i);
                                mapSourceType = "arcgisDynamic";
                                break;
                            case "4" : //geowms
                                loadGeoServerWmsMap(_map, data, i);
                                break;
                            case "5" : //geowms
                                loadGeoServerWmsMap(_map, data, i);
                                break;
                            case "6" : //arcgisImageMap
                                loadArcGISImageMap(_map, data, i);
                                break;
                            case "7" :
                                loadWtmsSupMap(_map, data, i);
                                break;
                            case "8" :
                                loadWtmsMapOther(_map, data, i);
                                break;
                            case "9" :
                                loadCacheMap(_map, data, i);
                                break;
                            default:
                        }
                        if (i == organizationid) {
                            if (data.releasemode == 3){
                                $localStorage.mapType = "arcgisDynamic";
                            }else {
                                $localStorage.mapType = "other";
                            }
                            basemapSwitch(i, true);//底图显示
                        } else {
                            basemapSwitch(i, false);//底图不显示
                        }
                    }
                }
            });

            //加载用户上一次选择过的资源图层
            initBasemapResource();
            if (basemapResource.data != null && basemapResource.data != "" && basemapResource.data.length > 0) {
                var mapListJsonObj = basemapResource.data;
                for (var i = 0; i < mapListJsonObj.length; i++) {
                    if (mapListJsonObj[i].releaseMode == "0"||mapListJsonObj[i].releaseMode == "1") {
                        loadWtmsMap(_map, mapListJsonObj[i]);
                    } else if (mapListJsonObj[i].releaseMode == "2") {
                        loadArcGISTiledMap(_map, mapListJsonObj[i]);
                    } else if (mapListJsonObj[i].releaseMode == "3") {
                        loadArcGISDynamicMap(_map, mapListJsonObj[i]);
                    }else if (mapListJsonObj[i].releaseMode == "4"||mapListJsonObj[i].releaseMode == "5") {
                        loadGeoServerWmsMap(_map, mapListJsonObj[i]);
                    } else if (mapListJsonObj[i].releaseMode == "6") {
                        loadArcGISImageMap(_map, mapListJsonObj[i]);
                    }else if (mapListJsonObj[i].releaseMode == "7") {
                        loadWtmsSupMap(_map, mapListJsonObj[i]);
                    }else if (mapListJsonObj[i].releaseMode == "8") {
                        loadWtmsMapOther(_map, mapListJsonObj[i]);
                    }else if (mapListJsonObj[i].releaseMode == "9") {
                        loadWtmsMapOther(_map, mapListJsonObj[i]);
                    }
                }
            }

        };

        //在地图资源图树菜单中选择要先加的资源图
        var _addOverlyingMap = function (overlyingMapObj) {
            switch (overlyingMapObj.releaseMode) {
                case "0" ://wms
                    loadWtmsMap(_map, overlyingMapObj);
                    break;
                case "1" ://wmts
                    loadWtmsMap(_map, overlyingMapObj);
                    break;
                case "2" :
                    loadArcGISTiledMap(_map, overlyingMapObj);
                    break;
                case "3" ://arcgisDynamic
                    loadArcGISDynamicMap(_map, overlyingMapObj);
                    break;
                case "4" : //geowms
                    loadGeoServerWmsMap(_map, overlyingMapObj);
                    break;
                case "5" : //geowms
                    loadGeoServerWmsMap(_map, overlyingMapObj);
                    break;
                case "6" : //arcgisImageMap
                    loadArcGISImageMap(_map, overlyingMapObj);
                    break;
                case "7" :
                    loadWtmsSupMap(_map, overlyingMapObj);
                    break;
                case "8":
                    loadWtmsMapOther(_map, overlyingMapObj);
                    break;
                case "9" :
                    loadCacheMap(_map, overlyingMapObj);
                    break;
                default:
            }
        };
        //移除资源图层
        var _removeOverlyingMap = function (overlyingMapId) {
            var thisMapLayer = OneMapArrayMapService.get(overlyingMapId);
            _map.removeLayer(thisMapLayer);
            OneMapArrayMapService.remove(overlyingMapId);
        };
        var initBasemapResource = function () {
            var userLogoInfo = $localStorage.userLoginInfo.userInfo;
            $.ajax({
                async: false,
                type: "POST",
                dataType: "json",
                url: javaServiceUrl + "/selectOverlyingMapData",
                data: {
                    userId:userLogoInfo.id,
                    longitude:userLogoInfo.longitude,
                    latitude:userLogoInfo.latitude,
                    name:userLogoInfo.name,
                    userName:userLogoInfo.userName,
                    userLevel:userLogoInfo.userLevel,
                    cellPhone:userLogoInfo.cellPhone,
                    regionId:userLogoInfo.regionId,
                    regionName:userLogoInfo.regionName
                },
            }).done(function (data) {
                basemapResource = data;
            });
        };
        var loadWtmsMap = function (_map, mapObj, basemapNameIndex) {
            dojo.declare("WtmsMapServiceLayer", esri.layers.TiledMapServiceLayer, {
                constructor: function () {
                    this.spatialReference = new esri.SpatialReference({wkid: mapObj.spatialReference});
                    this.initialExtent = (this.fullExtent =
                        new esri.geometry.Extent(-180.0, -90.0, 180.0, 90.0, mapObj.spatialReference));
                    this.tileInfo = new esri.layers.TileInfo({
                        "rows": 256,
                        "cols": 256,
                        "compressionQuality": 0,
                        "origin": {"x": -180, "y": 90},
                        "spatialReference": {"wkid": mapObj.spatialReference},
                        "lods": lods
                    });
                    this.loaded = true;
                    this.onLoad(this);
                },
                getTileUrl: function (level, row, col) {
                    if (mapObj.serverurl.indexOf("T=cva_c&X=") > 0) {
                        //文字标注
                        return mapObj.serverurl + col + "&Y=" + row + "&L=" + (level * 1 + 1);
                    } else if (mapObj.serverurl.indexOf("TileMatrixSet0") > 0) {
                        //湖州市地图
                        return mapObj.serverurl + (level * 1 + 1) + "&TileRow=" + row + "&TileCol=" + col;
                    } else if (mapObj.serverurl.indexOf("TILEMATRIXSET=c") > 0) {
                        //湖州市标注图
                        return mapObj.serverurl + (level * 1 + 1) + "&TileRow=" + row + "&TileCol=" + col;
                    } else if (mapObj.serverurl.indexOf("T=vec_c") > 0) {
                        //世界地图
                        return mapObj.serverurl + col + "&Y=" + row + "&L=" + (level * 1 + 1);
                    }else if (mapObj.serverurl.indexOf("cia_w") > 0) {
                        return "http://t" + col % 8 + ".tianditu.cn/cia_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cia&tileMatrixSet=w&TileMatrix=" + level + "&TileRow=" + row + "&TileCol=" + col + "&style=default&format=tiles";
                    } else {
                        return mapObj.serverurl + (level + 1) + "/" + row + "/" + col;
                    }
                }
            });
            var wtms = new WtmsMapServiceLayer();
            //存放添加的资源图层
            _map.addLayer(wtms);
            //如果有底图索引变量不为空则表示为底图，否则为资源图
            if (basemapNameIndex != undefined) {
                basemapArr[basemapNameIndex] = wtms;
            } else {
                OneMapArrayMapService.put(mapObj.id, wtms);
            }
        };
        var loadArcGISTiledMap = function (_map, mapObj, basemapNameIndex) {
            dojo.require("esri.layers.tiled");
            dojo.require("esri.layers.ArcGISTiledMapServiceLayer");
            var arcGisMapLayer = new esri.layers.ArcGISTiledMapServiceLayer(mapObj.serverurl);
            _map.addLayer(arcGisMapLayer);
            //如果有底图索引变量不为空则表示为底图，否则为资源图
            if (basemapNameIndex != undefined) {
                basemapArr[basemapNameIndex] = arcGisMapLayer;
            } else {
                OneMapArrayMapService.put(mapObj.id, arcGisMapLayer);
            }
        };
        var loadArcGISDynamicMap = function (_map, mapObj, basemapNameIndex) {
            dojo.require("esri.geometry.Point");
            var arcGisMapLayer = new esri.layers.ArcGISDynamicMapServiceLayer(mapObj.serverurl);
            _map.addLayer(arcGisMapLayer);

            // if(mapObj.maplevel == undefined){
            //     mapObj.mapLevel = 17 - mapObj.mapLevel;
            //     _map.level = mapObj.mapLevel/10;
            // }else{
            //     mapObj.maplevel = 17 - mapObj.maplevel;
            //     _map.level = mapObj.maplevel/10;
            // }
            // _map.mapLevel = 7;

            // var point = new esri.geometry.Point({"x": mapObj.centerpointlongitude, "y": mapObj.centerpointlatitude, "spatialReference": {"wkid": mapObj.spatialReference}});
            //OneMapMapUtil.center2LongLat(region.longitude,region.latitude,_map.level/10);

            //如果有底图索引变量不为空则表示为底图，否则为资源图
            if (basemapNameIndex != undefined) {
                basemapArr[basemapNameIndex] = arcGisMapLayer;
            } else {
                OneMapArrayMapService.put(mapObj.id, arcGisMapLayer);
            }
        };
        var loadArcGISImageMap = function (_map, mapObj, basemapNameIndex) {
            dojo.require("esri.geometry.Point");
            dojo.require("esri.layers.ArcGISImageServiceLayer")
            var arcGisMapLayer = new esri.layers.ArcGISImageServiceLayer(mapObj.serverurl);
            _map.addLayer(arcGisMapLayer);
            var point = new esri.geometry.Point({"x": region.longitude, "y": region.latitude, "spatialReference": {"wkid": 4326}});
            _map.mapLevel = mapObj.mapLevel;
            // map.centerAndZoom(point, region.regionlevel * 2 + 5);
            //如果有底图索引变量不为空则表示为底图，否则为资源图
            if (basemapNameIndex != undefined) {
                basemapArr[basemapNameIndex] = arcGisMapLayer;
            } else {
                OneMapArrayMapService.put(mapObj.id, arcGisMapLayer);
            }
        };
        var loadGeoServerWmsMap = function (_map, mapObj, basemapNameIndex) {
            //截取url中的图层信息
            //http://42.123.116.132:8085/geoserver/dfsj/wms?dfsj:river_main,dfsj:base_difang
            var mapResource = mapObj.serverurl.split("?");
            var mapurl = mapResource[0];
            var maplayer;
            if (mapResource.length >= 2) {
                maplayer = mapResource[1].split(",");
            }
            //加载贵州图层数据
            var resourceInfo = {
                extent: new esri.geometry.Extent(-180, -90, 180, 90, {wkid: 4326}),//  new Extent(103.584312438965, 24.599027633667, 109.502052307129, 29.1204204559326, { wkid: 4326 }),
                layerInfos: maplayer,//["dfsj:river_main", "dfsj:base_difang"],
                version: '1.1.1'
            };
            //var geoWmsUrl = "http://42.123.116.132:8085/geoserver/dfsj/wms";
            var geoWmsLayer = new esri.layers.WMSLayer(mapurl, {resourceInfo: resourceInfo});
            geoWmsLayer.setImageFormat("png");
            geoWmsLayer.setVisibleLayers(maplayer);//["dfsj:river_main","dfsj:base_difang"]
            _map.addLayer(geoWmsLayer);
            //如果有底图索引变量不为空则表示为底图，否则为资源图
            if (basemapNameIndex != undefined) {
                basemapArr[basemapNameIndex] = geoWmsLayer;
            } else {
                OneMapArrayMapService.put(mapObj.id, geoWmsLayer);
            }
        };
        var loadWtmsSupMap = function (_map, mapObj, basemapNameIndex) {
            dojo.require("esri.layers.WMTSLayer");
            dojo.require("esri.layers.WMTSLayerInfo");
            dojo.require("esri.geometry.Extent");
            dojo.require("esri.layers.TileInfo");
            dojo.require("esri.SpatialReference");

            var tileInfo = new esri.layers.TileInfo({
                "dpi": 96,
                "format": "tiles",
                "compressionQuality": 0,
                "spatialReference":  this.spatialReference,
                "rows": 256,
                "cols": 256,
                "origin": {"x": -180, "y": 90},
                "lods": [
                    {"level": "1", "scale": 295829355.455, "resolution": 0.7031249999999999},
                    {"level": "2", "scale": 147914677.727, "resolution": 0.35156249999999994},
                    {"level": "3", "scale": 73957338.8636, "resolution": 0.17578124999999997},
                    {"level": "4", "scale": 36978669.4318, "resolution": 0.08789062499999999},
                    {"level": "5", "scale": 18489334.7159, "resolution": 0.04394531249999999},
                    {"level": "6", "scale": 9244667.35796, "resolution": 0.021972656249999997},
                    {"level": "7", "scale": 4622333.67898, "resolution": 0.010986328125},
                    {"level": "8", "scale": 2311166.83949, "resolution": 0.0054931640625},
                    {"level": "9", "scale": 1155583.41974, "resolution": 0.00274658203125},
                    {"level": "10", "scale": 577791.7098721985, "resolution": 0.001373291015625},
                    {"level": "11", "scale": 288895.85493609926, "resolution": 6.866455078125E-4},
                    {"level": "12", "scale": 144447.92746804963, "resolution": 3.4332275390625E-4},
                    {"level": "13", "scale": 72223.96373402482, "resolution": 1.71661376953125E-4},
                    {"level": "14", "scale": 36111.98186701241, "resolution": 8.58306884765625E-5},
                    {"level": "15", "scale": 18055.990933506204, "resolution": 4.291534423828125E-5},
                    {"level": "16", "scale": 9027.995466753102, "resolution": 2.1457672119140625E-5},
                    {"level": "17", "scale": 4513.997733376551, "resolution": 1.0728836059570312E-5},
                    {"level": "18", "scale": 2256.998866688275, "resolution": 5.364418029785155E-6},
                    {"level": "19", "scale": 1128.499433344138, "resolution": 2.682209014892579E-6}
                ]
            });
            var tileExtent = new esri.geometry.Extent(-180, -90, 180, 90, this.spatialReference);

            var layerInfo = new esri.layers.WMTSLayerInfo({
                tileInfo: tileInfo,
                fullExtent: tileExtent,
                initialExtent: tileExtent,
                identifier: mapObj.title,
                tileMatrixSet:mapObj.tileMatrixSet,
                format: "png",
                style: "default"
            });
            var resourceInfo = {
                version: "1.0.0",
                layerInfos: [layerInfo],
                copyright: "超图"
            };
            var options = {
                serviceMode: "KVP",
                resourceInfo: resourceInfo,
                layerInfo: layerInfo
            };

            var wmtsLayer = new esri.layers.WMTSLayer(mapObj.serverurl, options);
            _map.addLayer(wmtsLayer);

            //如果有底图索引变量不为空则表示为底图，否则为资源图
            if (basemapNameIndex != undefined) {
                basemapArr[basemapNameIndex] = wmtsLayer;
            } else {
                OneMapArrayMapService.put(mapObj.id, wmtsLayer);
            }
        };
        var loadWtmsMapOther = function (_map, mapObj, basemapNameIndex) {
            dojo.declare("loadWtmsMapOtherLayer", esri.layers.TiledMapServiceLayer, {
                constructor: function () {
                    this.spatialReference = new esri.SpatialReference({"wkid": mapObj.spatialReference});//4490
                    this.initialExtent = (this.fullExtent =
                        new esri.geometry.Extent(-180.0, -90.0, 180.0, 90.0, mapObj.spatialReference));
                    this.tileInfo = new esri.layers.TileInfo({
                        "rows": 256,
                        "cols": 256,
                        "compressionQuality": 0,
                        "origin": {"x": -180, "y": 90},
                        "spatialReference": {"wkid": mapObj.spatialReference},
                        "lods": [
                            {"level" : 1, "resolution" : 0.703125, "scale" : 295497593.05875003},
                            { "level": 2, "resolution": 0.3515625, "scale": 147748796.52937502 },
                            { "level": 3, "resolution": 0.17578125, "scale": 73874398.264687508 },
                            { "level": 4, "resolution": 0.087890625, "scale": 36937199.132343754 },
                            { "level": 5, "resolution": 0.0439453125, "scale": 18468599.566171877 },
                            { "level": 6, "resolution": 0.02197265625, "scale": 9234299.7830859385 },
                            { "level": 7, "resolution": 0.010986328125, "scale": 4617149.8915429693 },
                            { "level": 8, "resolution": 0.0054931640625, "scale": 2308574.9457714846 },
                            { "level": 9, "resolution": 0.00274658203125, "scale": 1154287.4728857423 },
                            { "level": 10, "resolution": 0.001373291015625, "scale": 577143.73644287116 },
                            { "level": 11, "resolution": 0.0006866455078125, "scale": 288571.86822143558 },
                            { "level": 12, "resolution": 0.00034332275390625, "scale": 144285.93411071779 },
                            { "level": 13, "resolution": 0.000171661376953125, "scale": 72142.967055358895 },
                            { "level": 14, "resolution": 8.58306884765625e-005, "scale": 36071.483527679447 },
                            { "level": 15, "resolution": 4.291534423828125e-005, "scale": 18035.741763839724 },
                            { "level": 16, "resolution": 2.1457672119140625e-005, "scale": 9017.8708819198619 },
                            { "level": 17, "resolution": 1.0728836059570313e-005, "scale": 4508.9354409599309 },
                            { "level": 18, "resolution": 5.3644180297851563e-006, "scale": 2254.4677204799655 }]
                    });
                    this.loaded = true;
                    this.onLoad(this);
                },
                getTileUrl: function (level, row, col) {
                    if (mapObj.serverurl.indexOf("img_c") > 0) {//影像图
                        return "http://t" + col % 8 + ".tianditu.cn/img_c/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=c&TileMatrix=" + level + "&TileRow=" + row + "&TileCol=" + col + "&style=default&format=tiles"
                    }else if(mapObj.serverurl.indexOf("cia_c") > 0){//影像标注
                        return "http://t" + col % 8 + ".tianditu.cn/cia_c/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cia&tileMatrixSet=c&TileMatrix=" + level + "&TileRow=" + row + "&TileCol=" + col + "&style=default&format=tiles";
                    }else if(mapObj.serverurl.indexOf("ter_c") > 0){//地形
                        return "http://t0.tianditu.cn/ter_c/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=ter&tileMatrixSet=c&TileMatrix=" + level + "&TileRow=" + row + "&TileCol=" + col + "&style=default&format=tiles";
                    }else if(mapObj.serverurl.indexOf("cta_c") > 0) {//地形标注
                        return "http://t0.tianditu.cn/cta_c/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cta&tileMatrixSet=c&TileMatrix=" + level + "&TileRow=" + row + "&TileCol=" + col + "&style=default&format=tiles";
                    }else {
                        return mapObj.serverurl + "?service=wmts&request=GetTile&version=1.0.0&LAYER=" + mapObj.title + "&tileMatrixSet=" + mapObj.tileMatrixSet + "&TileMatrix=" + level + "&TileRow=" + row + "&TileCol=" + col + "&style=default&format=tiles";
                    }
                }
            });
            var wtms = new loadWtmsMapOtherLayer();
            //存放添加的资源图层
            _map.addLayer(wtms);
            //如果有底图索引变量不为空则表示为底图，否则为资源图
            if (basemapNameIndex != undefined) {
                basemapArr[basemapNameIndex] = wtms;
            } else {
                OneMapArrayMapService.put(mapObj.id, wtms);
            }
        };
        var loadCacheMap = function (_map, mapObj, basemapNameIndex) {
            dojo.declare("loadCacheMapLayer", esri.layers.TiledMapServiceLayer, {
                constructor: function () {
                    this.spatialReference = new esri.SpatialReference({"wkid": mapObj.spatialReference});//4490
                    this.initialExtent = (this.fullExtent =
                        new esri.geometry.Extent(-180.0, -90.0, 180.0, 90.0, mapObj.spatialReference));
                    this.tileInfo = new esri.layers.TileInfo({
                        "rows": 256,
                        "cols": 256,
                        "compressionQuality": 0,
                        "origin": {"x": -180, "y": 90},
                        "spatialReference": {"wkid": mapObj.spatialReference},
                        "lods": lods
                    });
                    this.loaded = true;
                    this.onLoad(this);
                },
                getTileUrl: function (level, row, col) {
                    return mapObj.serverurl + "/" +
                        "L" + dojo.string.pad(level+1, 2, '0')+ "/" +
                        "R" + dojo.string.pad(row.toString(16).toUpperCase(), 8, '0')+ "/" +
                        "C" + dojo.string.pad(col.toString(16).toUpperCase(), 8, '0')+ "." +
                        "png";
                }
            });
            var wtms = new loadCacheMapLayer();
            //存放添加的资源图层
            _map.addLayer(wtms);
            //如果有底图索引变量不为空则表示为底图，否则为资源图
            if (basemapNameIndex != undefined) {
                basemapArr[basemapNameIndex] = wtms;
            } else {
                OneMapArrayMapService.put(mapObj.id, wtms);
            }
        };
        //底图显示隐藏开关
        var basemapSwitch = function (basemapNameIndex, switchFlag) {
            //只显示第一个图层后面的隐藏。TODO 之后要根据用户实际保存使用的图层进行加载，而不是默认显示第一个
            // if (switchFlag || basemapArr.length == 1) {
            //basemapArr[basemapNameIndex].show();
            // } else {
            //     basemapArr[basemapNameIndex].hide();
            //  }
            if (switchFlag == true) {
                basemapArr[basemapNameIndex].show();
            } else {
                basemapArr[basemapNameIndex].hide();
            }
        };
        //返回加载过的底图数组
        var _getBasemapArr = function(){
            return basemapArr;
        };

        return {
            initBasemap: _initBasemap,
            addOverlyingMap: _addOverlyingMap,
            removeOverlyingMap: _removeOverlyingMap,
            getBasemapArr: _getBasemapArr
        };
    }]);