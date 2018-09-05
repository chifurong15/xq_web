//>>built
define("dojox/mobile/FixedSplitter","dojo/_base/array dojo/_base/declare dojo/_base/window dojo/dom-class dojo/dom-geometry dijit/_Contained dijit/_Container dijit/_WidgetBase dojo/has ./common".split(" "),function(m,t,n,h,d,u,v,w,x){return t("dojox.mobile.FixedSplitter",[w,v,u],{orientation:"H",variablePane:-1,screenSizeAware:!1,screenSizeAwareClass:"dojox/mobile/ScreenSizeAware",baseClass:"mblFixedSplitter",startup:function(){if(!this._started){h.add(this.domNode,this.baseClass+this.orientation);
var c=this.getParent(),a;if(!c||!c.resize){var d=this;a=function(){d.defer(function(){d.resize()})}}this.screenSizeAware?require([this.screenSizeAwareClass],function(c){c.getInstance();a&&a()}):a&&a();this.inherited(arguments)}},resize:function(){var c=d.getPadExtents(this.domNode).t,a="H"===this.orientation?"w":"h",h="H"===this.orientation?"l":"t",l={},q={},b,g,k=[],e=0,r=0,f=m.filter(this.domNode.childNodes,function(a){return 1==a.nodeType}),p=-1==this.variablePane?f.length-1:this.variablePane;
for(b=0;b<f.length;b++)b!=p&&(k[b]=d.getMarginBox(f[b])[a],r+=k[b]);"V"==this.orientation&&"BODY"==this.domNode.parentNode.tagName&&1==m.filter(n.body().childNodes,function(a){return 1==a.nodeType}).length&&(g=n.global.innerHeight||n.doc.documentElement.clientHeight);g=(g||d.getMarginBox(this.domNode)[a])-r;"V"===this.orientation&&(g-=c);q[a]=k[p]=g;a=f[p];d.setMarginBox(a,q);a.style["H"===this.orientation?"height":"width"]="";if(x("dojo-bidi")&&"H"==this.orientation&&!this.isLeftToRight())for(e=
g,b=f.length-1;0<=b;b--)a=f[b],l[h]=g-e,d.setMarginBox(a,l),"H"===this.orientation?a.style.top=c+"px":a.style.left="",e-=k[b];else for("V"===this.orientation&&(e=e?e+c:c),b=0;b<f.length;b++)a=f[b],l[h]=e,d.setMarginBox(a,l),"H"===this.orientation?a.style.top=c+"px":a.style.left="",e+=k[b];m.forEach(this.getChildren(),function(a){a.resize&&a.resize()})},_setOrientationAttr:function(c){var a=this.baseClass;h.replace(this.domNode,a+c,a+this.orientation);this.orientation=c;this._started&&this.resize()}})});