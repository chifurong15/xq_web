// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://js.arcgis.com/3.24/esri/copyright.txt for details.
//>>built
define("esri/dijit/geoenrichment/utils/requests/DataResource","dojo/_base/declare dojo/Deferred dojo/when ./UniversalClient ./FileContent ./BinaryData ./ErrorUtil".split(" "),function(h,k,l,m,d,n,e){function f(b,a){a=a||function(a){return a};return l(b,function(b){if(b instanceof Error)return a(e.makeError(b));"object"===typeof b&&b.hasOwnProperty("result")||(b={taskName:"executeTask",result:b});return a(b)},function(b){return a(e.makeError(b))})}return h(null,{url:null,allowProxy:!1,data:null,constructor:function(b){"string"==
typeof b?this.url=b:void 0!==b&&(this.data=b)},_fileContentPromise:null,getFileContent:function(b){var a=this._fileContentPromise;if(!a||b){var c=new k,a=c.promise;b||(this._fileContentPromise=a);this.getResource("bin",this._getFileContent.bind(this,c))}return a},_getFileContent:function(b,a){if(a instanceof Error)b.reject(a);else{a=a.result;if(a instanceof n){var c=a.type;a=a.data}"string"===typeof a?b.resolve(new d(a,c)):window.Blob&&a instanceof Blob?d.fromBlob(a).then(b.resolve,b.reject):window.ArrayBuffer&&
a instanceof ArrayBuffer?b.resolve(d.fromArrayBuffer(a,c)):a instanceof d?b.resolve(a):b.reject(e.makeError("The resource data isn't binary."))}},getResource:function(b,a){b||(b="json");if(this.data){var c="function"==typeof this.data?this.data(b):this.data;return f(c,a)}if(this.url){var d=this,g=new m(this.url),c=g.send(null,{handleAs:b}).otherwise(function(a){return d.allowProxy?g.send(null,{handleAs:b,useProxy:!0}):a});return f(c,a)}c=e.makeError("Missing data and url.");return a?a(c):c}})});