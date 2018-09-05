// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://js.arcgis.com/3.24/esri/copyright.txt for details.
//>>built
define("esri/dijit/geoenrichment/ReportPlayer/core/infographics/dataDrilling/ChartBuilder","dojo/_base/lang ../infographicUtils/InfographicJsonUtil ../../charts/chartUtils/ChartJsonUtil ../../charts/chartUtils/ChartTypes ../../charts/chartUtils/ChartBarThickness ../../charts/legends/ChartLegendTypes ./EnrichUtil".split(" "),function(g,h,e,c,k,f,l){return{createChart:function(a){var b=a.type||c.BAR,m=a.title,n=a.xAxisTitle,p=a.yAxisTitle,d=a.seriesItems||[{label:"",points:a.points}],q=a.visualProps;
a=a.disableComparisonInfo||1!==d.length||!c.isComparisonEnabled(b);b={isChart:!0,type:b,seriesItems:d,visualProperties:g.mixin({width:100,height:100,barBorders:!1,dataLabels:"Value",view3D:!1,origin:0,lineThickness:1,columnThickness:k.LARGE,dataLabelsStyle:{},dataLabelsDecimals:0,backgroundColor:null,title:{text:m,align:"center",style:{}},xAxis:{show:!0,showTicks:!0,showLine:!0,style:{},title:n||"",gridLines:!1,gridLinesCentered:!1,titleStyle:{},labelsAngle:0},yAxis:{show:!0,showTicks:!0,showLine:!0,
style:{},title:p||"",gridLines:!1,gridLinesCentered:!1,titleStyle:{},labelsAngle:0},legend:{type:f.SERIES,series:{hasBorder:!0,labelParts:"Label",placement:1===d.length?"None":"Bottom",placementOffset:10,style:{}},minMax:{}},isStacked:!1,dataLabelsInside:!1},q),comparisonInfo:a?null:{levels:h.getDefaultLevels(),calculatorName:null,chartType:c.LINE}};l.buildCalculatorNameForChart(b);return e.provideDefaultValueForMissing(b)},createDonutChart:function(a){return this._createRoundChart(c.DONUT,a)},createGaugeChart:function(a){a.points.length.length=
1;return this._createRoundChart(c.GAUGE,a)},_createRoundChart:function(a,b){return e.provideDefaultValueForMissing({isChart:!0,type:a,seriesItems:[{points:b.points}],visualProperties:{width:100,height:100,barBorders:!1,dataLabels:"Value",view3D:!1,origin:0,dataLabelsStyle:{},dataLabelsDecimals:0,backgroundColor:null,title:{text:b.title||"",align:"center",style:{}},xAxis:{show:!0},yAxis:{show:!0},legend:{type:f.SERIES,series:{hasBorder:!0,labelParts:"Label",placement:a===c.GAUGE?"None":"Bottom",placementOffset:10,
style:{}},minMax:{}},donutHolePercent:50,donutGap:3,dataLabelsInside:!1,dataLabelsStackedInColumns:!0}})}}});