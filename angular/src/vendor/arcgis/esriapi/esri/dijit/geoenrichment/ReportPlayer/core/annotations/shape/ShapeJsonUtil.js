// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://js.arcgis.com/3.24/esri/copyright.txt for details.
//>>built
define("esri/dijit/geoenrichment/ReportPlayer/core/annotations/shape/ShapeJsonUtil",["dojo/_base/lang"],function(d){function e(a){h.forEach(function(c){var b=a[c];void 0!==b&&("string"===typeof b&&f.test(b)&&(a[c]=b.replace(f,"")),a[c]=Number(a[c])||0)})}var g={},h="x y left top width height".split(" "),f=/px$/i;g.createShapeJsonFromShapeObj=function(a,c){if(a&&a.viewBox){var b={id:"shape",g:a.g,viewBox:d.mixin({},a.viewBox),preserveAspectRatio:a.preserveAspectRatio,isPlaceholder:a.isPlaceholder,
style:d.mixin({top:a.x||0,left:a.y||0,width:a.viewBox.width||100,height:a.viewBox.height||100*a.viewBox.height/a.viewBox.width,zoom:void 0},a.style,c),showAsBar:a.showAsBar,showBarBackground:a.showBarBackground,barBackgroundStyle:{}};e(b.viewBox);e(b.style);return b}};return g});