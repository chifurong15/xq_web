//>>built
require({cache:{"url:dojox/atom/widget/templates/FeedViewer.html":'\x3cdiv class\x3d"feedViewerContainer" dojoAttachPoint\x3d"feedViewerContainerNode"\x3e\r\n\t\x3ctable cellspacing\x3d"0" cellpadding\x3d"0" class\x3d"feedViewerTable"\x3e\r\n\t\t\x3ctbody dojoAttachPoint\x3d"feedViewerTableBody" class\x3d"feedViewerTableBody"\x3e\r\n\t\t\x3c/tbody\x3e\r\n\t\x3c/table\x3e\r\n\x3c/div\x3e\r\n',"url:dojox/atom/widget/templates/FeedViewerEntry.html":'\x3ctr class\x3d"feedViewerEntry" dojoAttachPoint\x3d"entryNode" dojoAttachEvent\x3d"onclick:onClick"\x3e\r\n    \x3ctd class\x3d"feedViewerEntryUpdated" dojoAttachPoint\x3d"timeNode"\x3e\r\n    \x3c/td\x3e\r\n    \x3ctd\x3e\r\n        \x3ctable border\x3d"0" width\x3d"100%" dojoAttachPoint\x3d"titleRow"\x3e\r\n            \x3ctr padding\x3d"0" border\x3d"0"\x3e\r\n                \x3ctd class\x3d"feedViewerEntryTitle" dojoAttachPoint\x3d"titleNode"\x3e\r\n                \x3c/td\x3e\r\n                \x3ctd class\x3d"feedViewerEntryDelete" align\x3d"right"\x3e\r\n                    \x3cspan dojoAttachPoint\x3d"deleteButton" dojoAttachEvent\x3d"onclick:deleteEntry" class\x3d"feedViewerDeleteButton" style\x3d"display:none;"\x3e[delete]\x3c/span\x3e\r\n                \x3c/td\x3e\r\n            \x3ctr\x3e\r\n        \x3c/table\x3e\r\n    \x3c/td\x3e\r\n\x3c/tr\x3e',
"url:dojox/atom/widget/templates/FeedViewerGrouping.html":'\x3ctr dojoAttachPoint\x3d"groupingNode" class\x3d"feedViewerGrouping"\x3e\r\n\t\x3ctd colspan\x3d"2" dojoAttachPoint\x3d"titleNode" class\x3d"feedViewerGroupingTitle"\x3e\r\n\t\x3c/td\x3e\r\n\x3c/tr\x3e'}});
define("dojox/atom/widget/FeedViewer","dojo/_base/kernel dojo/_base/lang dojo/_base/array dojo/_base/connect dojo/_base/declare dojo/dom-class dijit/_Widget dijit/_Templated dijit/_Container ../io/Connection dojo/text!./templates/FeedViewer.html dojo/text!./templates/FeedViewerEntry.html dojo/text!./templates/FeedViewerGrouping.html dojo/i18n!./nls/FeedViewerEntry".split(" "),function(e,l,q,A,m,h,n,p,r,t,u,v,w,x){e.experimental("dojox.atom.widget.FeedViewer");var k=m("dojox.atom.widget.FeedViewer",
[n,p,r],{feedViewerTableBody:null,feedViewerTable:null,entrySelectionTopic:"",url:"",xmethod:!1,localSaveOnly:!1,templateString:u,_feed:null,_currentSelection:null,_includeFilters:null,alertsEnabled:!1,postCreate:function(){this._includeFilters=[];""!==this.entrySelectionTopic&&(this._subscriptions=[e.subscribe(this.entrySelectionTopic,this,"_handleEvent")]);this.atomIO=new t;this.childWidgets=[]},startup:function(){this.containerNode=this.feedViewerTableBody;var a=this.getDescendants(),b;for(b in a){var c=
a[b];c&&c.isFilter&&(this._includeFilters.push(new k.CategoryIncludeFilter(c.scheme,c.term,c.label)),c.destroy())}""!==this.url&&this.setFeedFromUrl(this.url)},clear:function(){this.destroyDescendants()},setFeedFromUrl:function(a){if(""!==a){if(this._isRelativeURL(a)){var b="",b="/"!==a.charAt(0)?this._calculateBaseURL(window.location.href,!0):this._calculateBaseURL(window.location.href,!1);this.url=b+a}this.atomIO.getFeed(a,l.hitch(this,this.setFeed))}},setFeed:function(a){this._feed=a;this.clear();
var b=function(a){a=a.split(",");a.pop();return a.join(",")},c=a.entries.sort(l.hitch(this,function(a,b){var c=this._displayDateForEntry(a),d=this._displayDateForEntry(b);return c>d?-1:c<d?1:0}));if(a){a=null;for(var d=0;d<c.length;d++){var f=c[d];if(this._isFilterAccepted(f)){var g=this._displayDateForEntry(f),e="";null!==g&&(e=b(g.toLocaleString()),""===e&&(e=""+(g.getMonth()+1)+"/"+g.getDate()+"/"+g.getFullYear()));if(null===a||a!=e)this.appendGrouping(e),a=e;this.appendEntry(f)}}}},_displayDateForEntry:function(a){return a.updated?
a.updated:a.modified?a.modified:a.issued?a.issued:new Date},appendGrouping:function(a){var b=new y({});b.setText(a);this.addChild(b);this.childWidgets.push(b)},appendEntry:function(a){var b=new z({xmethod:this.xmethod});b.setTitle(a.title.value);b.setTime(this._displayDateForEntry(a).toLocaleTimeString());b.entrySelectionTopic=this.entrySelectionTopic;b.feed=this;this.addChild(b);this.childWidgets.push(b);this.connect(b,"onClick","_rowSelected");a.domNode=b.entryNode;a._entryWidget=b;b.entry=a},deleteEntry:function(a){this.localSaveOnly?
this._removeEntry(a,!0):this.atomIO.deleteEntry(a.entry,l.hitch(this,this._removeEntry,a),null,this.xmethod);e.publish(this.entrySelectionTopic,[{action:"delete",source:this,entry:a.entry}])},_removeEntry:function(a,b){if(b){var c=q.indexOf(this.childWidgets,a),d=this.childWidgets[c-1],c=this.childWidgets[c+1];d.isInstanceOf(widget.FeedViewerGrouping)&&(void 0===c||c.isInstanceOf(widget.FeedViewerGrouping))&&d.destroy();a.destroy()}},_rowSelected:function(a){for(a=a.target;a&&!h.contains(a,"feedViewerEntry");)a=
a.parentNode;for(var b=0;b<this._feed.entries.length;b++){var c=this._feed.entries[b];if(a===c.domNode&&this._currentSelection!==c){h.add(c.domNode,"feedViewerEntrySelected");h.remove(c._entryWidget.timeNode,"feedViewerEntryUpdated");h.add(c._entryWidget.timeNode,"feedViewerEntryUpdatedSelected");this.onEntrySelected(c);""!==this.entrySelectionTopic&&e.publish(this.entrySelectionTopic,[{action:"set",source:this,feed:this._feed,entry:c}]);this._isEditable(c)&&c._entryWidget.enableDelete();this._deselectCurrentSelection();
this._currentSelection=c;break}else if(a===c.domNode&&this._currentSelection===c){e.publish(this.entrySelectionTopic,[{action:"delete",source:this,entry:c}]);this._deselectCurrentSelection();break}}},_deselectCurrentSelection:function(){this._currentSelection&&(h.add(this._currentSelection._entryWidget.timeNode,"feedViewerEntryUpdated"),h.remove(this._currentSelection.domNode,"feedViewerEntrySelected"),h.remove(this._currentSelection._entryWidget.timeNode,"feedViewerEntryUpdatedSelected"),this._currentSelection._entryWidget.disableDelete(),
this._currentSelection=null)},_isEditable:function(a){var b=!1;if(a&&null!==a&&a.links&&null!==a.links)for(var c in a.links)if(a.links[c].rel&&"edit"==a.links[c].rel){b=!0;break}return b},onEntrySelected:function(a){},_isRelativeURL:function(a){var b=function(a){var b=!1;0===a.indexOf("file://")&&(b=!0);return b},c=function(a){var b=!1;0===a.indexOf("http://")&&(b=!0);return b},d=!1;null!==a&&(b(a)||c(a)||(d=!0));return d},_calculateBaseURL:function(a,b){var c=null;if(null!==a){var d=a.indexOf("?");
-1!=d&&(a=a.substring(0,d));if(b)d=a.lastIndexOf("/"),c=0<d&&d<a.length&&d!==a.length-1?a.substring(0,d+1):a;else if(d=a.indexOf("://"),0<d)var d=d+3,c=a.substring(0,d),f=a.substring(d,a.length),d=f.indexOf("/"),c=d<f.length&&0<d?c+f.substring(0,d):c+f}return c},_isFilterAccepted:function(a){var b=!1;if(this._includeFilters&&0<this._includeFilters.length)for(var c=0;c<this._includeFilters.length;c++){if(this._includeFilters[c].match(a)){b=!0;break}}else b=!0;return b},addCategoryIncludeFilter:function(a){if(a){var b=
a.scheme,c=a.term;a=a.label;var d=!0;b||(b=null);c||(b=null);a||(b=null);if(this._includeFilters&&0<this._includeFilters.length)for(var f=0;f<this._includeFilters.length;f++){var e=this._includeFilters[f];if(e.term===c&&e.scheme===b&&e.label===a){d=!1;break}}d&&this._includeFilters.push(widget.FeedViewer.CategoryIncludeFilter(b,c,a))}},removeCategoryIncludeFilter:function(a){if(a){var b=a.scheme,c=a.term;a=a.label;b||(b=null);c||(b=null);a||(b=null);var d=[];if(this._includeFilters&&0<this._includeFilters.length){for(var e=
0;e<this._includeFilters.length;e++){var g=this._includeFilters[e];g.term===c&&g.scheme===b&&g.label===a||d.push(g)}this._includeFilters=d}}},_handleEvent:function(a){a.source!=this&&("update"==a.action&&a.entry?(this.localSaveOnly||this.atomIO.updateEntry(a.entry,l.hitch(a.source,a.callback),null,!0),this._currentSelection._entryWidget.setTime(this._displayDateForEntry(a.entry).toLocaleTimeString()),this._currentSelection._entryWidget.setTitle(a.entry.title.value)):"post"==a.action&&a.entry&&(this.localSaveOnly?
this._addEntry(a.entry):this.atomIO.addEntry(a.entry,this.url,l.hitch(this,this._addEntry))))},_addEntry:function(a){this._feed.addEntry(a);this.setFeed(this._feed);e.publish(this.entrySelectionTopic,[{action:"set",source:this,feed:this._feed,entry:a}])},destroy:function(){this.clear();q.forEach(this._subscriptions,e.unsubscribe)}}),z=k.FeedViewerEntry=m("dojox.atom.widget.FeedViewerEntry",[n,p],{templateString:v,entryNode:null,timeNode:null,deleteButton:null,entry:null,feed:null,postCreate:function(){this.deleteButton.innerHTML=
x.deleteButton},setTitle:function(a){this.titleNode.lastChild&&this.titleNode.removeChild(this.titleNode.lastChild);var b=document.createElement("div");b.innerHTML=a;this.titleNode.appendChild(b)},setTime:function(a){this.timeNode.lastChild&&this.timeNode.removeChild(this.timeNode.lastChild);a=document.createTextNode(a);this.timeNode.appendChild(a)},enableDelete:function(){null!==this.deleteButton&&(this.deleteButton.style.display="inline")},disableDelete:function(){null!==this.deleteButton&&(this.deleteButton.style.display=
"none")},deleteEntry:function(a){a.preventDefault();a.stopPropagation();this.feed.deleteEntry(this)},onClick:function(a){}}),y=k.FeedViewerGrouping=m("dojox.atom.widget.FeedViewerGrouping",[n,p],{templateString:w,groupingNode:null,titleNode:null,setText:function(a){this.titleNode.lastChild&&this.titleNode.removeChild(this.titleNode.lastChild);a=document.createTextNode(a);this.titleNode.appendChild(a)}});k.AtomEntryCategoryFilter=m("dojox.atom.widget.AtomEntryCategoryFilter",null,{scheme:"",term:"",
label:"",isFilter:!0});k.CategoryIncludeFilter=m("dojox.atom.widget.FeedViewer.CategoryIncludeFilter",null,{constructor:function(a,b,c){this.scheme=a;this.term=b;this.label=c},match:function(a){var b=!1;if(null!==a&&(a=a.categories,null!==a))for(var c=0;c<a.length;c++){var d=a[c];if(""!==this.scheme&&this.scheme!==d.scheme)break;if(""!==this.term&&this.term!==d.term)break;if(""!==this.label&&this.label!==d.label)break;b=!0}return b}});return k});