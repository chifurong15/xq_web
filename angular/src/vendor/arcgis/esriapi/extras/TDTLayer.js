define(["dojo/_base/declare",
    "esri/layers/tiled"],
    function (declare) {
        return declare(esri.layers.TiledMapServiceLayer, {
            constructor: function (options) {
                this.defaults = {layertype: "vec"};
                if (typeof options === "undefined") {
                    this.layertype = this.defaults["layertype"];
                }else {
                    this.layertype = options.type;
                    this.id = options.id;
                    this.visible = true;
                }
                this.spatialReference = new esri.SpatialReference({ wkid: 4326 });
                this.initialExtent = (this.fullExtent = new esri.geometry.Extent(-180.0, -90.0, 180.0, 90.0, this.spatialReference));
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
                    "lods": [
                        {
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
                    ]
                });
                this.loaded = true;
                this.onLoad(this);
            },
            getTileUrl: function (level, row, col) {
                var url = "";
                switch (this.layertype) {
                    case "vec":
                        url = "http://t" + col % 8 + ".tianditu.cn/vec_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=c&TILEMATRIX=" + (level + 1) + "&TILEROW=" + row + "&TILECOL=" + col + "&FORMAT=tiles";
                        break;
                    case "cva":
                        url = "http://t" + col % 8 + ".tianditu.cn/cva_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cva&STYLE=default&TILEMATRIXSET=c&TILEMATRIX=" + (level + 1) + "&TILEROW=" + row + "&TILECOL=" + col + "&FORMAT=tiles";
                        break;
                    case "img":
                        url = "http://t" + col % 8 + ".tianditu.cn/img_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=c&TILEMATRIX=" + (level + 1) + "&TILEROW=" + row + "&TILECOL=" + col + "&FORMAT=tiles";
                        break;
                    case "cia":
                        url = "http://t" + col % 8 + ".tianditu.cn/cia_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cia&STYLE=default&TILEMATRIXSET=c&TILEMATRIX=" + (level + 1) + "&TILEROW=" + row + "&TILECOL=" + col + "&FORMAT=tiles";
                        break;
                    default:
                        url = "http://t" + col % 8 + ".tianditu.cn/vec_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=c&TILEMATRIX=" + (level + 1) + "&TILEROW=" + row + "&TILECOL=" + col + "&FORMAT=tiles";
                        break;
                }
                return url;
            }
        });
    });