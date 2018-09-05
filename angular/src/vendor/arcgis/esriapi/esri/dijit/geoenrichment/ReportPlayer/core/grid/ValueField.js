// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://js.arcgis.com/3.24/esri/copyright.txt for details.
//>>built
define("esri/dijit/geoenrichment/ReportPlayer/core/grid/ValueField","dojo/_base/declare dojo/_base/lang dojo/on dojo/sniff dojo/dom-construct dojo/dom-class dojo/dom-geometry dijit/Destroyable ./valueFieldUtils/ValueFieldTooltipBuilder ./valueFieldUtils/ValueFieldTextTrimmer esri/dijit/geoenrichment/utils/DomUtil esri/dijit/geoenrichment/utils/UrlUtil esri/dijit/geoenrichment/ReportPlayer/core/themes/ReportThemes".split(" "),function(d,f,m,t,e,g,u,h,n,k,l,p,v){function w(a){a.domNode=e.toDom("\x3cdiv class\x3d'esriGEAdjustableGridValueField esriGENonSelectable'\x3e\x3cdiv class\x3d'valueField_contentBlock' data-dojo-attach-point\x3d'contentBlock'\x3e\x3cdiv data-dojo-attach-point\x3d'valueContainer' class\x3d'valueField_valueBlock'\x3e\x3cdiv data-dojo-attach-point\x3d'valueLabel' class\x3d'valueField_valueLabel'\x3e\x3c/div\x3e\x3c/div\x3e\x3c/div\x3e\x3c/div\x3e");
a.contentBlock=a.domNode.children[0];a.valueContainer=a.contentBlock.children[0];a.valueLabel=a.valueContainer.children[0]}var x=d(h,{_buildLayoutFunc:null,_parentNode:null,constructor:function(a,b){f.mixin(this,a);this._parentNode=b;this.postCreate()},postCreate:function(){this._buildLayoutFunc(this);this["class"]&&g.add(this.domNode,this["class"]);this._parentNode&&this.placeAt(this._parentNode);this.value&&this.set("value",this.value)},get:function(a){return"value"===a?this._getValueAttr?this._getValueAttr():
this.value:this[a]},set:function(a,b){"value"===a?this._setValueAttr?this._setValueAttr(b):this.value=b:this[a]=b},placeAt:function(a){e.place(this.domNode,a);return this},on:function(a,b){this.own(m(this.domNode,a,b))},isLeftToRight:function(){return u.isBodyLtr(document)},destroy:function(){e.destroy(this.domNode);this.domNode=null}});h={width:1,height:1,angle:1};var q={color:1,fontSize:1,fontFamily:1,fontWeight:1,fontStyle:1,textDecoration:1,backgroundColor:1,verticalAlign:1,horizontalAlign:1,
horizontalPadding:1,overrideStyle:1},y=f.mixin({},h,q),r={verticalAlign:"top",horizontalAlign:"left",horizontalPadding:0,angle:0};d=d(x,{viewModel:null,fieldCellClass:null,trimTextIfOverflows:!1,valueLabel:null,borderStyle:null,fieldStyle:null,content:null,postCreate:function(){this._buildLayoutFunc=this._buildLayoutFunc||w;this.inherited(arguments);this.setBorderStyle(this.borderStyle,!0);this.setStyle(this.fieldStyle);this.setContent(this.content);this.fieldCellClass&&(g.add(this.domNode,this.fieldCellClass),
g.add(this.contentBlock,"contentBlock_"+this.fieldCellClass))},_destroyExistingContent:function(){this.content&&(this.content.destroy&&this.content.destroy(),this.contentContainer&&e.empty(this.contentContainer))},getContentContainerNode:function(a){a||this._destroyExistingContent();this.contentContainer||(this.contentContainer=e.create("div",{"class":"valueField_valueBlock"},this.contentBlock,"first"));l.show(this.contentContainer);return this.contentContainer},setContent:function(a){this._destroyExistingContent();
if(this.content=a)this.getContentContainerNode(!0),(a=this.content.domNode||this.content)&&a.parentNode!==this.contentContainer&&e.place(a,this.contentContainer);l[this.content?"show":"hide"](this.contentContainer);l[this.content?"hide":"show"](this.valueContainer);this.content||this.set("value",this._value)},_value:null,_getValueAttr:function(){return this._value},_setValueAttr:function(a){this._value!==a&&(a=a||"",this._setValueLabelText(a),this._value=a)},_setValueLabelText:function(a){this.valueLabel&&
(k.checkValueLabelOverflow(this,a),this._setValueLabelTooltip(a));return a},_currentNumberValue:null,setNumberValue:function(a){this._currentNumberValue=a},setStyle:function(a){this.fieldStyle=this.fieldStyle||{};f.mixin(this.fieldStyle,a);this.fieldStyle.width&&this.setWidth(this.fieldStyle.width);this.fieldStyle.height&&this.setHeight(this.fieldStyle.height);this.domNode.style.textAlign=this.fieldStyle.horizontalAlign||r.horizontalAlign;this.valueLabel.style.paddingLeft="";this.valueLabel.style.paddingRight=
"";"number"===typeof this.fieldStyle.horizontalPadding&&(this.valueLabel.style.paddingLeft=this.fieldStyle.horizontalPadding+"px",this._allowRightPadding()&&(this.valueLabel.style.paddingRight=this.fieldStyle.horizontalPadding+"px"));this.valueContainer.style.verticalAlign=this.fieldStyle.verticalAlign||"";this.contentContainer&&(this.contentContainer.style.verticalAlign=this.fieldStyle.verticalAlign||"");a=t("webkit")?"webkitTransform":"transform";this.valueContainer.style[a]=0!==(Number(this.fieldStyle.angle)||
0)?"rotate("+this.fieldStyle.angle+"deg)":"";this._applyTextStyleToDom(this.domNode)},_allowRightPadding:function(){return this.viewModel&&this.viewModel.reportStyle!==v.CLASSIC},_supportedTextStyles:"color fontSize fontFamily fontWeight fontStyle textDecoration backgroundColor".split(" "),_supportedLayoutStyles:["horizontalAlign","verticalAlign","horizontalPadding","angle"],_applyTextStyleToDom:function(a){var b=this;this._supportedTextStyles.forEach(function(c){if(b.fieldStyle[c]){var d=b.fieldStyle[c]+
("fontSize"===c?"px":"");"backgroundColor"===c?b._setNodeBackgroundColor(a,d):a.style[c]=d}})},_setNodeBackgroundColor:function(a,b){(a===this.domNode&&this.fieldStyle.angle?this.valueContainer:a).style.backgroundColor=b;a===this.domNode&&this.fieldStyle.angle&&(this.domNode.style.backgroundColor="transparent")},getFullStyle:function(){return f.mixin({},r,this.fieldStyle)},_currentBorderKey:null,setBorderStyle:function(a,b){a=this.borderStyle=a||{};var c=this._getBorderKey(a);if(this._currentBorderKey!==
c){this._currentBorderKey=c;if(a.color){var c=function(b){return b+"px "+d+" "+a.color},d=a.style||"solid";this.domNode.style.border="";this.domNode.style.borderLeft=c(a.l);this.domNode.style.borderRight=c(a.r);this.domNode.style.borderTop=c(a.t);this.domNode.style.borderBottom=c(a.b)}else this.domNode.style.border="none";b||this._refreshLayout()}},_getBorderKey:function(a){return a.l+"_"+a.r+"_"+a.t+"_"+a.b+"_"+a.color+"_"+a.style},_getHorizontalPaddings:function(){return(this.borderStyle.l||0)+
(this.borderStyle.r||0)},_getVerticalPaddings:function(){return(this.borderStyle.t||0)+(this.borderStyle.b||0)},getWidth:function(){return this.fieldStyle.width||0},getContentWidth:function(){return this.getWidth()-this._getHorizontalPaddings()},setWidth:function(a){this.contentBlock&&this.domNode&&(a=Math.max(0,a),this.fieldStyle.width=a,this.domNode.style.width=a+"px",a=this.getContentWidth(),this.contentBlock.style.width=a+"px",this.valueContainer.style.width=a+"px",this.valueLabel.style.width=
a-(this.fieldStyle.horizontalPadding||0)*(this._allowRightPadding()?2:1)+"px",this.contentContainer&&(this.contentContainer.style.width=a+"px"),k.checkValueLabelOverflow(this),this.onWidthChanged())},getHeight:function(){return this.fieldStyle.height||0},getContentHeight:function(){return this.getHeight()-this._getVerticalPaddings()},setHeight:function(a){this.contentBlock&&this.domNode&&(a=Math.max(0,a),void 0!==this._minHeight&&(a=Math.max(a,this._minHeight)),this.fieldStyle.height=a,this.domNode.style.height=
a+"px",a=this.getContentHeight(),this.contentBlock.style.height=a+"px",this.valueContainer.style.height=a+"px",this.contentContainer&&(this.contentContainer.style.height=a+"px"),k.checkValueLabelOverflow(this),this.onHeightChanged())},getMinHeight:function(){return this._minHeight||0},_minHeight:void 0,setMinHeight:function(a){this._minHeight=a;this.domNode.style.minHeight=a+"px";a-=this._getVerticalPaddings();this.contentBlock.style.minHeight=a+"px";this.valueContainer.style.minHeight=a+"px";this.contentContainer&&
(this.contentContainer.style.minHeight=a+"px");k.checkValueLabelOverflow(this)},_refreshLayout:function(){this.setWidth(this.getWidth());this.setHeight(this.getHeight());void 0!==this._minHeight&&this.setMinHeight(this.getMinHeight())},_urlClickHandle:null,setUrl:function(a){this._urlClickHandle&&this._urlClickHandle.remove();this.valueLabel&&(g[a?"add":"remove"](this.valueLabel,"esriGEAdjustableGridValueFieldHyperLink"),a&&(this._urlClickHandle=m(this.valueLabel,"click",function(){p.openUrl(p.toHttpUrl(a))})))},
_setValueLabelTooltip:function(a){return n.setValueLabelTooltip(this,a)},_buildComplexTooltip:function(a,b,c){return n.buildComplexTooltip(this,a,b,c)},onWidthChanged:function(){},onHeightChanged:function(){},destroy:function(){this._destroyExistingContent();this.inherited(arguments)}});d.SUPPORTED_LAYOUT_STYLES=h;d.SUPPORTED_TEXT_STYLES=q;d.SUPPORTED_STYLES=y;return d});