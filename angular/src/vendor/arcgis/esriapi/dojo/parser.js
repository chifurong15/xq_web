/*
	Copyright (c) 2004-2016, The JS Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/

//>>built
define("dojo/parser","require ./_base/kernel ./_base/lang ./_base/array ./_base/config ./dom ./_base/window ./_base/url ./aspect ./promise/all ./date/stamp ./Deferred ./has ./query ./on ./ready".split(" "),function(E,y,t,x,N,O,P,Q,K,R,S,F,G,L,T,U){function H(b){return eval("("+b+")")}function V(b){var a=b._nameCaseMap,e=b.prototype;if(!a||a._extendCnt<A){var a=b._nameCaseMap={},f;for(f in e)"_"!==f.charAt(0)&&(a[f.toLowerCase()]=f);a._extendCnt=A}return a}function I(b,a){a||(a=E);var e=a._dojoParserCtorMap||
(a._dojoParserCtorMap={}),f=b.join();if(!e[f]){for(var c=[],g=0,w=b.length;g<w;g++){var m=b[g];c[c.length]=e[m]=e[m]||t.getObject(m)||~m.indexOf("/")&&a(m)}g=c.shift();e[f]=c.length?g.createSubclass?g.createSubclass(c):g.extend.apply(g,c):g}return e[f]}new Date("X");var A=0;K.after(t,"extend",function(){A++},!0);var J={_clearCache:function(){A++;_ctorMap={}},_functionFromScript:function(b,a){var e="",f="",c=b.getAttribute(a+"args")||b.getAttribute("args"),g=b.getAttribute("with"),c=(c||"").split(/\s*,\s*/);
g&&g.length&&x.forEach(g.split(/\s*,\s*/),function(a){e+="with("+a+"){";f+="}"});return new Function(c,e+b.innerHTML+f)},instantiate:function(b,a,e){a=a||{};e=e||{};var f=(e.scope||y._scopeName)+"Type",c="data-"+(e.scope||y._scopeName)+"-",g=c+"type",w=c+"mixins",m=[];x.forEach(b,function(b){var c=f in a?a[f]:b.getAttribute(g)||b.getAttribute(f);if(c){var e=b.getAttribute(w),c=e?[c].concat(e.split(/\s*,\s*/)):[c];m.push({node:b,types:c})}});return this._instantiate(m,a,e)},_instantiate:function(b,
a,e,f){function c(b){a._started||e.noStart||x.forEach(b,function(a){"function"!==typeof a.startup||a._started||a.startup()});return b}b=x.map(b,function(b){var c=b.ctor||I(b.types,e.contextRequire);if(!c)throw Error("Unable to resolve constructor for: '"+b.types.join()+"'");return this.construct(c,b.node,a,e,b.scripts,b.inherited)},this);return f?R(b).then(c):c(b)},construct:function(b,a,e,f,c,g){function w(a){v&&t.setObject(v,a);for(l=0;l<z.length;l++)K[z[l].advice||"after"](a,z[l].method,t.hitch(a,
z[l].func),!0);for(l=0;l<B.length;l++)B[l].call(a);for(l=0;l<C.length;l++)a.watch(C[l].prop,C[l].func);for(l=0;l<D.length;l++)T(a,D[l].event,D[l].func);return a}var m=b&&b.prototype;f=f||{};var p={};f.defaults&&t.mixin(p,f.defaults);g&&t.mixin(p,g);var r;G("dom-attributes-explicit")?r=a.attributes:G("dom-attributes-specified-flag")?r=x.filter(a.attributes,function(a){return a.specified}):(g=(/^input$|^img$/i.test(a.nodeName)?a:a.cloneNode(!1)).outerHTML.replace(/=[^\s"']+|="[^"]*"|='[^']*'/g,"").replace(/^\s*<[a-zA-Z0-9]*\s*/,
"").replace(/\s*>.*$/,""),r=x.map(g.split(/\s+/),function(b){var c=b.toLowerCase();return{name:b,value:"LI"==a.nodeName&&"value"==b||"enctype"==c?a.getAttribute(c):a.getAttributeNode(c).value}}));var k=f.scope||y._scopeName;g="data-"+k+"-";var d={};"dojo"!==k&&(d[g+"props"]="data-dojo-props",d[g+"type"]="data-dojo-type",d[g+"mixins"]="data-dojo-mixins",d[k+"type"]="dojotype",d[g+"id"]="data-dojo-id");for(var l=0,h,k=[],v,q;h=r[l++];){var n=h.name,u=n.toLowerCase();h=h.value;switch(d[u]||u){case "data-dojo-type":case "dojotype":case "data-dojo-mixins":break;
case "data-dojo-props":q=h;break;case "data-dojo-id":case "jsid":v=h;break;case "data-dojo-attach-point":case "dojoattachpoint":p.dojoAttachPoint=h;break;case "data-dojo-attach-event":case "dojoattachevent":p.dojoAttachEvent=h;break;case "class":p["class"]=a.className;break;case "style":p.style=a.style&&a.style.cssText;break;default:if(n in m||(n=V(b)[u]||n),n in m)switch(typeof m[n]){case "string":p[n]=h;break;case "number":p[n]=h.length?Number(h):NaN;break;case "boolean":p[n]="false"!=h.toLowerCase();
break;case "function":""===h||-1!=h.search(/[^\w\.]+/i)?p[n]=new Function(h):p[n]=t.getObject(h,!1)||new Function(h);k.push(n);break;default:u=m[n],p[n]=u&&"length"in u?h?h.split(/\s*,\s*/):[]:u instanceof Date?""==h?new Date(""):"now"==h?new Date:S.fromISOString(h):u instanceof Q?y.baseUrl+h:H(h)}else p[n]=h}}for(r=0;r<k.length;r++)d=k[r].toLowerCase(),a.removeAttribute(d),a[d]=null;if(q)try{q=H.call(f.propsThis,"{"+q+"}"),t.mixin(p,q)}catch(M){throw Error(M.toString()+" in data-dojo-props\x3d'"+
q+"'");}t.mixin(p,e);c||(c=b&&(b._noScript||m._noScript)?[]:L("\x3e script[type^\x3d'dojo/']",a));var z=[],B=[],C=[],D=[];if(c)for(l=0;l<c.length;l++)d=c[l],a.removeChild(d),e=d.getAttribute(g+"event")||d.getAttribute("event"),f=d.getAttribute(g+"prop"),q=d.getAttribute(g+"method"),k=d.getAttribute(g+"advice"),r=d.getAttribute("type"),d=this._functionFromScript(d,g),e?"dojo/connect"==r?z.push({method:e,func:d}):"dojo/on"==r?D.push({event:e,func:d}):p[e]=d:"dojo/aspect"==r?z.push({method:q,advice:k,
func:d}):"dojo/watch"==r?C.push({prop:f,func:d}):B.push(d);b=(c=b.markupFactory||m.markupFactory)?c(p,a,b):new b(p,a);return b.then?b.then(w):w(b)},scan:function(b,a){function e(a){if(!a.inherited){a.inherited={};var b=a.node,c=e(a.parent),b={dir:b.getAttribute("dir")||c.dir,lang:b.getAttribute("lang")||c.lang,textDir:b.getAttribute(r)||c.textDir},d;for(d in b)b[d]&&(a.inherited[d]=b[d])}return a.inherited}var f=[],c=[],g={},w=(a.scope||y._scopeName)+"Type",m="data-"+(a.scope||y._scopeName)+"-",p=
m+"type",r=m+"textdir",m=m+"mixins",k=b.firstChild,d=a.inherited;if(!d){var l=function(a,b){return a.getAttribute&&a.getAttribute(b)||a.parentNode&&l(a.parentNode,b)},d={dir:l(b,"dir"),lang:l(b,"lang"),textDir:l(b,r)},h;for(h in d)d[h]||delete d[h]}for(var d={inherited:d},v,q;;)if(k)if(1!=k.nodeType)k=k.nextSibling;else if(v&&"script"==k.nodeName.toLowerCase())(n=k.getAttribute("type"))&&/^dojo\/\w/i.test(n)&&v.push(k),k=k.nextSibling;else if(q)k=k.nextSibling;else{var n=k.getAttribute(p)||k.getAttribute(w);
h=k.firstChild;if(n||h&&(3!=h.nodeType||h.nextSibling)){q=null;if(n){var u=k.getAttribute(m);v=u?[n].concat(u.split(/\s*,\s*/)):[n];try{q=I(v,a.contextRequire)}catch(B){}q||x.forEach(v,function(a){~a.indexOf("/")&&!g[a]&&(g[a]=!0,c[c.length]=a)});u=q&&!q.prototype._noScript?[]:null;d={types:v,ctor:q,parent:d,node:k,scripts:u};d.inherited=e(d);f.push(d)}else d={node:k,scripts:v,parent:d};v=u;q=k.stopParser||q&&q.prototype.stopParser&&!a.template;k=h}else k=k.nextSibling}else{if(!d||!d.node)break;k=
d.node.nextSibling;q=!1;d=d.parent;v=d.scripts}var t=new F;c.length?(G("dojo-debug-messages")&&console.warn("WARNING: Modules being Auto-Required: "+c.join(", ")),(a.contextRequire||E)(c,function(){t.resolve(x.filter(f,function(b){if(!b.ctor)try{b.ctor=I(b.types,a.contextRequire)}catch(M){}for(var c=b.parent;c&&!c.types;)c=c.parent;var d=b.ctor&&b.ctor.prototype;b.instantiateChildren=!(d&&d.stopParser&&!a.template);b.instantiate=!c||c.instantiate&&c.instantiateChildren;return b.instantiate}))})):
t.resolve(f);return t.promise},_require:function(b,a){var e=H("{"+b.innerHTML+"}"),f=[],c=[],g=new F,w=a&&a.contextRequire||E,m;for(m in e)f.push(m),c.push(e[m]);w(c,function(){for(var a=0;a<f.length;a++)t.setObject(f[a],arguments[a]);g.resolve(arguments)});return g.promise},_scanAmd:function(b,a){var e=new F,f=e.promise;e.resolve(!0);var c=this;L("script[type\x3d'dojo/require']",b).forEach(function(b){f=f.then(function(){return c._require(b,a)});b.parentNode.removeChild(b)});return f},parse:function(b,
a){!b||"string"==typeof b||"nodeType"in b||(a=b,b=a.rootNode);var e=b?O.byId(b):P.body();a=a||{};var f=a.template?{template:!0}:{},c=[],g=this,w=this._scanAmd(e,a).then(function(){return g.scan(e,a)}).then(function(b){return g._instantiate(b,f,a,!0)}).then(function(a){return c=c.concat(a)}).otherwise(function(a){console.error("dojo/parser::parse() error",a);throw a;});t.mixin(c,w);return c}};y.parser=J;N.parseOnLoad&&U(100,J,"parse");return J});