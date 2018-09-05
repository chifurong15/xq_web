// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://js.arcgis.com/3.24/esri/copyright.txt for details.
//>>built
define("esri/layers/vectorTiles/views/2d/engine/webgl/CIMSymbolHelper",["require","exports","./CIMSymbolDrawHelper","./SDFHelper","../../../vectorTiles/GeometryUtils"],function(k,l,m,r,q){Object.defineProperty(l,"__esModule",{value:!0});k=function(){function h(){}h.getEnvelope=function(d){if("CIMPointSymbol"!==d.type)return null;var b=new m.EnvDrawHelper;b.drawSymbol(d,{type:"point",x:0,y:0});return b.envelope()};h.rasterize=function(d,b){var a=this.getEnvelope(b);if(!a||0>=a.width||0>=a.height)return[null,
0,0,0,0];var c=96/72,e=(a.x+.5*a.width)*c,g=-(a.y+.5*a.height)*c;d.width=a.width*c+2;d.height=a.height*c+2;a=d.getContext("2d");c=m.Transformation.createScale(c,-c);c.translate(.5*d.width-e,.5*d.height-g);(new m.CanvasDrawHelper(a,c)).drawSymbol(b,{type:"point",x:0,y:0});for(var c=a.getImageData(0,0,d.width,d.height),c=new Uint8Array(c.data),f=0;f<c.length;f+=4)a=c[f+3]/255,c[f]*=a,c[f+1]*=a,c[f+2]*=a;return[c,d.width,d.height,e/d.width,g/d.height]};h.fromSimpleMarker=function(d){var b,a,c=d.style;
if("circle"===c||"esriSMSCircle"===c){b=Math.acos(.995);a=Math.ceil(q.C_PI/b/4);0===a&&(a=1);b=q.C_PI_BY_2/a;a*=4;c=[];c.push([50,0]);for(var e=1;e<a;e++)c.push([50*Math.cos(e*b),-50*Math.sin(e*b)]);c.push([50,0]);b={rings:[c]};a={xmin:-50,ymin:-50,xmax:50,ymax:50}}else if("cross"===c||"esriSMSCross"===c)b=10,b={rings:[[[b,50],[b,b],[50,b],[50,-b],[b,-b],[b,-50],[-b,-50],[-b,-b],[-50,-b],[-50,b],[-b,b],[-b,50],[b,50]]]},a={xmin:-50,ymin:-50,xmax:50,ymax:50};else if("diamond"===c||"esriSMSDiamond"===
c)b={rings:[[[-50,0],[0,50],[50,0],[0,-50],[-50,0]]]},a={xmin:-50,ymin:-50,xmax:50,ymax:50};else if("square"===c||"esriSMSSquare"===c)b={rings:[[[-50,-50],[-50,50],[50,50],[50,-50],[-50,-50]]]},a={xmin:-50,ymin:-50,xmax:50,ymax:50};else if("x"===c||"esriSMSX"===c)b=14.142135623730951,b={rings:[[[0,b],[50-b,50],[50,50-b],[b,0],[50,b-50],[50-b,-50],[0,-b],[b-50,-50],[-50,b-50],[-b,0],[-50,50-b],[b-50,50],[0,b]]]},a={xmin:-50,ymin:-50,xmax:50,ymax:50};else if("triangle"===c||"esriSMSTriangle"===c)a=
2/3*100,c=a-100,b={rings:[[[-57.735026918962575,c],[0,a],[57.735026918962575,c],[-57.735026918962575,c]]]},a={xmin:-57.735026918962575,ymin:c,xmax:57.735026918962575,ymax:a};var g;b&&a&&(g=[{type:"CIMSolidFill",enable:!0,color:d.color}],d.outline&&g.push({type:"CIMSolidStroke",enable:!0,width:d.outline.width,color:d.outline.color}),g={type:"CIMPointSymbol",symbolLayers:[{type:"CIMVectorMarker",enable:!0,rotation:d.angle,size:d.size,offsetX:d.xoffset,offsetY:d.yoffset,frame:a,markerGraphics:[{type:"CIMMarkerGraphic",
geometry:b,symbol:{type:"CIMPolygonSymbol",symbolLayers:g}}]}]});return g};return h}();l.CIMSymbolHelper=k;k=function(){function h(){}h.rasterizeSimpleFill=function(d,b){"solid"!==b&&"none"!==b&&"esriSFSSolid"!==b&&"esriSFSNull"!==b||console.error("Unexpected: style does not require rasterization");d.width=8;d.height=8;var a=d.getContext("2d");a.strokeStyle="#FFFFFF";a.beginPath();if("vertical"===b||"cross"===b||"esriSFSCross"===b||"esriSFSVertical"===b)a.moveTo(0,0),a.lineTo(0,8);if("horizontal"===
b||"cross"===b||"esriSFSCross"===b||"esriSFSHorizontal"===b)a.moveTo(0,0),a.lineTo(8,0);if("forward-diagonal"===b||"diagonal-cross"===b||"esriSFSDiagonalCross"===b||"esriSFSForwardDiagonal"===b)a.moveTo(0,0),a.lineTo(8,8);if("backward-diagonal"===b||"diagonal-cross"===b||"esriSFSBackwardDiagonal"===b||"esriSFSDiagonalCross"===b)a.moveTo(8,0),a.lineTo(0,8);a.stroke();for(var a=a.getImageData(0,0,d.width,d.height),a=new Uint8Array(a.data),c,e=0;e<a.length;e+=4)c=a[e+3]/255,a[e]*=c,a[e+1]*=c,a[e+2]*=
c;return[a,d.width,d.height]};h.rasterizeSimpleLine=function(d,b){var a;switch(b){case "dash":case "esriSLSDash":a=[3,2];break;case "dash-dot":case "esriSLSDashDot":a=[2,2,0,2];break;case "dot":case "esriSLSDot":a=[0,3];break;case "long-dash":case "esriSLSLongDash":a=[6,3];break;case "long-dash-dot":case "esriSLSLongDashDot":a=[6,3,0,3];break;case "long-dash-dot-dot":case "esriSLSLongDashDotDot":a=[2,2,0,2,0,2];break;case "short-dash":case "esriSLSShortDash":a=[2,2];break;case "short-dash-dot":case "esriSLSShortDashDot":a=
[2,2,0,2];break;case "short-dash-dot-dot":case "esriSLSShortDashDotDot":a=[2,2,0,2,0,2];break;case "short-dot":case "esriSLSShortDot":a=[0,2];break;case "solid":case "esriSLSSolid":throw Error("Unexpected: style does not require rasterization");case "none":throw Error("Unexpected: style does not require rasterization");}for(var c=0,e=0,g=a;e<g.length;e++)var f=g[e],c=c+f;c*=16;g=31*c;e=new Float32Array(g);for(f=0;f<g;++f)e[f]=257;for(var h=g=.5,k=!0,l=0;l<a.length;l++){for(var f=a[l],g=h,h=h+16*f,
n=g;n<h;){for(var p=.5;31>p;){var f=(31-p+1.5)*c+n-.5,m=(p-15.5)*(p-15.5);e[f]=k?m:Math.min((n-g)*(n-g)+m,(n-h)*(n-h)+m);p++}n++}k=!k}a=e.length;g=new Uint8Array(4*a);for(f=0;f<a;++f)r.packFloat(Math.sqrt(e[f])/15,g,4*f);return[g,c,31]};return h}();l.SymbolHelper=k});