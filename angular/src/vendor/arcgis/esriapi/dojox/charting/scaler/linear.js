//>>built
define("dojox/charting/scaler/linear",["dojo/_base/lang","./common"],function(q,r){function n(b,d){b=b.toLowerCase();for(var a=d.length-1;0<=a;--a)if(b===d[a])return!0;return!1}var v=q.getObject("dojox.charting.scaler.linear",!0),p=r.getNumericLabel,m=function(b,d,a,c,e,g,f){a=q.delegate(a);c||("major"==a.fixUpper&&(a.fixUpper="minor"),"major"==a.fixLower&&(a.fixLower="minor"));e||("minor"==a.fixUpper&&(a.fixUpper="micro"),"minor"==a.fixLower&&(a.fixLower="micro"));g||("micro"==a.fixUpper&&(a.fixUpper=
"none"),"micro"==a.fixLower&&(a.fixLower="none"));var k=n(a.fixLower,["major"])?Math.floor(a.min/c)*c:n(a.fixLower,["minor"])?Math.floor(a.min/e)*e:n(a.fixLower,["micro"])?Math.floor(a.min/g)*g:a.min,l=n(a.fixUpper,["major"])?Math.ceil(a.max/c)*c:n(a.fixUpper,["minor"])?Math.ceil(a.max/e)*e:n(a.fixUpper,["micro"])?Math.ceil(a.max/g)*g:a.max;a.useMin&&(b=k);a.useMax&&(d=l);var h=!c||a.useMin&&n(a.fixLower,["major"])?b:Math.ceil(b/c)*c,m=!e||a.useMin&&n(a.fixLower,["major","minor"])?b:Math.ceil(b/e)*
e,t=!g||a.useMin&&n(a.fixLower,["major","minor","micro"])?b:Math.ceil(b/g)*g,p=c?(a.useMax&&n(a.fixUpper,["major"])?Math.round((d-h)/c):Math.floor((d-h)/c))+1:0,r=e?(a.useMax&&n(a.fixUpper,["major","minor"])?Math.round((d-m)/e):Math.floor((d-m)/e))+1:0;a=g?(a.useMax&&n(a.fixUpper,["major","minor","micro"])?Math.round((d-t)/g):Math.floor((d-t)/g))+1:0;var w=e?Math.round(c/e):0,x=g?Math.round(e/g):0,y=c?Math.floor(Math.log(c)/Math.LN10):0,z=e?Math.floor(Math.log(e)/Math.LN10):0,u=f/(d-b);isFinite(u)||
(u=1);return{bounds:{lower:k,upper:l,from:b,to:d,scale:u,span:f},major:{tick:c,start:h,count:p,prec:y},minor:{tick:e,start:m,count:r,prec:z},micro:{tick:g,start:t,count:a,prec:0},minorPerMajor:w,microPerMinor:x,scaler:v}};return q.mixin(v,{buildScaler:function(b,d,a,c,e,g){var f={fixUpper:"none",fixLower:"none",natural:!1};c&&("fixUpper"in c&&(f.fixUpper=String(c.fixUpper)),"fixLower"in c&&(f.fixLower=String(c.fixLower)),"natural"in c&&(f.natural=!!c.natural));g=!g||3>g?3:g;"min"in c&&(b=c.min);"max"in
c&&(d=c.max);c.includeZero&&(0<b&&(b=0),0>d&&(d=0));f.min=b;f.useMin=!0;f.max=d;f.useMax=!0;"from"in c&&(b=c.from,f.useMin=!1);"to"in c&&(d=c.to,f.useMax=!1);if(d<=b)return m(b,d,f,0,0,0,a);e||(e=d-b);e=Math.floor(Math.log(e)/Math.LN10);e=c&&"majorTickStep"in c?c.majorTickStep:Math.pow(10,e);var k=0,l=0,h;if(c&&"minorTickStep"in c)k=c.minorTickStep;else{do{k=e/10;if(!f.natural||.9<k)if(h=m(b,d,f,e,k,0,a),h.bounds.scale*h.minor.tick>g)break;k=e/5;if(!f.natural||.9<k)if(h=m(b,d,f,e,k,0,a),h.bounds.scale*
h.minor.tick>g)break;k=e/2;if(!f.natural||.9<k)if(h=m(b,d,f,e,k,0,a),h.bounds.scale*h.minor.tick>g)break;return m(b,d,f,e,0,0,a)}while(0)}if(c&&"microTickStep"in c)l=c.microTickStep,h=m(b,d,f,e,k,l,a);else{do{l=k/10;if(!f.natural||.9<l)if(h=m(b,d,f,e,k,l,a),3<h.bounds.scale*h.micro.tick)break;l=k/5;if(!f.natural||.9<l)if(h=m(b,d,f,e,k,l,a),3<h.bounds.scale*h.micro.tick)break;l=k/2;if(!f.natural||.9<l)if(h=m(b,d,f,e,k,l,a),3<h.bounds.scale*h.micro.tick)break;l=0}while(0)}return l?h:m(b,d,f,e,k,0,a)},
buildTicks:function(b,d){var a,c,e,g=b.major.start,f=b.minor.start,k=b.micro.start;if(d.microTicks&&b.micro.tick)a=b.micro.tick,c=k;else if(d.minorTicks&&b.minor.tick)a=b.minor.tick,c=f;else if(b.major.tick)a=b.major.tick,c=g;else return null;var l=1/b.bounds.scale;if(b.bounds.to<=b.bounds.from||isNaN(l)||!isFinite(l)||0>=a||isNaN(a)||!isFinite(a))return null;for(var h=[],m=[],n=[];c<=b.bounds.to+l;)Math.abs(g-c)<a/2?(e={value:g},d.majorLabels&&(e.label=p(g,b.major.prec,d)),h.push(e),g+=b.major.tick,
f+=b.minor.tick):Math.abs(f-c)<a/2?(d.minorTicks&&(e={value:f},d.minorLabels&&b.minMinorStep<=b.minor.tick*b.bounds.scale&&(e.label=p(f,b.minor.prec,d)),m.push(e)),f+=b.minor.tick):d.microTicks&&n.push({value:k}),k+=b.micro.tick,c+=a;return{major:h,minor:m,micro:n}},getTransformerFromModel:function(b){var d=b.bounds.from,a=b.bounds.scale;return function(b){return(b-d)*a}},getTransformerFromPlot:function(b){var d=b.bounds.from,a=b.bounds.scale;return function(b){return b/a+d}}})});