// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://js.arcgis.com/3.24/esri/copyright.txt for details.
//>>built
require({cache:{"url:esri/dijit/LayerList/templates/LayerList.html":'\x3cdiv class\x3d"${theme}" role\x3d"presentation"\x3e\r\n  \x3cdiv role\x3d"menu" data-dojo-attach-point\x3d"_container" class\x3d"${css.container}"\x3e\r\n    \x3cul role\x3d"group" class\x3d"${css.list}" data-dojo-attach-point\x3d"_layersNode"\x3e\x3c/ul\x3e\r\n    \x3cdiv class\x3d"${css.noLayersText}" data-dojo-attach-point\x3d"_noLayersNode"\x3e\x3c/div\x3e\r\n  \x3c/div\x3e\r\n\x3c/div\x3e'}});
define("esri/dijit/LayerList","dojo/_base/array dojo/_base/declare dojo/_base/lang dojo/_base/kernel ../kernel dojo/uacss dojo/Deferred dojo/on dojo/query dojo/dom-class dojo/dom-style dojo/dom-construct dojo/dom-attr dojo/i18n!../nls/jsapi dijit/a11yclick dijit/_WidgetBase dijit/_TemplatedMixin ../promiseList ../layerUtils dojo/text!./LayerList/templates/LayerList.html".split(" "),function(n,v,l,L,M,N,C,r,F,k,D,g,m,x,E,O,P,Q,R,S){function J(a){var c=a.layer,b=a.nodes;a=a.className;var c=c.getMap()?
c.visibleAtMapScale:!0,d=b.checkbox,b=b.layer;k.toggle(b,a,!c);c?(m.remove(b,"aria-disabled"),m.remove(d,"disabled")):(m.set(b,"aria-disabled","true"),m.set(d,"disabled","disabled"))}var T=n.some(["ar","he"],function(a){return-1!==L.locale.indexOf(a)});v=v([O,P],{templateString:S,defaults:{theme:"esriLayerList",map:null,layers:null,showSubLayers:!0,showOpacitySlider:!1,showLegend:!1,removeUnderscores:!0,visible:!0},constructor:function(a){a=l.mixin({},this.defaults,a);this.set(a);this.css={container:"esriContainer",
noLayers:"esriNoLayers",noLayersText:"esriNoLayersText",slider:"esriSlider",sliderLabels:"esriSliderLabels",legend:"esriLegend",tabContainer:"esriTabContainer",tabs:"esriTabs",tabMenu:"esriTabMenu",tabMenuItem:"esriTabMenuItem",tabMenuSelected:"esriTabMenuSelected",tabMenuVisible:"esriTabMenuVisible",tab:"esriTab",tabSelected:"esriTabSelected",toggleButton:"esriToggleButton",iconCollapse:"esri-icon-down",iconExpand:T?"esri-icon-left":"esri-icon-right",list:"esriList",listExpand:"esriListExpand",subListExpand:"esriSubListExpand",
listVisible:"esriListVisible",subList:"esriSubList",hasSubList:"esriHasSubList",hasButton:"esriHasButton",hasTabContent:"esriHasTabContent",subListLayer:"esriSubListLayer",layer:"esriLayer",layerScaleInvisible:"esriScaleInvisible",title:"esriTitle",titleContainer:"esriTitleContainer",checkbox:"esriCheckbox",label:"esriLabel",button:"esriButton",content:"esriContent",clearFix:"esriClearFix",clear:"esriClear"}},postCreate:function(){this.inherited(arguments);var a=this;this.own(r(this._layersNode,r.selector("."+
this.css.checkbox,"change"),function(){var c,b;c=m.get(this,"data-layer-index");b=m.get(this,"data-sublayer-index");a._toggleLayer(c,b);a._toggleState(c,b)}));this.own(r(this._layersNode,r.selector("."+this.css.tabMenuItem,E.press),function(){var c=m.get(this,"data-layer-index"),b=m.get(this,"data-tab-id");a._toggleTab(c,b)}));this.own(r(this._layersNode,r.selector("."+this.css.toggleButton,E.press),function(){var c=m.get(this,"data-layer-index");a._toggleExpand(c)}))},startup:function(){this.inherited(arguments);
this._mapLoaded(this.map).then(l.hitch(this,this._init))},destroy:function(){this._removeEvents();this.inherited(arguments)},refresh:function(){var a=this.layers;this._nodes=[];var c=[];if(a&&a.length)for(var b=0;b<a.length;b++)c.push(this._layerLoaded(b));return Q(c).always(l.hitch(this,function(a){this._loadedLayers=a;this._removeEvents();this._createLayerNodes();this._setLayerEvents();this.emit("refresh")}))},_mapLoaded:function(a){var c=new C;if(a)if(a.loaded)c.resolve();else r.once(a,"load",
l.hitch(this,function(){c.resolve()}));else c.resolve();return c.promise},_toggleExpand:function(a){a=parseInt(a,10);if(a=this._nodes[a]){var c=a.layer;k.toggle(c,this.css.listExpand);c=k.contains(c,this.css.listExpand);m.set(a.toggle,"title",c?x.widgets.layerList.collapse:x.widgets.layerList.expand);k.toggle(a.toggle,this.css.iconCollapse,c);k.toggle(a.toggle,this.css.iconExpand,!c)}},_toggleTab:function(a,c){a=parseInt(a,10);var b=this._nodes[a];if(b){var d=b.tabMenu,b=F("[data-tab-id]",b.tabs),
d=F("[data-tab-id]",d),e;for(e=0;e<b.length;e++){var f=m.get(b[e],"data-tab-id");k.toggle(b[e],this.css.tabSelected,c===f)}for(e=0;e<d.length;e++)b=m.get(d[e],"data-tab-id"),k.toggle(d[e],this.css.tabMenuSelected,c===b)}},_layerLoaded:function(a){var c=this.layers[a],b=c.layer,d={layer:b,layerInfo:c,layerIndex:a},e=new C;if(b)if(b.loaded)e.resolve(d);else if(b.loadError)e.reject(b.loadError);else{var f,h;f=r.once(b,"load",l.hitch(this,function(){h.remove();e.resolve(d)}));h=r.once(b,"error",l.hitch(this,
function(a){f.remove();e.reject(a)}))}else e.resolve(d);return e.promise},_checkboxStatus:function(a){return!!a.visibility},_WMSVisible:function(a,c){var b=[];a&&a.layer&&(b=a.layer.visibleLayers);return-1<n.indexOf(b,c.name)},_subCheckboxStatus:function(a,c){var b;switch(a.layer.declaredClass){case "esri.layers.KMLLayer":b=c.visible;break;case "esri.layers.WMSLayer":b=this._WMSVisible(a,c);break;default:b=c.defaultVisibility}return!!b},_getLayerTitle:function(a){var c="",b=a.layer;(a=a.layerInfo)&&
a.title?c=a.title:b&&b.arcgisProps&&b.arcgisProps.title?c=b.arcgisProps.title:b&&b.name?c=b.name:a&&a.id?c=a.id:b&&b.id&&(c=b.id);return this.removeUnderscores?c.replace(/_/g," "):c},_showSublayers:function(a){return a.hasOwnProperty("showSubLayers")?a.showSubLayers:this.showSubLayers},_opacityChange:function(a){if(this.layer)this.layer.setOpacity(a);else if(this.layers)for(var c=0;c<this.layers.length;c++)this.layers[c].layerObject&&this.layers[c].layerObject.setOpacity(a)},_legend:function(a,c,
b){var d=g.create("div",{role:"tabpanel","data-tab-id":"legend",className:this.css.tab+" "+this.css.legend},a);require(["esri/dijit/Legend"],l.hitch(this,function(a){var e=[c];if(c&&c.featureCollection&&c.featureCollection.layers)for(var e=c.featureCollection.layers,h=0;h<e.length;h++)e[h].layer=e[h].layerObject;a=new a({map:this.map,layerInfos:e},g.create("div"));g.place(a.domNode,d);a.startup();this._nodes[b].legend=a}))},_slider:function(a,c,b,d){a=g.create("div",{role:"tabpanel","data-tab-id":"opacity",
className:this.css.tab+" "+this.css.slider},a);var e=g.create("div",{},a),f=g.create("div",{},a);require(["dijit/form/HorizontalSlider","dijit/form/HorizontalRuleLabels"],l.hitch(this,function(a,q){var h=new a({showButtons:!1,minimum:.1,maximum:1,layer:c,layers:b,discreteValues:.1,intermediateChanges:!0,value:d,onChange:this._opacityChange},e),g=new q({container:"bottomDecoration",count:0,className:this.css.sliderLabels,labels:["0","50","100"]},f);h.startup();g.startup()}))},_createLayerNodes:function(){this._layersNode.innerHTML=
"";this._noLayersNode.innerHTML="";k.remove(this._container,this.css.noLayers);var a=this._loadedLayers;if(a&&a.length)for(var c=0;c<a.length;c++){var b=a[c];if(b){var d=b.layer,e=b.layerIndex,f=b.layerInfo;if(f){if(f.featureCollection&&!f.hasOwnProperty("visibility")){var h=f.featureCollection.layers[0];h&&h.layerObject&&(f.visibility=h.layerObject.visible)}d&&!f.hasOwnProperty("visibility")&&(f.visibility=f.layer.visible);d&&!f.hasOwnProperty("id")&&(f.id=f.layer.id);var q,h=g.create("li",{role:"menuitem",
className:this.css.layer});g.place(h,this._layersNode,"first");q=g.create("div",{className:this.css.title},h);var l=g.create("div",{className:this.css.tabContainer},h),n=g.create("ul",{role:"tablist",className:this.css.tabMenu+" "+this.css.clearFix},l),l=g.create("div",{className:this.css.tabs},l),r=[],y;d&&(y=d.declaredClass);var t=this._checkboxStatus(f),u=g.create("div",{className:this.css.titleContainer},q),p=this.id+"_checkbox_"+e,z=g.create("input",{type:"checkbox",id:p,"data-layer-index":e,
className:this.css.checkbox},u);m.set(z,"checked",t);var w=g.create("div",{tabindex:0,role:"button","data-layer-index":e,title:x.widgets.layerList.expand,className:this.css.toggleButton+" "+this.css.iconExpand},u),v;f.button&&(v=f.button,k.add(h,this.css.hasButton),k.add(v,this.css.button),g.place(v,u));b=this._getLayerTitle(b);b=g.create("label",{className:this.css.label,textContent:b},u);m.set(b,"for",p);var p=g.create("div",{className:this.css.clear},u),G;f.content&&(G=f.content,k.add(G,this.css.content),
g.place(G,q));q={checkbox:z,title:q,tabMenu:n,tabs:l,titleContainer:u,label:b,layer:h,toggle:w,clear:p,button:v,content:G,subNodes:r};this._nodes[e]=q;k.toggle(h,this.css.listVisible,t);if(d&&(J({layer:d,className:this.css.layerScaleInvisible,nodes:q}),q=d.layerInfos,"esri.layers.KMLLayer"===y&&(q=d.folders),u=this._showSublayers(f),"esri.layers.ArcGISTiledMapServiceLayer"!==y&&q&&q.length))if(u){g.create("li",{tabindex:0,"data-tab-id":"sublayers","data-layer-index":e,role:"tab",className:this.css.tabMenuItem,
textContent:x.widgets.layerList.sublayers},n);k.add(h,this.css.hasSubList);k.toggle(h,this.css.subListExpand,t);for(var t=g.create("div",{className:this.css.tab,"data-tab-id":"sublayers",role:"tabpanel"},l),u=g.create("ul",{role:"group",className:this.css.subList},t),C,z=[],t=0;t<q.length;t++){var b=q[t],A,p=-1,w=null;"esri.layers.ArcGISDynamicMapServiceLayer"===y?(A=b.id,p=b.parentLayerId,b.subLayerIds||(b.defaultVisibility=d&&d.visibleLayers&&-1!==d.visibleLayers.indexOf(b.id)?!0:!1)):"esri.layers.KMLLayer"===
y?(A=b.id,p=b.parentFolderId):"esri.layers.WMSLayer"===y&&(A=b.name,p=-1);if(-1!==p)if(w=this._nodes[e].subNodes[p],z[p])w=z[p];else{var B=w.subLayer,w=g.create("ul",{role:"group",className:this.css.subList},B);k.add(B,this.css.hasSubList);k.toggle(B,[this.css.listVisible,this.css.subListExpand],K);z[p]=w}var K=this._subCheckboxStatus(f,b);K&&!C&&(C=!0);var H=this.id+"_checkbox_sub_"+e+"_"+A,p=g.create("li",{role:"menuitem",className:this.css.subListLayer},w||u),B=g.create("div",{className:this.css.title},
p),I=g.create("div",{className:this.css.titleContainer},B),D=g.create("input",{type:"checkbox",id:H,"data-layer-index":e,"data-sublayer-index":A,className:this.css.checkbox},I);m.set(D,"checked",K);b=g.create("label",{className:this.css.label,textContent:b.title||b.name||""},I);m.set(b,"for",H);H=g.create("div",{className:this.css.clear},I);r[A]={subList:u,subSubList:w,subLayer:p,subTitle:B,subTitleContainer:I,subCheckbox:D,subLabel:b,subClear:H}}}else for(t=0;t<q.length;t++)b=q[t],p=-1,"esri.layers.ArcGISDynamicMapServiceLayer"===
y&&(p=b.parentLayerId,b.subLayerIds||(b.defaultVisibility=d&&d.visibleLayers&&-1!==d.visibleLayers.indexOf(b.id)?!0:!1));if(f.hasOwnProperty("showLegend")?f.showLegend:this.showLegend)g.create("li",{tabindex:0,role:"tab",className:this.css.tabMenuItem,"data-layer-index":e,"data-tab-id":"legend",textContent:x.widgets.layerList.legend},n),this._legend(l,f,e);if(f.hasOwnProperty("showOpacitySlider")?f.showOpacitySlider:this.showOpacitySlider){var E;!d&&f.featureCollection?(E=f.featureCollection.layers,
f=f.featureCollection.layers[0].opacity):f=d.opacity;g.create("li",{tabindex:0,"data-tab-id":"opacity",role:"tab",className:this.css.tabMenuItem,"data-layer-index":e,textContent:x.widgets.layerList.opacity},n);this._slider(l,d,E,f)}d=F("."+this.css.tab,l);if(e=d.length)k.add(h,[this.css.hasTabContent]),k.add(d[0],this.css.tabSelected);1<e&&(k.add(h,this.css.tabMenuVisible),h=F("li",n),h.length&&k.add(h[0],this.css.tabMenuSelected))}}}else k.add(this._container,this.css.noLayers),m.set(this._noLayersNode,
"textContent",x.widgets.layerList.noLayers)},_removeEvents:function(){if(this._layerEvents&&this._layerEvents.length)for(var a=0;a<this._layerEvents.length;a++)this._layerEvents[a].remove();this._layerEvents=[]},_emitToggle:function(a,c,b){this.emit("toggle",{layerIndex:a,subLayerIndex:c,visible:b})},_toggleVisible:function(a,c){var b=this._nodes[a].checkbox;k.toggle(this._nodes[a].layer,this.css.listVisible,c);var d=m.get(b,"checked");k.contains(this._nodes[a].layer,this.css.hasSubList)&&k.toggle(this._nodes[a].layer,
this.css.subListExpand,d);d!==c&&(m.set(b,"checked",c),this._emitToggle(a,null,c))},_layerVisChangeEvent:function(a,c,b){var d;d=c?a.layerInfo.featureCollection.layers[b].layer:a.layer;b=r(d,"visibility-change",l.hitch(this,function(b){var d=this.layers&&this.layers[a.layerIndex];d&&(d.visibility=b.visible);c?this._featureCollectionVisible(a.layerIndex,b.visible):this._toggleVisible(a.layerIndex,b.visible)}));this._layerEvents.push(b);if(!c){var e=this._nodes[a.layerIndex],f=this.css.layerScaleInvisible;
J({nodes:e,className:f,layer:d});b=r(d,"scale-visibility-change",l.hitch(this,function(a){J({nodes:e,className:f,layer:d})}));this._layerEvents.push(b);"esri.layers.ArcGISDynamicMapServiceLayer"===d.declaredClass&&(b=r(this.map,"zoom-end",l.hitch(this,function(){this._subLayerScale(a)})),this._layerEvents.push(b),this._subLayerScale(a))}},_subLayerScale:function(a){var c=a.layer.createDynamicLayerInfosFromLayerInfos(),b=R._getLayersForScale(this.map.getScale(),c);n.forEach(c,l.hitch(this,function(c){if(!c.subLayerIds){c=
c.id;var d=this._nodes[a.layerIndex].subNodes[c];if(d){var f=d.subLayer,d=d.subCheckbox,h=!1;-1===n.indexOf(b,c)&&(h=!0);k.toggle(f,this.css.layerScaleInvisible,h);h?(m.set(f,"aria-disabled","true"),m.set(d,"disabled","disabled")):(m.remove(f,"aria-disabled"),m.remove(d,"disabled"))}}}))},_layerEvent:function(a){var c=a.layerInfo;if(c.featureCollection&&c.featureCollection.layers&&c.featureCollection.layers.length){if((c=c.featureCollection.layers)&&c.length)for(var b=0;b<c.length;b++)this._layerVisChangeEvent(a,
!0,b)}else this._layerVisChangeEvent(a)},_getVisibleLayers:function(a,c){var b=a.layerInfos,d,e=[-1];"undefined"!==typeof c&&(b[c].defaultVisibility=!b[c].defaultVisibility);for(d=0;d<b.length;d++){var f=b[d];f.defaultVisibility&&(e.push(f.id),f=n.lastIndexOf(e,-1),-1!==f&&e.splice(f,1))}b=[];for(d=0;d<e.length;d++)f=e[d],this._allIdsPresent(a,f,e)&&b.push(f);d=[];for(e=0;e<b.length;e++)(f=this._getLayerInfo(a,b[e]))&&null===f.subLayerIds&&d.push(b[e]);d.length||(d=[-1]);return d},_toggleState:function(a,
c){var b,d;a=parseInt(a,10);d=this._nodes[a];d.legend&&d.legend.refresh();null!==c?(c=parseInt(c,10),b=d.subNodes[c].subLayer,d=d.subNodes[c].subCheckbox):(b=d.layer,d=d.checkbox);d=m.get(d,"checked");k.contains(b,this.css.hasSubList)&&k.toggle(b,this.css.subListExpand,d);k.toggle(b,this.css.listVisible,d)},_toggleLayer:function(a,c){if(this.layers&&this.layers.length){var b;a=parseInt(a,10);var d=this.layers[a],e=d.layer,f=e&&e.layerInfos,h;e&&(h=e.declaredClass);var g=d.featureCollection;if(g)for(b=
!d.visibility,d.visibility=b,d=0;d<g.layers.length;d++)g.layers[d].layerObject.setVisibility(b);else if(e)if(null!==c){if("esri.layers.ArcGISDynamicMapServiceLayer"===h)c=parseInt(c,10),g=this._getVisibleLayers(e,c),e.setVisibleLayers(g);else if("esri.layers.KMLLayer"===h)for(c=parseInt(c,10),g=e.folders,d=0;d<g.length;d++){if(h=g[d],h.id===c){e.setFolderVisibility(h,!h.visible);break}}else"esri.layers.WMSLayer"===h&&(g=e.visibleLayers,d=n.indexOf(g,c),-1===d?g.push(c):g.splice(d,1),e.setVisibleLayers(g));
f&&(b=f[c].defaultVisibility)}else"esri.layers.ArcGISDynamicMapServiceLayer"===h&&(g=this._getVisibleLayers(e),e.setVisibleLayers(g)),b=!e.visible,d.visibility=b,e.setVisibility(b);else b=!d.visible,d.setVisibility(b);this._emitToggle(a,c,b)}},_featureCollectionVisible:function(a,c){var b=this.layers[a],d=b.visibleLayers,e=b.featureCollection.layers;(d&&d.length?n.every(d,function(a){return e[a].layer.visible===c}):n.every(e,function(a){return a.layer.visible===c}))&&this._toggleVisible(a,c)},_setLayerEvents:function(){var a=
this._loadedLayers;a&&a.length&&n.forEach(a,function(a,b){var c=a.layer;if(c)if(c.getMap())this._layerEvent(a);else{var e=r(this.map,"layer-add-result",l.hitch(this,function(b){b.layer===c&&this._layerEvent(a)}));this._layerEvents.push(e)}},this)},_allIdsPresent:function(a,c,b){a=this._walkUpLayerIds(a,c);return n.every(a,function(a){return-1<n.indexOf(b,a)})},_walkUpLayerIds:function(a,c){var b=this._getLayerInfo(a,c),d=[];if(b)for(;-1!==b.parentLayerId;)(b=this._getLayerInfo(a,b.parentLayerId))&&
d.push(b.id);return d},_getLayerInfo:function(a,c){for(var b,d=0;d<a.layerInfos.length;d++){var e=a.layerInfos[d];if(e.id===c){b=e;break}}return b},_isSupportedLayerType:function(a){return a&&!a._basemapGalleryLayerType||a&&"basemap"!==a._basemapGalleryLayerType},_createLayerInfo:function(a){return{layer:a}},_updateAllMapLayers:function(){if(this.map&&(!this.layers||!this.layers.length)){var a=[];n.forEach(this.map.layerIds,function(c){c=this.map.getLayer(c);this._isSupportedLayerType(c)&&a.push(this._createLayerInfo(c))},
this);n.forEach(this.map.graphicsLayerIds,function(c){c=this.map.getLayer(c);this._isSupportedLayerType(c)&&c._params&&c._params.drawMode&&a.push(this._createLayerInfo(c))},this);this._set("layers",a)}},_init:function(){this._visible();this._updateAllMapLayers();this.refresh().always(l.hitch(this,function(){this.set("loaded",!0);this.emit("load")}))},_visible:function(){this.visible?D.set(this.domNode,"display","block"):D.set(this.domNode,"display","none")},_setThemeAttr:function(a){this.domNode&&
(k.remove(this.domNode,this.theme),k.add(this.domNode,a));this._set("theme",a)},_setMapAttr:function(a){this._set("map",a);this._created&&this._mapLoaded(this.map).then(l.hitch(this,function(){this._updateAllMapLayers();this.refresh()}))},_setLayersAttr:function(a){this._set("layers",a);this._created&&this.refresh()},_setRemoveUnderscoresAttr:function(a){this._set("removeUnderscores",a);this._created&&this.refresh()},_setShowSubLayersAttr:function(a){this._set("showSubLayers",a);this._created&&this.refresh()},
_setShowOpacitySliderAttr:function(a){this._set("showOpacitySlider",a);this._created&&this.refresh()},_setShowLegendAttr:function(a){this._set("showLegend",a);this._created&&this.refresh()},_setVisibleAttr:function(a){this._set("visible",a);this._created&&this._visible()}});N("extend-esri")&&l.setObject("dijit.LayerList",v,M);return v});