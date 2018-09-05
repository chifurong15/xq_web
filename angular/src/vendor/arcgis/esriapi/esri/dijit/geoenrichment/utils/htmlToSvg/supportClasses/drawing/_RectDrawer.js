// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://js.arcgis.com/3.24/esri/copyright.txt for details.
//>>built
define("esri/dijit/geoenrichment/utils/htmlToSvg/supportClasses/drawing/_RectDrawer",["dojo/_base/lang","../ElementBuilder","../VisibilityChecker"],function(f,g,h){var e={drawRect:function(a,d){if(h.checkRect(a))return g.buildElement("rect",f.mixin({fill:a.style.background.color,"fill-opacity":a.style.background.opacity,width:a.style.pw+a.style.border.l.width,height:a.style.ph+a.style.border.t.width,x:a.box.x+a.style.border.l.width/2,y:a.box.y+a.style.border.t.width/2,opacity:a.style.opacity,rx:a.style.borderRadius,
ry:a.style.borderRadius,clipParams:d,transform:a.style.transform},a.style.borderRadius?e._getBorderParams(a,"l"):null))},_getBorderParams:function(a,d){var b=a.style.border[d],c;"dashed"===b.style&&(c=1+2*b.width,c=c+", "+c);return{stroke:b.color,"stroke-opacity":b.opacity,"stroke-width":b.width,"stroke-dasharray":c}},drawBorder:function(a,d){function b(b,c,d,e){b+=a.box.x+a.style.border.l.width/2;d+=a.box.x+a.style.border.l.width/2;c+=a.box.y+a.style.border.t.width/2;e+=a.box.y+a.style.border.t.width/
2;return b+","+c+" "+d+","+e}function c(b,c){h.checkBorder(a.style.border[b])&&k.push(g.buildElement("polyline",f.mixin({points:c,clipParams:d,transform:a.style.transform},e._getBorderParams(a,b))))}if(!a.style.borderRadius){var k=[];c("t",b(0,0,a.style.pw+a.style.border.l.width/2+ +a.style.border.r.width/2,0));c("r",b(a.style.pw+a.style.border.l.width/2+ +a.style.border.r.width/2,0,a.style.pw+a.style.border.l.width/2+ +a.style.border.r.width/2,a.style.ph+a.style.border.t.width/2+ +a.style.border.b.width/
2));c("b",b(a.style.pw+a.style.border.l.width/2+ +a.style.border.r.width/2,a.style.ph+a.style.border.t.width/2+ +a.style.border.b.width/2,0,a.style.ph+a.style.border.t.width/2+ +a.style.border.b.width/2));c("l",b(0,a.style.ph+a.style.border.t.width/2+ +a.style.border.b.width/2,0,0));return k}}};return e});