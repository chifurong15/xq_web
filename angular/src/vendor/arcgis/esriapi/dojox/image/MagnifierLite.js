//>>built
define("dojox/image/MagnifierLite","dojo/_base/kernel dojo/_base/declare dijit/_Widget dojo/dom-construct dojo/dom-style dojo/dom-geometry dojo/_base/window dojo/_base/lang".split(" "),function(f,g,h,d,b,k,e,l){f.experimental("dojox.image.MagnifierLite");return g("dojox.image.MagnifierLite",h,{glassSize:125,scale:6,postCreate:function(){this.inherited(arguments);this._adjustScale();this._createGlass();this.connect(this.domNode,"onmouseenter","_showGlass");this.connect(this.glassNode,"onmousemove",
"_placeGlass");this.connect(this.img,"onmouseout","_hideGlass");this.connect(e,"onresize","_adjustScale")},_createGlass:function(){var a=this.glassNode=d.create("div",{style:{height:this.glassSize+"px",width:this.glassSize+"px"},className:"glassNode"},e.body());this.surfaceNode=a.appendChild(d.create("div"));this.img=d.place(l.clone(this.domNode),a);b.set(this.img,{position:"relative",top:0,left:0,width:this._zoomSize.w+"px",height:this._zoomSize.h+"px"})},_adjustScale:function(){this.offset=k.position(this.domNode,
!0);console.dir(this.offset);this._imageSize={w:this.offset.w,h:this.offset.h};this._zoomSize={w:this._imageSize.w*this.scale,h:this._imageSize.h*this.scale}},_showGlass:function(a){this._placeGlass(a);b.set(this.glassNode,{visibility:"visible",display:""})},_hideGlass:function(a){b.set(this.glassNode,{visibility:"hidden",display:"none"})},_placeGlass:function(a){this._setImage(a);var c=Math.floor(this.glassSize/2);b.set(this.glassNode,{top:Math.floor(a.pageY-c)+"px",left:Math.floor(a.pageX-c)+"px"})},
_setImage:function(a){var c=(a.pageX-this.offset.x)/this.offset.w;a=(a.pageY-this.offset.y)/this.offset.h;b.set(this.img,{top:this._zoomSize.h*a*-1+this.glassSize*a+"px",left:this._zoomSize.w*c*-1+this.glassSize*c+"px"})},destroy:function(a){d.destroy(this.glassNode);this.inherited(arguments)}})});