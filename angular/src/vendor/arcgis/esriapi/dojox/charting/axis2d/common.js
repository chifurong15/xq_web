//>>built
define("dojox/charting/axis2d/common",["dojo/_base/lang","dojo/_base/window","dojo/dom-geometry","dojox/gfx","dojo/has"],function(h,g,t,q,u){var p=h.getObject("dojox.charting.axis2d.common",!0),r=function(b){b.marginLeft="0px";b.marginTop="0px";b.marginRight="0px";b.marginBottom="0px";b.paddingLeft="0px";b.paddingTop="0px";b.paddingRight="0px";b.paddingBottom="0px";b.borderLeftWidth="0px";b.borderTopWidth="0px";b.borderRightWidth="0px";b.borderBottomWidth="0px"};return h.mixin(p,{createText:{gfx:function(b,
c,e,g,k,l,m,n){return c.createText({x:e,y:g,text:l,align:k}).setFont(m).setFill(n)},html:function(b,c,e,h,k,l,m,n,d){c=g.doc.createElement("div");var a=c.style,f;b.getTextDir&&(c.dir=b.getTextDir(l));r(a);a.font=m;c.innerHTML=String(l).replace(/\s/g,"\x26nbsp;");a.color=n;a.position="absolute";a.left="-10000px";g.body().appendChild(c);var p=q.normalizedLength(q.splitFontString(m).size);d||(c.getBoundingClientRect?(f=c.getBoundingClientRect(),f=f.width||f.right-f.left):f=t.getMarginBox(c).w);"rtl"==
c.dir&&(e+=d?d:f);g.body().removeChild(c);a.position="relative";if(d)switch(a.width=d+"px",k){case "middle":a.textAlign="center";a.left=e-d/2+"px";break;case "end":a.textAlign="right";a.left=e-d+"px";break;default:a.left=e+"px",a.textAlign="left"}else switch(k){case "middle":a.left=Math.floor(e-f/2)+"px";break;case "end":a.left=Math.floor(e-f)+"px";break;default:a.left=Math.floor(e)+"px"}a.top=Math.floor(h-p)+"px";a.whiteSpace="nowrap";d=g.doc.createElement("div");a=d.style;r(a);a.width="0px";a.height=
"0px";d.appendChild(c);b.node.insertBefore(d,b.node.firstChild);u("dojo-bidi")&&b.htmlElementsRegistry.push([d,e,h,k,l,m,n]);return d}}})});