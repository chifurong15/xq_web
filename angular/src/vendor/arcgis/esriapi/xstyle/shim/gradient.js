//>>built
define("xstyle/shim/gradient",[],function(f){var e=/#(\w{6})/,g={"-webkit-":function(d,a,b,c){return"background-image: -webkit-gradient("+d.substring(0,6)+", left top, left bottom, from("+b+"), to("+c+"))"},"-moz-":function(d,a,b,c){return"background-image: -moz-"+d+"("+a+","+b+","+c+")"},"-o-":function(d,a,b,c){return"background-image: -o-"+d+"("+a+","+b+","+c+")"},"-ms-":function(d,a,b,c){b=b.match(e);c=c.match(e);if(b&&c)return"border-radius: 0px; filter: progid:DXImageTransform.Microsoft.gradient(startColorstr\x3d#FF"+
b[1]+",endColorstr\x3d#FF"+c[1]+",gradientType\x3d"+("left"==a?1:0)+");"}}[f.prefix];return{onFunction:function(d,a,b){a=a.match(/(\w+-gradient)\(([^\)]*)\)/);d=a[1];a=a[2].split(/,\s*/);return g(d,a[0],a[1],a[2])}}});