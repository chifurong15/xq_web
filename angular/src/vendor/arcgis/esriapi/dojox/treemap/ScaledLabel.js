//>>built
define("dojox/treemap/ScaledLabel",["dojo/_base/declare","dojo/dom-geometry","dojo/dom-construct","dojo/dom-style"],function(l,b,k,e){return l("dojox.treemap.ScaledLabel",null,{onRendererUpdated:function(a){if("leaf"==a.kind){a=a.renderer;var c=e.get(a,"fontSize");e.set(a.firstChild,"fontSize",c);for(var c=parseInt(c),d=.75*b.getContentBox(a).w/b.getMarginBox(a.firstChild).w,g=b.getContentBox(a).h/b.getMarginBox(a.firstChild).h,f=b.getContentBox(a).w-b.getMarginBox(a.firstChild).w,h=b.getContentBox(a).h-
b.getMarginBox(a.firstChild).h,d=Math.floor(c*Math.min(d,g));0<h&&0<f;)e.set(a.firstChild,"fontSize",d+"px"),f=b.getContentBox(a).w-b.getMarginBox(a.firstChild).w,h=b.getContentBox(a).h-b.getMarginBox(a.firstChild).h,c=d,d+=1;(0>h||0>f)&&e.set(a.firstChild,"fontSize",c+"px")}},createRenderer:function(a,b,d){var c=this.inherited(arguments);if("leaf"==d){var f=k.create("div");e.set(f,{position:"absolute",width:"auto"});k.place(f,c)}return c},styleRenderer:function(a,b,d,g){"leaf"!=g?this.inherited(arguments):
(e.set(a,"background",this.getColorForItem(b).toHex()),a.firstChild.innerHTML=this.getLabelForItem(b))}})});