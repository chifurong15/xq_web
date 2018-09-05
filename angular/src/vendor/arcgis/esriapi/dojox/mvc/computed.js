//>>built
define("dojox/mvc/computed",["dojo/_base/array","dojo/_base/lang","dojo/has"],function(h,l,f){function q(a,b,n){var d;a&&l.isFunction(a.watch)?d=a.watch(b,function(b,a,g){r(a,g)||n(g,a)}):console.log("Attempt to observe non-stateful "+a+" with "+b+". Observation not happening.");return{remove:function(){d&&d.remove()}}}function k(a){return h.map(a,function(b){return b.each?h.map(b.target,function(a){return a.get?a.get(b.targetProp):a[b.targetProp]}):b.target.get?b.target.get(b.targetProp):b.target[b.targetProp]})}
function p(a){for(var b=null;b=a.shift();)b.remove()}f.add("object-is-api",l.isFunction(Object.is));var m=Array.prototype,r=f("object-is-api")?Object.is:function(a,b){return a===b&&(0!==a||1/a===1/b)||a!==a&&b!==b};return function(a,b,n){function d(g){var d,e;try{d=n.apply(a,g),e=!0}catch(c){console.error("Error during computed property callback: "+(c&&c.stack||c))}e&&(l.isFunction(a.set)?a.set(b,d):a[b]=d)}if(null==a)throw Error("Computed property cannot be applied to null.");if("*"===b)throw Error("Wildcard property cannot be used for computed properties.");
var e=m.slice.call(arguments,3),f=h.map(e,function(a,b){function f(b){return q(b,a.targetProp,function(){d(k(e))})}if("*"===a.targetProp)throw Error("Wildcard property cannot be used for computed properties.");if(a.each){var c,g=h.map(a.target,f);a.target&&l.isFunction(a.target.watchElements)?c=a.target.watchElements(function(a,b,c){p(m.splice.apply(g,[a,b.length].concat(h.map(c,f))));d(k(e))}):console.log("Attempt to observe non-stateful-array "+a.target+". Observation not happening.");return{remove:function(){c&&
c.remove();p(g)}}}return q(a.target,a.targetProp,function(a){var c=[];m.push.apply(c,k(e.slice(0,b)));c.push(a);m.push.apply(c,k(e.slice(b+1)));d(c)})});d(k(e));return{remove:function(){p(f)}}}});