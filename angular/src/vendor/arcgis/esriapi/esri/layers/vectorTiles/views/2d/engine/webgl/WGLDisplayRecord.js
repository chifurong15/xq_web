// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://js.arcgis.com/3.24/esri/copyright.txt for details.
//>>built
define("esri/layers/vectorTiles/views/2d/engine/webgl/WGLDisplayRecord",["require","exports","./enums","./MaterialInfo","./MeshData"],function(p,q,k,l,m){return function(){function c(){this.id=-1;this.geometryType=k.WGLGeometryType.UNKNOWN;this.materialInfo=this.meshData=null;this.indexCount=this.indexFrom=this.vertexCount=this.vertexFrom=this.zOrder=this.symbolLevel=0}Object.defineProperty(c.prototype,"sortKey",{get:function(){void 0===this._sortKey&&this._computeSortKey();return this._sortKey},
enumerable:!0,configurable:!0});c.prototype.setData=function(a,e,b,c,g,f){this.id=a;this.geometryType=e;this.meshData=b;this.materialInfo=c;this.symbolLevel=g;this.zOrder=f};c.prototype.readMeshDataFromBuffers=function(a,c){this.meshData?this.meshData.clear():this.meshData=new m;for(var b in a){for(var e=a[b].stride,g=a[b].data,f=[],d=0;d<e*this.vertexCount/4;++d)f[d]=g[d+e*this.vertexFrom/4];this.meshData.vertexData.set(b,f)}for(d=this.meshData.indexData.length=0;d<this.indexCount;++d)this.meshData.indexData[d]=
c[d+this.indexFrom]-this.vertexFrom;this.meshData.vertexCount=this.vertexCount};c.prototype.writeMeshDataToBuffers=function(a,c,b,n){for(var g in c)for(var f=c[g].stride,d=this.meshData.vertexData.get(g),e=c[g].data,h=0;h<f*this.meshData.vertexCount/4;++h)e[h+f*a/4]=d[h];for(h=0;h<this.meshData.indexData.length;++h)n[h+b]=this.meshData.indexData[h]+a;this.vertexFrom=a;this.vertexCount=this.meshData.vertexCount;this.indexFrom=b;this.indexCount=this.meshData.indexData.length};c.writeAllMeshDataToBuffers=
function(a,c,b){for(var e=0,g=0,f=0;f<a.length;f++){var d=a[f];d.writeMeshDataToBuffers(e,c,g,b);e+=d.vertexCount;g+=d.indexCount}};c.prototype._computeSortKey=function(){this._sortKey=(this.symbolLevel&31)<<12|(this.zOrder&127)<<4|this.geometryType&7};c.prototype.serialize=function(a){a.writeInt32(this.geometryType);this.materialInfo.serialize(a);a.writeInt32(this.symbolLevel);a.writeInt32(this.zOrder);a.writeInt32(this.vertexFrom);a.writeInt32(this.vertexCount);a.writeInt32(this.indexFrom);a.writeInt32(this.indexCount);
return a};c.deserialize=function(a,e){var b=new c;b.id=e.id;b.geometryType=a.readInt32();b.materialInfo=l.default.deserialize(a);b.symbolLevel=a.readInt32();b.zOrder=a.readInt32();b.vertexFrom=a.readInt32();b.vertexCount=a.readInt32();b.indexFrom=a.readInt32();b.indexCount=a.readInt32();b.meshData=null;return b};return c}()});