// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://js.arcgis.com/3.24/esri/copyright.txt for details.
//>>built
define("esri/renderers/SimpleRenderer","dojo/_base/declare dojo/_base/lang dojo/has ../kernel ../lang ../symbols/jsonUtils ./Renderer".split(" "),function(b,c,d,e,f,g,h){b=b(h,{declaredClass:"esri.renderer.SimpleRenderer",constructor:function(a){if(a&&!a.declaredClass){var b=a;this.symbol=(a=b.symbol)&&(a.declaredClass?a:g.fromJson(a));this.label=b.label;this.description=b.description}else this.symbol=a},getSymbol:function(a){return this.symbol},toJson:function(){var a=c.mixin(this.inherited(arguments),
{type:"simple",label:this.label,description:this.description,symbol:this.symbol&&this.symbol.toJson()});return f.fixJson(a)}});d("extend-esri")&&c.setObject("renderer.SimpleRenderer",b,e);return b});