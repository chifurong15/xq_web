//>>built
define("dgrid/extensions/ColumnReorder","dojo/_base/lang dojo/_base/declare dojo/_base/array dojo/on dojo/query dojo/dnd/Source put-selector/put xstyle/css!../css/extensions/ColumnReorder.css".split(" "),function(h,d,g,l,u,m,n){function p(c,a){var b=a[2],e=c[b?"columnSets":"subRows"][a[1]];return b?e[a[2]]:e}function k(c,a,b){a[2]?c.columnSets[a[1]][a[2]]=b:c.subRows[a[1]]=b}function q(c,a){return a.slice(("dgrid-"+c+"-").length)}var r=/(\d+)(?:-(\d+))?$/;h=d(m,{copyState:function(){return!1},checkAcceptance:function(c,
a){return c==this},_legalMouseDown:function(c){return-1<c.target.className.indexOf("dgrid-resize-handle")?!1:this.inherited(arguments)},onDropInternal:function(c){var a=this.grid,b=r.exec(q(a.id,c[0].getAttribute("dndType"))),e=b[2]?"columnSets":"subRows",t=p(a,b),f=a.columns;this.inherited(arguments);b&&setTimeout(function(){var d=g.map(c[0].parentNode.childNodes,function(a){return f[a.columnId]});k(a,b,d);d={grid:a,subRow:d,column:f[c[0].columnId],bubbles:!0,cancelable:!0,parentType:"dnd"};d[e]=
a[e];l.emit(a.domNode,"dgrid-columnreorder",d)?a.set(e,a[e]):(k(a,b,t),a.renderHeader(),this._sort&&this._sort.length&&this.updateSortArrow(this._sort))},0)}});d=d("dgrid.extensions.ColumnReorder",null,{columnDndConstructor:h,_initSubRowDnd:function(c,a){var b,e,d,f;e=0;for(d=c.length;e<d;e++)f=c[e],!1!==f.reorderable&&(f=f.headerNode,"TH"!=f.tagName&&(f=f.parentNode),n(f,".dojoDndItem[dndType\x3d"+a+"]"),b||(b=f.parentNode));b&&this._columnDndSources.push(new this.columnDndConstructor(b,{horizontal:!0,
grid:this}))},renderHeader:function(){var c="dgrid-"+this.id+"-",a,b;this.inherited(arguments);this._columnDndSources=[];if(this.columnSets)for(b=0,a=this.columnSets.length;b<a;b++)g.forEach(this.columnSets[b],function(a,d){this._initSubRowDnd(a,c+b+"-"+d)},this);else g.forEach(this.subRows,function(a,b){this._initSubRowDnd(a,c+b)},this)},_destroyColumns:function(){this._columnDndSources&&g.forEach(this._columnDndSources,function(c){c.destroy()});this.inherited(arguments)}});d.ColumnDndSource=h;return d});