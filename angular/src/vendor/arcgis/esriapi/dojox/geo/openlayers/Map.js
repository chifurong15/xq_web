//>>built
define("dojox/geo/openlayers/Map","dojo/_base/kernel dojo/_base/declare dojo/_base/lang dojo/_base/array dojo/_base/json dojo/dom dojo/dom-style ./_base ./TouchInteractionSupport ./Layer ./Patch".split(" "),function(m,n,u,l,p,q,v,g,r,k,t){m.experimental("dojox.geo.openlayers.Map");t.patchGFX();return n("dojox.geo.openlayers.Map",null,{olMap:null,_tp:null,constructor:function(a,b){b||(b={});a=q.byId(a);this._tp={x:0,y:0};var d=b.openLayersMapOptions;d||(d={controls:[new OpenLayers.Control.ScaleLine({maxWidth:200}),
new OpenLayers.Control.Navigation]});if(b.accessible){var c=new OpenLayers.Control.KeyboardDefaults;d.controls||(d.controls=[]);d.controls.push(c)}c=b.baseLayerType;c||(c=g.BaseLayerType.OSM);this.olMap=d=new OpenLayers.Map(a,d);this._layerDictionary={olLayers:[],layers:[]};b.touchHandler&&(this._touchControl=new r(d));d=this._createBaseLayer(b);this.addLayer(d);this.initialFit(b)},initialFit:function(a){(a=a.initialLocation)||(a=[-160,70,160,-70]);this.fitTo(a)},setBaseLayerType:function(a){if(a==
this.baseLayerType)return null;var b=null;"string"==typeof a?(b={baseLayerName:a,baseLayerType:a},this.baseLayerType=a):"object"==typeof a&&(b=a,this.baseLayerType=b.baseLayerType);a=null;if(null!=b&&(a=this._createBaseLayer(b),null!=a)){var b=this.olMap,d=b.getZoom(),c=b.getCenter(),e=!!c&&!!b.baseLayer&&!!b.baseLayer.map;if(e){var f=b.getProjectionObject();null!=f&&(c=c.transform(f,g.EPSG4326))}f=b.baseLayer;null!=f&&(f=this._getLayer(f),this.removeLayer(f));null!=a&&this.addLayer(a);e&&(f=b.getProjectionObject(),
null!=f&&(c=c.transform(g.EPSG4326,f)),b.setCenter(c,d))}return a},getBaseLayerType:function(){return this.baseLayerType},getScale:function(a){var b=null,b=this.olMap;if(a){if(!b.getUnits())return null;a=OpenLayers.INCHES_PER_UNIT;b=(b.getGeodesicPixelSize().w||1E-6)*a.km*OpenLayers.DOTS_PER_INCH}else b=b.getScale();return b},getOLMap:function(){return this.olMap},_createBaseLayer:function(a){var b=null,d=a.baseLayerType,c=a.baseLayerUrl,e=a.baseLayerName;a=a.baseLayerOptions;e||(e=d);a||(a={});switch(d){case g.BaseLayerType.OSM:a.transitionEffect=
"resize";b=new k(e,{olLayer:new OpenLayers.Layer.OSM(e,c,a)});break;case g.BaseLayerType.Transport:a.transitionEffect="resize";b=new k(e,{olLayer:new OpenLayers.Layer.OSM.TransportMap(e,c,a)});break;case g.BaseLayerType.WMS:c||(c="http://labs.metacarta.com/wms/vmap0",a.layers||(a.layers="basic"));b=new k(e,{olLayer:new OpenLayers.Layer.WMS(e,c,a,{transitionEffect:"resize"})});break;case g.BaseLayerType.GOOGLE:b=new k(e,{olLayer:new OpenLayers.Layer.Google(e,a)});break;case g.BaseLayerType.VIRTUAL_EARTH:b=
new k(e,{olLayer:new OpenLayers.Layer.VirtualEarth(e,a)});break;case g.BaseLayerType.YAHOO:b=new k(e,{olLayer:new OpenLayers.Layer.Yahoo(e,a)});break;case g.BaseLayerType.ARCGIS:c||(c="http://server.arcgisonline.com/ArcGIS/rest/services/ESRI_StreetMap_World_2D/MapServer/export"),b=new k(e,{olLayer:new OpenLayers.Layer.ArcGIS93Rest(e,c,a,{})})}null==b&&(d instanceof OpenLayers.Layer?b=d:(a.transitionEffect="resize",b=new k(e,{olLayer:new OpenLayers.Layer.OSM(e,c,a)}),this.baseLayerType=g.BaseLayerType.OSM));
return b},removeLayer:function(a){var b=this.olMap,d=l.indexOf(this._layerDictionary.layers,a);0<d&&this._layerDictionary.layers.splice(d,1);a=a.olLayer;var c=l.indexOf(this._layerDictionary.olLayers,a);0<c&&this._layerDictionary.olLayers.splice(d,c);b.removeLayer(a,!1)},layerIndex:function(a,b){var d=this.olMap;if(!b)return d.getLayerIndex(a.olLayer);d.setLayerIndex(a.olLayer,b);this._layerDictionary.layers.sort(function(a,b){return d.getLayerIndex(a.olLayer)-d.getLayerIndex(b.olLayer)});this._layerDictionary.olLayers.sort(function(a,
b){return d.getLayerIndex(a)-d.getLayerIndex(b)});return b},addLayer:function(a){a.dojoMap=this;var b=this.olMap,d=a.olLayer;this._layerDictionary.olLayers.push(d);this._layerDictionary.layers.push(a);b.addLayer(d);a.added()},_getLayer:function(a){a=l.indexOf(this._layerDictionary.olLayers,a);return-1!=a?this._layerDictionary.layers[a]:null},getLayer:function(a,b){var d=this.olMap.getBy("layers",a,b),c=[];l.forEach(d,function(a){c.push(this._getLayer(a))},this);return c},getLayerCount:function(){var a=
this.olMap;return null==a.layers?0:a.layers.length},fitTo:function(a){var b=this.olMap,d=g.EPSG4326;if(null==a)a=this.transformXY(0,0,d),b.setCenter(new OpenLayers.LonLat(a.x,a.y));else{var c=null,e="string"==typeof a?p.fromJson(a):a,f;if(e.hasOwnProperty("bounds")){var h=e.bounds,c=new OpenLayers.Bounds;f=this.transformXY(h[0],h[1],d);c.left=f.x;c.top=f.y;f=this.transformXY(h[2],h[3],d);c.right=f.x;c.bottom=f.y}null==c&&e.hasOwnProperty("position")&&(h=e.position,e=e.hasOwnProperty("extent")?e.extent:
1,"string"==typeof e&&(e=parseFloat(e)),c=new OpenLayers.Bounds,f=this.transformXY(h[0]-e,h[1]+e,d),c.left=f.x,c.top=f.y,f=this.transformXY(h[0]+e,h[1]-e,d),c.right=f.x,c.bottom=f.y);null==c&&4==a.length&&(c=new OpenLayers.Bounds,f=this.transformXY(a[0],a[1],d),c.left=f.x,c.top=f.y,f=this.transformXY(a[2],a[3],d),c.right=f.x,c.bottom=f.y);null!=c&&b.zoomToExtent(c,!0)}},transform:function(a,b,d){return this.transformXY(a.x,a.y,b,d)},transformXY:function(a,b,d,c){var e=this._tp;e.x=a;e.y=b;d||(d=g.EPSG4326);
c||(c=this.olMap.getProjectionObject());return e=OpenLayers.Projection.transform(e,d,c)}})});