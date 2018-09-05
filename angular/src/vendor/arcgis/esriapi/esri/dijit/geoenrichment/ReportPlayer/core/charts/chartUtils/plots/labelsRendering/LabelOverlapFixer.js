// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://js.arcgis.com/3.24/esri/copyright.txt for details.
//>>built
define("esri/dijit/geoenrichment/ReportPlayer/core/charts/chartUtils/plots/labelsRendering/LabelOverlapFixer",["dojo/_base/lang"],function(y){function w(d,b,a,k){for(var r,e=0,c=b.length;e<c;e++){var v=b[e],f;if(f=v!==d){var p=d;f=v;var t=k,l;if(1===a)l=!1;else{var u=p.w*a/2,g=f.w*a/2;l=p.x+u;var u=p.x+p.w-u,m=f.x+g,g=f.x+f.w-g;l=m>=l&&m<=u||l>=m&&l<=g}l&&(1===t?l=!1:(g=p.h*t/2,l=f.h*t/2,t=p.y+g,p=p.y+p.h-g,g=f.y+l,f=f.y+f.h-l,l=g>=t&&g<=p||t>=g&&t<=f));f=l}f&&(r=r||[],r.push(v))}return r}function z(d,
b,a){var k={boxWithMaxOverlappingNeighbours:null},r=0;d.forEach(function(e){var c=w(e,d,b,a);e._numOverlaps=c?c.length:0;e._overlappingBoxes=c;e._numOverlaps>r&&(r=e._numOverlaps,k.boxWithMaxOverlappingNeighbours=e)});return k}var x={},A={hideIncorrectLabels:function(d,b,a,k,r){for(d=d.filter(function(c,d){var f=b[c._index];if(Math.abs(f.x-c.x)>2*c.w||Math.abs(f.y-c.y)>3*c.h||c.x<a.minX-3||c.x>a.maxX-c.w+3||c.y<a.minY-3||c.y>a.maxY-c.h+3)c.hidden=!0;return!c.hidden});;){var e=z(d,k,r);if(e.boxWithMaxOverlappingNeighbours)e.boxWithMaxOverlappingNeighbours.hidden=
!0,d.splice(d.indexOf(e.boxWithMaxOverlappingNeighbours),1);else break}}};x.fixLabelsOverlap=function(d,b,a,k,r){function e(){d.sort(function(a,m){return a.x-m.x});v&&d.sort(function(a,m){return m.y-a.y});for(var m=0,e=d.length;m<e;m++){var a=d[m],k=w(a,d,t,l);if(k){m=0;for(e=k.length;m<e;m++){var h=k[m],n=v?-(h.y+h.h-a.y+p):!1;!1!==n&&h.y+n<g.minY-3&&(n=!1);var b=c&&a.x<h.x?a.x+a.w-h.x+f:!1;!1!==b&&h.x+b>g.maxX-h.w+3&&(b=!1);var q=c&&a.x>h.x?h.x+h.w-a.x+f:!1;!1!==q&&a.x+q>g.maxX-a.w+3&&(q=!1);if(!1!==
n||!1!==b||!1!==q)n&&!1===b&&!1===q?h.y+=n:!1===n&&b&&!1===q?h.x+=b:!1===n&&!1===b&&q?a.x+=q:n&&b&&!1===q?-n<b?h.y+=n:h.x+=b:n&&!1===b&&q&&(-n<q?h.y+=n:a.x+=q)}return!0}}}var c=k.allowXShift,v=k.allowYShift,f=k.xGap||0,p=k.yGap||0,t=k.xTolerance||0,l=k.yTolerance||0,u={};d.forEach(function(a,b){u[b]=y.mixin({},a);a._index=b});var g={minX:a.l+1,maxX:b.width-a.r,minY:a.t,maxY:b.height-a.b+11};d.forEach(function(a){a.x=Math.max(a.x,g.minX);a.x=Math.min(a.x+a.w,g.maxX)-a.w;a.y=Math.max(a.y,g.minY);a.y=
Math.min(a.y+a.h,g.maxY)-a.h});for(b=0;50>b&&e();b++);A.hideIncorrectLabels(d,u,g,t,l)};return x});