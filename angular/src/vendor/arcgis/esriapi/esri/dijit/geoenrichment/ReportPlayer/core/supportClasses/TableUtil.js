// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://js.arcgis.com/3.24/esri/copyright.txt for details.
//>>built
define("esri/dijit/geoenrichment/ReportPlayer/core/supportClasses/TableUtil",["dojo/_base/lang","./templateJsonUtils/fieldInfo/FieldInfoBuilder","esri/dijit/geoenrichment/ReportPlayer/core/sections/SectionTypes"],function(m,t,k){var f={createTable:function(a){var b=a.numColumns,d=a.numRows,c=a.widths,e=a.width,h=a.style,f=a.attributes&&a.attributes.fixedColumns,u=a.attributes&&a.attributes.dynamicColumns;if(e)for(var l=e/b,c=[],g=0;g<b;g++)c.push(l);if(c)e||isNaN(Number(c[0]))||(e=0,c.forEach(function(a){e+=
a}));else for(l=Number(100/b).toFixed(3)+"%",c=[],g=0;g<b;g++)c.push(l);l=[];for(g=0;g<b;g++)l.push({field:"field"+g,style:{width:c[g]}});for(var c=[],k=!0,v=a.height?a.height/d:15.07,p=0;p<d;p++){for(var q={style:{height:v,fields:{}},fieldInfos:{}},g=0;g<b;g++){var r="field"+g;!1!==a.useDefaultTheme&&(q.style.fields[r]={horizontalAlign:0===g?"left":"right",overrideStyle:0===p?1<d?"TableHeader":void 0:k?"AlternatingRow":"Default"});u&&g>=f&&0===p&&(q.fieldInfos[r]=t.createFieldInfoFromSpecialFieldName("AREA_DESC"))}c.push(q);
k=!k}return{id:"table",attributes:m.mixin({},a.attributes),style:m.mixin({width:e||772.33},h),data:{columns:l,data:c}}},createSingleCellTable:function(a){var b=f.createTable({numColumns:1,numRows:1,attributes:a.attributes,useDefaultTheme:!1});f.modifyTableJson(b,0,0,a);return b},modifyTableJson:function(a,b,d,c){b=a.data.data[b];d=a.data.columns[d];var e=d.field;c.text&&(b[e]=c.text);c.fieldInfo&&(b.fieldInfos[e]=c.fieldInfo);c.cellStyle&&(b.style.fields[e]=c.cellStyle);c.columnSpan&&(b.columnSpans=
b.columnSpans||{},b.columnSpans[e]=c.columnSpan);c.rowSpan&&(b.rowSpans=b.rowSpans||{},b.rowSpans[e]=c.rowSpan);b.themeStyle=c.themeStyle;c.width&&(a.style.width=c.width,d.style.width=c.width);c.height&&(b.style.height=c.height);void 0!==c.left&&(a.style.left=c.left);void 0!==c.spaceBefore&&(a.style.spaceBefore=c.spaceBefore)},getTableWidth:function(a){return a.style.width},getTableHeight:function(a){var b=0;a.data.data.forEach(function(a){b+=a.style?a.style.height:0});return b},createDetailsSection:function(a){return{type:k.DETAILS,
stack:[f.createTable(a)]}},createDetailsSectionForFieldInfos:function(a,b){return{type:k.DETAILS,stack:[function(){var d=f.createTable(m.mixin({numColumns:2,numRows:a.length+1},b));d.data.data.forEach(function(c,b){if(0===b)c.field0=a[0].hasVariable?a[0].fieldCategory:"";else{var d=a[b-1];c.field0=d.script?d.script.alias:d.alias;c.fieldInfos.field1=d}});f.provideSpaceAfter(d);return d}()]}},createLocatorTablesForFieldInfos:function(a){return f.createLocatorAndHeaderTables({layerID:a[0].layerID},a.length,
null,a)},createLocatorAndHeaderTables:function(a,b,d,c){c=c||[];for(var e=f.createTable({numColumns:b,numRows:1,style:d}),h=0;h<b;h++){var n=e.data.columns[h].field;e.data.data[0][n]=c[h]?c[h].alias:"";e.data.data[0].style.fields[n].overrideStyle="TableHeader"}e.style.alternatingStyle="AlternatingRow";e.attributes.isLocatorHeader=!0;d=f.createTable({numColumns:b,numRows:1,style:d});for(h=0;h<b;h++)n=d.data.columns[h].field,d.data.data[0].fieldInfos[n]=c[h];d.attributes.locatorSettings=m.mixin({layerID:null,
filters:[],pagination:null,sorting:null},a);d.style.alternatingStyle="AlternatingRow";f.provideSpaceAfter(d);return{headerTableJson:e,dataTableJson:d,headerSectionJson:{type:k.DETAILS_HEADER,stack:[e]},dataSectionJson:{type:k.DETAILS,stack:[d]}}},createDetailsSectionForFieldInfoGroups:function(a,b){return{type:k.DETAILS,stack:[function(){var d=f.createTable(m.mixin({numColumns:a.length+1,numRows:a[0].length+1},b));d.data.data.forEach(function(c,b){d.data.columns.forEach(function(d,e){if(0!==e)if(0===
b)c[d.field]=a[e-1][0].fieldCategory||"";else{var f=a[e-1][b-1];c.field0=c.field0||(f.script?f.script.alias:f.alias);c.fieldInfos[d.field]=f}})});f.provideSpaceAfter(d);return d}()]}},provideSpaceAfter:function(a,b){a.style.spaceAfter=Math.max(b||0,90-15.07*a.data.data.length)},applyDefaultStyling:function(a){var b=!0;a.data.data.forEach(function(d,c){a.data.columns.forEach(function(a){d.style.fields[a.field].overrideStyle=0===c?"TableHeader":b?"AlternatingRow":void 0});b=!b})},setTableHeaderStyle:function(a){if(a.style)for(var b in a.style.fields)(a.style.fields[b]=
a.style.fields[b]||{}).overrideStyle="TableHeader"},DEFAULT_ROW_HEIGHT:15.07};return f});