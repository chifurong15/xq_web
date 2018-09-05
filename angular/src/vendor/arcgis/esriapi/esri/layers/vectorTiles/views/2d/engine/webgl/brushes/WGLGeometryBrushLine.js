// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://js.arcgis.com/3.24/esri/copyright.txt for details.
//>>built
define("esri/layers/vectorTiles/views/2d/engine/webgl/brushes/WGLGeometryBrushLine","require exports ../../../../../core/tsSupport/extendsHelper ../enums ../Utils ./WGLGeometryBrush ../../../../webgl/VertexArrayObject".split(" "),function(p,m,t,u,v,w,r){Object.defineProperty(m,"__esModule",{value:!0});p=function(n){function k(){var b=null!==n&&n.apply(this,arguments)||this;b._lineAttributeLocations={a_pos:0,a_id:1,a_color:2,a_offsetAndNormal:3,a_accumulatedDistanceAndHalfWidth:4,a_tlbr:5,a_segmentDirection:6};
b._lineAttributeLocationsVV={a_pos:0,a_id:1,a_color:2,a_offsetAndNormal:3,a_accumulatedDistanceAndHalfWidth:4,a_tlbr:5,a_segmentDirection:6,a_vv:7};b._lineVertexAttributeLayout={geometry:[{name:"a_pos",count:2,type:5122,offset:0,stride:32,normalized:!1,divisor:0},{name:"a_id",count:4,type:5121,offset:4,stride:32,normalized:!0,divisor:0},{name:"a_color",count:4,type:5121,offset:8,stride:32,normalized:!0,divisor:0},{name:"a_offsetAndNormal",count:4,type:5120,offset:12,stride:32,normalized:!1,divisor:0},
{name:"a_accumulatedDistanceAndHalfWidth",count:2,type:5123,offset:16,stride:32,normalized:!1,divisor:0},{name:"a_tlbr",count:4,type:5123,offset:20,stride:32,normalized:!1,divisor:0},{name:"a_segmentDirection",count:4,type:5120,offset:28,stride:32,normalized:!1,divisor:0}]};b._lineVertexAttributeLayoutVV={geometry:[{name:"a_pos",count:2,type:5122,offset:0,stride:44,normalized:!1,divisor:0},{name:"a_id",count:4,type:5121,offset:4,stride:44,normalized:!0,divisor:0},{name:"a_color",count:4,type:5121,
offset:8,stride:44,normalized:!0,divisor:0},{name:"a_offsetAndNormal",count:4,type:5120,offset:12,stride:44,normalized:!1,divisor:0},{name:"a_accumulatedDistanceAndHalfWidth",count:2,type:5123,offset:16,stride:44,normalized:!1,divisor:0},{name:"a_tlbr",count:4,type:5123,offset:20,stride:44,normalized:!1,divisor:0},{name:"a_segmentDirection",count:4,type:5120,offset:28,stride:44,normalized:!1,divisor:0},{name:"a_vv",count:3,type:5126,offset:32,stride:44,normalized:!1,divisor:0}]};b._spritesTextureSize=
new Float32Array(2);return b}t(k,n);k.prototype.getGeometryType=function(){return u.WGLGeometryType.LINE};k.prototype.drawGeometry=function(b,e,c,d){d=b.context;var h=b.painter,f=b.rendererInfo,k=b.requiredLevel,n=c.indexFrom,p=c.indexCount,g=c.materialInfo;c=g.materialKeyInfo;var l=c.vvSizeMinMaxValue||c.vvSizeScaleStops||c.vvSizeFieldStops||c.vvSizeUnitValue||c.vvColor||c.vvOpacity,a=h.materialManager.getProgram(g.materialKey,b.drawPhase,l?this._lineAttributeLocationsVV:this._lineAttributeLocations);
if(a){d.bindProgram(a);l=this._getVAO(d,e,l);d.bindVAO(l);l=1/b.pixelRatio;if(0<g.texBindingInfo.length){var g=g.texBindingInfo[0],q=g.pageId,m=h.textureManager.sprites;this._spritesTextureSize[0]=m.getWidth(q);this._spritesTextureSize[1]=m.getHeight(q);h.textureManager.bindSpritePage(d,q,g.unit);a.setUniform1i(g.semantic,g.unit);a.setUniform2fv("u_mosaicSize",this._spritesTextureSize)}b=Math.pow(2,k-e.key.level)/b.pixelRatio;a.setUniform1f("u_zoomFactor",b);a.setUniformMatrix4fv("u_transformMatrix",
e.tileTransform.transform);a.setUniformMatrix4fv("u_extrudeMatrix",h.extrudeMatrix);a.setUniform2fv("u_normalized_origin",e.tileTransform.displayCoord);a.setUniform1f("u_opacity",1);a.setUniform1f("u_blur",0+l);a.setUniform1f("u_antialiasing",l);a.setUniform1f("u_zoomFactor",b);c.vvSizeMinMaxValue&&a.setUniform4fv("u_vvSizeMinMaxValue",f.vvSizeMinMaxValue);c.vvSizeScaleStops&&a.setUniform1f("u_vvSizeScaleStopsValue",f.vvSizeScaleStopsValue);c.vvSizeFieldStops&&(a.setUniform1fv("u_vvSizeFieldStopsValues",
f.vvSizeFieldStopsValues),a.setUniform1fv("u_vvSizeFieldStopsSizes",f.vvSizeFieldStopsSizes));c.vvSizeUnitValue&&a.setUniform1f("u_vvSizeUnitValueWorldToPixelsRatio",f.vvSizeUnitValueToPixelsRatio);c.vvColor&&(a.setUniform1fv("u_vvColorValues",f.vvColorValues),a.setUniform4fv("u_vvColors",f.vvColors));c.vvOpacity&&(a.setUniform1fv("u_vvOpacityValues",f.vvOpacityValues),a.setUniform1fv("u_vvOpacities",f.vvOpacities));d.setFaceCullingEnabled(!0);d.setFrontFace(2305);d.setCullFace(1029);d.drawElements(4,
p,5125,4*n);d.setFaceCullingEnabled(!1);d.bindVAO(null)}};k.prototype._getVAO=function(b,e,c){if(e.lineGeometry.vao)return e.lineGeometry.vao;var d=e.lineGeometry.vertexBufferMap[v.C_VBO_GEOMETRY],h=e.lineGeometry.indexBuffer;if(!d||!h)return null;e.lineGeometry.vao=c?new r(b,this._lineAttributeLocationsVV,this._lineVertexAttributeLayoutVV,{geometry:d},h):new r(b,this._lineAttributeLocations,this._lineVertexAttributeLayout,{geometry:d},h);return e.lineGeometry.vao};return k}(w.default);m.default=
p});