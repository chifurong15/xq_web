// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://js.arcgis.com/3.24/esri/copyright.txt for details.
//>>built
define("esri/dijit/analysis/customgp/editors/simpleEditors","dojo/_base/declare dojo/_base/lang dojo/_base/array dojo/dom-construct dojo/_base/html dojo/on dojo/Deferred dojo/promise/all dojo/json dijit/form/NumberTextBox dijit/form/Select dijit/form/Textarea dijit/form/DateTextBox dijit/form/TimeTextBox dijit/form/CheckBox ../common/dijit/URLInput ../utils esri/tasks/LinearUnit ../BaseEditor".split(" "),function(e,k,g,l,d,n,u,v,p,m,q,w,x,y,r,z,t,A,f){var c={};c.UnsupportEditor=e(f,{baseClass:"jimu-gp-editor-base jimu-gp-editor-unsupport",
editorName:"UnsupportEditor",postCreate:function(){this.inherited(arguments);d.setAttr(this.domNode,"innerHTML",t.sanitizeHTML(this.message))},getValue:function(){return null}});c.ShowMessage=e(f,{baseClass:"jimu-gp-editor-base jimu-gp-editor-message",editorName:"ShowMessage",postCreate:function(){this.inherited(arguments);d.setAttr(this.domNode,"innerHTML",t.sanitizeHTML(this.message))},getValue:function(){return null}});c.GeneralEditorWrapperEditor=e(f,{baseClass:"jimu-gp-editor-base jimu-gp-editor-wrapper",
editorName:"GeneralEditorWrapperEditor",postCreate:function(){this.inherited(arguments);d.setStyle(this.gEditor.domNode,"width","100%");"Select"===this.editorName&&d.addClass(this.gEditor.domNode,"restrict-select-width");this.gEditor.placeAt(this.domNode)},getValue:function(){return this.gEditor.getValue()}});c.BooleanEditor=e(f,{baseClass:"jimu-gp-editor-base jimu-gp-editor-boolean",editorName:"BooleanEditor",postCreate:function(){this.inherited(arguments);this.value=void 0===this.param.defaultValue?
!1:this.param.defaultValue;this.editor=new r({checked:this.value});this.editor.placeAt(this.domNode)},getValue:function(){return this.editor.get("checked")}});c.LongNumberEditor=e(f,{baseClass:"jimu-gp-editor-base jimu-gp-editor-long",editorName:"LongNumberEditor",postCreate:function(){this.inherited(arguments);this.value=isNaN(this.param.defaultValue)?NaN:this.param.defaultValue;this.editor=new m({value:this.value,constraints:{places:0}});this.editor.placeAt(this.domNode)},getValue:function(){var a=
this.editor.getValue();return isNaN(a)?null:a}});c.DoubleNumberEditor=e(f,{baseClass:"jimu-gp-editor-base jimu-gp-editor-double",editorName:"DoubleNumberEditor",postCreate:function(){this.inherited(arguments);this.value=isNaN(this.param.defaultValue)?NaN:this.param.defaultValue;this.editor=new m({value:this.value});this.editor.placeAt(this.domNode)},getValue:function(){var a=this.editor.getValue();return isNaN(a)?null:a}});c.MultiValueChooser=e(f,{baseClass:"jimu-gp-editor-base jimu-gp-editor-multivalue-chooser",
editorName:"MultiValueChooser",postCreate:function(){this.inherited(arguments);this.checkBoxs=[];g.forEach(this.param.choiceList,function(a){var b=new r({label:a,checked:this.param.defaultValue&&-1<this.param.defaultValue.indexOf(a)?!0:!1});a=l.create("label",{"for":b.id,innerHTML:a,"class":"esriLeadingMargin05",style:"display:inline-block;clear:both;"});b.placeAt(this.domNode);l.place(a,this.domNode,"last");l.create("br",null,this.domNode,"last");this.checkBoxs.push(b)},this)},getValue:function(){var a=
[];g.forEach(this.checkBoxs,function(b){b.get("checked")&&a.push(b.label)},this);return a}});c.MultiValueEditor=e(f,{baseClass:"jimu-gp-editor-base jimu-gp-editor-multivalue",editorName:"MultiValueEditor",postCreate:function(){this.inherited(arguments);this.editors=[];var a=d.create("div",{"class":"input-list"},this.domNode),b=k.clone(this.param,a);b.dataType=this.param.dataType.substr(13,this.param.dataType.length);b.originParam=this.param;setTimeout(k.hitch(this,this._initChildEditors,b,a),100);
this._createAddInputNode(b,a)},_initChildEditors:function(a,b){this.param.defaultValue&&0<this.param.defaultValue.length?g.forEach(this.param.defaultValue,function(h){a.defaultValue=h;this._createSingleInputContainerNode(a,b)},this):(delete a.defaultValue,this._createSingleInputContainerNode(a,b))},getValue:function(){var a=[];g.forEach(this.editors,function(b){a.push(b.getValue())},this);return a},getGPValue:function(){var a=new u,b=[];g.forEach(this.editors,function(a){b.push(a.getGPValue())},this);
v(b).then(function(b){a.resolve(b)},function(b){a.reject(b)});return a},destroy:function(){g.forEach(this.editors,function(a){a.destroy()});this.editors=[];this.inherited(arguments)},_createSingleInputContainerNode:function(a,b){var h=d.create("div",{"class":"single-input"},b),c=this.editorManager.createEditor(a,"input",this.context,{widgetUID:this.widgetUID,config:this.config}),e=d.getContentBox(this.domNode).w-30-3;d.setStyle(c.domNode,{display:"inline-block",width:e+"px"});c.placeAt(h);this._createRemoveInputNode(h);
h.inputEditor=c;this.editors.push(c);return h},_createRemoveInputNode:function(a){var b=d.create("div",{"class":"remove",innerHTML:"-"},a);this.own(n(b,"click",k.hitch(this,function(){this.editors.splice(this.editors.indexOf(a.inputEditor),1);a.inputEditor.destroy();d.destroy(a)})));return b},_createAddInputNode:function(a,b){var c=d.create("div",{"class":"add-input"},this.domNode),e=d.create("div",{"class":"add-btn",innerHTML:"+"},c);this.own(n(e,"click",k.hitch(this,function(){this._createSingleInputContainerNode(a,
b)})));return c}});c.LinerUnitEditor=e(f,{baseClass:"jimu-gp-editor-base jimu-gp-editor-liner-unit",editorName:"LinerUnitEditor",postCreate:function(){this.inherited(arguments);this.distance=this.param.defaultValue?this.param.defaultValue.distance:0;this.units=this.param.defaultValue?this.param.defaultValue.units:"esriMeters";this.inputDijit=new m({value:this.distance});this.selectDijit=new q({value:this.units,options:[{label:this.nls.meters,value:"esriMeters"},{label:this.nls.kilometers,value:"esriKilometers"},
{label:this.nls.feet,value:"esriFeet"},{label:this.nls.miles,value:"esriMiles"},{label:this.nls.nauticalMiles,value:"esriNauticalMiles"},{label:this.nls.yards,value:"esriYards"}]});d.addClass(this.selectDijit.domNode,"restrict-select-width");this.inputDijit.placeAt(this.domNode);this.selectDijit.placeAt(this.domNode)},getValue:function(){var a=new A;a.distance=this.inputDijit.getValue();a.units=this.selectDijit.getValue();return a}});c.DateTimeEditor=e(f,{baseClass:"jimu-gp-editor-base jimu-gp-editor-datatime",
editorName:"DateTimeEditor",postCreate:function(){var a=new Date(this.param.defaultValue);this.value=this.param.defaultValue?new Date(a.getFullYear(),a.getMonth(),a.getDate(),a.getHours(),a.getMinutes(),a.getSeconds()):null;this.inherited(arguments);this.dateDijit=new x({value:this.value,style:{width:"60%"}});this.timeDijit=new y({value:this.value,style:{width:"40%"},constraints:{timePattern:"HH:mm:ss",clickableIncrement:"T00:15:00",visibleIncrement:"T00:15:00"}});this.dateDijit.placeAt(this.domNode);
this.timeDijit.placeAt(this.domNode)},startup:function(){this.dateDijit.startup();this.timeDijit.startup()},getValue:function(){var a=new Date,b=this.dateDijit.getValue(),c=this.timeDijit.getValue();return null!==b&&null!==c?(a.setFullYear(b.getFullYear()),a.setMonth(b.getMonth()),a.setDate(b.getDate()),a.setHours(c.getHours()),a.setMinutes(c.getMinutes()),a.setSeconds(c.getSeconds()),a.getTime()):null}});c.GetUrlObjectFromLayer=e([f,q],{editorName:"GetUrlObjectFromLayer",postCreate:function(){this.options=
[];g.forEach(this.map.graphicsLayerIds,function(a){a=this.map.getLayer(a);"esri.layers.FeatureLayer"!==a.declaredClass||this.geometryType&&a.geometryType!==this.geometryType||this.options.push({label:a.label||a.title||a.name||a.id,value:a.id})},this);this.inherited(arguments);this.setValue(this.value);d.addClass(this.domNode,"jimu-gp-editor-sffl");d.addClass(this.domNode,"jimu-gp-editor-base")},getValue:function(){return this.value},getGPValue:function(){var a,b;g.forEach(this.map.graphicsLayerIds,
function(b){var c=this.map.getLayer(b);b===this.getValue()&&(a=c.url)},this);b={url:a};b=this.wrapGPValue(b);return this.wrapValueToDeferred(b)}});c.ObjectUrlEditor=e([f,z],{editorName:"ObjectUrlEditor",postCreate:function(){this.rest=!1;this.inherited(arguments);d.addClass(this.domNode,"jimu-gp-editor-ourl");d.addClass(this.domNode,"jimu-gp-editor-base")},getValue:function(){return this.value},getGPValue:function(){var a;a=this.getValue()?{url:this.getValue()}:null;a=this.wrapGPValue(a);return this.wrapValueToDeferred(a)}});
c.SimpleJsonEditor=e([f,w],{editorName:"SimpleJsonEditor",postMixInProperties:function(){this.inherited(arguments);"object"===typeof this.value&&(this.value=p.stringify(this.value))},postCreate:function(){this.inherited(arguments);d.addClass(this.domNode,"jimu-gp-editor-json");d.addClass(this.domNode,"jimu-gp-editor-base")},getValue:function(){return this.value},getGPValue:function(){var a;a=this.getValue()?p.parse(this.getValue()):null;a=this.wrapGPValue(a);return this.wrapValueToDeferred(a)}});
return c});