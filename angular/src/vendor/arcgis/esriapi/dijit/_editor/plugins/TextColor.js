//>>built
define("dijit/_editor/plugins/TextColor","require dojo/colors dojo/_base/declare dojo/_base/lang ../_Plugin ../../form/DropDownButton".split(" "),function(g,h,k,m,e,l){var f=k("dijit._editor.plugins.TextColor",e,{buttonClass:l,colorPicker:"dijit/ColorPalette",useDefaultCommand:!1,_initButton:function(){this.command=this.name;this.inherited(arguments);var b=this;this.button.loadDropDown=function(d){function c(a){b.button.dropDown=new a({dir:b.editor.dir,ownerDocument:b.editor.ownerDocument,value:b.value,
onChange:function(a){b.editor.execCommand(b.command,a)},onExecute:function(){b.editor.execCommand(b.command,this.get("value"))}});d()}"string"==typeof b.colorPicker?g([b.colorPicker],c):c(b.colorPicker)}},updateState:function(){var b=this.editor,d=this.command;if(b&&b.isLoaded&&d.length){if(this.button){var c=this.get("disabled");this.button.set("disabled",c);if(c)return;var a;try{a=b.queryCommandValue(d)||""}catch(n){a=""}}""==a&&(a="#000000");"transparent"==a&&(a="#ffffff");"string"==typeof a?-1<
a.indexOf("rgb")&&(a=h.fromRgb(a).toHex()):(a=((a&255)<<16|a&65280|(a&16711680)>>>16).toString(16),a="#000000".slice(0,7-a.length)+a);this.value=a;(b=this.button.dropDown)&&b.get&&a!==b.get("value")&&b.set("value",a,!1)}}});e.registry.foreColor=function(b){return new f(b)};e.registry.hiliteColor=function(b){return new f(b)};return f});