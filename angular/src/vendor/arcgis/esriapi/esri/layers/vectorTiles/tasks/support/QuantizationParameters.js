// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://js.arcgis.com/3.24/esri/copyright.txt for details.
//>>built
define("esri/layers/vectorTiles/tasks/support/QuantizationParameters","require exports ../../core/tsSupport/declareExtendsHelper ../../core/tsSupport/decorateHelper ../../geometry ../../core/JSONSupport ../../core/kebabDictionary ../../core/lang ../../core/accessorSupport/decorators".split(" "),function(f,g,k,c,l,m,n,p,b){Object.defineProperty(g,"__esModule",{value:!0});var h=n({upperLeft:"upper-left",lowerLeft:"lower-left"});f=function(d){function a(){var a=null!==d&&d.apply(this,arguments)||this;
a.extent=null;a.mode="view";a.originPosition="upper-left";return a}k(a,d);e=a;a.prototype.clone=function(){return new e(p.clone({extent:this.extent,mode:this.mode,originPosition:this.originPosition,tolerance:this.tolerance}))};c([b.property({type:l.Extent,json:{write:!0}})],a.prototype,"extent",void 0);c([b.property({type:String,json:{write:!0}})],a.prototype,"mode",void 0);c([b.property({type:String,json:{read:h.read,write:h.write}})],a.prototype,"originPosition",void 0);c([b.property({type:Number,
json:{write:!0}})],a.prototype,"tolerance",void 0);return a=e=c([b.subclass("esri.tasks.support.QuantizationParameters")],a);var e}(b.declared(m));g.default=f});