//>>built
define("dojox/mobile/ListItem","dojo/_base/array dojo/_base/declare dojo/_base/lang dojo/dom-class dojo/dom-construct dojo/dom-style dojo/dom-attr dijit/registry dijit/_WidgetBase ./iconUtils ./_ItemBase ./ProgressIndicator dojo/has dojo/has!dojo-bidi?dojox/mobile/bidi/ListItem".split(" "),function(h,k,n,d,f,p,g,l,q,r,e,t,m,u){e=k(m("dojo-bidi")?"dojox.mobile.NonBidiListItem":"dojox.mobile.ListItem",e,{rightText:"",rightIcon:"",rightIcon2:"",deleteIcon:"",anchorLabel:!1,noArrow:!1,checked:!1,arrowClass:"",
checkClass:"",uncheckClass:"",variableHeight:!1,rightIconTitle:"",rightIcon2Title:"",header:!1,tag:"li",busy:!1,progStyle:"",layoutOnResize:!1,paramsToInherit:"variableHeight,transition,deleteIcon,icon,rightIcon,rightIcon2,uncheckIcon,arrowClass,checkClass,uncheckClass,deleteIconTitle,deleteIconRole",baseClass:"mblListItem",_selStartMethod:"touch",_selEndMethod:"timer",_delayedSelection:!0,_selClass:"mblListItemSelected",buildRendering:function(){this._templated=!!this.templateString;this._templated||
(this.domNode=this.containerNode=this.srcNodeRef||f.create(this.tag));this.inherited(arguments);this.selected&&d.add(this.domNode,this._selClass);this.header&&d.replace(this.domNode,"mblEdgeToEdgeCategory",this.baseClass);if(!this._templated){this.labelNode=f.create("div",{className:"mblListItemLabel"});var a=this.srcNodeRef;a&&1===a.childNodes.length&&3===a.firstChild.nodeType&&this.labelNode.appendChild(a.firstChild);this.domNode.appendChild(this.labelNode)}this._layoutChildren=[]},startup:function(){if(!this._started){var a=
this.getParent();this.getTransOpts();this._templated&&!this.labelNode||!this.anchorLabel||(this.labelNode.style.display="inline",this.labelNode.style.cursor="pointer",this.connect(this.labelNode,"onclick","_onClick"),this.onTouchStart=function(a){return a.target!==this.labelNode});this.inherited(arguments);d.contains(this.domNode,"mblVariableHeight")&&(this.variableHeight=!0);this.variableHeight&&(d.add(this.domNode,"mblVariableHeight"),this.defer("layoutVariableHeight"));this._isOnLine||(this._isOnLine=
!0,this.set({icon:void 0!==this._pending_icon?this._pending_icon:this.icon,deleteIcon:void 0!==this._pending_deleteIcon?this._pending_deleteIcon:this.deleteIcon,rightIcon:void 0!==this._pending_rightIcon?this._pending_rightIcon:this.rightIcon,rightIcon2:void 0!==this._pending_rightIcon2?this._pending_rightIcon2:this.rightIcon2,uncheckIcon:void 0!==this._pending_uncheckIcon?this._pending_uncheckIcon:this.uncheckIcon}),delete this._pending_icon,delete this._pending_deleteIcon,delete this._pending_rightIcon,
delete this._pending_rightIcon2,delete this._pending_uncheckIcon);a&&a.select&&(this.set("checked",void 0!==this._pendingChecked?this._pendingChecked:this.checked),g.set(this.domNode,"role","option"),(this._pendingChecked||this.checked)&&g.set(this.domNode,"aria-selected","true"),delete this._pendingChecked);this.setArrow();this.layoutChildren()}},_updateHandles:function(){var a=this.getParent(),b=this.getTransOpts();b.moveTo||b.href||b.url||this.clickable||a&&a.select?(this._keydownHandle||(this._keydownHandle=
this.connect(this.domNode,"onkeydown","_onClick")),this._handleClick=!0):(this._keydownHandle&&(this.disconnect(this._keydownHandle),this._keydownHandle=null),this._handleClick=!1);this.inherited(arguments)},layoutChildren:function(){var a;h.forEach(this.domNode.childNodes,function(b){if(1===b.nodeType){var c=b.getAttribute("layout")||b.getAttribute("data-mobile-layout")||(l.byNode(b)||{}).layout;c&&(d.add(b,"mblListItemLayout"+c.charAt(0).toUpperCase()+c.substring(1)),this._layoutChildren.push(b),
"center"===c&&(a=b))}},this);a&&this.domNode.insertBefore(a,this.domNode.firstChild)},resize:function(){this.layoutOnResize&&this.variableHeight&&this.layoutVariableHeight();if(!this._templated||this.labelNode)this.labelNode.style.display=this.labelNode.firstChild?"block":"inline"},_onTouchStart:function(a){a.target.getAttribute("preventTouch")||a.target.getAttribute("data-mobile-prevent-touch")||(l.getEnclosingWidget(a.target)||{}).preventTouch||this.inherited(arguments)},_onClick:function(a){if(!(this.getParent().isEditing||
a&&"keydown"===a.type&&13!==a.keyCode)&&!1!==this.onClick(a)){var b=this.labelNode;if((this._templated||b)&&this.anchorLabel&&a.currentTarget===b)d.add(b,"mblListItemLabelSelected"),this.defer(function(){d.remove(b,"mblListItemLabelSelected")},this._duration),this.onAnchorLabelClicked(a);else{var c=this.getParent();c.select&&("single"===c.select?this.checked||this.set("checked",!0):"multiple"===c.select&&this.set("checked",!this.checked));this.defaultClickAction(a)}}},onClick:function(){},onAnchorLabelClicked:function(a){},
layoutVariableHeight:function(){var a=this.domNode.offsetHeight;a!==this.domNodeHeight&&(this.domNodeHeight=a,h.forEach(this._layoutChildren.concat([this.rightTextNode,this.rightIcon2Node,this.rightIconNode,this.uncheckIconNode,this.iconNode,this.deleteIconNode,this.knobIconNode]),function(a){if(a){var b=this.domNode,d=function(){var c=Math.round((b.offsetHeight-a.offsetHeight)/2)-p.get(b,"paddingTop");a.style.marginTop=c+"px"};0===a.offsetHeight&&"IMG"===a.tagName?a.onload=d:d()}},this))},setArrow:function(){if(!this.checked){var a=
"",b=this.getParent(),c=this.getTransOpts();!(c.moveTo||c.href||c.url||this.clickable)||this.noArrow||b&&b.selectOne||(a=this.arrowClass||"mblDomButtonArrow",g.set(this.domNode,"role","button"));a&&this._setRightIconAttr(a)}},_findRef:function(a){var b,c="deleteIcon icon rightIcon uncheckIcon rightIcon2 rightText".split(" ");for(a=h.indexOf(c,a)+1;a<c.length;a++)if(b=this[c[a]+"Node"])return b;for(a=c.length-1;0<=a;a--)if(b=this[c[a]+"Node"])return b.nextSibling;return this.domNode.firstChild},_setIcon:function(a,
b){if(this._isOnLine){this._set(b,a);this[b+"Node"]=r.setIcon(a,this[b+"Pos"],this[b+"Node"],this[b+"Title"]||this.alt,this.domNode,this._findRef(b),"before");if(this[b+"Node"]){var c=b.charAt(0).toUpperCase()+b.substring(1);d.add(this[b+"Node"],"mblListItem"+c)}(c=this[b+"Role"])&&this[b+"Node"].setAttribute("role",c)}else this["_pending_"+b]=a},_setDeleteIconAttr:function(a){this._setIcon(a,"deleteIcon")},_setIconAttr:function(a){this._setIcon(a,"icon")},_setRightTextAttr:function(a){this._templated||
this.rightTextNode||(this.rightTextNode=f.create("div",{className:"mblListItemRightText"},this.labelNode,"before"));this.rightText=a;this.rightTextNode.innerHTML=this._cv?this._cv(a):a},_setRightIconAttr:function(a){this._setIcon(a,"rightIcon")},_setUncheckIconAttr:function(a){this._setIcon(a,"uncheckIcon")},_setRightIcon2Attr:function(a){this._setIcon(a,"rightIcon2")},_setCheckedAttr:function(a){if(this._isOnLine){var b=this.getParent();b&&"single"===b.select&&a&&h.forEach(b.getChildren(),function(a){a!==
this&&a.checked&&a.set("checked",!1)&&g.set(a.domNode,"aria-selected","false")},this);this._setRightIconAttr(this.checkClass||"mblDomButtonCheck");this._setUncheckIconAttr(this.uncheckClass);d.toggle(this.domNode,"mblListItemChecked",a);d.toggle(this.domNode,"mblListItemUnchecked",!a);d.toggle(this.domNode,"mblListItemHasUncheck",!!this.uncheckIconNode);this.rightIconNode.style.position=this.uncheckIconNode&&!a?"absolute":"";if(b&&this.checked!==a)b.onCheckStateChanged(this,a);this._set("checked",
a);g.set(this.domNode,"aria-selected",a?"true":"false")}else this._pendingChecked=a},_setBusyAttr:function(a){var b=this._prog;a?(this._progNode||(this._progNode=f.create("div",{className:"mblListItemIcon"}),b=this._prog=new t({size:25,center:!1,removeOnStop:!1}),d.add(b.domNode,this.progStyle),this._progNode.appendChild(b.domNode)),this.iconNode?this.domNode.replaceChild(this._progNode,this.iconNode):f.place(this._progNode,this._findRef("icon"),"before"),b.start()):this._progNode&&(this.iconNode?
this.domNode.replaceChild(this.iconNode,this._progNode):this.domNode.removeChild(this._progNode),b.stop());this._set("busy",a)},_setSelectedAttr:function(a){this.inherited(arguments);d.toggle(this.domNode,this._selClass,a)},_setClickableAttr:function(a){this._set("clickable",a);this._updateHandles()},_setMoveToAttr:function(a){this._set("moveTo",a);this._updateHandles()},_setHrefAttr:function(a){this._set("href",a);this._updateHandles()},_setUrlAttr:function(a){this._set("url",a);this._updateHandles()}});
e.ChildWidgetProperties={layout:"",preventTouch:!1};n.extend(q,e.ChildWidgetProperties);return m("dojo-bidi")?k("dojox.mobile.ListItem",[e,u]):e});