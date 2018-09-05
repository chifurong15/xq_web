//>>built
define("dojox/app/utils/simpleModel",["dojo/_base/lang","dojo/Deferred","dojo/when"],function(k,m,n){return function(c,a,p){var b,d,e={},f=new m;c=function(a){var c={},b;for(b in a)"_"!==b.charAt(0)&&(c[b]=a[b]);return c};var g;if(a.store){if(!a.store.params)throw Error("Invalid store for model ["+p+"]");if(a.store.params.data||a.store.params.store)b=a.store.store,a.query?c(a.query):a.store.query&&c(a.store.query),d=void 0;else if(a.store.params.url){try{g=require("dojo/store/DataStore")}catch(l){throw Error("dojo/store/DataStore must be listed in the dependencies");
}b=new g({store:a.store.store});a.query?c(a.query):a.store.query&&c(a.store.query);d=void 0}else a.store.store&&(b=a.store.store,a.query?c(a.query):a.store.query&&c(a.store.query),d=void 0)}else if(a.datastore){try{g=require("dojo/store/DataStore")}catch(l){throw Error("When using datastore the dojo/store/DataStore module must be listed in the dependencies");}b=new g({store:a.datastore.store});c(a.query);d=void 0}else a.data?(a.data&&k.isString(a.data)&&(a.data=k.getObject(a.data)),d=a.data,b=void 0):
console.warn("simpleModel: Missing parameters.");var h;try{h=b?b.query():d}catch(l){return f.reject("load simple model error."),f.promise}if(h.then)n(h,k.hitch(this,function(a){e=a;f.resolve(e);return e}),function(){loadModelLoaderDeferred.reject("load model error.")});else return e=h,f.resolve(e),e;return f}});