// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://js.arcgis.com/3.24/esri/copyright.txt for details.
//>>built
define("esri/dijit/metadata/types/arcgis/form/InputReportType","dojo/_base/declare dojo/_base/lang dojo/dom-class dojo/has ../../../../../kernel ../../../base/etc/docUtil ./InputSelectCode".split(" "),function(c,e,d,f,g,h,k){c=c([k],{postCreate:function(){this.inherited(arguments)},emitInteractionOccurred:function(a){this.inherited(arguments);try{var b=this.parentXNode.gxeDocument;!b.isViewOnly&&b.isAgsFGDC&&this._updateEvalMethod()}catch(l){console.error(l)}},_updateEvalMethod:function(){var a=this.getInputValue(),
b=h.findInputWidget("/metadata/dqInfo/report/evalMethDesc",this.parentXNode.parentElement.domNode),c=!1;if("DQAbsExtPosAcc"===a||"DQQuanAttAcc"===a)c=!0;b&&(a=b.parentXNode.labelNode,c?(b.parentXNode.minOccurs=1,d.remove(a,"gxeOptionalLabel"),d.add(a,"gxeMandatoryLabel")):(b.parentXNode.minOccurs=0,d.remove(a,"gxeMandatoryLabel"),d.add(a,"gxeOptionalLabel")),b.emitInteractionOccurred())}});f("extend-esri")&&e.setObject("dijit.metadata.types.arcgis.form.InputReportType",c,g);return c});