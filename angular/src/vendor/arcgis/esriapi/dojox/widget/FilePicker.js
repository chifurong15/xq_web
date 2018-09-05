//>>built
define("dojox/widget/FilePicker",["dojo","dijit","dojox","dojo/i18n!dojox/widget/nls/FilePicker","dojo/require!dojox/widget/RollingList,dojo/i18n"],function(d,f,e){d.provide("dojox.widget.FilePicker");d.require("dojox.widget.RollingList");d.require("dojo.i18n");d.requireLocalization("dojox.widget","FilePicker");d.declare("dojox.widget._FileInfoPane",[e.widget._RollingListPane],{templateString:d.cache("dojox.widget","FilePicker/_FileInfoPane.html",'\x3cdiv class\x3d"dojoxFileInfoPane"\x3e\r\n\t\x3ctable\x3e\r\n\t\t\x3ctbody\x3e\r\n\t\t\t\x3ctr\x3e\r\n\t\t\t\t\x3ctd class\x3d"dojoxFileInfoLabel dojoxFileInfoNameLabel"\x3e${_messages.name}\x3c/td\x3e\r\n\t\t\t\t\x3ctd class\x3d"dojoxFileInfoName" dojoAttachPoint\x3d"nameNode"\x3e\x3c/td\x3e\r\n\t\t\t\x3c/tr\x3e\r\n\t\t\t\x3ctr\x3e\r\n\t\t\t\t\x3ctd class\x3d"dojoxFileInfoLabel dojoxFileInfoPathLabel"\x3e${_messages.path}\x3c/td\x3e\r\n\t\t\t\t\x3ctd class\x3d"dojoxFileInfoPath" dojoAttachPoint\x3d"pathNode"\x3e\x3c/td\x3e\r\n\t\t\t\x3c/tr\x3e\r\n\t\t\t\x3ctr\x3e\r\n\t\t\t\t\x3ctd class\x3d"dojoxFileInfoLabel dojoxFileInfoSizeLabel"\x3e${_messages.size}\x3c/td\x3e\r\n\t\t\t\t\x3ctd class\x3d"dojoxFileInfoSize" dojoAttachPoint\x3d"sizeNode"\x3e\x3c/td\x3e\r\n\t\t\t\x3c/tr\x3e\r\n\t\t\x3c/tbody\x3e\r\n\t\x3c/table\x3e\r\n\t\x3cdiv dojoAttachPoint\x3d"containerNode" style\x3d"display:none;"\x3e\x3c/div\x3e\r\n\x3c/div\x3e'),
postMixInProperties:function(){this._messages=d.i18n.getLocalization("dojox.widget","FilePicker",this.lang);this.inherited(arguments)},onItems:function(){var a=this.store,b=this.items[0];b?(this.nameNode.innerHTML=a.getLabel(b),this.pathNode.innerHTML=a.getIdentity(b),this.sizeNode.innerHTML=a.getValue(b,"size"),this.parentWidget.scrollIntoView(this),this.inherited(arguments)):this._onError("Load",Error("No item defined"))}});d.declare("dojox.widget.FilePicker",e.widget.RollingList,{className:"dojoxFilePicker",
pathSeparator:"",topDir:"",parentAttr:"parentDir",pathAttr:"path",preloadItems:50,selectDirectories:!0,selectFiles:!0,_itemsMatch:function(a,b){if(!a&&!b)return!0;if(a&&b){if(a==b)return!0;if(this._isIdentity){var c=[this.store.getIdentity(a),this.store.getIdentity(b)];d.forEach(c,function(a,b){a.lastIndexOf(this.pathSeparator)==a.length-1&&(c[b]=a.substring(0,a.length-1))},this);return c[0]==c[1]}}return!1},startup:function(){if(!this._started){this.inherited(arguments);var a,b=this.getChildren()[0],
c=d.hitch(this,function(){a&&this.disconnect(a);delete a;var c=b.items[0];if(c){var d=this.store,e=d.getValue(c,this.parentAttr),c=d.getValue(c,this.pathAttr);this.pathSeparator=this.pathSeparator||d.pathSeparator;this.pathSeparator||(this.pathSeparator=c.substring(e.length,e.length+1));this.topDir||(this.topDir=e,this.topDir.lastIndexOf(this.pathSeparator)!=this.topDir.length-1&&(this.topDir+=this.pathSeparator))}});this.pathSeparator&&this.topDir||(b.items?c():a=this.connect(b,"onItems",c))}},getChildItems:function(a){var b=
this.inherited(arguments);!b&&this.store.getValue(a,"directory")&&(b=[]);return b},getMenuItemForItem:function(a,b,c){b={iconClass:"dojoxDirectoryItemIcon"};this.store.getValue(a,"directory")||(b.iconClass="dojoxFileItemIcon",a=this.store.getLabel(a),c=a.lastIndexOf("."),0<=c&&(b.iconClass+=" dojoxFileItemIcon_"+a.substring(c+1)),this.selectFiles||(b.disabled=!0));return new f.MenuItem(b)},getPaneForItem:function(a,b,c){b=null;!a||this.store.isItem(a)&&this.store.getValue(a,"directory")?b=new e.widget._RollingListGroupPane({}):
this.store.isItem(a)&&!this.store.getValue(a,"directory")&&(b=new e.widget._FileInfoPane({}));return b},_setPathValueAttr:function(a,b,c){a?(a.lastIndexOf(this.pathSeparator)==a.length-1&&(a=a.substring(0,a.length-1)),this.store.fetchItemByIdentity({identity:a,onItem:function(a){b&&(this._lastExecutedValue=a);this.set("value",a);c&&c()},scope:this})):this.set("value",null)},_getPathValueAttr:function(a){a||(a=this.value);return a&&this.store.isItem(a)?this.store.getValue(a,this.pathAttr):""},_setValue:function(a){delete this._setInProgress;
var b=this.store;if(a&&b.isItem(a)){if((b=this.store.getValue(a,"directory"))&&!this.selectDirectories||!b&&!this.selectFiles)return}else a=null;this._itemsMatch(this.value,a)||(this.value=a,this._onChange(a))}})});