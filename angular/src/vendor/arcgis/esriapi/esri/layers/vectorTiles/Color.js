// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://js.arcgis.com/3.24/esri/copyright.txt for details.
//>>built
define("esri/layers/vectorTiles/Color",["./core/declare","./core/accessorSupport/ensureType","dojo/colors"],function(d,g,f){function c(a){return Math.max(0,Math.min(g.ensureInteger(a),255))}var b=d([f],{declaredClass:"esri.Color",toJSON:function(){return[c(this.r),c(this.g),c(this.b),1<this.a?this.a:c(255*this.a)]},clone:function(){return new b(this.toRgba())}});b.toJSON=function(a){return a&&[c(a.r),c(a.g),c(a.b),1<a.a?a.a:c(255*a.a)]};b.fromJSON=function(a){return a&&new b([a[0],a[1],a[2],a[3]/
255])};b.toUnitRGB=function(a){return[a.r/255,a.g/255,a.b/255]};b.toUnitRGBA=function(a){return[a.r/255,a.g/255,a.b/255,null!=a.a?a.a:1]};var e="named blendColors fromRgb fromHex fromArray fromString".split(" ");for(d=0;d<e.length;d++)b[e[d]]=f[e[d]];b.named.rebeccapurple=[102,51,153];return b});