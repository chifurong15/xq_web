// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://js.arcgis.com/3.24/esri/copyright.txt for details.
//>>built
/*

 Copyright 2000, Silicon Graphics, Inc. All Rights Reserved.
 Copyright 2015, Google Inc. All Rights Reserved.

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to
 deal in the Software without restriction, including without limitation the
 rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 sell copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice including the dates of first publication and
 either this permission notice or a reference to http://oss.sgi.com/projects/FreeB/
 shall be included in all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 SILICON GRAPHICS, INC. BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR
 IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

 Original Code. The Original Code is: OpenGL Sample Implementation,
 Version 1.2.1, released January 26, 2000, developed by Silicon Graphics,
 Inc. The Original Code is Copyright (c) 1991-2000 Silicon Graphics, Inc.
 Copyright in any portions created by third parties is as indicated
 elsewhere herein. All Rights Reserved.
*/
define("esri/layers/vectorTiles/core/libs/libtess/libtess",[],function(){var a={DEBUG:!1,assert:function(b,c){if(a.DEBUG&&!b)throw Error("Assertion failed"+(c?": "+c:""));},GLU_TESS_MAX_COORD:1E150,TRUE_PROJECT:!1,GLU_TESS_DEFAULT_TOLERANCE:0,windingRule:{GLU_TESS_WINDING_ODD:100130,GLU_TESS_WINDING_NONZERO:100131,GLU_TESS_WINDING_POSITIVE:100132,GLU_TESS_WINDING_NEGATIVE:100133,GLU_TESS_WINDING_ABS_GEQ_TWO:100134},primitiveType:{GL_LINE_LOOP:2,GL_TRIANGLES:4,GL_TRIANGLE_STRIP:5,GL_TRIANGLE_FAN:6},
errorType:{GLU_TESS_MISSING_BEGIN_POLYGON:100151,GLU_TESS_MISSING_END_POLYGON:100153,GLU_TESS_MISSING_BEGIN_CONTOUR:100152,GLU_TESS_MISSING_END_CONTOUR:100154,GLU_TESS_COORD_TOO_LARGE:100155,GLU_TESS_NEED_COMBINE_CALLBACK:100156},gluEnum:{GLU_TESS_BEGIN:100100,GLU_TESS_VERTEX:100101,GLU_TESS_END:100102,GLU_TESS_ERROR:100103,GLU_TESS_EDGE_FLAG:100104,GLU_TESS_COMBINE:100105,GLU_TESS_BEGIN_DATA:100106,GLU_TESS_VERTEX_DATA:100107,GLU_TESS_END_DATA:100108,GLU_TESS_ERROR_DATA:100109,GLU_TESS_EDGE_FLAG_DATA:100110,
GLU_TESS_COMBINE_DATA:100111,GLU_TESS_MESH:100112,GLU_TESS_TOLERANCE:100142,GLU_TESS_WINDING_RULE:100140,GLU_TESS_BOUNDARY_ONLY:100141,GLU_INVALID_ENUM:100900,GLU_INVALID_VALUE:100901},geom:{}};a.geom.vertEq=function(b,a){return b.s===a.s&&b.t===a.t};a.geom.vertLeq=function(b,a){return b.s<a.s||b.s===a.s&&b.t<=a.t};a.geom.edgeEval=function(b,c,e){a.assert(a.geom.vertLeq(b,c)&&a.geom.vertLeq(c,e));var d=c.s-b.s,f=e.s-c.s;return 0<d+f?d<f?c.t-b.t+d/(d+f)*(b.t-e.t):c.t-e.t+f/(d+f)*(e.t-b.t):0};a.geom.edgeSign=
function(b,c,e){a.assert(a.geom.vertLeq(b,c)&&a.geom.vertLeq(c,e));var d=c.s-b.s,f=e.s-c.s;return 0<d+f?(c.t-e.t)*d+(c.t-b.t)*f:0};a.geom.transLeq=function(b,a){return b.t<a.t||b.t===a.t&&b.s<=a.s};a.geom.transEval=function(b,c,e){a.assert(a.geom.transLeq(b,c)&&a.geom.transLeq(c,e));var d=c.t-b.t,f=e.t-c.t;return 0<d+f?d<f?c.s-b.s+d/(d+f)*(b.s-e.s):c.s-e.s+f/(d+f)*(e.s-b.s):0};a.geom.transSign=function(b,c,e){a.assert(a.geom.transLeq(b,c)&&a.geom.transLeq(c,e));var d=c.t-b.t,f=e.t-c.t;return 0<d+
f?(c.s-e.s)*d+(c.s-b.s)*f:0};a.geom.edgeGoesLeft=function(b){return a.geom.vertLeq(b.dst(),b.org)};a.geom.edgeGoesRight=function(b){return a.geom.vertLeq(b.org,b.dst())};a.geom.vertL1dist=function(b,a){return Math.abs(b.s-a.s)+Math.abs(b.t-a.t)};a.geom.vertCCW=function(a,c,e){return 0<=a.s*(c.t-e.t)+c.s*(e.t-a.t)+e.s*(a.t-c.t)};a.geom.interpolate_=function(a,c,e,d){a=0>a?0:a;e=0>e?0:e;return a<=e?0===e?(c+d)/2:c+a/(a+e)*(d-c):d+e/(a+e)*(c-d)};a.geom.edgeIntersect=function(b,c,e,d,f){var g,h;a.geom.vertLeq(b,
c)||(g=b,b=c,c=g);a.geom.vertLeq(e,d)||(g=e,e=d,d=g);a.geom.vertLeq(b,e)||(g=b,b=e,e=g,g=c,c=d,d=g);a.geom.vertLeq(e,c)?a.geom.vertLeq(c,d)?(g=a.geom.edgeEval(b,e,c),h=a.geom.edgeEval(e,c,d),0>g+h&&(g=-g,h=-h),f.s=a.geom.interpolate_(g,e.s,h,c.s)):(g=a.geom.edgeSign(b,e,c),h=-a.geom.edgeSign(b,d,c),0>g+h&&(g=-g,h=-h),f.s=a.geom.interpolate_(g,e.s,h,d.s)):f.s=(e.s+c.s)/2;a.geom.transLeq(b,c)||(g=b,b=c,c=g);a.geom.transLeq(e,d)||(g=e,e=d,d=g);a.geom.transLeq(b,e)||(g=b,b=e,e=g,g=c,c=d,d=g);a.geom.transLeq(e,
c)?a.geom.transLeq(c,d)?(g=a.geom.transEval(b,e,c),h=a.geom.transEval(e,c,d),0>g+h&&(g=-g,h=-h),f.t=a.geom.interpolate_(g,e.t,h,c.t)):(g=a.geom.transSign(b,e,c),h=-a.geom.transSign(b,d,c),0>g+h&&(g=-g,h=-h),f.t=a.geom.interpolate_(g,e.t,h,d.t)):f.t=(e.t+c.t)/2};a.mesh={};a.mesh.makeEdge=function(b){var c=a.mesh.makeEdgePair_(b.eHead);a.mesh.makeVertex_(c,b.vHead);a.mesh.makeVertex_(c.sym,b.vHead);a.mesh.makeFace_(c,b.fHead);return c};a.mesh.meshSplice=function(b,c){var e=!1,d=!1;b!==c&&(c.org!==b.org&&
(d=!0,a.mesh.killVertex_(c.org,b.org)),c.lFace!==b.lFace&&(e=!0,a.mesh.killFace_(c.lFace,b.lFace)),a.mesh.splice_(c,b),d||(a.mesh.makeVertex_(c,b.org),b.org.anEdge=b),e||(a.mesh.makeFace_(c,b.lFace),b.lFace.anEdge=b))};a.mesh.deleteEdge=function(b){var c=b.sym,e=!1;b.lFace!==b.rFace()&&(e=!0,a.mesh.killFace_(b.lFace,b.rFace()));b.oNext===b?a.mesh.killVertex_(b.org,null):(b.rFace().anEdge=b.oPrev(),b.org.anEdge=b.oNext,a.mesh.splice_(b,b.oPrev()),e||a.mesh.makeFace_(b,b.lFace));c.oNext===c?(a.mesh.killVertex_(c.org,
null),a.mesh.killFace_(c.lFace,null)):(b.lFace.anEdge=c.oPrev(),c.org.anEdge=c.oNext,a.mesh.splice_(c,c.oPrev()));a.mesh.killEdge_(b)};a.mesh.addEdgeVertex=function(b){var c=a.mesh.makeEdgePair_(b),e=c.sym;a.mesh.splice_(c,b.lNext);c.org=b.dst();a.mesh.makeVertex_(e,c.org);c.lFace=e.lFace=b.lFace;return c};a.mesh.splitEdge=function(b){var c=a.mesh.addEdgeVertex(b).sym;a.mesh.splice_(b.sym,b.sym.oPrev());a.mesh.splice_(b.sym,c);b.sym.org=c.org;c.dst().anEdge=c.sym;c.sym.lFace=b.rFace();c.winding=b.winding;
c.sym.winding=b.sym.winding;return c};a.mesh.connect=function(b,c){var e=!1,d=a.mesh.makeEdgePair_(b),f=d.sym;c.lFace!==b.lFace&&(e=!0,a.mesh.killFace_(c.lFace,b.lFace));a.mesh.splice_(d,b.lNext);a.mesh.splice_(f,c);d.org=b.dst();f.org=c.org;d.lFace=f.lFace=b.lFace;b.lFace.anEdge=f;e||a.mesh.makeFace_(d,b.lFace);return d};a.mesh.zapFace=function(b){var c=b.anEdge,e=c.lNext,d;do if(d=e,e=d.lNext,d.lFace=null,null===d.rFace()){d.oNext===d?a.mesh.killVertex_(d.org,null):(d.org.anEdge=d.oNext,a.mesh.splice_(d,
d.oPrev()));var f=d.sym;f.oNext===f?a.mesh.killVertex_(f.org,null):(f.org.anEdge=f.oNext,a.mesh.splice_(f,f.oPrev()));a.mesh.killEdge_(d)}while(d!==c);c=b.prev;b=b.next;b.prev=c;c.next=b};a.mesh.meshUnion=function(a,c){var b=a.fHead,d=a.vHead,f=a.eHead,g=c.fHead,h=c.vHead,k=c.eHead;g.next!==g&&(b.prev.next=g.next,g.next.prev=b.prev,g.prev.next=b,b.prev=g.prev);h.next!==h&&(d.prev.next=h.next,h.next.prev=d.prev,h.prev.next=d,d.prev=h.prev);k.next!==k&&(f.sym.next.sym.next=k.next,k.next.sym.next=f.sym.next,
k.sym.next.sym.next=f,f.sym.next=k.sym.next);return a};a.mesh.deleteMesh=function(a){};a.mesh.makeEdgePair_=function(b){var c=new a.GluHalfEdge,e=new a.GluHalfEdge,d=b.sym.next;e.next=d;d.sym.next=c;c.next=b;b.sym.next=e;c.sym=e;c.oNext=c;c.lNext=e;e.sym=c;e.oNext=e;return e.lNext=c};a.mesh.splice_=function(a,c){var b=a.oNext,d=c.oNext;b.sym.lNext=c;d.sym.lNext=a;a.oNext=d;c.oNext=b};a.mesh.makeVertex_=function(b,c){var e=c.prev,d=new a.GluVertex(c,e);e.next=d;c.prev=d;e=d.anEdge=b;do e.org=d,e=e.oNext;
while(e!==b)};a.mesh.makeFace_=function(b,c){var e=c.prev,d=new a.GluFace(c,e);e.next=d;c.prev=d;d.anEdge=b;d.inside=c.inside;e=b;do e.lFace=d,e=e.lNext;while(e!==b)};a.mesh.killEdge_=function(a){var b=a.next;a=a.sym.next;b.sym.next=a;a.sym.next=b};a.mesh.killVertex_=function(a,c){var b=a.anEdge,d=b;do d.org=c,d=d.oNext;while(d!==b);b=a.prev;d=a.next;d.prev=b;b.next=d};a.mesh.killFace_=function(a,c){var b=a.anEdge,d=b;do d.lFace=c,d=d.lNext;while(d!==b);b=a.prev;d=a.next;d.prev=b;b.next=d};a.normal=
{};a.normal.S_UNIT_X_=1;a.normal.S_UNIT_Y_=0;a.normal.projectPolygon=function(b,c,e,d){var f=!1,g=[c,e,d];0===c&&0===e&&0===d&&(a.normal.computeNormal_(b,g),f=!0);e=a.normal.longAxis_(g);c=b.mesh.vHead;if(a.TRUE_PROJECT){a.normal.normalize_(g);d=[0,0,0];var h=[0,0,0];d[e]=0;d[(e+1)%3]=a.normal.S_UNIT_X_;d[(e+2)%3]=a.normal.S_UNIT_Y_;e=a.normal.dot_(d,g);d[0]-=e*g[0];d[1]-=e*g[1];d[2]-=e*g[2];a.normal.normalize_(d);h[0]=g[1]*d[2]-g[2]*d[1];h[1]=g[2]*d[0]-g[0]*d[2];h[2]=g[0]*d[1]-g[1]*d[0];a.normal.normalize_(h);
for(g=c.next;g!==c;g=g.next)g.s=a.normal.dot_(g.coords,d),g.t=a.normal.dot_(g.coords,h)}else for(d=(e+1)%3,h=(e+2)%3,e=0<g[e]?1:-1,g=c.next;g!==c;g=g.next)g.s=g.coords[d],g.t=e*g.coords[h];f&&a.normal.checkOrientation_(b)};a.normal.dot_=function(a,c){return a[0]*c[0]+a[1]*c[1]+a[2]*c[2]};a.normal.normalize_=function(b){var c=b[0]*b[0]+b[1]*b[1]+b[2]*b[2];a.assert(0<c);c=Math.sqrt(c);b[0]/=c;b[1]/=c;b[2]/=c};a.normal.longAxis_=function(a){var b=0;Math.abs(a[1])>Math.abs(a[0])&&(b=1);Math.abs(a[2])>
Math.abs(a[b])&&(b=2);return b};a.normal.computeNormal_=function(b,c){var e=[-2*a.GLU_TESS_MAX_COORD,-2*a.GLU_TESS_MAX_COORD,-2*a.GLU_TESS_MAX_COORD],d=[2*a.GLU_TESS_MAX_COORD,2*a.GLU_TESS_MAX_COORD,2*a.GLU_TESS_MAX_COORD],f=[],g=[],h,k=b.mesh.vHead;for(h=k.next;h!==k;h=h.next)for(var l=0;3>l;++l){var m=h.coords[l];m<d[l]&&(d[l]=m,g[l]=h);m>e[l]&&(e[l]=m,f[l]=h)}h=0;e[1]-d[1]>e[0]-d[0]&&(h=1);e[2]-d[2]>e[h]-d[h]&&(h=2);if(d[h]>=e[h])c[0]=0,c[1]=0,c[2]=1;else{e=0;d=g[h];f=f[h];g=[0,0,0];d=[d.coords[0]-
f.coords[0],d.coords[1]-f.coords[1],d.coords[2]-f.coords[2]];l=[0,0,0];for(h=k.next;h!==k;h=h.next)l[0]=h.coords[0]-f.coords[0],l[1]=h.coords[1]-f.coords[1],l[2]=h.coords[2]-f.coords[2],g[0]=d[1]*l[2]-d[2]*l[1],g[1]=d[2]*l[0]-d[0]*l[2],g[2]=d[0]*l[1]-d[1]*l[0],m=g[0]*g[0]+g[1]*g[1]+g[2]*g[2],m>e&&(e=m,c[0]=g[0],c[1]=g[1],c[2]=g[2]);0>=e&&(c[0]=c[1]=c[2]=0,c[a.normal.longAxis_(d)]=1)}};a.normal.checkOrientation_=function(a){for(var b=0,e=a.mesh.fHead,d=e.next;d!==e;d=d.next){var f=d.anEdge;if(!(0>=
f.winding)){do b+=(f.org.s-f.dst().s)*(f.org.t+f.dst().t),f=f.lNext;while(f!==d.anEdge)}}if(0>b)for(a=a.mesh.vHead,b=a.next;b!==a;b=b.next)b.t=-b.t};a.render={};a.render.renderMesh=function(b,c,e){for(var d=!1,f=-1,g=c.fHead.prev;g!==c.fHead;g=g.prev)if(g.inside){d||(b.callBeginCallback(a.primitiveType.GL_TRIANGLES),d=!0);var h=g.anEdge;a.assert(h.lNext.lNext.lNext===h,"renderMesh called with non-triangulated mesh");do{if(e){var k=h.rFace().inside?0:1;f!==k&&(f=k,b.callEdgeFlagCallback(!!f))}b.callVertexCallback(h.org.data);
h=h.lNext}while(h!==g.anEdge)}d&&b.callEndCallback()};a.render.renderBoundary=function(b,c){for(var e=c.fHead.next;e!==c.fHead;e=e.next)if(e.inside){b.callBeginCallback(a.primitiveType.GL_LINE_LOOP);var d=e.anEdge;do b.callVertexCallback(d.org.data),d=d.lNext;while(d!==e.anEdge);b.callEndCallback()}};a.sweep={};a.sweep.SENTINEL_COORD_=4*a.GLU_TESS_MAX_COORD;a.sweep.TOLERANCE_NONZERO_=!1;a.sweep.computeInterior=function(b){b.fatalError=!1;a.sweep.removeDegenerateEdges_(b);a.sweep.initPriorityQ_(b);
a.sweep.initEdgeDict_(b);for(var c;null!==(c=b.pq.extractMin());){for(;;){var e=b.pq.minimum();if(null===e||!a.geom.vertEq(e,c))break;e=b.pq.extractMin();a.sweep.spliceMergeVertices_(b,c.anEdge,e.anEdge)}a.sweep.sweepEvent_(b,c)}c=b.dict.getMin().getKey();b.event=c.eUp.org;a.sweep.doneEdgeDict_(b);a.sweep.donePriorityQ_(b);a.sweep.removeDegenerateFaces_(b.mesh);b.mesh.checkMesh()};a.sweep.addWinding_=function(a,c){a.winding+=c.winding;a.sym.winding+=c.sym.winding};a.sweep.edgeLeq_=function(b,c,e){b=
b.event;c=c.eUp;e=e.eUp;if(c.dst()===b)return e.dst()===b?a.geom.vertLeq(c.org,e.org)?0>=a.geom.edgeSign(e.dst(),c.org,e.org):0<=a.geom.edgeSign(c.dst(),e.org,c.org):0>=a.geom.edgeSign(e.dst(),b,e.org);if(e.dst()===b)return 0<=a.geom.edgeSign(c.dst(),b,c.org);c=a.geom.edgeEval(c.dst(),b,c.org);b=a.geom.edgeEval(e.dst(),b,e.org);return c>=b};a.sweep.deleteRegion_=function(b,c){c.fixUpperEdge&&a.assert(0===c.eUp.winding);c.eUp.activeRegion=null;b.dict.deleteNode(c.nodeUp);c.nodeUp=null};a.sweep.fixUpperEdge_=
function(b,c){a.assert(b.fixUpperEdge);a.mesh.deleteEdge(b.eUp);b.fixUpperEdge=!1;b.eUp=c;c.activeRegion=b};a.sweep.topLeftRegion_=function(b){var c=b.eUp.org;do b=b.regionAbove();while(b.eUp.org===c);b.fixUpperEdge&&(c=a.mesh.connect(b.regionBelow().eUp.sym,b.eUp.lNext),a.sweep.fixUpperEdge_(b,c),b=b.regionAbove());return b};a.sweep.topRightRegion_=function(a){var b=a.eUp.dst();do a=a.regionAbove();while(a.eUp.dst()===b);return a};a.sweep.addRegionBelow_=function(b,c,e){var d=new a.ActiveRegion;
d.eUp=e;d.nodeUp=b.dict.insertBefore(c.nodeUp,d);return e.activeRegion=d};a.sweep.isWindingInside_=function(b,c){switch(b.windingRule){case a.windingRule.GLU_TESS_WINDING_ODD:return 0!==(c&1);case a.windingRule.GLU_TESS_WINDING_NONZERO:return 0!==c;case a.windingRule.GLU_TESS_WINDING_POSITIVE:return 0<c;case a.windingRule.GLU_TESS_WINDING_NEGATIVE:return 0>c;case a.windingRule.GLU_TESS_WINDING_ABS_GEQ_TWO:return 2<=c||-2>=c}a.assert(!1);return!1};a.sweep.computeWinding_=function(b,c){c.windingNumber=
c.regionAbove().windingNumber+c.eUp.winding;c.inside=a.sweep.isWindingInside_(b,c.windingNumber)};a.sweep.finishRegion_=function(b,c){var e=c.eUp,d=e.lFace;d.inside=c.inside;d.anEdge=e;a.sweep.deleteRegion_(b,c)};a.sweep.finishLeftRegions_=function(b,c,e){var d=c;for(c=c.eUp;d!==e;){d.fixUpperEdge=!1;var f=d.regionBelow(),g=f.eUp;if(g.org!==c.org){if(!f.fixUpperEdge){a.sweep.finishRegion_(b,d);break}g=a.mesh.connect(c.lPrev(),g.sym);a.sweep.fixUpperEdge_(f,g)}c.oNext!==g&&(a.mesh.meshSplice(g.oPrev(),
g),a.mesh.meshSplice(c,g));a.sweep.finishRegion_(b,d);c=f.eUp;d=f}return c};a.sweep.addRightEdges_=function(b,c,e,d,f,g){var h=!0;do a.assert(a.geom.vertLeq(e.org,e.dst())),a.sweep.addRegionBelow_(b,c,e.sym),e=e.oNext;while(e!==d);for(null===f&&(f=c.regionBelow().eUp.rPrev());;){d=c.regionBelow();e=d.eUp.sym;if(e.org!==f.org)break;e.oNext!==f&&(a.mesh.meshSplice(e.oPrev(),e),a.mesh.meshSplice(f.oPrev(),e));d.windingNumber=c.windingNumber-e.winding;d.inside=a.sweep.isWindingInside_(b,d.windingNumber);
c.dirty=!0;!h&&a.sweep.checkForRightSplice_(b,c)&&(a.sweep.addWinding_(e,f),a.sweep.deleteRegion_(b,c),a.mesh.deleteEdge(f));h=!1;c=d;f=e}c.dirty=!0;a.assert(c.windingNumber-e.winding===d.windingNumber);g&&a.sweep.walkDirtyRegions_(b,c)};a.sweep.callCombine_=function(b,c,e,d,f){var g=[c.coords[0],c.coords[1],c.coords[2]];c.data=null;c.data=b.callCombineCallback(g,e,d);null===c.data&&(f?b.fatalError||(b.callErrorCallback(a.errorType.GLU_TESS_NEED_COMBINE_CALLBACK),b.fatalError=!0):c.data=e[0])};a.sweep.spliceMergeVertices_=
function(b,c,e){var d=[null,null,null,null];d[0]=c.org.data;d[1]=e.org.data;a.sweep.callCombine_(b,c.org,d,[.5,.5,0,0],!1);a.mesh.meshSplice(c,e)};a.sweep.vertexWeights_=function(b,c,e,d,f){var g=a.geom.vertL1dist(c,b),h=a.geom.vertL1dist(e,b),k=f+1;d[f]=.5*h/(g+h);d[k]=.5*g/(g+h);b.coords[0]+=d[f]*c.coords[0]+d[k]*e.coords[0];b.coords[1]+=d[f]*c.coords[1]+d[k]*e.coords[1];b.coords[2]+=d[f]*c.coords[2]+d[k]*e.coords[2]};a.sweep.getIntersectData_=function(b,c,e,d,f,g){var h=[0,0,0,0],k=[e.data,d.data,
f.data,g.data];c.coords[0]=c.coords[1]=c.coords[2]=0;a.sweep.vertexWeights_(c,e,d,h,0);a.sweep.vertexWeights_(c,f,g,h,2);a.sweep.callCombine_(b,c,k,h,!0)};a.sweep.checkForRightSplice_=function(b,c){var e=c.regionBelow(),d=c.eUp,f=e.eUp;if(a.geom.vertLeq(d.org,f.org)){if(0<a.geom.edgeSign(f.dst(),d.org,f.org))return!1;a.geom.vertEq(d.org,f.org)?d.org!==f.org&&(b.pq.remove(d.org.pqHandle),a.sweep.spliceMergeVertices_(b,f.oPrev(),d)):(a.mesh.splitEdge(f.sym),a.mesh.meshSplice(d,f.oPrev()),c.dirty=e.dirty=
!0)}else{if(0>a.geom.edgeSign(d.dst(),f.org,d.org))return!1;c.regionAbove().dirty=c.dirty=!0;a.mesh.splitEdge(d.sym);a.mesh.meshSplice(f.oPrev(),d)}return!0};a.sweep.checkForLeftSplice_=function(b,c){var e=c.regionBelow(),d=c.eUp,f=e.eUp;a.assert(!a.geom.vertEq(d.dst(),f.dst()));if(a.geom.vertLeq(d.dst(),f.dst())){if(0>a.geom.edgeSign(d.dst(),f.dst(),d.org))return!1;c.regionAbove().dirty=c.dirty=!0;e=a.mesh.splitEdge(d);a.mesh.meshSplice(f.sym,e);e.lFace.inside=c.inside}else{if(0<a.geom.edgeSign(f.dst(),
d.dst(),f.org))return!1;c.dirty=e.dirty=!0;e=a.mesh.splitEdge(f);a.mesh.meshSplice(d.lNext,f.sym);e.rFace().inside=c.inside}return!0};a.sweep.checkForIntersect_=function(b,c){var e=c.regionBelow(),d=c.eUp,f=e.eUp,g=d.org,h=f.org,k=d.dst(),l=f.dst(),m=new a.GluVertex;a.assert(!a.geom.vertEq(l,k));a.assert(0>=a.geom.edgeSign(k,b.event,g));a.assert(0<=a.geom.edgeSign(l,b.event,h));a.assert(g!==b.event&&h!==b.event);a.assert(!c.fixUpperEdge&&!e.fixUpperEdge);if(g===h||Math.min(g.t,k.t)>Math.max(h.t,l.t))return!1;
if(a.geom.vertLeq(g,h)){if(0<a.geom.edgeSign(l,g,h))return!1}else if(0>a.geom.edgeSign(k,h,g))return!1;a.geom.edgeIntersect(k,g,l,h,m);a.assert(Math.min(g.t,k.t)<=m.t);a.assert(m.t<=Math.max(h.t,l.t));a.assert(Math.min(l.s,k.s)<=m.s);a.assert(m.s<=Math.max(h.s,g.s));a.geom.vertLeq(m,b.event)&&(m.s=b.event.s,m.t=b.event.t);var n=a.geom.vertLeq(g,h)?g:h;a.geom.vertLeq(n,m)&&(m.s=n.s,m.t=n.t);if(a.geom.vertEq(m,g)||a.geom.vertEq(m,h))return a.sweep.checkForRightSplice_(b,c),!1;if(!a.geom.vertEq(k,b.event)&&
0<=a.geom.edgeSign(k,b.event,m)||!a.geom.vertEq(l,b.event)&&0>=a.geom.edgeSign(l,b.event,m)){if(l===b.event)return a.mesh.splitEdge(d.sym),a.mesh.meshSplice(f.sym,d),c=a.sweep.topLeftRegion_(c),d=c.regionBelow().eUp,a.sweep.finishLeftRegions_(b,c.regionBelow(),e),a.sweep.addRightEdges_(b,c,d.oPrev(),d,d,!0),!0;if(k===b.event)return a.mesh.splitEdge(f.sym),a.mesh.meshSplice(d.lNext,f.oPrev()),e=c,c=a.sweep.topRightRegion_(c),g=c.regionBelow().eUp.rPrev(),e.eUp=f.oPrev(),f=a.sweep.finishLeftRegions_(b,
e,null),a.sweep.addRightEdges_(b,c,f.oNext,d.rPrev(),g,!0),!0;0<=a.geom.edgeSign(k,b.event,m)&&(c.regionAbove().dirty=c.dirty=!0,a.mesh.splitEdge(d.sym),d.org.s=b.event.s,d.org.t=b.event.t);0>=a.geom.edgeSign(l,b.event,m)&&(c.dirty=e.dirty=!0,a.mesh.splitEdge(f.sym),f.org.s=b.event.s,f.org.t=b.event.t);return!1}a.mesh.splitEdge(d.sym);a.mesh.splitEdge(f.sym);a.mesh.meshSplice(f.oPrev(),d);d.org.s=m.s;d.org.t=m.t;d.org.pqHandle=b.pq.insert(d.org);a.sweep.getIntersectData_(b,d.org,g,k,h,l);c.regionAbove().dirty=
c.dirty=e.dirty=!0;return!1};a.sweep.walkDirtyRegions_=function(b,c){for(var e=c.regionBelow();;){for(;e.dirty;)c=e,e=e.regionBelow();if(!c.dirty&&(e=c,c=c.regionAbove(),null===c||!c.dirty))break;c.dirty=!1;var d=c.eUp,f=e.eUp;d.dst()!==f.dst()&&a.sweep.checkForLeftSplice_(b,c)&&(e.fixUpperEdge?(a.sweep.deleteRegion_(b,e),a.mesh.deleteEdge(f),e=c.regionBelow(),f=e.eUp):c.fixUpperEdge&&(a.sweep.deleteRegion_(b,c),a.mesh.deleteEdge(d),c=e.regionAbove(),d=c.eUp));if(d.org!==f.org)if(d.dst()===f.dst()||
c.fixUpperEdge||e.fixUpperEdge||d.dst()!==b.event&&f.dst()!==b.event)a.sweep.checkForRightSplice_(b,c);else if(a.sweep.checkForIntersect_(b,c))break;d.org===f.org&&d.dst()===f.dst()&&(a.sweep.addWinding_(f,d),a.sweep.deleteRegion_(b,c),a.mesh.deleteEdge(d),c=e.regionAbove())}};a.sweep.connectRightVertex_=function(b,c,e){var d=e.oNext,f=c.regionBelow(),g=c.eUp,h=f.eUp,k=!1;g.dst()!==h.dst()&&a.sweep.checkForIntersect_(b,c);a.geom.vertEq(g.org,b.event)&&(a.mesh.meshSplice(d.oPrev(),g),c=a.sweep.topLeftRegion_(c),
d=c.regionBelow().eUp,a.sweep.finishLeftRegions_(b,c.regionBelow(),f),k=!0);a.geom.vertEq(h.org,b.event)&&(a.mesh.meshSplice(e,h.oPrev()),e=a.sweep.finishLeftRegions_(b,f,null),k=!0);k?a.sweep.addRightEdges_(b,c,e.oNext,d,d,!0):(d=a.geom.vertLeq(h.org,g.org)?h.oPrev():g,d=a.mesh.connect(e.lPrev(),d),a.sweep.addRightEdges_(b,c,d,d.oNext,d.oNext,!1),d.sym.activeRegion.fixUpperEdge=!0,a.sweep.walkDirtyRegions_(b,c))};a.sweep.connectLeftDegenerate_=function(b,c,e){var d=c.eUp;if(a.geom.vertEq(d.org,e))a.assert(a.sweep.TOLERANCE_NONZERO_),
a.sweep.TOLERANCE_NONZERO_&&a.sweep.spliceMergeVertices_(b,d,e.anEdge);else if(a.geom.vertEq(d.dst(),e)){if(a.assert(a.sweep.TOLERANCE_NONZERO_),a.sweep.TOLERANCE_NONZERO_){c=a.sweep.topRightRegion_(c);var d=c.regionBelow(),f=d.eUp.sym,g=f.oNext,h=g;d.fixUpperEdge&&(a.assert(g!==f),a.sweep.deleteRegion_(b,d),a.mesh.deleteEdge(f),f=g.oPrev());a.mesh.meshSplice(e.anEdge,f);a.geom.edgeGoesLeft(g)||(g=null);a.sweep.addRightEdges_(b,c,f.oNext,h,g,!0)}}else a.mesh.splitEdge(d.sym),c.fixUpperEdge&&(a.mesh.deleteEdge(d.oNext),
c.fixUpperEdge=!1),a.mesh.meshSplice(e.anEdge,d),a.sweep.sweepEvent_(b,e)};a.sweep.connectLeftVertex_=function(b,c){var e=new a.ActiveRegion;e.eUp=c.anEdge.sym;var e=b.dict.search(e).getKey(),d=e.regionBelow(),f=e.eUp,g=d.eUp;0===a.geom.edgeSign(f.dst(),c,f.org)?a.sweep.connectLeftDegenerate_(b,e,c):(d=a.geom.vertLeq(g.dst(),f.dst())?e:d,e.inside||d.fixUpperEdge?(f=d===e?a.mesh.connect(c.anEdge.sym,f.lNext):a.mesh.connect(g.dNext(),c.anEdge).sym,d.fixUpperEdge?a.sweep.fixUpperEdge_(d,f):a.sweep.computeWinding_(b,
a.sweep.addRegionBelow_(b,e,f)),a.sweep.sweepEvent_(b,c)):a.sweep.addRightEdges_(b,e,c.anEdge,c.anEdge,null,!0))};a.sweep.sweepEvent_=function(b,c){b.event=c;for(var e=c.anEdge;null===e.activeRegion;)if(e=e.oNext,e===c.anEdge){a.sweep.connectLeftVertex_(b,c);return}var e=a.sweep.topLeftRegion_(e.activeRegion),d=e.regionBelow(),f=d.eUp,d=a.sweep.finishLeftRegions_(b,d,null);d.oNext===f?a.sweep.connectRightVertex_(b,e,d):a.sweep.addRightEdges_(b,e,d.oNext,f,f,!0)};a.sweep.addSentinel_=function(b,c){var e=
new a.ActiveRegion,d=a.mesh.makeEdge(b.mesh);d.org.s=a.sweep.SENTINEL_COORD_;d.org.t=c;d.dst().s=-a.sweep.SENTINEL_COORD_;d.dst().t=c;b.event=d.dst();e.eUp=d;e.windingNumber=0;e.inside=!1;e.fixUpperEdge=!1;e.sentinel=!0;e.dirty=!1;e.nodeUp=b.dict.insert(e)};a.sweep.initEdgeDict_=function(b){b.dict=new a.Dict(b,a.sweep.edgeLeq_);a.sweep.addSentinel_(b,-a.sweep.SENTINEL_COORD_);a.sweep.addSentinel_(b,a.sweep.SENTINEL_COORD_)};a.sweep.doneEdgeDict_=function(b){for(var c=0,e;null!==(e=b.dict.getMin().getKey());)e.sentinel||
(a.assert(e.fixUpperEdge),a.assert(1===++c)),a.assert(0===e.windingNumber),a.sweep.deleteRegion_(b,e);b.dict=null};a.sweep.removeDegenerateEdges_=function(b){for(var c=b.mesh.eHead,e,d=c.next;d!==c;d=e){e=d.next;var f=d.lNext;a.geom.vertEq(d.org,d.dst())&&d.lNext.lNext!==d&&(a.sweep.spliceMergeVertices_(b,f,d),a.mesh.deleteEdge(d),d=f,f=d.lNext);if(f.lNext===d){if(f!==d){if(f===e||f===e.sym)e=e.next;a.mesh.deleteEdge(f)}if(d===e||d===e.sym)e=e.next;a.mesh.deleteEdge(d)}}};a.sweep.initPriorityQ_=function(b){var c=
new a.PriorityQ;b.pq=c;b=b.mesh.vHead;var e;for(e=b.next;e!==b;e=e.next)e.pqHandle=c.insert(e);c.init()};a.sweep.donePriorityQ_=function(a){a.pq.deleteQ();a.pq=null};a.sweep.removeDegenerateFaces_=function(b){for(var c,e=b.fHead.next;e!==b.fHead;e=c)c=e.next,e=e.anEdge,a.assert(e.lNext!==e),e.lNext.lNext===e&&(a.sweep.addWinding_(e.oNext,e),a.mesh.deleteEdge(e))};a.tessmono={};a.tessmono.tessellateMonoRegion_=function(b){b=b.anEdge;for(a.assert(b.lNext!==b&&b.lNext.lNext!==b);a.geom.vertLeq(b.dst(),
b.org);b=b.lPrev());for(;a.geom.vertLeq(b.org,b.dst());b=b.lNext);for(var c=b.lPrev(),e;b.lNext!==c;)if(a.geom.vertLeq(b.dst(),c.org)){for(;c.lNext!==b&&(a.geom.edgeGoesLeft(c.lNext)||0>=a.geom.edgeSign(c.org,c.dst(),c.lNext.dst()));)e=a.mesh.connect(c.lNext,c),c=e.sym;c=c.lPrev()}else{for(;c.lNext!==b&&(a.geom.edgeGoesRight(b.lPrev())||0<=a.geom.edgeSign(b.dst(),b.org,b.lPrev().org));)e=a.mesh.connect(b,b.lPrev()),b=e.sym;b=b.lNext}for(a.assert(c.lNext!==b);c.lNext.lNext!==b;)e=a.mesh.connect(c.lNext,
c),c=e.sym};a.tessmono.tessellateInterior=function(b){for(var c,e=b.fHead.next;e!==b.fHead;e=c)c=e.next,e.inside&&a.tessmono.tessellateMonoRegion_(e)};a.tessmono.discardExterior=function(b){for(var c,e=b.fHead.next;e!==b.fHead;e=c)c=e.next,e.inside||a.mesh.zapFace(e)};a.tessmono.setWindingNumber=function(b,c,e){for(var d,f=b.eHead.next;f!==b.eHead;f=d)d=f.next,f.rFace().inside!==f.lFace.inside?f.winding=f.lFace.inside?c:-c:e?a.mesh.deleteEdge(f):f.winding=0};a.Dict=function(b,c){this.head_=new a.DictNode;
this.frame_=b;this.leq_=c};a.Dict.prototype.deleteDict_=function(){};a.Dict.prototype.insertBefore=function(b,c){do b=b.prev;while(null!==b.key&&!this.leq_(this.frame_,b.key,c));var e=new a.DictNode(c,b.next,b);b.next.prev=e;return b.next=e};a.Dict.prototype.insert=function(a){return this.insertBefore(this.head_,a)};a.Dict.prototype.deleteNode=function(a){a.next.prev=a.prev;a.prev.next=a.next};a.Dict.prototype.search=function(a){var b=this.head_;do b=b.next;while(null!==b.key&&!this.leq_(this.frame_,
a,b.key));return b};a.Dict.prototype.getMin=function(){return this.head_.next};a.Dict.prototype.getMax=function(){return this.head_.prev};a.DictNode=function(a,c,e){this.key=a||null;this.next=c||this;this.prev=e||this};a.DictNode.prototype.getKey=function(){return this.key};a.DictNode.prototype.getSuccessor=function(){return this.next};a.DictNode.prototype.getPredecessor=function(){return this.prev};a.GluTesselator=function(){this.state_=a.GluTesselator.tessState_.T_DORMANT;this.errorCallback_=this.mesh=
this.lastEdge_=null;this.normal_=[0,0,0];this.windingRule=a.windingRule.GLU_TESS_WINDING_ODD;this.fatalError=!1;this.combineCallback_=this.event=this.pq=this.dict=null;this.boundaryOnly_=!1;this.polygonData_=this.meshCallback_=this.endCallback_=this.vertexCallback_=this.edgeFlagCallback_=this.beginCallback_=null};a.GluTesselator.tessState_={T_DORMANT:0,T_IN_POLYGON:1,T_IN_CONTOUR:2};a.GluTesselator.prototype.gluDeleteTess=function(){this.requireState_(a.GluTesselator.tessState_.T_DORMANT)};a.GluTesselator.prototype.gluTessProperty=
function(b,c){switch(b){case a.gluEnum.GLU_TESS_TOLERANCE:return;case a.gluEnum.GLU_TESS_WINDING_RULE:switch(c){case a.windingRule.GLU_TESS_WINDING_ODD:case a.windingRule.GLU_TESS_WINDING_NONZERO:case a.windingRule.GLU_TESS_WINDING_POSITIVE:case a.windingRule.GLU_TESS_WINDING_NEGATIVE:case a.windingRule.GLU_TESS_WINDING_ABS_GEQ_TWO:this.windingRule=c;return}break;case a.gluEnum.GLU_TESS_BOUNDARY_ONLY:this.boundaryOnly_=!!c;return;default:this.callErrorCallback(a.gluEnum.GLU_INVALID_ENUM);return}this.callErrorCallback(a.gluEnum.GLU_INVALID_VALUE)};
a.GluTesselator.prototype.gluGetTessProperty=function(b){switch(b){case a.gluEnum.GLU_TESS_TOLERANCE:return 0;case a.gluEnum.GLU_TESS_WINDING_RULE:return b=this.windingRule,a.assert(b===a.windingRule.GLU_TESS_WINDING_ODD||b===a.windingRule.GLU_TESS_WINDING_NONZERO||b===a.windingRule.GLU_TESS_WINDING_POSITIVE||b===a.windingRule.GLU_TESS_WINDING_NEGATIVE||b===a.windingRule.GLU_TESS_WINDING_ABS_GEQ_TWO),b;case a.gluEnum.GLU_TESS_BOUNDARY_ONLY:return a.assert(!0===this.boundaryOnly_||!1===this.boundaryOnly_),
this.boundaryOnly_;default:this.callErrorCallback(a.gluEnum.GLU_INVALID_ENUM)}return!1};a.GluTesselator.prototype.gluTessNormal=function(a,c,e){this.normal_[0]=a;this.normal_[1]=c;this.normal_[2]=e};a.GluTesselator.prototype.gluTessCallback=function(b,c){var e=c?c:null;switch(b){case a.gluEnum.GLU_TESS_BEGIN:case a.gluEnum.GLU_TESS_BEGIN_DATA:this.beginCallback_=e;break;case a.gluEnum.GLU_TESS_EDGE_FLAG:case a.gluEnum.GLU_TESS_EDGE_FLAG_DATA:this.edgeFlagCallback_=e;break;case a.gluEnum.GLU_TESS_VERTEX:case a.gluEnum.GLU_TESS_VERTEX_DATA:this.vertexCallback_=
e;break;case a.gluEnum.GLU_TESS_END:case a.gluEnum.GLU_TESS_END_DATA:this.endCallback_=e;break;case a.gluEnum.GLU_TESS_ERROR:case a.gluEnum.GLU_TESS_ERROR_DATA:this.errorCallback_=e;break;case a.gluEnum.GLU_TESS_COMBINE:case a.gluEnum.GLU_TESS_COMBINE_DATA:this.combineCallback_=e;break;case a.gluEnum.GLU_TESS_MESH:this.meshCallback_=e;break;default:this.callErrorCallback(a.gluEnum.GLU_INVALID_ENUM)}};a.GluTesselator.prototype.gluTessVertex=function(b,c){var e=!1,d=[0,0,0];this.requireState_(a.GluTesselator.tessState_.T_IN_CONTOUR);
for(var f=0;3>f;++f){var g=b[f];g<-a.GLU_TESS_MAX_COORD&&(g=-a.GLU_TESS_MAX_COORD,e=!0);g>a.GLU_TESS_MAX_COORD&&(g=a.GLU_TESS_MAX_COORD,e=!0);d[f]=g}e&&this.callErrorCallback(a.errorType.GLU_TESS_COORD_TOO_LARGE);this.addVertex_(d,c)};a.GluTesselator.prototype.gluTessBeginPolygon=function(b){this.requireState_(a.GluTesselator.tessState_.T_DORMANT);this.state_=a.GluTesselator.tessState_.T_IN_POLYGON;this.mesh=new a.GluMesh;this.polygonData_=b};a.GluTesselator.prototype.gluTessBeginContour=function(){this.requireState_(a.GluTesselator.tessState_.T_IN_POLYGON);
this.state_=a.GluTesselator.tessState_.T_IN_CONTOUR;this.lastEdge_=null};a.GluTesselator.prototype.gluTessEndContour=function(){this.requireState_(a.GluTesselator.tessState_.T_IN_CONTOUR);this.state_=a.GluTesselator.tessState_.T_IN_POLYGON};a.GluTesselator.prototype.gluTessEndPolygon=function(){this.requireState_(a.GluTesselator.tessState_.T_IN_POLYGON);this.state_=a.GluTesselator.tessState_.T_DORMANT;a.normal.projectPolygon(this,this.normal_[0],this.normal_[1],this.normal_[2]);a.sweep.computeInterior(this);
if(!this.fatalError){var b=this.mesh;this.boundaryOnly_?a.tessmono.setWindingNumber(b,1,!0):a.tessmono.tessellateInterior(b);this.mesh.checkMesh();if(this.beginCallback_||this.endCallback_||this.vertexCallback_||this.edgeFlagCallback_)this.boundaryOnly_?a.render.renderBoundary(this,this.mesh):a.render.renderMesh(this,this.mesh,!!this.edgeFlagCallback_);if(this.meshCallback_){a.tessmono.discardExterior(this.mesh);this.meshCallback_(this.mesh);this.polygonData_=this.mesh=null;return}}a.mesh.deleteMesh(this.mesh);
this.mesh=this.polygonData_=null};a.GluTesselator.prototype.requireState_=function(a){this.state_!==a&&this.gotoState_(a)};a.GluTesselator.prototype.gotoState_=function(b){for(;this.state_!==b;)if(this.state_<b)switch(this.state_){case a.GluTesselator.tessState_.T_DORMANT:this.callErrorCallback(a.errorType.GLU_TESS_MISSING_BEGIN_POLYGON);this.gluTessBeginPolygon(null);break;case a.GluTesselator.tessState_.T_IN_POLYGON:this.callErrorCallback(a.errorType.GLU_TESS_MISSING_BEGIN_CONTOUR),this.gluTessBeginContour()}else switch(this.state_){case a.GluTesselator.tessState_.T_IN_CONTOUR:this.callErrorCallback(a.errorType.GLU_TESS_MISSING_END_CONTOUR);
this.gluTessEndContour();break;case a.GluTesselator.tessState_.T_IN_POLYGON:this.callErrorCallback(a.errorType.GLU_TESS_MISSING_END_POLYGON),this.gluTessEndPolygon()}};a.GluTesselator.prototype.addVertex_=function(b,c){var e=this.lastEdge_;null===e?(e=a.mesh.makeEdge(this.mesh),a.mesh.meshSplice(e,e.sym)):(a.mesh.splitEdge(e),e=e.lNext);e.org.data=c;e.org.coords[0]=b[0];e.org.coords[1]=b[1];e.org.coords[2]=b[2];e.winding=1;e.sym.winding=-1;this.lastEdge_=e};a.GluTesselator.prototype.callBeginCallback=
function(a){this.beginCallback_&&this.beginCallback_(a,this.polygonData_)};a.GluTesselator.prototype.callVertexCallback=function(a){this.vertexCallback_&&this.vertexCallback_(a,this.polygonData_)};a.GluTesselator.prototype.callEdgeFlagCallback=function(a){this.edgeFlagCallback_&&this.edgeFlagCallback_(a,this.polygonData_)};a.GluTesselator.prototype.callEndCallback=function(){this.endCallback_&&this.endCallback_(this.polygonData_)};a.GluTesselator.prototype.callCombineCallback=function(a,c,e){return this.combineCallback_?
this.combineCallback_(a,c,e,this.polygonData_)||null:null};a.GluTesselator.prototype.callErrorCallback=function(a){this.errorCallback_&&this.errorCallback_(a,this.polygonData_)};a.GluFace=function(a,c){this.next=a||this;this.prev=c||this;this.anEdge=null;this.inside=!1};a.GluHalfEdge=function(a){this.next=a||this;this.activeRegion=this.lFace=this.org=this.lNext=this.oNext=this.sym=null;this.winding=0};a.GluHalfEdge.prototype.rFace=function(){return this.sym.lFace};a.GluHalfEdge.prototype.dst=function(){return this.sym.org};
a.GluHalfEdge.prototype.oPrev=function(){return this.sym.lNext};a.GluHalfEdge.prototype.lPrev=function(){return this.oNext.sym};a.GluHalfEdge.prototype.dPrev=function(){return this.lNext.sym};a.GluHalfEdge.prototype.rPrev=function(){return this.sym.oNext};a.GluHalfEdge.prototype.dNext=function(){return this.rPrev().sym};a.GluHalfEdge.prototype.rNext=function(){return this.oPrev().sym};a.GluMesh=function(){this.vHead=new a.GluVertex;this.fHead=new a.GluFace;this.eHead=new a.GluHalfEdge;this.eHeadSym=
new a.GluHalfEdge;this.eHead.sym=this.eHeadSym;this.eHeadSym.sym=this.eHead};a.GluMesh.prototype.checkMesh=function(){if(a.DEBUG){var b=this.fHead,c=this.vHead,e=this.eHead,d,f;for(d=d=b;(f=d.next)!==b;d=f){a.assert(f.prev===d);d=f.anEdge;do a.assert(d.sym!==d),a.assert(d.sym.sym===d),a.assert(d.lNext.oNext.sym===d),a.assert(d.oNext.sym.lNext===d),a.assert(d.lFace===f),d=d.lNext;while(d!==f.anEdge)}a.assert(f.prev===d&&null===f.anEdge);for(d=d=c;(b=d.next)!==c;d=b){a.assert(b.prev===d);d=b.anEdge;
do a.assert(d.sym!==d),a.assert(d.sym.sym===d),a.assert(d.lNext.oNext.sym===d),a.assert(d.oNext.sym.lNext===d),a.assert(d.org===b),d=d.oNext;while(d!==b.anEdge)}a.assert(b.prev===d&&null===b.anEdge&&null===b.data);for(c=c=e;(d=c.next)!==e;c=d)a.assert(d.sym.next===c.sym),a.assert(d.sym!==d),a.assert(d.sym.sym===d),a.assert(null!==d.org),a.assert(null!==d.dst()),a.assert(d.lNext.oNext.sym===d),a.assert(d.oNext.sym.lNext===d);a.assert(d.sym.next===c.sym&&d.sym===this.eHeadSym&&d.sym.sym===d&&null===
d.org&&null===d.dst()&&null===d.lFace&&null===d.rFace())}};a.GluVertex=function(a,c){this.next=a||this;this.prev=c||this;this.data=this.anEdge=null;this.coords=[0,0,0];this.pqHandle=this.t=this.s=0};a.PriorityQ=function(){this.verts_=[];this.order_=null;this.size_=0;this.initialized_=!1;this.heap_=new a.PriorityQHeap};a.PriorityQ.prototype.deleteQ=function(){this.verts_=this.order_=this.heap_=null};a.PriorityQ.prototype.init=function(){this.order_=[];for(var b=0;b<this.size_;b++)this.order_[b]=b;
b=function(b){return function(c,e){return a.geom.vertLeq(b[c],b[e])?1:-1}}(this.verts_);this.order_.sort(b);this.initialized_=!0;this.heap_.init();if(a.DEBUG)for(var c=0+this.size_-1,b=0;b<c;++b)a.assert(a.geom.vertLeq(this.verts_[this.order_[b+1]],this.verts_[this.order_[b]]))};a.PriorityQ.prototype.insert=function(a){if(this.initialized_)return this.heap_.insert(a);var b=this.size_++;this.verts_[b]=a;return-(b+1)};a.PriorityQ.prototype.extractMin=function(){if(0===this.size_)return this.heap_.extractMin();
var b=this.verts_[this.order_[this.size_-1]];if(!this.heap_.isEmpty()){var c=this.heap_.minimum();if(a.geom.vertLeq(c,b))return this.heap_.extractMin()}do--this.size_;while(0<this.size_&&null===this.verts_[this.order_[this.size_-1]]);return b};a.PriorityQ.prototype.minimum=function(){if(0===this.size_)return this.heap_.minimum();var b=this.verts_[this.order_[this.size_-1]];if(!this.heap_.isEmpty()){var c=this.heap_.minimum();if(a.geom.vertLeq(c,b))return c}return b};a.PriorityQ.prototype.remove=function(b){if(0<=
b)this.heap_.remove(b);else for(b=-(b+1),a.assert(b<this.verts_.length&&null!==this.verts_[b]),this.verts_[b]=null;0<this.size_&&null===this.verts_[this.order_[this.size_-1]];)--this.size_};a.PriorityQHeap=function(){this.heap_=a.PriorityQHeap.reallocNumeric_([0],a.PriorityQHeap.INIT_SIZE_+1);this.verts_=[null,null];this.handles_=[0,0];this.size_=0;this.max_=a.PriorityQHeap.INIT_SIZE_;this.freeList_=0;this.initialized_=!1;this.heap_[1]=1};a.PriorityQHeap.INIT_SIZE_=32;a.PriorityQHeap.reallocNumeric_=
function(a,c){for(var b=Array(c),d=0;d<a.length;d++)b[d]=a[d];for(;d<c;d++)b[d]=0;return b};a.PriorityQHeap.prototype.init=function(){for(var a=this.size_;1<=a;--a)this.floatDown_(a);this.initialized_=!0};a.PriorityQHeap.prototype.insert=function(b){var c=++this.size_;2*c>this.max_&&(this.max_*=2,this.handles_=a.PriorityQHeap.reallocNumeric_(this.handles_,this.max_+1));var e;0===this.freeList_?e=c:(e=this.freeList_,this.freeList_=this.handles_[this.freeList_]);this.verts_[e]=b;this.handles_[e]=c;
this.heap_[c]=e;this.initialized_&&this.floatUp_(c);return e};a.PriorityQHeap.prototype.isEmpty=function(){return 0===this.size_};a.PriorityQHeap.prototype.minimum=function(){return this.verts_[this.heap_[1]]};a.PriorityQHeap.prototype.extractMin=function(){var a=this.heap_,c=this.verts_,e=this.handles_,d=a[1],f=c[d];0<this.size_&&(a[1]=a[this.size_],e[a[1]]=1,c[d]=null,e[d]=this.freeList_,this.freeList_=d,0<--this.size_&&this.floatDown_(1));return f};a.PriorityQHeap.prototype.remove=function(b){var c=
this.heap_,e=this.verts_,d=this.handles_;a.assert(1<=b&&b<=this.max_&&null!==e[b]);var f=d[b];c[f]=c[this.size_];d[c[f]]=f;f<=--this.size_&&(1>=f?this.floatDown_(f):a.geom.vertLeq(e[c[f>>1]],e[c[f]])?this.floatDown_(f):this.floatUp_(f));e[b]=null;d[b]=this.freeList_;this.freeList_=b};a.PriorityQHeap.prototype.floatDown_=function(b){for(var c=this.heap_,e=this.verts_,d=this.handles_,f=c[b];;){var g=b<<1;g<this.size_&&a.geom.vertLeq(e[c[g+1]],e[c[g]])&&(g+=1);a.assert(g<=this.max_);var h=c[g];if(g>
this.size_||a.geom.vertLeq(e[f],e[h])){c[b]=f;d[f]=b;break}c[b]=h;d[h]=b;b=g}};a.PriorityQHeap.prototype.floatUp_=function(b){for(var c=this.heap_,e=this.verts_,d=this.handles_,f=c[b];;){var g=b>>1,h=c[g];if(0===g||a.geom.vertLeq(e[h],e[f])){c[b]=f;d[f]=b;break}c[b]=h;d[h]=b;b=g}};a.ActiveRegion=function(){this.nodeUp=this.eUp=null;this.windingNumber=0;this.fixUpperEdge=this.dirty=this.sentinel=this.inside=!1};a.ActiveRegion.prototype.regionBelow=function(){return this.nodeUp.getPredecessor().getKey()};
a.ActiveRegion.prototype.regionAbove=function(){return this.nodeUp.getSuccessor().getKey()};return a});