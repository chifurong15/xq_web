/*
	Copyright (c) 2004-2016, The JS Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/

//>>built
define("dojo/dom-attr","exports ./sniff ./_base/lang ./dom ./dom-style ./dom-prop".split(" "),function(f,p,n,h,q,g){function k(a,c){var b=a.getAttributeNode&&a.getAttributeNode(c);return!!b&&b.specified}var m={innerHTML:1,textContent:1,className:1,htmlFor:p("ie"),value:1},l={classname:"class",htmlfor:"for",tabindex:"tabIndex",readonly:"readOnly"};f.has=function(a,c){var b=c.toLowerCase();return m[g.names[b]||c]||k(h.byId(a),l[b]||c)};f.get=function(a,c){a=h.byId(a);var b=c.toLowerCase(),d=g.names[b]||
c,e=a[d];if(m[d]&&"undefined"!=typeof e)return e;if("textContent"==d)return g.get(a,d);if("href"!=d&&("boolean"==typeof e||n.isFunction(e)))return e;b=l[b]||c;return k(a,b)?a.getAttribute(b):null};f.set=function(a,c,b){a=h.byId(a);if(2==arguments.length){for(var d in c)f.set(a,d,c[d]);return a}d=c.toLowerCase();var e=g.names[d]||c,k=m[e];if("style"==e&&"string"!=typeof b)return q.set(a,b),a;if(k||"boolean"==typeof b||n.isFunction(b))return g.set(a,c,b);a.setAttribute(l[d]||c,b);return a};f.remove=
function(a,c){h.byId(a).removeAttribute(l[c.toLowerCase()]||c)};f.getNodeProp=function(a,c){a=h.byId(a);var b=c.toLowerCase(),d=g.names[b]||c;if(d in a&&"href"!=d)return a[d];b=l[b]||c;return k(a,b)?a.getAttribute(b):null}});