// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://js.arcgis.com/3.24/esri/copyright.txt for details.
//>>built
define("esri/dijit/geoenrichment/OneVar","../../declare ./BaseWidget ./dom dojo/dom-class dojo/dom-construct dojo/dom-attr dojo/query dojo/string ./lang dojo/i18n!../../nls/jsapi ./utils ./formatVariable".split(" "),function(q,v,r,m,n,h,w,x,u,l,y,p){l=l.geoenrichment.dijit.OneVar;return q("esri.dijit.geoenrichment.OneVar",[v],{baseClass:"Infographics_OneVar",constructor:function(){this._state={sortBy:1,sortDesc:!0}},_calculate:function(){var e=this.getDataFields(),f=this.getFieldByIndex(e[0]);this.primary.innerHTML=
this.formatByIndex(0,e[0])+" ";return{firstCol:f}},updateUIExpanded:function(){this.inherited(arguments);var e=this._calculate().firstCol,f=null,a;if(e){var g=[],d=this.data.features.length;for(a=0;a<d;a++){var c=[];f||(f=c);c.push(this.getFeatureTitle(a));c.push(this.getValueByName(a,e.name));g.push(c)}this.site.innerHTML=l.subtitleSite2;this._sortRows(g);var b=this.getValueByName(0,e.name);if(c=u.isNumber(b)){var k=this.getValueByName(d-1,e.name);a=this.getFeatureTitle(d-1);d=1-k/b;.005>Math.abs(d)&&
(d=0);d=0>d?this._getLessThanPattern():0<d?this._getMoreThanPattern():this._getSamePattern();this.comp.innerHTML=x.substitute(d,{site:a})}else this.comp.innerHTML="";d=this.table;for(k=g.length+1;1<d.rows.length;)d.deleteRow(-1);b=d.rows[0];if(c)for(;4>b.cells.length;)b.insertCell(-1);else for(;2<b.cells.length;)n.destroy(b.cells[b.cells.length-1]);for(a=1;a<k;a++)b=d.insertRow(-1),0===a%2&&0<a&&(b.className="AlternatingRow"),h.set(b.insertCell(-1),"class","OneVarMultiComparison_TextColumn"),h.set(b.insertCell(-1),
"class","OneVarMultiComparison_ValueColumn"),c&&(b=h.set(b.insertCell(-1),"class","OneVarMultiComparison_ChartColumn"),h.set(b,"colspan","2"));k=Number.NEGATIVE_INFINITY;if(c){for(a=0;a<g.length;a++)g[a][1]>k&&(k=g[a][1]);k=y.getCeiling(k);d.rows[0].cells[2].innerHTML=p(e,0);d.rows[0].cells[3].innerHTML=p(e,k)}for(a=0;a<g.length;a++)if(b=d.rows[a+1],b.cells[0].innerHTML=g[a][0],b.cells[1].innerHTML=p(e,g[a][1]),c){var t;g[a]===f?(m.remove(b,"OneVarMultiComparison_Row"),m.add(b,"OneVarMultiComparison_CurrentRow"),
t="OneVarMultiComparison_Expanded_CurrentBar"):(m.remove(b,"OneVarMultiComparison_CurrentRow"),m.add(b,"OneVarMultiComparison_Row"),t="OneVarMultiComparison_Expanded_Bar");var q=r.pct(g[a][1]/k);b.cells[2].innerHTML="\x3cdiv class\x3d'"+t+"' style\x3d'width:"+q+"' /\x3e";h.set(b.cells[0],"style","width:50%");h.set(b.cells[1],"style","width:20%")}else h.set(b.cells[0],"style","width:50%"),h.set(b.cells[1],"style","width:50%")}},_getLessThanPattern:function(){return l.lessThan},_getMoreThanPattern:function(){return l.moreThan},
_getSamePattern:function(){return l.same},updateUICollapsed:function(){this.inherited(arguments);var e=this._calculate().firstCol,f=null,a;if(e){var g=[],d=this.data.features.length;for(a=0;a<d;a++){var c=[];f||(f=c);c.push(this.getFeatureTitle(a));c.push(this.getValueByName(a,e.name));g.push(c)}this._sortRows(g);var c=this.getValueByName(0,e.name),d=this.table,b=g.length+1;for(a=d.rows.length;a<b;a++){var k=d.insertRow(-1);0===a%2&&(k.className="AlternatingRow");h.set(k.insertCell(-1),"class","OneVarMultiComparison_TextColumn");
h.set(k.insertCell(-1),"class","OneVarMultiComparison_ValueColumn")}for(;d.rows.length>b;)d.deleteRow(-1);a=u.isNumber(c);c=w("col",this.table);a?(h.set(c[0],"style","width:70%"),h.set(c[1],"style","width:30%")):(h.set(c[0],"style","width:50%"),h.set(c[1],"style","width:50%"));for(a=0;a<g.length;a++)c=d.rows[a+1],c.cells[0].innerHTML=g[a][0],c.cells[1].innerHTML=p(e,g[a][1]),g[a]===f?(m.remove(c,"OneVarMultiComparison_Row"),m.add(c,"OneVarMultiComparison_CurrentRow")):(m.remove(c,"OneVarMultiComparison_CurrentRow"),
m.add(c,"OneVarMultiComparison_Row"))}},createUIExpanded:function(e){this.inherited(arguments);var f=e.addHeader("div",{"class":"OneVarMultiComparison_Value"}),f=n.create("table",{cellpadding:"0",cellspacing:"0"},f),a=f.insertRow(0),a=a.insertCell(-1);this.site=n.create("span",{"class":"OneVarMultiComparison_Expanded_Value_Site"},a);a=f.insertRow(-1);a=a.insertCell(-1);this.primary=n.create("span",{"class":"OneVarMultiComparison_Expanded_Value_Primary"},a);this.comp=n.create("span",{"class":"OneVarMultiComparison_Comparison"},
a);this.table=e.addContent("table",{"class":"OneVarMultiComparison_Table"});r.createCols(this.table,[.5,.2,.15,.15]);a=this.table.insertRow(-1);this._appendSortHeader(a,l.areaCol,0,{"class":"OneVarMultiComparison_TextColumnHeader"});this._appendSortHeader(a,l.valueCol,1,{"class":"OneVarMultiComparison_ValueColumnHeader"});h.set(a.insertCell(-1),"class","OneVarMultiComparison_ChartColumnHeader_Lower");h.set(a.insertCell(-1),"class","OneVarMultiComparison_ChartColumnHeader_Upper");this.autoHeight&&
e.contentClass.push("OneVarMultiComparison_Expanded_ContentPane");e.addFooter("div")},createUICollapsed:function(e){this.inherited(arguments);var f=e.addHeader("div",{"class":"OneVarMultiComparison_Value"}),f=n.create("table",{cellpadding:"0",cellspacing:"0"},f),a=f.insertRow(0),a=a.insertCell(-1);this.site=n.create("span",{"class":"OneVarMultiComparison_Expanded_Value_Site"},a);a=f.insertRow(-1);a=a.insertCell(-1);this.primary=n.create("span",{"class":"OneVarMultiComparison_Expanded_Value_Primary"},
a);this.table=e.addContent("table",{"class":"OneVarMultiComparison_Table"});r.createCols(this.table,[.7,.3]);a=this.table.insertRow(-1);this._appendSortHeader(a,l.areaCol,0,{"class":"OneVarMultiComparison_TextColumnHeader"});this._appendSortHeader(a,l.valueCol,1,{"class":"OneVarMultiComparison_ValueColumnHeader"});h.set(a.insertCell(-1),"class","OneVarMultiComparison_ChartColumnHeader_Lower");h.set(a.insertCell(-1),"class","OneVarMultiComparison_ChartColumnHeader_Upper");this.autoHeight&&e.contentClass.push("OneVarMultiComparison_Expanded_ContentPane");
e.addFooter("div")}})});