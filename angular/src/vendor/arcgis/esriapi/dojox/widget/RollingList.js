//>>built
define("dojox/widget/RollingList",["dojo","dijit","dojox","dojo/i18n!dijit/nls/common","dojo/require!dojo/window,dijit/layout/ContentPane,dijit/_Templated,dijit/_Contained,dijit/layout/_LayoutWidget,dijit/Menu,dijit/form/Button,dijit/focus,dijit/_base/focus,dojox/html/metrics,dojo/i18n"],function(c,g,l){c.provide("dojox.widget.RollingList");c.experimental("dojox.widget.RollingList");c.require("dojo.window");c.require("dijit.layout.ContentPane");c.require("dijit._Templated");c.require("dijit._Contained");
c.require("dijit.layout._LayoutWidget");c.require("dijit.Menu");c.require("dijit.form.Button");c.require("dijit.focus");c.require("dijit._base.focus");c.require("dojox.html.metrics");c.require("dojo.i18n");c.requireLocalization("dijit","common");c.declare("dojox.widget._RollingListPane",[g.layout.ContentPane,g._Templated,g._Contained],{templateString:'\x3cdiv class\x3d"dojoxRollingListPane"\x3e\x3ctable\x3e\x3ctbody\x3e\x3ctr\x3e\x3ctd dojoAttachPoint\x3d"containerNode"\x3e\x3c/td\x3e\x3c/tr\x3e\x3c/tbody\x3e\x3c/div\x3e',
parentWidget:null,parentPane:null,store:null,items:null,query:null,queryOptions:null,_focusByNode:!0,minWidth:0,_setContentAndScroll:function(a,b){this._setContent(a,b);this.parentWidget.scrollIntoView(this)},_updateNodeWidth:function(a,b){a.style.width="";c.marginBox(a).w<b&&c.marginBox(a,{w:b})},_onMinWidthChange:function(a){this._updateNodeWidth(this.domNode,a)},_setMinWidthAttr:function(a){a!==this.minWidth&&(this.minWidth=a,this._onMinWidthChange(a))},startup:function(){this._started||(this.store&&
this.store.getFeatures()["dojo.data.api.Notification"]&&window.setTimeout(c.hitch(this,function(){this.connect(this.store,"onSet","_onSetItem");this.connect(this.store,"onNew","_onNewItem");this.connect(this.store,"onDelete","_onDeleteItem")}),1),this.connect(this.focusNode||this.domNode,"onkeypress","_focusKey"),this.parentWidget._updateClass(this.domNode,"Pane"),this.inherited(arguments),this._onMinWidthChange(this.minWidth))},_focusKey:function(a){a.charOrCode==c.keys.BACKSPACE?c.stopEvent(a):
a.charOrCode==c.keys.LEFT_ARROW&&this.parentPane?(this.parentPane.focus(),this.parentWidget.scrollIntoView(this.parentPane)):a.charOrCode==c.keys.ENTER&&this.parentWidget._onExecute()},focus:function(a){if(this.parentWidget._focusedPane!=this&&(this.parentWidget._focusedPane=this,this.parentWidget.scrollIntoView(this),this._focusByNode&&(!this.parentWidget._savedFocus||a)))try{(this.focusNode||this.domNode).focus()}catch(b){}},_onShow:function(){this.inherited(arguments);(this.store||this.items)&&
(this.refreshOnShow&&this.domNode||!this.isLoaded&&this.domNode)&&this.refresh()},_load:function(){this.isLoaded=!1;this.items?(this._setContentAndScroll(this.onLoadStart(),!0),window.setTimeout(c.hitch(this,"_doQuery"),1)):this._doQuery()},_doLoadItems:function(a,b){var e=0,d=this.store;c.forEach(a,function(a){d.isItemLoaded(a)||e++});if(0===e)b();else{var f=function(a){e--;0===e&&b()};c.forEach(a,function(a){d.isItemLoaded(a)||d.loadItem({item:a,onItem:f})})}},_doQuery:function(){if(this.domNode){var a=
this.parentWidget.preloadItems,a=!0===a||this.items&&this.items.length<=Number(a);if(this.items&&a)this._doLoadItems(this.items,c.hitch(this,"onItems"));else if(this.items)this.onItems();else this._setContentAndScroll(this.onFetchStart(),!0),this.store.fetch({query:this.query,onComplete:function(a){this.items=a;this.onItems()},onError:function(a){this._onError("Fetch",a)},scope:this})}},_hasItem:function(a){for(var b=this.items||[],c=0,d;d=b[c];c++)if(this.parentWidget._itemsMatch(d,a))return!0;return!1},
_onSetItem:function(a,b,c,d){this._hasItem(a)&&this.refresh()},_onNewItem:function(a,b){var c;!b&&!this.parentPane||b&&this.parentPane&&this.parentPane._hasItem(b.item)&&(c=this.parentPane._getSelected())&&this.parentWidget._itemsMatch(c.item,b.item)?(this.items.push(a),this.refresh()):b&&this.parentPane&&this._hasItem(b.item)&&this.refresh()},_onDeleteItem:function(a){this._hasItem(a)&&(this.items=c.filter(this.items,function(b){return b!=a}),this.refresh())},onFetchStart:function(){return this.loadingMessage},
onFetchError:function(a){return this.errorMessage},onLoadStart:function(){return this.loadingMessage},onLoadError:function(a){return this.errorMessage},onItems:function(){this.onLoadDeferred||(this.cancel(),this.onLoadDeferred=new c.Deferred(c.hitch(this,"cancel")));this._onLoadHandler()}});c.declare("dojox.widget._RollingListGroupPane",[l.widget._RollingListPane],{templateString:'\x3cdiv\x3e\x3cdiv dojoAttachPoint\x3d"containerNode"\x3e\x3c/div\x3e\x3cdiv dojoAttachPoint\x3d"menuContainer"\x3e\x3cdiv dojoAttachPoint\x3d"menuNode"\x3e\x3c/div\x3e\x3c/div\x3e\x3c/div\x3e',
_menu:null,_setContent:function(a){this._menu||this.inherited(arguments)},_onMinWidthChange:function(a){if(this._menu){var b=c.marginBox(this.domNode).w,e=c.marginBox(this._menu.domNode).w;this._updateNodeWidth(this._menu.domNode,a-(b-e))}},onItems:function(){var a;this._menu&&(a=this._getSelected(),this._menu.destroyRecursive());this._menu=this._getMenu();var b,e;this.items.length?c.forEach(this.items,function(c){if(b=this.parentWidget._getMenuItemForItem(c,this))a&&this.parentWidget._itemsMatch(b.item,
a.item)&&(e=b),this._menu.addChild(b)},this):(b=this.parentWidget._getMenuItemForItem(null,this))&&this._menu.addChild(b);if(e){if(this._setSelected(e),a&&!a.children&&e.children||a&&a.children&&!e.children){var d=this.parentWidget._getPaneForItem(e.item,this,e.children);d?this.parentWidget.addChild(d,this.getIndexInParent()+1):(this.parentWidget._removeAfter(this),this.parentWidget._onItemClick(null,this,e.item,e.children))}}else a&&this.parentWidget._removeAfter(this);this.containerNode.innerHTML=
"";this.containerNode.appendChild(this._menu.domNode);this.parentWidget.scrollIntoView(this);this._checkScrollConnection(!0);this.inherited(arguments);this._onMinWidthChange(this.minWidth)},_checkScrollConnection:function(a){var b=this.store;this._scrollConn&&this.disconnect(this._scrollConn);delete this._scrollConn;c.every(this.items,function(a){return b.isItemLoaded(a)})||(a&&this._loadVisibleItems(),this._scrollConn=this.connect(this.domNode,"onscroll","_onScrollPane"))},startup:function(){this.inherited(arguments);
this.parentWidget._updateClass(this.domNode,"GroupPane")},focus:function(a){if(this._menu){this._pendingFocus&&this.disconnect(this._pendingFocus);delete this._pendingFocus;var b=this._menu.focusedChild;if(!b){var e=c.query(".dojoxRollingListItemSelected",this.domNode)[0];e&&(b=g.byNode(e))}b||(b=this._menu.getChildren()[0]||this._menu);this._focusByNode=!1;if(b.focusNode){if(!this.parentWidget._savedFocus||a)try{b.focusNode.focus()}catch(d){}window.setTimeout(function(){try{c.window.scrollIntoView(b.focusNode)}catch(d){}},
1)}else b.focus?this.parentWidget._savedFocus&&!a||b.focus():this._focusByNode=!0;this.inherited(arguments)}else this._pendingFocus||(this._pendingFocus=this.connect(this,"onItems","focus"))},_getMenu:function(){var a=this,b=new g.Menu({parentMenu:this.parentPane?this.parentPane._menu:null,onCancel:function(b){a.parentPane&&a.parentPane.focus(!0)},_moveToPopup:function(a){if(this.focusedChild&&!this.focusedChild.disabled)this.onItemClick(this.focusedChild,a)}},this.menuNode);this.connect(b,"onItemClick",
function(a,d){if(!a.disabled)if(d.alreadySelected=c.hasClass(a.domNode,"dojoxRollingListItemSelected"),d.alreadySelected&&("keypress"==d.type&&d.charOrCode!=c.keys.ENTER||"internal"==d.type)){var e=this.parentWidget.getChildren()[this.getIndexInParent()+1];e&&(e.focus(!0),this.parentWidget.scrollIntoView(e))}else this._setSelected(a,b),this.parentWidget._onItemClick(d,this,a.item,a.children),"keypress"==d.type&&d.charOrCode==c.keys.ENTER&&this.parentWidget._onExecute()});b._started||b.startup();return b},
_onScrollPane:function(){this._visibleLoadPending&&window.clearTimeout(this._visibleLoadPending);this._visibleLoadPending=window.setTimeout(c.hitch(this,"_loadVisibleItems"),500)},_loadVisibleItems:function(){delete this._visibleLoadPending;var a=this._menu;if(a){var b=a.getChildren();if(b&&b.length){var e=function(a,b,e){var d=c.getComputedStyle(a),f=0;b&&(f+=c._getMarginExtents(a,d).t);e&&(f+=c._getPadBorderExtents(a,d).t);return f},e=e(this.domNode,!1,!0)+e(this.containerNode,!0,!0)+e(a.domNode,
!0,!0)+e(b[0].domNode,!0,!1),d=c.contentBox(this.domNode).h,f=this.domNode.scrollTop-e-d/2,g=f+3*d/2,h=c.filter(b,function(a){var b=a.domNode.offsetTop,c=a.store;a=a.item;return b>=f&&b<=g&&!c.isItemLoaded(a)}),k=c.map(h,function(a){return a.item}),b=c.hitch(this,function(){var b=this._getSelected();c.forEach(k,function(c,e){var d=this.parentWidget._getMenuItemForItem(c,this),f=h[e],g=f.getIndexInParent();a.removeChild(f);d&&(b&&this.parentWidget._itemsMatch(d.item,b.item),a.addChild(d,g),a.focusedChild==
f&&a.focusChild(d));f.destroy()},this);this._checkScrollConnection(!1)});this._doLoadItems(k,b)}}},_getSelected:function(a){a||(a=this._menu);if(a){a=this._menu.getChildren();for(var b=0,e;e=a[b];b++)if(c.hasClass(e.domNode,"dojoxRollingListItemSelected"))return e}return null},_setSelected:function(a,b){b||(b=this._menu);b&&c.forEach(b.getChildren(),function(b){this.parentWidget._updateClass(b.domNode,"Item",{Selected:a&&b==a&&!b.disabled})},this)}});c.declare("dojox.widget.RollingList",[g._Widget,
g._Templated,g._Container],{templateString:c.cache("dojox.widget","RollingList/RollingList.html",'\x3cdiv class\x3d"dojoxRollingList ${className}"\r\n\t\x3e\x3cdiv class\x3d"dojoxRollingListContainer" dojoAttachPoint\x3d"containerNode" dojoAttachEvent\x3d"onkeypress:_onKey"\r\n\t\x3e\x3c/div\r\n\t\x3e\x3cdiv class\x3d"dojoxRollingListButtons" dojoAttachPoint\x3d"buttonsNode"\r\n        \x3e\x3cbutton dojoType\x3d"dijit.form.Button" dojoAttachPoint\x3d"okButton"\r\n\t\t\t\tdojoAttachEvent\x3d"onClick:_onExecute"\x3e${okButtonLabel}\x3c/button\r\n        \x3e\x3cbutton dojoType\x3d"dijit.form.Button" dojoAttachPoint\x3d"cancelButton"\r\n\t\t\t\tdojoAttachEvent\x3d"onClick:_onCancel"\x3e${cancelButtonLabel}\x3c/button\r\n\t\x3e\x3c/div\r\n\x3e\x3c/div\x3e\r\n'),
widgetsInTemplate:!0,className:"",store:null,query:null,queryOptions:null,childrenAttrs:["children"],parentAttr:"",value:null,executeOnDblClick:!0,preloadItems:!1,showButtons:!1,okButtonLabel:"",cancelButtonLabel:"",minPaneWidth:0,postMixInProperties:function(){this.inherited(arguments);var a=c.i18n.getLocalization("dijit","common");this.okButtonLabel=this.okButtonLabel||a.buttonOk;this.cancelButtonLabel=this.cancelButtonLabel||a.buttonCancel},_setShowButtonsAttr:function(a){var b=!1;if(this.showButtons!=
a&&this._started||this.showButtons==a&&!this.started)b=!0;c.toggleClass(this.domNode,"dojoxRollingListButtonsHidden",!a);this.showButtons=a;b&&(this._started?this.layout():window.setTimeout(c.hitch(this,"layout"),0))},_itemsMatch:function(a,b){return a||b?a&&b?a==b||this._isIdentity&&this.store.getIdentity(a)==this.store.getIdentity(b):!1:!0},_removeAfter:function(a){"number"!=typeof a&&(a=this.getIndexOfChild(a));0<=a&&c.forEach(this.getChildren(),function(b,c){c>a&&(this.removeChild(b),b.destroyRecursive())},
this);for(var b=this.getChildren(),b=b[b.length-1],e=null;b&&!e;){var d=b._getSelected?b._getSelected():null;d&&(e=d.item);b=b.parentPane}this._setInProgress||this._setValue(e)},addChild:function(a,b){0<b&&this._removeAfter(b-1);this.inherited(arguments);a._started||a.startup();a.attr("minWidth",this.minPaneWidth);this.layout();this._savedFocus||a.focus()},_setMinPaneWidthAttr:function(a){a!==this.minPaneWidth&&(this.minPaneWidth=a,c.forEach(this.getChildren(),function(b){b.attr("minWidth",a)}))},
_updateClass:function(a,b,e){this._declaredClasses||(this._declaredClasses=("dojoxRollingList "+this.className).split(" "));c.forEach(this._declaredClasses,function(d){if(d){c.addClass(a,d+b);for(var f in e||{})c.toggleClass(a,d+b+f,e[f]);c.toggleClass(a,d+b+"FocusSelected",c.hasClass(a,d+b+"Focus")&&c.hasClass(a,d+b+"Selected"));c.toggleClass(a,d+b+"HoverSelected",c.hasClass(a,d+b+"Hover")&&c.hasClass(a,d+b+"Selected"))}})},scrollIntoView:function(a){this._scrollingTimeout&&window.clearTimeout(this._scrollingTimeout);
delete this._scrollingTimeout;this._scrollingTimeout=window.setTimeout(c.hitch(this,function(){a.domNode&&c.window.scrollIntoView(a.domNode);delete this._scrollingTimeout}),1)},resize:function(a){g.layout._LayoutWidget.prototype.resize.call(this,a)},layout:function(){var a=this.getChildren();if(this._contentBox){var b=this._contentBox.h-c.marginBox(this.buttonsNode).h-l.html.metrics.getScrollbar().h;c.forEach(a,function(a){c.marginBox(a.domNode,{h:b})})}this._focusedPane?(a=this._focusedPane,delete this._focusedPane,
this._savedFocus||a.focus()):a&&a.length&&(this._savedFocus||a[0].focus())},_onChange:function(a){this.onChange(a)},_setValue:function(a){delete this._setInProgress;this._itemsMatch(this.value,a)||(this.value=a,this._onChange(a))},_setValueAttr:function(a){if(!this._itemsMatch(this.value,a)||a)if(!this._setInProgress||this._setInProgress!==a)if((this._setInProgress=a)&&this.store.isItem(a)){var b=c.hitch(this,function(b,e){var d=this.store,f;if(this.parentAttr&&d.getFeatures()["dojo.data.api.Identity"]&&
((f=this.store.getValue(b,this.parentAttr))||""===f)){var g=function(a){d.getIdentity(a)==d.getIdentity(b)?e(null):e([a])};""===f?e(null):"string"==typeof f?d.fetchItemByIdentity({identity:f,onItem:g}):d.isItem(f)&&g(f)}else{var h=this.childrenAttrs.length,k=[];c.forEach(this.childrenAttrs,function(c){var f={};f[c]=b;d.fetch({query:f,scope:this,onComplete:function(b){this._setInProgress===a&&(k=k.concat(b),h--,0===h&&e(k))}})},this)}}),e=c.hitch(this,function(b,d){var f=b[d],g=this.getChildren()[d],
h;if(f&&g){var k=c.hitch(this,function(){h&&this.disconnect(h);delete h;if(this._setInProgress===a){var k=c.filter(g._menu.getChildren(),function(a){return this._itemsMatch(a.item,f)},this)[0];k&&(d++,g._menu.onItemClick(k,{type:"internal",stopPropagation:function(){},preventDefault:function(){}}),b[d]?e(b,d):(this._setValue(f),this.onItemClick(f,g,this.getChildItems(f))))}});g.isLoaded?k():h=this.connect(g,"onLoad",k)}else 0===d&&this.set("value",null)}),d=[],f=c.hitch(this,function(a){a&&a.length?
(d.push(a[0]),b(a[0],f)):(a||d.pop(),d.reverse(),e(d,0))}),g=this.domNode.style;"none"==g.display||"hidden"==g.visibility?this._setValue(a):this._itemsMatch(a,this._visibleItem)||f([a])}else g=this.getChildren()[0],g._setSelected(null),this._onItemClick(null,g,null,null)},_onItemClick:function(a,b,c,d){if(a){var e=this._getPaneForItem(c,b,d);"click"==a.type&&a.alreadySelected&&e?(this._removeAfter(b.getIndexInParent()+1),(e=b.getNextSibling())&&e._setSelected&&e._setSelected(null),this.scrollIntoView(e)):
e?(this.addChild(e,b.getIndexInParent()+1),this._savedFocus&&e.focus(!0)):(this._removeAfter(b),this.scrollIntoView(b))}else b&&(this._removeAfter(b),this.scrollIntoView(b));a&&"internal"==a.type||(this._setValue(c),this.onItemClick(c,b,d));this._visibleItem=c},_getPaneForItem:function(a,b,c){var d=this.getPaneForItem(a,b,c);d.store=this.store;d.parentWidget=this;d.parentPane=b||null;a?d.items=c?c:[a]:(d.query=this.query,d.queryOptions=this.queryOptions);return d},_getMenuItemForItem:function(a,b){var e=
this.store;if(a&&e&&e.isItem(a)){var d=(e=e.isItemLoaded(a))?this.getChildItems(a):void 0,f;if(d)if(f=this.getMenuItemForItem(a,b,d),f.children=d,this._updateClass(f.domNode,"Item",{Expanding:!0}),f._started)c.style(f.arrowWrapper,"visibility","");else var l=f.connect(f,"startup",function(){this.disconnect(l);c.style(this.arrowWrapper,"visibility","")});else f=this.getMenuItemForItem(a,b,null),e?this._updateClass(f.domNode,"Item",{Single:!0}):(this._updateClass(f.domNode,"Item",{Unloaded:!0}),f.attr("disabled",
!0));f.store=this.store;f.item=a;f.label||f.attr("label",this.store.getLabel(a).replace(/</,"\x26lt;"));if(f.focusNode){var h=this;f.focus=function(){if(!this.disabled)try{this.focusNode.focus()}catch(k){}};f.connect(f.focusNode,"onmouseenter",function(){this.disabled||h._updateClass(this.domNode,"Item",{Hover:!0})});f.connect(f.focusNode,"onmouseleave",function(){this.disabled||h._updateClass(this.domNode,"Item",{Hover:!1})});f.connect(f.focusNode,"blur",function(){h._updateClass(this.domNode,"Item",
{Focus:!1,Hover:!1})});f.connect(f.focusNode,"focus",function(){h._updateClass(this.domNode,"Item",{Focus:!0});h._focusedPane=b});this.executeOnDblClick&&f.connect(f.focusNode,"ondblclick",function(){h._onExecute()})}return f}e=new g.MenuItem({label:"---",disabled:!0,iconClass:"dojoxEmpty",focus:function(){}});this._updateClass(e.domNode,"Item");return e},_setStore:function(a){a===this.store&&this._started||(this.store=a,this._isIdentity=a.getFeatures()["dojo.data.api.Identity"],a=this._getPaneForItem(),
this.addChild(a,0))},_onKey:function(a){if(a.charOrCode==c.keys.BACKSPACE)c.stopEvent(a);else if(a.charOrCode==c.keys.ESCAPE&&this._savedFocus){try{g.focus(this._savedFocus)}catch(b){}c.stopEvent(a)}else a.charOrCode!=c.keys.LEFT_ARROW&&a.charOrCode!=c.keys.RIGHT_ARROW||c.stopEvent(a)},_resetValue:function(){this.set("value",this._lastExecutedValue)},_onCancel:function(){this._resetValue();this.onCancel()},_onExecute:function(){this._lastExecutedValue=this.get("value");this.onExecute()},focus:function(){var a=
this._savedFocus;this._savedFocus=g.getFocus(this);this._savedFocus.node||delete this._savedFocus;if(this._focusedPane){this._savedFocus=g.getFocus(this);var b=this._focusedPane;delete this._focusedPane;a||b.focus(!0)}else(b=this.getChildren()[0])&&!a&&b.focus(!0)},handleKey:function(a){return a.keyCode==c.keys.DOWN_ARROW?(delete this._savedFocus,this.focus(),!1):a.keyCode==c.keys.ESCAPE?(this._onCancel(),!1):!0},_updateChildClasses:function(){var a=this.getChildren(),b=a.length;c.forEach(a,function(a,
d){c.toggleClass(a.domNode,"dojoxRollingListPaneCurrentChild",d==b-1);c.toggleClass(a.domNode,"dojoxRollingListPaneCurrentSelected",d==b-2)})},startup:function(){this._started||(this.getParent&&this.getParent()||(this.resize(),this.connect(c.global,"onresize","resize")),this.connect(this,"addChild","_updateChildClasses"),this.connect(this,"removeChild","_updateChildClasses"),this._setStore(this.store),this.set("showButtons",this.showButtons),this.inherited(arguments),this._lastExecutedValue=this.get("value"))},
getChildItems:function(a){var b,e=this.store;c.forEach(this.childrenAttrs,function(c){(c=e.getValues(a,c))&&c.length&&(b=(b||[]).concat(c))});return b},getMenuItemForItem:function(a,b,c){return new g.MenuItem({})},getPaneForItem:function(a,b,c){return!a||c?new l.widget._RollingListGroupPane({}):null},onItemClick:function(a,b,c){},onExecute:function(){},onCancel:function(){},onChange:function(a){}})});