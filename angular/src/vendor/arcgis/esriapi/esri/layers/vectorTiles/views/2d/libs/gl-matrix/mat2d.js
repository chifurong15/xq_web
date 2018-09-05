// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://js.arcgis.com/3.24/esri/copyright.txt for details.
//>>built
define("esri/layers/vectorTiles/views/2d/libs/gl-matrix/mat2d",["./common"],function(d){var m=d.GLMAT_ARRAY_TYPE;d={create:function(){var a=new m(6);a[0]=1;a[1]=0;a[2]=0;a[3]=1;a[4]=0;a[5]=0;return a},clone:function(a){var b=new m(6);b[0]=a[0];b[1]=a[1];b[2]=a[2];b[3]=a[3];b[4]=a[4];b[5]=a[5];return b},copy:function(a,b){a[0]=b[0];a[1]=b[1];a[2]=b[2];a[3]=b[3];a[4]=b[4];a[5]=b[5];return a},identity:function(a){a[0]=1;a[1]=0;a[2]=0;a[3]=1;a[4]=0;a[5]=0;return a},invert:function(a,b){var c=b[0],k=b[1],
h=b[2],f=b[3],g=b[4],d=b[5],e=c*f-k*h;if(!e)return null;e=1/e;a[0]=f*e;a[1]=-k*e;a[2]=-h*e;a[3]=c*e;a[4]=(h*d-f*g)*e;a[5]=(k*g-c*d)*e;return a},determinant:function(a){return a[0]*a[3]-a[1]*a[2]},multiply:function(a,b,c){var k=b[0],d=b[1],f=b[2],g=b[3],l=b[4];b=b[5];var e=c[0],m=c[1],n=c[2],p=c[3],q=c[4];c=c[5];a[0]=k*e+f*m;a[1]=d*e+g*m;a[2]=k*n+f*p;a[3]=d*n+g*p;a[4]=k*q+f*c+l;a[5]=d*q+g*c+b;return a}};d.mul=d.multiply;d.rotate=function(a,b,c){var d=b[0],h=b[1],f=b[2],g=b[3],l=b[4];b=b[5];var e=Math.sin(c);
c=Math.cos(c);a[0]=d*c+f*e;a[1]=h*c+g*e;a[2]=d*-e+f*c;a[3]=h*-e+g*c;a[4]=l;a[5]=b;return a};d.scale=function(a,b,c){var d=b[1],h=b[2],f=b[3],g=b[4],l=b[5],e=c[0];c=c[1];a[0]=b[0]*e;a[1]=d*e;a[2]=h*c;a[3]=f*c;a[4]=g;a[5]=l;return a};d.translate=function(a,b,c){var d=b[0],h=b[1],f=b[2],g=b[3],l=b[4];b=b[5];var e=c[0];c=c[1];a[0]=d;a[1]=h;a[2]=f;a[3]=g;a[4]=d*e+f*c+l;a[5]=h*e+g*c+b;return a};d.fromRotation=function(a,b){var c=Math.sin(b),d=Math.cos(b);a[0]=d;a[1]=c;a[2]=-c;a[3]=d;a[4]=0;a[5]=0;return a};
d.fromScaling=function(a,b){a[0]=b[0];a[1]=0;a[2]=0;a[3]=b[1];a[4]=0;a[5]=0;return a};d.fromTranslation=function(a,b){a[0]=1;a[1]=0;a[2]=0;a[3]=1;a[4]=b[0];a[5]=b[1];return a};d.str=function(a){return"mat2d("+a[0]+", "+a[1]+", "+a[2]+", "+a[3]+", "+a[4]+", "+a[5]+")"};d.frob=function(a){return Math.sqrt(Math.pow(a[0],2)+Math.pow(a[1],2)+Math.pow(a[2],2)+Math.pow(a[3],2)+Math.pow(a[4],2)+Math.pow(a[5],2)+1)};return d});