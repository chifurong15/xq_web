// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://js.arcgis.com/3.24/esri/copyright.txt for details.
//>>built
define("esri/symbols/utils",["dojo/_base/lang","dojo/_base/window","dojo/has","dojox/gfx","../kernel"],function(q,l,m,g,r){function k(d){d.removeAttribute("marker-start");d.removeAttribute("marker-end");d.removeAttribute("opacity")}function h(d,a){for(var b in a)d.setAttribute(b,a[b])}function n(d,a,b){a="url(#"+a.getAttribute("id")+")";d.rawNode.setAttribute("marker-"+b,a)}var t=-1!==g.renderer.toLowerCase().indexOf("svg"),u=9===m("ie"),p={marker:{markerWidth:"6",markerHeight:"6",markerUnits:"strokeWidth",
orient:"auto"},spear:{marker:{end:{viewBox:"0 0 25.4 23.43",refX:"20",refY:"12.76"},start:{viewBox:"-25.4 0 25.4 23.43",refX:"-20",refY:"12.76"}},path:{common:{d:"M1.63 23.43 L5.37 16.6 L5.37 8.93 L1.63 2.09 L25.4 12.76 L1.63 23.43 Z","stroke-width":"0","fill-opacity":"1"},start:{transform:"matrix(-1, 0, 0, 1, 0, 0)"}}}};g={applyLineMarker:function(d,a,b,f){if(t&&!u){var c=d&&d.rawNode,e=a.marker;b=b||a.color;c&&"none"!==a.style&&b&&e&&"arrow"===e.style&&e.placement?c.getTotalLength&&0===c.getTotalLength()?
k(c):(a=-1!==e.placement.indexOf("begin"),e=-1!==e.placement.indexOf("end"),a||e?(c.removeAttribute("stroke-opacity"),c.setAttribute("opacity",b.a),a?(a=f(d,b,"spear","start"),n(d,a,"start")):c.removeAttribute("marker-start"),e?(b=f(d,b,"spear","end"),n(d,b,"end")):c.removeAttribute("marker-end")):k(c)):c&&k(c)}},createSVGMarker:function(d,a,b,f){b=p[b];var c=l.doc.createElementNS("http://www.w3.org/2000/svg","marker");c.setAttribute("id",a);h(c,p.marker);h(c,b.marker[f]);a=l.doc.createElementNS("http://www.w3.org/2000/svg",
"path");a.setAttribute("fill",d.toCss());h(a,b.path.common);h(a,b.path[f]);c.appendChild(a);return c}};m("extend-esri")&&q.setObject("renderer.utils",g,r);return g});