// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://js.arcgis.com/3.24/esri/copyright.txt for details.
//>>built
define("esri/dijit/geoenrichment/utils/async/AsyncQueue","dojo/_base/declare dojo/_base/lang dojo/Deferred dojo/when dijit/Destroyable ../DelayUtil".split(" "),function(m,n,k,g,p,l){var d=m(p,{_lastPromise:null,_isFinished:!1,_isDestroyed:!1,_lastDfd:null,_lastResult:null,constructor:function(a){n.mixin(this,a)},add:function(a,b){function e(){if(!c._isDestroyed){var a;try{a=f()}catch(q){return(new k).reject(q)}return g(a,function(a){return void 0!==b.delayAfter?l.delay(function(){return a},b.delayAfter):
a})}}b=b||{};var c=this;if(!this._isDestroyed){this._lastDfd||(this.onStarted(),this._lastDfd=new k);this._isFinished=!1;var f="function"===typeof a?a:function(){return a};if(void 0!==b.delayBefore)var d=f,f=function(){return l.delay(d,b.delayBefore)};!this._lastPromise||this._lastPromise.isFulfilled()?this._lastPromise=g(e()):this._lastPromise=g(this._lastPromise).then(e);var h=this._lastPromise;g(h,function(a){h!==c._lastPromise||c._isDestroyed||c._isFinished||h&&!h.isFulfilled()||(c._isFinished=
!0,c._lastDfd.resolve(a),c._lastResult=a,c._lastDfd=null,c.onFinished(a))},this._lastDfd.reject);return this._lastDfd&&this._lastDfd.promise}},getPromise:function(){return this._isDestroyed?null:this._lastDfd&&this._lastDfd.promise||this._lastResult},destroy:function(){this._isDestroyed=!0},isDestroyed:function(){return this._isDestroyed},onStarted:function(){},onFinished:function(a){}});d.executeFunctions=function(a,b){var e=new d;a.forEach(function(a,f){e.add(a,{delayBefore:0===f?void 0:b})});return e.getPromise()};
d.processArrayInBatches=function(a,b){function e(){if(a.length){for(var f=[],d=0;d<b.batchSize&&a.length;d++)f.push(a.shift());f.forEach(b.callback);setTimeout(e,b.timeout||0)}else c.resolve()}a=a.slice();var c=new k;e();return c.promise};return d});