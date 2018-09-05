// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://js.arcgis.com/3.24/esri/copyright.txt for details.
//>>built
require({cache:{"url:esri/dijit/geoenrichment/ReportPlayer/printing/PageOptionsDialog/templates/PageOptionsDialogContent.html":'\x3cdiv class\x3d"esriGEPageOptionsDialog"\x3e\r\n\r\n    \x3cdiv data-dojo-attach-point\x3d"exportOptionsBlock" class\x3d"pageOptionsDialog_section"\x3e\r\n        \x3cdiv class\x3d"esriGERowHigh"\x3e${nls.exportAs}\x3c/div\x3e\r\n        \x3cdiv data-dojo-attach-point\x3d"exportSelectDiv" class\x3d"esriGESpaceBeforeBig"\x3e\x3c/div\x3e\r\n    \x3c/div\x3e\r\n    \x3cdiv data-dojo-attach-point\x3d"staticOutputSettingsBlock"\x3e\r\n        \x3cdiv data-dojo-attach-point\x3d"autoScaleBlock" class\x3d"pageOptionsDialog_bigRow20 pageOptionsDialog_section"\x3e\r\n            \x3cdiv class\x3d"esriGERowHigh"\x3e${nls.autoAdjustSections}\x3c/div\x3e\r\n            \x3cdiv class\x3d"esriGESpaceBeforeBig"\x3e\r\n                \x3cdiv class\x3d"dijitInline esriGESpaceAfterBig"\x3e\x3clabel data-dojo-attach-point\x3d"autoScaleLabel"\x3e\x26nbsp;${nls.autoScaleRowsLabel}\x3c/label\x3e\x3c/div\x3e\r\n                \x3cdiv class\x3d"dijitInline pageOptionsDialog_infoIcon" data-dojo-attach-point\x3d"autoScaleInfoIcon"\x3e\x3c/div\x3e\r\n            \x3c/div\x3e\r\n        \x3c/div\x3e\r\n\r\n        \x3cdiv data-dojo-attach-point\x3d"layoutBlock" class\x3d"pageOptionsDialog_bigRow20 pageOptionsDialog_section"\x3e\r\n            \x3cdiv class\x3d"esriGERowHigh"\x3e${nls.pageSize}\x3c/div\x3e\r\n            \x3cdiv data-dojo-attach-point\x3d"optionsBlock" class\x3d"esriGESpaceBeforeBig"\x3e\r\n                \x3cdiv class\x3d"esriGERowHigh" data-dojo-attach-point\x3d"sizeListDiv"\x3e\x3c/div\x3e\r\n                \x3cdiv class\x3d"esriGERowHigh esriGESpaceBeforeBig"\x3e\r\n                    \x3cdiv class\x3d"dijitInline esriGESpaceAfterBig" data-dojo-attach-point\x3d"portraitRadioButtonDiv"\x3e\x3c/div\x3e\r\n                    \x3cdiv class\x3d"dijitInline esriGEClickable"\x3e${nls.portrait}\x3c/div\x3e\r\n                \x3c/div\x3e\r\n                \x3cdiv class\x3d"esriGERowHigh esriGESpaceBeforeBig"\x3e\r\n                    \x3cdiv class\x3d"dijitInline esriGESpaceAfterBig" data-dojo-attach-point\x3d"landscapeRadioButtonDiv"\x3e\x3c/div\x3e\r\n                    \x3cdiv class\x3d"dijitInline esriGEClickable"\x3e${nls.landscape}\x3c/div\x3e\r\n                \x3c/div\x3e\r\n            \x3c/div\x3e\r\n        \x3c/div\x3e\r\n\r\n        \x3cdiv data-dojo-attach-point\x3d"headerFooterBlock" class\x3d"pageOptionsDialog_bigRow20 pageOptionsDialog_section"\x3e\r\n            \x3cdiv class\x3d"esriGERowHigh"\x3e${nls.headerAndFooter}\x3c/div\x3e\r\n            \x3cdiv class\x3d"esriGERowHigh esriGESpaceBeforeBig"\x3e\r\n                \x3clabel data-dojo-attach-point\x3d"headerLabel"\x3e\x26nbsp;${nls.headerLabel}\x3c/label\x3e\r\n            \x3c/div\x3e\r\n            \x3cdiv data-dojo-attach-point\x3d"reportTitleBlock"\x3e\r\n                \x3cdiv class\x3d"esriGERowHigh esriGESpaceBefore30"\x3e\r\n                    \x3cdiv class\x3d"dijitInline esriGESpaceAfterBig reportTitleBlock_label"\x3e${nls.title}\x3c/div\x3e\r\n                    \x3cdiv class\x3d"dijitInline" data-dojo-attach-point\x3d"reportTitleTextBoxDiv"\x3e\x3c/div\x3e\r\n                \x3c/div\x3e\r\n                \x3cdiv class\x3d"esriGERowHigh esriGESpaceBefore30"\x3e\r\n                    \x3cdiv class\x3d"dijitInline esriGESpaceAfterBig reportTitleBlock_label"\x3e${nls.subtitle}\x3c/div\x3e\r\n                    \x3cdiv class\x3d"dijitInline" data-dojo-attach-point\x3d"reportSubtitleTextBoxDiv"\x3e\x3c/div\x3e\r\n                \x3c/div\x3e\r\n            \x3c/div\x3e\r\n            \x3cdiv class\x3d"esriGERowHigh esriGESpaceBeforeBig" data-dojo-attach-point\x3d"dataSourceBlock"\x3e\r\n                \x3clabel data-dojo-attach-point\x3d"dataSourceLabel"\x3e\x26nbsp;${nls.dataSourceLabel}\x3c/label\x3e\r\n            \x3c/div\x3e\r\n            \x3cdiv class\x3d"esriGERowHigh esriGESpaceBeforeBig"\x3e\r\n                \x3clabel data-dojo-attach-point\x3d"footerLabel"\x3e\x26nbsp;${nls.footerLabel}\x3c/label\x3e\r\n            \x3c/div\x3e\r\n        \x3c/div\x3e\r\n    \x3c/div\x3e\r\n    \x3cdiv class\x3d"pageOptionsDialog_actionButtonsBlock"\x3e\r\n        \x3cdiv class\x3d"pageOptionsDialog_actionButton dijitInline" data-dojo-attach-point\x3d"cancelButton"\x3e${nls.cancel}\x3c/div\x3e\r\n        \x3cdiv class\x3d"pageOptionsDialog_actionButton dijitInline" data-dojo-attach-point\x3d"exportButton"\x3e\x3c/div\x3e\r\n    \x3c/div\x3e\r\n\x3c/div\x3e\r\n'}});
define("esri/dijit/geoenrichment/ReportPlayer/printing/PageOptionsDialog/PageOptionsDialogContent","dojo/_base/declare dojo/_base/lang dojo/on dojo/string dojo/dom-class dojo/dom-construct dojo/dom-style dijit/_WidgetBase dijit/_TemplatedMixin dijit/form/TextBox esri/dijit/geoenrichment/TriStateItem esri/dijit/geoenrichment/utils/DomUtil esri/dijit/geoenrichment/utils/TooltipUtil esri/dijit/geoenrichment/OnDemandSelect dijit/form/RadioButton esri/dijit/geoenrichment/ReportPlayer/core/supportClasses/DocumentOptions esri/dijit/geoenrichment/ReportPlayer/printing/PageSizeUtil esri/dijit/geoenrichment/ReportPlayer/PlayerCommands dojo/text!./templates/PageOptionsDialogContent.html dojo/i18n!../../../../../nls/jsapi".split(" "),
function(q,h,k,r,y,z,A,t,u,l,g,d,v,m,n,p,w,f,x,b){b=b.geoenrichment.dijit.ReportPlayer.PageOptionsDialog;var c={};c[f.HTML]=b.createHTMLLabel;c[f.IMAGE]=b.createImageLabel;c[f.PDF]=b.createPDFLabel;c[f.PRINT]=b.printLabel;c[f.DYNAMIC_HTML]=b.createDynamicHTMLLabel;return q([t,u],{templateString:x,nls:b,exportSelect:null,sizeList:null,autoScaleCheckbox:null,addHeaderCheckbox:null,addDataSourceCheckbox:null,addFooterCheckbox:null,postCreate:function(){var a=this;this.inherited(arguments);k(this.exportButton,
"click",function(){a.onPrint()});k(this.cancelButton,"click",function(){a.onCancel()});v.setTooltipToNode(this.autoScaleInfoIcon,b.autoScaleRowsTooltip)},_currentSettings:null,update:function(a){this._currentSettings=h.mixin({},a);this._configureExportOptions(a);this._configureAutoScale(a);this._configurePageSize(a);this._configureHeaderAndFooter(a);this._syncExportButtonName()},_configureExportOptions:function(a){var b=this;d.hide(this.exportOptionsBlock);if(a.exportCommands&&(d.show(this.exportOptionsBlock),
!this.exportSelect)){var e=a.exportCommands.map(function(a){return{label:a.label,value:a.id}});this.exportSelect=(new m({"class":"exportSelect",options:e,value:a.commandId||e[0],onChange:function(){b._currentSettings.commandId=b.exportSelect.get("value");b._syncExportButtonName()}})).placeAt(this.exportSelectDiv);this.own(this.exportSelect)}},_syncExportButtonName:function(){this.exportButton.innerHTML=c[this._currentSettings.commandId]},_configureAutoScale:function(a){d.hide(this.autoScaleBlock);
a.needAutoScale&&(d.show(this.autoScaleBlock),this.autoScaleCheckbox||(this.autoScaleCheckbox=new g(this.autoScaleLabel),this.autoScaleCheckbox.set("checked",!0)))},_configureHeaderAndFooter:function(a){d.hide(this.headerFooterBlock);a.canAddHeaderAndFooter&&(d.show(this.headerFooterBlock),this.addHeaderCheckbox||(this.addHeaderCheckbox=new g(this.headerLabel),this.addHeaderCheckbox.onClick=function(){this._syncHeaderTitleBlockVisibility()}.bind(this),this.addDataSourceCheckbox=new g(this.dataSourceLabel),
this.addFooterCheckbox=new g(this.footerLabel),this.reportTitleTextBox=(new l({value:a.reportTitle||"",placeHolder:b.titlePlaceholder})).placeAt(this.reportTitleTextBoxDiv),this.own(this.reportTitleTextBox),this.reportSubtitleTextBox=(new l({value:a.reportSubtitle||"",placeHolder:b.subtitlePlaceholder})).placeAt(this.reportSubtitleTextBoxDiv),this.own(this.reportSubtitleTextBox)),this._syncHeaderTitleBlockVisibility())},_syncHeaderTitleBlockVisibility:function(){d[this.addHeaderCheckbox.get("checked")?
"show":"hide"](this.reportTitleBlock)},_configurePageSize:function(a){d.hide(this.layoutBlock);if(a.showLayoutOptions&&(d.show(this.layoutBlock),!this.sizeList)){var c=!p.hasStandardSize(a.currentPageSettings.pagesize),e;c&&(e=p.getPageDim(a.currentPageSettings.pagesize,a.currentPageSettings.orientation,{places:2}),e=r.substitute(b.customWithDimensions,{w:e.w,h:e.h}));this.sizeList=(new m({"class":"sizeList",options:w.getSupportedPageSizes(c,e),value:c?"custom":a.currentPageSettings.pagesize})).placeAt(this.sizeListDiv);
this.own(this.sizeList);this.portraitButton=(new n({checked:"portrait"===a.currentPageSettings.orientation,name:this.id})).placeAt(this.portraitRadioButtonDiv);this.portraitButton.startup();this.landscapeButton=(new n({checked:"landscape"===a.currentPageSettings.orientation,name:this.id})).placeAt(this.landscapeRadioButtonDiv);this.landscapeButton.startup()}},getSettings:function(){var a=h.mixin({},this._currentSettings.currentPageSettings);this.sizeList&&"custom"!==this.sizeList.get("value")&&(a.orientation=
this.portraitButton.get("checked")?"portrait":"landscape",a.pagesize=this.sizeList.get("value"));return{needAutoScale:this.autoScaleCheckbox&&this.autoScaleCheckbox.get("checked"),addHeader:this.addHeaderCheckbox&&this.addHeaderCheckbox.get("checked"),addDataSource:this.addDataSourceCheckbox&&this.addDataSourceCheckbox.get("checked"),addFooter:this.addFooterCheckbox&&this.addFooterCheckbox.get("checked"),reportTitle:this.reportTitleTextBox&&this.reportTitleTextBox.get("value"),reportSubtitle:this.reportSubtitleTextBox&&
this.reportSubtitleTextBox.get("value"),pageSettings:a,commandId:this._currentSettings.commandId}},setState:function(a){this.autoScaleCheckbox&&this.autoScaleCheckbox.set("checked",a.needAutoScale);this.addHeaderCheckbox&&this.addHeaderCheckbox.set("checked",a.addHeader);this.addDataSourceCheckbox&&this.addDataSourceCheckbox.set("checked",a.addDataSource);this.addFooterCheckbox&&this.addFooterCheckbox.set("checked",a.addFooter);this._syncHeaderTitleBlockVisibility();this.exportSelect&&(this.exportSelect.options.some(function(b){return b.value===
a.commandId})||(a.commandId=this.exportSelect.options[0].value),this.exportSelect.set("value",a.commandId),this.exportSelect.onChange())},onPrint:function(){},onCancel:function(){}})});