// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://js.arcgis.com/3.24/esri/copyright.txt for details.
//>>built
define("esri/dijit/metadata/types/arcgis/form/InputExtentTypeCheckBox","dojo/_base/declare dojo/_base/lang dojo/dom-attr dojo/has ../../../../../kernel ./InputCheckBox".split(" "),function(a,b,f,c,d,e){a=a([e],{_alwaysFalse:!1,serializeIfFalse:!1,postCreate:function(){this.inherited(arguments)},connectXNode:function(a,b){"/metadata/dataIdInfo/dataExt/geoEle/GeoBndBox/@esriExtentType"!==a.gxePath&&(this._alwaysFalse=!0,this.parentXNode.domNode.style.display="none");this.inherited(arguments)},getInputValue:function(){if(this._alwaysFalse)return this.falseValue;
this.inherited(arguments)}});c("extend-esri")&&b.setObject("dijit.metadata.types.arcgis.form.InputExtentTypeCheckBox",a,d);return a});