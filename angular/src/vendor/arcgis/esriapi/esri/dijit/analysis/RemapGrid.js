// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://js.arcgis.com/3.24/esri/copyright.txt for details.
//>>built
require({cache:{"url:esri/dijit/analysis/templates/RemapGrid.html":'\x3cdiv\x3e\r\n  \x3cdiv data-dojo-attach-point\x3d"_gridDiv" class\x3d"grid" style\x3d"padding:1px;width:100%;height:100px"\x3e\x3c/div\x3e\r\n  \x3cdiv style\x3d"clear:both;"\x3e\x3c/div\x3e\r\n  \x3cdiv style\x3d"padding:1px;width:100%"\x3e\r\n    \x3ctable style\x3d"width:100%;"\x3e\r\n      \x3ctbody\x3e\r\n        \x3ctr\x3e\r\n          \x3ctd class\x3d"esriFloatTrailing"\x3e\r\n            \x3cdiv class\x3d"esriLeadingMargin025"\x3e\r\n              \x3cdiv data-dojo-type\x3d"dijit/form/Button" class\x3d"esriActionButton" data-dojo-props\x3d"label:\'${i18n.add}\',iconClass:\'esriAnalysisAddIcon\',showLabel: false, disabled:false" data-dojo-attach-point\x3d"_aBtn" data-dojo-attach-event\x3d"onClick:_handleAButtonClick"\x3e\x3c/div\x3e\r\n              \x3cdiv data-dojo-type\x3d"dijit/form/Button" class\x3d"esriActionButton" data-dojo-props\x3d"label:\'${i18n.remove}\',iconClass:\'esriAnalysisDeleteIcon\',showLabel: false, disabled:false" data-dojo-attach-point\x3d"_rBtn" data-dojo-attach-event\x3d"onClick:_handleRButtonClick"\x3e\x3c/div\x3e\r\n            \x3c/div\x3e\r\n          \x3c/td\x3e\r\n        \x3c/tr\x3e\r\n      \x3c/tbody\x3e\r\n    \x3c/table\x3e\r\n  \x3c/div\x3e\r\n\x3c/div\x3e'}});
define("esri/dijit/analysis/RemapGrid","dojo/_base/declare dojo/_base/lang dojo/_base/event dojo/_base/array dojo/has dojo/dom-construct dojo/Evented dijit/_WidgetBase dijit/_TemplatedMixin dijit/_WidgetsInTemplateMixin dijit/_OnDijitClickMixin dijit/_FocusMixin dgrid/OnDemandGrid dgrid/Selection dgrid/selector dgrid/extensions/DijitRegistry dgrid/extensions/ColumnResizer dojo/store/Memory dojo/store/Observable dgrid/editor ../../kernel dojo/i18n!../../nls/jsapi dojo/text!./templates/RemapGrid.html".split(" "),
function(e,d,k,m,n,E,p,q,r,t,u,v,w,x,l,y,z,A,F,f,B,h,C){var D=e([w,x,l,z,y]);e=e([q,r,t,u,v,p],{declaredClass:"esri.dijit.analysis.RemapGrid",templateString:C,widgetsInTemplate:!0,_selectedIds:[],constructor:function(a){a.containerNode&&(this.container=a.containerNode)},destroy:function(){this.inherited(arguments)},postMixInProperties:function(){this.inherited(arguments);this.i18n={};d.mixin(this.i18n,h.common);d.mixin(this.i18n,h.analysisTools);d.mixin(this.i18n,h.remapValuesTool)},postCreate:function(){this.inherited(arguments);
this.idx=2;this.getColumns();this.remapStore=new A({data:{identifier:"id",items:[]}});this.remapGrid=new D({store:this.remapStore,columns:this.columns,selectionMode:"none",showHeader:!0,allowSelectAll:!0,allowSelect:function(a){return!0}},this._gridDiv);this.remapGrid.on("dgrid-select",d.hitch(this,this._handleRemapGridSelect));this.remapGrid.on("dgrid-deselect",d.hitch(this,this._handleRemapGridSelect));this.remapGrid.on("dgrid-editor-hide",d.hitch(this,function(a){this.handleLabelChange(a.cell.row.data,
a.editor.name,a.editor.value)}));this.remapGrid.keepScrollPosition=!0;this._rBtn.set("disabled",!0)},_handleRemapGridSelect:function(a){this._selectedObj=a.grid.selection;this._selectedIds=[];for(var c in this._selectedObj)this._selectedObj.hasOwnProperty(c)&&(c=parseInt(c,10),!0===this._selectedObj[c]&&0!==c&&this._selectedIds.push(c));this._rBtn.set("disabled",1>this._selectedIds.length)},_handleAButtonClick:function(a){this.remapStore.put({minValue:0,maxValue:0,output:0,id:this.idx++});this.remapGrid.resize();
this.remapGrid.refresh();this.emit("change");this.remapGrid.set("store",this.remapStore);a&&k.stop(a)},_handleRButtonClick:function(a){k.stop(a);if(this._selectedIds&&0===this._selectedIds.length)return!1;m.forEach(this._selectedIds,function(a){this.remapStore.remove(a)},this);this.emit("change");this._clear();this._rBtn.set("disabled",!0)},handleLabelChange:function(a,c,g){a[c]=g;this.remapStore.put({output:a.output,minValue:a.minValue,maxValue:a.maxValue,id:a.id});this.emit("change")},_clear:function(){this._selectedIds=
[];this.remapGrid.clearSelection();this.remapGrid.refresh({keepScrollPosition:!0})},_getRangesAttr:function(){var a=[],c=[],g=[],d;this.remapStore.query().forEach(function(b){"NoData"===b.output?(g.push(b.minValue),g.push(b.maxValue)):(a.push(b.minValue),a.push(b.maxValue),c.push(b.output));d={InputRanges:a,OutputValues:c,NoDataRanges:g}});return d},_setRangesAttr:function(a){if(a){var c=a.InputRanges,d=a.OutputValues;a=a.NoDataRanges;var e=!1,b;if(c&&d){var f=d.length;if(2*f===c.length)for(e=!0,
b=0;b<f;b++)this.remapStore.put({minValue:c[2*b],maxValue:c[2*b+1],output:d[b],id:this.idx++})}if(a)for(e=!0,b=0;b<a.length;b++)this.remapStore.put({minValue:a[b],maxValue:a[b+1],output:"NoData",id:this.idx++}),b++;e&&this.remapGrid.refresh()}},getColumns:function(){this.columns={};this.columns.check=l({selector:"checkbox",label:""});this.columns.minValue=f({className:"labelCell",field:"minValue",label:"Minimum",sortable:!0,canEdit:function(a){return!0}},"text","click");this.columns.maxValue=f({className:"labelCell",
field:"maxValue",label:"Maximum",sortable:!0,canEdit:function(a){return!0}},"text","click");this.columns.output=f({className:"labelCell",field:"output",label:"Output",sortable:!0,canEdit:function(a){return!0}},"text","click")}});n("extend-esri")&&d.setObject("dijit.analysis.RemapGrid",e,B);return e});