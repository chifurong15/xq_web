// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://js.arcgis.com/3.24/esri/copyright.txt for details.
//>>built
define("esri/layers/vectorTiles/core/workers/utils",["require","exports","dojo/has"],function(h,b,f){function e(a){return a&&"object"===typeof a&&("result"in a||"transferList"in a)}Object.defineProperty(b,"__esModule",{value:!0});(function(a){a[a.HANDSHAKE=0]="HANDSHAKE";a[a.CONFIGURE=1]="CONFIGURE";a[a.CONFIGURED=2]="CONFIGURED";a[a.OPEN=3]="OPEN";a[a.OPENED=4]="OPENED";a[a.RESPONSE=5]="RESPONSE";a[a.INVOKE=6]="INVOKE";a[a.CANCEL=7]="CANCEL";a[a.CLOSE=8]="CLOSE";a[a.OPEN_PORT=9]="OPEN_PORT"})(b.MessageType||
(b.MessageType={}));var g=0;b.newJobId=function(){return g++};b.isTranferableResult=e;b.toInvokeError=function(a){return a?a.toJSON?JSON.stringify(a):JSON.stringify({name:a.name,message:a.message,details:a.details,stack:a.stack}):null};b.postMessage=function(a,b,c,d){2===arguments.length||void 0===c&&void 0===d?a.postMessage(b):(f("esri-workers-supports-transfer-arraybuffer")||(d?(d=d.filter(function(a){return!(a instanceof ArrayBuffer)}),d.length||(d=null)):e(c)&&c.transferList&&(c.transferList=
c.transferList.filter(function(a){return!(a instanceof ArrayBuffer)}),c.transferList.length||(c.transferList=null))),d?(b.data=c,a.postMessage(b,d)):e(c)?(b.data=c.result,c.transferList?a.postMessage(b,c.transferList):a.postMessage(b)):(b.data=c,a.postMessage(b)))};b.receiveMessage=function(a){return a?(a=a.data)?"string"===typeof a?JSON.parse(a):a:null:null}});