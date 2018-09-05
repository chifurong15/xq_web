// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://js.arcgis.com/3.24/esri/copyright.txt for details.
//>>built
define("esri/dijit/metadata/editor/EditorDialog","dojo/_base/declare dojo/_base/lang dojo/aspect dojo/dom-class dojo/dom-construct dojo/has dijit/_WidgetBase dojo/i18n!../nls/i18nBase dijit/Dialog ./Editor ../../../kernel".split(" "),function(a,c,e,f,p,g,h,k,l,m,n){a=a([h],{_checkForChanges:!0,dialog:null,editor:null,gxeAdaptor:null,gxeContext:null,title:null,postCreate:function(){this.inherited(arguments)},hide:function(){this._checkForChanges=!1;this.dialog&&this.dialog.hide()},onDialogClose:function(){},
show:function(){null===this.title&&(this.title=k.editor.editorDialog.caption);var d=this.editor=new m({dialogBroker:this,gxeAdaptor:this.gxeAdaptor,gxeContext:this.gxeContext}),b=this.dialog=new l({"class":"gxeDialog gxeEditorDialog",title:this.title,content:d,autofocus:!1});this.isLeftToRight()||f.add(b.domNode,"gxeRtl");var a=this;this.own(e.around(b,"hide",c.hitch(this,function(e){return function(){a._checkForChanges&&d.getEditDocument()?d.primaryToolbar._onCloseClick():c.hitch(b,e)()}})));this.own(b.on("hide",
c.hitch(this,function(){setTimeout(c.hitch(this,function(){d.destroyRecursive(!1);b.destroyRecursive(!1);this.destroyRecursive(!1)}),2E3);this.onDialogClose()})));b.show().then(function(){d.initializeView()})}});g("extend-esri")&&c.setObject("dijit.metadata.editor.EditorDialog",a,n);return a});