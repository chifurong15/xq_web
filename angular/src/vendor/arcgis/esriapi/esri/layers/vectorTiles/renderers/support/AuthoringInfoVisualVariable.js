// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://js.arcgis.com/3.24/esri/copyright.txt for details.
//>>built
define("esri/layers/vectorTiles/renderers/support/AuthoringInfoVisualVariable","require exports ../../core/tsSupport/declareExtendsHelper ../../core/tsSupport/decorateHelper ../../core/JSONSupport ../../core/kebabDictionary ../../core/accessorSupport/decorators ../../core/accessorSupport/decorators/cast".split(" "),function(p,q,m,c,n,e,d,g){var h=e({percentTotal:"percent-of-total"}),k=e({sizeInfo:"size",colorInfo:"color",transparencyInfo:"opacity"}),l={key:function(c){return"number"===typeof c?"number":
"string"},typeMap:{number:Number,string:String},base:null};return function(e){function b(a){a=e.call(this)||this;a.endTime=null;a.field=null;a.maxSliderValue=null;a.minSliderValue=null;a.startTime=null;a.type=null;a.units=null;return a}m(b,e);f=b;b.prototype.castEndTime=function(a){return"string"===typeof a||"number"===typeof a?a:null};b.prototype.castStartTime=function(a){return"string"===typeof a||"number"===typeof a?a:null};Object.defineProperty(b.prototype,"style",{get:function(){return"color"===
this.type?this._get("style"):null},set:function(a){this._set("style",a)},enumerable:!0,configurable:!0});Object.defineProperty(b.prototype,"theme",{get:function(){return"color"===this.type?this._get("theme")||"high-to-low":null},set:function(a){this._set("theme",a)},enumerable:!0,configurable:!0});b.prototype.clone=function(){return new f({endTime:this.endTime,field:this.field,maxSliderValue:this.maxSliderValue,minSliderValue:this.minSliderValue,startTime:this.startTime,style:this.style,theme:this.theme,
type:this.type,units:this.units})};c([d.property({types:l,json:{write:!0}})],b.prototype,"endTime",void 0);c([g.cast("endTime")],b.prototype,"castEndTime",null);c([d.property({type:String,json:{write:!0}})],b.prototype,"field",void 0);c([d.property({type:Number,json:{write:!0}})],b.prototype,"maxSliderValue",void 0);c([d.property({type:Number,json:{write:!0}})],b.prototype,"minSliderValue",void 0);c([d.property({types:l,json:{write:!0}})],b.prototype,"startTime",void 0);c([g.cast("startTime")],b.prototype,
"castStartTime",null);c([d.property({type:String,value:null,dependsOn:["type"],json:{read:h.read,write:h.write}})],b.prototype,"style",null);c([d.property({type:String,value:null,dependsOn:["type"],json:{write:!0}})],b.prototype,"theme",null);c([d.property({type:String,json:{read:k.read,write:k.write}})],b.prototype,"type",void 0);c([d.property({type:String,json:{write:!0}})],b.prototype,"units",void 0);return b=f=c([d.subclass("esri.renderers.support.AuthoringInfoVisualVariable")],b);var f}(d.declared(n))});