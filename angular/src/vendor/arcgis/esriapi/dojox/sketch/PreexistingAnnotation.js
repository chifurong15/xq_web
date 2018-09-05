//>>built
define("dojox/sketch/PreexistingAnnotation",["dojo/_base/kernel","dojo/_base/lang","./Annotation","./Anchor"],function(b){b.getObject("sketch",!0,dojox);var d=dojox.sketch;d.PreexistingAnnotation=function(a,b){d.Annotation.call(this,a,b);this.transform={dx:0,dy:0};this.start={x:0,y:0};this.end={x:200,y:200};this.radius=8;this.textPosition={x:196,y:196};this.textOffset=4;this.textAlign="end";this.labelShape=this.rectShape=null;this.anchors.start=new d.Anchor(this,"start");this.anchors.end=new d.Anchor(this,
"end")};d.PreexistingAnnotation.prototype=new d.Annotation;b=d.PreexistingAnnotation.prototype;b.constructor=d.PreexistingAnnotation;b.type=function(){return"Preexisting"};b.getType=function(){return d.PreexistingAnnotation};b._pos=function(){var a=Math.max(this.start.x,this.end.x),b=Math.max(this.start.y,this.end.y);this.start={x:Math.min(this.start.x,this.end.x),y:Math.min(this.start.y,this.end.y)};this.end={x:a,y:b};this.textPosition={x:this.end.x-this.textOffset,y:this.end.y-this.textOffset}};
b.apply=function(a){if(a){a.documentElement&&(a=a.documentElement);this.readCommonAttrs(a);for(var b=0;b<a.childNodes.length;b++){var c=a.childNodes[b];if("text"==c.localName)this.property("label",c.childNodes.length?c.childNodes[0].nodeValue:"");else if("rect"==c.localName){null!==c.getAttribute("x")&&(this.start.x=parseFloat(c.getAttribute("x"),10));null!==c.getAttribute("width")&&(this.end.x=parseFloat(c.getAttribute("width"),10)+parseFloat(c.getAttribute("x"),10));null!==c.getAttribute("y")&&
(this.start.y=parseFloat(c.getAttribute("y"),10));null!==c.getAttribute("height")&&(this.end.y=parseFloat(c.getAttribute("height"),10)+parseFloat(c.getAttribute("y"),10));null!==c.getAttribute("r")&&(this.radius=parseFloat(c.getAttribute("r"),10));var d=this.property("stroke"),c=c.getAttribute("style"),e=c.match(/stroke:([^;]+);/);e&&(d.color=e[1],this.property("fill",e[1]));if(e=c.match(/stroke-width:([^;]+);/))d.width=e[1];this.property("stroke",d)}}}};b.initialize=function(a){this.apply(a);this._pos();
this.shape=this.figure.group.createGroup();this.shape.getEventSource().setAttribute("id",this.id);this.rectShape=this.shape.createRect({x:this.start.x,y:this.start.y,width:this.end.x-this.start.x,height:this.end.y-this.start.y,r:this.radius}).setFill([255,255,255,.1]);this.rectShape.getEventSource().setAttribute("shape-rendering","crispEdges");this.labelShape=this.shape.createText({x:this.textPosition.x,y:this.textPosition.y,text:this.property("label"),align:this.textAlign}).setFill(this.property("fill"));
this.labelShape.getEventSource().setAttribute("id",this.id+"-labelShape");this.draw()};b.destroy=function(){this.shape&&(this.shape.remove(this.rectShape),this.shape.remove(this.labelShape),this.figure.group.remove(this.shape),this.shape=this.rectShape=this.labelShape=null)};b.getBBox=function(){var a=Math.min(this.start.x,this.end.x),b=Math.min(this.start.y,this.end.y);return{x:a-2,y:b-2,width:Math.max(this.start.x,this.end.x)-a+4,height:Math.max(this.start.y,this.end.y)-b+4}};b.draw=function(a){this.apply(a);
this._pos();this.shape.setTransform(this.transform);this.rectShape.setShape({x:this.start.x,y:this.start.y,width:this.end.x-this.start.x,height:this.end.y-this.start.y,r:this.radius}).setFill([255,255,255,.1]);this.labelShape.setShape({x:this.textPosition.x,y:this.textPosition.y,text:this.property("label")}).setFill(this.property("fill"));this.zoom()};b.zoom=function(a){this.rectShape&&(a=a||this.figure.zoomFactor,d.Annotation.prototype.zoom.call(this,a),a="vml"==dojox.gfx.renderer?1:a,this.rectShape.setStroke({color:this.property("fill"),
width:1/a}))};b.serialize=function(){var a=this.property("stroke");return"\x3cg "+this.writeCommonAttrs()+'\x3e\x3crect style\x3d"stroke:'+a.color+';stroke-width:1;fill:none;" x\x3d"'+this.start.x+'" width\x3d"'+(this.end.x-this.start.x)+'" y\x3d"'+this.start.y+'" height\x3d"'+(this.end.y-this.start.y)+'" rx\x3d"'+this.radius+'" ry\x3d"'+this.radius+'"  /\x3e\x3ctext style\x3d"fill:'+a.color+";text-anchor:"+this.textAlign+'" font-weight\x3d"bold" x\x3d"'+this.textPosition.x+'" y\x3d"'+this.textPosition.y+
'"\x3e'+this.property("label")+"\x3c/text\x3e\x3c/g\x3e"};d.Annotation.register("Preexisting");return dojox.sketch.PreexistingAnnotation});