// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://js.arcgis.com/3.24/esri/copyright.txt for details.
//>>built
require({cache:{"url:esri/dijit/analysis/templates/DetectIncidents.html":'\x3cdiv class\x3d"esriAnalysis"\x3e\r\n    \x3cdiv data-dojo-type\x3d"dijit/layout/ContentPane" style\x3d"margin-top:0.5em; margin-bottom: 0.5em;"\x3e\r\n      \x3cdiv data-dojo-attach-point\x3d"_aggregateToolContentTitle" class\x3d"analysisTitle"\x3e\r\n        \x3ctable class\x3d"esriFormTable" \x3e\r\n          \x3ctr\x3e\r\n            \x3ctd class\x3d"esriToolIconTd"\x3e\x3cdiv class\x3d"detectTrackIncidentsIcon"\x3e\x3c/div\x3e\x3c/td\x3e\r\n            \x3ctd class\x3d"esriAlignLeading esriAnalysisTitle" data-dojo-attach-point\x3d"_toolTitle"\x3e\r\n              \x3clabel data-dojo-attach-point\x3d"_titleLbl"\x3e${i18n.detectTrackIncidents}\x3c/label\x3e\r\n              \x3cnav class\x3d"breadcrumbs"  data-dojo-attach-point\x3d"_analysisModeLblNode" style\x3d"display:none;"\x3e\r\n                \x3ca href\x3d"#" class\x3d"crumb breadcrumbs__modelabel" data-dojo-attach-event\x3d"onclick:_handleModeCrumbClick" data-dojo-attach-point\x3d"_analysisModeCrumb"\x3e\x3c/a\x3e\r\n                \x3ca href\x3d"#" class\x3d"crumb is-active" data-dojo-attach-point\x3d"_analysisTitleCrumb" style\x3d"font-size:16px;"\x3e${i18n.detectTrackIncidents}\x3c/a\x3e\r\n              \x3c/nav\x3e\r\n            \x3c/td\x3e\r\n            \x3ctd\x3e\r\n              \x3cdiv class\x3d"esriFloatTrailing" style\x3d"padding:0;"\x3e\r\n                  \x3cdiv class\x3d"esriFloatLeading"\x3e\r\n                    \x3ca href\x3d"#" class\x3d\'esriFloatLeading helpIcon\' esriHelpTopic\x3d"toolDescription"\x3e\x3c/a\x3e\r\n                  \x3c/div\x3e\r\n                  \x3cdiv class\x3d"esriFloatTrailing"\x3e\r\n                    \x3ca href\x3d"#" data-dojo-attach-point\x3d"_closeBtn" title\x3d"${i18n.close}" class\x3d"esriAnalysisCloseIcon"\x3e\x3c/a\x3e\r\n                  \x3c/div\x3e\r\n              \x3c/div\x3e\r\n            \x3c/td\x3e\r\n          \x3c/tr\x3e\r\n        \x3c/table\x3e\r\n      \x3c/div\x3e\r\n      \x3cdiv style\x3d"clear:both; border-bottom: #CCC thin solid; height:1px;width:100%;"\x3e\x3c/div\x3e\r\n    \x3c/div\x3e\r\n    \x3cdiv data-dojo-type\x3d"dijit/form/Form" data-dojo-attach-point\x3d"_form" readOnly\x3d"true"\x3e\r\n       \x3ctable class\x3d"esriFormTable"  data-dojo-attach-point\x3d"_aggregateTable"  style\x3d"border-collapse:collapse;border-spacing:5px;" cellpadding\x3d"5px" cellspacing\x3d"5px"\x3e\r\n         \x3ctbody\x3e\r\n          \x3ctr data-dojo-attach-point\x3d"_titleRow"\x3e\r\n            \x3ctd  colspan\x3d"3" class\x3d"sectionHeader" data-dojo-attach-point\x3d"_toolDescription" \x3e\x3c/td\x3e\r\n          \x3c/tr\x3e\r\n          \x3ctr data-dojo-attach-point\x3d"_analysisLabelRow" style\x3d"display:none;"\x3e\r\n            \x3ctd colspan\x3d"2" style\x3d"padding-bottom:0;"\x3e\r\n              \x3clabel class\x3d"esriFloatLeading  esriTrailingMargin025 esriAnalysisNumberLabel"\x3e${i18n.oneLabel}\x3c/label\x3e\r\n              \x3clabel class\x3d"esriAnalysisStepsLabel"\x3e${i18n.chooseLayer}\x3c/label\x3e\r\n            \x3c/td\x3e\r\n            \x3ctd class\x3d"shortTextInput" style\x3d"padding-bottom:0;"\x3e\r\n              \x3ca href\x3d"#" class\x3d\'esriFloatTrailing helpIcon\' esriHelpTopic\x3d"inputLayer"\x3e\x3c/a\x3e\r\n            \x3c/td\x3e\r\n          \x3c/tr\x3e\r\n          \x3ctr data-dojo-attach-point\x3d"_selectAnalysisRow" style\x3d"display:none;"\x3e\r\n            \x3ctd  colspan\x3d"3" style\x3d"padding-top:0;"\x3e\r\n              \x3cselect class\x3d"esriLeadingMargin1 longInput esriLongLabel"  style\x3d"margin-top:1.0em;" data-dojo-type\x3d"dijit/form/Select" data-dojo-attach-point\x3d"_analysisSelect" data-dojo-attach-event\x3d"onChange:_handleAnalysisLayerChange"\x3e\x3c/select\x3e\r\n            \x3c/td\x3e\r\n          \x3c/tr\x3e\r\n          \x3ctr\x3e\r\n            \x3ctd colspan\x3d"2" style\x3d"padding-bottom:0;"\x3e\r\n              \x3clabel class\x3d"esriFloatLeading  esriTrailingMargin025 esriAnalysisNumberLabel"\x3e${i18n.twoLabel}\x3c/label\x3e\r\n              \x3clabel class\x3d"esriAnalysisStepsLabel"\x3e${i18n.selectFields}\x3c/label\x3e\r\n           \x3c/td\x3e\r\n           \x3ctd class\x3d"shortTextInput" style\x3d"padding-bottom:0;"\x3e\r\n              \x3ca href\x3d"#" class\x3d\'esriFloatTrailing helpIcon\' esriHelpTopic\x3d"trackFields"\x3e\x3c/a\x3e\r\n            \x3c/td\x3e\r\n          \x3c/tr\x3e\r\n          \x3ctr\x3e\r\n            \x3ctd colspan\x3d"3" style\x3d"padding-top:0;"\x3e\r\n              \x3cselect multiple\x3d"true"  class\x3d"esriLeadingMargin1" style\x3d"width:100%;margin-top:10px;" data-dojo-props\x3d"required:true" data-dojo-type\x3d"dojox/form/CheckedMultiSelect" data-dojo-attach-point\x3d"_trackFieldSelect"\x3e\x3c/select\x3e\r\n            \x3c/td\x3e\r\n          \x3c/tr\x3e\r\n          \x3ctr\x3e\r\n          \x3ctr\x3e\r\n            \x3ctd colspan\x3d"2" style\x3d"padding-bottom:0;"\x3e\r\n              \x3clabel class\x3d"esriFloatLeading  esriTrailingMargin025 esriAnalysisNumberLabel"\x3e${i18n.threeLabel}\x3c/label\x3e\r\n              \x3clabel class\x3d"esriAnalysisStepsLabel"\x3e${i18n.buildExpressionStart}\x3c/label\x3e\r\n           \x3c/td\x3e\r\n           \x3ctd class\x3d"shortTextInput" style\x3d"padding-bottom:0;"\x3e\r\n              \x3ca href\x3d"#" class\x3d\'esriFloatTrailing helpIcon\' esriHelpTopic\x3d"startConditionExpression"\x3e\x3c/a\x3e\r\n            \x3c/td\x3e\r\n          \x3c/tr\x3e\r\n          \x3ctr\x3e\r\n            \x3ctd colspan\x3d"3"\x3e\r\n              \x3ctable style\x3d"width:90%"\x3e\r\n                \x3ctr\x3e\r\n                  \x3ctd colspan\x3d"2"\x3e\r\n                    \x3cinput type\x3d"text" data-dojo-type\x3d"dijit/form/ValidationTextBox" class\x3d"esriLeadingMargin1 longInput" data-dojo-props\x3d"trim:true,required:true" data-dojo-attach-point\x3d"_bufStartInput" value\x3d""\x3e\x3c/input\x3e\r\n                  \x3c/td\x3e\r\n                  \x3ctd class\x3d"shortTextInput"\x3e\r\n                    \x3cdiv data-dojo-type\x3d"dijit/form/Button" class\x3d"esriActionButton" data-dojo-props\x3d"label:\'${i18n.add}\',iconClass:\'esriAnalysisExpIcon\',showLabel: false" data-dojo-attach-point\x3d"_expStartBtn" data-dojo-attach-event\x3d"onClick:_handleStartExpBtnClick"\x3e\x3c/div\x3e\r\n                  \x3c/td\x3e\r\n               \x3c/tr\x3e\r\n              \x3c/table\x3e\r\n            \x3c/td\x3e\r\n          \x3c/tr\x3e\r\n          \x3ctr\x3e\r\n            \x3ctd colspan\x3d"2"\x3e\r\n              \x3clabel class\x3d"esriFloatLeading esriTrailingMargin025 esriAnalysisNumberLabel"\x3e${i18n.fourLabel}\x3c/label\x3e\r\n              \x3clabel class\x3d"esriAnalysisStepsLabel"\x3e${i18n.buildExpressionEnd}\x3c/label\x3e\r\n            \x3c/td\x3e\r\n            \x3ctd class\x3d"shortTextInput"\x3e\r\n              \x3ca href\x3d"#" class\x3d\'esriFloatTrailing helpIcon\' esriHelpTopic\x3d"endConditionExpression"\x3e\x3c/a\x3e\r\n            \x3c/td\x3e\r\n          \x3c/tr\x3e\r\n          \x3ctr\x3e\r\n            \x3ctd colspan\x3d"3" class\x3d"clear"\x3e\r\n              \x3ctable style\x3d"width:90%"\x3e\r\n                \x3ctr\x3e\r\n                  \x3ctd colspan\x3d"2"\x3e\r\n                    \x3cinput type\x3d"text" data-dojo-type\x3d"dijit/form/ValidationTextBox" class\x3d"esriLeadingMargin1 longInput" data-dojo-props\x3d"trim:true" data-dojo-attach-point\x3d"_bufEndInput" value\x3d""\x3e\x3c/input\x3e\r\n                  \x3c/td\x3e\r\n                  \x3ctd class\x3d"shortTextInput"\x3e\r\n                    \x3cdiv data-dojo-type\x3d"dijit/form/Button" class\x3d"esriActionButton" data-dojo-props\x3d"label:\'${i18n.add}\',iconClass:\'esriAnalysisExpIcon\',showLabel: false" data-dojo-attach-point\x3d"_expEndBtn" data-dojo-attach-event\x3d"onClick:_handleEndExpBtnClick"\x3e\x3c/div\x3e\r\n                  \x3c/td\x3e\r\n               \x3c/tr\x3e\r\n              \x3c/table\x3e\r\n            \x3c/td\x3e\r\n          \x3c/tr\x3e\r\n          \x3ctr\x3e\r\n            \x3ctd colspan\x3d"2"\x3e\r\n              \x3clabel class\x3d"esriFloatLeading esriTrailingMargin025 esriAnalysisNumberLabel"\x3e${i18n.fiveLabel}\x3c/label\x3e\r\n              \x3clabel class\x3d"esriAnalysisStepsLabel"\x3e${i18n.showMeLabel}\x3c/label\x3e\r\n            \x3c/td\x3e\r\n            \x3ctd class\x3d"shortTextInput"\x3e\r\n              \x3ca href\x3d"#" class\x3d\'esriFloatTrailing helpIcon\' esriHelpTopic\x3d"outputMode"\x3e\x3c/a\x3e\r\n            \x3c/td\x3e\r\n          \x3c/tr\x3e\r\n          \x3ctr  data-dojo-attach-point\x3d"_outputModeRow"\x3e\r\n            \x3ctd colspan\x3d"3"\x3e\r\n              \x3cdiv class\x3d"esriLeadingMargin1" style\x3d"width:100%;"\x3e\r\n                \x3clabel class\x3d"esriSelectLabel"\x3e\r\n                  \x3cinput type\x3d"radio" data-dojo-type\x3d"dijit/form/RadioButton" data-dojo-attach-point\x3d"_allFeaturesCheck" data-dojo-props\x3d"\'class\':\'esriSelectLabel\',checked:true" name\x3d"outputMode"/\x3e\r\n                  ${i18n.allFeatures}\r\n                \x3c/label\x3e\r\n                \x3cbr/\x3e\r\n                \x3clabel class\x3d"esriSelectLabel"\x3e\r\n                  \x3cinput type\x3d"radio" data-dojo-type\x3d"dijit/form/RadioButton" data-dojo-attach-point\x3d"_onlyIncidentsCheck" data-dojo-props\x3d"\'class\':\'esriSelectLabel\'" name\x3d"outputMode"/\x3e\r\n                  ${i18n.onlyIncidents}\r\n                \x3c/label\x3e\r\n              \x3c/div\x3e\r\n            \x3c/td\x3e\r\n          \x3c/tr\x3e\r\n          \x3ctr\x3e\r\n            \x3ctd colspan\x3d"2"\x3e\r\n              \x3clabel class\x3d"esriFloatLeading esriTrailingMargin025 esriAnalysisNumberLabel"\x3e${i18n.sixLabel}\x3c/label\x3e\r\n              \x3clabel class\x3d"esriAnalysisStepsLabel"\x3e${i18n.outputLayerLabel}\x3c/label\x3e\r\n            \x3c/td\x3e\r\n            \x3ctd class\x3d"shortTextInput"\x3e\r\n              \x3ca href\x3d"#" class\x3d\'esriFloatTrailing helpIcon\' esriHelpTopic\x3d"outputName"\x3e\x3c/a\x3e\r\n            \x3c/td\x3e\r\n          \x3c/tr\x3e\r\n          \x3ctr\x3e\r\n            \x3ctd colspan\x3d"3"\x3e\r\n              \x3cinput type\x3d"text" data-dojo-type\x3d"dijit/form/ValidationTextBox" class\x3d"esriLeadingMargin1 longInput" data-dojo-props\x3d"trim:true,required:true" data-dojo-attach-point\x3d"_outputLayerInput" value\x3d""\x3e\x3c/input\x3e\r\n            \x3c/td\x3e\r\n          \x3c/tr\x3e\r\n          \x3ctr\x3e\r\n            \x3ctd colspan\x3d"3"\x3e\r\n               \x3cdiv class\x3d"esriLeadingMargin1" data-dojo-attach-point\x3d"_chooseFolderRow"\x3e\r\n                 \x3clabel style\x3d"width:9px;font-size:smaller;"\x3e${i18n.saveResultIn}\x3c/label\x3e\r\n                 \x3cinput class\x3d"longInput esriFolderSelect" data-dojo-attach-point\x3d"_webMapFolderSelect" dojotype\x3d"dijit/form/FilteringSelect" trim\x3d"true"\x3e\x3c/input\x3e\r\n               \x3c/div\x3e\r\n            \x3c/td\x3e\r\n          \x3c/tr\x3e\r\n        \x3c/tbody\x3e\r\n       \x3c/table\x3e\r\n     \x3c/div\x3e\r\n    \x3cdiv data-dojo-attach-point\x3d"_aggregateToolContentButtons" style\x3d"padding:5px;margin-top:5px;border-top:solid 1px #BBB;"\x3e\r\n      \x3cdiv class\x3d"esriExtentCreditsCtr"\x3e\r\n        \x3ca class\x3d"esriFloatTrailing esriSmallFont"  href\x3d"#" data-dojo-attach-point\x3d"_showCreditsLink" data-dojo-attach-event\x3d"onclick:_handleShowCreditsClick"\x3e${i18n.showCredits}\x3c/a\x3e\r\n       \x3clabel data-dojo-attach-point\x3d"_chooseExtentDiv" class\x3d"esriSelectLabel esriExtentLabel"\x3e\r\n         \x3cinput type\x3d"radio" data-dojo-attach-point\x3d"_useExtentCheck" data-dojo-type\x3d"dijit/form/CheckBox" data-dojo-props\x3d"checked:true" name\x3d"extent" value\x3d"true"/\x3e\r\n           ${i18n.useMapExtent}\r\n       \x3c/label\x3e\r\n      \x3c/div\x3e\r\n      \x3cbutton data-dojo-type\x3d"dijit/form/Button" type\x3d"submit" data-dojo-attach-point\x3d"_saveBtn" class\x3d"esriLeadingMargin4 esriAnalysisSubmitButton" data-dojo-attach-event\x3d"onClick:_handleSaveBtnClick"\x3e\r\n          ${i18n.runAnalysis}\r\n      \x3c/button\x3e\r\n    \x3c/div\x3e\r\n    \x3cdiv data-dojo-type\x3d"dijit/Dialog" title\x3d"${i18n.creditTitle}" data-dojo-attach-point\x3d"_usageDialog" style\x3d"width:40em;"\x3e\r\n      \x3cdiv data-dojo-type\x3d"esri/dijit/analysis/CreditEstimator"  data-dojo-attach-point\x3d"_usageForm"\x3e\x3c/div\x3e\r\n    \x3c/div\x3e\r\n    \x3cdiv data-dojo-type\x3d"dijit/Dialog" data-dojo-attach-point\x3d"_exprDialog" class\x3d"esriBufExpressDialog"\x3e\r\n      \x3cdiv class\x3d"esriBufExpressionFormCtr"\x3e\r\n        \x3cdiv data-dojo-attach-point\x3d"_expressionCtr"\x3e\x3c/div\x3e\r\n      \x3c/div\x3e\r\n    \x3c/div\x3e\r\n  \x3c/div\x3e\r\n'}});
define("esri/dijit/analysis/DetectIncidents","require dojo/aspect dojo/_base/declare dojo/_base/lang dojo/_base/array dojo/_base/connect dojo/_base/json dojo/has dojo/json dojo/string dojo/dom-style dojo/dom-attr dojo/dom-construct dojo/query dojo/dom-class dojo/on dijit/_WidgetBase dijit/_TemplatedMixin dijit/_WidgetsInTemplateMixin dijit/_OnDijitClickMixin dijit/_FocusMixin dijit/registry dijit/form/Button dijit/form/CheckBox dijit/form/Form dijit/form/Select dijit/form/TextBox dijit/form/ValidationTextBox dijit/layout/ContentPane dijit/form/FilteringSelect dijit/Dialog dojox/form/CheckedMultiSelect ../../kernel ../../lang ./AnalysisBase ./utils ./CreditEstimator ./_AnalysisOptions ../CalculateField dojo/i18n!../../nls/jsapi dojo/text!./templates/DetectIncidents.html".split(" "),
function(h,q,r,b,t,l,m,u,F,k,e,G,H,I,v,J,w,x,y,z,A,K,L,M,N,O,P,Q,R,S,T,U,n,p,B,d,V,C,g,D,E){h=r([w,x,y,z,A,C,B],{declaredClass:"esri.dijit.analysis.DetectIncidents",templateString:E,widgetsInTemplate:!0,inputLayer:null,outputLayerName:null,i18n:null,toolName:"DetectIncidents",helpFileName:"DetectIncidents",resultParameter:"output",constructor:function(a){this._pbConnects=[];a.containerNode&&(this.container=a.containerNode);a.trackFields&&"string"===typeof a.trackFields&&(a.trackFields=a.trackFields.split(","))},
destroy:function(){this.inherited(arguments);t.forEach(this._pbConnects,l.disconnect);delete this._pbConnects},postMixInProperties:function(){this.inherited(arguments);b.mixin(this.i18n,D.detectTrackIncidentsTool)},postCreate:function(){this.inherited(arguments);v.add(this._form.domNode,"esriSimpleForm");e.set(this._trackFieldSelect.selectNode,"width","90%");this._outputLayerInput.set("validator",b.hitch(this,this.validateServiceName));this._buildUI()},startup:function(){},_onClose:function(a){this._aspectHandle&&
(this._aspectHandle.remove(),this._aspectHandle=null);a&&(this._save(),this.emit("save",{save:!0}));this.emit("close",{save:a})},_handleSaveBtnClick:function(){if(this._form.validate()){this._saveBtn.set("disabled",!0);var a={};a.jobParams=this._buildJobParams();a.itemParams={description:k.substitute(this.i18n.itemDescription,{inputLayername:this.inputLayer.name}),tags:k.substitute(this.i18n.itemTags,{inputLayername:this.inputLayer.name}),snippet:this.i18n.itemSnippet};this.showSelectFolder&&(a.itemParams.folder=
this.get("folderId"));this.showGeoAnalyticsParams&&(a.isSpatioTemporalDataStore=!0);console.log(a);this.execute(a)}},_handleShowCreditsClick:function(a){a.preventDefault();a=this._buildJobParams();this._form.validate()&&this.getCreditsEstimate(this.toolName,a).then(b.hitch(this,function(a){this._usageForm.set("content",a);this._usageDialog.show()}))},_buildJobParams:function(){var a={},c=this.constructAnalysisInputLyrObj(this.inputLayer,!0);a.inputLayer=c;a.trackFields=this._trackFieldSelect.get("value").toString();
this._bufStartInput.get("value")&&(a.startConditionExpression=this._bufStartInput.get("value"));this._bufEndInput.get("value")&&(a.endConditionExpression=this._bufEndInput.get("value"));a.outputMode=this._allFeaturesCheck.get("checked")?"AllFeatures":"Incidents";this.returnFeatureCollection||(a.OutputName=m.toJson({serviceProperties:{name:this._outputLayerInput.get("value")}}));this.showChooseExtent&&this._useExtentCheck.get("checked")&&(a.context=m.toJson({extent:this.map.extent._normalize(!0)}));
return a},_handleBrowseItemsSelect:function(a){a&&a.selection&&d.addAnalysisReadyLayer({item:a.selection,layers:this.inputLayers,layersSelect:this._analysisSelect,browseDialog:a.dialog||this._browsedlg,widget:this}).always(b.hitch(this,this._updateAnalysisLayerUI,!0))},_handleAttrSelectChange:function(a){var c;"0"!==a&&(c=this.get("statisticSelect"),(a=this.getOptions(a))&&a.type&&d.addStatisticsOptions({selectWidget:c,type:a.type,showGeoAnalyticsParams:this.showGeoAnalyticsParams}),"0"===c.get("value")||
c.get("isnewRowAdded")||(a=c.get("removeTd"),e.set(a,"display","block"),a=c.get("referenceWidget"),b.hitch(a,a._createStatsRow)(),c.set("isnewRowAdded",!0)))},_handleStatsValueUpdate:function(a,c,f){this.get("attributeSelect")&&(a=this.get("attributeSelect"),a.get("value")&&"0"!==a.get("value")&&f&&"0"!==f&&!this.get("isnewRowAdded")&&(f=this.get("removeTd"),e.set(f,"display","block"),f=this.get("referenceWidget"),b.hitch(f,f._createStatsRow)(),this.set("isnewRowAdded",!0)))},_handleDistUnitsChange:function(a){},
_handleDurSplitValue:function(a){},_save:function(){},_buildUI:function(){var a=!0;d.initHelpLinks(this.domNode,this.showHelp);this.get("showSelectAnalysisLayer")&&(this.inputLayers&&this.inputLayer&&!d.isLayerInLayers(this.inputLayer,this.inputLayers)&&this.inputLayers.push(this.inputLayer),this.get("inputLayer")||!this.get("inputLayers")||this.rerun||this.set("inputLayer",this.inputLayers[0]),d.populateAnalysisLayers(this,"inputLayer","inputLayers"));d.addReadyToUseLayerOption(this,[this._analysisSelect]);
this.outputLayerName&&(this._outputLayerInput.set("value",this.outputLayerName),a=!1);e.set(this._chooseFolderRow,"display",!0===this.showSelectFolder?"block":"none");this.showSelectFolder&&this.getFolderStore().then(b.hitch(this,function(a){this.folderStore=a;d.setupFoldersUI({folderStore:this.folderStore,folderId:this.folderId,folderName:this.folderName,folderSelect:this._webMapFolderSelect,username:this.portalUser?this.portalUser.username:""})}));e.set(this._chooseExtentDiv,"display",!0===this.showChooseExtent?
"inline-block":"none");e.set(this._showCreditsLink,"display",!0===this.showCredits?"block":"none");this.outputLayerName&&(this._outputLayerInput.set("value",this.outputLayerName),a=!1);this.outputMode&&(this._allFeaturesCheck.set("checked","AllFeatures"===this.outputMode),this._onlyIncidentsCheck.set("checked","Incidents"===this.outputMode));this.startConditionExpression&&this._bufStartInput.set("value",this.startConditionExpression);this.endConditionExpression&&this._bufEndInput.set("value",this.endConditionExpression);
this._updateAnalysisLayerUI(a);this._loadConnections()},_loadConnections:function(){this.on("start",b.hitch(this,"_onClose",!0));this._connect(this._closeBtn,"onclick",b.hitch(this,"_onClose",!1))},_handleAnalysisLayerChange:function(a){"browse"===a?this._browsedlg.show():"browselayers"===a?(this.showGeoAnalyticsParams&&(a=this._browseLyrsdlg.browseItems.get("query"),a.types.push('type:"Big Data File Share"'),this._browseLyrsdlg.browseItems.set("query",a)),this._isAnalysisSelect=!0,this._browseLyrsdlg.browseItems.plugIn.checkLayerType=
!0,this._browseLyrsdlg.browseItems.plugIn.checkGeometryType=!1,this._browseLyrsdlg.browseItems.plugIn.checkTimeFilter=!0,this._browseLyrsdlg.show()):(this.inputLayer=this.inputLayers[a],this._updateAnalysisLayerUI(!0))},_updateAnalysisLayerUI:function(a){this._expStartBtn.set("disabled",!this.inputLayer);this._expEndBtn.set("disabled",!this.inputLayer);this._bufStartInput.set("disabled",!this.inputLayer);this._bufEndInput.set("disabled",!this.inputLayer);if(this.inputLayer)if(d.addAttributeOptions({selectWidget:this._trackFieldSelect,
layer:this.inputLayer,allowStringType:!0,allowSelectLabel:!1}),!a&&this.trackFields&&0<this.trackFields.length&&this._trackFieldSelect.set("value",this.trackFields),a&&(this.outputLayerName=k.substitute(this.i18n.outputLayerName,{inputLayername:this.inputLayer.name}),this._outputLayerInput.set("value",this.outputLayerName)),this._calcField)this._calcField&&this._calcField.layer!==this.inputLayer&&(this._bufStartInput.set("value",""),this._bufEndInput.set("value",""),this._calcField.reset(),this._calcField.set("layer",
this.inputLayer));else{var c=d.getExprFunctions();this._calcField=new g({expressionMode:g.MODE_ARCADE,arcadeEditor:this.arcadeEditor,map:this.map,layer:this.inputLayer,field:this.i18n.bufField,baseClass:"esriBufFieldExp",helperMethods:c,showHelp:!0,helpUrl:d.getHelpUrl({widget:this,topic:"BufferExpression"}),css:{base:"esriBufFieldExp",addButton:"btn calcite primary",closeButton:"btn calcite cancel"},helperType:"numeric",showHeader:!1,calculateLabel:this.i18n.add,expression:!a&&this.startConditionExpression?
this.startConditionExpression:null},this._expressionCtr);this._calcField.startup();if(this._calcField.expressionMode===g.MODE_SQL)e.set(this._calcField._validateBtn.domNode,"display","none"),this._calcField._handleHelperTypeChange("value",null,{functionType:"NumType"}),this._aspectHandle=q.around(this._calcField,"_handleAddButtonClick",b.hitch(this,function(a){return b.hitch(this,function(a,b){var c=this._calcField.get("expression")[0];"start"===this._expType?this._bufStartInput.set("value",c.sqlExpression):
"end"===this._expType&&this._bufEndInput.set("value",c.sqlExpression);this._exprDialog.hide()})}));else if(this._calcField.expressionMode===g.MODE_ARCADE)this._calcField.on("expression-add",b.hitch(this,function(a){"start"===this._expType?this._bufStartInput.set("value",a.expression):"end"===this._expType&&this._bufEndInput.set("value",a.expression)}));this._calcField.on("close",b.hitch(this,function(){this._exprDialog.hide()}))}},_handleExpBtnClick:function(a){this._expType=a;this._calcField.set("expression",
"start"===a?this._bufStartInput.get("value"):this._bufEndInput.get("value"));n.show(this._calcField.domNode);this._exprDialog.show()},_handleStartExpBtnClick:function(){this._handleExpBtnClick("start")},_handleEndExpBtnClick:function(){this._handleExpBtnClick("end")},_setAnalysisGpServerAttr:function(a){a&&(this.analysisGpServer=a,this.set("toolServiceUrl",this.analysisGpServer+"/"+this.toolName))},_setInputLayerAttr:function(a){p.isDefined(a)&&d.isTimeInstantLayer(a)?this.inputLayer=a:this.inputLayer=
null},_setDisableRunAnalysisAttr:function(a){this._saveBtn.set("disabled",a)},validateServiceName:function(a){return d.validateServiceName(a,{textInput:this._outputLayerInput})},_setInputLayersAttr:function(a){p.isDefined(a)&&(this.inputLayers=a)},_connect:function(a,c,b){this._pbConnects.push(l.connect(a,c,b))}});u("extend-esri")&&b.setObject("dijit.analysis.DetectIncidents",h,n);return h});