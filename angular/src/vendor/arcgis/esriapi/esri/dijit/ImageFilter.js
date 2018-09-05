// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://js.arcgis.com/3.24/esri/copyright.txt for details.
//>>built
require({cache:{"url:esri/dijit/ImageFilter/templates/ImageFilter.html":'\x3cdiv class\x3d"esriImageFilterSliderHorizontal"\x3e\r\n    \x3cdiv data-dojo-attach-point\x3d"esriImageFilterCardsDiv"\x3e\r\n        \x3cdiv data-dojo-attach-point\x3d"layerInfo" class\x3d"esriImageFilterSliderInfo"\x3e\x3c/div\x3e\r\n        \x3cdiv data-dojo-type\x3d"dijit/TitlePane" data-dojo-attach-point\x3d"attributeCard" class\x3d"esriImageFilterCards" toggleable\x3d"false"\r\n            data-dojo-props\x3d"title: \'${_i18n.attributeCard}\'"\x3e\r\n            \x3ctable class\x3d"esriImageFilterSliderTableHorizontal" data-dojo-attach-point\x3d"ifSliderTable"\x3e\r\n                \x3ctr\x3e\r\n                    \x3ctd\x3e\r\n                        \x3cimg class\x3d"loadingImageFilter" data-dojo-attach-point\x3d"_loadingImageFilter" src\x3d"../js/jsapi/esri/dijit/images/loading-throb.gif"\x3e\r\n                    \x3c/td\x3e\r\n                \x3c/tr\x3e\r\n                \x3ctr\x3e\r\n                    \x3ctd class\x3d"esriImageFilterFieldSelectBox"\x3e\r\n                        \x3cdiv class\x3d"esriImageFilterSettingsSelect" data-dojo-type\x3d"dijit/form/Select" data-dojo-attach-point\x3d"fieldSelect" data-dojo-props\x3d"labelAttr: \'alias\'"\x3e\x3c/div\x3e\r\n                    \x3c/td\x3e\r\n                    \x3ctd class\x3d"esriImageFilterSliderSelectIcons"\x3e\r\n                        \x3cspan data-dojo-type\x3d"dijit/form/Button" data-dojo-props\x3d"iconClass: \'esriImageFilterIcons esriImageFilterSettings\'" data-dojo-attach-event\x3d"onClick: _openSettings"\r\n                            title\x3d"${_i18n.settingsButton}" data-dojo-attach-point\x3d"settingsButton" class\x3d"esriImageFilterButton"\x3e\x3c/span\x3e\r\n                    \x3c/td\x3e\r\n                \x3c/tr\x3e\r\n                \x3ctr\x3e\r\n                    \x3ctd\x3e\r\n                        \x3cdiv class\x3d"esriImageFilterfieldInfo" data-dojo-attach-point\x3d"_fieldInfo"\x3e\x3c/div\x3e\r\n                    \x3c/td\x3e\r\n                \x3c/tr\x3e\r\n                \x3ctr\x3e\r\n                    \x3ctd colspan\x3d"2" class\x3d"esriImageFilterSliderCellHorizontal" data-dojo-attach-point\x3d"_ifSliderCell"\x3e\x3c/td\x3e\r\n                    \x3ctd class\x3d"esriImageFilterDefineRange"\x3e\r\n                        \x3cspan data-dojo-type\x3d"dijit/form/Button" data-dojo-props\x3d"iconClass: \'esriImageFilterIcons esriImageFilterSingleButton\'"\r\n                            data-dojo-attach-event\x3d"onClick: _setUseRangesAttr" title\x3d"${_i18n.singleValue}" data-dojo-attach-point\x3d"defineRangeButton"\r\n                            class\x3d"esriImageFilterButton"\x3e\x3c/span\x3e\r\n                    \x3c/td\x3e\r\n                \x3c/tr\x3e\r\n            \x3c/table\x3e\r\n        \x3c/div\x3e\r\n    \x3c/div\x3e\r\n    \x3cdiv data-dojo-type\x3d"dijit/TitlePane" data-dojo-attach-point\x3d"resultTitle" class\x3d"esriImageFilterResultCard" toggleable\x3d"false"\r\n        data-dojo-props\x3d"title: \'${_i18n.resultTiltle}\'"\x3e\r\n        \x3ctable class\x3d"esriImageFilterResultTable"\x3e\r\n            \x3ctr\x3e\r\n                \x3ctd\x3e\r\n                    \x3cdiv data-dojo-attach-point\x3d"selectRasterInfo" class\x3d"esriImageFilterSelectRasterInfo"\x3e \x3c/div\x3e\r\n                \x3c/td\x3e\r\n                \x3ctd colspan\x3d"2" class\x3d"esriImageFilterResultPanelOptions"\x3e\r\n                    \x3cspan data-dojo-type\x3d"dijit/form/Button" data-dojo-props\x3d"iconClass: \'esriImageFilterIcons esriImageFilterZoomToButton\'"\r\n                        data-dojo-attach-event\x3d"onClick: _setMapExtent" title\x3d"${_i18n.extentLink}" data-dojo-attach-point\x3d"zoomTo"\r\n                        class\x3d"esriImageFilterButton"\x3e\x3c/span\x3e\r\n\r\n                    \x3cspan data-dojo-type\x3d"dijit/form/Button" data-dojo-props\x3d"iconClass: \'esriImageFilterIcons esriImageFilterDscSortIcon\'" data-dojo-attach-event\x3d"onClick: _sortRasters"\r\n                        title\x3d"${_i18n.sortDsc}" data-dojo-attach-point\x3d"sortRasters" class\x3d"esriImageFilterButton"\x3e\x3c/span\x3e\r\n\r\n                    \x3cspan class\x3d"esriImageFilterButton"\x3e\r\n                        \x3cdiv data-dojo-type\x3d"dijit/form/CheckBox" data-dojo-attach-event\x3d"onClick: _handleSelectAll" data-dojo-attach-point\x3d"selectAllRasters"\r\n                            title\x3d"${_i18n.selectAll}" class\x3d"esriImageFilterSelectAllButton"\x3e \x3c/div\x3e\r\n                    \x3c/span\x3e\r\n\r\n                    \x3cspan data-dojo-type\x3d"dijit/form/Button" data-dojo-props\x3d"iconClass: \'esriImageFilterIcons esriImageFilterFieldOptions\'"\r\n                        data-dojo-attach-event\x3d"onClick: _openShowFields" title\x3d"${_i18n.resultSettingToolTip}" data-dojo-attach-point\x3d"showFieldsButton"\r\n                        class\x3d"esriImageFilterButton"\x3e\x3c/span\x3e\r\n                \x3c/td\x3e\r\n            \x3c/tr\x3e\r\n            \x3ctr\x3e\r\n                \x3ctd colspan\x3d"3"\x3e\r\n                    \x3cdiv data-dojo-attach-point\x3d"esriImageFilterImageGridDiv"\x3e\r\n                        \x3cdiv data-dojo-attach-point\x3d"rasterListDiv"\x3e\x3c/div\x3e\r\n                    \x3c/div\x3e\r\n                \x3c/td\x3e\r\n            \x3c/tr\x3e\r\n        \x3c/table\x3e\r\n        \x3cdiv data-dojo-attach-point\x3d"esriImageFilterAddToMapDiv" class\x3d"esriImageFilterAddToMap"\x3e\r\n            \x3cbutton class\x3d"calcite blue" data-dojo-type\x3d"dijit/form/Button" type\x3d"button" data-dojo-attach-point\x3d"_addToMapButton" data-dojo-attach-event\x3d"onClick: _addToMap"\x3e${_i18n.addToMap}\r\n            \x3c/button\x3e\r\n        \x3c/div\x3e\r\n    \x3c/div\x3e\r\n\x3c/div\x3e'}});
define("esri/dijit/ImageFilter","dojo/_base/declare dojo/_base/lang dojo/_base/window dojo/_base/array dojo/_base/html dojo/has dojo/on dojo/string dojo/number dojo/touch dojo/query dojo/json dojo/Evented dojo/Deferred dojo/date dojo/date/locale dojo/i18n!../nls/jsapi dojo/i18n!dojo/cldr/nls/number dojo/dom-class dojo/dom-style dojo/dom-construct dojo/text!./ImageFilter/templates/ImageFilter.html dojo/store/Memory dojo/store/Observable dojo/data/ObjectStore dijit/form/Select dijit/form/HorizontalSlider dijit/form/HorizontalRule dijit/form/HorizontalRuleLabels dijit/_WidgetBase dijit/_TemplatedMixin dijit/_WidgetsInTemplateMixin dojox/form/HorizontalRangeSlider dojox/timing/_base ../domUtils ../lang ../graphic ../symbols/SimpleFillSymbol ../symbols/SimpleLineSymbol ../Color ../request ../layers/MosaicRule ../tasks/query ../tasks/QueryTask ../tasks/ImageServiceIdentifyTask ../tasks/ImageServiceIdentifyParameters ../tasks/ImageServiceProjectTask ../tasks/ProjectParameters ../geometry/Extent ../geometry/geometryEngine ../geometry/mathUtils ../geometry/Point ../geometry/Polygon ./ImageFilter/ImageFilterSettingsDialog ./ImageFilter/ImageFilterSelectFieldsDialog ./RasterList".split(" "),
function(q,e,ea,f,r,fa,D,m,l,ga,t,h,E,u,ha,n,F,G,ia,H,v,I,p,w,J,K,L,M,N,O,P,Q,R,ja,d,g,S,T,U,x,V,k,y,W,z,A,X,Y,Z,B,aa,ka,la,ba,ca,da){return q([O,P,Q,E],{declaredClass:"esri.dijit.ImageFilter",templateString:I,showThumbnail:!1,_viewDropDown:!1,_nLabels:1,_sortAsc:!0,_isDisabled:!1,_mapZoomFactor:2,_mapWidthPanFactor:.75,_searchExtentFactor:.75,_selectAll:!1,_useRanges:!0,_dateFormats:{shortDate:{datePattern:"M/d/y",selector:"date"},shortDateLE:{datePattern:"d/M/y",selector:"date"},longMonthDayYear:{datePattern:"MMMM d, y",
selector:"date"},dayShortMonthYear:{datePattern:"d MMM y",selector:"date"},longDate:{datePattern:"EEEE, MMMM d, y",selector:"date"},shortDateShortTime:{datePattern:"M/d/y",timePattern:"h:mm a",selector:"date and time"},shortDateLEShortTime:{datePattern:"d/M/y",timePattern:"h:mm a",selector:"date and time"},shortDateShortTime24:{datePattern:"M/d/y",timePattern:"H:mm",selector:"date and time"},shortDateLEShortTime24:{datePattern:"d/M/y",timePattern:"H:mm",selector:"date and time"},shortDateLongTime:{datePattern:"M/d/y",
timePattern:"h:mm:ss a",selector:"date and time"},shortDateLELongTime:{datePattern:"d/M/y",timePattern:"h:mm:ss a",selector:"date and time"},shortDateLongTime24:{datePattern:"M/d/y",timePattern:"H:mm:ss",selector:"date and time"},shortDateLELongTime24:{datePattern:"d/M/y",timePattern:"H:mm:ss",selector:"date and time"},longMonthYear:{datePattern:"MMMM y",selector:"date"},shortMonthYear:{datePattern:"MMM y",selector:"date"},year:{datePattern:"y",selector:"date"}},esriDataType:{decimal:{esriFieldTypeDouble:1,
esriFieldTypeSingle:1},integer:{esriFieldTypeInteger:1,esriFieldTypeSmallInteger:1},date:{esriFieldTypeDate:1},string:{esriFieldTypeString:1},notRequired:{esriFieldTypeGeometry:1,esriFieldTypeBlob:1}},_generalWhere:"Category \x3d 1",constructor:function(a,b){q.safeMixin(this,a);this._i18n=F.widgets.imageFilter;this._i18n=e.mixin(this._i18n,G)},startup:function(){this.inherited(arguments);this._initializeGenericVariables();this._setupRasterList();this._setUpNotificationPane();this._fillFieldList();
this._setInitialMosaicRule();this._previousInfo={extent:this.map.extent,level:this.map.getLevel()}},_initializeGenericVariables:function(){this._task=new W(this.layer.url);this._query=new y;this._queryReq=new u;this._imageTask=new z(this.layer.url);this._imageParams=new A;this._identifyReq=new u;this.projectTask=new X;this._extentChangeEvent=this.map.on("extent-change",e.hitch(this,this.mapExtentChange))},mapExtentChange:function(a){var b=!1;a.levelChange&&Math.abs(a.lod.level-this._previousInfo.level)>=
this._mapZoomFactor&&(b=!0);a=Math.abs(aa.getLength(a.extent.getCenter(),this._previousInfo.extent.getCenter()));var c=this._previousInfo.extent.getWidth()*this._mapWidthPanFactor;a>c&&(b=!0);b&&this._updateFilter()},_updateFilter:function(){this.lock&&g.isDefined(this._lockedFeatures)?this._lockedFeatures.geometries.some(function(a){if(B.intersects(a,this.map.extent))return d.hide(this.notificationPane),d.hide(this._linkPanel),!0},this)||(this.showNotification(this._i18n.noLockedImages,15E3),d.show(this._linkPanel)):
(this._queriedExtent=this.map.extent,this._executeQueryTask())},_executeQueryTask:function(){this._deactivateFilter();this._queryReq.cancel();this._query=new y;this._query.geometry=this._getClippedExtent();this._query.outFields=this.selectedFields?this._mergeUnique([this.field.name],this.selectedFields):[this.field.name];this._query.where=this._initialDefExp?this._generalWhere+" AND "+this._initialDefExp:this._generalWhere;g.isDefined(this._lockedLayerRasters)&&0<this._lockedLayerRasters.length&&
(this._query.objectIds=this._lockedLayerRasters);this._query.returnGeometry=!0;this._queryReq=this._task.execute(this._query,e.hitch(this,this._processQueryResults))},_onError:function(a){this.showNotification(this._i18n.queryError,15E3,!0);this._handleNoImagesFound()},_getClippedExtent:function(){this._queriedExtent=this._queriedExtent||this.map.extent;var a=this._queriedExtent.getCenter(),b=(this._queriedExtent.xmax-this._queriedExtent.xmin)*this._searchExtentFactor/2,c=(this._queriedExtent.ymax-
this._queriedExtent.ymin)*this._searchExtentFactor/2;return new Z(a.x-b,a.y-c,a.x+b,a.y+c,this._queriedExtent.spatialReference)},_processQueryResults:function(a){a.features?(this._previousInfo={extent:this.map.extent,level:this.map.getLevel()},this._fieldFeatures=a.features,this.layer.maxRecordCount&&this._fieldFeatures.length===this.layer.maxRecordCount&&this.showNotification(m.substitute(this._i18n.maxRecords,{Number:this.layer.maxRecordCount})),this._setupFieldValueFeatures(),this._updateFilterUx()):
this._onError()},_updateFilterUx:function(){this._fieldLength=this._fieldValues.length;0===this._fieldLength?this._handleNoImagesFound():(this._fieldValues.sort(e.hitch(this,this._sortFun)),this._isDropDown(),this._createWidget())},_createWidget:function(){this._viewDropDown?this._setUpDropDown():this._setUpSlider()},_setupFieldValueFeatures:function(){var a;this._fieldValueFeatures={};this._fieldValues=[];f.forEach(this._fieldFeatures,function(b){a=this._getFormattedValue(b.attributes[this.field.name]);
g.isDefined(a)&&(-1===f.indexOf(this._fieldValues,a)?(this._fieldValues.push(a),this._fieldValueFeatures[a]=[b]):this._fieldValueFeatures[a].push(b))},this)},_handleNoImagesFound:function(){var a=0<this._fieldFeatures.length?this._i18n.attributeNull:this._i18n.noImageMessage;this._selectedRasterList.setData(this._prepareListData());this._fieldInfo.innerHTML="";this.selectRasterInfo.innerHTML=a;d.hide(this._loadingImageFilter);this._addToMapButton.set("disabled",!0);this._addToMapButton.set("title",
this._i18n.addToMapDisable);t(".esriImageFilterResultPanelOptions").forEach(function(a){d.hide(a)})},updateFilterFeatureFormat:function(a){a&&(this.set("field",a.field||this.field),this._setupFieldValueFeatures(),this._updateFilterUx())},_activateFilter:function(){d.hide(this._loadingImageFilter);this.settingsButton.set("disabled",!1);this.defineRangeButton.set("disabled",!1);this._slider&&this._slider.set("disabled",!1);this._toDropDown&&this._toDropDown.set("disabled",!1);t(".esriImageFilterResultPanelOptions").forEach(function(a){d.show(a)})},
_deactivateFilter:function(){d.show(this._loadingImageFilter);this.settingsButton.set("disabled",!0);this.defineRangeButton.set("disabled",!0);this._slider&&this._slider.set("disabled",!0);this._toDropDown&&this._toDropDown.set("disabled",!0)},refresh:function(){this._query||this._initializeGenericVariables();d.hide(this._linkPanel);d.hide(this.notificationPane);this._executeQueryTask()},_setLayerAttr:function(a){a&&(this.layer=a,this.layerInfo.innerHTML=m.substitute(this._i18n.layerInfo,{layer:this.layer.title}),
this.timeAnimation=this.layer.useMapTime,this.dimensionAnimation=this.layer.useMapDimensionValue)},_setFieldAttr:function(a){a&&((this.prevField=this.field)&&this.field.name!==a.name&&(this.value=null),this.field=a,this._fieldStore&&(this._fieldStore.put(a),this.prevField&&!this.prevField.format&&(this.prevField.format=e.clone(this._fieldStore.get(a.name)).format)))},_sortFun:function(a,b){return g.isDefined(a)&&g.isDefined(b)?this._getParsedValue(a)-this._getParsedValue(b):!1},_setUseRangesAttr:function(a){this._useRanges=
!this._useRanges;this.lock=!1;this.defineRangeButton.set("iconClass",this._useRanges?"esriImageFilterIcons esriImageFilterSingleButton":"esriImageFilterIcons esriImageFilterRangeButton");this.defineRangeButton.set("title",this._useRanges?this._i18n.singleValue:this._i18n.rangeValue);a&&(this._destroySlider(),this._setUpSlider())},_setViewDropDownsAttr:function(a){g.isDefined(a)&&(this._viewDropDown=a)},_setUpDropDown:function(){this._destroySlider();this._destroyDropDown();this.value&&this.value.length?
(0<=f.indexOf(this._fieldValues,this.value[0])&&0<=f.indexOf(this._fieldValues,this.value[1])?this.value=this.value:this.value=[this._fieldValues[this._fieldValues.length-2],this._fieldValues[this._fieldValues.length-1]],this._createDropDown(),this._selectedRasterList.setData(this._prepareListData()),this._applyLockRule()):this._getBestFieldValue()},_createDropDown:function(){var a=document.createElement("div");this._ifSliderCell.appendChild(a);this._toDropDown=new K({name:"ToDropDown",width:50,maxHeight:150,
options:this._fillDropDownOptions(this.value[1]),onChange:e.hitch(this,this._onDropDownChange)},a);this._toDropDown.startup()},_setUpSlider:function(){this._fieldValues&&0!==this._fieldValues.length&&(this._destroyDropDown(),this._destroySlider(),this.sliderNode=document.createElement("div"),this._createHorizontalRule(),this._createHorizontalRuleLabels(),this._createSlider())},_createHorizontalRuleLabels:function(){if(this._fieldValues){var a=[];this._nLabels=2;this.field.type in this.esriDataType.date?
f.forEach(this._fieldValues,function(b){a.push(n.format(this._getParsedValue(b),this._dateFormats.shortDate))},this):f.forEach(this._fieldValues,function(b){a.push(b)},this);this.labelNode=document.createElement("div");this.sliderNode.appendChild(this.labelNode);this._horizontalRuleLabels=new N({container:"bottomDecoration",labelStyle:"font-size: 83%; padding-left: 5px;",labels:this._filterLabels(a)},this.labelNode);this._horizontalRuleLabels.startup()}},_createHorizontalRule:function(){var a=this._fieldValues.length;
this.rulesNode=document.createElement("div");this.sliderNode.appendChild(this.rulesNode);50>=a&&1<a&&(this._sliderRules=new M({count:a,style:"height:5px;"},this.rulesNode),this._sliderRules.startup())},_createHorizontalSlider:function(a){this._fieldValues&&(this._slider=new L({name:"horizontal",minimum:0,maximum:this._fieldLength-1,discreteValues:this._fieldLength,showButtons:!0,value:a?a:this._fieldValues.length-1,intermediateChanges:!1,onChange:e.hitch(this,this._onSingleSliderChange)},this.sliderNode),
this._slider.startup())},_createHorizontalRangeSlider:function(a){this._fieldValues&&(this._slider=new R({name:"horizontal",minimum:0,maximum:this._fieldLength-1,discreteValues:this._fieldLength,showButtons:!0,value:a?a:[this._fieldValues.length-2,this._fieldValues.length-1],onChange:e.hitch(this,this._onRangeSliderChange)},this.sliderNode),this._slider.startup())},_onSingleSliderChange:function(a){this._fieldValues&&0!==this._fieldValues.length&&(this.value=a=[this.value[0],this._fieldValues[a]],
this._setFieldInfoText(a),this._selectedRasterList.setData(this._prepareListData()),this._applyLockRule())},_onRangeSliderChange:function(a){this._fieldValues&&0!==this._fieldValues.length&&(a=[this._fieldValues[a[1]],this._fieldValues[a[0]]],a.sort(e.hitch(this,this._sortFun)),this.value=a,this._setFieldInfoText(a),this._selectedRasterList.setData(this._prepareListData()),this._applyLockRule())},_onDropDownChange:function(a){this.field.type in this.esriDataType.date&&this._useRanges&&a<this.value[0]&&
(this.value[0]=this._fieldValues[f.indexOf(this._fieldValues,a)-1],this._fromDropDown.set("value",this.value[0]));this.value=[this.value[0],a];this._selectedRasterList.setData(this._prepareListData());this._applyLockRule()},_applyWhereClauseRule:function(){this._selectAll=this.lock=!1;this.selectAllRasters.set("checked",this._selectAll?!0:!1);this.selectAllRasters.set("title",this._i18n.selectAll);this._checkOnLayer();this._lockedFeatures&&this._selectedAttributeStore&&(this.selectRasterInfo.innerHTML=
this._lockedFeatures.ids.length+"/"+this._selectedAttributeStore.data.length+" "+this._i18n.itemsAdded);this.layer.setMosaicRule(this._initialMosaicRule);this._activateFilter();this._addToMapButton.set("disabled",!0);this._addToMapButton.set("title",this._i18n.addToMapDisable);this.emit("refresh-attrTable")},destroy:function(){this.lock=!1;this._extentChangeEvent.remove();this._applyWhereClauseRule();this._destroySlider();this._destroyDropDown();this._destroyNotification();this.inherited(arguments);
this.emit("destroy-filter")},handleOKButtonClick:function(){this.saveOnCurrentLayer=!0;this.destroy()},_openSettings:function(){this._settingsDlg||(this._settingsDlg=new ba({imageFilter:this}),this._settingsDlg.startup());this._settingsDlg.show()},_openShowFields:function(){this._selectFieldsDlg||(this._selectFieldsDlg=new ca({imageFilter:this}),this._selectFieldsDlg.startup());this._selectFieldsDlg.show()},_destroySlider:function(){this._slider&&(this._slider.destroy(),this._slider=null)},_destroyDropDown:function(){this._toDropDown&&
(this._toDropDown.destroy(),this._toDropDown=null)},_destroyNotification:function(){this.notificationPane&&v.destroy(this.notificationPane)},_createSlider:function(){if(this.value&&this.value.length){var a=[],b=this.prevField.name===this.field.name?this.prevField.format:this.field.format,b=[this._getParsedValue(this.value[0],b),this._getParsedValue(this.value[1],b)];this._ifSliderCell.appendChild(this.sliderNode);2===this._fieldValues.length?a=[0,1]:(a[1]=g.isDefined(this.value[1])?this._findClosestValue(b[1]):
this._fieldValues.length-1,a[0]=g.isDefined(this.value[0])&&this.value[1]!==this.value[0]?this._findClosestValue(b[1]-(b[1]-b[0])):0<a[1]-1?a[1]-1:0);this.value=[this._fieldValues[a[0]],this._fieldValues[a[1]]];this._useRanges?(this._createHorizontalRangeSlider(a),this._onRangeSliderChange(a)):(this._createHorizontalSlider(a[1]),this._onSingleSliderChange(a[1]))}else this._getBestFieldValue()},_getBestFieldValue:function(){if(g.isDefined(this._lockedLayerRasters)&&0<this._lockedLayerRasters.length)this.value=
[this._fieldValues[0],this._fieldValues[this._fieldValues.length-1]],this._createWidget();else{var a=new k(this._initialMosaicRule.toJson());a.where=this._initialDefExp?this._generalWhere+" AND "+this._initialDefExp:this._generalWhere;(new V({url:this.layer.url+"/getSamples",content:{geometry:h.stringify(this.map.extent.getCenter()),geometryType:"esriGeometryPoint",returnGeometry:!1,sampleCount:1,mosaicRule:h.stringify(a),outFields:this.field.name,f:"json"},handleAs:"json",callbackParamName:"callback"})).then(e.hitch(this,
this._processBestScene),e.hitch(this,this._getBestSceneFromIdentify))}},_processBestScene:function(a){if(a&&a.samples){var b=this._getFormattedValue(a.samples[0].attributes[this.field.name]),c;this._fieldValues.some(function(a,d){if(a===b)return c=d,!0});g.isDefined(c)||(c=this._fieldValues.length-1);this.value=0===c?[this._fieldValues[c],this._fieldValues[c]]:[this._fieldValues[c-1],this._fieldValues[c]];this._createWidget()}else this._onNoBestSceneFound()},_getBestSceneFromIdentify:function(){var a=
new z(this.layer.url),b=new A,c,d;b.geometry=this.map.extent.getCenter();var C=new k(this._initialMosaicRule.toJson());C.where=this._initialDefExp?this._generalWhere+" AND "+this._initialDefExp:this._generalWhere;b.mosaicRule=C;b.returnGeometry=!1;a.execute(b,e.hitch(this,function(a){a.catalogItems.features[0]&&(d=this._getFormattedValue(a.catalogItems.features[0].attributes[this.field.name]),this._fieldValues.some(function(a,b){if(a===d)return c=b,!0}));g.isDefined(c)||(c=this._fieldValues.length-
1);this.value=0===c?[this._fieldValues[c],this._fieldValues[c]]:[this._fieldValues[c-1],this._fieldValues[c]];this._createWidget()}),e.hitch(this,this._onNoBestSceneFound))},_onNoBestSceneFound:function(a){a=this._fieldValues.length-1;this.value=[this._fieldValues[a-1],this._fieldValues[a]];this._createWidget()},_getFormattedValue:function(a){if(this.field.format&&g.isDefined(a)){var b=h.parse(this.field.format),c=this.field.type;if(c in this.esriDataType.date)return n.format(new Date(a),this._dateFormats[b.dateFormat]);
if(c in this.esriDataType.integer||c in this.esriDataType.decimal)return a=l.format(a,{places:b.places}),b.digitSeparator||this._i18n.group&&(a=a.replace(new RegExp("\\"+this._i18n.group,"g"),"")),a}else return a},_getParsedValue:function(a,b){if(this.field.format&&g.isDefined(a)){var c=b&&h.parse(b)||h.parse(this.field.format),d=this.field.type;if(d in this.esriDataType.date)return"string"===typeof a?n.parse(a,this._dateFormats[c.dateFormat]):new Date(a);if(d in this.esriDataType.integer||d in this.esriDataType.decimal)return"string"===
typeof a?l.parse(a,{places:c.places}):l.parse(a)}else return a},_setFieldInfoText:function(a,b){var c;g.isDefined(a)&&(c=this._useRanges&&a[0]!=a[1]?a[0]+" - "+a[1]:a[1],this._fieldInfo.innerHTML=c)},_applyLockRule:function(){if(this._lockedFeatures.ids&&0!==this._lockedFeatures.ids.length){this.lock=!0;this._checkOnLayer();var a=new k;a.method=k.METHOD_LOCKRASTER;a.lockRasterIds=this._lockedFeatures.ids;this.layer.setMosaicRule(a);this._activateFilter();this._showMoreImageNotification();this.selectRasterInfo.innerHTML=
this._lockedFeatures.ids.length+"/"+this._selectedAttributeStore.data.length+" "+this._i18n.itemsAdded;this.emit("refresh-attrTable");this._addToMapButton.set("disabled",!1);this._addToMapButton.set("title",this._i18n.addToMapEnable);this._lockedFeatures.ids.length===this._selectedAttributeStore.data.length||this._lockedFeatures.ids.length===this.layer.maxMosaicImageCount?(this._selectAll=!0,this.selectAllRasters.set("title",this._i18n.removeAll)):(this._selectAll=!1,this.selectAllRasters.set("title",
this._i18n.selectAll));this.selectAllRasters.set("checked",this._selectAll?!0:!1)}else this._applyWhereClauseRule()},_showMoreImageNotification:function(){if(this.layer.maxMosaicImageCount&&this._lockedFeatures.ids.length>=this.layer.maxMosaicImageCount){var a=m.substitute(this._i18n.moreLockedImages,{Number:this.layer.maxMosaicImageCount});this.showNotification(a)}},_checkOnLayer:function(){this.timeAnimation&&this.layer.timeInfo&&this.lock&&this.emit("disable-time");this.dimensionAnimation&&this.lock&&
this.layer.activeMapDimensions&&this.emit("disable-dimension");!this.lock&&this.timeAnimation&&this.emit("enable-time");!this.lock&&this.dimensionAnimation&&this.emit("enable-dimension")},_setUpNotificationPane:function(){this.notificationPane=document.createElement("div");this.notificationPane.setAttribute("class","esriImageFilterNotification");this.mapDiv.appendChild(this.notificationPane);this.messagePane=document.createElement("div");this.notificationPane.appendChild(this.messagePane);d.hide(this.notificationPane);
v.place('\x3cdiv class\x3d"linkPanel"\x3e\x3ca class\x3d"esriImageFilterLockedExtentLink"\x3e'+this._i18n.extentLink+'\x3c/a\x3e \x3clabel style\x3d"padding-left: 3em"\x3e\x3c/label\x3e\x3ca class\x3d"esriImageFilterUnlockLink"\x3e'+this._i18n.unlockLink+"\x3c/a\x3e\x3cdiv\x3e",this.notificationPane);this._linkPanel=document.querySelector(".linkPanel");d.hide(this._linkPanel);document.querySelector(".esriImageFilterLockedExtentLink").addEventListener("click",e.hitch(this,this._setMapExtent));document.querySelector(".esriImageFilterUnlockLink").addEventListener("click",
e.hitch(this,this._unlockFilter))},_unlockFilter:function(){this._lockedFeatures={ids:[],geometries:[]};this.lock=!1;d.hide(this._linkPanel);d.hide(this.notificationPane);this._selectedRasterList.setData(this._selectedAttributeStore);this.refresh()},showNotification:function(a,b,c){b=b?b:1E4;var e=this.notificationPane;this.messagePane.innerHTML=a;d.show(e);D.once(this.mapDiv,"mousedown",function(a){"esriImageFilterLockedExtentLink"!=a.target.className&&"esriImageFilterUnlockLink"!=a.target.className&&
d.hide(e)});c||setTimeout(function(){d.hide(e)},b)},_filterLabels:function(a){if(this._nLabels&&a&&a.length){var b=Math.ceil(a.length/this._nLabels),c=f.map(a,function(c,d){return 0===d%b||d===a.length-1?(this.field.type in this.esriDataType.decimal&&0!==c%1&&(c=l.parse(c)),c):""},this);return 1===c.length?[c[0],""]:c}},_fillDropDownOptions:function(a){var b=[];f.forEach(this._fieldValues,function(c){b.push({label:c,value:c,selected:c===a?!0:!1})},this);return b},_findClosestValue:function(a){a=this._getParsedValue(a);
for(var b=this._fieldValues.length-2;0<b;b--){var c=this._getParsedValue(this._fieldValues[b]);if(c<=a){var d=this._getParsedValue(this._fieldValues[b+1]);return Math.abs(d-a)<Math.abs(c-a)?b+1:b}}return 0},_setMapExtent:function(){d.hide(this._linkPanel);d.hide(this.notificationPane);if(this._lockedFeatures&&0===this._lockedFeatures.ids.length)this.showNotification(this._i18n.noLockedImages);else{var a=B.union(this._lockedFeatures.geometries).getExtent();this.map.setExtent(a)}},_addToMap:function(){this.emit("add-to-map",
this.layer.title+"-"+this.field.name+" ("+(0===this._fieldInfo.textContent.length?this._toDropDown.value:this._fieldInfo.textContent)+")")},_fillFieldList:function(){var a=this.layer;a&&a.fields&&(this.layerFields=e.clone(a.fields),f.forEach(this.layerFields,function(a,c){a&&a.type&&(a.type in this.esriDataType.integer?a.format='{"places":0, "digitSeparator":true}':a.type in this.esriDataType.decimal?a.format='{"places":2, "digitSeparator":true}':a.type in this.esriDataType.date?a.format='{"dateFormat":"shortDateShortTime", "timezone":"utc"}':
a.type in this.esriDataType.notRequired&&this.layerFields.splice(c,1))},this),this.layerFields.sort(this.sortObjFun("alias",!1)),this._fieldStore=new J(new p({data:this.layerFields,idProperty:"name"})),this.fieldSelect.set("sortByLabel",!1),this.fieldSelect.set("maxHeight",150),this.fieldSelect.set("store",this._fieldStore),this.fieldSelect.on("change",e.hitch(this,this._onFieldChange)),this.fieldSelect.set("value",this.field.name))},_onFieldChange:function(a){this._setFieldAttr(e.clone(this._fieldStore.get(a)));
this.lock=!1;this._useRanges=!0;this.defineRangeButton.set("iconClass",this._useRanges?"esriImageFilterIcons esriImageFilterSingleButton":"esriImageFilterIcons esriImageFilterRangeButton");this.defineRangeButton.set("title",this._useRanges?this._i18n.singleValue:this._i18n.rangeValue);this._addToSelectedFields(this.prevField.name);this._updateRasterListFields();this._fieldInfo.innerHTML=""},_setInitialMosaicRule:function(){var a=this.layer.mosaicRule;this._lockedFeatures={ids:[],geometries:[]};a?
(this._initialMosaicRule=e.clone(a),this._initialDefExp=this._initialMosaicRule.where?this._initialMosaicRule.where:null,a.method===k.METHOD_LOCKRASTER&&(this._lockedLayerRasters=this._lockedFeatures.ids=a.lockRasterIds)):(this._initialMosaicRule=e.clone(this.layer.defaultMosaicRule),this._initialDefExp=null)},_isDropDown:function(){this.field.type in this.esriDataType.string||1===this._fieldLength?(this._useRanges=!1,this.defineRangeButton.set("iconClass",this._useRanges?"esriImageFilterIcons esriImageFilterSingleButton":
"esriImageFilterIcons esriImageFilterRangeButton"),this.defineRangeButton.set("title",this._useRanges?this._i18n.singleValue:this._i18n.rangeValue),this._viewDropDown=!0,d.hide(this._fieldInfo),d.hide(this.defineRangeButton),this.field.type in this.esriDataType.string?d.hide(this.settingsButton):d.show(this.settingsButton)):(this._viewDropDown=!1,d.show(this._fieldInfo),d.show(this.defineRangeButton),d.show(this.settingsButton))},_setupRasterList:function(){var a=[{name:this.layer.objectIdField,alias:"Object ID",
display:!0},{name:this.field.name+"_formatted",alias:this.field.alias,display:!0}];this.rasterListDiv.innerHTML="";this.selectedFields=[this.layer.objectIdField,this.field.name];this._selectedRasterList=new da({data:new w(new p),showThumbnail:this.showThumbnail,showCheckbox:!0,imageServiceUrl:this.layer.url,fields:a},this.rasterListDiv);this.rasterExtentSymbol=(new T).setOutline((new U).setColor(new x([214,137,16])).setWidth(2)).setColor(new x([249,231,159,.5]));this._selectedRasterList.on("raster-checkbox-select",
e.hitch(this,this._onResultImageCheckBoxChange));this._selectedRasterList.on("raster-select",e.hitch(this,this._onRasterRowSelect));this._selectedRasterList.on("raster-mouseover",e.hitch(this,this._showRasterFootPrint));this._selectedRasterList.on("raster-mouseout",e.hitch(this,this._hideRasterFootPrint));this._selectedRasterList.startup()},_updateLockRasters:function(a){a.selected?this._lockedFeatures.ids.length===this.layer.maxMosaicImageCount?(this._onRasterRowSelect(a),this._showMoreImageNotification()):
(this._lockedFeatures.ids.push(a[this.layer.objectIdField]),this._lockedFeatures.geometries.push(a.geometry)):(a=this._lockedFeatures.ids.indexOf(a[this.layer.objectIdField]),-1<a&&(this._lockedFeatures.ids.splice(a,1),this._lockedFeatures.geometries.splice(a,1)))},_onResultImageCheckBoxChange:function(a){this._updateLockRasters(a);this._applyLockRule()},_onRasterRowSelect:function(a){a=this._selectedAttributeStore.get(a[this.layer.objectIdField]);a.selected=!a.selected;this._selectedRasterList.refresh(!0);
this._onResultImageCheckBoxChange(a)},_prepareListData:function(){var a=[],b;if(this._fieldValues&&0<this._fieldValues.length&&this.value&&2===this.value.length){var c=this._fieldValues.indexOf(this.value[0]),d=this._fieldValues.indexOf(this.value[1]);this._prevLockRasters={ids:[],geometries:[]};this._useRanges?f.forEach(this._fieldValues,function(e,f){f>=c&&f<=d&&(b=this._fieldValueFeatures[e],a=a.concat(this._populateGridStoreData(b)))},this):(b=this._fieldValueFeatures[this.value[1]],a=this._populateGridStoreData(b));
this._lockedFeatures=this._prevLockRasters;this._selectedRasterList.rasterList.maxRowsPerPage=a.length;a.sort(this.sortObjFun("selected",!1,"boolean"))}return this._selectedAttributeStore=new w(new p({data:a,idProperty:this.layer.objectIdField}))},_populateGridStoreData:function(a){var b,c=this.layer.objectIdField,d=this.layer.credential,e=[];f.forEach(a,function(a){b=a.attributes;b.selected=!1;b[this.field.name+"_formatted"]=this._getFormattedValue(b[this.field.name]);b.thumbnailUrl=this.layer.url+
"/"+b[c]+"/thumbnail";b.geometry=a.geometry;d&&d.token&&(b.thumbnailUrl+="?token\x3d"+d.token);f.forEach(this.selectedFields,function(a){g.isDefined(b[a])||(b[a]="")});this._lockedFeatures&&this._lockedFeatures.ids.length&&-1<this._lockedFeatures.ids.indexOf(b[c])&&(this._prevLockRasters.ids.push(b[c]),this._prevLockRasters.geometries.push(a.geometry),b.selected=!0);e.push(b)},this);return e},_handleSelectAll:function(){this._selectAll=!this._selectAll;this.selectAllRasters.set("checked",this._selectAll?
!0:!1);this.selectAllRasters.set("title",this._selectAll?this._i18n.removeAll:this._i18n.selectAll);if(this._selectAll){var a=this._lockedFeatures.ids;f.forEach(this._selectedAttributeStore.data,function(b){0>a.indexOf(b[this.layer.objectIdField])&&a.length<this.layer.maxMosaicImageCount&&(b.selected=!0,this._lockedFeatures.ids.push(b[this.layer.objectIdField]),this._lockedFeatures.geometries.push(b.geometry))},this);this._showMoreImageNotification()}else this._lockedFeatures={ids:[],geometries:[]},
f.forEach(this._selectedAttributeStore.data,function(a){a.selected=!1});this._selectedRasterList.setData(this._selectedAttributeStore);d.hide(this._linkPanel);d.hide(this.notificationPane);this._applyLockRule()},_updateRasterListFields:function(a){a&&(this.selectedFields=a.fields||this.selectedFields,this.showThumbnail=g.isDefined(a.showThumbnail)?a.showThumbnail:this.showThumbnail,this._selectedRasterList.showThumbnail=this.showThumbnail);if(this._selectedRasterList&&this.selectedFields){var b=[];
f.forEach(this.selectedFields,function(a){a={name:a===this.field.name?a+"_formatted":a,alias:this._fieldStore.get(a).alias,display:!0};b.push(a)},this);this._selectedRasterList.fields=b;this.refresh()}},_addToSelectedFields:function(a){this._selectedRasterList&&this.selectedFields&&0<=this.selectedFields.indexOf(a)&&-1===this.selectedFields.indexOf(this.field.name)&&this.selectedFields.splice(this.selectedFields.indexOf(a),1,this.field.name)},_mergeUnique:function(a,b){return a.concat(b.filter(function(b){return-1===
a.indexOf(b)}))},_hideRasterFootPrint:function(){this.rasterExtentGraphic&&this.rasterExtentGraphic.hide()},_showRasterFootPrint:function(a){this.map.spatialReference.equals(a.geometry.spatialReference)?this.showImageGraphic(a.geometry):this.projectGeometry(a.geometry,this.map.spatialReference).then(e.hitch(this,function(a){a[0]&&this.showImageGraphic(a[0])}))},showImageGraphic:function(a){this.rasterExtentGraphic?(this.rasterExtentGraphic.setGeometry(a),this.rasterExtentGraphic.show()):this.rasterExtentGraphic=
this.map.graphics.add(new S(a,this.rasterExtentSymbol))},projectGeometry:function(a,b){var c=new Y;b=b||this.map.spatialReference;a.spatialReference.url=this.layer.url;c.geometries=[a];c.outSR=b;return this.projectTask.execute(c)},sortObjFun:function(a,b,c){var d=c?function(b){return c(b[a])}:function(b){return b[a]};b=b?-1:1;return function(e,f){return"boolean"===c?f[a]-e[a]:(e=d(e),f=d(f),b*((e>f)-(f>e)))}},_sortRasters:function(){this._sortAsc=!this._sortAsc;this.sortRasters.set("iconClass",this._sortAsc?
"esriImageFilterIcons esriImageFilterDscSortIcon":"esriImageFilterIcons esriImageFilterAscSortIcon");this.sortRasters.set("title",this._sortAsc?this._i18n.sortDsc:this._i18n.sortAsc);var a=this._selectedAttributeStore.data;this._sortAsc?a.sort(this.sortObjFun(this.field.name,!1)):a.sort(this.sortObjFun(this.field.name,!0));this._selectedRasterList.setData(this._selectedAttributeStore)},adjustHeight:function(a){var b=r.coords(this.esriImageFilterCardsDiv).h,c=r.coords(this.esriImageFilterAddToMapDiv).h;
H.set(this.esriImageFilterImageGridDiv,"height",a-(b+c)-100+"px")}})});