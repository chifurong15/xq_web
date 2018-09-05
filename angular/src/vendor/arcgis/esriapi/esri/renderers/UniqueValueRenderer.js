// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://js.arcgis.com/3.24/esri/copyright.txt for details.
//>>built
define("esri/renderers/UniqueValueRenderer","dojo/_base/declare dojo/_base/array dojo/_base/lang dojo/has ../kernel ../lang ../symbols/jsonUtils ./Renderer ../support/expressionUtils".split(" "),function(g,d,e,k,l,m,h,n,p){g=g(n,{declaredClass:"esri.renderer.UniqueValueRenderer",constructor:function(b,a,c,e,f){this.values=[];this._symbols={};this.infos=[];b&&!b.declaredClass?(a=b,this.defaultSymbol=(b=a.defaultSymbol)&&(b.declaredClass?b:h.fromJson(b)),this.attributeField=a.field1,this.attributeField2=
a.field2,this.attributeField3=a.field3,this.fieldDelimiter=a.fieldDelimiter,this.defaultLabel=a.defaultLabel,this.setValueExpression(a.valueExpression),this.valueExpressionTitle=a.valueExpressionTitle,this.legendOptions=a.legendOptions,a.backgroundFillSymbol&&(this.backgroundFillSymbol=h.fromJson(a.backgroundFillSymbol)),d.forEach(a.uniqueValueInfos,this._addValueInfo,this)):(this.defaultSymbol=b,this.attributeField=a,this.attributeField2=c,this.attributeField3=e,this.fieldDelimiter=f);this._multiple=
!!this.attributeField2},addValue:function(b,a){var c=e.isObject(b)?b:{value:b,symbol:a};this._addValueInfo(c)},removeValue:function(b){var a=d.indexOf(this.values,b);-1!==a&&(this.values.splice(a,1),this._hasNullKeyword=this._evalNullKeyword(this.values),delete this._symbols[b],this.infos.splice(a,1))},getUniqueValueInfo:function(b){var a=this.attributeField,c=b.attributes;if(this.valueExpression)a=this._getDataValue(b,this._uvInfo,null,this._cache.uvInfo),a=this._normalizeNullValue(a);else if(this._multiple){b=
this.attributeField2;var d=this.attributeField3,f=[];a&&f.push(this._normalizeNullValue(c[a]));b&&f.push(this._normalizeNullValue(c[b]));d&&f.push(this._normalizeNullValue(c[d]));a=f.join(this.fieldDelimiter||"")}else a=e.isFunction(a)?a(b):c[a],a=this._normalizeNullValue(a);return this._symbols[a]},setValueExpression:function(b){this.valueExpression=b;this._uvInfo={valueExpression:b};this._cache.uvInfo=this._createCache(this._uvInfo,!0)},getFieldsUsedInExpressions:function(){var b=this.inherited(arguments);
this.valueExpression&&(b=b.concat(p.extractFieldNames(this.valueExpression)));b.sort();return d.filter(b,function(a,c){return 0===c||b[c-1]!==a})},getSymbol:function(b){return(b=this.getUniqueValueInfo(b))&&b.symbol||this.defaultSymbol},_addValueInfo:function(b){var a=b.value;this.values.push(a);this._hasNullKeyword=this._evalNullKeyword(this.values);this.infos.push(b);var c=b.symbol;c&&!c.declaredClass&&(b.symbol=h.fromJson(c));this._symbols[a]=b},_nullCode:"\x3cNull\x3e",_normalizeNullValue:function(b){return this._hasNullKeyword&&
null==b?this._nullCode:b},_evalNullKeyword:function(b){var a=this.fieldDelimiter||"",c=new RegExp("(^|"+a+")("+this._nullCode+")("+a+"|$)");return d.some(b,function(b){return c.test(b)})},toJson:function(){var b=m.fixJson,a;a={type:"uniqueValue",field1:this.attributeField,field2:this.attributeField2,field3:this.attributeField3,fieldDelimiter:this.fieldDelimiter,valueExpression:this.valueExpression,valueExpressionTitle:this.valueExpressionTitle,legendOptions:e.clone(this.legendOptions),defaultSymbol:this.defaultSymbol&&
this.defaultSymbol.toJson(),defaultLabel:this.defaultLabel,uniqueValueInfos:d.map(this.infos||[],function(a){a=e.mixin({},a);a.symbol=a.symbol&&a.symbol.toJson();a.value+="";return b(a)})};this.backgroundFillSymbol&&(a.backgroundFillSymbol=this.backgroundFillSymbol.toJson());a=e.mixin(this.inherited(arguments),a);return b(a)}});k("extend-esri")&&e.setObject("renderer.UniqueValueRenderer",g,l);return g});