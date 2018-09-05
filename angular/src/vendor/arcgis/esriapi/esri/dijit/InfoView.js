// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://js.arcgis.com/3.24/esri/copyright.txt for details.
//>>built
define("esri/dijit/InfoView","dojo/_base/declare dojo/_base/lang dojo/_base/array dojo/_base/connect dojo/_base/kernel dojo/has dojo/query dojo/dom dojo/dom-class dojo/dom-construct dojo/dom-geometry ../kernel ./_TouchBase".split(" "),function(h,n,p,d,q,r,w,t,l,e,m,u,v){h=h(null,{declaredClass:"esri.dijit.InfoView",_items:[],_top:null,_sections:[],_isDecelerate:!1,constructor:function(a,c){var b;this.container=t.byId(c);this._touchBase=v(this.container,null);this._slideDiv=e.create("div",null,this.container,
"first");this.events=[];this._items=a.items;a.sections&&(this._sections=a.sections);l.add(this.container,"esriMobileInfoView");if(0===this._sections.length)e.create("div",{},this._slideDiv);else for(b=0;b<this._sections.length;b++){var k=e.create("div",{"class":"esriMobileInfoViewSection"},this._slideDiv);e.create("div",{innerHTML:this._sections[b].title},k)}for(b=0;b<this._items.length;b++){var f,k=0;this._items[b].section&&(k=this._items[b].section);switch(this._items[b].type){case "div":f=e.create("div",
{"class":"esriMobileInfoViewItem",style:this._items[b].style},this._slideDiv.childNodes[k]),f=e.create("div",{innerHTML:this._items[b].text},f)}this._items[b].className&&l.add(f,this._items[b].className);f._index=b;f._item=this._items[b];this._items[b]._node=f}this.startTouchY=0},startup:function(){this.onCreate(this._items);this._animateTo(0)},destroy:function(){p.forEach(this.events,d.disconnect);this._touchBase=null;q.query("img",this.container).forEach(function(a){a._index=null;a._item=null;e.destroy(a);
a=null});this._items=null;e.destroy(this._slideDiv);e.destroy(this.container);this.container=this._slideDiv=null},getItems:function(){return this._items},setPreventDefault:function(a){this._touchBase.setPreventDefault(a)},enableTouchScroll:function(){this._touchBase.setPreventDefault(!0);this.events.push(d.connect(this._touchBase,"onTouchStart",this,this._onTouchStartHandler));this.events.push(d.connect(this._touchBase,"onTouchMove",this,this._onTouchMoveHandler));this.events.push(d.connect(this._touchBase,
"onTouchEnd",this,this._onTouchEndHandler));this._slideDiv.style.webkitTransform="translate3d(0,"+this._top+"px, 0)"},disableTouchScroll:function(){d.disconnect(this.events.pop());d.disconnect(this.events.pop());d.disconnect(this.events.pop());this._touchBase.setPreventDefault(!1);this._slideDiv.style.webkitTransform="translate3d(0, 0px, 0)"},animateTo:function(){this._slideDiv.style.WebkitTransitionDuration="0s";this._animateTo(0)},onSelect:function(a){},onUnSelect:function(a){},onCreate:function(a){},
onClick:function(a){},onSwipeLeft:function(){},onSwipeRight:function(){},_onTouchStartHandler:function(a){this._slideDiv.style.WebkitTransitionDuration="0s";this._moveDirection=null;this._startTime=new Date;this.startTouchY=a.touches[0].clientY;this.contentStartOffsetY=this.contentOffsetY},_onTouchMoveHandler:function(a){this._moveDirection||(this._moveDirection=Math.abs(a.curY)>Math.abs(a.curX)?"vertical":"horizontal");"horizontal"!==this._moveDirection&&"vertical"===this._moveDirection&&this._animateTo(a.touches[0].clientY-
this.startTouchY+this.contentStartOffsetY)},_onTouchEndHandler:function(a){this._endTime=new Date;this._deltaMovement=a.curY;if("vertical"===this._moveDirection)this._shouldStartMomentum()?this._doMomentum():this._snapToBounds();else if("horizontal"===this._moveDirection)if("left"===a.swipeDirection)this.onSwipeLeft();else if("right"===a.swipeDirection)this.onSwipeRight()},_shouldStartMomentum:function(){this._diff=this._endTime-this._startTime;this._velocity=this._deltaMovement/this._diff;return.2<
Math.abs(this._velocity)&&200>this._diff?!0:!1},_doMomentum:function(){var a,c;a=m.getContentBox(this.container);var b=0>this._velocity?.001:-.001;c=-(this._velocity*this._velocity)/(2*b);var e=-this._velocity/b,b=3*.6-0,f=1-b,g=0,d=0;if(a.h>this._slideDiv.scrollHeight)this.contentOffsetY=0,d=300;else if(0<this.contentOffsetY+c){a=0;for(c=Math.floor(e/20);a<c;a++)if(g=(20*f*a^3)+(20*b*a^2)+0*a+0,g=0>this._velocity?-g:g,0<this.contentOffsetY+g){d=20*a;break}0===d&&(d=300);this.contentOffsetY=0}else if(Math.abs(this.contentOffsetY+
c)+a.h>this._slideDiv.scrollHeight)for(this.contentOffsetY=a.h-this._slideDiv.scrollHeight,a=0,c=Math.floor(e/20);a<c;a++){if(g=(20*f*a^3)+(20*b*a^2)+0*a+0,g=0>this._velocity?-g:g,Math.abs(this.contentOffsetY+g)>this._slideDiv.scrollHeight){d=20*a;break}}else d=e,this.contentOffsetY+=c;this._slideDiv.style.webkitTransition="-webkit-transform "+d+"ms cubic-bezier(0, 0.3, 0.6, 1)";this._animateTo(this.contentOffsetY)},_snapToBounds:function(){var a=m.getContentBox(this.container);a.h>this._slideDiv.scrollHeight?
this.contentOffsetY=0:0<this.contentOffsetY?this.contentOffsetY=0:Math.abs(this.contentOffsetY)+a.h>this._slideDiv.scrollHeight&&(this.contentOffsetY=a.h-this._slideDiv.scrollHeight);this._slideDiv.style.WebkitTransitionDuration="0.5s";this._animateTo(this.contentOffsetY)},_animateTo:function(a){this.contentOffsetY=a;this._slideDiv.style.webkitTransform="translate3d(0, "+a+"px, 0)"},_stopMomentum:function(){if(this._isDecelerating()){var a=document.defaultView.getComputedStyle(this._slideDiv,null),
a=new WebKitCSSMatrix(a.webkitTransform);this._slideDiv.style.webkitTransition="";this.animateTo(a.m42)}},_isDecelerating:function(){return this.isDecelerate?!0:!1},_toggleNode:function(a,c){"ON"===c.toggleState?(c.toggleState="OFF",c.src&&(a.src=c.src.toString()),this.onUnSelect(c)):(c.toggleState="ON",c.srcAlt&&(a.src=c.srcAlt),this.onSelect(c))}});r("extend-esri")&&n.setObject("dijit.InfoView",h,u);return h});