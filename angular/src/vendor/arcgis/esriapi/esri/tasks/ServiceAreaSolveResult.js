// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://js.arcgis.com/3.24/esri/copyright.txt for details.
//>>built
define("esri/tasks/ServiceAreaSolveResult","dojo/_base/declare dojo/_base/lang dojo/_base/array dojo/has ../kernel ../graphic ../SpatialReference ./NAMessage".split(" "),function(b,e,c,f,g,h,k,l){b=b(null,{declaredClass:"esri.tasks.ServiceAreaSolveResult",constructor:function(a){a.saPolygons&&(this.serviceAreaPolygons=this._graphicsFromJson(a.saPolygons));a.saPolylines&&(this.serviceAreaPolylines=this._graphicsFromJson(a.saPolylines));a.facilities&&(this.facilities=this._graphicsFromJson(a.facilities));
a.barriers&&(this.pointBarriers=this._graphicsFromJson(a.barriers));a.polylineBarriers&&(this.polylineBarriers=this._graphicsFromJson(a.polylineBarriers));a.polygonBarriers&&(this.polygonBarriers=this._graphicsFromJson(a.polygonBarriers));a.messages&&(this.messages=c.map(a.messages,function(a,b){return new l(a)}))},serviceAreaPolygons:null,serviceAreaPolylines:null,facilities:null,pointBarriers:null,polylineBarriers:null,polygonBarriers:null,messages:null,_graphicsFromJson:function(a){var b=new k(a.spatialReference);
return c.map(a.features,function(a,c){var d=new h(a);d.geometry.setSpatialReference(b);return d})}});f("extend-esri")&&e.setObject("tasks.ServiceAreaSolveResult",b,g);return b});