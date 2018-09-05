// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://js.arcgis.com/3.24/esri/copyright.txt for details.
//>>built
require({cache:{"url:esri/dijit/analysis/templates/ExpressionForm.html":'\x3cdiv class\x3d"esriAnalysis esriExpressionForm"\x3e\r\n  \x3cdiv class\x3d"esriFormError esriRoundedBox" data-dojo-attach-point\x3d"_errorMessagePane" style\x3d"display:none;"\x3e\x3c/div\x3e\r\n  \x3c!--\x3cdiv class\x3d"clear" style\x3d"height:1em;"\x3e\x3c/div\x3e--\x3e\r\n  \x3cdiv data-dojo-type\x3d"dijit/form/Form" class\x3d"esriSimpleForm" data-dojo-attach-point\x3d"_expressionForm"\x3e\r\n    \x3ctable class\x3d"esriFormTable" style\x3d"border: 1px solid #929497;background-color: #F7F8F8 !important;"\x3e \r\n      \x3ctbody\x3e\r\n        \x3ctr data-dojo-attach-point\x3d"_firstRow" \x3e\r\n          \x3ctd style\x3d"width:75%"\x3e\r\n            \x3cselect class\x3d"" data-dojo-type\x3d"dijit/form/Select" style\x3d"width:100%;table-layout:fixed;" data-dojo-attach-event\x3d"onChange:_handleFirstOperandChange" data-dojo-attach-point\x3d"_firstOperandSelect"\x3e\r\n            \x3c/select\x3e\r\n          \x3c/td\x3e\r\n          \x3ctd style\x3d"width:25%"\x3e\r\n            \x3cselect class\x3d"" data-dojo-type\x3d"dijit/form/Select" data-dojo-attach-event\x3d"onChange:_handleOperatorChange" style\x3d"width:100%;table-layout:fixed;" data-dojo-attach-point\x3d"_operatorSelect"\x3e\r\n              \x3coption value\x3d"where"\x3e${i18n.where}\x3c/option\x3e\r\n              \x3coption value\x3d"intersects"\x3e${i18n.intersects}\x3c/option\x3e\r\n              \x3coption value\x3d"notIntersects"\x3e${i18n.notIntersects}\x3c/option\x3e\r\n              \x3coption value\x3d"withinDistance"\x3e${i18n.withinDistance}\x3c/option\x3e\r\n              \x3coption value\x3d"notWithinDistance"\x3e${i18n.notWithinDistance}\x3c/option\x3e\r\n              \x3coption value\x3d"contains"\x3e${i18n.contains}\x3c/option\x3e\r\n              \x3coption value\x3d"notContains"\x3e${i18n.notContains}\x3c/option\x3e\r\n              \x3coption value\x3d"within"\x3e${i18n.within}\x3c/option\x3e\r\n              \x3coption value\x3d"notWithin"\x3e${i18n.notWithin}\x3c/option\x3e\r\n              \x3c!--\x3coption value\x3d"contains"\x3e${i18n.contains}\x3c/option\x3e\r\n              \x3coption value\x3d"notContains"\x3e${i18n.notContains}\x3c/option\x3e--\x3e\r\n              \x3c!--\x3coption value\x3d"within"\x3e${i18n.within}\x3c/option\x3e\r\n              \x3coption value\x3d"notWithin"\x3e${i18n.notWithin}\x3c/option\x3e--\x3e\r\n              \x3c!--\x3coption value\x3d"identical"\x3e${i18n.identical}\x3c/option\x3e\r\n              \x3coption value\x3d"notIdentical"\x3e${i18n.notIdentical}\x3c/option\x3e\r\n              \x3coption value\x3d"touches"\x3e${i18n.touches}\x3c/option\x3e\r\n              \x3coption value\x3d"notTouches"\x3e${i18n.notTouches}\x3c/option\x3e--\x3e\r\n              \x3c!--\x3coption value\x3d"crossesOutline"\x3e${i18n.crossesOutline}\x3c/option\x3e\r\n              \x3coption value\x3d"notCrossesOutline"\x3e${i18n.notCrossesOutline}\x3c/option\x3e--\x3e\r\n            \x3c/select\x3e\r\n          \x3c/td\x3e\r\n        \x3c/tr\x3e\r\n        \x3ctr data-dojo-attach-point\x3d"_secondRow" style\x3d"display:none;"\x3e\r\n          \x3ctd data-dojo-attach-point\x3d"_secondOperandTd" colspan\x3d"2"\x3e\r\n            \x3cdiv data-dojo-attach-point\x3d"_secondExpressionDiv" style\x3d"display:none; padding-bottom:0.25em;"\x3e\r\n              \x3cinput type\x3d"text" data-dojo-type\x3d"dijit/form/NumberTextBox" data-dojo-attach-event\x3d"onChange:_handleDistanceInputChange" data-dojo-props\x3d"intermediateChanges:true" data-dojo-attach-point\x3d"_distanceInput" style\x3d"width:20%;"\x3e\x3c/input\x3e\r\n              \x3cselect data-dojo-type\x3d"dijit/form/Select"  data-dojo-attach-point\x3d"_distanceUnitsSelect"  style\x3d"width:20%;table-layout:fixed;"\x3e\r\n                \x3coption value\x3d"Miles"\x3e${i18n.miles}\x3c/option\x3e\r\n                \x3coption value\x3d"Yards"\x3e${i18n.yards}\x3c/option\x3e\r\n                \x3coption value\x3d"Feet"\x3e${i18n.feet}\x3c/option\x3e\r\n                \x3coption type\x3d"separator"\x3e\x3c/option\x3e\r\n                \x3coption value\x3d"Kilometers"\x3e${i18n.kilometers}\x3c/option\x3e\r\n                \x3coption value\x3d"Meters"\x3e${i18n.meters}\x3c/option\x3e\r\n                \x3coption value\x3d"NauticalMiles"\x3e${i18n.nautMiles}\x3c/option\x3e\r\n              \x3c/select\x3e\r\n              \x3clabel\x3e ${i18n.from} \x3c/label\x3e\r\n            \x3c/div\x3e\r\n            \x3cselect class\x3d"" data-dojo-type\x3d"dijit/form/Select" style\x3d"width:75%;table-layout:fixed;" data-dojo-attach-point\x3d"_secondOperandSelect" data-dojo-attach-event\x3d"onChange:_handleSecondOperandChange"\x3e\r\n            \x3c/select\x3e\r\n            \x3cdiv data-dojo-attach-point\x3d"_attrFilterDiv" style\x3d"display:none;"\x3e\x3c/div\x3e\r\n          \x3c/td\x3e\r\n        \x3c/tr\x3e\r\n      \x3c/tbody\x3e\r\n    \x3c/table\x3e\r\n    \x3cdiv class\x3d"esriFormWarning esriRoundedBox" data-dojo-attach-point\x3d"_errorMessagePane" style\x3d"display:none;"\x3e\r\n      \x3ca href\x3d"#" title\x3d"${i18n.close}" class\x3d"esriFloatTrailing esriAnalysisInfoPaneCloseIcon" title\x3d\'${i18n.close}\' data-dojo-attach-event\x3d"onclick:_handleCloseMsg"\x3e\r\n      \x3c/a\x3e\r\n      \x3cspan data-dojo-attach-point\x3d"_bodyNode"\x3e\x3c/span\x3e\r\n    \x3c/div\x3e    \r\n    \x3cdiv style\x3d"clear:both;"\x3e\x3c/div\x3e\r\n    \x3cdiv  class\x3d"esriFloatTrailing" style\x3d"padding: 10px 5px;"\x3e\r\n      \x3cdiv data-dojo-type\x3d"dijit/form/Button"  class\x3d"${_addBtnClass}" data-dojo-attach-point\x3d"_addBtn" data-dojo-attach-event\x3d"onClick:_handleAddButtonClick"\x3e\r\n        ${i18n.add}\r\n      \x3c/div\x3e\r\n       \x3cdiv data-dojo-type\x3d"dijit/form/Button" class\x3d"esriLeadingMargin05" data-dojo-attach-point\x3d"_closeBtn" data-dojo-attach-event\x3d"onClick:_handleCloseButtonClick"\x3e\r\n        ${i18n.close}\r\n      \x3c/div\x3e\r\n    \x3c/div\x3e\r\n    \r\n  \x3c/div\x3e\r\n\x3c/div\x3e  \r\n'}});
define("esri/dijit/analysis/ExpressionForm","require dojo/_base/declare dojo/_base/lang dojo/_base/array dojo/_base/connect dojo/_base/json dojo/_base/fx dojo/has dojo/json dojo/string dojo/dom-style dojo/dom-attr dojo/dom-construct dojo/query dojo/dom-class dojo/_base/event dojo/Evented dojo/fx/easing dojo/number dijit/_WidgetBase dijit/_TemplatedMixin dijit/_WidgetsInTemplateMixin dijit/_OnDijitClickMixin dijit/_FocusMixin dijit/registry dijit/form/Button dijit/form/CheckBox dijit/form/Form dijit/form/Select dijit/form/TextBox dijit/form/ValidationTextBox dijit/layout/ContentPane dijit/form/FilteringSelect dijit/Dialog dijit/Tooltip ../../kernel ../../lang ./utils ../SingleFilter dojo/i18n!../../nls/jsapi dojo/text!./templates/ExpressionForm.html".split(" "),
function(h,q,d,e,l,H,m,r,I,t,b,u,v,J,K,n,w,p,x,y,z,A,B,C,L,M,N,O,P,Q,R,S,T,U,V,D,f,E,F,k,G){h=q([y,z,A,B,C,w],{declaredClass:"esri.dijit.analysis.ExpressionForm",templateString:G,widgetsInTemplate:!0,firstOperands:null,defaultUnits:"english",showFirstRow:!0,showUnique:!0,constructor:function(a){a.containerNode&&(this.container=a.containerNode);this._setClasses(a)},_setClasses:function(a){this._addBtnClass=a.primaryActionButttonClass||"esriAnalysisSubmitButton"},destroy:function(){this.inherited(arguments);
e.forEach(this._pbConnects,l.disconnect);delete this._pbConnects},postMixInProperties:function(){this.inherited(arguments);this.i18n={};d.mixin(this.i18n,k.common);d.mixin(this.i18n,k.expressionGrid);d.mixin(this.i18n,k.expressionForm)},postCreate:function(){this.inherited(arguments);this.attributeChangeHandler=l.subscribe("filter-expression-change",d.hitch(this,this._handleAttributeFilterChange));this._distanceInput.set("validator",d.hitch(this,this._validateDistance));this.set("action","add");b.set(this._firstRow,
"display",this.showFirstRow?"":"none");this.own(this.watch("showUnique",d.hitch(this,function(a,c,g){this._attributeFilter&&this._attributeFilter.set("showUnique",g)})))},init:function(){this.showReadyToUseLayers&&this.owningWidget&&!this._browseTitle&&(this._browseTitle=E._isCustomAnalysisQuery(this.owningWidget)?this.i18n.browseAnalysisLayers:this.i18n.browseAnalysisTitle);if(this._firstOperandSelect&&this.firstOperands&&this.inputOperands){this._firstOperandSelect.getOptions()&&this._firstOperandSelect.removeOption(this._firstOperandSelect.getOptions());
var a,c,g=this.inputOperands.length,b=this.firstOperands.length,d=[];for(a=0;a<g;a+=1)for(c=0;c<b;c+=1)f.isDefined(this.inputOperands[a].id)&&f.isDefined(this.firstOperands[c].id)&&this.inputOperands[a].id===this.firstOperands[c].id?d[this.firstOperands[c].id]=a.toString():f.isDefined(this.inputOperands[a].name)&&f.isDefined(this.firstOperands[c].name)&&this.inputOperands[a].name===this.firstOperands[c].name&&(d[this.firstOperands[c].name]=a.toString());e.forEach(this.firstOperands,function(a,c){f.isDefined(a)&&
this._firstOperandSelect.addOption({value:d[a.id||a.name],label:a.name})},this);this.selectedFirstOperand&&(f.isDefined(this.selectedFirstOperand.id)||(this.selectedFirstOperand.id=this.selectedFirstOperand.name),this._firstOperandSelect.set("value",d[this.selectedFirstOperand.id]));(this.get("showReadyToUseLayers")||this.get("showReadyLayersForFirst"))&&this._firstOperandSelect.addOption({type:"separator",value:""});this.get("showReadyToUseLayers")&&this.get("showReadyLayersForFirst")&&this._firstOperandSelect.addOption({value:"browse",
label:this._browseTitle});this.get("showBrowseLayers")&&this.get("showReadyLayersForFirst")&&this._firstOperandSelect.addOption({value:"browselayers",label:this.i18n.browseLayers});1===g&&!this.get("showReadyToUseLayers")&&!this.get("showBrowseLayers")&&this._operatorSelect&&this._operatorSelect.getOptions()&&(this._operatorSelect.removeOption(this._operatorSelect.getOptions()),this._operatorSelect.addOption({value:"where",label:this.i18n.where}))}"add"===this.get("action")&&(this._operatorSelect.set("value",
"where"),this._handleOperatorChange("where"),this._distanceInput.set("value",""),"metric"===this.defaultUnits?this._distanceUnitsSelect.set("value","Kilometers"):this._distanceUnitsSelect.set("value","Miles"))},startup:function(){},clear:function(){this.init()},_validateDistance:function(a){var c=this._operatorSelect.get("value");return-1===e.indexOf(["withinDistance","notWithinDistance"],c)?!0:(a=x.parse(a))&&0<parseFloat(a,10)&&Infinity>parseFloat(a,10)},_handleAttributeFilterChange:function(){var a;
this._attributeFilter&&(a=this._attributeFilter.toJson(),a=this._attributeFilter.builtSingleFilterString(a),a.whereClause?this._addBtn.set("disabled",!1):this._addBtn.set("disabled",!0))},_handleSecondOperandChange:function(a){if("browse"===a||"browselayers"===a)this.owningWidget.showReadyToUseLayersDialog(!1,a),this.owningWidget.layersSelect=this._secondOperandSelect},_handleFirstOperandChange:function(a){"browse"!==a&&"browselayers"!==a||!this.get("showReadyLayersForFirst")?this._handleOperatorChange("where"):
(this.owningWidget.showReadyToUseLayersDialog(!0,a),this.owningWidget.layersSelect=this._firstOperandSelect)},_handleDistanceInputChange:function(a){this._addBtn.set("disabled",!this._distanceInput.validate())},_handleOperatorChange:function(a){a=this._operatorSelect.get("value");-1===e.indexOf(["where","withinDistance","notWithinDistance"],a)?this._buildSpatialExpression(a):"where"===a?(parseInt(this._firstOperandSelect.get("value"),10),this._buildAttributeExpression(a)):-1!==e.indexOf(["withinDistance",
"notWithinDistance"],a)&&this._buildDistanceExpression(a)},_isValidSecondOperand:function(a,c,b){var d=!1;"contains"===a||"notContains"===a?"esriGeometryPoint"!==c&&"esriGeometryMultipoint"!==c||"esriGeometryPoint"!==b&&"esriGeometryMultipoint"!==b?"esriGeometryPolyline"!==c||"esriGeometryPoint"!==b&&"esriGeometryPolyline"!==b&&"esriGeometryMultipoint"!==b?"esriGeometryPolygon"===c&&(d=!0):d=!0:d=!0:"within"===a||"notWithin"===a?"esriGeometryPoint"===c||"esriGeometryMultipoint"===c?d=!0:"esriGeometryPolyline"!==
c||"esriGeometryPolygon"!==b&&"esriGeometryPolyline"!==b?"esriGeometryPolygon"===c&&"esriGeometryPolygon"===b&&(d=!0):d=!0:d=!0;return d},_isValidFirstOperand:function(a){var c=!0;a&&a.fields?a.fields&&1===a.fields.length&&"esriFieldTypeOID"===a.fields[0].type&&(this._showMessages(t.substitute(this.i18n.inValidAttributeFilterMessage,{layername:a.name})),c=!1):c=!1;return c},_buildSpatialExpression:function(a){var c,d;c=parseInt(this._firstOperandSelect.get("value"),10);d=this.inputOperands[c].geometryType;
this._addBtn.set("disabled",!1);this._distanceInput.set("required",!1);b.set(this._attrFilterDiv,"display","none");b.set(this._secondOperandSelect.domNode,"display","");this._secondOperandSelect&&(this._secondOperandSelect.getOptions()&&this._secondOperandSelect.removeOption(this._secondOperandSelect.getOptions()),e.forEach(this.inputOperands,function(c,b){b.toString()!==this._firstOperandSelect.get("value")&&this._isValidSecondOperand(a,d,c.geometryType)&&(this._secondOperandSelect.addOption({value:b.toString(),
label:c.name}),""!==this._secondOperandSelect.get("value")&&this._secondOperandSelect.get("value")||this._secondOperandSelect.set("value",b.toString()))},this),(this.get("showReadyToUseLayers")||this.get("showBrowseLayers"))&&this._secondOperandSelect.addOption({type:"separator",value:""}),this.get("showReadyToUseLayers")&&this._secondOperandSelect.addOption({value:"browse",label:this._browseTitle}),this.get("showBrowseLayers")&&this._secondOperandSelect.addOption({value:"browselayers",label:this.i18n.browseLayers}),
b.set(this._secondRow,"display",""),b.set(this._secondExpressionDiv,"display","none"),b.set(this._secondOperandTd,"display",""),b.set(this._secondOperandSelect,{display:"",width:"75%"}))},_buildAttributeExpression:function(a){this._distanceInput.set("required",!1);b.set(this._secondExpressionDiv,"display","none");this._secondOperandSelect&&this._secondOperandSelect.getOptions()&&this._secondOperandSelect.removeOption(this._secondOperandSelect.getOptions());b.set(this._secondOperandSelect.domNode,
"display","none");a=parseInt(this._firstOperandSelect.get("value"),10);a=this.inputOperands[a];this._isValidFirstOperand(a)?(this._addBtn.set("disabled",!0),b.set(this._secondRow,"display",""),b.set(this._attrFilterDiv,"display",""),this._attributeFilter&&(this._attributeFilter.init({mapLayer:a,version:a.version,fields:a.fields,allowAllDateTypes:!0,part:"edit"===this.get("action")&&this.expression&&this.expression._attributeExprObj?this.expression._attributeExprObj:null}),this._attributeFilter.set("showUnique",
this.showUnique)),this._attributeFilter||(this._attributeFilter=new F({"class":"filterSegment",mapLayer:a,version:a.version,fields:a.fields,part:"edit"===this.get("action")&&this.expression&&this.expression._attributeExprObj?this.expression._attributeExprObj:null,enableEvents:!0,isEnableInteractiveFilter:!1,allowAllDateTypes:!0,showUnique:this.showUnique},v.create("div",{},this._attrFilterDiv)),this._attributeFilter.fillFieldsList(this._attributeFilter.fieldsStore))):(b.set(this._secondRow,"display",
"none"),b.set(this._attrFilterDiv,"display","none"),this._addBtn.set("disabled",!0))},_buildDistanceExpression:function(a){this._addBtn.set("disabled",!this._distanceInput.validate());this._distanceInput.set("required",!0);b.set(this._secondRow,"display","");b.set(this._secondOperandTd,"display","");b.set(this._secondOperandSelect.domNode,"display","");b.set(this._secondExpressionDiv,{display:"",width:"75%"});b.set(this._secondOperandSelect,{display:"",width:"75%"});b.set(this._attrFilterDiv,"display",
"none");this._secondOperandSelect&&this._secondOperandSelect.getOptions()&&(this._secondOperandSelect.removeOption(this._secondOperandSelect.getOptions()),e.forEach(this.inputOperands,function(a,b){b.toString()!==this._firstOperandSelect.get("value")&&this._secondOperandSelect.addOption({value:b.toString(),label:a.name})},this),(this.get("showReadyToUseLayers")||this.get("showBrowseLayers"))&&this._secondOperandSelect.addOption({type:"separator",value:""}),this.get("showReadyToUseLayers")&&this._secondOperandSelect.addOption({value:"browse",
label:this._browseTitle}),this.get("showBrowseLayers")&&this._secondOperandSelect.addOption({value:"browselayers",label:this.i18n.browseLayers}))},_handleAddButtonClick:function(a){n.stop(a);this._expressionForm&&!this._expressionForm.validate()?this.emit("cancel-expression",{}):(this.set("expression"),this.emit("add-expression",{expression:this.get("expression"),text:this.get("text"),displayText:this.get("displayText"),action:this.get("action")}))},_handleCloseButtonClick:function(a){n.stop(a);this.emit("cancel-expression",
{})},_setInputOperandsAttr:function(a){this.inputOperands=a},_getInputOperandsAttr:function(){return this.inputOperands},_setFirstOperandsAttr:function(a){this.firstOperands=a},_getFirstOperandsAttr:function(a){return this.firstOperands},_setSelectedFirstOperandAttr:function(a){this.selectedFirstOperand=a},_getExpressionAttr:function(a){return this.expression},_setExpressionAttr:function(a){var c,b,f=!1;a?this._operatorSelect&&(this._firstOperandSelect.set("value",a.layer),this._operatorSelect.set("value",
a.spatialRel?a.spatialRel:"where"),"where"===this._operatorSelect.get("value")?f=!0:(-1!==e.indexOf(["withinDistance","notWithinDistance"],this._operatorSelect.get("value"))&&(this._distanceInput.set("value",a.distance),this._distanceUnitsSelect.set("value",a.units)),setTimeout(d.hitch(this,function(){this._secondOperandSelect.set("value",a.selectingLayer)}),100))):(a={},this._operatorSelect&&(a.layer=parseInt(this._firstOperandSelect.get("value"),10),"where"===this._operatorSelect.get("value")?(c=
this._attributeFilter.toJson(),b=this._attributeFilter.builtSingleFilterString(c),a._attributeFilter=b,a._attributeExprObj=c,a._attributeText=this._attributeFilter.buildFriendlyTextExpr(c),a.where=b.whereClause):(a.selectingLayer=parseInt(this._secondOperandSelect.get("value"),10),a.spatialRel=this._operatorSelect.get("value"),-1!==e.indexOf(["withinDistance","notWithinDistance"],this._operatorSelect.get("value"))&&(a.distance=this._distanceInput.get("value"),a.units=this._distanceUnitsSelect.get("value")))));
this.expression=a;f&&this._handleOperatorChange("where")},_showMessages:function(a){u.set(this._bodyNode,"innerHTML",a);m.fadeIn({node:this._errorMessagePane,easing:p.quadIn,onEnd:d.hitch(this,function(){b.set(this._errorMessagePane,{display:""})})}).play()},_handleCloseMsg:function(a){a&&a.preventDefault();m.fadeOut({node:this._errorMessagePane,easing:p.quadOut,onEnd:d.hitch(this,function(){b.set(this._errorMessagePane,{display:"none"})})}).play()},_setActionAttr:function(a){this.action=a},_getActionAttr:function(){return this.action},
_setTextAttr:function(a){this.text=a},_getTextAttr:function(){var a="";this.expression&&(a=this.inputOperands[this.expression.layer].name);this.expression.spatialRel?(a+=" "+this.i18n[this.expression.spatialRel],this.expression.distance&&(a+=" "+this.expression.distance+" "+this.expression.units+" "+this.i18n.from),a+=" "+this.inputOperands[this.expression.selectingLayer].name):a+=" "+this.i18n.whereLabel+" "+this.expression._attributeText;return a},_getDisplayTextAttr:function(){var a="",b;this.expression&&
(b=this.inputOperands[this.expression.layer].name,a+=this.shortenString(b));this.expression.spatialRel?(a+=" \x3clabel style\x3d'font-style: italic;'\x3e"+this.i18n[this.expression.spatialRel],this.expression.distance&&(a+=" "+this.expression.distance+" "+this.expression.units+" "+this.i18n.from),b=this.inputOperands[this.expression.selectingLayer].name,a=a+"\x3c/label\x3e"+(" "+this.shortenString(b))):a+=" \x3clabel style\x3d'font-style: italic;'\x3e"+this.i18n.whereLabel+" "+this.expression._attributeText+
"\x3c/label";return a+"\x3c/tr\x3e\x3c/tbody\x3e\x3c/table\x3e"},shortenString:function(a){return"\x3clabel style\x3d'overflow: hidden;text-overflow: ellipsis'\x3e"+a+"\x3c/label\x3e\x3c/td\x3e"},_setPrimaryActionButttonClassAttr:function(a){this.primaryActionButttonClass=a},_getPrimaryActionButttonClassAttr:function(){return this.primaryActionButttonClass},_setShowFirstRowAttr:function(a){this.showFirstRow=a},_getShowFirstRowAttr:function(){return this.showFirstRow},_setShowReadyToUseLayersAttr:function(a){this._set("showReadyToUseLayers",
a)},_setShowReadyLayersForFirstAttr:function(a){this._set("showReadyLayersForFirst",a)},_setShowBrowseLayersAttr:function(a){this._set("showBrowseLayers",a)},_setOwningWidgetAttr:function(a){this._set("owningWidget",a)}});r("extend-esri")&&d.setObject("dijit.analysis.ExpressionForm",h,D);return h});