//>>built
define("dojox/charting/StoreSeries",["dojo/_base/array","dojo/_base/declare","dojo/_base/Deferred"],function(g,h,k){return h("dojox.charting.StoreSeries",null,{constructor:function(d,e,a){this.store=d;this.kwArgs=e;this.value=a?"function"==typeof a?a:"object"==typeof a?function(b){var c={},f;for(f in a)c[f]=b[a[f]];return c}:function(b){return b[a]}:function(b){return b.value};this.data=[];this._initialRendering=!0;this.fetch()},destroy:function(){this.observeHandle&&this.observeHandle.remove()},
setSeriesObject:function(d){this.series=d},fetch:function(d,e){function a(){b.data=g.map(b.objects,function(a){return b.value(a,b.store)});b._pushDataChanges()}var b=this;this.observeHandle&&this.observeHandle.remove();var c=this.store.query(d||this.kwArgs.query,e||this.kwArgs);k.when(c,function(c){b.objects=c;a()});c.observe&&(this.observeHandle=c.observe(a,!0))},_pushDataChanges:function(){this.series&&(this.series.chart.updateSeries(this.series.name,this,this._initialRendering),this._initialRendering=
!1,this.series.chart.delayedRender())}})});