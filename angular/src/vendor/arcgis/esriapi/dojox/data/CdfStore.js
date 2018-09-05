//>>built
define("dojox/data/CdfStore",["dojo","dojox","dojo/data/util/sorter"],function(f,h){h.data.ASYNC_MODE=0;h.data.SYNC_MODE=1;return f.declare("dojox.data.CdfStore",null,{identity:"jsxid",url:"",xmlStr:"",data:null,label:"",mode:h.data.ASYNC_MODE,constructor:function(a){a&&(this.url=a.url,this.xmlStr=a.xmlStr||a.str,a.data&&(this.xmlStr=this._makeXmlString(a.data)),this.identity=a.identity||this.identity,this.label=a.label||this.label,this.mode=void 0!==a.mode?a.mode:this.mode);this._modifiedItems={};
this.byId=this.fetchItemByIdentity},getValue:function(a,c,b){return a.getAttribute(c)||b},getValues:function(a,c){var b=this.getValue(a,c,[]);return f.isArray(b)?b:[b]},getAttributes:function(a){return a.getAttributeNames()},hasAttribute:function(a,c){return void 0!==this.getValue(a,c)},hasProperty:function(a,c){return this.hasAttribute(a,c)},containsValue:function(a,c,b){a=this.getValues(a,c);for(c=0;c<a.length;c++)if(null!==a[c])if("string"===typeof b){if(a[c].toString&&a[c].toString()===b)return!0}else if(a[c]===
b)return!0;return!1},isItem:function(a){return a.getClass&&a.getClass().equals(jsx3.xml.Entity.jsxclass)?!0:!1},isItemLoaded:function(a){return this.isItem(a)},loadItem:function(a){},getFeatures:function(){return{"dojo.data.api.Read":!0,"dojo.data.api.Write":!0,"dojo.data.api.Identity":!0}},getLabel:function(a){if(""!==this.label&&this.isItem(a)&&(a=this.getValue(a,this.label)))return a.toString()},getLabelAttributes:function(a){return""!==this.label?[this.label]:null},fetch:function(a){a=a||{};a.store||
(a.store=this);void 0!==a.mode&&(this.mode=a.mode);var c=this,b=function(c){a.onError?a.onError.call(a.scope||f.global,c,a):console.error("cdfStore Error:",c)},g=function(b,e){e=e||a;var d=e.abort||null,g=!1,k=e.start?e.start:0,h=e.count&&Infinity!==e.count?k+e.count:b.length;e.abort=function(){g=!0;d&&d.call(e)};var m=e.scope||f.global;e.store||(e.store=c);e.onBegin&&e.onBegin.call(m,b.length,e);e.sort&&b.sort(f.data.util.sorter.createSortFunction(e.sort,c));if(e.onItem)for(var l=k;l<b.length&&l<
h;++l){var n=b[l];g||e.onItem.call(m,n,e)}e.onComplete&&!g?(e.onItem||(b=b.slice(k,h),e.byId&&(b=b[0])),e.onComplete.call(m,b,e)):(b=b.slice(k,h),e.byId&&(b=b[0]));return b};if(!this.url&&!this.data&&!this.xmlStr)return b(Error("No URL or data specified.")),!1;var k=a||"*";if(this.mode==h.data.SYNC_MODE){var d=this._loadCDF();if(d instanceof Error)return a.onError?a.onError.call(a.scope||f.global,d,a):console.error("CdfStore Error:",d),d;this.cdfDoc=d;return d=(d=this._getItems(this.cdfDoc,k))&&0<
d.length?g(d,a):g([],a)}d=this._loadCDF();d.addCallbacks(f.hitch(this,function(b){(b=this._getItems(this.cdfDoc,k))&&0<b.length?g(b,a):g([],a)}),f.hitch(this,function(c){b(c,a)}));return d},_loadCDF:function(){var a=new f.Deferred;if(this.cdfDoc){if(this.mode==h.data.SYNC_MODE)return this.cdfDoc;setTimeout(f.hitch(this,function(){a.callback(this.cdfDoc)}),0);return a}this.cdfDoc=jsx3.xml.CDF.Document.newDocument();this.cdfDoc.subscribe("response",this,function(c){a.callback(this.cdfDoc)});this.cdfDoc.subscribe("error",
this,function(c){a.errback(c)});this.cdfDoc.setAsync(!this.mode);if(this.url)this.cdfDoc.load(this.url);else if(this.xmlStr&&(this.cdfDoc.loadXML(this.xmlStr),this.cdfDoc.getError().code))return Error(this.cdfDoc.getError().description);return this.mode==h.data.SYNC_MODE?this.cdfDoc:a},_getItems:function(a,c){for(var b=a.selectNodes(c.query,!1,1),f=[];b.hasNext();)f.push(b.next());return f},close:function(a){},newItem:function(a,c){a=a||{};a.tagName&&("record"!=a.tagName&&console.warn("Only record inserts are supported at this time"),
delete a.tagName);a.jsxid=a.jsxid||this.cdfDoc.getKey();this.isItem(c)&&(c=this.getIdentity(c));var b=this.cdfDoc.insertRecord(a,c);this._makeDirty(b);return b},deleteItem:function(a){this.cdfDoc.deleteRecord(this.getIdentity(a));this._makeDirty(a);return!0},setValue:function(a,c,b){this._makeDirty(a);a.setAttribute(c,b);return!0},setValues:function(a,c,b){this._makeDirty(a);console.warn("cdfStore.setValues only partially implemented.");return a.setAttribute(c,b)},unsetAttribute:function(a,c){this._makeDirty(a);
a.removeAttribute(c);return!0},revert:function(){delete this.cdfDoc;this._modifiedItems={};return!0},isDirty:function(a){if(a)return!!this._modifiedItems[this.getIdentity(a)];a=!1;for(var c in this._modifiedItems){a=!0;break}return a},_makeDirty:function(a){var c=this.getIdentity(a);this._modifiedItems[c]=a},_makeXmlString:function(a){var c=function(a,g){var b="",d;if(f.isArray(a))for(d=0;d<a.length;d++)b+=c(a[d],g);else if(f.isObject(a)){b+="\x3c"+g+" ";for(d in a)f.isObject(a[d])||(b+=d+'\x3d"'+
a[d]+'" ');b+="\x3e";for(d in a)f.isObject(a[d])&&(b+=c(a[d],d));b+="\x3c/"+g+"\x3e"}return b};return c(a,"data")},getIdentity:function(a){return this.getValue(a,this.identity)},getIdentityAttributes:function(a){return[this.identity]},fetchItemByIdentity:function(a){f.isString(a)?a={query:"//record[@jsxid\x3d'"+a+"']",mode:h.data.SYNC_MODE}:(a&&(a.query="//record[@jsxid\x3d'"+a.identity+"']"),a.mode||(a.mode=this.mode));a.byId=!0;return this.fetch(a)},byId:function(a){}})});