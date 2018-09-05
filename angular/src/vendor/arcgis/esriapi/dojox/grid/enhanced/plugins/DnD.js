//>>built
define("dojox/grid/enhanced/plugins/DnD","dojo/_base/kernel dojo/_base/declare dojo/_base/connect dojo/_base/array dojo/_base/lang dojo/_base/html dojo/_base/json dojo/_base/window dojo/query dojo/keys dojo/dnd/Source dojo/dnd/Avatar ../_Plugin ../../EnhancedGrid dojo/dnd/Manager ./Selector ./Rearrange".split(" "),function(y,x,B,h,r,f,C,p,z,A,D,E,F,G,H){var I=function(a){a.sort(function(a,b){return a-b});for(var c=[[a[0]]],b=1,d=0;b<a.length;++b)a[b]==a[b-1]+1?c[d].push(a[b]):c[++d]=[a[b]];return c},
u=function(a){for(var c=a[0],b=1;b<a.length;++b)c=c.concat(a[b]);return c},J=x("dojox.grid.enhanced.plugins.GridDnDElement",null,{constructor:function(a){this.plugin=a;this.node=f.create("div");this._items={}},destroy:function(){this.plugin=null;f.destroy(this.node);this._items=this.node=null},createDnDNodes:function(a){this.destroyDnDNodes();var c=["grid/"+a.type+"s"],b=this.plugin.grid.id+"_dndItem";h.forEach(a.selected,function(a,g){var d=b+g;this._items[d]={type:c,data:a,dndPlugin:this.plugin};
this.node.appendChild(f.create("div",{id:d}))},this)},getDnDNodes:function(){return h.map(this.node.childNodes,function(a){return a})},destroyDnDNodes:function(){f.empty(this.node);this._items={}},getItem:function(a){return this._items[a]}}),K=x("dojox.grid.enhanced.plugins.GridDnDSource",D,{accept:["grid/cells","grid/rows","grid/cols"],constructor:function(a,c){this.grid=c.grid;this.dndElem=c.dndElem;this.dndPlugin=c.dnd;this.sourcePlugin=null},destroy:function(){this.inherited(arguments);this.sourcePlugin=
this.dndPlugin=this.dndElem=this.grid=null},getItem:function(a){return this.dndElem.getItem(a)},checkAcceptance:function(a,c){if(this!=a&&c[0]){var b=a.getItem(c[0].id);if(b.dndPlugin)for(var d=b.type,g=0;g<d.length;++g){if(d[g]in this.accept){if(this.dndPlugin._canAccept(b.dndPlugin))this.sourcePlugin=b.dndPlugin;else return!1;break}}else if("grid/rows"in this.accept){var e=[];h.forEach(c,function(b){b=a.getItem(b.id);if(b.data&&0<=h.indexOf(b.type,"grid/rows")){var c=b.data;"string"==typeof b.data&&
(c=C.fromJson(b.data));c&&e.push(c)}});if(e.length)this.sourcePlugin={_dndRegion:{type:"row",selected:[e]}};else return!1}}return this.inherited(arguments)},onDraggingOver:function(){this.dndPlugin.onDraggingOver(this.sourcePlugin)},onDraggingOut:function(){this.dndPlugin.onDraggingOut(this.sourcePlugin)},onDndDrop:function(a,c,b,d){this.onDndCancel();if(this!=a&&this==d)this.dndPlugin.onDragIn(this.sourcePlugin,b)}}),L=x("dojox.grid.enhanced.plugins.GridDnDAvatar",E,{construct:function(){this._itemType=
this.manager._dndPlugin._dndRegion.type;this._itemCount=this._getItemCount();this.isA11y=f.hasClass(p.body(),"dijit_a11y");var a=f.create("table",{border:"0",cellspacing:"0","class":"dojoxGridDndAvatar",style:{position:"absolute",zIndex:"1999",margin:"0px"}}),c=this.manager.source,b=f.create("tbody",null,a),b=f.create("tr",null,b),d=f.create("td",{"class":"dojoxGridDnDIcon"},b);this.isA11y&&f.create("span",{id:"a11yIcon",innerHTML:this.manager.copy?"+":"\x3c"},d);d=f.create("td",{"class":"dojoxGridDnDItemIcon "+
this._getGridDnDIconClass()},b);d=f.create("td",null,b);f.create("span",{"class":"dojoxGridDnDItemCount",innerHTML:c.generateText?this._generateText():""},d);f.style(b,{opacity:.9});this.node=a},_getItemCount:function(){var a=this.manager._dndPlugin._dndRegion.selected,c=0;switch(this._itemType){case "cell":var a=a[0],c=this.manager._dndPlugin.grid.layout.cells,b=a.max.col-a.min.col+1,d=a.max.row-a.min.row+1;if(1<b)for(var g=a.min.col;g<=a.max.col;++g)c[g].hidden&&--b;c=b*d;break;case "row":case "col":c=
u(a).length}return c},_getGridDnDIconClass:function(){return{row:["dojoxGridDnDIconRowSingle","dojoxGridDnDIconRowMulti"],col:["dojoxGridDnDIconColSingle","dojoxGridDnDIconColMulti"],cell:["dojoxGridDnDIconCellSingle","dojoxGridDnDIconCellMulti"]}[this._itemType][1==this._itemCount?0:1]},_generateText:function(){return"("+this._itemCount+")"}});y=x("dojox.grid.enhanced.plugins.DnD",F,{name:"dnd",_targetAnchorBorderWidth:2,_copyOnly:!1,_config:{row:{within:!0,"in":!0,out:!0},col:{within:!0,"in":!0,
out:!0},cell:{within:!0,"in":!0,out:!0}},constructor:function(a,c){this.grid=a;this._config=r.clone(this._config);c=r.isObject(c)?c:{};this.setupConfig(c.dndConfig);this._copyOnly=!!c.copyOnly;this._mixinGrid();this.selector=a.pluginMgr.getPlugin("selector");this.rearranger=a.pluginMgr.getPlugin("rearrange");this.rearranger.setArgs(c);this._clear();this._elem=new J(this);this._source=new K(this._elem.node,{grid:a,dndElem:this._elem,dnd:this});this._container=z(".dojoxGridMasterView",this.grid.domNode)[0];
this._initEvents()},destroy:function(){this.inherited(arguments);this._clear();this._source.destroy();this._elem.destroy();this._config=this.rearranger=this.selector=this.grid=this._container=null},_mixinGrid:function(){this.grid.setupDnDConfig=r.hitch(this,"setupConfig");this.grid.dndCopyOnly=r.hitch(this,"copyOnly")},setupConfig:function(a){if(a&&r.isObject(a)){var c=["row","col","cell"],b=["within","in","out"],d=this._config;h.forEach(c,function(c){if(c in a){var e=a[c];e&&r.isObject(e)?h.forEach(b,
function(a){a in e&&(d[c][a]=!!e[a])}):h.forEach(b,function(a){d[c][a]=!!e})}});h.forEach(b,function(b){if(b in a){var e=a[b];e&&r.isObject(e)?h.forEach(c,function(a){a in e&&(d[a][b]=!!e[a])}):h.forEach(c,function(a){d[a][b]=!!e})}})}},copyOnly:function(a){"undefined"!=typeof a&&(this._copyOnly=!!a);return this._copyOnly},_isOutOfGrid:function(a){var c=f.position(this.grid.domNode),b=a.clientX;a=a.clientY;return a<c.y||a>c.y+c.h||b<c.x||b>c.x+c.w},_onMouseMove:function(a){if(!this._dndRegion||this._dnding||
this._externalDnd){this._isMouseDown&&!this._dndRegion&&(delete this._isMouseDown,this._oldCursor=f.style(p.body(),"cursor"),f.style(p.body(),"cursor","not-allowed"));var c=this._isOutOfGrid(a);!this._alreadyOut&&c?(this._alreadyOut=!0,this._dnding&&this._destroyDnDUI(!0,!1),this._moveEvent=a,this._source.onOutEvent()):this._alreadyOut&&!c&&(this._alreadyOut=!1,this._dnding&&this._createDnDUI(a,!0),this._moveEvent=a,this._source.onOverEvent())}else this._dnding=!0,this._startDnd(a)},_onMouseUp:function(){if(!this._extDnding&&
!this._isSource){var a=this._dnding&&!this._alreadyOut;a&&this._config[this._dndRegion.type].within&&this._rearrange();this._endDnd(a)}f.style(p.body(),"cursor",this._oldCursor||"");delete this._isMouseDown},_initEvents:function(){var a=this.grid,c=this.selector;this.connect(p.doc,"onmousemove","_onMouseMove");this.connect(p.doc,"onmouseup","_onMouseUp");this.connect(a,"onCellMouseOver",function(a){this._dnding||c.isSelecting()||a.ctrlKey||(this._dndReady=c.isSelected("cell",a.rowIndex,a.cell.index),
c.selectEnabled(!this._dndReady))});this.connect(a,"onHeaderCellMouseOver",function(a){this._dndReady&&c.selectEnabled(!0)});this.connect(a,"onRowMouseOver",function(a){this._dndReady&&!a.cell&&c.selectEnabled(!0)});this.connect(a,"onCellMouseDown",function(a){!a.ctrlKey&&this._dndReady&&(this._dndRegion=this._getDnDRegion(a.rowIndex,a.cell.index),this._isMouseDown=!0)});this.connect(a,"onCellMouseUp",function(a){this._dndReady||c.isSelecting()||!a.cell||(this._dndReady=c.isSelected("cell",a.rowIndex,
a.cell.index),c.selectEnabled(!this._dndReady))});this.connect(a,"onCellClick",function(a){!this._dndReady||a.ctrlKey||a.shiftKey||c.select("cell",a.rowIndex,a.cell.index)});this.connect(a,"onEndAutoScroll",function(a,c,g,e,f){this._dnding&&this._markTargetAnchor(f)});this.connect(p.doc,"onkeydown",function(a){a.keyCode==A.ESCAPE?this._endDnd(!1):a.keyCode==A.CTRL&&(c.selectEnabled(!0),this._isCopy=!0)});this.connect(p.doc,"onkeyup",function(a){a.keyCode==A.CTRL&&(c.selectEnabled(!this._dndReady),
this._isCopy=!1)})},_clear:function(){this._moveEvent=this._target=this._dndRegion=null;this._targetAnchor={};this._extDnding=this._alreadyOut=this._isSource=this._externalDnd=this._dnding=!1},_getDnDRegion:function(a,c){var b=this.selector,d=b._selected,g=!!d.cell.length|!!d.row.length<<1|!!d.col.length<<2,e;switch(g){case 1:e="cell";if(!this._config[e].within&&!this._config[e].out)break;var f=this.grid.layout.cells,g=function(a){for(var b=0,c=a.min.col;c<=a.max.col;++c)f[c].hidden&&++b;return(a.max.row-
a.min.row+1)*(a.max.col-a.min.col+1-b)},k={max:{row:-1,col:-1},min:{row:Infinity,col:Infinity}};h.forEach(d[e],function(a){a.row<k.min.row&&(k.min.row=a.row);a.row>k.max.row&&(k.max.row=a.row);a.col<k.min.col&&(k.min.col=a.col);a.col>k.max.col&&(k.max.col=a.col)});if(h.some(d[e],function(b){return b.row==a&&b.col==c})&&g(k)==d[e].length&&h.every(d[e],function(a){return a.row>=k.min.row&&a.row<=k.max.row&&a.col>=k.min.col&&a.col<=k.max.col}))return{type:e,selected:[k],handle:{row:a,col:c}};break;case 2:case 4:if(e=
2==g?"row":"col",this._config[e].within||this._config[e].out)if(d=b.getSelected(e),d.length)return{type:e,selected:I(d),handle:2==g?a:c}}return null},_startDnd:function(a){this._createDnDUI(a)},_endDnd:function(a){this._destroyDnDUI(!1,a);this._clear()},_createDnDUI:function(a,c){var b=f.position(this.grid.views.views[0].domNode);f.style(this._container,"height",b.h+"px");try{c||this._createSource(a),this._createMoveable(a),this._oldCursor=f.style(p.body(),"cursor"),f.style(p.body(),"cursor","default")}catch(d){console.warn("DnD._createDnDUI() error:",
d)}},_destroyDnDUI:function(a,c){try{c&&this._destroySource(),this._unmarkTargetAnchor(),a||this._destroyMoveable(),f.style(p.body(),"cursor",this._oldCursor)}catch(b){console.warn("DnD._destroyDnDUI() error:",this.grid.id,b)}},_createSource:function(a){this._elem.createDnDNodes(this._dndRegion);var c=H.manager(),b=c.makeAvatar;c._dndPlugin=this;c.makeAvatar=function(){var a=new L(c);delete c._dndPlugin;return a};c.startDrag(this._source,this._elem.getDnDNodes(),a.ctrlKey);c.makeAvatar=b;c.onMouseMove(a)},
_destroySource:function(){B.publish("/dnd/cancel")},_createMoveable:function(a){this._markTagetAnchorHandler||(this._markTagetAnchorHandler=this.connect(p.doc,"onmousemove","_markTargetAnchor"))},_destroyMoveable:function(){this.disconnect(this._markTagetAnchorHandler);delete this._markTagetAnchorHandler},_calcColTargetAnchorPos:function(a,c){var b,d,g,e;e=a.clientX;var l=this.grid.layout.cells,k=f._isBodyLtr(),q=this._getVisibleHeaders();for(b=0;b<q.length;++b)if(d=f.position(q[b].node),k?(0===b||
e>=d.x)&&e<d.x+d.w:(0===b||e<d.x+d.w)&&e>=d.x){g=d.x+(k?0:d.w);break}else if(k?b===q.length-1&&e>=d.x+d.w:b===q.length-1&&e<d.x){++b;g=d.x+(k?d.w:0);break}if(b<q.length){if(e=q[b].cell.index,this.selector.isSelected("col",e)&&this.selector.isSelected("col",e-1))for(d=this._dndRegion.selected,b=0;b<d.length;++b)if(0<=h.indexOf(d[b],e)){e=d[b][0];d=f.position(l[e].getHeaderNode());g=d.x+(k?0:d.w);break}}else e=l.length;this._target=e;return g-c.x},_calcRowTargetAnchorPos:function(a,c){for(var b=this.grid,
d=0,g=b.layout.cells;g[d].hidden;)++d;var e=b.layout.cells[d],g=b.scroller.firstVisibleRow,d=e.getNode(g);if(!d)return this._target=-1,0;for(var l=f.position(d);l.y+l.h<a.clientY&&!(++g>=b.rowCount);)l=f.position(e.getNode(g));if(g<b.rowCount){if(this.selector.isSelected("row",g)&&this.selector.isSelected("row",g-1))for(b=this._dndRegion.selected,d=0;d<b.length;++d)if(0<=h.indexOf(b[d],g)){g=b[d][0];l=f.position(e.getNode(g));break}b=l.y}else b=l.y+l.h;this._target=g;return b-c.y},_calcCellTargetAnchorPos:function(a,
c,b){var d=this._dndRegion.selected[0],g=this._dndRegion.handle,e=this.grid,l=f._isBodyLtr(),k=e.layout.cells,q,m,h,p,r,u,t,v,n;m=g.col-d.min.col;h=d.max.col-g.col;var w;b.childNodes.length?(w=z(".dojoxGridCellBorderLeftTopDIV",b)[0],b=z(".dojoxGridCellBorderRightBottomDIV",b)[0]):(w=f.create("div",{"class":"dojoxGridCellBorderLeftTopDIV"},b),b=f.create("div",{"class":"dojoxGridCellBorderRightBottomDIV"},b));for(n=d.min.col+1;n<g.col;++n)k[n].hidden&&--m;for(n=g.col+1;n<d.max.col;++n)k[n].hidden&&
--h;p=this._getVisibleHeaders();for(n=m;n<p.length-h;++n)if(q=f.position(p[n].node),a.clientX>=q.x&&a.clientX<q.x+q.w||n==m&&(l?a.clientX<q.x:a.clientX>=q.x+q.w)||n==p.length-h-1&&(l?a.clientX>=q.x+q.w:a<q.x)){t=p[n-m];v=p[n+h];m=f.position(t.node);h=f.position(v.node);t=t.cell.index;v=v.cell.index;u=l?m.x:h.x;r=l?h.x+h.w-m.x:m.x+m.w-h.x;break}for(n=0;k[n].hidden;)++n;l=k[n];m=e.scroller.firstVisibleRow;for(h=f.position(l.getNode(m));h.y+h.h<a.clientY;)if(++m<e.rowCount)h=f.position(l.getNode(m));
else break;g=m>=g.row-d.min.row?m-g.row+d.min.row:0;a=g+d.max.row-d.min.row;a>=e.rowCount&&(a=e.rowCount-1,g=a-d.max.row+d.min.row);m=f.position(l.getNode(g));h=f.position(l.getNode(a));d=m.y;e=h.y+h.h-m.y;this._target={min:{row:g,col:t},max:{row:a,col:v}};l=(f.marginBox(w).w-f.contentBox(w).w)/2;t=f.position(k[t].getNode(g));f.style(w,{width:t.w-l+"px",height:t.h-l+"px"});k=f.position(k[v].getNode(a));f.style(b,{width:k.w-l+"px",height:k.h-l+"px"});return{h:e,w:r,l:u-c.x,t:d-c.y}},_markTargetAnchor:function(a){try{var c=
this._dndRegion.type;if(!(this._alreadyOut||this._dnding&&!this._config[c].within||this._extDnding&&!this._config[c]["in"])){var b,d,g,e,l=this._targetAnchor[c],k=f.position(this._container);l||(l=this._targetAnchor[c]=f.create("div",{"class":"cell"==c?"dojoxGridCellBorderDIV":"dojoxGridBorderDIV"}),f.style(l,"display","none"),this._container.appendChild(l));switch(c){case "col":b=k.h;d=this._targetAnchorBorderWidth;g=this._calcColTargetAnchorPos(a,k);e=0;break;case "row":b=this._targetAnchorBorderWidth;
d=k.w;g=0;e=this._calcRowTargetAnchorPos(a,k);break;case "cell":var h=this._calcCellTargetAnchorPos(a,k,l);b=h.h;d=h.w;g=h.l;e=h.t}"number"==typeof b&&"number"==typeof d&&"number"==typeof g&&"number"==typeof e?(f.style(l,{height:b+"px",width:d+"px",left:g+"px",top:e+"px"}),f.style(l,"display","")):this._target=null}}catch(m){console.warn("DnD._markTargetAnchor() error:",m)}},_unmarkTargetAnchor:function(){this._dndRegion&&this._targetAnchor[this._dndRegion.type]&&f.style(this._targetAnchor[this._dndRegion.type],
"display","none")},_getVisibleHeaders:function(){return h.map(h.filter(this.grid.layout.cells,function(a){return!a.hidden}),function(a){return{node:a.getHeaderNode(),cell:a}})},_rearrange:function(){if(null!==this._target){var a=this._dndRegion.type,c=this._dndRegion.selected;if("cell"===a)this.rearranger[this._isCopy||this._copyOnly?"copyCells":"moveCells"](c[0],-1===this._target?null:this._target);else this.rearranger["col"==a?"moveColumns":"moveRows"](u(c),-1===this._target?null:this._target);
this._target=null}},onDraggingOver:function(a){!this._dnding&&a&&(this._extDnding=a._isSource=!0,this._externalDnd||(this._externalDnd=!0,this._dndRegion=this._mapRegion(a.grid,a._dndRegion)),this._createDnDUI(this._moveEvent,!0),this.grid.pluginMgr.getPlugin("autoScroll").readyForAutoScroll=!0)},_mapRegion:function(a,c){if("cell"===c.type){var b=c.selected[0],d=this.grid.layout.cells,g=a.layout.cells,e,f=0;for(e=b.min.col;e<=b.max.col;++e)g[e].hidden||++f;for(e=0;0<f;++e)d[e].hidden||--f;var k=r.clone(c);
k.selected[0].min.col=0;k.selected[0].max.col=e-1;for(e=b.min.col;e<=c.handle.col;++e)g[e].hidden||++f;for(e=0;0<f;++e)d[e].hidden||--f;k.handle.col=e}return c},onDraggingOut:function(a){this._externalDnd&&(this._extDnding=!1,this._destroyDnDUI(!0,!1),a&&(a._isSource=!1))},onDragIn:function(a,c){var b=!1;if(null!==this._target){b=a._dndRegion.selected;switch(a._dndRegion.type){case "cell":this.rearranger.changeCells(a.grid,b[0],this._target);break;case "row":b=u(b),this.rearranger.insertRows(a.grid,
b,this._target)}b=!0}this._endDnd(!0);if(a.onDragOut)a.onDragOut(b&&!c)},onDragOut:function(a){if(a&&!this._copyOnly)switch(a=this._dndRegion.selected,this._dndRegion.type){case "cell":this.rearranger.clearCells(a[0]);break;case "row":this.rearranger.removeRows(u(a))}this._endDnd(!0)},_canAccept:function(a){if(!a)return!1;var c=a._dndRegion,b=c.type;if(!this._config[b]["in"]||!a._config[b].out)return!1;var d=this.grid,g=c.selected,c=h.filter(d.layout.cells,function(a){return!a.hidden}).length,e=d.rowCount,
f=!0;switch(b){case "cell":g=g[0],f=d.store.getFeatures()["dojo.data.api.Write"]&&g.max.row-g.min.row<=e&&h.filter(a.grid.layout.cells,function(a){return a.index>=g.min.col&&a.index<=g.max.col&&!a.hidden}).length<=c;case "row":if(a._allDnDItemsLoaded())return f}return!1},_allDnDItemsLoaded:function(){if(this._dndRegion){var a=this._dndRegion.selected,c=[];switch(this._dndRegion.type){case "cell":for(var b=a[0].min.row,a=a[0].max.row;b<=a;++b)c.push(b);break;case "row":c=u(a);break;default:return!1}var d=
this.grid._by_idx;return h.every(c,function(a){return!!d[a]})}return!1}});G.registerPlugin(y,{dependency:["selector","rearrange"]});return y});