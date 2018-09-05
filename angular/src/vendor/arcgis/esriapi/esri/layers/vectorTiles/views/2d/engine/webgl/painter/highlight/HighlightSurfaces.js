// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://js.arcgis.com/3.24/esri/copyright.txt for details.
//>>built
define("esri/layers/vectorTiles/views/2d/engine/webgl/painter/highlight/HighlightSurfaces",["require","exports","../../../../../webgl/FramebufferObject","../../../../../webgl/Texture"],function(h,k,e,g){function f(a,b,c){b=new g(a,{target:3553,pixelFormat:6408,dataType:5121,wrapMode:33071,width:b,height:c,samplingMode:9729});a=e.createWithAttachments(a,b,{colorTarget:0,depthStencilTarget:2});return[b,a]}return function(){function a(){this._height=this._width=void 0;this._resources=null}a.prototype._initialize=
function(a,c,d){this._width=c;this._height=d;var b=f(a,c,d),e=b[0],b=b[1];a=f(a,c,d);this._resources={sharedBlur1Tex:e,sharedBlur1Fbo:b,sharedBlur2Tex:a[0],sharedBlur2Fbo:a[1]}};a.prototype.setup=function(a,c,d){!this._resources||this._width===c&&this._height===d||this._teardown();this._resources||this._initialize(a,c,d)};a.prototype._teardown=function(){this._resources.sharedBlur1Tex.dispose();this._resources.sharedBlur1Fbo.dispose();this._resources.sharedBlur2Tex.dispose();this._resources.sharedBlur2Fbo.dispose();
this._resources=null};a.prototype.dispose=function(){this._resources&&this._teardown()};Object.defineProperty(a.prototype,"sharedBlur1Tex",{get:function(){return this._resources.sharedBlur1Tex},enumerable:!0,configurable:!0});Object.defineProperty(a.prototype,"sharedBlur1Fbo",{get:function(){return this._resources.sharedBlur1Fbo},enumerable:!0,configurable:!0});Object.defineProperty(a.prototype,"sharedBlur2Tex",{get:function(){return this._resources.sharedBlur2Tex},enumerable:!0,configurable:!0});
Object.defineProperty(a.prototype,"sharedBlur2Fbo",{get:function(){return this._resources.sharedBlur2Fbo},enumerable:!0,configurable:!0});return a}()});