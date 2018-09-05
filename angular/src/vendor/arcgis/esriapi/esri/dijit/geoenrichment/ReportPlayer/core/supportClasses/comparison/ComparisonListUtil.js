// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://js.arcgis.com/3.24/esri/copyright.txt for details.
//>>built
define("esri/dijit/geoenrichment/ReportPlayer/core/supportClasses/comparison/ComparisonListUtil",["dojo/_base/declare","dojo/dom-class","esri/dijit/geoenrichment/OnDemandSelect","../templateJsonUtils/countryConfig"],function(g,k,b,l){g=g(b.itemRenderers.DefaultItemRenderer,{createPresentation:function(a,h,c,b,e){var f=this.inherited(arguments);a.isArea&&k.add(f,"esriGEComparisonList_areaItemRoot");return f}});b={getListOptions:function(a){function h(a){a.features.forEach(function(a){c.push({isArea:!0,
value:String(f++),AREA_ID:a.attributes.AREA_ID,label:a.attributes.StdGeographyName||""})})}a=a.slice();a.shift();var c=[],b={},e=[];a.forEach(function(a){var c=a.attributes.StdGeographyLevel||"default",d=b[c];d||(d=(d=l.getGeographiesModel())?d.getLevelPluralName(c):c,d={levelId:c,label:d+":",features:[]},b[c]=d,e.push(d));d.features.push(a)});e.forEach(function(a,c){a.features.sort(function(a,c){return(a.attributes.StdGeographyName||"").localeCompare(c.attributes.StdGeographyName||"")})});var f=
0;1===e.length&&"default"===e[0].levelId?h(e[0]):e.forEach(function(a,b){0<b&&c.push({isSeparator:!0});c.push({isTitle:!0,enabled:!1,value:a.levelId,label:a.label});h(a)});return c},getDefaultOptionValue:function(a){var b;a.some(function(a){if(a.isArea)return b=a,!0});return b&&b.value},listValueToAreaID:function(a){return Number(a)+1}};b.ComparisonListItemRenderer=g;return b});