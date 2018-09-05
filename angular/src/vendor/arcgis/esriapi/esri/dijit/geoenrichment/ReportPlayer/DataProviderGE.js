// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://js.arcgis.com/3.24/esri/copyright.txt for details.
//>>built
define("esri/dijit/geoenrichment/ReportPlayer/DataProviderGE","dojo/_base/declare dojo/_base/lang dojo/promise/all dojo/when ./dataProvider/_CommandSupport ./dataProvider/_SerializationSupport ./dataProvider/_ServerSerializationSupport ./dataProvider/supportClasses/AnalysisAreaJsonUtil ./dataProvider/supportClasses/CustomReportsManager ./dataProvider/supportClasses/TemplateJsonLoader ./dataProvider/supportClasses/ReportDataProcessor ./dataProvider/supportClasses/InfographicOptionsProvider ./dataProvider/supportClasses/AreasPreprocessor ./dataProvider/supportClasses/GEUtil ./dataProvider/supportClasses/attachments/DefaultAttachmentsStore ./dataProvider/supportClasses/StandardGraphicReportTemplates ./core/themes/ThemeLibrary ./core/themes/ReportThemes ./core/supportClasses/templateJsonUtils/countryConfig".split(" "),
function(m,q,r,n,t,u,v,w,d,x,g,y,z,h,A,B,C,p,k){return m([t,u,v],{analysisAreasLimit:-1,cacheTemplates:!0,printMapTaskUrl:null,_infographicOptionsProvider:null,constructor:function(){this._infographicOptionsProvider=new y},_getAttachmentsStore:function(b){return(new A(b)).initialize()},getCustomReports:function(b,c){return d.getCustomReports(b,c)},_currentContext:null,getReportData:function(b,c){var f=this;c=c||function(){};var a=q.mixin({},b);a.reportID=B.aliasToID(a.reportID)||a.reportID;a.analysisAreas=
w.areasFromJson(a.analysisAreas);a.fieldData={runReportTaskID:null,metadata:{},areaData:[],errors:[]};this._currentContext=a;this._infographicOptionsProvider.setServerUrl(a);d.resetCache();return n(h.provideGeoenrichmentUrl(a),function(){return n(z.preprocessAreas(a,{analysisAreasLimit:f.analysisAreasLimit}),function(){c(.25);return r({initGE:h.initialize(a.geoenrichmentUrl),countryInfo:h.getCountryInfo(a.geoenrichmentUrl,a.countryID),reportObject:d.getCustomReportByID(a),infographicOptions:f._infographicOptionsProvider.getInfographicOptions(a),
attachmentsStore:f._getAttachmentsStore(a),templateJson:x.getTemplateJsonByID(a,f.cacheTemplates),runReportResult:g.runReportAndGetData(a)}).then(function(b){var e=b.reportObject,f=b.infographicOptions,d=b.attachmentsStore,l=b.templateJson,m=b.runReportResult;c(.75);if(!l||!e||!a.fieldData)return null;g.applyRunReportAndGetDataResults(m,a);k.setCountry(b.countryInfo.country);k.setHierarchyID(e.hierarchy);k.setGeographiesModel(b.countryInfo.geographiesModels[k.getHierarchyID()]);return n(d&&g.populateReportDataFromAttachmentsStore(a,
d),function(){c(1);l.theme||(l.theme=C.getReportThemeById(e.isGraphicReport?p.GRAPHIC:p.CLASSIC));return{isClassic:!e.isGraphicReport,reportType:e.type,reportTitle:e.title,templateJson:l,reportObject:e,fieldData:a.fieldData,analysisAreas:a.analysisAreas,infographicOptions:f,attachmentsStore:d,geClient:h.getClient(),config:{portalUrl:a.portalUrl,geoenrichmentUrl:a.geoenrichmentUrl,countryID:a.countryID,reportID:a.reportID}}})})})})},_getCurrentContext:function(){return this._currentContext},enrichFieldData:function(b,
c){return g.enrichFieldData(b,c)}})});