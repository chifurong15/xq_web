//>>built
define("dojox/mobile/PageIndicator","dojo/_base/connect dojo/_base/declare dojo/dom dojo/dom-class dojo/dom-construct dijit/registry dijit/_Contained dijit/_WidgetBase dojo/i18n!dojox/mobile/nls/messages".split(" "),function(e,k,l,g,h,m,n,p,q){return k("dojox.mobile.PageIndicator",[p,n],{refId:"",baseClass:"mblPageIndicator",buildRendering:function(){this.inherited(arguments);this.domNode.setAttribute("role","img");this._tblNode=h.create("table",{className:"mblPageIndicatorContainer"},this.domNode);
this._tblNode.insertRow(-1);this.connect(this.domNode,"onclick","_onClick");this.subscribe("/dojox/mobile/viewChanged",function(a){this.reset()})},startup:function(){var a=this;a.defer(function(){a.reset()})},reset:function(){var a=this._tblNode.rows[0],b,c,d=[],e=0,f=(this.refId&&l.byId(this.refId)||this.domNode).parentNode.childNodes;for(b=0;b<f.length;b++)c=f[b],this.isView(c)&&d.push(c);if(a.cells.length!==d.length)for(h.empty(a),b=0;b<d.length;b++)c=d[b],c=h.create("div",{className:"mblPageIndicatorDot"}),
a.insertCell(-1).appendChild(c);if(0!==d.length){f=m.byNode(d[0]).getShowingView();for(b=0;b<a.cells.length;b++)c=a.cells[b].firstChild,d[b]===f.domNode?(e=b+1,g.add(c,"mblPageIndicatorDotSelected")):g.remove(c,"mblPageIndicatorDotSelected");a.cells.length?this.domNode.setAttribute("alt",q.PageIndicatorLabel.replace("$0",e).replace("$1",a.cells.length)):this.domNode.removeAttribute("alt")}},isView:function(a){return a&&1===a.nodeType&&g.contains(a,"mblView")},_onClick:function(a){!1!==this.onClick(a)&&
a.target===this.domNode&&(a.layerX<this._tblNode.offsetLeft?e.publish("/dojox/mobile/prevPage",[this]):a.layerX>this._tblNode.offsetLeft+this._tblNode.offsetWidth&&e.publish("/dojox/mobile/nextPage",[this]))},onClick:function(){}})});