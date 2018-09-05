//>>built
define("dojox/form/_RangeSliderMixin","dojo/_base/declare dojo/_base/lang dojo/_base/array dojo/_base/fx dojo/_base/event dojo/_base/sniff dojo/dom-style dojo/dom-geometry dojo/keys dijit dojo/dnd/Mover dojo/dnd/Moveable dijit/form/_FormValueWidget dijit/focus dojo/fx dojox/fx".split(" "),function(k,g,v,n,h,p,w,f,l,t,m,u,x,q,y){var r=function(b,a){return b-a};t=k("dojox.form._RangeSliderMixin",null,{_setTabIndexAttr:["sliderHandle","sliderHandleMax"],value:[0,100],postMixInProperties:function(){this.inherited(arguments);
this.value=v.map(this.value,function(b){return parseInt(b,10)})},postCreate:function(){this.inherited(arguments);this.value.sort(r);var b=this,a=k(z,{constructor:function(){this.widget=b}});this._movableMax=new u(this.sliderHandleMax,{mover:a});this.sliderHandle.setAttribute("aria-valuemin",this.minimum);this.sliderHandle.setAttribute("aria-valuemax",this.maximum);this.sliderHandleMax.setAttribute("aria-valuemin",this.minimum);this.sliderHandleMax.setAttribute("aria-valuemax",this.maximum);a=k(A,
{constructor:function(){this.widget=b}});this._movableBar=new u(this.progressBar,{mover:a});this.focusNode.removeAttribute("aria-valuemin");this.focusNode.removeAttribute("aria-valuemax");this.focusNode.removeAttribute("aria-valuenow")},destroy:function(){this.inherited(arguments);this._movableMax.destroy();this._movableBar.destroy()},_onKeyPress:function(b){if(!(this.disabled||this.readOnly||b.altKey||b.ctrlKey)){var a=b.target===this.sliderHandleMax,c=b.target===this.progressBar,d=g.delegate(l,
this.isLeftToRight()?{PREV_ARROW:l.LEFT_ARROW,NEXT_ARROW:l.RIGHT_ARROW}:{PREV_ARROW:l.RIGHT_ARROW,NEXT_ARROW:l.LEFT_ARROW}),e=0,f=!1;switch(b.keyCode){case d.HOME:this._setValueAttr(this.minimum,!0,a);h.stop(b);return;case d.END:this._setValueAttr(this.maximum,!0,a);h.stop(b);return;case d.PREV_ARROW:case d.DOWN_ARROW:f=!0;case d.NEXT_ARROW:case d.UP_ARROW:e=1;break;case d.PAGE_DOWN:f=!0;case d.PAGE_UP:e=this.pageIncrement;break;default:this.inherited(arguments);return}f&&(e=-e);e&&(c?this._bumpValue([{change:e,
useMaxValue:!1},{change:e,useMaxValue:!0}]):this._bumpValue(e,a),h.stop(b))}},_onHandleClickMax:function(b){this.disabled||this.readOnly||(p("ie")||q.focus(this.sliderHandleMax),h.stop(b))},_onClkIncBumper:function(){this._setValueAttr(!1===this._descending?this.minimum:this.maximum,!0,!0)},_bumpValue:function(b,a){var c=g.isArray(b)?[this._getBumpValue(b[0].change,b[0].useMaxValue),this._getBumpValue(b[1].change,b[1].useMaxValue)]:this._getBumpValue(b,a);this._setValueAttr(c,!0,a)},_getBumpValue:function(b,
a){var c=a?1:0,d=w.getComputedStyle(this.sliderBarContainer),e=f.getContentBox(this.sliderBarContainer,d),d=this.discreteValues,c=this.value[c];if(1>=d||Infinity==d)d=e[this._pixelCount];d--;c=this.maximum>this.minimum?(c-this.minimum)*d/(this.maximum-this.minimum)+b:0;0>c&&(c=0);c>d&&(c=d);return c*(this.maximum-this.minimum)/d+this.minimum},_onBarClick:function(b){this.disabled||this.readOnly||(p("ie")||q.focus(this.progressBar),h.stop(b))},_onRemainingBarClick:function(b){if(!this.disabled&&!this.readOnly){p("ie")||
q.focus(this.progressBar);var a=f.position(this.sliderBarContainer,!0),c=f.position(this.progressBar,!0),d=b[this._mousePixelCoord],e=c[this._startingPixelCoord],c=e+c[this._pixelCount],e=this._isReversed()?d<=e:d>=c,d=this._isReversed()?a[this._pixelCount]-d+a[this._startingPixelCoord]:d-a[this._startingPixelCoord];this._setPixelValue(d,a[this._pixelCount],!0,e);h.stop(b)}},_setPixelValue:function(b,a,c,d){this.disabled||this.readOnly||(b=this._getValueByPixelValue(b,a),this._setValueAttr(b,c,d))},
_getValueByPixelValue:function(b,a){var c=this.discreteValues;if(1>=c||Infinity==c)c=a;c--;return(this.maximum-this.minimum)*Math.round((0>b?0:a<b?a:b)/(a/c))/c+this.minimum},_setValueAttr:function(b,a,c){var d=g.clone(this.value);g.isArray(b)?d=b:d[c?1:0]=b;this._lastValueReported="";this.valueNode.value=b=d;d.sort(r);this.sliderHandle.setAttribute("aria-valuenow",d[0]);this.sliderHandleMax.setAttribute("aria-valuenow",d[1]);x.prototype._setValueAttr.apply(this,arguments);this._printSliderBar(a,
c)},_printSliderBar:function(b,a){var c=this.maximum>this.minimum?(this.value[0]-this.minimum)/(this.maximum-this.minimum):0,d=this.maximum>this.minimum?(this.value[1]-this.minimum)/(this.maximum-this.minimum):0,e=c;c>d&&(c=d,d=e);var f=this._isReversed()?100*(1-c):100*c,g=this._isReversed()?100*(1-d):100*d,h=this._isReversed()?100*(1-d):100*c;if(b&&0<this.slideDuration&&this.progressBar.style[this._progressPixelSize]){if(parseFloat(this.progressBar.style[this._handleOffsetCoord]),e=this.slideDuration/
10,0!==e){0>e&&(e=0-e);var k={},l={},m={};k[this._handleOffsetCoord]={start:this.sliderHandle.parentNode.style[this._handleOffsetCoord],end:f,units:"%"};l[this._handleOffsetCoord]={start:this.sliderHandleMax.parentNode.style[this._handleOffsetCoord],end:g,units:"%"};m[this._handleOffsetCoord]={start:this.progressBar.style[this._handleOffsetCoord],end:h,units:"%"};m[this._progressPixelSize]={start:this.progressBar.style[this._progressPixelSize],end:100*(d-c),units:"%"};c=n.animateProperty({node:this.sliderHandle.parentNode,
duration:e,properties:k});d=n.animateProperty({node:this.sliderHandleMax.parentNode,duration:e,properties:l});e=n.animateProperty({node:this.progressBar,duration:e,properties:m});y.combine([c,d,e]).play()}}else this.sliderHandle.parentNode.style[this._handleOffsetCoord]=f+"%",this.sliderHandleMax.parentNode.style[this._handleOffsetCoord]=g+"%",this.progressBar.style[this._handleOffsetCoord]=h+"%",this.progressBar.style[this._progressPixelSize]=100*(d-c)+"%"}});var z=k("dijit.form._SliderMoverMax",
m,{onMouseMove:function(b){var a=this.widget,c=a._abspos;c||(c=a._abspos=f.position(a.sliderBarContainer,!0),a._setPixelValue_=g.hitch(a,"_setPixelValue"),a._isReversed_=a._isReversed());b=b[a._mousePixelCoord]-c[a._startingPixelCoord];a._setPixelValue_(a._isReversed_?c[a._pixelCount]-b:b,c[a._pixelCount],!1,!0)},destroy:function(b){m.prototype.destroy.apply(this,arguments);var a=this.widget;a._abspos=null;a._setValueAttr(a.value,!0)}}),A=k("dijit.form._SliderBarMover",m,{onMouseMove:function(b){var a=
this.widget;if(!a.disabled&&!a.readOnly){var c=a._abspos,d=a._bar,e=a._mouseOffset;c||(c=a._abspos=f.position(a.sliderBarContainer,!0),a._setPixelValue_=g.hitch(a,"_setPixelValue"),a._getValueByPixelValue_=g.hitch(a,"_getValueByPixelValue"),a._isReversed_=a._isReversed());d||(d=a._bar=f.position(a.progressBar,!0));e||(e=a._mouseOffset=b[a._mousePixelCoord]-d[a._startingPixelCoord]);b=b[a._mousePixelCoord]-c[a._startingPixelCoord]-e;pixelValues=[b,b+d[a._pixelCount]];pixelValues.sort(r);0>=pixelValues[0]&&
(pixelValues[0]=0,pixelValues[1]=d[a._pixelCount]);pixelValues[1]>=c[a._pixelCount]&&(pixelValues[1]=c[a._pixelCount],pixelValues[0]=c[a._pixelCount]-d[a._pixelCount]);c=[a._getValueByPixelValue(a._isReversed_?c[a._pixelCount]-pixelValues[0]:pixelValues[0],c[a._pixelCount]),a._getValueByPixelValue(a._isReversed_?c[a._pixelCount]-pixelValues[1]:pixelValues[1],c[a._pixelCount])];a._setValueAttr(c,!1,!1)}},destroy:function(){m.prototype.destroy.apply(this,arguments);var b=this.widget;b._abspos=null;
b._bar=null;b._mouseOffset=null;b._setValueAttr(b.value,!0)}});return t});