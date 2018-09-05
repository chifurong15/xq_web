//>>built
define("dojox/data/AtomReadStore",["dojo","dojox","dojo/data/util/filter","dojo/data/util/simpleFetch","dojo/date/stamp"],function(f,l){f.experimental("dojox.data.AtomReadStore");var k=f.declare("dojox.data.AtomReadStore",null,{constructor:function(a){a&&(this.url=a.url,this.rewriteUrl=a.rewriteUrl,this.label=a.label||this.label,this.sendQuery=a.sendQuery||a.sendquery||this.sendQuery,this.unescapeHTML=a.unescapeHTML,"urlPreventCache"in a&&(this.urlPreventCache=a.urlPreventCache?!0:!1));if(!this.url)throw Error("AtomReadStore: a URL must be specified when creating the data store");
},url:"",label:"title",sendQuery:!1,unescapeHTML:!1,urlPreventCache:!1,getValue:function(a,c,d){this._assertIsItem(a);this._assertIsAttribute(c);this._initItem(a);c=c.toLowerCase();a._attribs[c]||a._parsed||(this._parseItem(a),a._parsed=!0);var b=a._attribs[c];b||"summary"!=c||(b=this.getValue(a,"content").text.replace(/\/(<([^>]+)>)\/g/i,""),b={text:b.substring(0,Math.min(400,b.length)),type:"text"},a._attribs[c]=b);!b||!this.unescapeHTML||"content"!=c&&"summary"!=c&&"subtitle"!=c||a["_"+c+"Escaped"]||
(b.text=this._unescapeHTML(b.text),a["_"+c+"Escaped"]=!0);return b?f.isArray(b)?b[0]:b:d},getValues:function(a,c){this._assertIsItem(a);this._assertIsAttribute(c);this._initItem(a);c=c.toLowerCase();a._attribs[c]||this._parseItem(a);var d=a._attribs[c];return d?void 0!==d.length&&"string"!==typeof d?d:[d]:void 0},getAttributes:function(a){this._assertIsItem(a);a._attribs||(this._initItem(a),this._parseItem(a));var c=[],d;for(d in a._attribs)c.push(d);return c},hasAttribute:function(a,c){return void 0!==
this.getValue(a,c)},containsValue:function(a,c,d){a=this.getValues(a,c);for(c=0;c<a.length;c++)if("string"===typeof d){if(a[c].toString&&a[c].toString()===d)return!0}else if(a[c]===d)return!0;return!1},isItem:function(a){return a&&a.element&&a.store&&a.store===this?!0:!1},isItemLoaded:function(a){return this.isItem(a)},loadItem:function(a){},getFeatures:function(){return{"dojo.data.api.Read":!0}},getLabel:function(a){if(""!==this.label&&this.isItem(a)){if((a=this.getValue(a,this.label))&&a.text)return a.text;
if(a)return a.toString()}},getLabelAttributes:function(a){return""!==this.label?[this.label]:null},getFeedValue:function(a,c){var d=this.getFeedValues(a,c);return f.isArray(d)?d[0]:d},getFeedValues:function(a,c){if(!this.doc)return c;this._feedMetaData||(this._feedMetaData={element:this.doc.getElementsByTagName("feed")[0],store:this,_attribs:{}},this._parseItem(this._feedMetaData));return this._feedMetaData._attribs[a]||c},_initItem:function(a){a._attribs||(a._attribs={})},_fetchItems:function(a,
c,d){var b=this._getFetchUrl(a);if(b){var g=this.sendQuery?null:a,e=this,h=function(b){e.doc=b;b=e._getItems(b,g);var d=a.query;d&&(d.id?b=f.filter(b,function(a){return e.getValue(a,"id")==d.id}):d.category&&(b=f.filter(b,function(a){return(a=e.getValues(a,"category"))?f.some(a,"return item.term\x3d\x3d'"+d.category+"'"):!1})));b&&0<b.length?c(b,a):c([],a)};this.doc?h(this.doc):(b=f.xhrGet({url:b,handleAs:"xml",preventCache:this.urlPreventCache}),b.addCallback(h),b.addErrback(function(b){d(b,a)}))}else d(Error("No URL specified."))},
_getFetchUrl:function(a){if(!this.sendQuery)return this.url;var c=a.query;if(!c)return this.url;if(f.isString(c))return this.url+c;a="";for(var d in c){var b=c[d];b&&(a&&(a+="\x26"),a+=d+"\x3d"+b)}if(!a)return this.url;d=this.url;d=0>d.indexOf("?")?d+"?":d+"\x26";return d+a},_getItems:function(a,c){if(this._items)return this._items;var d=[],b=[];if(1>a.childNodes.length)return this._items=d,console.log("dojox.data.AtomReadStore: Received an invalid Atom document. Check the content type header"),d;
b=f.filter(a.childNodes,"return item.tagName \x26\x26 item.tagName.toLowerCase() \x3d\x3d 'feed'");if(!b||1!=b.length)return console.log("dojox.data.AtomReadStore: Received an invalid Atom document, number of feed tags \x3d "+(b?b.length:0)),d;b=f.filter(b[0].childNodes,"return item.tagName \x26\x26 item.tagName.toLowerCase() \x3d\x3d 'entry'");if(c.onBegin)c.onBegin(b.length,this.sendQuery?c:{});for(var g=0;g<b.length;g++){var e=b[g];1==e.nodeType&&d.push(this._getItem(e))}return this._items=d},
close:function(a){},_getItem:function(a){return{element:a,store:this}},_parseItem:function(a){function c(a){var b=a.textContent||a.innerHTML||a.innerXML;if(!b&&a.childNodes[0]){var c=a.childNodes[0];!c||3!=c.nodeType&&4!=c.nodeType||(b=a.childNodes[0].nodeValue)}return b}function d(a){return{text:c(a),type:a.getAttribute("type")}}var b=a._attribs;f.forEach(a.element.childNodes,function(a){var e=a.tagName?a.tagName.toLowerCase():"";switch(e){case "title":b[e]={text:c(a),type:a.getAttribute("type")};
break;case "subtitle":case "summary":case "content":b[e]=d(a);break;case "author":var h,g;f.forEach(a.childNodes,function(a){if(a.tagName)switch(a.tagName.toLowerCase()){case "name":h=a;break;case "uri":g=a}});a={};h&&1==h.length&&(a.name=c(h[0]));g&&1==g.length&&(a.uri=c(g[0]));b[e]=a;break;case "id":b[e]=c(a);break;case "updated":b[e]=f.date.stamp.fromISOString(c(a));break;case "published":b[e]=f.date.stamp.fromISOString(c(a));break;case "category":b[e]||(b[e]=[]);b[e].push({scheme:a.getAttribute("scheme"),
term:a.getAttribute("term")});break;case "link":b[e]||(b[e]=[]),a={rel:a.getAttribute("rel"),href:a.getAttribute("href"),type:a.getAttribute("type")},b[e].push(a),"alternate"==a.rel&&(b.alternate=a)}})},_unescapeHTML:function(a){return a=a.replace(/&#8217;/m,"'").replace(/&#8243;/m,'"').replace(/&#60;/m,"\x3e").replace(/&#62;/m,"\x3c").replace(/&#38;/m,"\x26")},_assertIsItem:function(a){if(!this.isItem(a))throw Error("dojox.data.AtomReadStore: Invalid item argument.");},_assertIsAttribute:function(a){if("string"!==
typeof a)throw Error("dojox.data.AtomReadStore: Invalid attribute argument.");}});f.extend(k,f.data.util.simpleFetch);return k});