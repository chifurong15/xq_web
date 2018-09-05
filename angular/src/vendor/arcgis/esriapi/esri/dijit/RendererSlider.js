// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://js.arcgis.com/3.24/esri/copyright.txt for details.
//>>built
require({cache:{"url:esri/dijit/RendererSlider/templates/RendererSlider.html":'\x3cdiv class\x3d"${_css.container}" data-dojo-attach-point\x3d"_containerNode"\x3e\r\n  \x3cdiv class\x3d"${_css.topLabelNode} ${_css.topLabelNodeHover}" data-dojo-attach-point\x3d"_topNode"\x3e\r\n    \x3cspan data-dojo-attach-point\x3d"_topNodeSpan"\x3e\x3c/span\x3e \r\n  \x3c/div\x3e\r\n  \x3cdiv class\x3d"${_css.slidernode}" data-dojo-attach-point\x3d"_sliderNode"\x3e\r\n    \x3cdiv class\x3d"${_css.sliderarea}" data-dojo-attach-point\x3d"_sliderArea"\x3e\x3c/div\x3e\r\n    \x3cdiv class\x3d"${_css.sliderarearight}" data-dojo-attach-point\x3d"_sliderAreaRight"\x3e\x3c/div\x3e\r\n  \x3c/div\x3e\r\n  \x3cdiv class\x3d"${_css.bottomLabelNode} ${_css.bottomLabelNodeHover}" data-dojo-attach-point\x3d"_botNode"\x3e\r\n    \x3cspan  data-dojo-attach-point\x3d"_bottomNodeSpan"\x3e\x3c/span\x3e\r\n  \x3c/div\x3e\r\n\x3c/div\x3e'}});
define("esri/dijit/RendererSlider","../kernel ../numberUtils ../renderers/utils ./DateTimeTextBox ./RendererSlider/sliderUtils dijit/_OnDijitClickMixin dijit/_TemplatedMixin dijit/_WidgetBase dijit/form/NumberTextBox dojo/debounce dojo/on dojo/_base/array dojo/_base/declare dojo/_base/lang dojo/dnd/move dojo/dom-construct dojo/dom-style dojo/dom-class dojo/Evented dojo/number dojo/has dojo/text!./RendererSlider/templates/RendererSlider.html".split(" "),function(F,C,D,A,v,u,G,H,B,I,l,r,J,f,K,t,p,E,
L,M,N,O){u=J([H,G,u,L],{declaredClass:"esri.dijit.RendererSlider",baseClass:"esriRendererSlider",templateString:O,theme:"Slider",intermediateChanges:!1,type:null,minimum:0,maximum:100,values:[50],precision:2,isDate:!1,handles:[],primaryHandle:null,showHandles:!0,showTicks:!0,showLabels:!0,showRatioLabels:!1,minLabel:null,maxLabel:null,_visibleLabels:["data","handle"],_roundedDataLabels:[],_roundedHandleLabels:[],_ratioLabels:[],_minRatioLabel:"",_maxRatioLabel:"",_isZoomed:!1,_minZoomLabel:"",_maxZoomLabel:"",
_maximumNumberEditor:null,_minimumNumberEditor:null,_valueDifferenceByIndex:[],_primaryHandleIdx:null,_currentTopValue:[],_isLTR:!0,_ctrlDown:!1,_histogramSurface:null,_css:null,_minPrecisionForSmallNumbers:3,constructor:function(a,b){this.inherited(arguments);this.domNode=b;this._css={container:"esri-renderer-slider",slidernode:"esri-slider-node",sliderarea:"esri-slider-area",sliderarearight:"esri-slider-area-right",moveable:"esri-moveable",handler:"esri-handle",handlerSpan:"esri-handle-span",handlerContainer:"esri-handle-container",
handlerLabel:"esri-handle-label",handlerLabelSpan:"esri-handle-label-span",topLabelNode:"esri-top-label-node",bottomLabelNode:"esri-bottom-label-node",topLabelNodeHover:"esri-top-label-node-hover",bottomLabelNodeHover:"esri-bottom-label-node-hover",heatmapTick:"esri-heatmap-tick",handlerTick:"esri-handler-tick",handlerTickTop:"esri-handler-tick-top",handlerTickBottom:"esri-handler-tick-bottom"};this.showLabels=a.showLabels||this._visibleLabels;this._updateTimeout=I(this._updateTimeout,0)},startup:function(){this.inherited(arguments);
this.set("_sliderHeight",p.get(this._sliderArea,"height")||200);this._checkMinMaxDefaults();this.set("_isLTR",this.isLeftToRight());if(!this._isLTR){var a=p.get(this._sliderNode,"padding-left")+p.get(this._sliderNode,"padding-right"),b=Math.round(p.get(this._sliderNode,"width"));this.set("_sliderNodeWidth_RTL",a+b)}this.set("precision",v.getCombinedPrecision(this.minimum,this.maximum));this._updateRoundedLabels();this._generateMoveables();this._generateMinMaxEditors();this._generateCtrlKeyListener();
this.watch("values",this._valuesChange);this.watch("minimum",this._updateTimeout);this.watch("maximum",this._updateTimeout);this.watch("showRatioLabels",this._updateTimeout)},destroy:function(){this.inherited(arguments)},setValue:function(a,b,d){var c=this.get("values"),e=c.slice(0);"object"===typeof c[0]?e[a].value=b:e[a]=b;(this.intermediateChanges||d)&&this.set("values",e);d?this.emit("stop",{values:this.get("values")}):this.emit("slide",{values:e})},_updateTimeout:function(){this._updateSlider()},
_updateSlider:function(){this._reset();this._checkMinMaxDefaults();this._updateRoundedLabels();this._generateMoveables();this._generateMinMaxEditors();this._generateCtrlKeyListener()},_checkMinMaxDefaults:function(){var a=this.values,b;this.minimum===this.maximum&&a&&0<a.length&&(isNaN(a[0])?this.set({minimum:0,maximum:2*a[0].value}):this.set({minimum:0,maximum:2*a[0]}));a&&0<a.length&&(b=isNaN(a[0])?a[0].value:a[0],this.minimum>b&&this.set("minimum",b),a=isNaN(a[a.length-1])?a[a.length-1].value:
a[a.length-1],this.maximum<a&&this.set("maximum",a))},_calculateValueFromHandlePosition:function(a){var b=this.get("minimum"),d=this.get("maximum"),c=this.get("precision"),e=this.get("step")||Math.pow(10,-c);return 1>=b&&-1<=b&&1>=d&&-1<=d||c>=this._minPrecisionForSmallNumbers?(a*(d-b)+b)/e*e:parseFloat((Math.round((a*(d-b)+b)/e)*e).toFixed(c))},_generateMoveables:function(){var a,b=this._sliderNode,d=this._sliderHeight,c=this.get("minimum"),e=this.get("maximum");this.get("precision");this.get("step");
var q=this.get("showLabels"),k=this.get("showTicks"),n=f.hitch(this,this.setValue),h=this.get("values");this._updateMinMaxLabels();this.set("_primaryHandleIdx",null);a=r.map(h,f.hitch(this,function(h,g){var m,l,x,u,w,z;h&&h.primaryHandle&&this.set("_primaryHandleIdx",g);if("object"===typeof h&&h.hidden)return null;"object"===typeof h&&(h=h.value);m=t.create("div",{style:this._getHandleStyleString(h),className:this._css.moveable},b);z=m._handleContainer=t.create("div",{className:this._css.handlerContainer},
m);m._arrowSpan=u=t.create("span",{className:this._css.handlerSpan},z);m._handler=l=t.create("div",{className:this._css.handler},z);"HeatmapSlider"!==this.type&&(!0===q||"object"===typeof q&&-1!==r.indexOf(q,"handles"))&&(x=this._generateHandleLabel(m,g));k&&this._generateHandleTicks(m,g);w=new K.constrainedMoveable(m,{handle:z,within:!0,constraints:f.hitch(this,function(){return{t:0,l:this._isLTR?0:this._sliderNodeWidth_RTL,w:0,h:d}})});w.onMoveStart=f.hitch(this,function(b){var c=this.handles,e=
r.indexOf(c,g),y,h;this._currentTopValue[g]=b.node.style.top;m.labelNode&&m.labelNode._autoPositioned&&(p.set(m.labelNode,"top","3px"),m.labelNode._autoPositioned=!1);v._autoPositionHandleLabels(this.get("moveables"));m._numberEditor&&(m._numberEditor.destroy(),m._numberEditor=null);this._primaryHandleIdx!==g?(0<c.length?(b=null!==c[e-1]?c[e-1]:null,c=null!==c[e+1]?c[e+1]:null,e=a[b],c=a[c]):(e=a[g-1],c=a[g+1]),e&&c?(e=e.style.top,c=c.style.top,y=Number(e.replace("px","")),h=Number(c.replace("px",
"")),w.constraints=f.hitch(this,function(){return{t:h+2,l:this._isLTR?0:this._sliderNodeWidth_RTL,w:0,h:d-h-(d-y+4)}})):e?(e=e.style.top,y=Number(e.replace("px","")),w.constraints=f.hitch(this,function(){return{t:0,l:this._isLTR?0:this._sliderNodeWidth_RTL,w:0,h:d-(d-y+2)}})):c&&(c=c.style.top,h=Number(c.replace("px","")),w.constraints=f.hitch(this,function(){return{t:h+2,l:this._isLTR?0:this._sliderNodeWidth_RTL,w:0,h:d-(h+2)}}))):(0<c.length?(b=null!==c[e-1]?c[e-1]:null,c=null!==c[e+1]?c[e+1]:null,
e=a[b],c=a[c]):(e=a[g-1],c=a[g+1]),e&&c&&(e=e.style.top,c=c.style.top,y=Number(e.replace("px","")),h=Number(c.replace("px","")),w.constraints=f.hitch(this,function(){return{t:2,l:this._isLTR?0:this._sliderNodeWidth_RTL,w:0,h:d-4}})))});w.onMoved=f.hitch(this,function(b){var h,q,k,m,l;g===this._primaryHandleIdx&&(k=Number(this._currentTopValue[g].replace("px",""))-Number(b.node.style.top.replace("px","")),this._currentTopValue[g]=b.node.style.top,r.forEach(a,f.hitch(this,function(a,b){a&&b!==g&&(m=
Number(a.style.top.replace("px","")),l=m-k,h=1-Number(l/d),q=this._calculateValueFromHandlePosition(h),q<c||q>e||(p.set(a,"top",l+"px"),n(b,q,!1),a.labelNode&&(a.labelNode.spanNode.innerHTML=this.showRatioLabels?this._getLabelValueFromIndex(b):this._formatValue(q.toFixed(6)))))})));h=1-Number(b.node.style.top.replace("px",""))/d;q=this._calculateValueFromHandlePosition(h);null!==this._primaryHandleIdx&&g!==this._primaryHandleIdx&&this._ctrlDown&&(k=Number(this._currentTopValue[g].replace("px",""))-
Number(b.node.style.top.replace("px","")),this._currentTopValue[g]=b.node.style.top,0===g?(m=Number(a[a.length-1].style.top.replace("px","")),b=m+k,b>d&&(b=d),0>b&&(b=0),p.set(a[a.length-1],"top",b+"px"),b=1-b/d,b=this._calculateValueFromHandlePosition(b),n(a.length-1,b,!1),a[a.length-1].labelNode&&(a[a.length-1].labelNode.spanNode.innerHTML=this._formatValue(b.toFixed(6)))):g===a.length-1&&(m=Number(a[0].style.top.replace("px","")),b=m+k,b>d&&(b=d),0>b&&(b=0),p.set(a[0],"top",b+"px"),b=1-b/d,b=this._calculateValueFromHandlePosition(b),
n(0,b,!1),a[0].labelNode&&(a[0].labelNode.spanNode.innerHTML=this._formatValue(b.toFixed(6)))));n(g,q,!1);this._updateRoundedLabels();x&&(b=this._formatValue(parseFloat(this._roundValue([q,parseFloat(this._getLabelValueFromIndex(g,!0))])[0]).toFixed(this.precision)),x.spanNode.innerHTML=this.showRatioLabels?this._getLabelValueFromIndex(g):b);v._autoPositionHandleLabels(this.get("moveables"))});w.onMoveStop=f.hitch(this,function(a){a=Number(a.node.style.top.replace("px",""));a=this._calculateValueFromHandlePosition(1-
a/d);n(g,a,!0);this._updateRoundedLabels();x&&(a=this._formatValue(parseFloat(this._roundValue([a,parseFloat(this._getLabelValueFromIndex(g,!0))])[0]).toFixed(this.precision)),x.spanNode.innerHTML=this.showRatioLabels?this._getLabelValueFromIndex(g):a);v._autoPositionHandleLabels(this.get("moveables"))});this.showHandles||(p.set(l,"display","none"),p.set(u,"display","none"));return m}));this.set("moveables",a);v._autoPositionHandleLabels(this.get("moveables"))},_reset:function(){r.forEach(this.moveables,
f.hitch(this,function(a){a&&a.parentElement.removeChild(a)}));this.moveables=[]},_getHandleStyleString:function(a){var b=this.get("minimum"),d=this.get("maximum");return"top: "+Math.round((1-(a-b)/(d-b))*this._sliderHeight)+"px; "+("left: "+(this._isLTR?0:this._sliderNodeWidth_RTL)+"px;")},_generateHandleTicks:function(a,b){var d=this._css,c=d.handlerTick+" "+d.handlerTickTop,e=d.handlerTick+" "+d.handlerTickBottom,c=0===b?e:c;"HeatmapSlider"===this.type&&(c+=d.heatmapTick);a._tick=t.create("div",
{className:c},a)},_updateLabels:function(){this._updateMinMaxLabels();this._updateRoundedLabels()},_resetLabelPositions:function(){r.forEach(this.moveables,function(a){if(a){var b=a.labelNode;b&&(p.set(b,"top","3px"),a.labelNode._autoPositioned=!1)}})},_generateHandleLabel:function(a,b){var d,c;d=t.create("div",{className:this._css.handlerLabel},a);c=t.create("span",{className:this._css.handlerLabelSpan,innerHTML:this._getLabelValueFromIndex(b)},d);d.spanNode=c;a.labelNode=d;l(d,"click",f.hitch(this,
function(){this._generateHandleLabelEditor(a,b)}));return d},_updateMinMaxLabels:function(){var a=this.minimum,b=this.maximum,d=this.showLabels,c=this.minLabel,e=this.maxLabel,f=this._topNodeSpan,k=this._bottomNodeSpan,n=this._isZoomed,h=this._maxZoomLabel,l=this._minZoomLabel,g=this.showRatioLabels,m=this._maxRatioLabel,p=this._minRatioLabel,t=this._roundedDataLabels;!1===d||"object"===typeof d&&-1===r.indexOf(d,"data")?(f.innerHTML="",k.innerHTML=""):n?g?(f.innerHTML=m,k.innerHTML=p):(f.innerHTML=
this._formatValue(h),k.innerHTML=this._formatValue(l)):g?(f.innerHTML=m,k.innerHTML=p):(n=isNaN(c)?c:this._roundValue([c,e])[0],d=isNaN(e)?e:this._roundValue([c,e])[1],c=isNaN(n)||null===n?c:this._formatValue(n),e=isNaN(d)||null===d?e:this._formatValue(d),a=this._formatValue(t[0])||this._formatValue(a),b=this._formatValue(t[1])||this._formatValue(b),f.innerHTML=e||b,k.innerHTML=c||a)},_formatValue:function(a){"string"===typeof a&&(a=Number(a));return this.isDate?D.formatDate(new Date(a),D.timelineDateFormatOptions):
C.format(a)},_roundValue:function(a){return this.isDate?a.slice(0):C.round(a)},_updateRoundedLabels:function(){this._roundedDataLabels=this._roundValue([this.minimum,this.maximum]);switch(this.type){case "SizeInfoSlider":case "ClassedSizeSlider":case "ClassedColorSlider":this._roundedHandleLabels=this._roundValue(this.values);break;case "ColorInfoSlider":case "OpacitySlider":this._roundedHandleLabels=this._roundValue(this._getValuesFromObject(this.values))}this._updateRatioLabels()},_updateRatioLabels:function(){var a=
this.get("showRatioLabels"),b=this.get("minimum"),d=this.get("maximum"),c=this._getValuesFromObject(this.values),e=[],f,k;!1!==a&&("percent"!==a&&"percentTotal"!==a?this.set("showRatioLabels",!1):("percent"===a?(r.forEach(c,function(a){e.push(this._getRatioFromValue(a))},this),f=this._formatValue(this._getRatioFromValue(b).toFixed(2)),k=this._formatValue(this._getRatioFromValue(d).toFixed(2))):"percentTotal"===a&&(r.forEach(c,function(a){e.push(this._getRatioFromValue(a))},this),f=this._formatValue(this._getRatioFromValue(b).toFixed(2)),
k=this._formatValue(this._getRatioFromValue(d).toFixed(2))),this.set({_ratioLabels:e,_minRatioLabel:f+"%",_maxRatioLabel:k+"%"})))},_generateMinMaxEditors:function(){!this.showLabels||"object"===typeof this.showLabels&&-1===r.indexOf(this.showLabels,"data")||"HeatmapSlider"===this.type?(E.remove(this._topNode,this._css.topLabelNodeHover),E.remove(this._botNode,this._css.bottomLabelNodeHover)):(l(this._topNode,"click",f.hitch(this,this._generateMaxEditor)),l(this._botNode,"click",f.hitch(this,this._generateMinEditor)))},
_generateMaxEditor:function(){if(!(this._maximumNumberEditor&&this._topLabelNode||this._isZoomed)){var a=this.get("minLabel"),b=this.get("maxLabel"),d=this.get("maximum"),c,e;this._topNodeSpan.innerHTML="";this._topLabelNode=t.create("input",{type:"text"},this._topNode);c=this.handles&&0<this.handles.length?this.values[this.handles[this.handles.length-1]]:this.values[this.values.length-1];"object"===typeof c&&(c=c.value);this.showRatioLabels&&(c=this._getLabelValueFromIndex(this.values.length-1,!0).replace("%",
""),d=Number(this._maxRatioLabel.replace("%","")));this.isDate?(e=new A({date:new Date(Number(d)),required:!0,constraints:{min:new Date(c),max:null}},this._topLabelNode),a={editor:e,editorPropName:"_maximumNumberEditor",spanNode:this._topNodeSpan,operator:"\x3c"},e.on("keydown",f.hitch(this,this._minMaxKeydownDateHandler,a)),e.on("blur",f.hitch(this,this._minMaxBlurDateValue,a)),e.watch("date",f.hitch(this,this._minMaxUpdateDateValue,a))):(e=new B({value:Number(d),required:!0,constraints:{min:c,max:"percentTotal"===
this.showRatioLabels?100:null,places:"0,20"}},this._topLabelNode),l(e,"keydown",f.hitch(this,this._keydownHandler,{editor:e,originalValidate:!1})),l(e,"blur",f.hitch(this,this._minMaxBlurHandler,{editor:e,editorPropName:"_maximumNumberEditor",label:b,current:d,spanNode:this._topNodeSpan,index:1,minLabel:a,maxLabel:b,ratioLabel:this._maxRatioLabel})),l(e,"change",f.hitch(this,this._minMaxChangeHandler,{label:b,current:d,spanNode:this._topNodeSpan,index:1,minLabel:a,maxLabel:b,ratioLabel:this._maxRatioLabel,
handleValue:c,operator:"\x3c"})));this._maximumNumberEditor=e;e.startup();e.focus();e.textbox.select()}},_generateMinEditor:function(){if(!(this._minimumNumberEditor&&this._botLabelNode||this._isZoomed)){var a=this.minLabel,b=this.maxLabel,d=this.minimum,c,e;this._bottomNodeSpan.innerHTML="";this._botLabelNode=t.create("input",{type:"text"},this._botNode);c=this.handles&&0<this.handles.length?this.values[this.handles[0]]:this.values[0];"object"===typeof c&&(c=c.value);this.showRatioLabels&&(c=this._getLabelValueFromIndex(0,
!0).replace("%",""),d=Number(this._minRatioLabel.replace("%","")));this.isDate?(e=new A({date:new Date(Number(d)),required:!0,constraints:{min:null,max:new Date(c)}},this._botLabelNode),a={editor:e,editorPropName:"_minimumNumberEditor",spanNode:this._bottomNodeSpan,operator:"\x3e"},e.on("keydown",f.hitch(this,this._minMaxKeydownDateHandler,a)),e.on("blur",f.hitch(this,this._minMaxBlurDateValue,a)),e.watch("date",f.hitch(this,this._minMaxUpdateDateValue,a))):(e=new B({value:Number(d),required:!0,constraints:{max:c,
min:"percentTotal"===this.showRatioLabels?0:null,places:"0,20"}},this._botLabelNode),l(e,"keydown",f.hitch(this,this._keydownHandler,{editor:e,originalValidate:!1})),l(e,"blur",f.hitch(this,this._minMaxBlurHandler,{editor:e,editorPropName:"_minimumNumberEditor",label:a,current:d,spanNode:this._bottomNodeSpan,index:0,minLabel:a,maxLabel:b,ratioLabel:this._minRatioLabel})),l(e,"change",f.hitch(this,this._minMaxChangeHandler,{label:a,current:d,spanNode:this._bottomNodeSpan,index:0,minLabel:a,maxLabel:b,
ratioLabel:this._minRatioLabel,handleValue:c,operator:"\x3e"})));this._minimumNumberEditor=e;e.startup();e.focus();e.textbox.select()}},_minMaxBlurHandler:function(a,b){var d=a.editor,c=a.editorPropName,e=a.label,f=a.current,k=a.spanNode,n=a.index,h=a.minLabel,l=a.maxLabel,g=a.ratioLabel,h=isNaN(e)?e:this._roundValue([h,l])[n],e=isNaN(h)||null===h?e:this._formatValue(h),f=this._formatValue(this._roundedDataLabels[n])||this._formatValue(f);this.showLabels||"object"===typeof this.showLabels&&-1!==r.indexOf(this.showLabels,
"data")?k.innerHTML=this.showRatioLabels?g:e||f:k.innerHTML="";d.destroy();this[c]=null},_minMaxChangeHandler:function(a,b){var d=a.label,c=a.current,e=a.spanNode,q=a.index,k=a.minLabel,n=a.maxLabel,h=a.ratioLabel,l=a.handleValue,g=a.operator;("\x3c"===g?b<Number(l):b>Number(l))||isNaN(b)||void 0===b?(g=isNaN(d)?d:this._roundValue([k,n])[q],d=isNaN(g)||null===g?d:this._formatValue(g),c=this._formatValue(this._roundedDataLabels[q])||this._formatValue(c),e.innerHTML=this.showRatioLabels?h:d||c):(h=
this.showRatioLabels?this._getValueFromPercent(b):b,e.innerHTML=this.showRatioLabels?h:this._formatValue(b),this.set("\x3c"===g?"maximum":"minimum",h),this._reset(),this._updateRoundedLabels(),this._generateMoveables(),this._generateMinMaxEditors(),this.emit("data-value-change",{min:this.minimum,max:this.maximum,values:f.clone(this.values)}))},_minMaxKeydownDateHandler:function(a,b){13===b.keyCode&&a.editor.isValid()&&setTimeout(f.hitch(this,this._destroyMinMaxHandleEditor,a),0)},_minMaxBlurDateValue:function(a,
b){setTimeout(f.hitch(this,this._destroyMinMaxHandleEditor,a),0)},_destroyMinMaxHandleEditor:function(a){a.spanNode.innerHTML=this._formatValue(this.get("\x3c"===a.operator?"maximum":"minimum"));a.editor.destroy();this[a.editorPropName]=null},_minMaxUpdateDateValue:function(a){var b=a.spanNode,d=a.operator;a=a.editor.get("date");var d="\x3c"===d?"maximum":"minimum",c=this.get(d);a=a&&a.getTime();if(c=c!==a)b.innerHTML=this._formatValue(a),this.set(d,a);this._reset();this._updateRoundedLabels();this._generateMoveables();
this._generateMinMaxEditors();c&&this.emit("data-value-change",{min:this.minimum,max:this.maximum,values:f.clone(this.values)})},_generateHandleLabelEditor:function(a,b){if(!a._numberEditor){var d=this.get("handles"),c=this.get("maximum"),e=this.get("minimum"),q=this.get("_isZoomed"),k=this.get("values"),n=k[b],h=r.indexOf(d,b),p=a.labelNode,g,m,u,v;"object"===typeof n&&(n=n.value);p.spanNode.innerHTML="";v=t.create("input",{type:"text"},p);0<d.length?(g=null!==d[h-1]?d[h-1]:null,m=null!==d[h+1]?
d[h+1]:null,d=k[g],k=k[m]):(d=k[b-1],k=k[b+1]);"object"===typeof d&&(d=d.value);"object"===typeof k&&(k=k.value);h=void 0!==d&&null!==d?d:q&&!isNaN(this._minZoomLabel)?this._minZoomLabel:e;u=void 0!==k&&null!==k?k:q&&!isNaN(this._maxZoomLabel)?this._maxZoomLabel:c;this.showRatioLabels&&(n=this._getLabelValueFromIndex(b).replace("%",""),h=d?Number(this._getLabelValueFromIndex(g,!0).replace("%","")):Number(this._minRatioLabel.replace("%",""))||Number(this._getRatioFromValue(this.minimum)),u=k?Number(this._getLabelValueFromIndex(m,
!0).replace("%","")):Number(this._maxRatioLabel.replace("%",""))||Number(this._getRatioFromValue(this.maximum)));this.isDate?(g=new A({date:new Date(n),required:!0,constraints:{min:new Date(h),max:new Date(u)}},v),c={editor:g,editorPropName:"_numberEditor",min:e,max:c,index:b,zoomed:q,spanNode:p.spanNode,moveable:a},g.on("keydown",f.hitch(this,this._stopKeydownDateHandler,c)),g.on("blur",f.hitch(this,this._stopBlurDateHandler,c)),g.watch("date",f.hitch(this,this._stopUpdateDateValue,c))):(g=new B({value:n,
constraints:{min:h,max:u,places:"0,20"}},v),l(g,"keydown",f.hitch(this,this._keydownHandler,{editor:g,originalValidate:!1})),l(g,"blur",f.hitch(this,this._blurHandler,{editor:g,editorPropName:"_numberEditor",updatedValue:n,min:e,max:c,index:b,zoomed:q,spanNode:p.spanNode,moveable:a})),l(g,"change",f.hitch(this,this._changeHandler,{editor:g,index:b,spanNode:p.spanNode})));a._numberEditor=g;g.focus();g.textbox.select()}},_keydownHandler:function(a,b){var d=a.originalValidate,c=a.editor;!1!==d&&(c.validate=
d);13===b.keyCode&&(d=c.get("value"),void 0===d&&(d=c.get("displayedValue")),d<=c.constraints.max&&d>=c.constraints.min?c.focusNode.blur():(d=c.validate,c.validate(!1),c.validate=function(){return!1}))},_blurHandler:function(a,b){var d=a.editor,c=a.editorPropName,e=a.updatedValue,f=a.min,k=a.max,l=a.index,h=a.zoomed,p=a.spanNode,g=a.moveable;isNaN(d.get("value"))&&d.set("value",e);h&&(d.get("value")>k||d.get("value")<f)&&(this.set("_isZoomed",!1),this.emit("zoom-out"));p.innerHTML=this._getLabelValueFromIndex(l);
d.destroy();g[c]=null},_changeHandler:function(a,b){var d=a.editor,c=a.index,e=a.spanNode,f=b;b>d.constraints.max||b<d.constraints.min||isNaN(b)||void 0===b?e.innerHTML=this._getLabelValueFromIndex(c):(this.showRatioLabels&&(f=this._getValueFromPercent(b)),"object"===typeof this.values[c]?this.values[c].value=f:this.values[c]=f,this._reset(),this._updateRoundedLabels(),this._generateMoveables(),this._generateMinMaxEditors(),this.emit("handle-value-change",{values:this.values}))},_stopKeydownDateHandler:function(a,
b){13===b.keyCode&&a.editor.isValid()&&setTimeout(f.hitch(this,this._destroyHandleEditor,a),0)},_stopBlurDateHandler:function(a,b){setTimeout(f.hitch(this,this._destroyHandleEditor,a),0)},_destroyHandleEditor:function(a){a.spanNode.innerHTML=this._getLabelValueFromIndex(a.index);a.editor.destroy();a.moveable[a.editorPropName]=null},_stopUpdateDateValue:function(a){var b=a.min,d=a.max,c=a.index,e=a.zoomed,f=a.spanNode;a=(a=a.editor.get("date"))&&a.getTime();e&&(a>d||a<b)&&(this.set("_isZoomed",!1),
this.emit("zoom-out"));if(b=("object"===typeof this.values[c]?this.values[c].value:this.values[c])!==a)"object"===typeof this.values[c]?this.values[c].value=a:this.values[c]=a;f.innerHTML=this._getLabelValueFromIndex(c);this._reset();this._updateRoundedLabels();this._generateMoveables();this._generateMinMaxEditors();b&&this.emit("handle-value-change",{values:this.values})},_getRatioFromValue:function(a){var b=this.get("showRatioLabels");return"percent"===b?100*a:"percentTotal"===b?a/(1+a)*100:null},
_getValueFromPercent:function(a){var b,d=this.get("showRatioLabels");if("percent"===d)b=a/100;else if("percentTotal"===d){if(100<=a)return 100;b=a/(100-a)}return b},_getLabelValueFromIndex:function(a,b){return this.showRatioLabels&&this._ratioLabels[a]?!0===b?parseFloat(this._ratioLabels[a].toFixed(2))+"%":this._formatValue(parseFloat(this._ratioLabels[a].toFixed(2)))+"%":!0===b?this._roundedHandleLabels[a]:this._formatValue(this._roundedHandleLabels[a])},_getValuesFromObject:function(a){var b=[];
r.forEach(a,function(a){b.push(a.value)});return b},_getDecimalPlaces:function(a){return M.format(a,{places:"0,20",round:-1}).replace(/^-?\d*\.?|0+$/g,"").length},_collisionCheck:function(a,b){return!(a.right<b.left||a.left>b.right||a.bottom<b.top||a.top>b.bottom)},_generateCtrlKeyListener:function(){l(document,"keydown",f.hitch(this,function(a){this._ctrlDown=a.metaKey||a.ctrlKey}));l(document,"keyup",f.hitch(this,function(a){this._ctrlDown=a.metaKey||a.ctrlKey}))},_valuesChange:function(){this.emit("change",
{values:this.get("values")})}});N("extend-esri")&&f.setObject("dijit.RendererSlider",u,F);return u});