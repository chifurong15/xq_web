//>>built
define("dojox/dtl/filter/lists",["dojo/_base/lang","../_base"],function(g,k){var h=g.getObject("filter.lists",!0,k);g.mixin(h,{_dictsort:function(a,c){return a[0]==c[0]?0:a[0]<c[0]?-1:1},dictsort:function(a,c){if(!c)return a;var d,b,e=[];if(!g.isArray(a))for(b in d=a,a=[],d)a.push(d[b]);for(d=0;d<a.length;d++)e.push([(new dojox.dtl._Filter("var."+c)).resolve(new dojox.dtl._Context({"var":a[d]})),a[d]]);e.sort(dojox.dtl.filter.lists._dictsort);var f=[];for(d=0;b=e[d];d++)f.push(b[1]);return f},dictsortreversed:function(a,
c){return c?dojox.dtl.filter.lists.dictsort(a,c).reverse():a},first:function(a){return a.length?a[0]:""},join:function(a,c){return a.join(c||",")},length:function(a){return isNaN(a.length)?(a+"").length:a.length},length_is:function(a,c){return a.length==parseInt(c)},random:function(a){return a[Math.floor(Math.random()*a.length)]},slice:function(a,c){for(var d=(c||"").split(":"),b=[],e=0;e<d.length;e++)d[e].length?b.push(parseInt(d[e])):b.push(null);null===b[0]&&(b[0]=0);0>b[0]&&(b[0]=a.length+b[0]);
if(2>b.length||null===b[1])b[1]=a.length;0>b[1]&&(b[1]=a.length+b[1]);return a.slice(b[0],b[1])},_unordered_list:function(a,c){var d=dojox.dtl.filter.lists,b,e="";for(b=0;b<c;b++)e+="\t";if(a[1]&&a[1].length){var f=[];for(b=0;b<a[1].length;b++)f.push(d._unordered_list(a[1][b],c+1));return e+"\x3cli\x3e"+a[0]+"\n"+e+"\x3cul\x3e\n"+f.join("\n")+"\n"+e+"\x3c/ul\x3e\n"+e+"\x3c/li\x3e"}return e+"\x3cli\x3e"+a[0]+"\x3c/li\x3e"},unordered_list:function(a){return h._unordered_list(a,1)}});return h});