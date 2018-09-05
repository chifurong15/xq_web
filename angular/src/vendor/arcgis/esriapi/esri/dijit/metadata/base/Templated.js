// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://js.arcgis.com/3.24/esri/copyright.txt for details.
//>>built
define("esri/dijit/metadata/base/Templated","dojo/_base/declare dojo/_base/lang dojo/_base/array dojo/on dojo/keys dojo/dom-style dojo/has ./etc/docUtil dijit/_WidgetBase dijit/_TemplatedMixin dijit/_WidgetsInTemplateMixin dojo/i18n!../nls/i18nBase ../../../kernel".split(" "),function(d,g,t,h,e,k,l,f,m,n,p,q,r){d=d([m,n,p],{_destroyWasCalled:!1,_escapeSingleQuotes:!1,i18nBase:q,templateString:"\x3cdiv data-dojo-attach-point\x3d'containerNode'\x3e\x3c/div\x3e",hide:!1,postCreate:function(){this.inherited(arguments);
this.hide&&k.set(this.domNode,"display","none")},destroy:function(){this._destroyWasCalled=!0;this.inherited(arguments)},connectAriaClickable:function(b,a){b&&a&&(b.setAttribute("tabindex","0"),b.setAttribute("role","button"),this.own(h(b,"keyup",function(b){b.keyCode!==e.ENTER&&b.keyCode!==e.SPACE||a(b)})))},focusDown:function(b){if(this.labelWidget&&this.labelWidget.switchNode)this.labelWidget.switchNode.focus();else{var a,c;if((a=this.getChildren())&&0<a.length){if(a&&1<a.length&&a[0]._isGxeElement&&
"string"===typeof a[0].gxePath&&"/metadata/Esri/ArcGISstyle"===a[0].gxePath)return a[1].focusDown(b);if(a[0].labelWidget&&a[0].labelWidget.switchNode){a[0].labelWidget.switchNode.focus();return}if("function"===typeof a[0].ensureFocus){a[0].ensureFocus();return}if(a[0].inputWidget&&"function"===typeof a[0].inputWidget.ensureFocus){a[0].inputWidget.ensureFocus();return}if(a[0]._isGxeTabs){a[0]._tabButtons[0].domNode.focus();return}if(a[0]._isGxeSection||a[0]._isGxeDescriptor)return a[0].focusDown(b)}if(a&&
1===a.length&&a[0]._isGxeElement&&!a[0].showHeader)if((c=a[0].getChildren())&&1===c.length&&c[0]._isGxeTabs)c[0]._tabButtons[0].domNode.focus();else if(c&&1===c.length&&c[0]._isGxeDescriptor)(b=c[0].getChildren())&&1===b.length&&b[0]._isGxeTabs&&b[0]._tabButtons[0].domNode.focus();else return a[0].focusDown(b);else if(a&&0<a.length&&a[0]._isGxeMultiplicityHeader)a[0].tools.repeatElementNode.focus();else if(a&&0<a.length&&a[0]._isGxeNode)return a[0].focusDown(b)}},setI18nNodeText:function(b,a){f.setI18nNodeText(b,
a)},setNodeText:function(b,a){f.setNodeText(b,a)},_escapeValue:function(b){var a=this.inherited(arguments);if(this._escapeSingleQuotes&&-1!==a.indexOf("\x26#x27;")){for(var c=0;10>c;c++)if(-1!==a.indexOf("\\\x26#x27;"))a=a.replace(/\\&#x27;/g,"\x26#x27;");else break;a=a.replace(/&#x27;/g,"\\\x26#x27;")}return a}});l("extend-esri")&&g.setObject("dijit.metadata.base.Templated",d,r);return d});