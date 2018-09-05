//>>built
define("dojox/mobile/app/List",["dojo","dijit","dojox","dojo/require!dojo/string,dijit/_WidgetBase"],function(c,l,k){c.provide("dojox.mobile.app.List");c.experimental("dojox.mobile.app.List");c.require("dojo.string");c.require("dijit._WidgetBase");(function(){var g={};c.declare("dojox.mobile.app.List",l._WidgetBase,{items:null,itemTemplate:"",emptyTemplate:"",dividerTemplate:"",dividerFunction:null,labelDelete:"Delete",labelCancel:"Cancel",controller:null,autoDelete:!0,enableDelete:!0,enableHold:!0,
formatters:null,_templateLoadCount:0,_mouseDownPos:null,baseClass:"list",constructor:function(){this._checkLoadComplete=c.hitch(this,this._checkLoadComplete);this._replaceToken=c.hitch(this,this._replaceToken);this._postDeleteAnim=c.hitch(this,this._postDeleteAnim)},postCreate:function(){var a=this;this.emptyTemplate&&this._templateLoadCount++;this.itemTemplate&&this._templateLoadCount++;this.dividerTemplate&&this._templateLoadCount++;this.connect(this.domNode,"onmousedown",function(b){var c=b;b.targetTouches&&
0<b.targetTouches.length&&(c=b.targetTouches[0]);var f=a._getRowNode(b.target);f&&(a._setDataInfo(f,b),a._selectRow(f),a._mouseDownPos={x:c.pageX,y:c.pageY},a._dragThreshold=null)});this.connect(this.domNode,"onmouseup",function(b){b.targetTouches&&0<b.targetTouches.length&&(b=b.targetTouches[0]);var c=a._getRowNode(b.target);if(c){a._setDataInfo(c,b);if(a._selectedRow)a.onSelect(c._data,c._idx,c);this._deselectRow()}});this.enableDelete&&this.connect(this.domNode,"mousemove",function(b){c.stopEvent(b);
if(a._selectedRow){var e=a._getRowNode(b.target);a.enableDelete&&e&&!a._deleting&&a.handleDrag(b)}});this.connect(this.domNode,"onclick",function(b){b.touches&&0<b.touches.length&&(b=b.touches[0]);var c=a._getRowNode(b.target,!0);c&&a._setDataInfo(c,b)});this.connect(this.domNode,"mouseout",function(b){b.touches&&0<b.touches.length&&(b=b.touches[0]);b.target==a._selectedRow&&a._deselectRow()});if(!this.itemTemplate)throw Error("An item template must be provided to "+this.declaredClass);this._loadTemplate(this.itemTemplate,
"itemTemplate",this._checkLoadComplete);this.emptyTemplate&&this._loadTemplate(this.emptyTemplate,"emptyTemplate",this._checkLoadComplete);this.dividerTemplate&&this._loadTemplate(this.dividerTemplate,"dividerTemplate",this._checkLoadComplete)},handleDrag:function(a){var b=a;a.targetTouches&&0<a.targetTouches.length&&(b=a.targetTouches[0]);a=b.pageX-this._mouseDownPos.x;b=Math.abs(a);10<b&&!this._dragThreshold&&(this._dragThreshold=.6*c.marginBox(this._selectedRow).w,this.autoDelete||this.createDeleteButtons(this._selectedRow));
this._selectedRow.style.left=(10<b?a:0)+"px";this._dragThreshold&&this._dragThreshold<b&&this.preDelete(a)},handleDragCancel:function(){this._deleting||(c.removeClass(this._selectedRow,"hold"),this._selectedRow.style.left=0,this._dragThreshold=this._mouseDownPos=null,this._deleteBtns&&c.style(this._deleteBtns,"display","none"))},preDelete:function(a){this._deleting=!0;c.animateProperty({node:this._selectedRow,duration:400,properties:{left:{end:a+(0<a?1:-1)*this._dragThreshold*.8}},onEnd:c.hitch(this,
function(){this.autoDelete&&this.deleteRow(this._selectedRow)})}).play()},deleteRow:function(a){c.style(a,{visibility:"hidden",minHeight:"0px"});c.removeClass(a,"hold");this._deleteAnimConn=this.connect(a,"webkitAnimationEnd",this._postDeleteAnim);c.addClass(a,"collapsed")},_postDeleteAnim:function(a){this._deleteAnimConn&&(this.disconnect(this._deleteAnimConn),this._deleteAnimConn=null);a=this._selectedRow;var b=a.nextSibling,e=a.previousSibling;e&&e._isDivider&&(b&&!b._isDivider||e.parentNode.removeChild(e));
a.parentNode.removeChild(a);for(this.onDelete(a._data,a._idx,this.items);b;)b._idx&&b._idx--,b=b.nextSibling;c.destroy(a);c.query("\x3e *:not(.buttons)",this.domNode).forEach(this.applyClass);this._deleting=!1;this._deselectRow()},createDeleteButtons:function(a){var b=c.marginBox(a);c._abs(a,!0);this._deleteBtns||(this._deleteBtns=c.create("div",{"class":"buttons"},this.domNode),this.buttons=[],this.buttons.push(new k.mobile.Button({btnClass:"mblRedButton",label:this.labelDelete})),this.buttons.push(new k.mobile.Button({btnClass:"mblBlueButton",
label:this.labelCancel})),c.place(this.buttons[0].domNode,this._deleteBtns),c.place(this.buttons[1].domNode,this._deleteBtns),c.addClass(this.buttons[0].domNode,"deleteBtn"),c.addClass(this.buttons[1].domNode,"cancelBtn"),this._handleButtonClick=c.hitch(this._handleButtonClick),this.connect(this._deleteBtns,"onclick",this._handleButtonClick));c.removeClass(this._deleteBtns,"fade out fast");c.style(this._deleteBtns,{display:"",width:b.w+"px",height:b.h+"px",top:a.offsetTop+"px",left:"0px"})},onDelete:function(a,
b,c){c.splice(b,1);1>c.length&&this.render()},cancelDelete:function(){this._deleting=!1;this.handleDragCancel()},_handleButtonClick:function(a){a.touches&&0<a.touches.length&&(a=a.touches[0]);a=a.target;if(c.hasClass(a,"deleteBtn"))this.deleteRow(this._selectedRow);else if(c.hasClass(a,"cancelBtn"))this.cancelDelete();else return;c.addClass(this._deleteBtns,"fade out")},applyClass:function(a,b,e){c.removeClass(a,"first last");0==b&&c.addClass(a,"first");b==e.length-1&&c.addClass(a,"last")},_setDataInfo:function(a,
b){b.item=a._data;b.index=a._idx},onSelect:function(a,b,c){},_selectRow:function(a){this._deleting&&this._selectedRow&&a!=this._selectedRow&&this.cancelDelete();c.hasClass(a,"row")&&((this.enableHold||this.enableDelete)&&c.addClass(a,"hold"),this._selectedRow=a)},_deselectRow:function(){this._selectedRow&&!this._deleting&&(this.handleDragCancel(),c.removeClass(this._selectedRow,"hold"),this._selectedRow=null)},_getRowNode:function(a,b){for(;a&&!a._data&&a!=this.domNode;){if(!b&&c.hasClass(a,"noclick"))return null;
a=a.parentNode}return a==this.domNode?null:a},applyTemplate:function(a,b){return c._toDom(c.string.substitute(a,b,this._replaceToken,this.formatters||this))},render:function(){c.query("\x3e *:not(.buttons)",this.domNode).forEach(c.destroy);1>this.items.length&&this.emptyTemplate?c.place(c._toDom(this.emptyTemplate),this.domNode,"first"):this.domNode.appendChild(this._renderRange(0,this.items.length));c.hasClass(this.domNode.parentNode,"mblRoundRect")&&c.addClass(this.domNode.parentNode,"mblRoundRectList");
var a=c.query("\x3e .row",this.domNode);0<a.length&&(c.addClass(a[0],"first"),c.addClass(a[a.length-1],"last"))},_renderRange:function(a,b){var e=[],f,d,g=document.createDocumentFragment();a=Math.max(0,a);b=Math.min(b,this.items.length);for(d=a;d<b;d++)f=this.applyTemplate(this.itemTemplate,this.items[d]),c.addClass(f,"row"),f._data=this.items[d],f._idx=d,e.push(f);if(this.dividerFunction&&this.dividerTemplate){var h=null;for(d=a;d<b;d++)e[d]._data=this.items[d],e[d]._idx=d,(f=this.dividerFunction(this.items[d]))&&
f!=h&&(h=this.applyTemplate(this.dividerTemplate,{label:f,item:this.items[d]}),h._isDivider=!0,g.appendChild(h),h=f),g.appendChild(e[d])}else for(d=a;d<b;d++)e[d]._data=this.items[d],e[d]._idx=d,g.appendChild(e[d]);return g},_replaceToken:function(a,b){"!"==b.charAt(0)&&(a=c.getObject(b.substr(1),!1,_this));return"undefined"==typeof a||null==a?"":"!"==b.charAt(0)?a:a.toString().replace(/"/g,"\x26quot;")},_checkLoadComplete:function(){this._templateLoadCount--;1>this._templateLoadCount&&this.get("items")&&
this.render()},_loadTemplate:function(a,b,e){if(a)if(g[a])this.set(b,g[a]),e();else{var f=this;c.xhrGet({url:a,sync:!1,handleAs:"text",load:function(d){g[a]=c.trim(d);f.set(b,g[a]);e()}})}else e()},_setFormattersAttr:function(a){this.formatters=a},_setItemsAttr:function(a){this.items=a||[];1>this._templateLoadCount&&a&&this.render()},destroy:function(){this.buttons&&(c.forEach(this.buttons,function(a){a.destroy()}),this.buttons=null);this.inherited(arguments)}})})()});