//>>built
define("dojox/fx/Timeline","dojo/_base/lang dojo/fx/easing dojo/_base/fx dojo/dom ./_base dojo/_base/connect dojo/_base/html dojo/_base/array dojo/_base/Color".split(" "),function(r,l,t,u,n,q,v,w,p){n.animateTimeline=function(e,f){var c=new m(e.keys),d=t.animateProperty({node:u.byId(f||e.node),duration:e.duration||1E3,properties:c._properties,easing:l.linear,onAnimate:function(c){}});q.connect(d,"onEnd",function(c){var b=d.curve.getValue(d.reversed?0:1);v.style(c,b)});q.connect(d,"beforeBegin",function(){d.curve&&
delete d.curve;d.curve=c;c.ani=d});return d};var m=function(e){this.keys=r.isArray(e)?this.flatten(e):e};m.prototype.flatten=function(e){var f={},c={};w.forEach(e,function(d,h){var b;b=d.step;b="from"==b?0:"to"==b?1:void 0===b?0==h?0:h/(e.length-1):.01*parseInt(b,10);var g=l[d.ease]||l.linear,a;for(a in d)"step"!=a&&"ease"!=a&&"from"!=a&&"to"!=a&&(c[a]||(c[a]={steps:[],values:[],eases:[],ease:g},f[a]={},/#/.test(d[a])?f[a].units=c[a].units="isColor":f[a].units=c[a].units=/\D{1,}/.exec(d[a]).join("")),
c[a].eases.push(l[d.ease||"linear"]),c[a].steps.push(b),"isColor"==f[a].units?c[a].values.push(new p(d[a])):c[a].values.push(parseInt(/\d{1,}/.exec(d[a]).join(""))),void 0===f[a].start?f[a].start=c[a].values[c[a].values.length-1]:f[a].end=c[a].values[c[a].values.length-1])});this._properties=f;return c};m.prototype.getValue=function(e){e=this.ani._reversed?1-e:e;var f={},c=this,d=function(a,b){return"isColor"!=c._properties[a].units?c.keys[a].values[b]+c._properties[a].units:c.keys[a].values[b].toCss()},
h;for(h in this.keys)for(var b=this.keys[h],g=0;g<b.steps.length;g++){var a=b.steps[g],l=b.steps[g+1],k=g<b.steps.length?!0:!1,m=b.eases[g]||function(a){return a};if(e==a){if(f[h]=d(h,g),!k||k&&this.ani._reversed)break}else if(e>a)if(k&&e<b.steps[g+1]){k=b.values[g+1];b=b.values[g];a=1/(l-a)*(e-a);a=m(a);f[h]=b instanceof p?p.blendColors(b,k,a).toCss(!1):b+a*(k-b)+this._properties[h].units;break}else f[h]=d(h,g);else if(k&&!this.ani._reversed||!k&&this.ani._reversed)f[h]=d(h,g)}return f};n._Timeline=
m;return n});