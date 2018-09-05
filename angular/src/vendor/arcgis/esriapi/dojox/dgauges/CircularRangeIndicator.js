//>>built
define("dojox/dgauges/CircularRangeIndicator",["dojo/_base/declare","./ScaleIndicatorBase","./_circularUtils","dojo/_base/event"],function(r,t,q,v){return r("dojox.dgauges.CircularRangeIndicator",t,{start:0,radius:NaN,startThickness:6,endThickness:6,fill:null,stroke:null,constructor:function(){this.indicatorShapeFunc=null;this.fill=[255,120,0];this.stroke={color:"black",width:.2};this.interactionMode="none";this.addInvalidatingProperties("start radius startThickness endThickness fill stroke".split(" "))},
_interpolateColor:function(d,c,e){return((1-e)*(d>>16&255)+e*(c>>16&255)&255)<<16|((1-e)*(d>>8&255)+e*(c>>8&255)&255)<<8|(1-e)*(d&255)+e*(c&255)&255},_colorsInterpolation:function(d,c,e){for(var b=[],a=0,f=0;f<d.length-1;f++)a=(c[f+1]-c[f])*e,a=Math.round(a),b=b.concat(_colorInterpolation(d[f],d[f+1],a));return b},_alphasInterpolation:function(d,c,e){for(var b=[],a=0,f=0;f<d.length-1;f++)a=(c[f+1]-c[f])*e,a=Math.round(a),b=b.concat(_alphaInterpolation(d[f],d[f+1],a));return b},_alphaInterpolation:function(d,
c,e){c=(c-d)/(e-1);for(var b=[],a=0;a<e;a++)b.push(d+a*c);return b},_colorInterpolation:function(d,c,e){for(var b=[],a=0;a<e;a++)b.push(_interpolateColor(d,c,a/(e-1)));return b},_getEntriesFor:function(d,c){for(var e=[],b,a=0;a<d.length;a++)b=d[a],b=null==b[c]||isNaN(b[c])?a/(d.length-1):b[c],e.push(b);return e},_drawColorTrack:function(d,c,e,b,a,f,g,h,k,r,t,l){var m=.05;g=6.28318530718-q.computeAngle(f,g,a);isNaN(l)||(l=q.computeAngle(f,l,a),k*=l/g,g=l);l=Math.max(2,Math.floor(g/m));var m=g/l,u=
0;g=-h;var u=(h-k)/l,n;"clockwise"==a&&(m=-m);var p=[];a=c+Math.cos(f)*(b+g);h=e-Math.sin(f)*(b+g);p.push(a,h);for(k=0;k<l;k++)n=f+k*m,a=c+Math.cos(n+m)*(b+g+k*u),h=e-Math.sin(n+m)*(b+g+k*u),p.push(a,h);isNaN(n)&&(n=f);a=c+Math.cos(n+m)*(b+0+0*(l-1));h=e-Math.sin(n+m)*(b+0+0*(l-1));p.push(a,h);for(k=l-1;0<=k;k--)n=f+k*m,a=c+Math.cos(n+m)*(b+0+0*k),h=e-Math.sin(n+m)*(b+0+0*k),p.push(a,h);a=c+Math.cos(f)*(b+0);h=e-Math.sin(f)*(b+0);p.push(a,h);a=c+Math.cos(f)*(b+g);h=e-Math.sin(f)*(b+g);p.push(a,h);
d.createPolyline(p).setFill(r).setStroke(t)},refreshRendering:function(){this.inherited(arguments);var d=this._gfxGroup;d.clear();var c=this.scale.originX,e=this.scale.originY,b=isNaN(this.radius)?this.scale.radius:this.radius,a=this.scale.orientation,f=q.toRadians(360-this.scale.positionForValue(this.start)),g=isNaN(this._transitionValue)?this.value:this._transitionValue,g=q.toRadians(360-this.scale.positionForValue(g));this._drawColorTrack(d,c,e,b,a,f,g,this.startThickness,this.endThickness,this.fill,
this.stroke,NaN)},_onMouseDown:function(d){this.inherited(arguments);var c=this.scale._gauge._gaugeToPage(this.scale.originX,this.scale.originY);this.set("value",this.scale.valueForPosition(180*Math.atan2(d.pageY-c.y,d.pageX-c.x)/Math.PI));v.stop(d)},_onMouseMove:function(d){this.inherited(arguments);var c=this.scale._gauge._gaugeToPage(this.scale.originX,this.scale.originY);this.set("value",this.scale.valueForPosition(180*Math.atan2(d.pageY-c.y,d.pageX-c.x)/Math.PI))}})});