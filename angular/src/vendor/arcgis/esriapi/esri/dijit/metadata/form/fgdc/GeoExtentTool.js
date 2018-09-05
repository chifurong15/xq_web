// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://js.arcgis.com/3.24/esri/copyright.txt for details.
//>>built
define("esri/dijit/metadata/form/fgdc/GeoExtentTool","dojo/_base/declare dojo/_base/lang dojo/_base/array dojo/query dijit/registry dojo/dom-construct dojo/has ../tools/ClickableTool ../tools/GeoExtentDialog ../tools/GeoExtentView ../tools/geoExtentUtil ../../../../kernel".split(" "),function(c,m,w,e,n,p,q,r,t,u,g,v){c=c([r],{postCreate:function(){this.inherited(arguments)},startup:function(){if(!this._started){var a=this.findInputWidget();a&&a.parentXNode&&a.parentXNode.gxeDocument&&a.parentXNode.gxeDocument.isViewOnly&&
setTimeout(m.hitch(this,function(){this._handleRequest(a,!1)}),2E3)}},whenToolClicked:function(a,d){this._handleRequest(d,!0)},_findInputWgt:function(a,d){var b;return(b=e("[data-gxe-path\x3d'"+a+"']",d))&&1===b.length&&(b=n.byNode(b[0]))?b.inputWidget:null},_findViewSection:function(a){return(a=e(".gxeGeoExtentSection .gxeGeoExtentViewSection",a))&&1===a.length?a[0]:null},_handleRequest:function(a,d){if(a&&a.parentXNode){var b=a.parentXNode.getParentElement();if(b){var f=b.domNode,c=this._findInputWgt("/metadata/idinfo/spdom/bounding/westbc",
f),h=this._findInputWgt("/metadata/idinfo/spdom/bounding/eastbc",f),k=this._findInputWgt("/metadata/idinfo/spdom/bounding/northbc",f),l=this._findInputWgt("/metadata/idinfo/spdom/bounding/southbc",f);if(c&&h&&k&&l){var e=null;b.gxeDocument&&b.gxeDocument.isViewOnly?d||(e=this._findViewSection(f))&&new u({gxeDocument:b.gxeDocument,xmin:c.getInputValue(),ymin:l.getInputValue(),xmax:h.getInputValue(),ymax:k.getInputValue()},p.create("div",{},e)):d&&(b=new t({gxeDocument:b.gxeDocument,xmin:c.getInputValue(),
ymin:l.getInputValue(),xmax:h.getInputValue(),ymax:k.getInputValue(),onChange:m.hitch(this,function(a){c.setInputValue(g.formatCoordinate(a.xmin));h.setInputValue(g.formatCoordinate(a.xmax));k.setInputValue(g.formatCoordinate(a.ymax));l.setInputValue(g.formatCoordinate(a.ymin))})}),b.show())}}}}});q("extend-esri")&&m.setObject("dijit.metadata.form.fgdc.GeoExtentTool",c,v);return c});