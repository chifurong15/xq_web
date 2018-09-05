//>>built
define("dojox/charting/action2d/_IndicatorElement","dojo/_base/lang dojo/_base/array dojo/_base/declare ../plot2d/Indicator dojo/has ../plot2d/common ../axis2d/common dojox/gfx".split(" "),function(p,x,l,y,w){var v=function(b,a,c){var e,d=b?{x:a[0],y:c[0][0]}:{x:c[0][0],y:a[0]};1<a.length&&(e=b?{x:a[1],y:c[1][0]}:{x:c[1][0],y:a[1]});return[d,e]};l=l("dojox.charting.action2d._IndicatorElement",y,{constructor:function(b,a){a||(a={});this.inter=a.inter},_updateVisibility:function(b,a,c){var e="x"==c?
this._hAxis:this._vAxis,d=e.getWindowScale();this.chart.setAxisWindow(e.name,d,e.getWindowOffset()+(b[c]-a[c])/d);this._noDirty=!0;this.chart.render();this._noDirty=!1;this._initTrack()},_trackMove:function(){this._updateIndicator(this.pageCoord);this._tracker=setTimeout(p.hitch(this,this._trackMove),100)},_initTrack:function(){this._tracker||(this._tracker=setTimeout(p.hitch(this,this._trackMove),500))},stopTrack:function(){this._tracker&&(clearTimeout(this._tracker),this._tracker=null)},render:function(){if(this.isDirty()){var b=
this.inter,a=b.plot,c=b.opt.vertical;this.opt.offset=b.opt.offset||(c?{x:0,y:5}:{x:5,y:0});b.opt.labelFunc&&(this.opt.labelFunc=function(a,d,g,f,h){a=v(c,d,g);return b.opt.labelFunc(a[0],a[1],f,h)});b.opt.fillFunc&&(this.opt.fillFunc=function(a,d,g){a=v(c,d,g);return b.opt.fillFunc(a[0],a[1])});this.opt=p.delegate(b.opt,this.opt);this.pageCoord?(this.opt.values=[],this.opt.labels=this.secondCoord?"trend":"markers"):(this.opt.values=null,this.inter.onChange({}));this.hAxis=a.hAxis;this.vAxis=a.vAxis;
this.inherited(arguments)}},_updateIndicator:function(){var b=this._updateCoordinates(this.pageCoord,this.secondCoord);if(1<b.length){var a=this.opt.vertical;this._data=[];this.opt.values=[];x.forEach(b,function(b){b&&(this.opt.values.push(a?b.x:b.y),this._data.push([a?b.y:b.x]))},this);this.inherited(arguments)}else this.inter.onChange({})},_renderText:function(b,a,c,e,d,g,f,h){this.inter.opt.labels&&this.inherited(arguments);var k=v(this.opt.vertical,f,h);this.inter.onChange({start:k[0],end:k[1],
label:a})},_updateCoordinates:function(b,a){w("dojo-bidi")&&this._checkXCoords(b,a);var c=this.inter,e=c.plot,d=c.opt.vertical,g=this.chart.getAxis(e.hAxis),f=this.chart.getAxis(e.vAxis),h=g.name,k=f.name,l=g.getScaler().bounds,p=f.getScaler().bounds,f=d?"x":"y",g=d?h:k,t=d?l:p;if(a){var m;d?b.x>a.x&&(m=a,a=b,b=m):b.y>a.y&&(m=a,a=b,b=m)}var r=e.toData(b),n;a&&(n=e.toData(a));var q={};q[h]=l.from;q[k]=p.from;m=e.toPage(q);q[h]=l.to;q[k]=p.to;h=e.toPage(q);if(r[g]<t.from){if(n||!c.opt.autoScroll||c.opt.mouseOver){if(c.opt.mouseOver)return[];
b[f]=m[f]}else return this._updateVisibility(b,m,f),[];r=e.toData(b)}else if(r[g]>t.to){if(n||!c.opt.autoScroll||c.opt.mouseOver){if(c.opt.mouseOver)return[];b[f]=h[f]}else return this._updateVisibility(b,h,f),[];r=e.toData(b)}var c=this._snapData(r,f,d),u;if(null==c.y)return[];a&&(n[g]<t.from?(a[f]=m[f],n=e.toData(a)):n[g]>t.to&&(a[f]=h[f],n=e.toData(a)),u=this._snapData(n,f,d),null==u.y&&(u=null));return[c,u]},_snapData:function(b,a,c){var e=this.chart.getSeries(this.inter.opt.series).data,d,g,
f=e.length;for(d=0;d<f;++d)if(g=e[d],null!=g)if("number"==typeof g){if(d+1>b[a])break}else if(g[a]>b[a])break;var h,k;"number"==typeof g?(f=d+1,0<d&&(h=d,k=e[d-1])):(f=g.x,g=g.y,0<d&&(h=e[d-1].x,k=e[d-1].y));0<d&&b[a]<=(c?(f+h)/2:(g+k)/2)&&(f=h,g=k);return{x:f,y:g}},cleanGroup:function(b){this.inherited(arguments);this.group.moveToFront();return this},isDirty:function(){return!this._noDirty&&(this.dirty||this.inter.plot.isDirty())}});w("dojo-bidi")&&l.extend({_checkXCoords:function(b,a){if(this.chart.isRightToLeft()&&
this.isDirty()){var c=function(a,b){return a.chart.dim.width+(a.chart.offsets.l-a.chart.offsets.r)-(b.x-e)+e},e=this.chart.node.offsetLeft;b&&(b.x=c(this,b));a&&(a.x=c(this,a))}}});return l});