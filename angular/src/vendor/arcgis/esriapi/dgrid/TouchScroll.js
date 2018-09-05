//>>built
define("dgrid/TouchScroll","dojo/_base/declare dojo/on ./util/touch ./util/has-css3 put-selector/put xstyle/css!./css/TouchScroll.css".split(" "),function(E,t,w,q,h){function x(b,a,d,e){var c=b.touchNode,k=n[b.id],f,l;"object"!==typeof a?(l=a,f=d,a=e,e=d=!0):(e="x"in a,d="y"in a,e&&d||(f=b.getScrollPosition()),l=e?a.x:f.x,f=d?a.y:f.y);c.style[g]=m+-l+"px,"+-f+"px"+p;k&&e&&b._scrollbarXNode&&(b._scrollbarXNode.style[g]=m+l*k.parentWidth/k.scrollWidth+"px,0"+p);k&&d&&b._scrollbarYNode&&(b._scrollbarYNode.style[g]=
m+"0,"+f*k.parentHeight/k.scrollHeight+"px"+p);t.emit(b.touchNode.parentNode,"scroll",{scrollLeft:l,scrollTop:f})}function A(b){return n[b.id]?F.exec(window.getComputedStyle(b.touchNode)[g]):y.exec(b.touchNode.style[g])}function G(b){var a=this.widget,a=[this.node,a._scrollbarXNode,a._scrollbarYNode],d=a.length;this.timer&&(clearTimeout(this.timer),this.timer=null);for(this.transitionHandler&&this.transitionHandler.remove();d--;)a[d]&&(a[d].style[r+"Duration"]="0");b&&b.preserveScrollbars||h(this.node.parentNode,
".touchscroll-fadeout");delete this.resetEffects}function H(b){var a=b.widget,d=a.touchNode,e=a.id,c=0,k=0,f;if(w.countCurrentTouches(b,d)===a.touchesToScroll){if(f=A(a))c=+f[1],k=+f[2];if(f=n[e])f.resetEffects&&f.resetEffects({preserveScrollbars:!0}),d.style[g]=m+c+"px,"+k+"px"+p,u[e]=f;b=b.targetTouches[0];f=n[e]={widget:a,node:d,startX:c-b.pageX,startY:k-b.pageY,lastX:c,lastY:k,pageX:b.pageX,pageY:b.pageY,tickFunc:function(){var a=n[e],b,c;a&&((b=y.exec(a.node.style[g]))?(c=+b[1],b=+b[2],a.velX=
c-a.lastX,a.velY=b-a.lastY,a.lastX=c,a.lastY=b):a.lastX=a.lastY=0,a.timer=setTimeout(a.tickFunc,50))}};f.timer=setTimeout(f.tickFunc,50)}}function I(b){var a=b.widget,d=a.id,e=a.touchesToScroll,c=n[d],k,f;if(c&&(k=w.countCurrentTouches(b,a.touchNode))===e){k=b.targetTouches;e=k[0];if(!c.scrollbarsShown&&(u[d]||Math.abs(e.pageX-c.pageX)>a.scrollThreshold||Math.abs(e.pageY-c.pageY)>a.scrollThreshold)){var d=a.touchNode,l=d.parentNode,g=l.offsetWidth-8,m=l.offsetHeight-8,p=c.scrollWidth=d.scrollWidth,
B=c.scrollHeight=d.scrollHeight,q=c.parentWidth=l.offsetWidth,r=c.parentHeight=l.offsetHeight;p>q?(a._scrollbarXNode||(f=h(l,"div.touchscroll-x")),f=a._scrollbarXNode=a._scrollbarXNode||h(f,"div.touchscroll-bar"),f.style.width=g*g/p+"px",f.style.left=d.offsetLeft+"px",h(l,".touchscroll-scrollable-x"),c.scrollableX=!0):h(l,"!touchscroll-scrollable-x");B>r?(a._scrollbarYNode||(f=h(l,"div.touchscroll-y")),f=a._scrollbarYNode=a._scrollbarYNode||h(f,"div.touchscroll-bar"),f.style.height=m*m/B+"px",f.style.top=
d.offsetTop+"px",h(l,".touchscroll-scrollable-y"),c.scrollableY=!0):h(l,"!touchscroll-scrollable-y");h(l,"!touchscroll-fadeout");c.scrollbarsShown=!0;for(f=k.length;f--;)k[f].touchScrolled=!0}c.scrollbarsShown&&(c.scrollableX||c.scrollableY)&&(b.preventDefault(),b=c.scrollableX?c.startX+e.pageX:0,e=c.scrollableY?c.startY+e.pageY:0,f=c.scrollableX?-(c.scrollWidth-c.parentWidth):0,c=c.scrollableY?-(c.scrollHeight-c.parentHeight):0,0<b?b/=2:b<f&&(b=f-(f-b)/2),0<e?e/=2:e<c&&(e=c-(c-e)/2),x(a,-b,-e))}else k>
e&&a.cancelTouchScroll()}function J(b){var a=b.widget,d=a.id;n[d]&&w.countCurrentTouches(b,a.touchNode)==a.touchesToScroll-1&&K(d)}function C(b,a,d){function e(){delete c.transitionHandler;c.resetEffects();delete n[b]}var c=n[b],k=c.widget,f=c.node,l=c.scrollableX?Math.max(Math.min(0,a),-(c.scrollWidth-c.parentWidth)):a,h=c.scrollableY?Math.max(Math.min(0,d),-(c.scrollHeight-c.parentHeight)):d;delete c.timer;l!=a||h!=d?(c.transitionHandler=t.once(f,L,e),f.style[r+"Duration"]=k.bounceDuration+"ms",
f.style[g]=m+l+"px,"+h+"px"+p,l!=a&&c.scrollableX&&(f=c.widget._scrollbarXNode,f.style[r+"Duration"]=k.bounceDuration+"ms",f.style[g]=a>l?m+"0,0"+p:m+(f.parentNode.offsetWidth-f.offsetWidth)+"px,0"+p),h!=d&&c.scrollableY&&(f=c.widget._scrollbarYNode,f.style[r+"Duration"]=k.bounceDuration+"ms",f.style[g]=d>h?m+"0,0"+p:m+"0,"+(f.parentNode.offsetHeight-f.offsetHeight)+"px"+p)):e()}function K(b){var a=n[b],d=u[b],e,c;delete u[b];a.timer&&clearTimeout(a.timer);a.resetEffects=G;(e=y.exec(a.node.style[g]))?
(c=+e[1],e=+e[2]):c=e=0;!a.velX&&!a.velY||(0<=c||c<=-(a.scrollWidth-a.parentWidth))&&(0<=e||e<=-(a.scrollHeight-a.parentHeight))?C(b,c,e):(d&&(d.velX||d.velY)&&(0>=a.velX&&0>=d.velX||0<=a.velX&&0<=d.velX)&&(0>=a.velY&&0>=d.velY||0<=a.velY&&0<=d.velY)&&(a.velX=1.15*(a.velX+d.velX),a.velY=1.15*(a.velY+d.velY)),a.lastX=c,a.lastY=e,a.calcFunc=function(){var a=n[b],c,d,e,g,h,m;if(a)if(c=a.widget,h=c.glideDecel(a.velX),m=c.glideDecel(a.velY),1<=Math.abs(h)||1<=Math.abs(m)){e=a.lastX+h;g=a.lastY+m;if(0<
e||e<-(a.scrollWidth-a.parentWidth))for(d=6;d--;)h=c.glideDecel(h);if(0<g||g<-(a.scrollHeight-a.parentHeight))for(d=6;d--;)m=c.glideDecel(m);x(c,-e,-g);a.lastX=e;a.lastY=g;a.velX=h;a.velY=m;a.timer=setTimeout(a.calcFunc,30)}else C(b,a.lastX,a.lastY)},a.timer=setTimeout(a.calcFunc,30))}var n={},u={},y=/^translate(?:3d)?\((-?\d+)(?:\.\d*)?(?:px)?, (-?\d+)/,F=/^matrix\(1, 0, 0, 1, (-?\d+)(?:\.\d*)?(?:px)?, (-?\d+)/,z=q("css-transitions"),L=q("transitionend"),v=q("css-transforms");q=q("css-transforms3d");
var D,r,g,m,p;q?(m="translate3d(",p=",0)"):v&&(m="translate(",p=")");if(!z||!m)return console.warn("CSS3 features unavailable for touch scroll effects."),function(){};g=q||v;g=!0===g?"transform":g+"Transform";r=!0===z?"transition":z+"Transition";D=!0===v?"":"-"+v.toLowerCase()+"-";return E("dgrid.TouchScroll",null,{touchesToScroll:1,touchNode:null,scrollThreshold:10,bounceDuration:300,postCreate:function(){this._initTouch();this.inherited(arguments)},_initTouch:function(){function b(){e.cancelTouchScroll()}
function a(a){return function(c){c.widget=e;c.cancelTouchScroll=b;a.call(this,c)}}var d=this.touchNode=this.touchNode||this.containerNode,e=this,c;d&&d.parentNode?(c=d.parentNode,c.style.overflow="hidden",d.style[r+"Property"]=D+"transform",d.style[r+"TimingFunction"]="cubic-bezier(0.33, 0.66, 0.66, 1)",this._touchScrollListeners=[t(c,"touchstart",a(H)),t(c,"touchmove",a(I)),t(c,"touchend,touchcancel",a(J))]):console.warn("TouchScroll requires a nested node upon which to operate.")},destroy:function(){for(var b=
this._touchScrollListeners.length;b--;)this._touchScrollListeners[b].remove();delete n[this.id];this.inherited(arguments)},scrollTo:function(b){var a=n[this.id],d=this.touchNode,e=d.parentNode;!b.preserveMomentum&&a&&a.resetEffects&&a.resetEffects();b.x&&(b.x=Math.max(0,Math.min(b.x,d.scrollWidth-e.offsetWidth)));b.y&&(b.y=Math.max(0,Math.min(b.y,d.scrollHeight-e.offsetHeight)));x(this,b)},getScrollPosition:function(){var b=A(this);return b?{x:-b[1],y:-b[2]}:{x:0,y:0}},cancelTouchScroll:function(){var b=
n[this.id];b&&(b.resetEffects?b.resetEffects():(b.timer&&clearTimeout(b.timer),h(b.node.parentNode,".touchscroll-fadeout")),delete n[this.id])},glideDecel:function(b){return.9*b}})});