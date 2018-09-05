// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://js.arcgis.com/3.24/esri/copyright.txt for details.
//>>built
define("esri/styles/size",["dojo/_base/array","dojo/_base/lang","dojo/has","../kernel","../Color"],function(t,u,w,x,d){function v(a,b){var c,e,h;if(a)switch(c={},b){case "point":c.color=new d(a.color);c.noDataColor=new d(a.noDataColor);c.outline={color:new d(a.outline.color),width:a.outline.width};c.size=a.size;c.noDataSize=a.noDataSize;c.minSize=a.minSize;c.maxSize=a.maxSize;c.opacity=a.opacity||1;break;case "line":c.color=new d(a.color);c.noDataColor=new d(a.noDataColor);c.width=a.width;c.noDataWidth=
a.noDataWidth;c.minWidth=a.minWidth;c.maxWidth=a.maxWidth;c.opacity=a.opacity||1;break;case "polygon":e=a.marker,h=a.background,c.marker={color:new d(e.color),noDataColor:new d(e.noDataColor),outline:{color:new d(e.outline.color),width:e.outline.width},size:e.size,noDataSize:e.noDataSize,minSize:e.minSize,maxSize:e.maxSize},c.background={color:new d(h.color),outline:{color:new d(h.outline.color),width:h.outline.width}},c.opacity=a.opacity||1,delete c.marker.opacity}return c}function p(a){var b;a&&
(b=u.mixin({},a),b.color&&(b.color=new d(b.color)),b.noDataColor&&(b.noDataColor=new d(b.noDataColor)),b.outline&&(b.outline={color:b.outline.color&&new d(b.outline.color),width:b.outline.width}));return b}function y(a){if("esriGeometryPoint"===a||"esriGeometryMultipoint"===a)a="point";else if("esriGeometryPolyline"===a)a="line";else if("esriGeometryPolygon"===a||"esriGeometryMultiPatch"===a)a="polygon";return a}var f=[128,128,128,1],l=[128,128,128,1],g={primary:{color:[227,139,79,1],noDataColor:f,
outline:{color:[255,255,255,1],width:1},noDataSize:4,size:12,minSize:8,maxSize:50,opacity:.8},secondary:[{color:[128,128,128,1],noDataColor:f,outline:{color:[255,255,255,1],width:1},noDataSize:4,size:12,minSize:8,maxSize:50,opacity:.8},{color:[255,255,255,1],noDataColor:f,outline:{color:[128,128,128,1],width:1},noDataSize:4,size:12,minSize:8,maxSize:50,opacity:.8}]},k={primary:{color:[227,139,79,1],noDataColor:l,outline:{color:[51,51,51,1],width:1},noDataSize:4,size:12,minSize:8,maxSize:50,opacity:.8},
secondary:[{color:[178,178,178,1],noDataColor:l,outline:{color:[51,51,51,1],width:1},noDataSize:4,size:12,minSize:8,maxSize:50,opacity:.8},{color:[26,26,26,1],noDataColor:l,outline:{color:[128,128,128,1],width:1},noDataSize:4,size:12,minSize:8,maxSize:50,opacity:.8}]},m={r:0,g:0,b:0,a:0},q={color:m,outline:{color:{r:166,g:166,b:166,a:1},width:1}},m={color:m,outline:{color:{r:166,g:166,b:166,a:1},width:1}},n={"default":{name:"default",label:"Default",description:"Default theme for visualizing features by varying their size to show data.",
basemapGroups:{light:"streets gray topo terrain national-geographic oceans osm".split(" "),dark:["satellite","hybrid","dark-gray"]},pointSchemes:{light:g,dark:k},lineSchemes:{light:{primary:{color:[226,119,40,1],noDataColor:f,noDataWidth:1,width:1,minWidth:1,maxWidth:18},secondary:[{color:[77,77,77,1],noDataColor:f,noDataWidth:1,width:1,minWidth:1,maxWidth:18},{color:[153,153,153,1],noDataColor:f,noDataWidth:1,width:1,minWidth:1,maxWidth:18}]},dark:{primary:{color:[226,119,40,1],noDataColor:l,noDataWidth:1,
width:1,minWidth:1,maxWidth:18},secondary:[{color:[255,255,255,1],noDataColor:l,noDataWidth:1,width:1,minWidth:1,maxWidth:18},{color:[153,153,153,1],noDataColor:l,noDataWidth:1,width:1,minWidth:1,maxWidth:18}]}},polygonSchemes:{light:{primary:{marker:g.primary,background:m,opacity:g.primary.opacity},secondary:[{marker:g.secondary[0],background:m,opacity:g.secondary[0].opacity},{marker:g.secondary[1],background:m,opacity:g.secondary[1].opacity}]},dark:{primary:{marker:k.primary,background:q,opacity:k.primary.opacity},
secondary:[{marker:k.secondary[0],background:q,opacity:k.secondary[0].opacity},{marker:k.secondary[1],background:q,opacity:k.secondary[1].opacity}]}}}},r={};(function(){var a,b,c,e,h,d,f,g;for(a in n)for(e in b=n[a],c=b.basemapGroups,h=r[a]={basemaps:[].concat(c.light).concat(c.dark),point:{},line:{},polygon:{}},c)for(d=c[e],f=0;f<d.length;f++)g=d[f],b.pointSchemes&&(h.point[g]=b.pointSchemes[e]),b.lineSchemes&&(h.line[g]=b.lineSchemes[e]),b.polygonSchemes&&(h.polygon[g]=b.polygonSchemes[e])})();
f={getAvailableThemes:function(a){var b=[],c,e,d;for(c in n)e=n[c],d=r[c],a&&-1===t.indexOf(d.basemaps,a)||b.push({name:e.name,label:e.label,description:e.description,basemaps:d.basemaps.slice(0)});return b},getSchemes:function(a){var b=a.theme,c=a.basemap,e=y(a.geometryType);a=r[b];var d;(a=(a=a&&a[e])&&a[c])&&(d={primaryScheme:v(a.primary,e),secondarySchemes:t.map(a.secondary,function(a){return v(a,e)})});return d},cloneScheme:function(a){var b;a&&(b=p(a),b.marker&&(b.marker=p(b.marker)),b.background&&
(b.background=p(b.background)));return b}};w("extend-esri")&&u.setObject("styles.size",f,x);return f});