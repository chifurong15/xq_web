// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://js.arcgis.com/3.24/esri/copyright.txt for details.
//>>built
define("esri/layers/vectorTiles/core/accessorSupport/decorators/writer",["require","exports","dojo/_base/lang","./property"],function(m,f,h,k){Object.defineProperty(f,"__esModule",{value:!0});f.writer=function(a,c,g){var d,e;void 0===c?(e=a,d=[void 0]):"string"!==typeof c?(e=a,d=[void 0],g=c):(e=c,d=Array.isArray(a)?a:[a]);return function(a,c,f){var l=a.constructor.prototype;d.forEach(function(b){b=k.propertyJSONMeta(a,b,e);b.write&&"object"!==typeof b.write&&(b.write={});g&&h.setObject("write.target",
g,b);h.setObject("write.writer",l[c],b)})}}});