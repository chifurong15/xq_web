// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://js.arcgis.com/3.24/esri/copyright.txt for details.
//>>built
define("esri/dijit/geoenrichment/ReportPlayer/core/grid/valueFieldUtils/ValueFieldTooltipBuilder",["../coreUtils/GridDataUtil","../../supportClasses/conditionalStyling/ConditionalStyleLegendBuilder","esri/dijit/geoenrichment/utils/ObjectUtil","esri/dijit/geoenrichment/utils/TooltipUtil"],function(f,k,l,e){var d={buildComplexTooltip:function(a,b,d,e){var c="\x3cdiv\x3e",g=f.getConditionalFormatting(a),h=f.isImageTriggerCell(a);b&&(c+="\x3cdiv\x3e"+b+"\x3c/div\x3e");!h||b||isNaN(a._currentNumberValue)||
"number"!==typeof a._currentNumberValue||(c+="\x3cdiv\x3e"+l.formatNumber(a._currentNumberValue)+"\x3c/div\x3e");d&&(c+="\x3cdiv\x3e"+d+"\x3c/div\x3e");e&&g&&(c+=k.createLegendNode(g,h?"image":"text",a._currentNumberValue).outerHTML);g&&(c="\x3cdiv class\x3d'esriGEAdjustableGridValueField_conditionalStylingTooltip'\x3e"+c+"\x3c/div\x3e");return c},_IS_RICH_TEXT_RE:/<\w/,setValueLabelTooltip:function(a,b){b&&d._IS_RICH_TEXT_RE.test(b)||(f.getConditionalFormatting(a)?e.setTooltipToNode(a.domNode,function(){return d.buildComplexTooltip(b||
"",null,!0)}):b&&e.setTooltipToNode(a.valueLabel,b))}};return d});