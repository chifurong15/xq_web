// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://js.arcgis.com/3.24/esri/copyright.txt for details.
//>>built
define("esri/layers/vectorTiles/views/2d/engine/webgl/TextShaping",["require","exports","../../../../core/SetPool"],function(y,z,x){return function(){function k(e,h,c,a,f,b,t,m){this._glyphItems=e;this._maxWidth=h;this._lineHeight=c;this._letterSpacing=a;this._offset=f;this._hAnchor=b;this._vAnchor=t;this._justify=m}k.prototype.getShaping=function(e,h){for(var c=this._letterSpacing,a=this._offset[0],f=this._offset[1],b=[],t=x.acquire(),m=e.length,d=0;d<m;d++){var g=e.charCodeAt(d);if(10===g)t.add(b.length);
else{for(var l=void 0,p=0,k=this._glyphItems;p<k.length&&!(l=k[p][g]);p++);l&&(b.push({codePoint:g,x:a,y:f,glyphMosaicItem:l}),a+=l.metrics.advance+c)}}if(0<b.length){p=this._maxWidth;c=this._lineHeight;f=this._justify;m=b.length;l=g=a=0;if(0!==p||0<t.size)for(var n=0,d=k=0;d<m;d++){var q=b[d];q.x-=k;q.y=h?q.y-c*a:q.y+c*a;var u=t.has(d);if(p&&q.x>p&&0<n||u){for(var v=u?d:n+1,w=b[v].x,l=Math.max(w,l),r=v;r<=d;r++)b[r].y=h?b[r].y-c:b[r].y+c,b[r].x-=w;f&&(n=u?d-1:n-1,0<=n&&this._applyJustification(b,
g,n));g=v;n=0;k+=w;a++}32===q.codePoint&&(n=d)}d=b[m-1];l=Math.max(l,d.x+d.glyphMosaicItem.metrics.advance);f&&this._applyJustification(b,g,m-1);d=(f-this._hAnchor)*l;f=(-this._vAnchor*(a+1)+.5)*c;h&&a&&(f+=a*c);for(c=0;c<b.length;c++)a=b[c],a.x+=d,a.y+=f}x.release(t);return b};k.getBox=function(e,h){var c=e.length;if(0!==c){for(var a=e[0].x,f=a,b=e[0].y,k=b,m=b,d=1;d<c;d++){var g=e[d],l=g.x;l<a&&(a=l);l>f&&(f=l);g=g.y;g<b&&(b=g);g>k&&(k=g);g!==m&&(m=this._glyphWidth(e[d-1].codePoint,h),f=Math.max(f,
e[d-1].x+m),m=g)}d=this._glyphWidth(e[c-1].codePoint,h);f=Math.max(f,e[c-1].x+d);b+=17;return{x:a,y:b,width:f-a,height:k+7-b}}};k.prototype._applyJustification=function(e,h,c){for(var a=e[c],a=(a.x+a.glyphMosaicItem.metrics.advance)*this._justify;h<=c;h++)e[h].x-=a};k._glyphWidth=function(e,h){for(var c,a=0;a<h.length&&!(c=h[a][e]);a++);return c?c.metrics.advance:0};return k}()});