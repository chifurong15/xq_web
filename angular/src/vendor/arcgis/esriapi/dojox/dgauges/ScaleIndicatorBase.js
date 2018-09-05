//>>built
define("dojox/dgauges/ScaleIndicatorBase","dojo/_base/lang dojo/_base/declare dojo/_base/window dojo/on dojo/touch dojo/_base/fx dojox/gfx dojox/widget/_Invalidating ./IndicatorBase".split(" "),function(b,g,e,d,c,f,k,l,h){return g("dojox.dgauges.ScaleIndicatorBase",h,{scale:null,value:0,interactionArea:"gauge",interactionMode:"mouse",animationDuration:0,animationEaser:null,_indicatorShapeFuncFlag:!0,_interactionAreaFlag:!0,_downListeners:null,_cursorListeners:null,_moveAndUpListeners:null,_transitionValue:NaN,
_preventAnimation:!1,_animation:null,constructor:function(){this.watch("value",b.hitch(this,function(){this.valueChanged(this)}));this.watch("value",b.hitch(this,this._startAnimation));this.watch("interactionArea",b.hitch(this,function(){this._interactionAreaFlag=!0}));this.watch("interactionMode",b.hitch(this,function(){this._interactionAreaFlag=!0}));this.watch("indicatorShapeFunc",b.hitch(this,function(){this._indicatorShapeFuncFlag=!0}));this.addInvalidatingProperties(["scale","value","indicatorShapeFunc",
"interactionArea","interactionMode"]);this._downListeners=[];this._moveAndUpListeners=[];this._cursorListeners=[]},_startAnimation:function(a,c,d){0!==this.animationDuration&&(this._animation&&(this._preventAnimation||c==d)?this._animation.stop():(this._animation=new f.Animation({curve:[c,d],duration:this.animationDuration,easing:this.animationEaser?this.animationEaser:f._defaultEasing,onAnimate:b.hitch(this,this._updateAnimation),onEnd:b.hitch(this,this._endAnimation),onStop:b.hitch(this,this._endAnimation)}),
this._animation.play()))},_updateAnimation:function(a){this._transitionValue=a;this.invalidateRendering()},_endAnimation:function(){this._transitionValue=NaN;this.invalidateRendering()},refreshRendering:function(){null!==this._gfxGroup&&null!==this.scale&&(this._indicatorShapeFuncFlag&&b.isFunction(this.indicatorShapeFunc)&&(this._gfxGroup.clear(),this.indicatorShapeFunc(this._gfxGroup,this),this._indicatorShapeFuncFlag=!1),this._interactionAreaFlag&&(this._interactionAreaFlag=this._connectDownListeners()))},
valueChanged:function(a){d.emit(this,"valueChanged",{target:this,bubbles:!0,cancelable:!0})},_disconnectDownListeners:function(){for(var a=0;a<this._downListeners.length;a++)this._downListeners[a].remove();this._downListeners=[]},_disconnectMoveAndUpListeners:function(){for(var a=0;a<this._moveAndUpListeners.length;a++)this._moveAndUpListeners[a].remove();this._moveAndUpListeners=[]},_disconnectListeners:function(){this._disconnectDownListeners();this._disconnectMoveAndUpListeners();this._disconnectCursorListeners()},
_connectCursorListeners:function(a){var d=a.on(c.over,b.hitch(this,function(){this.scale._gauge._setCursor("pointer")}));this._cursorListeners.push(d);d=a.on(c.out,b.hitch(this,function(a){this.scale._gauge._setCursor("")}));this._cursorListeners.push(d)},_disconnectCursorListeners:function(){for(var a=0;a<this._cursorListeners.length;a++)this._cursorListeners[a].remove();this._cursorListeners=[]},_connectDownListeners:function(){this._disconnectDownListeners();this._disconnectCursorListeners();var a=
null;if("mouse"==this.interactionMode||"touch"==this.interactionMode)if("indicator"==this.interactionArea)a=this._gfxGroup.on(c.press,b.hitch(this,this._onMouseDown)),this._downListeners.push(a),this._connectCursorListeners(this._gfxGroup);else if("gauge"==this.interactionArea){if(!this.scale||!this.scale._gauge||!this.scale._gauge._gfxGroup)return!0;a=this.scale._gauge._gfxGroup.on(c.press,b.hitch(this,this._onMouseDown));this._downListeners.push(a);a=this._gfxGroup.on(c.press,b.hitch(this,this._onMouseDown));
this._downListeners.push(a);this._connectCursorListeners(this.scale._gauge._gfxGroup)}else if("area"==this.interactionArea){if(!this.scale||!this.scale._gauge||!this.scale._gauge._baseGroup)return!0;a=this.scale._gauge._baseGroup.on(c.press,b.hitch(this,this._onMouseDown));this._downListeners.push(a);a=this._gfxGroup.on(c.press,b.hitch(this,this._onMouseDown));this._downListeners.push(a);this._connectCursorListeners(this.scale._gauge._baseGroup)}return!1},_connectMoveAndUpListeners:function(){var a=
null,a=d(e.doc,c.move,b.hitch(this,this._onMouseMove));this._moveAndUpListeners.push(a);a=d(e.doc,c.release,b.hitch(this,this._onMouseUp));this._moveAndUpListeners.push(a)},_onMouseDown:function(a){this._connectMoveAndUpListeners();this._startEditing()},_onMouseMove:function(a){this._preventAnimation=!0;this._animation&&this._animation.stop()},_onMouseUp:function(a){this._disconnectMoveAndUpListeners();this._preventAnimation=!1;this._endEditing()},_startEditing:function(){if(this.scale&&this.scale._gauge)this.scale._gauge.onStartEditing({indicator:this})},
_endEditing:function(){if(this.scale&&this.scale._gauge)this.scale._gauge.onEndEditing({indicator:this})}})});