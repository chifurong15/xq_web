//>>built
define("dojox/rpc/OfflineRest",["dojo","dojox","dojox/data/ClientFilter","dojox/rpc/Rest","dojox/storage"],function(h,d){function l(a){return a.replace(/[^0-9A-Za-z_]/g,"_")}function p(a,c){m&&!r&&(c||a&&a.__id)&&d.storage.put(l(c||a.__id),"object"==typeof a?d.json.ref.toJson(a):a,function(){},"dojox_rpc_OfflineRest")}function u(a){return a instanceof Error&&(503==a.status||12E3<a.status||!a.status)}function v(){if(m){var a=d.storage.get("dirty","dojox_rpc_OfflineRest");if(a)for(var c in a)w(c,a)}}
function t(){g.sendChanges();g.downloadChanges()}function x(a,c,b,e,f){"delete"==a?d.storage.remove(l(c),"dojox_rpc_OfflineRest"):d.storage.put(l(b),e,function(){},"dojox_rpc_OfflineRest");if(a=f&&f._store)a.updateResultSet(a._localBaseResults,a._localBaseFetch),d.storage.put(l(f._getRequest(a._localBaseFetch.query).url),d.json.ref.toJson(a._localBaseResults),function(){},"dojox_rpc_OfflineRest")}function w(a,c){var b=c[a],e=d.rpc.JsonRest.getServiceAndId(b.id),e=y(b.method,e.service,e.id,b.content);
c[a]=b;d.storage.put("dirty",c,function(){},"dojox_rpc_OfflineRest");e.addBoth(function(c){if(u(c))return null;var b=d.storage.get("dirty","dojox_rpc_OfflineRest")||{};delete b[a];d.storage.put("dirty",b,function(){},"dojox_rpc_OfflineRest");return c});return e}var n=d.rpc.Rest,m,q=n._index;d.storage.manager.addOnLoad(function(){m=d.storage.manager.available;for(var a in q)p(q[a],a)});var r,g,A=setInterval(t,15E3);h.connect(document,"ononline",t);g=d.rpc.OfflineRest={turnOffAutoSync:function(){clearInterval(A)},
sync:t,sendChanges:v,downloadChanges:function(){},addStore:function(a,c){g.stores.push(a);a.fetch({queryOptions:{cache:!0},query:c,onComplete:function(c,d){a._localBaseResults=c;a._localBaseFetch=d}})}};g.stores=[];var B=n._get;n._get=function(a,c){try{v();if(window.navigator&&!1===navigator.onLine)throw Error();var b=B(a,c)}catch(f){b=new h.Deferred,b.errback(f)}var e=d.rpc._sync;b.addCallback(function(d){p(d,a._getRequest(c).url);return d});b.addErrback(function(f){if(m){if(u(f)){var g={},z=function(a,
c){if(g[a])return c;var b=h.fromJson(d.storage.get(l(a),"dojox_rpc_OfflineRest"))||c;g[a]=b;for(var e in b){var f=b[e];if(a=f&&f.$ref)a.substring&&"cid:"==a.substring(0,4)&&(a=a.substring(4)),b[e]=z(a,f)}if(b instanceof Array)for(e=0;e<b.length;e++)void 0===b[e]&&b.splice(e--,1);return b};r=!0;var k=z(a._getRequest(c).url);if(!k)return f;r=!1;return k}return f}if(e)return Error("Storage manager not loaded, can not continue");b=new h.Deferred;b.addCallback(arguments.callee);d.storage.manager.addOnLoad(function(){b.callback()});
return b});return b};h.addOnLoad(function(){h.connect(d.data,"restListener",function(a){var c=a.channel,b=a.event.toLowerCase(),e=d.rpc.JsonRest&&d.rpc.JsonRest.getServiceAndId(c).service;x(b,c,"post"==b?c+a.result.id:c,h.toJson(a.result),e)})});var y=n._change;n._change=function(a,c,b,e){if(!m)return y.apply(this,arguments);var f=c._getRequest(b).url;x(a,f,d.rpc.JsonRest._contentId,e,c);var h=d.storage.get("dirty","dojox_rpc_OfflineRest")||{};if("put"==a||"delete"==a)var g=f;else{var g=0,k;for(k in h)isNaN(parseInt(k))||
(g=k);g++}h[g]={method:a,id:f,content:e};return w(g,h)};h.connect(q,"onLoad",p);h.connect(q,"onUpdate",p);return g});