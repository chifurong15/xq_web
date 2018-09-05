//>>built
define("dojox/charting/Theme","dojo/_base/lang dojo/_base/declare dojo/_base/Color ./SimpleTheme dojox/color/_base dojox/color/Palette dojox/gfx/gradutils".split(" "),function(h,m,k,e,f,n){var c=m("dojox.charting.Theme",e,{});h.mixin(c,{defineColors:function(a){a=a||{};var l,b=[],c=a.num||5;if(a.colors){l=a.colors.length;for(var d=0;d<c;d++)b.push(a.colors[d%l]);return b}return a.hue?n.generate(f.fromHsv(a.hue,a.saturation||100,((a.high||90)+(a.low||30))/2),"monochromatic").colors:a.generator?f.Palette.generate(a.base,
a.generator).colors:b},generateGradient:function(a,c,b){a=h.delegate(a);a.colors=[{offset:0,color:c},{offset:1,color:b}];return a},generateHslColor:function(a,c){a=new k(a);var b=a.toHsl(),b=f.fromHsl(b.h,b.s,c);b.a=a.a;return b},generateHslGradient:function(a,e,b,g){a=new k(a);var d=a.toHsl();b=f.fromHsl(d.h,d.s,b);g=f.fromHsl(d.h,d.s,g);b.a=g.a=a.a;return c.generateGradient(e,b,g)}});c.defaultMarkers=e.defaultMarkers;c.defaultColors=e.defaultColors;c.defaultTheme=e.defaultTheme;return c});