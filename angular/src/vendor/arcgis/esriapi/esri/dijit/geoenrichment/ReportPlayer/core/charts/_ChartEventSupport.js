// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://js.arcgis.com/3.24/esri/copyright.txt for details.
//>>built
define("esri/dijit/geoenrichment/ReportPlayer/core/charts/_ChartEventSupport","dojo/_base/declare dojo/on dojo/dom-class dojo/dom-construct dojo/dom-geometry dojo/dom-style ./chartUtils/ChartTypes ./chartUtils/builder/ChartPlots esri/dijit/geoenrichment/utils/DomUtil".split(" "),function(e,t,m,q,u,c,f,r,d){return e(null,{_levelLineDiv:null,_addPlotEventListeners:function(){if(this.chart){var a=this;r.getWorkingPlots(this.chart).forEach(function(e,n){this.chart.connectToPlot(e,function(b){function e(b){a._levelLineDiv||
(a._levelLineDiv=q.create("div",null,a.domNode));m.remove(a._levelLineDiv,"esriGEReportPlayer_chartContainerLevelLineH esriGEReportPlayer_chartContainerLevelLineV");b?m.add(a._levelLineDiv,"esriGEReportPlayer_chartContainerLevelLineH"):m.add(a._levelLineDiv,"esriGEReportPlayer_chartContainerLevelLineV");d.show(a._levelLineDiv);c.set(a._levelLineDiv,{left:"",top:"",width:"",height:""})}function p(b){b?(b=c.get(a._levelLineDiv,"top"),d[0>b||b>a._chartHeight?"hide":"show"](a._levelLineDiv)):(b=c.get(a._levelLineDiv,
"left"),d[0>b||b>a._chartWidth?"hide":"show"](a._levelLineDiv))}if(b.shape&&b.shape.shape&&b.shape.rawNode){var g=b.type,h=b.shape.rawNode;if(0===n&&"onclick"===g){var k=b.run.data[b.index];k&&(f.isPictureLike(a._currentChartType)?a.onPlotChangeIcon&&a.onPlotChangeIcon(k.point.iconFieldInfo,a,h,function(b){a.onColumBarPicturePreChanged();k.point.iconFieldInfo=b;a.onColumBarPictureChanged()}):a.onPlotChangeColor&&a.onPlotChangeColor(k.fill,function(b){a.onColorPreChanged();k.point.color=b;a.onColorChanged()}))}if("onmouseout"===
g)a._hideLevelLine();else if("onmouseover"===g&&a.viewModel.dynamicReportInfo){b=a.chart.calculateGeometry();var h=d.position(h),g=d.position(b.node),l=d.position(a.domNode);switch(a._currentChartType){case f.COLUMN:e(!0);c.set(a._levelLineDiv,{left:g.x-l.x+b.offsets.l+"px",top:h.y-l.y-1+"px",width:c.get(b.node,"width")-b.offsets.l-b.offsets.r+"px"});p(!0);break;case f.BAR:case f.LINE:e(!1),c.set(a._levelLineDiv,{left:h.x+h.w*(a._currentChartType===f.LINE||1===n&&a._getComparisonChartType()===f.LINE?
.5:1)-l.x+"px",top:g.y-l.y+b.offsets.t+"px",height:c.get(b.node,"height")-b.offsets.t-b.offsets.b+"px"}),p(!1)}}}})},this)}},_hideLevelLine:function(){d.hide(this._levelLineDiv)},onColorPreChanged:function(){},onColorChanged:function(){},onColumBarPicturePreChanged:function(){},onColumBarPictureChanged:function(){}})});