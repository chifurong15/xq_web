// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://js.arcgis.com/3.24/esri/copyright.txt for details.
//>>built
define("esri/layers/rasterFormats/ImageCanvasDecoder",["require","dojo/_base/declare","dojo/Deferred","dojo/sniff"],function(p,q,r,t){var h;return q(null,{constructor:function(a){this.ctx=a.ctx;this._loadRasterFormatModule()},decode:function(a,d){if(!d.width||!d.height)throw"Native decoding requires the image format, width and height";var g=new r,b,e=new Uint8Array(a),f=this._getFormat(a);if("error"===f)throw"invalid format";"jpeg"===f&&(b=this._getMask(e,d));var l="",c,h;for(c=0;c<e.length;c+=65535)h=
e.subarray(c,c+65535>e.length-1?e.length-1:c+65535),l+=String.fromCharCode.apply(null,h);var e="data:image/"+f+";base64,"+window.btoa(l),k=new Image,n;k.src=e;var m=this;k.onload=function(){m.ctx.clearRect(0,0,d.width,d.height);m.ctx.drawImage(k,0,0);var a=m.ctx.getImageData(0,0,k.width,k.height);n=a.data;if(b)for(c=0;c<b.length;c++)n[4*c+3]=b[c]?255:0;m.ctx.putImageData(a,0,0);g.resolve(null)};k.onerror=function(){g.reject("cannot load image")};return g},_getFormat:function(a){a=new Uint8Array(a,
0,10);var d="error";255===a[0]&&216===a[1]?d="jpeg":137===a[0]&&80===a[1]&&78===a[2]&&71===a[3]&&(d="png");return d},_getMask:function(a,d){var g;try{if(!h)throw"The zlib decoder module is not loaded.";var b=0,e=0,f=Math.round(a.length/2);1===f%2&&(f+=1);for(var l=a.length-2,b=f;b<l&&(255!==a[b]||217!==a[b+1]);b++);f=b+=2;if(f<a.length-1){var c=(new h(a.subarray(f))).getBytes();g=new Uint8Array(d.width*d.height);for(b=f=0;b<c.length;b++)for(e=7;0<=e;e--)g[f++]=c[b]>>e&1}}catch(u){}return g},_loadRasterFormatModule:function(){10>
t("ie")||p(["./Zlib"],function(a){h=a})}})});