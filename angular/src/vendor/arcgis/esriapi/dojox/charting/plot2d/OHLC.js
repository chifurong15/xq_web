//>>built
define("dojox/charting/plot2d/OHLC","dojo/_base/lang dojo/_base/array dojo/_base/declare dojo/has ./CartesianBase ./_PlotEvents ./common dojox/lang/functional dojox/lang/functional/reversed dojox/lang/utils dojox/gfx/fx".split(" "),function(q,D,x,H,y,z,E,I,J,t,K){var L=J.lambda("item.purgeGroup()");return x("dojox.charting.plot2d.OHLC",[y,z],{defaultParams:{gap:2,animate:null},optionalParams:{minBarSize:1,maxBarSize:1,stroke:{},outline:{},shadow:{},fill:{},font:"",fontColor:""},constructor:function(a,
b){this.opt=q.clone(this.defaultParams);t.updateWithObject(this.opt,b);t.updateWithPattern(this.opt,b,this.optionalParams);this.animate=this.opt.animate},collectStats:function(a){for(var b=q.delegate(E.defaultStats),g=0;g<a.length;g++){var d=a[g];if(d.data.length){var c=b.vmin,u=b.vmax;"ymin"in d&&"ymax"in d||D.forEach(d.data,function(a,c){if(!this.isNullValue(a)){var d=a.x||c+1;b.hmin=Math.min(b.hmin,d);b.hmax=Math.max(b.hmax,d);b.vmin=Math.min(b.vmin,a.open,a.close,a.high,a.low);b.vmax=Math.max(b.vmax,
a.open,a.close,a.high,a.low)}},this);"ymin"in d&&(b.vmin=Math.min(c,d.ymin));"ymax"in d&&(b.vmax=Math.max(u,d.ymax))}}return b},getSeriesStats:function(){var a=this.collectStats(this.series);a.hmin-=.5;a.hmax+=.5;return a},render:function(a,b){if(this.zoom&&!this.isDataDirty())return this.performZoom(a,b);this.resetEvents();if(this.dirty=this.isDirty()){D.forEach(this.series,L);this._eventSeries={};this.cleanGroup();var g=this.getGroup();I.forEachRev(this.series,function(a){a.cleanGroup(g)})}var d=
this.chart.theme,c,u,q=this._hScaler.scaler.getTransformerFromModel(this._hScaler),v=this._vScaler.scaler.getTransformerFromModel(this._vScaler),t=this.events();c=E.calculateBarSize(this._hScaler.bounds.scale,this.opt);u=c.gap;c=c.size;for(var A=0;A<this.series.length;A++){var e=this.series[A];if(this.dirty||e.dirty){e.cleanGroup();for(var x=d.next("candlestick",[this.opt,e]),g=e.group,F=Array(e.data.length),n=0;n<e.data.length;++n){var f=e.data[n];if(!this.isNullValue(f)){var m=d.addMixin(x,"candlestick",
f,!0),G=q(f.x||n+.5)+b.l+u,l=a.height-b.b,h=v(f.open),k=v(f.close),r=v(f.high),p=v(f.low);if(p>r)var B=r,r=p,p=B;if(1<=c){var B={x1:c/2,x2:c/2,y1:l-r,y2:l-p},y={x1:0,x2:c/2+(m.series.stroke?m.series.stroke.width||1:1)/2,y1:l-h,y2:l-h},z={x1:c/2-(m.series.stroke?m.series.stroke.width||1:1)/2,x2:c,y1:l-k,y2:l-k},C=g.createGroup();C.setTransform({dx:G,dy:0});var w=C.createGroup();w.createLine(B).setStroke(m.series.stroke);w.createLine(y).setStroke(m.series.stroke);w.createLine(z).setStroke(m.series.stroke);
e.dyn.stroke=m.series.stroke;t&&(f={element:"candlestick",index:n,run:e,shape:w,x:G,y:l-Math.max(h,k),cx:c/2,cy:l-Math.max(h,k)+Math.max(h>k?h-k:k-h,1)/2,width:c,height:Math.max(h>k?h-k:k-h,1),data:f},this._connectEvents(f),F[n]=f)}this.animate&&this._animateOHLC(C,l-p,r-p)}}this._eventSeries[e.name]=F;e.dirty=!1}else d.skip(),this._reconnectEvents(e.name)}this.dirty=!1;H("dojo-bidi")&&this._checkOrientation(this.group,a,b);return this},_animateOHLC:function(a,b,g){K.animateTransform(q.delegate({shape:a,
duration:1200,transform:[{name:"translate",start:[0,b-b/g],end:[0,0]},{name:"scale",start:[1,1/g],end:[1,1]},{name:"original"}]},this.animate)).play()}})});