// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://js.arcgis.com/3.24/esri/copyright.txt for details.
//>>built
define("esri/layers/vectorTiles/views/2d/engine/webgl/brushes/WGLGeometryBrushMarker","require exports ../../../../../core/tsSupport/extendsHelper ../enums ../Utils ./WGLGeometryBrush ../../../../webgl/Texture ../../../../webgl/VertexArrayObject".split(" "),function(q,r,t,u,v,w,x,n){Object.defineProperty(r,"__esModule",{value:!0});q=function(p){function k(){var a=null!==p&&p.apply(this,arguments)||this;a._iconAttributeLocations={a_pos:0,a_vertexOffsetAndTex:1,a_id:2,a_color:3,a_outlineColor:4,a_sizeAndOutlineWidth:5};
a._iconAttributeLocationsVV={a_pos:0,a_vertexOffsetAndTex:1,a_id:2,a_color:3,a_outlineColor:4,a_sizeAndOutlineWidth:5,a_vv:6};a._iconAttributeLocationsHeatmap={a_pos:0,a_vertexOffsetAndTex:1,a_id:2,a_color:3,a_outlineColor:4,a_sizeAndOutlineWidth:5,a_weight:6};a._iconVertexAttributes={geometry:[{name:"a_pos",count:2,type:5122,offset:0,stride:24,normalized:!1,divisor:0},{name:"a_vertexOffsetAndTex",count:4,type:5120,offset:4,stride:24,normalized:!1,divisor:0},{name:"a_id",count:4,type:5121,offset:8,
stride:24,normalized:!0,divisor:0},{name:"a_color",count:4,type:5121,offset:12,stride:24,normalized:!0,divisor:0},{name:"a_outlineColor",count:4,type:5121,offset:16,stride:24,normalized:!0,divisor:0},{name:"a_sizeAndOutlineWidth",count:4,type:5121,offset:20,stride:24,normalized:!1,divisor:0}]};a._iconVertexAttributesWithVV={geometry:[{name:"a_pos",count:2,type:5122,offset:0,stride:40,normalized:!1,divisor:0},{name:"a_vertexOffsetAndTex",count:4,type:5120,offset:4,stride:40,normalized:!1,divisor:0},
{name:"a_id",count:4,type:5121,offset:8,stride:40,normalized:!0,divisor:0},{name:"a_color",count:4,type:5121,offset:12,stride:40,normalized:!0,divisor:0},{name:"a_outlineColor",count:4,type:5121,offset:16,stride:40,normalized:!0,divisor:0},{name:"a_sizeAndOutlineWidth",count:4,type:5121,offset:20,stride:40,normalized:!1,divisor:0},{name:"a_vv",count:4,type:5126,offset:24,stride:40,normalized:!1,divisor:0}]};a._iconVertexAttributesWithHeatmap={geometry:[{name:"a_pos",count:2,type:5122,offset:0,stride:28,
normalized:!1,divisor:0},{name:"a_vertexOffsetAndTex",count:4,type:5120,offset:4,stride:28,normalized:!1,divisor:0},{name:"a_id",count:4,type:5121,offset:8,stride:28,normalized:!0,divisor:0},{name:"a_color",count:4,type:5121,offset:12,stride:28,normalized:!0,divisor:0},{name:"a_outlineColor",count:4,type:5121,offset:16,stride:28,normalized:!0,divisor:0},{name:"a_sizeAndOutlineWidth",count:4,type:5121,offset:20,stride:28,normalized:!1,divisor:0},{name:"a_weight",count:1,type:5126,offset:24,stride:28,
normalized:!1,divisor:0}]};a._spritesTextureSize=new Float32Array(2);return a}t(k,p);k.prototype.getGeometryType=function(){return u.WGLGeometryType.MARKER};k.prototype.drawGeometry=function(a,d,b,e){e=a.context;var f=a.painter,c=a.rendererInfo,k=b.indexCount,l=b.indexFrom,g=b.materialInfo;b=g.materialKeyInfo;var h=b.heatmap,m=b.vvSizeMinMaxValue||b.vvSizeScaleStops||b.vvSizeFieldStops||b.vvSizeUnitValue||b.vvColor||b.vvRotation||b.vvOpacity;if(a=f.materialManager.getProgram(g.materialKey,a.drawPhase,
m?this._iconAttributeLocationsVV:this._iconAttributeLocations))e.bindProgram(a),m=this._getVAO(e,d,m,h),e.bindVAO(m),h?(g=this._getIntensityTexture(e,c.heatmapParameters),e.bindTexture(g,1),a.setUniform1i("u_texture",1),this._spritesTextureSize[0]=Math.round(c.heatmapParameters.radius),this._spritesTextureSize[1]=Math.round(c.heatmapParameters.radius)):(h=g.texBindingInfo[0],g=h.pageId,f.textureManager.bindSpritePage(e,g,h.unit),a.setUniform1i(h.semantic,h.unit),h=f.textureManager.sprites,this._spritesTextureSize[0]=
h.getWidth(g)/4,this._spritesTextureSize[1]=h.getHeight(g)/4),f=c.vvMaterialParameters.vvRotationEnabled&&"geographic"===c.vvMaterialParameters.vvRotationType?f.extrudeMatrix:f.extrudeNoRotationMatrix,a.setUniformMatrix4fv("u_transformMatrix",d.tileTransform.transform),a.setUniformMatrix4fv("u_extrudeMatrix",f),a.setUniform2fv("u_normalized_origin",d.tileTransform.displayCoord),a.setUniform2fv("u_mosaicSize",this._spritesTextureSize),a.setUniform1f("u_opacity",1),b.vvSizeMinMaxValue&&a.setUniform4fv("u_vvSizeMinMaxValue",
c.vvSizeMinMaxValue),b.vvSizeScaleStops&&a.setUniform1f("u_vvSizeScaleStopsValue",c.vvSizeScaleStopsValue),b.vvSizeFieldStops&&(a.setUniform1fv("u_vvSizeFieldStopsValues",c.vvSizeFieldStopsValues),a.setUniform1fv("u_vvSizeFieldStopsSizes",c.vvSizeFieldStopsSizes)),b.vvSizeUnitValue&&a.setUniform1f("u_vvSizeUnitValueWorldToPixelsRatio",c.vvSizeUnitValueToPixelsRatio),b.vvColor&&(a.setUniform1fv("u_vvColorValues",c.vvColorValues),a.setUniform4fv("u_vvColors",c.vvColors)),b.vvOpacity&&(a.setUniform1fv("u_vvOpacityValues",
c.vvOpacityValues),a.setUniform1fv("u_vvOpacities",c.vvOpacities)),b.vvRotation&&a.setUniform1f("u_vvRotationType","geographic"===c.vvMaterialParameters.vvRotationType?0:1),e.drawElements(4,k,5125,4*l),e.bindVAO(null)};k.prototype._getVAO=function(a,d,b,e){if(d.iconGeometry.vao)return d.iconGeometry.vao;var f=d.iconGeometry.vertexBufferMap[v.C_VBO_GEOMETRY],c=d.iconGeometry.indexBuffer;if(!f||!c)return null;d.iconGeometry.vao=b?new n(a,this._iconAttributeLocationsVV,this._iconVertexAttributesWithVV,
{geometry:f},c):e?new n(a,this._iconAttributeLocationsHeatmap,this._iconVertexAttributesWithHeatmap,{geometry:f},c):new n(a,this._iconAttributeLocations,this._iconVertexAttributes,{geometry:f},c);return d.iconGeometry.vao};k.prototype._getIntensityTexture=function(a,d){if(d.intensityKernel&&!d.refreshIntensityKernel)return d.intensityKernel;d.intensityKernel&&(d.intensityKernel.dispose(),d.intensityKernel=null);for(var b=d.radius,e=d.kernelSize,f=d.blurRadius,c=b*b,k=[],l=-1;++l<e;)k[l]=Math.exp(-Math.pow(l-
f,2)/(2*c))/(b/2*Math.sqrt(2*Math.PI));for(var b=[],g,h=0;h<e;h++)for(c=k[h],l=0;l<e;l++)g=h*e+l,f=k[l],b[4*g+0]=c*f,b[4*g+1]=0,b[4*g+2]=0,b[4*g+3]=1;e=new x(a,{target:3553,pixelFormat:6408,internalFormat:a.capabilities.colorBufferFloat.RGBA32F,dataType:5126,samplingMode:a.capabilities.textureFloatLinear?9729:9728,wrapMode:33071,width:e,height:e},new Float32Array(b));d.intensityKernel=e;d.refreshIntensityKernel=!1;return e};return k}(w.default);r.default=q});