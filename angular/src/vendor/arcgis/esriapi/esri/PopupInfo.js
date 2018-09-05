// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://js.arcgis.com/3.24/esri/copyright.txt for details.
//>>built
define("esri/PopupInfo","dojo/_base/declare dojo/_base/lang dojo/_base/array dojo/_base/json dojo/i18n dojo/has dojo/Deferred dojo/sniff dojo/promise/all dojox/html/entities ./lang ./kernel ./request ./promiseList ./tasks/query ./tasks/QueryTask ./tasks/RelationshipQuery ./tasks/StatisticDefinition ./support/expressionUtils ./layers/support/attributeUtils dojo/i18n!dojo/cldr/nls/number".split(" "),function(x,r,l,E,S,J,K,L,C,M,n,F,N,O,u,G,P,Q,H,R,I){x=x(null,{declaredClass:"esri.PopupInfo",_reExprField:/^\s*expression\//i,
_exprPrefix:"expression/",_relatedFieldPrefix:"relationships/",initialize:function(a,b){if(a){r.mixin(this,b);this.info=a;this.title=this.getTitle;this.content=this.getContent;this._exprCache=this._compileExpressions(this.info.expressionInfos);var c=this._fieldLabels={},f=this._fieldsMap={};this.info.fieldInfos&&l.forEach(this.info.fieldInfos,function(a){var b=a.fieldName.toLowerCase(),e=this._isExpressionField(b)?this.getExpressionInfo(b):null;c[b]=e?e.title:a.label;f[b]=a},this);this.titleHasRelatedFields=
!(!this.info.title||-1===this.info.title.indexOf("{"+this._relatedFieldPrefix))}},toJson:function(){return E.fromJson(E.toJson(this.info))},getTitle:function(){},getContent:function(){},getFieldInfo:function(a){var b;l.some(this.info&&this.info.fieldInfos,function(c){c.fieldName===a&&(b=c);return!!b});return b},getExpressionInfo:function(a){if(this._isExpressionField(a)){a=a.replace(this._reExprField,"");a=a.toLowerCase();var b;l.some(this.info.expressionInfos,function(c){c.name.toLowerCase()===a&&
(b=c);return!!b});return b}},hasGeometryOperations:function(){return l.some(this.info.expressionInfos,function(a){return H.hasGeometryOperations(a.expression)})},getComponents:function(a){var b=this.info,c={};b.fieldInfos&&(b=l.filter(b.fieldInfos,function(a){return-1!==a.fieldName.indexOf(this._relatedFieldPrefix)},this))&&0<b.length&&(c.relatedInfo=this._getRelatedRecords({graphic:a,fieldsInfo:b}));this._needFullResolutionFeature(a)&&(c.fullResolutionFeature=this._getFullResolutionFeature(a));return O(c).then(r.hitch(this,
function(b){return this._getPopupValues(a,b.fullResolutionFeature)}))},getAttachments:function(a){var b=a.getSourceLayer();a=a.attributes;if(this.info.showAttachments&&b&&b.hasAttachments&&b.objectIdField&&(a=a&&a[b.objectIdField]))return b.queryAttachmentInfos(a)},_needFullResolutionFeature:function(a){return(a=a.getSourceLayer())?"esriGeometryPoint"!==a.geometryType&&"function"===typeof a.getMaxAllowableOffset&&0<a.getMaxAllowableOffset()&&this.hasGeometryOperations():!1},_getFullResolutionFeature:function(a){var b=
a.getSourceLayer(),c=b.objectIdField;a=(a=a.attributes)&&c&&a[c];if(null==a)return null;var f=new u;f.objectIds=[a];f.maxAllowableOffset=0;f.outFields=[c];return b.queryFeatures(f).then(function(a){return a.features&&a.features[0]})},_isExpressionField:function(a){return this._reExprField.test(a)},_compileExpressions:function(a){var b={};l.forEach(a,function(a){var c=a.returnType&&a.returnType.toLowerCase();b[a.name]=R.createAttributeCache({valueExpression:a.expression},"number"!==c)});return b},
_fetchAttributes:function(a,b){var c=r.clone(a.attributes)||{},f=b&&b.geometry,e=this._exprPrefix,d=this._exprCache;l.forEach(this.info.expressionInfos,function(b){var k=e+b.name;b=(b=d[b.name])?a._getDataValue(b.attributeInfo,b,H,null,f):null;"string"===typeof b&&(b=M.encode(b));c[k]=b});return c},_getPopupValues:function(a,b,c){var f=this.info,e=a.getSourceLayer(),d=this._fetchAttributes(a,b),m=r.clone(d);b=f.fieldInfos;var k="",q="",p,g,h,y,t,w=e&&e._getDateOpts&&e._getDateOpts().properties,w=
w&&w.slice(0),v={dateFormat:{properties:w,formatter:"DateFormat"+this._insertOffset(this._dateFormats.shortDateShortTime)}};if(this._relatedInfo)for(y in this._relatedInfo)if(this._relatedInfo.hasOwnProperty(y)){var z=this._relatedInfo[y],D=this._relatedLayersInfo[y];z&&(l.forEach(z.relatedFeatures,function(a){for(t in a.attributes)if(a.attributes.hasOwnProperty(t)&&"esriRelCardinalityOneToOne"===D.relation.cardinality){var b=this._toRelatedFieldName([D.relation.id,t]);d[b]=m[b]=a.attributes[t]}},
this),l.forEach(z.relatedStatsFeatures,function(a){for(t in a.attributes)if(a.attributes.hasOwnProperty(t)){var b=this._toRelatedFieldName([D.relation.id,t]);d[b]=m[b]=a.attributes[t]}},this))}b&&l.forEach(b,function(a){g=a.fieldName;var b=this._getLayerFieldInfo(e,g);b&&(g=a.fieldName=b.name);m[g]=this._formatValue(m[g],g,v);w&&a.format&&a.format.dateFormat&&(a=l.indexOf(w,g),-1<a&&w.splice(a,1))},this);if(e){y=e.types;var x=(z=e.typeIdField)&&d[z];for(g in d)if(d.hasOwnProperty(g)&&-1===g.indexOf(this._relatedFieldPrefix)&&
(h=d[g],n.isDefined(h))){var A=this._getDomainName(e,a,y,x,g,h);n.isDefined(A)?m[g]=A:g===z&&(A=this._getTypeName(e,a,h),n.isDefined(A)&&(m[g]=A))}}f.title&&(k=this._processFieldsInLinks(this._fixTokens(f.title,e),d),k=r.trim(n.substitute(m,k,v)||""));if(c)return{title:k};f.description&&(q=this._processFieldsInLinks(this._fixTokens(f.description,e),d),q=r.trim(n.substitute(m,q,v)||""));b&&(p=[],l.forEach(b,function(a){(g=a.fieldName)&&a.visible&&p.push([this._fieldLabels[g.toLowerCase()]||g,n.substitute(m,
"${"+g+"}",v)||""])},this));var B,u;f.mediaInfos&&(B=[],l.forEach(f.mediaInfos,function(a){u=0;h=a.value;switch(a.type){case "image":var b=h.sourceURL,b=b&&r.trim(n.substitute(d,this._fixTokens(b,e)));u=!!b;break;case "piechart":case "linechart":case "columnchart":case "barchart":var c,b=h.normalizeField;h.fields=l.map(h.fields,function(a){return(c=this._getLayerFieldInfo(e,a))?c.name:a},this);b&&(c=this._getLayerFieldInfo(e,b),h.normalizeField=c?c.name:b);u=l.some(h.fields,function(a){return n.isDefined(d[a])||
-1!==a.indexOf(this._relatedFieldPrefix)&&this._relatedInfo},this);break;default:return}if(u){a=r.clone(a);h=a.value;var b=a.title?this._processFieldsInLinks(this._fixTokens(a.title,e),d):"",f=a.caption?this._processFieldsInLinks(this._fixTokens(a.caption,e),d):"";a.title=b?r.trim(n.substitute(m,b,v)||""):"";a.caption=f?r.trim(n.substitute(m,f,v)||""):"";if("image"===a.type)h.sourceURL=n.substitute(d,this._fixTokens(h.sourceURL,e)),h.linkURL&&(h.linkURL=r.trim(n.substitute(d,this._fixTokens(h.linkURL,
e))||""));else{var g,k;l.forEach(h.fields,function(a,b){if(-1!==a.indexOf(this._relatedFieldPrefix))k=this._getRelatedChartInfos(a,h,d,v),k instanceof Array?h.fields=k:h.fields[b]=k;else{var c=d[a],c=void 0===c?null:c;g=d[h.normalizeField]||0;c&&g&&(c/=g);h.fields[b]={y:c,tooltip:(this._fieldLabels[a.toLowerCase()]||a)+":\x3cbr/\x3e"+this._formatValue(c,a,v,!!g)}}},this)}B.push(a)}},this));return{title:k,description:q,hasDescription:!!f.description,fields:p&&p.length?p:null,mediaInfos:B&&B.length?
B:null,formatted:m,editSummary:e&&e.getEditSummary?e.getEditSummary(a):""}},_getRelatedChartInfos:function(a,b,c,f){var e,d,m,k,q,p;e=[];p=this._fromRelatedFieldName(a);q=p[0];d=this._relatedInfo[q];q=this._relatedLayersInfo[q];d&&l.forEach(d.relatedFeatures,function(d){d=d.attributes;var g,l;for(l in d)if(d.hasOwnProperty(l)&&l===p[1]){g={};k=d[l];b.normalizeField&&(m=-1!==b.normalizeField.indexOf(this._relatedFieldPrefix)?d[this._fromRelatedFieldName(b.normalizeField)[1]]:c[b.normalizeField]);k&&
m&&(k/=m);if(b.tooltipField)if(-1!==b.tooltipField.indexOf(this._relatedFieldPrefix)){var q=this._fromRelatedFieldName(b.tooltipField)[1],r=n.isDefined(d[q])?this._formatValue(d[q],b.tooltipField,f,!!m):q;g.tooltip=r+":\x3cbr/\x3e"+this._formatValue(k,q,f,!!m)}else g.tooltip=(this._fieldLabels[a.toLowerCase()]||a)+":\x3cbr/\x3e"+this._formatValue(k,b.tooltipField,f,!!m);else g.tooltip=k;g.y=k;e.push(g)}},this);return"esriRelCardinalityOneToMany"===q.relation.cardinality||"esriRelCardinalityManyToMany"===
q.relation.cardinality?e:e[0]},_dateFormats:{shortDate:"(datePattern: 'M/d/y', selector: 'date')",shortDateLE:"(datePattern: 'd/M/y', selector: 'date')",longMonthDayYear:"(datePattern: 'MMMM d, y', selector: 'date')",dayShortMonthYear:"(datePattern: 'd MMM y', selector: 'date')",longDate:"(datePattern: 'EEEE, MMMM d, y', selector: 'date')",shortDateShortTime:"(datePattern: 'M/d/y', timePattern: 'h:mm a', selector: 'date and time')",shortDateLEShortTime:"(datePattern: 'd/M/y', timePattern: 'h:mm a', selector: 'date and time')",
shortDateShortTime24:"(datePattern: 'M/d/y', timePattern: 'H:mm', selector: 'date and time')",shortDateLEShortTime24:"(datePattern: 'd/M/y', timePattern: 'H:mm', selector: 'date and time')",shortDateLongTime:"(datePattern: 'M/d/y', timePattern: 'h:mm:ss a', selector: 'date and time')",shortDateLELongTime:"(datePattern: 'd/M/y', timePattern: 'h:mm:ss a', selector: 'date and time')",shortDateLongTime24:"(datePattern: 'M/d/y', timePattern: 'H:mm:ss', selector: 'date and time')",shortDateLELongTime24:"(datePattern: 'd/M/y', timePattern: 'H:mm:ss', selector: 'date and time')",
longMonthYear:"(datePattern: 'MMMM y', selector: 'date')",shortMonthYear:"(datePattern: 'MMM y', selector: 'date')",year:"(datePattern: 'y', selector: 'date')"},_reHref:/href\s*=\s*\"([^\"]+)\"/ig,_reHrefApos:/href\s*=\s*\'([^\']+)\'/ig,_reEmptyHref:/^href\s*=\s*"\s*"$/i,_reEmptyHrefApos:/^href\s*=\s*'\s*'$/i,_fixTokens:function(a,b){var c=this;return a.replace(/(\{([^\{\r\n]+)\})/g,function(a,e,d){a=c._getLayerFieldInfo(b,d);return"$"+(a?"{"+a.name+"}":e)})},_encodeAttributes:function(a){a=r.clone(a)||
{};var b,c;for(b in a)(c=a[b])&&"string"===typeof c&&(c=encodeURIComponent(c).replace(/\'/g,"\x26apos;"),a[b]=c);return a},_processFieldsInLinks:function(a,b){var c=this._encodeAttributes(b),c=r.hitch(this,this._addValuesToHref,b,c);a&&(a=a.replace(this._reHref,c).replace(this._reHrefApos,c));return a},_addValuesToHref:function(a,b,c,f){f=f&&r.trim(f);c=n.substitute(f&&0===f.indexOf("${")?a:b,c);this._reEmptyHref.test(c)?c='href\x3d"about:blank"':this._reEmptyHrefApos.test(c)&&(c="href\x3d'about:blank'");
return c},_getLayerFieldInfo:function(a,b){return a&&a.getField?a.getField(b):null},_formatValue:function(a,b,c,f){var e=this._fieldsMap[b.toLowerCase()],d=e&&e.format;b=-1!==l.indexOf(c.dateFormat.properties,b);var m="number"===typeof a&&!b&&(!d||!d.dateFormat);if(!n.isDefined(a)||!e||!n.isDefined(d))return m?this._forceLTR(a):a;var k="",e=[],q=d.hasOwnProperty("places")||d.hasOwnProperty("digitSeparator"),p=d.hasOwnProperty("digitSeparator")?d.digitSeparator:!0;if(q&&!b)k="NumberFormat",e.push("places: "+
(n.isDefined(d.places)&&(!f||0<d.places)?Number(d.places):"Infinity")),e.length&&(k+="("+e.join(",")+")");else if(d.dateFormat)k="DateFormat"+this._insertOffset(this._dateFormats[d.dateFormat]||this._dateFormats.shortDateShortTime);else return m?this._forceLTR(a):a;var g=this._applyFormatting(a,k,c);q&&-1<a.constructor.toString().indexOf("Array")&&(g="",l.forEach(a,r.hitch(this,function(a,b){b&&(g+=" ");g+=this._applyFormatting(a,k,c)})));q&&!p&&I.group&&(g=g.replace(new RegExp("\\"+I.group,"g"),
""));b&&(g='\x3cspan class\x3d"esriDateValue"\x3e'+g+"\x3c/span\x3e");return m?this._forceLTR(g):g},_applyFormatting:function(a,b,c){return n.substitute({myKey:a},"${myKey:"+b+"}",c)||""},_forceLTR:function(a){var b=L("ie");return b&&10>=b?a:"\x3cspan class\x3d'esriNumericValue'\x3e"+a+"\x3c/span\x3e"},_insertOffset:function(a){a&&(a=n.isDefined(this.utcOffset)?a.replace(/\)\s*$/,", utcOffset:"+this.utcOffset+")"):a);return a},_getDomainName:function(a,b,c,f,e,d){return(a=a.getDomain&&a.getDomain(e,
{feature:b}))&&a.codedValues?a.getName(d):null},_getTypeName:function(a,b,c){return(a=a.getType&&a.getType(b))&&a.name},_getRelatedRecords:function(a){var b=a.graphic,c;this._relatedLayersInfoPromise||(this._relatedLayersInfoPromise=this._getRelatedLayersInfo(a).then(r.hitch(this,function(a){for(c in a)a.hasOwnProperty(c)&&a[c]&&(this._relatedLayersInfo[c].relatedLayerInfo=a[c])})));return this._relatedLayersInfoPromise.then(r.hitch(this,function(){return this._queryRelatedLayers(b)})).then(r.hitch(this,
function(a){this._setRelatedRecords(b,a);return a}))},_getRelatedLayersInfo:function(a){var b=a.fieldsInfo,c,f,e={};c=a.graphic.getSourceLayer();this._relatedLayersInfo||(this._relatedLayersInfo={});l.forEach(b,function(a){var b,d,e,f;b=this._fromRelatedFieldName(a.fieldName);d=b[0];b=b[1];d&&(!this._relatedLayersInfo[d]&&c&&c.relationships&&(l.some(c.relationships,function(a){if(a.id==d)return f=a,!0}),f&&(this._relatedLayersInfo[d]={relation:f,relatedFields:[],outStatistics:[]})),this._relatedLayersInfo[d]&&
(this._relatedLayersInfo[d].relatedFields.push(b),a.statisticType&&(e=new Q,e.statisticType=a.statisticType,e.onStatisticField=b,e.outStatisticFieldName=b,this._relatedLayersInfo[d].outStatistics.push(e))))},this);for(f in this._relatedLayersInfo)this._relatedLayersInfo.hasOwnProperty(f)&&this._relatedLayersInfo[f]&&(a=this._relatedLayersInfo[f].relation,a=c.url.replace(/[0-9]+$/,a.relatedTableId),this._relatedLayersInfo[f].relatedLayerUrl=a,e[f]=N({url:a,content:{f:"json"},callbackParamName:"callback"}));
return C(e)},_queryRelatedLayers:function(a){var b={},c;for(c in this._relatedLayersInfo)this._relatedLayersInfo.hasOwnProperty(c)&&(b[c]=this._queryRelatedLayer({graphic:a,relatedInfo:this._relatedLayersInfo[c]}));return C(b)},_queryRelatedLayer:function(a){var b,c,f,e,d,m,k,q,p,g,h,n,t;b=a.graphic;c=b.getSourceLayer();f=c.url.match(/[0-9]+$/g)[0];h=a.relatedInfo;g=h.relatedLayerInfo;n=h.relatedLayerUrl;a=h.relation;l.some(g.relationships,function(a){if(a.relatedTableId===parseInt(f,10))return e=
a,!0},this);e&&(d=new u,l.some(g.fields,function(a){if(a.name===e.keyField)return q=-1!==l.indexOf(["esriFieldTypeSmallInteger","esriFieldTypeInteger","esriFieldTypeSingle","esriFieldTypeDouble"],a.type)?"number":"string",!0}),e.relationshipTableId&&e.keyFieldInRelationshipTable?(t=new K,this._queryRelatedRecords(b,e).then(r.hitch(this,function(a){var e;(e=a[b.attributes[c.objectIdField]])?(a=l.map(e.features,function(a){return a.attributes[g.objectIdField]},this),h.outStatistics&&0<h.outStatistics.length&&
g.supportsStatistics&&(p=new u,p.objectIds=a,p.outFields=d.outFields,p.outStatistics=h.outStatistics),p&&(m=new G(n),m.execute(p).then(r.hitch(this,function(a){var b=[];b.push(e);b.push(a);t.resolve(b)})))):t.resolve()}))):(k="string"===q?e.keyField+"\x3d'"+b.attributes[a.keyField]+"'":e.keyField+"\x3d"+b.attributes[a.keyField],d.where=k,d.outFields=h.relatedFields,h.outStatistics&&0<h.outStatistics.length&&g.supportsStatistics&&(p=new u,p.where=d.where,p.outFields=d.outFields,p.outStatistics=h.outStatistics),
m=new G(n),k=[],k.push(m.execute(d)),p&&k.push(m.execute(p))));return k?C(k):t?t.promise:void 0},_setRelatedRecords:function(a,b){this._relatedInfo=[];for(var c in b)if(b.hasOwnProperty(c)&&b[c]){var f=b[c];this._relatedInfo[c]={};this._relatedInfo[c].relatedFeatures=f[0].features;n.isDefined(f[1])&&(this._relatedInfo[c].relatedStatsFeatures=f[1].features)}},_handlerErrorResponse:function(a,b){a.reject(b)},_fromRelatedFieldName:function(a){var b=[];-1!==a.indexOf(this._relatedFieldPrefix)&&(a=a.split("/"),
b=a.slice(1));return b},_toRelatedFieldName:function(a){var b="";a&&0<a.length&&(b=this._relatedFieldPrefix+a[0]+"/"+a[1]);return b},_queryRelatedRecords:function(a,b){var c=a.getSourceLayer(),f=new P;f.outFields=["*"];f.relationshipId=b.id;f.objectIds=[a.attributes[c.objectIdField]];return c.queryRelatedFeatures(f)}});J("extend-esri")&&(F.PopupInfo=F.PopupInfoTemplate=x);return x});