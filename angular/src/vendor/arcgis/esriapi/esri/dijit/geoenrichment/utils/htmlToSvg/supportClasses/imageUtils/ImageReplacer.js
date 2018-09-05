// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://js.arcgis.com/3.24/esri/copyright.txt for details.
//>>built
define("esri/dijit/geoenrichment/utils/htmlToSvg/supportClasses/imageUtils/ImageReplacer","dojo/Deferred dojo/when dojo/promise/all dojo/query dojo/dom-style ../VisibilityChecker ../../../ImageInfoUtil".split(" "),function(k,l,g,h,q,m,n){h={};var r=/^data:/i,t=/^url\s*\(/i,u=/url\("data:|url\(data:/i,p={getImages:function(a){a=a.getElementsByTagName("img");for(var d=[],b=0;b<a.length;b++){var c=a[b];!r.test(c.src)&&m.checkNode(c)&&d.push(a[b])}return d},getBackgroundImageNodes:function(a){function d(a){if(a&&
a.children)for(var e=0;e<a.children.length;e++){var c=a.children[e];if("IMG"!==c.nodeName&&m.checkNode(c)){var f=q.get(c,"backgroundImage");f&&t.test(f)&&!u.test(f)&&(c.__backgroundImage=f,b.push(c));d(c)}}}var b=[];d(a);return b}},v={replaceImages:function(a){return g(a.map(function(a){return l(n.getRemoteImageDataUrl(a.src),function(b){if(b!==a.src){var c=a.src,e=new k;a.onload=e.resolve;a.onerror=function(){a.src=c};a.src=b;return e.promise}})}))}},w={replaceBackgroundNodes:function(a){return g(a.map(function(a){var b=
a.__backgroundImage;delete a.__backgroundImage;var c=b.replace(/^url\s*\(/i,"").replace(")","").replace(/"/g,"").trim();return l(n.getRemoteImageDataUrl(c),function(b){if(b!==c)return a.style.backgroundImage="url("+b+")",b=new k,setTimeout(b.resolve),b.promise})}))}};h.replaceImagesWithDataURL=function(a){var d=p.getImages(a);a=p.getBackgroundImageNodes(a);return g([v.replaceImages(d),w.replaceBackgroundNodes(a)])};return h});