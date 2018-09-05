//>>built
define("dojox/editor/plugins/NormalizeStyle","dojo dijit dojox dijit/_editor/_Plugin dijit/_editor/html dojo/_base/connect dojo/_base/declare".split(" "),function(e,v,z,w,x){var n=e.declare("dojox.editor.plugins.NormalizeStyle",w,{mode:"semantic",condenseSpans:!0,setEditor:function(a){this.editor=a;a.customUndo=!0;"semantic"===this.mode?this.editor.contentDomPostFilters.push(e.hitch(this,this._convertToSemantic)):"css"===this.mode&&this.editor.contentDomPostFilters.push(e.hitch(this,this._convertToCss));
e.isIE?(this.editor.contentDomPreFilters.push(e.hitch(this,this._convertToSemantic)),this._browserFilter=this._convertToSemantic):e.isWebKit?(this.editor.contentDomPreFilters.push(e.hitch(this,this._convertToCss)),this._browserFilter=this._convertToCss):(this.editor.contentDomPreFilters.push(e.hitch(this,this._convertToSemantic)),this._browserFilter=this._convertToSemantic);this.editor._inserthtmlImpl&&(this.editor._oldInsertHtmlImpl=this.editor._inserthtmlImpl);this.editor._inserthtmlImpl=e.hitch(this,
this._inserthtmlImpl)},_convertToSemantic:function(a){if(a){var g=this.editor.document,p=this,k=function(b){if(1==b.nodeType){if("dijitEditorBody"!==b.id){var d=b.style,a=b.tagName?b.tagName.toLowerCase():"",f;if(d&&"table"!=a&&"ul"!=a&&"ol"!=a){var h=d.fontWeight?d.fontWeight.toLowerCase():"",y=d.fontStyle?d.fontStyle.toLowerCase():"",r=d.textDecoration?d.textDecoration.toLowerCase():"",c=d.fontSize?d.fontSize.toLowerCase():"",q=d.backgroundColor?d.backgroundColor.toLowerCase():"",d=d.color?d.color.toLowerCase():
"",m=function(b,c){if(b){for(;c.firstChild;)b.appendChild(c.firstChild);"span"!=a||c.style.cssText?c.appendChild(b):(e.place(b,c,"before"),c.parentNode.removeChild(c),c=b)}return c};switch(h){case "bold":case "bolder":case "700":case "800":case "900":f=g.createElement("b"),b.style.fontWeight=""}b=m(f,b);f=null;"italic"==y&&(f=g.createElement("i"),b.style.fontStyle="");b=m(f,b);f=null;if(r){var t=r.split(" "),u=0;e.forEach(t,function(c){switch(c){case "underline":f=g.createElement("u");break;case "line-through":f=
g.createElement("strike")}u++;u==t.length&&(b.style.textDecoration="");b=m(f,b);f=null})}c&&(0<c.indexOf("pt")?(c=c.substring(0,c.indexOf("pt")),c=parseInt(c),5>c?c="xx-small":10>c?c="x-small":15>c?c="small":20>c?c="medium":25>c?c="large":30>c?c="x-large":30<c&&(c="xx-large")):0<c.indexOf("px")&&(c=c.substring(0,c.indexOf("px")),c=parseInt(c),5>c?c="xx-small":10>c?c="x-small":15>c?c="small":20>c?c="medium":25>c?c="large":30>c?c="x-large":30<c&&(c="xx-large")),(h={"xx-small":1,"x-small":2,small:3,
medium:4,large:5,"x-large":6,"xx-large":7,"-webkit-xxx-large":7}[c])||(h=3),f=g.createElement("font"),f.setAttribute("size",h),b.style.fontSize="");b=m(f,b);f=null;q&&"font"!==a&&p._isInline(a)&&(q=(new e.Color(q)).toHex(),f=g.createElement("font"),f.style.backgroundColor=q,b.style.backgroundColor="");d&&"font"!==a&&(d=(new e.Color(d)).toHex(),f=g.createElement("font"),f.setAttribute("color",d),b.style.color="");b=m(f,b);f=null}}if(b.childNodes){var n=[];e.forEach(b.childNodes,function(b){n.push(b)});
e.forEach(n,k)}}return b};return this._normalizeTags(k(a))}return a},_normalizeTags:function(a){var g=this.editor.document;e.query("em,s,strong",a).forEach(function(a){var k;switch(a.tagName?a.tagName.toLowerCase():""){case "s":k="strike";break;case "em":k="i";break;case "strong":k="b"}if(k){var b=g.createElement(k);for(e.place("\x3c"+k+"\x3e",a,"before");a.firstChild;)b.appendChild(a.firstChild);a.parentNode.removeChild(a)}});return a},_convertToCss:function(a){if(a){var g=this.editor.document,p=
function(a){if(1==a.nodeType){if("dijitEditorBody"!==a.id){var b=a.tagName?a.tagName.toLowerCase():"";if(b){var d;switch(b){case "b":case "strong":d=g.createElement("span");d.style.fontWeight="bold";break;case "i":case "em":d=g.createElement("span");d.style.fontStyle="italic";break;case "u":d=g.createElement("span");d.style.textDecoration="underline";break;case "strike":case "s":d=g.createElement("span");d.style.textDecoration="line-through";break;case "font":b={},e.attr(a,"color")&&(b.color=e.attr(a,
"color")),e.attr(a,"face")&&(b.fontFace=e.attr(a,"face")),a.style&&a.style.backgroundColor&&(b.backgroundColor=a.style.backgroundColor),a.style&&a.style.color&&(b.color=a.style.color),d={1:"xx-small",2:"x-small",3:"small",4:"medium",5:"large",6:"x-large",7:"xx-large"},e.attr(a,"size")&&(b.fontSize=d[e.attr(a,"size")]),d=g.createElement("span"),e.style(d,b)}if(d){for(;a.firstChild;)d.appendChild(a.firstChild);e.place(d,a,"before");a.parentNode.removeChild(a);a=d}}}if(a.childNodes){var k=[];e.forEach(a.childNodes,
function(a){k.push(a)});e.forEach(k,p)}}return a};a=p(a);this.condenseSpans&&this._condenseSpans(a)}return a},_condenseSpans:function(a){var g=function(a){var k=function(a){var b;a&&(b={},a=a.toLowerCase().split(";"),e.forEach(a,function(a){if(a){var c=a.split(":");a=c[0]?e.trim(c[0]):"";c=c[1]?e.trim(c[1]):"";if(a&&c){var d,f="";for(d=0;d<a.length;d++){var g=a.charAt(d);"-"==g?(d++,g=a.charAt(d),f+=g.toUpperCase()):f+=g}b[f]=c}}}));return b};if(a&&1==a.nodeType&&"span"===(a.tagName?a.tagName.toLowerCase():
"")&&a.childNodes&&1===a.childNodes.length)for(var b=a.firstChild;b&&1==b.nodeType&&b.tagName&&"span"==b.tagName.toLowerCase();)if(e.attr(b,"class")||e.attr(b,"id")||!b.style)b=b.nextSibling;else{var d=k(a.style.cssText),l=k(b.style.cssText);if(d&&l){var f={},h;for(h in d)if(d[h]&&l[h]&&d[h]!=l[h]){d[h]!=l[h]?"textDecoration"==h?(f[h]=d[h]+" "+l[h],delete l[h]):f=null:f=null;break}else f[h]=d[h],delete l[h];if(f){for(h in l)f[h]=l[h];for(e.style(a,f);b.firstChild;)a.appendChild(b.firstChild);d=b.nextSibling;
b.parentNode.removeChild(b);b=d}else b=b.nextSibling}else b=b.nextSibling}a.childNodes&&a.childNodes.length&&e.forEach(a.childNodes,g)};g(a)},_isInline:function(a){switch(a){case "a":case "b":case "strong":case "s":case "strike":case "i":case "u":case "em":case "sup":case "sub":case "span":case "font":case "big":case "cite":case "q":case "img":case "small":return!0;default:return!1}},_inserthtmlImpl:function(a){if(a){var e=this.editor.document.createElement("div");e.innerHTML=a;e=this._browserFilter(e);
a=x.getChildrenHtml(e);e.innerHTML="";return this.editor._oldInsertHtmlImpl?this.editor._oldInsertHtmlImpl(a):this.editor.execCommand("inserthtml",a)}return!1}});e.subscribe(v._scopeName+".Editor.getPlugin",null,function(a){a.plugin||"normalizestyle"!==a.args.name.toLowerCase()||(a.plugin=new n({mode:"mode"in a.args?a.args.mode:"semantic",condenseSpans:"condenseSpans"in a.args?a.args.condenseSpans:!0}))});return n});