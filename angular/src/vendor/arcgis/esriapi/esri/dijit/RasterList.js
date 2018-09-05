// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://js.arcgis.com/3.24/esri/copyright.txt for details.
//>>built
define("esri/dijit/RasterList","dojo/_base/declare dijit/_WidgetBase dijit/_TemplatedMixin dijit/_WidgetsInTemplateMixin dijit/form/CheckBox dojo/_base/array dgrid/OnDemandList dgrid/extensions/DijitRegistry dgrid/Selection dojo/_base/lang dojo/dom-class dojo/dom-construct ../lang".split(" "),function(e,n,p,q,r,t,u,v,w,x,f,c,y){var z=e([u,v,w],{selectionMode:"single",selection:!0,maxRowsPerPage:2,minRowsPerPage:2,farOffRemoval:500});return e([n,p,q],{templateString:'\x3cdiv class\x3d"esriRasterListDiv"\x3e \x3cdiv data-dojo-attach-point \x3d "listDiv" style\x3d"height: 100%; width: 100%;" class\x3d"obliqueRasterList"\x3e\x3c/div\x3e\x3c/div\x3e',
showThumbnail:!1,setData:function(a){this.rasterList.set("store",a)},clearSelection:function(){this.rasterList.clearSelection()},refresh:function(a){this.rasterList.refresh({keepScrollPosition:a})},startup:function(){this.inherited(arguments);var a=this;this.rasterList=new z({store:this.store,minRowsPerPage:5,maxRowsPerPage:6,bufferRows:3,selectionMode:"single",renderRow:function(b){b=b.attributes||b;var e,g=c.create("div");a.showThumbnail?f.add(g,"esriRasterListThumbnailRow"):f.add(g,"esriRasterListNoThumbnailRow");
var h=c.create("div");f.add(h,"esriRasterListInfoTag");t.forEach(a.fields,function(a){y.isDefined(b[a.name])&&a.display&&(e=b[a.name].toFixed&&0<b[a.name].toString().indexOf(".")?b[a.name].toFixed(2):b[a.name],h.innerHTML+="\x3cstrong\x3e"+a.alias+": \x3c/strong\x3e"+e+"\x3cbr/\x3e")});var m=c.create("table"),k=c.create("tr");f.add(m,"esriRasterListRowTable");if(a.showThumbnail){var d=c.create("img",{className:"esriRasterListThumbnail",src:b.thumbnailUrl}),l=c.create("td");c.place(d,l);c.place(l,
k)}d=c.create("td");c.place(h,d);c.place(d,k);a.showCheckbox&&(d=c.create("td"),f.add(d,"esriRasterListCheckboxCol"),l=new r({checked:b.selected,onChange:x.hitch(a,a._onCheckBoxClick,b)}),c.place(l.domNode,d),c.place(d,k));c.place(k,m);c.place(m,g);b.selected&&a.rasterList.select(a.rasterList.row(b));return g}},this.listDiv);this.rasterList.startup();this.own(this.rasterList.on(".dgrid-row:click",function(b){b.target.type&&"checkbox"===b.target.type||(b=a.rasterList.row(b).data,a.emit("raster-select",
b))}),this.rasterList.on(".dgrid-row:mouseover",function(b){b=a.rasterList.row(b).data;a.emit("raster-mouseover",b)}),this.rasterList.on(".dgrid-row:mouseout",function(b){a.emit("raster-mouseout")}))},_onCheckBoxClick:function(a){a.selected=!a.selected;this.emit("raster-checkbox-select",a)}})});