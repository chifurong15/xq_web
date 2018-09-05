// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://js.arcgis.com/3.24/esri/copyright.txt for details.
//>>built
define("esri/dijit/geoenrichment/ReportPlayer/core/supportClasses/templateJsonUtils/fieldInfo/_FieldInfoDataRenderer",["esri/dijit/geoenrichment/ReportPlayer/config","../../conditionalStyling/ConditionalStyleUtil","esri/dijit/geoenrichment/utils/ObjectUtil","../../../../dataProvider/supportClasses/AreaDataUtil","dojo/i18n!../../../../../../../nls/jsapi"],function(l,m,n,h,g){g=g.geoenrichment.dijit.ReportPlayer.ReportPlayer;var k={getValueFromFieldData:function(a,b){b=b||{};var c=!1!==b.formatValue,
e,d=k.getFieldDataValue(a,b.fieldData,b.featureIndex);if("esriFieldTypeString"===a.type)return d;if(void 0===d||"number"===typeof d&&isNaN(d)||"NaN"===d||"null"===d)return console.log("Error: can't calculate value for \x3d\x3e "+a.name),c?l.tables.showUnavailableData?g.unavailableDataShort:"":NaN;var f=Number(d);if(""!==d&&!isNaN(f)){if(!c)return f;a.triggerJson&&(e=m.getConditionalStyle(f,a.triggerJson));c=this._formatValue(f,a);return e?{label:c,conditionalStyle:e,numberValue:f}:c}return c?d:NaN},
_formatValue:function(a,b){return n.formatNumber(a,{places:b.decimals||0,noSeparator:!b.useThousandsSeparator,preserveTrailingZeroes:!0})},getFieldDataValue:function(a,b,c){if(a){var e=h.getAreaDataValue(a.templateName||a.name,b,void 0,c);void 0===e&&a.variableID&&(e=h.getAreaDataValue(a.variableID,b,void 0,c));return e}}};return k});