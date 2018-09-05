// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://js.arcgis.com/3.24/esri/copyright.txt for details.
//>>built
define("esri/tasks/QueryTask","dojo/_base/declare dojo/_base/lang dojo/_base/array dojo/_base/Deferred dojo/_base/json dojo/has ../kernel ../request ../deferredUtils ../geometry/Extent ../geometry/normalizeUtils ./Task ./FeatureSet".split(" "),function(h,g,r,p,m,t,u,l,v,w,x,y,q){var z=h(null,{url:null,query:null,requestOptions:null,pagination:null,pageSize:null,_fetchDfd:null,_startPage:null,_result:null,constructor:function(a){this._handleSuccess=g.hitch(this,this._handleSuccess);this._handleError=
g.hitch(this,this._handleError);g.mixin(this,a);null==this.pagination&&(this.pagination=!1);null==this.pageSize&&(this.pageSize=1E3)},execute:function(){var a=new p(this._canceler);this._fetchDfd=a;this._result=null;this._sendRequest();return a.promise},_canceler:function(a){var c=a._pendingRequest,d;a.isFulfilled()||!c||c.isFulfilled()||(c.cancel(),d=c.results&&c.results[1]);a._pendingRequest=null;return d},_sendRequest:function(a){var c=this.query;this.pagination&&(this._startPage=c.resultOffset=
null==a?0:a,c.resultRecordCount=this.pageSize);this._fetchDfd._pendingRequest=l({url:this.url,content:c,callbackParamName:"callback"},this.requestOptions);this._fetchDfd._pendingRequest.then(this._handleSuccess).otherwise(this._handleError)},_handleSuccess:function(a){this.pagination?(a.exceededTransferLimit&&this._sendRequest(this._startPage+this.pageSize),this._result?this._result.features=this._result.features.concat(a.features):this._result=a,this._fetchDfd.progress(a),a.exceededTransferLimit||
this._fetchDfd.resolve(this._result)):(this._fetchDfd.progress(a),this._fetchDfd.resolve(a))},_handleError:function(a){this._fetchDfd.reject(a)}});h=h(y,{declaredClass:"esri.tasks.QueryTask",_eventMap:{complete:["featureSet"],"execute-for-count-complete":["count"],"execute-for-ids-complete":["objectIds"],"execute-relationship-query-complete":["featureSets"]},constructor:function(a,c){this._handler=g.hitch(this,this._handler);this._relationshipQueryHandler=g.hitch(this,this._relationshipQueryHandler);
this._executeForIdsHandler=g.hitch(this,this._executeForIdsHandler);this._countHandler=g.hitch(this,this._countHandler);this._extentHandler=g.hitch(this,this._extentHandler);this.source=c&&c.source;this.gdbVersion=c&&c.gdbVersion;this.registerConnectEvents()},__msigns:[{n:"execute",c:4,a:[{i:0,p:["geometry"]}],e:2},{n:"rawExecute",c:2,a:[{i:0,p:["geometry"]}],e:2},{n:"executeForIds",c:3,a:[{i:0,p:["geometry"]}],e:2},{n:"executeForCount",c:3,a:[{i:0,p:["geometry"]}],e:2},{n:"executeForExtent",c:3,
a:[{i:0,p:["geometry"]}],e:2}],onComplete:function(){},onRawExecuteComplete:function(){},onExecuteRelationshipQueryComplete:function(){},onExecuteForIdsComplete:function(){},onExecuteForCountComplete:function(){},onExecuteForExtentComplete:function(){},execute:function(a,c,d,e,b){e=b.assembly;a=this._encode(g.mixin({},this._url.query,{f:"json"},a.toJson(e&&e[0])));var f=this._handler,k=this._errorHandler;this.source&&(e={source:this.source.toJson()},a.layer=m.toJson(e));this.gdbVersion&&(a.gdbVersion=
this.gdbVersion);return l({url:this._url.path+"/query",content:a,callbackParamName:"callback",load:function(a,e){f(a,e,c,d,b.dfd)},error:function(a){k(a,d,b.dfd)}},this.requestOptions)},rawExecute:function(a,c,d){c=c||{};a=this._encode(g.mixin({},this._url.query,{f:"json"},a.toJson(d.assembly&&d.assembly[0])));this.source&&(a.layer=m.toJson({source:this.source.toJson()}));this.gdbVersion&&(a.gdbVersion=this.gdbVersion);return(new z({url:this._url.path+"/query",query:a,requestOptions:this.requestOptions,
pagination:c.pagination,pageSize:c.pageSize})).execute().then(null,null,function(a){d.dfd.progress(a)}).then(g.hitch(this,function(a){this._successHandler([a],"onRawExecuteComplete",null,d.dfd)})).otherwise(g.hitch(this,function(a){this._errorHandler(a,null,d.dfd)}))},executeRelationshipQuery:function(a,c,d){a=this._encode(g.mixin({},this._url.query,{f:"json"},a.toJson()));var e=this._relationshipQueryHandler,b=this._errorHandler;this.gdbVersion&&(a.gdbVersion=this.gdbVersion);var f=new p(v._dfdCanceller);
f._pendingDfd=l({url:this._url.path+"/queryRelatedRecords",content:a,callbackParamName:"callback",load:function(a,b){e(a,b,c,d,f)},error:function(a){b(a,d,f)}},this.requestOptions);return f},executeForIds:function(a,c,d,e){var b=e.assembly;a=this._encode(g.mixin({},this._url.query,{f:"json",returnIdsOnly:!0},a.toJson(b&&b[0])));var f=this._executeForIdsHandler,k=this._errorHandler;this.source&&(b={source:this.source.toJson()},a.layer=m.toJson(b));this.gdbVersion&&(a.gdbVersion=this.gdbVersion);return l({url:this._url.path+
"/query",content:a,callbackParamName:"callback",load:function(a,b){f(a,b,c,d,e.dfd)},error:function(a){k(a,d,e.dfd)}},this.requestOptions)},executeForCount:function(a,c,d,e){var b=e.assembly;a=this._encode(g.mixin({},this._url.query,{f:"json",returnIdsOnly:!0,returnCountOnly:!0},a.toJson(b&&b[0])));var f=this._countHandler,k=this._errorHandler;this.source&&(b={source:this.source.toJson()},a.layer=m.toJson(b));this.gdbVersion&&(a.gdbVersion=this.gdbVersion);return l({url:this._url.path+"/query",content:a,
callbackParamName:"callback",load:function(a,b){f(a,b,c,d,e.dfd)},error:function(a){k(a,d,e.dfd)}},this.requestOptions)},executeForExtent:function(a,c,d,e){var b=e.assembly;a=this._encode(g.mixin({},this._url.query,{f:"json",returnExtentOnly:!0,returnCountOnly:!0},a.toJson(b&&b[0])));var f=this._extentHandler,k=this._errorHandler;this.source&&(b={source:this.source.toJson()},a.layer=m.toJson(b));this.gdbVersion&&(a.gdbVersion=this.gdbVersion);return l({url:this._url.path+"/query",content:a,callbackParamName:"callback",
load:function(a,b){f(a,b,c,d,e.dfd)},error:function(a){k(a,d,e.dfd)}},this.requestOptions)},_handler:function(a,c,d,e,b){try{var f=new q(a);this._successHandler([f],"onComplete",d,b)}catch(k){this._errorHandler(k,e,b)}},_relationshipQueryHandler:function(a,c,d,e,b){try{var f=a.geometryType,g=a.spatialReference,h={};r.forEach(a.relatedRecordGroups,function(a){var b={};b.geometryType=f;b.spatialReference=g;b.features=a.relatedRecords;b=new q(b);if(null!=a.objectId)h[a.objectId]=b;else for(var c in a)a.hasOwnProperty(c)&&
"relatedRecords"!==c&&(h[a[c]]=b)});this._successHandler([h],"onExecuteRelationshipQueryComplete",d,b)}catch(n){this._errorHandler(n,e,b)}},_executeForIdsHandler:function(a,c,d,e,b){try{this._successHandler([a.objectIds],"onExecuteForIdsComplete",d,b)}catch(f){this._errorHandler(f,e,b)}},_countHandler:function(a,c,d,e,b){try{var f,g=a.features,h=a.objectIds;if(h)f=h.length;else{if(g)throw Error("Unable to perform query. Please check your parameters.");f=a.count}this._successHandler([f],"onExecuteForCountComplete",
d,b)}catch(n){this._errorHandler(n,e,b)}},_extentHandler:function(a,c,d,e,b){try{a.extent&&(a.extent=new w(a.extent)),this._successHandler([a],"onExecuteForExtentComplete",d,b)}catch(f){this._errorHandler(f,e,b)}}});x._createWrappers(h);t("extend-esri")&&g.setObject("tasks.QueryTask",h,u);return h});