// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://js.arcgis.com/3.24/esri/copyright.txt for details.
//>>built
require({cache:{"url:esri/dijit/geoenrichment/templates/InfographicsMainPage.html":'\x3cdiv data-dojo-type\x3d"dijit/layout/ContentPane" data-dojo-props\x3d"row: 0" class\x3d"Wizard_TopPane"\x3e\r\n    \x3cdiv class\x3d"DataBrowser_Title"\x3e${nls.mainTitle}\x3c/div\x3e\r\n    \x3ctable class\x3d"InfographicsMainPage_CountryAndTheme"\x3e\r\n        \x3ctr\x3e\r\n            \x3ctd\x3e\r\n                \x3cdiv class\x3d"configureInfographicsStep configureInfographicsStepOne"\x3e\x3c/div\x3e\r\n            \x3c/td\x3e\r\n            \x3ctd class\x3d"Wizard_AlignRight"\x3e${nls.chooseCountry}\x3c/td\x3e\r\n            \x3ctd\x3e\r\n                \x3cselect data-dojo-type\x3d"dijit/form/Select"\r\n                    data-dojo-attach-point\x3d"countrySelect"\r\n                    data-dojo-props\x3d"maxHeight: 151"\r\n                    data-dojo-attach-event\x3d"onChange: _onCountryChanged"\x3e\r\n                \x3c/select\x3e\r\n            \x3c/td\x3e\r\n        \x3c/tr\x3e\r\n        \x3ctr\x3e\r\n            \x3ctd colspan\x3d"2" class\x3d"Wizard_AlignRight"\x3e${nls.chooseTheme}\x3c/td\x3e\r\n            \x3ctd\x3e\r\n                \x3cselect data-dojo-attach-point\x3d"themeSelect" data-dojo-type\x3d"dijit/form/Select" data-dojo-attach-event\x3d"onChange: _onThemeChange"\x3e\r\n                    \x3coption value\x3d"common"\x3e${nls.dark}\x3c/option\x3e\r\n                    \x3coption value\x3d"light"\x3e${nls.light}\x3c/option\x3e\r\n                \x3c/select\x3e\r\n            \x3c/td\x3e\r\n        \x3c/tr\x3e\r\n        \x3ctr\x3e\r\n            \x3ctd style\x3d"padding-top: 6px;"\x3e\r\n                \x3cdiv class\x3d"configureInfographicsStep configureInfographicsStepTwo"\x3e\x3c/div\x3e\r\n            \x3c/td\x3e\r\n            \x3ctd colspan\x3d"2"\x3e\r\n                \x3cdiv class\x3d"InfographicsMainPage_ChooseDataCollection"\x3e${nls.chooseDataCollection}\x3c/div\x3e\r\n            \x3c/td\x3e\r\n        \x3c/tr\x3e\r\n    \x3c/table\x3e\r\n\x3c/div\x3e\r\n\x3cdiv data-dojo-type\x3d"dijit/layout/ContentPane" data-dojo-props\x3d"row: 1" class\x3d"InfographicsMainPage_VarListsPane"\x3e\r\n    \x3cdiv data-dojo-attach-point\x3d"varListNode"\x3e\x3c/div\x3e\r\n    \x3cdiv data-dojo-attach-point\x3d"progressDiv" class\x3d"Wizard_Progress"\x3e\x3c/div\x3e\r\n\x3c/div\x3e\r\n\x3cdiv data-dojo-type\x3d"dijit/layout/ContentPane" data-dojo-props\x3d"row: 2" class\x3d"Wizard_BottomPane"\x3e\r\n    \x3cspan data-dojo-attach-point\x3d"addMoreNode" class\x3d"InfographicsMainPage_AddVariables Wizard_Link" data-dojo-attach-event\x3d"click: _onAddVariables" style\x3d"display: none;"\x3e${nls.addVariables}\x3c/span\x3e\r\n\r\n    \x3ctable class\x3d"InfographicsMainPage_Step3"\x3e\r\n        \x3ctr\x3e\r\n            \x3ctd style\x3d"vertical-align: top; padding: 10px 0 0 0;"\x3e\r\n                \x3cdiv class\x3d"configureInfographicsStep configureInfographicsStepThree"\x3e\x3c/div\x3e\r\n            \x3c/td\x3e\r\n            \x3ctd style\x3d"padding: 0;"\x3e\r\n                \x3cdiv data-dojo-type\x3d"esri/dijit/geoenrichment/BufferOptions"\r\n                    data-dojo-attach-point\x3d"bufferOptions"\r\n                    data-dojo-attach-event\x3d"onChange: _onBufferChange"\r\n                    class\x3d"InfographicsMainPage_BufferOptions"\x3e\r\n                \x3c/div\x3e\r\n            \x3c/td\x3e\r\n        \x3c/tr\x3e\r\n    \x3c/table\x3e\r\n\r\n    \x3cdiv class\x3d"Wizard_Buttons"\x3e\r\n        \x3cbutton class\x3d"Wizard_Button" data-dojo-attach-point\x3d"okButton" data-dojo-attach-event\x3d"click: _onOK" disabled\x3d"disabled"\x3e${nls.ok}\x3c/button\x3e\r\n        \x3cbutton class\x3d"Wizard_Button" data-dojo-attach-event\x3d"click: _onCancel"\x3e${nls.cancel}\x3c/button\x3e\r\n    \x3c/div\x3e\r\n\x3c/div\x3e\r\n'}});
define("esri/dijit/geoenrichment/InfographicsMainPage","require ../../declare dojo/_base/lang dojo/on dojo/dom-construct dojo/dom-class dojo/Deferred ./_WizardPage dojo/i18n!../../nls/jsapi dojo/text!./templates/InfographicsMainPage.html ../../tasks/geoenrichment/GeoenrichmentTask ./config ./_Invoke ./CheckList ./theme esri/dijit/geoenrichment/utils/TooltipUtil dijit/layout/ContentPane dijit/form/Select ./BufferOptions".split(" "),function(v,g,k,w,f,x,y,l,e,m,n,h,p,q,r,t){e=e.geoenrichment.dijit.InfographicsMainPage;
var u=g([q],{renderRow:function(a,c){var b=a.item,d=f.create("div",{"class":"InfographicsMainPage_Item"},this.itemsDiv);f.create("div",{"class":"dijit dijitInline dijitCheckBox InfographicsMainPage_ItemCheck"},d);var e=f.create("div",{"class":"InfographicsMainPage_ItemLabel TrimWithEllipses",innerHTML:b.title},d);f.create("div",{"class":"InfographicsMainPage_ItemImage InfographicsMainPage_ItemImage_"+b.type},e);return d}});return g("esri.dijit.geoenrichment.InfographicsMainPage",[l,p],{templateString:m,
nls:e,options:null,countryID:"US",_varList:null,_eventMap:{"add-variables":!0,ok:!0,cancel:!0},constructor:function(){this._task=new n(h.server);this._task.token=h.token},buildRendering:function(){this.inherited(arguments);var a=k.hitch(this,this.invoke,"_onSelect"),c=this._varList=new u({},this.varListNode);c.on("dgrid-select",a);c.on("dgrid-deselect",a);t.autoTooltip(this.varListNode)},startup:function(){this._started||(this.inherited(arguments),this.countrySelect.addOption({value:"_",label:e.loading}),
this.countrySelect.set("disabled",!0),this.showProgress(this._task.getAvailableCountries(),"_onCountriesResponse"))},_onCountriesResponse:function(a){this.countrySelect.set("disabled",!1);for(var c=[],b=0;b<a.length;b++)c.push({label:a[b].name,value:a[b].id});this.countrySelect.set("options",c);this.countrySelect.set("value",this.countryID)},_setOptionsAttr:function(a){this._set("options",a);this.themeSelect.set("value",a.theme);this.bufferOptions.set("buffer",a.studyAreaOptions);this._renderItems()},
_onCountryChanged:function(){this.countryID=this.countrySelect.get("value");this._renderItems()},_onThemeChange:function(a,c){var b=this.options.theme,d=this.themeSelect.get("value");r.change(this.varListNode,b,d);this.options.theme=d},_renderItems:function(){var a=this.countrySelect.get("value");a&&"_"!=a&&this.showProgress(this.options.getItems(a),"_onGetItems")},_onGetItems:function(a){var c=[],b=[],d;for(d=0;d<a.length;d++){var e=a[d],f=d.toString();c.push({id:f,item:e});e.isVisible&&b.push(f)}this._varList.set("items",
c);this._varList.clearSelection();for(d=0;d<b.length;d++)this._varList.select(b[d]);this.addMoreNode.style.display="";this.resize()},_onSelect:function(){var a=!1,c=this._varList.get("selection"),b;for(b in c)if(c[b]){a=!0;break}this.okButton.disabled=!a},_onBufferChange:function(){this.options.studyAreaOptions=this.bufferOptions.get("buffer")},_onAddVariables:function(){this.onAddVariables()},onAddVariables:function(){},_onOK:function(){for(var a=this._varList,c=a.get("store").data,b=0;b<c.length;b++)c[b].item.isVisible=
a.isSelected(c[b]);this.onOK()},onOK:function(){},_onCancel:function(){this.onCancel()},onCancel:function(){}})});