//>>built
define("xstyle/shim/transition",["../main"],function(w){function x(a){if("className"==a.propertyName){a=a.srcElement;var b=a._transitions,d=a._previousStyle,c=a.runtimeStyle,y=a.currentStyle,e;for(e in d){var g=c[e];b||(a._transitions=b={});var f=d[e],m=y[e];c[e]=g;if(f!=m&&(f||g)){var h=k(m);if(h.units){var n=k(g),n=q(h,n),r=k(f),t=q(h,r);if(t&&n&&r.units==h.units){if(h=b[e])h.at=1;var u=u||(p=(new Date).getTime()),h=b[e]={from:f||g,element:a,to:m,startTime:u,duration:a._transitionDuration*n/t,timing:z[a._transitionTiming||
"ease"],property:e,t:0};v(h)||l.push(h);d[e]=m}}}}}}function k(a){var b=a.match(A);if(b)for(a=b[1].split(","),b=0;4>b;b++)a[0]=+(a[0]||0);else{if(b=a.match(B)){b=b[1];a=[];var d=3==b.length;a[0]=parseInt(b[0]+b[d?0:1],16);a[1]=parseInt(b[d?1:2]+b[d?1:3],16);a[2]=parseInt(b[d?2:4]+b[d?2:5],16);a.units="rgb";return a}return(b=a.match(C))?(a=[b[1]],a.units=b[2],a):[]}a.units="rgb";return a}function q(a,b){for(var d=0,c=0;c<a.length;c++)d+=Math.abs((b[c]||0)-(a[c]||0));return d}function v(a){runtimeStyle=
a.element.runtimeStyle;if(1<=(a.t=(p-a.startTime)/1E3/a.duration))return runtimeStyle[a.property]="",!0;var b=runtimeStyle,d=a.property,c;c=k(a.from);var f=k(a.to);a=a.timing(a.t);for(var e=[],g=0;g<c.length;g++)e[g]=f[g]*a-c[g]*(a-1);c="rgb"==c.units?"#"+e[0].toString(16)+e[1].toString(16)+e[2].toString(16)+e[3].toString(16):e[0]+c.units;b[d]=c}function f(a,b,d,c){var f=(b+.01)/(a+.01)/3,e=1-(1.01-c)/(1.01-d)/3;return function(a){return 3*(1-a)*(1-a)*a*f+3*(1-a)*a*a*e+a*a*a}}var l=[],A=/^rgba?\(([0-9,]+)\)/i,
B=/#([0-9a-f]+)/i,C=/([-0-9\.]+)([\w]+)/,l=[],p=(new Date).getTime();setInterval(function(){p=(new Date).getTime();for(var a=0,b=l.length;a<b;a++)v(l[a])&&(l.splice(a--,1),b--)},30);var z={ease:f(.25,.1,.25,1),linear:f(0,0,1,1),"ease-in":f(.42,0,1,1),"ease-out":f(0,0,.58,1),"ease-in-out":f(.42,0,.58,1)};return{onProperty:function(a,b,d){return w.addRenderer(a,b,d,function(c){var d=c.currentStyle,e=c._previousStyle={};"transition-duration"==a&&(c._transitionDuration=parseFloat(b));for(var f in d)e[f]=
d[f];c.attachEvent("onpropertychange",x)})}}});