//>>built
define("dojox/gfx/vml_attach","dojo/_base/kernel dojo/_base/lang ./_base ./matrix ./path dojo/_base/Color ./vml".split(" "),function(u,l,g,m,v,n,k){u.experimental("dojox.gfx.vml_attach");k.attachNode=function(a){if(!a)return null;var d=null;switch(a.tagName.toLowerCase()){case k.Rect.nodeType:a=d=new k.Rect(a);var c=a.rawNode,b=c.outerHTML.match(/arcsize = \"(\d*\.?\d+[%f]?)\"/)[1],c=c.style,e=parseFloat(c.width),f=parseFloat(c.height),b=0<=b.indexOf("%")?parseFloat(b)/100:k._parseFloat(b);a.shape=
g.makeParameters(g.defaultRect,{x:parseInt(c.left),y:parseInt(c.top),width:e,height:f,r:Math.min(e,f)*b});break;case k.Ellipse.nodeType:a.style.width==a.style.height?(a=d=new k.Circle(a),b=a.rawNode.style,c=parseInt(b.width)/2,a.shape=g.makeParameters(g.defaultCircle,{cx:parseInt(b.left)+c,cy:parseInt(b.top)+c,r:c})):(a=d=new k.Ellipse(a),b=a.rawNode.style,c=parseInt(b.width)/2,e=parseInt(b.height)/2,a.shape=g.makeParameters(g.defaultEllipse,{cx:parseInt(b.left)+c,cy:parseInt(b.top)+e,rx:c,ry:e}));
break;case k.Path.nodeType:switch(a.getAttribute("dojoGfxType")){case "line":b=d=new k.Line(a);a=b.shape=l.clone(g.defaultLine);b=b.rawNode.path.v.match(g.pathVmlRegExp);7>b.length||"m"!=b[0]||"l"!=b[3]||"e"!=b[6]||(a.x1=parseInt(b[1]),a.y1=parseInt(b[2]),a.x2=parseInt(b[4]),a.y2=parseInt(b[5]));break;case "polyline":b=d=new k.Polyline(a);a=b.shape=l.clone(g.defaultPolyline);b=b.rawNode.path.v.match(g.pathVmlRegExp);do if(!(3>b.length||"m"!=b[0]||(c=parseInt(b[0]),e=parseInt(b[1]),isNaN(c)||isNaN(e)||
(a.points.push({x:c,y:e}),6>b.length||"l"!=b[3]))))for(f=4;f<b.length;f+=2){c=parseInt(b[f]);e=parseInt(b[f+1]);if(isNaN(c)||isNaN(e))break;a.points.push({x:c,y:e})}while(0);break;case "path":d=new k.Path(a);p(d);break;case "text":d=new k.Text(a);q(d);r(d);a=d;t(a);b=a.matrix;c=a.fontStyle;b&&c&&(a.matrix=m.multiply(b,{dy:.35*g.normalizedLength(c.size)}));break;case "textpath":d=new k.TextPath(a),p(d),q(d),r(d)}break;case k.Image.nodeType:switch(a.getAttribute("dojoGfxType")){case "image":a=d=new k.Image(a),
a.shape=l.clone(g.defaultImage),a.shape.src=a.rawNode.firstChild.src,a=d.rawNode.filters["DXImageTransform.Microsoft.Matrix"],d.matrix=m.normalize({xx:a.M11,xy:a.M12,yx:a.M21,yy:a.M22,dx:a.Dx,dy:a.Dy})}break;default:return null}if(!(d instanceof k.Image)){a=d;b=null;c=a.rawNode;e=c.fill;if(e.on&&"gradient"==e.type)for(b=l.clone(g.defaultLinearGradient),rad=m._degToRad(e.angle),b.x2=Math.cos(rad),b.y2=Math.sin(rad),b.colors=[],c=e.colors.value.split(";"),e=0;e<c.length;++e)(f=c[e].match(/\S+/g))&&
2==f.length&&b.colors.push({offset:k._parseFloat(f[0]),color:new n(f[1])});else if(e.on&&"gradientradial"==e.type)for(b=l.clone(g.defaultRadialGradient),w=parseFloat(c.style.width),h=parseFloat(c.style.height),b.cx=isNaN(w)?0:e.focusposition.x*w,b.cy=isNaN(h)?0:e.focusposition.y*h,b.r=isNaN(w)?1:w/2,b.colors=[],c=e.colors.value.split(";"),e=c.length-1;0<=e;--e)(f=c[e].match(/\S+/g))&&2==f.length&&b.colors.push({offset:k._parseFloat(f[0]),color:new n(f[1])});else e.on&&"tile"==e.type?(b=l.clone(g.defaultPattern),
b.width=g.pt2px(e.size.x),b.height=g.pt2px(e.size.y),b.x=e.origin.x*b.width,b.y=e.origin.y*b.height,b.src=e.src):e.on&&c.fillcolor&&(b=new n(c.fillcolor+""),b.a=e.opacity);a.fillStyle=b;x(d);d instanceof k.Text||t(d)}return d};k.attachSurface=function(a){var d=new k.Surface;d.clipNode=a;a=d.rawNode=a.firstChild;var c=a.firstChild;if(!c||"rect"!=c.tagName)return null;d.bgNode=a;return d};var x=function(a){var d=a.rawNode;if(d.stroked){a=a.strokeStyle=l.clone(g.defaultStroke);var c=d.stroke;a.color=
new n(d.strokecolor.value);a.width=g.normalizedLength(d.strokeweight+"");a.color.a=c.opacity;a.cap=this._translate(this._capMapReversed,c.endcap);a.join="miter"==c.joinstyle?c.miterlimit:c.joinstyle;a.style=c.dashstyle}else a.strokeStyle=null},t=function(a){var d=a.rawNode.skew,c=d.matrix,d=d.offset;a.matrix=m.normalize({xx:c.xtox,xy:c.ytox,yx:c.xtoy,yy:c.ytoy,dx:g.pt2px(d.x),dy:g.pt2px(d.y)})},q=function(a){var d=a.shape=l.clone(g.defaultText),c=a.rawNode,b=c.path.v.match(g.pathVmlRegExp);do if(b&&
7==b.length){for(var e=c.childNodes,f=0;f<e.length&&"textpath"!=e[f].tagName;++f);if(!(f>=e.length)){a=e[f].style;d.text=e[f].string;switch(a["v-text-align"]){case "left":d.x=parseInt(b[1]);d.align="start";break;case "center":d.x=(parseInt(b[1])+parseInt(b[4]))/2;d.align="middle";break;case "right":d.x=parseInt(b[4]),d.align="end"}d.y=parseInt(b[2]);d.decoration=a["text-decoration"];d.rotated=a["v-rotate-letters"].toLowerCase()in k._bool;d.kerning=a["v-text-kern"].toLowerCase()in k._bool;return}}while(0);
a.shape=null},r=function(a){for(var d=a.fontStyle=l.clone(g.defaultFont),c=a.rawNode.childNodes,b=0;b<c.length&&"textpath"==c[b].tagName;++b);b>=c.length?a.fontStyle=null:(a=c[b].style,d.style=a.fontstyle,d.variant=a.fontvariant,d.weight=a.fontweight,d.size=a.fontsize,d.family=a.fontfamily)},p=function(a){var d=a.shape=l.clone(g.defaultPath),c=a.rawNode.path.v.match(g.pathVmlRegExp);a=[];for(var b=!1,e=v._pathVmlToSvgMap;0<c.length;++c){var f=c[0];f in e?(b=!1,a.push(e[f])):b||(f=parseInt(f),isNaN(f)?
b=!0:a.push(f))}c=a.length;4<=c&&""==a[c-1]&&0==a[c-2]&&0==a[c-3]&&"l"==a[c-4]&&a.splice(c-4,4);c&&(d.path=a.join(" "))};return k});