// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://js.arcgis.com/3.24/esri/copyright.txt for details.
//>>built
define("esri/dijit/geoenrichment/ReportPlayer/dataProvider/supportClasses/tasks/parsers/FeatureSetParser",["./AttrUtil"],function(k){return{parse:function(c,l,g){if(!c||!c.features.length)return[];var d=[],f={},m=0;c.features.forEach(function(a){var b=a.attributes.ID||a.attributes.AREA_ID;if(b){void 0===f[b]&&(f[b]=m++);var c={},e;for(e in a.attributes){var h=g?g(e):e;h&&(c[h]=a.attributes[e])}k.cleanUpAttrs(c);a={name:l,attrs:c,areaIndex:f[b]}}else a=null;a&&(b=d[a.areaIndex]=d[a.areaIndex]||{},
b[a.name]?b[a.name].comparisonLevels.push(a.attrs):b[a.name]={data:a.attrs,comparisonLevels:[]})});console.log("FeatureSetPareser.js \x3d\x3e areaData:");console.log(d);return d}}});