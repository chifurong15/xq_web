// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://js.arcgis.com/3.24/esri/copyright.txt for details.
//>>built
define("esri/layers/vectorTiles/views/2d/engine/webgl/rendererInfoUtils","require exports ../../../../core/tsSupport/assignHelper ../../../../Graphic ../../../../arcade/Feature ../../../../support/arcadeUtils ./enums ./visualVariablesUtils".split(" "),function(v,c,p,r,t,f,u,g){function q(a,b,k){if(!a)return null;var c=0,d={};a=a.clone();var l=a.visualVariables,m=null;if("simple"!==a.type){var e=a.valueExpression;if(!a.field&&e){var h="$$fake"+c++,g=f.createFunction(e);d[h]=function(a,c){n.repurposeFromGraphicLikeObject(a.geometry,
a.attributes,k);return f.executeFunction(g,{vars:{$feature:n,$view:f.getViewInfo(c)},spatialReference:b})};a.field=h;a.valueExpression=null;m=function(a,b){b.attributes[h]=d[h](b);return a.valueExpression?a.getSymbol(r.fromJSON(b)):a.getSymbol(b)}}}l&&(a.visualVariables=l.map(function(a){if(a.normalizationField){var l=a.field,m=a.normalizationField,e="$$fake"+c++;d[e]=function(a,b){return a.attributes[l]/a.attributes[m]};a=p({},a);a.field=e;delete a.normalizationField;return a}if(a.valueExpression&&
"$view.scale"!==a.valueExpression){var g=a.valueExpression,e="$$fake"+c++,h=f.createFunction(g);d[e]=function(a,c){n.repurposeFromGraphicLikeObject(a.geometry,a.attributes,k);return f.executeFunction(h,{vars:{$feature:n,$view:f.getViewInfo(c)},spatialReference:b})};a=p({},a);a.field=e;delete a.valueExpression}return a}));return{renderer:a,normalizingFunctions:d,getSymbolFunction:m}}Object.defineProperty(c,"__esModule",{value:!0});var n=new t;c.createRendererInfo=function(a,b,c){var k=(b=q(a,b,c)||
{renderer:null,normalizingFunctions:null,getSymbolFunction:null},b.normalizingFunctions),d=b&&b.getSymbolFunction;a=b&&b.renderer||a;b=g.convertVisualVariables(a.visualVariables);return{renderer:a,vvFields:b.vvFields,vvRanges:b.vvRanges,getValue:function(a,b){var c=k[b];return c?c(a):a.attributes[b]},getSymbol:function(a){return d?d(this.renderer,a):this.renderer.getSymbol?this.renderer.getSymbol.call(this.renderer,a):null}}};c.getNormalizedRenderer=function(a,b,c){return(b=q(a,b,c)||{renderer:null,
normalizingFunctions:null,getSymbolFunction:null},b.renderer)||a};c.getSymbol=function(a,b){return a.getSymbol(b)};c.isRendererWebGLCompatible=function(a){if(!a||-1===["simple","class-breaks","unique-value"].indexOf(a.type))return!1;if(a.visualVariables){var b=0;for(a=a.visualVariables;b<a.length;b++){var c=a[b];switch(c.type){case "color":case "opacity":if(c.stops&&8<c.stops.length)return!1;break;case "size":if(g.getTypeOfSizeVisualVariable(c)===u.WGLVVFlag.SIZE_FIELD_STOPS&&c.stops&&6<c.stops.length)return!1}}}return!0}});