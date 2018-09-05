// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://js.arcgis.com/3.24/esri/copyright.txt for details.
//>>built
require({cache:{"url:esri/dijit/geoenrichment/ReportPlayer/core/templates/MinMaxLegend.html":'\x3cdiv class\x3d"esriGEMinMaxLegend"\x3e\r\n    \x3cdiv class\x3d"esriGEMinMaxLegend_variableBlock"\x3e\r\n        \x3cdiv class\x3d"esriGEMinMaxLegend_titleRow" data-dojo-attach-point\x3d"largestGroupTitleDiv"\x3e${nls.largestGroup}\x3c/div\x3e\r\n        \x3cdiv class\x3d"esriGEMinMaxLegend_valueRow" data-dojo-attach-point\x3d"largestGroupDiv"\x3e\x3c/div\x3e\r\n    \x3c/div\x3e\r\n    \x3cdiv class\x3d"esriGEMinMaxLegend_variableBlock"\x3e\r\n        \x3cdiv class\x3d"esriGEMinMaxLegend_titleRow" data-dojo-attach-point\x3d"smallestGroupTitleDiv"\x3e${nls.smallestGroup}\x3c/div\x3e\r\n        \x3cdiv class\x3d"esriGEMinMaxLegend_valueRow" data-dojo-attach-point\x3d"smallestGroupDiv"\x3e\x3c/div\x3e\r\n    \x3c/div\x3e\r\n\x3c/div\x3e'}});
define("esri/dijit/geoenrichment/ReportPlayer/core/charts/legends/MinMaxLegend","dojo/_base/declare dojo/_base/lang dojo/dom-class dojo/dom-construct dojo/dom-style dijit/_WidgetBase dijit/_TemplatedMixin ../chartUtils/ChartStyleUtil dojo/text!../../templates/MinMaxLegend.html dojo/i18n!../../../../../../nls/jsapi".split(" "),function(p,g,u,v,e,q,r,f,t,b){b=b.geoenrichment.dijit.ReportPlayer.MinMaxLegend;return p([q,r],{templateString:t,nls:b,viewModel:null,theme:null,refresh:function(b,h){var c,
d,k=Number.POSITIVE_INFINITY,l=Number.NEGATIVE_INFINITY;b.forEach(function(a){a.data.forEach(function(a){var b=a.originalValue;b<k&&(k=b,c=a);b>l&&(l=b,d=a)})});var a=this.viewModel.getChartDefaultStyles(this.theme),m=g.mixin({},a.minMaxLegend.titleStyle,h.legend.minMax.titleStyle),n=g.mixin({},a.minMaxLegend.minVariableLabelStyle,h.legend.minMax.minVariableLabelStyle),a=g.mixin({},a.minMaxLegend.maxVariableLabelStyle,h.legend.minMax.maxVariableLabelStyle);e.set(this.largestGroupTitleDiv,f.getStyleObjWithUnits(m));
e.set(this.smallestGroupTitleDiv,f.getStyleObjWithUnits(m));this.largestGroupDiv.innerHTML=d.point.fieldInfo?d.point.fieldInfo.alias:d.point.label;this.smallestGroupDiv.innerHTML=c.point.fieldInfo?c.point.fieldInfo.alias:c.point.label;e.set(this.largestGroupDiv,f.getStyleObjWithUnits(a));e.set(this.smallestGroupDiv,f.getStyleObjWithUnits(n));a.color||(this.largestGroupDiv.style.color=d.stroke&&d.stroke.color||d.fill);n.color||(this.smallestGroupDiv.style.color=c.stroke&&c.stroke.color||c.fill)}})});