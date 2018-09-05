//>>built
define("dojox/mobile/IconMenuItem","dojo/_base/declare dojo/_base/lang dojo/dom-class dojo/dom-construct dojo/dom-attr ./iconUtils ./_ItemBase".split(" "),function(f,g,e,c,d,k,h){return f("dojox.mobile.IconMenuItem",h,{closeOnAction:!1,tag:"li",baseClass:"mblIconMenuItem",selColor:"mblIconMenuItemSel",_selStartMethod:"touch",_selEndMethod:"touch",buildRendering:function(){this.domNode=this.srcNodeRef||c.create(this.tag);d.set(this.domNode,"role","menuitemcheckbox");d.set(this.domNode,"aria-checked",
"false");this.inherited(arguments);this.selected&&e.add(this.domNode,this.selColor);this.srcNodeRef&&(this.label||(this.label=g.trim(this.srcNodeRef.innerHTML)),this.srcNodeRef.innerHTML="");var a=this.anchorNode=this.containerNode=c.create("a",{className:"mblIconMenuItemAnchor",role:"presentation"}),b=this.iconParentNode=c.create("table",{className:"mblIconMenuItemTable",role:"presentation"},a).insertRow(-1).insertCell(-1);this.iconNode=c.create("div",{className:"mblIconMenuItemIcon"},b);this.labelNode=
this.refNode=c.create("div",{className:"mblIconMenuItemLabel"},b);this.position="before";this.domNode.appendChild(a)},startup:function(){this._started||(this.connect(this.domNode,"onkeydown","_onClick"),this.inherited(arguments),this._isOnLine||(this._isOnLine=!0,this.set("icon",void 0!==this._pendingIcon?this._pendingIcon:this.icon),delete this._pendingIcon))},_onClick:function(a){if((!a||"keydown"!==a.type||13===a.keyCode)&&!1!==this.onClick(a)){if(this.closeOnAction){var b=this.getParent();b&&
b.hide&&b.hide()}this.defaultClickAction(a)}},onClick:function(){},_setSelectedAttr:function(a){this.inherited(arguments);e.toggle(this.domNode,this.selColor,a);d.set(this.domNode,"aria-checked",a?"true":"false")}})});