// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://js.arcgis.com/3.24/esri/copyright.txt for details.
//>>built
define("esri/dijit/geoenrichment/ReportPlayer/core/supportClasses/conditionalStyling/ConditionalStyleLegendBuilder","dojo/_base/declare dojo/string dojo/dom-class dojo/dom-construct dojo/dom-style ../images/ImageDataHolder ./ConditionalStyleUtil esri/dijit/geoenrichment/utils/ObjectUtil dojo/i18n!../../../../../../nls/jsapi".split(" "),function(c,e,n,b,p,q,l,m,d){d=d.geoenrichment.dijit.ReportPlayer.ConditionalLegend;c={};var r={"\x3d":"equals","\x3c":"less","\x3e":"greater","\x3c\x3d":"lessOrEquals",
"\x3e\x3d":"greaterOrEquals"};c.createLegendNode=function(c,f,t){function u(a){function b(a){var b=m.parseNumber(a);return isNaN(b)?a:m.formatNumber(b)}if(!a.compareInfos||!a.compareInfos.length)return!1;if("image"===f&&"default"===a.compareInfos[0].value)return d.conditionalLegend_default;a=a.compareInfos.map(function(a){return e.substitute(d["conditionalLegend_operator_"+r[a.operator]],{value:b(a.value)})});return 1===a.length?a[0]:e.substitute(d.conditionalLegend_interval,{from:a[0],to:a[1]})}
if(!f)return null;var k=b.create("div",{"class":"esriGEConditionalStylingLegend esriGEConditionalStylingLegend_"+f});b.create("div",{"class":"esriGEConditionalStylingLegend_row esriGERowHigh",innerHTML:d.conditionalLegend_title},k);var v=l.getMatchedCase(t,c);c.cases.some(function(a){var c=u(a),e=l.styleFromSetters(a.setters);if(c&&e){var h=b.create("div",{"class":"esriGEConditionalStylingLegend_row esriGERowHigh"},k),g=b.create("div",{"class":"esriGEConditionalStylingLegend_symbol dijitInline"},
h);"image"===f?b.create("img",{"class":"esriGEConditionalStylingLegend_symbolImage dijitInline"},g).src=q.getImageData(a.setters[0].value)||"":("chart"===f?n.add(g,"esriGEConditionalStylingLegend_symbolChart"):g.innerHTML=d.conditionalLegend_preview,p.set(g,e));b.create("div",{"class":"dijitInline esriGESpaceBeforeBig",innerHTML:c},h);v===a&&b.create("div",{"class":"esriGEConditionalStylingLegend_matchIndicator"},h)}});return k};return c});