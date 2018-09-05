// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://js.arcgis.com/3.24/esri/copyright.txt for details.
//>>built
define("esri/dijit/analysis/SettingsViewModel","dojo/_base/declare dojo/_base/lang dojo/_base/array dojo/_base/Color dojo/has dojo/json dojo/Stateful ./storeUtils ./SpatialReferences ./JobsViewModel ../../kernel ../../lang".split(" "),function(f,b,k,r,l,g,m,n,h,p,q,t){f=f([m],{declaredClass:"esri.dijit.analysis.SettingsViewModel",showHelp:!0,showOverwriteResultOption:!0,showCloseAnalysisOption:!0,showStoreAnalysisOption:!0,showCoordinateSystems:!0,showOutSR:!0,showProcessSR:!0,showExtent:!0,showRasterSettings:!0,
showGeoAnalyticsSettings:!0,showCloseIcon:!0,showHeader:!0,showOkCancel:!0,showJobsHistory:!1,isCustomExtent:!1,layers:null,viewProps:null,closeAnalysisWidget:!0,returnFeaturCollection:!1,jobsViewModel:null,spatialRefStore:n.createHierarchicalStore({data:h}),spatialRefData:h,constructor:function(a){var c=this.get("saveModel");c&&c.layers&&a.layers&&(this._arrayUnique(a.layers.concat(c.layers),"name"),delete c.layers);b.mixin(a,c);this.watch("showJobsHistory",b.hitch(this,this.updateJobsVM));this.watch("portalUrl",
b.hitch(this,this.updateJobsVM));this.watch("jobsHistoryItem",b.hitch(this,this.updateJobsVM))},_showCloseIconSetter:function(a){this.showCloseIcon=a},_showHelpSetter:function(a){this.showHelp=a},_showOverwriteResultOptionSetter:function(a){this.showOverwriteResultOption=a},_showCloseAnalysisOptionSetter:function(a){this.showCloseAnalysisOption=a},_showStoreAnalysisOptionSetter:function(a){this.showStoreAnalysisOption=a},_showCoordinateSystemsSetter:function(a){this.showCoordinateSystems=a},_showExtentSetter:function(a){this.showExtent=
a},_showRasterSettingsSetter:function(a){this.showRasterSettings=a},_returnFeatureCollectionSetter:function(a){this.returnFeatureCollection=a},_closeAnalysisWidgetSetter:function(a){this.closeAnalysisWidget=a},_overwriteResultSetter:function(a){this.overwriteResult=a},_outSRSetter:function(a){this.outSR=a},_processSRSetter:function(a){this.processSR=a},_extentSetter:function(a){this.extent=a},_snapRasterSetter:function(a){this.snapRaster=a},_cellSizeSetter:function(a){this.cellSize=a},_maskSetter:function(a){this.mask=
a},_layersSetter:function(a){this.layers=a},_showHeaderSetter:function(a){this.showHeader=a},_showOutSRSetter:function(a){this.showOutSR=a;this.set("outSR",a?this.outSR:void 0)},_showProcessSRSetter:function(a){this.showProcessSR=a;this.set("processSR",a?this.processSR:void 0)},_showOkCancelSetter:function(a){this.showOkCancel=!0},_isCustomExtentSetter:function(a){this.isCustomExtent=a},_isCustomOutSRSetter:function(a){this.isCustomOutSR=a},_isCustomProcessSRSetter:function(a){this.isCustomProcessSR=
a},_isCustomCellSizeSetter:function(a){this.isCustomCellSize=a},_showGeoAnalyticsSettingsSetter:function(a){this.showGeoAnalyticsSettings=a},_datastoreSetter:function(a){this.datastore=a},_portalUrlSetter:function(a){this.portalUrl=a},_jobsHistoryItemSetter:function(a){this.jobsHistoryItem=a},_viewPropsSetter:function(a){this.viewProps=a},_saveModelGetter:function(){var a;window.localStorage&&(a=window.localStorage.getItem("esri_analysis_settings"))&&(a=g.parse(a));return a},_saveModelSetter:function(a){a||
(a={isCustomExtent:this.isCustomExtent,isCustomOutSR:this.isCustomOutSR,isCustomProcessSR:this.isCustomProcessSR,isCustomCellSize:this.isCustomCellSize,outSR:this.outSR,processSR:this.processSR,extent:this.extent,cellSize:this.cellSize,snapRaster:this.snapRaster,mask:this.mask,datastore:this.datastore,viewProps:this.viewProps,closeAnalysisWidget:this.closeAnalysisWidget,returnFeatureCollection:this.returnFeatureCollection},this.layers&&0<this.layers.length&&(a.layers=k.map(this.layers,function(a){return{name:a.name,
url:a.url,fullExtent:a.fullExtent,type:a.type,format:a.format}})));window.localStorage&&a&&window.localStorage.setItem("esri_analysis_settings",g.stringify(a))},save:function(){this.set("saveModel")},reset:function(){b.mixin(this,this.get("saveModel"))},updateJobsVM:function(){this.showJobsHistory&&this.portalUrl&&this.jobsHistoryItem&&!this.jobsViewModel&&(this.jobsViewModel=new p({portalUrl:this.portalUrl,item:this.jobsHistoryItem}),this.watch("jobsHistoryItem",b.hitch(this,function(){this.jobsViewModel.set("item",
this.jobsHistoryItem)})),this.watch("portalUrl",b.hitch(this,function(){this.jobsViewModel.set("portalUrl",this.portalUrl)})))},_arrayUnique:function(a,c){for(var b=a.concat(),d=0;d<b.length;++d)for(var e=d+1;e<b.length;++e)(!c&&b[d]===b[e]||c&&b[d][c]===b[e][c])&&b.splice(e--,1);return b}});l("extend-esri")&&b.setObject("dijit.analysis.SettingsViewModel",f,q);return f});