//>>built
define("dojox/mobile/Heading","dojo/_base/array dojo/_base/connect dojo/_base/declare dojo/_base/lang dojo/_base/window dojo/dom-class dojo/dom-construct dojo/dom-style dojo/dom-attr dijit/registry ./common dijit/_Contained dijit/_Container dijit/_WidgetBase ./ProgressIndicator ./ToolBarButton ./View dojo/has dojo/has!dojo-bidi?dojox/mobile/bidi/Heading".split(" "),function(h,f,k,l,q,m,c,g,n,z,r,t,u,v,w,x,A,p,y){l.getObject("dojox.mobile",!0);f=k(p("dojo-bidi")?"dojox.mobile.NonBidiHeading":"dojox.mobile.Heading",
[v,u,t],{back:"",href:"",moveTo:"",transition:"slide",label:"",iconBase:"",tag:"h1",busy:!1,progStyle:"mblProgWhite",baseClass:"mblHeading",buildRendering:function(){this.templateString||(this.domNode=this.containerNode=this.srcNodeRef||q.doc.createElement(this.tag));this.inherited(arguments);this.templateString||(this.label||h.forEach(this.domNode.childNodes,function(a){if(3==a.nodeType){var b=l.trim(a.nodeValue);b&&(this.label=b,this.labelNode=c.create("span",{innerHTML:b},a,"replace"))}},this),
this.labelNode||(this.labelNode=c.create("span",null,this.domNode)),this.labelNode.className="mblHeadingSpanTitle",this.labelDivNode=c.create("div",{className:"mblHeadingDivTitle",innerHTML:this.labelNode.innerHTML},this.domNode));this.labelDivNode&&(n.set(this.labelDivNode,"role","heading"),n.set(this.labelDivNode,"aria-level","1"));r.setSelectable(this.domNode,!1)},startup:function(){if(!this._started){var a=this.getParent&&this.getParent();if(!a||!a.resize){var b=this;b.defer(function(){b.resize()})}this.inherited(arguments)}},
resize:function(){if(this.labelNode){for(var a,b,e=this.containerNode.childNodes,c=e.length-1;0<=c;c--){var d=e[c];1===d.nodeType&&"none"!==g.get(d,"display")&&(b||"right"!==g.get(d,"float")||(b=d),a||"left"!==g.get(d,"float")||(a=d))}!this.labelNodeLen&&this.label&&(this.labelNode.style.display="inline",this.labelNodeLen=this.labelNode.offsetWidth,this.labelNode.style.display="");e=this.domNode.offsetWidth;m[e-2*Math.max(b?e-b.offsetLeft+5:0,a?a.offsetLeft+a.offsetWidth+5:0)>(this.labelNodeLen||
0)?"add":"remove"](this.domNode,"mblHeadingCenterTitle")}h.forEach(this.getChildren(),function(a){a.resize&&a.resize()})},_setBackAttr:function(a){this._set("back",a);this.backButton?this.backButton.set("label",a):(this.backButton=new x({arrow:"left",label:a,moveTo:this.moveTo,back:!this.moveTo&&!this.href,href:this.href,transition:this.transition,transitionDir:-1,dir:this.isLeftToRight()?"ltr":"rtl"}),this.backButton.placeAt(this.domNode,"first"));this.resize()},_setMoveToAttr:function(a){this._set("moveTo",
a);this.backButton&&(this.backButton.set("moveTo",a),this.backButton.set("back",!a&&!this.href))},_setHrefAttr:function(a){this._set("href",a);this.backButton&&(this.backButton.set("href",a),this.backButton.set("back",!this.moveTo&&!a))},_setTransitionAttr:function(a){this._set("transition",a);this.backButton&&this.backButton.set("transition",a)},_setLabelAttr:function(a){this._set("label",a);this.labelNode.innerHTML=this.labelDivNode.innerHTML=this._cv?this._cv(a):a;delete this.labelNodeLen},_setBusyAttr:function(a){var b=
this._prog;a?(b||(b=this._prog=new w({size:30,center:!1}),m.add(b.domNode,this.progStyle)),c.place(b.domNode,this.domNode,"first"),b.start()):b&&b.stop();this._set("busy",a)}});return p("dojo-bidi")?k("dojox.mobile.Heading",[f,y]):f});