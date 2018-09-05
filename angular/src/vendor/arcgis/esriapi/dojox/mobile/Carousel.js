//>>built
define("dojox/mobile/Carousel","dojo/_base/array dojo/_base/connect dojo/_base/declare dojo/_base/event dojo/_base/lang dojo/sniff dojo/dom-class dojo/dom-construct dojo/dom-style dijit/registry dijit/_Contained dijit/_Container dijit/_WidgetBase ./lazyLoadUtils ./CarouselItem ./PageIndicator ./SwapView require dojo/has!dojo-bidi?dojox/mobile/bidi/Carousel dojo/i18n!dojox/mobile/nls/messages".split(" "),function(k,w,t,x,y,q,r,l,p,u,m,z,A,B,F,C,n,D,E,v){m=t(q("dojo-bidi")?"dojox.mobile.NonBidiCarousel":
"dojox.mobile.Carousel",[A,z,m],{numVisible:2,itemWidth:0,title:"",pageIndicator:!0,navButton:!1,height:"",selectable:!0,baseClass:"mblCarousel",buildRendering:function(){this.containerNode=l.create("div",{className:"mblCarouselPages",id:this.id+"_pages"});this.inherited(arguments);var a,b;if(this.srcNodeRef)for(a=0,b=this.srcNodeRef.childNodes.length;a<b;a++)this.containerNode.appendChild(this.srcNodeRef.firstChild);this.headerNode=l.create("div",{className:"mblCarouselHeaderBar"},this.domNode);
this.navButton&&(this.btnContainerNode=l.create("div",{className:"mblCarouselBtnContainer"},this.headerNode),p.set(this.btnContainerNode,"float","right"),this.prevBtnNode=l.create("button",{className:"mblCarouselBtn",title:v.CarouselPrevious,innerHTML:"\x26lt;","aria-controls":this.containerNode.id},this.btnContainerNode),this.nextBtnNode=l.create("button",{className:"mblCarouselBtn",title:v.CarouselNext,innerHTML:"\x26gt;","aria-controls":this.containerNode.id},this.btnContainerNode),this._prevHandle=
this.connect(this.prevBtnNode,"onclick","onPrevBtnClick"),this._nextHandle=this.connect(this.nextBtnNode,"onclick","onNextBtnClick"));this.pageIndicator&&(this.title||(this.title="\x26nbsp;"),this.piw=new C,this.headerNode.appendChild(this.piw.domNode));this.titleNode=l.create("div",{className:"mblCarouselTitle"},this.headerNode);this.domNode.appendChild(this.containerNode);this.subscribe("/dojox/mobile/viewChanged","handleViewChanged");this.connect(this.domNode,"onclick","_onClick");this.connect(this.domNode,
"onkeydown","_onClick");this._dragstartHandle=this.connect(this.domNode,"ondragstart",x.stop);this.selectedItemIndex=-1;this.items=[]},startup:function(){if(!this._started){var a;"inherit"===this.height?this.domNode.offsetParent&&(a=this.domNode.offsetParent.offsetHeight+"px"):this.height&&(a=this.height);a&&(this.domNode.style.height=a);if(this.store){if(!this.setStore)throw Error("Use StoreCarousel or DataCarousel instead of Carousel.");a=this.store;this.store=null;this.setStore(a,this.query,this.queryOptions)}else this.resizeItems();
this.inherited(arguments);this.currentView=k.filter(this.getChildren(),function(a){return a.isVisible()})[0]}},resizeItems:function(){var a=0,b,c,e=this.domNode.offsetHeight-(this.headerNode?this.headerNode.offsetHeight:0),d=10>q("ie")?5/this.numVisible-1:5/this.numVisible,g,h;k.forEach(this.getChildren(),function(f){if(f instanceof n)for(f.lazy||(f._instantiated=!0),f=f.containerNode.childNodes,b=0,c=f.length;b<c;b++)g=f[b],1===g.nodeType&&(h=this.items[a]||{},p.set(g,{width:h.width||90/this.numVisible+
"%",height:h.height||e+"px",margin:"0 "+(h.margin||d+"%")}),r.add(g,"mblCarouselSlot"),a++)},this);this.piw&&(this.piw.refId=this.containerNode.firstChild,this.piw.reset())},resize:function(){if(this.itemWidth){var a=Math.floor(this.domNode.offsetWidth/this.itemWidth);a!==this.numVisible&&(this.selectedItemIndex=this.getIndexByItemWidget(this.selectedItem),this.numVisible=a,0<this.items.length&&(this.onComplete(this.items),this.select(this.selectedItemIndex)))}},fillPages:function(){k.forEach(this.getChildren(),
function(a,b){var c="",e;for(e=0;e<this.numVisible;e++){var d,g="",h;d=b*this.numVisible+e;var f={};d<this.items.length?(f=this.items[d],(d=this.store.getValue(f,"type"))?(g=this.store.getValue(f,"props"),h=this.store.getValue(f,"mixins")):(d="dojox.mobile.CarouselItem",k.forEach(["alt","src","headerText","footerText"],function(a){var b=this.store.getValue(f,a);void 0!==b&&(g&&(g+=","),g+=a+':"'+b+'"')},this))):(d="dojox.mobile.CarouselItem",g='src:"'+D.toUrl("dojo/resources/blank.gif")+'", className:"mblCarouselItemBlank"');
c+='\x3cdiv data-dojo-type\x3d"'+d+'"';g&&(c+=" data-dojo-props\x3d'"+g+"'");h&&(c+=" data-dojo-mixins\x3d'"+h+"'");c+="\x3e\x3c/div\x3e"}a.containerNode.innerHTML=c},this)},onComplete:function(a){k.forEach(this.getChildren(),function(a){a instanceof n&&a.destroyRecursive()});this.selectedItem=null;this.items=a;var b=Math.ceil(a.length/this.numVisible),c=this.domNode.offsetHeight-this.headerNode.offsetHeight,e=Math.floor((-1===this.selectedItemIndex?0:this.selectedItemIndex)/this.numVisible);for(a=
0;a<b;a++){var d=new n({height:c+"px",lazy:!0});this.addChild(d);a===e?(d.show(),this.currentView=d):d.hide()}this.fillPages();this.resizeItems();c=this.getChildren();b=e+1>b-1?b-1:e+1;for(a=0>e-1?0:e-1;a<=b;a++)this.instantiateView(c[a])},onError:function(){},onUpdate:function(){},onDelete:function(){},onSet:function(a,b,c,e){},onNew:function(a,b){},onStoreClose:function(a){},getParentView:function(a){for(a=u.getEnclosingWidget(a);a;a=a.getParent())if(a.getParent()instanceof n)return a;return null},
getIndexByItemWidget:function(a){if(!a)return-1;var b=a.getParent();return k.indexOf(this.getChildren(),b)*this.numVisible+k.indexOf(b.getChildren(),a)},getItemWidgetByIndex:function(a){return-1===a?null:this.getChildren()[Math.floor(a/this.numVisible)].getChildren()[a%this.numVisible]},onPrevBtnClick:function(){this.currentView&&this.currentView.goTo(-1)},onNextBtnClick:function(){this.currentView&&this.currentView.goTo(1)},_onClick:function(a){if(!1!==this.onClick(a)){if(a&&"keydown"===a.type)if(39===
a.keyCode)this.onNextBtnClick();else if(37===a.keyCode)this.onPrevBtnClick();else if(13!==a.keyCode)return;for(a=u.getEnclosingWidget(a.target);;a=a.getParent()){if(!a)return;if(a.getParent()instanceof n)break}this.select(a);var b=this.getIndexByItemWidget(a);w.publish("/dojox/mobile/carouselSelect",[this,a,this.items[b],b])}},select:function(a){"number"===typeof a&&(a=this.getItemWidgetByIndex(a));this.selectable&&(this.selectedItem&&(this.selectedItem.set("selected",!1),r.remove(this.selectedItem.domNode,
"mblCarouselSlotSelected")),a&&(a.set("selected",!0),r.add(a.domNode,"mblCarouselSlotSelected")),this.selectedItem=a)},onClick:function(){},instantiateView:function(a){if(a&&!a._instantiated){var b="none"===p.get(a.domNode,"display");b&&p.set(a.domNode,{visibility:"hidden",display:""});B.instantiateLazyWidgets(a.containerNode,null,function(c){b&&p.set(a.domNode,{visibility:"visible",display:"none"})});a._instantiated=!0}},handleViewChanged:function(a){a.getParent()===this&&(this.currentView.nextView(this.currentView.domNode)===
a?this.instantiateView(a.nextView(a.domNode)):this.instantiateView(a.previousView(a.domNode)),this.currentView=a)},_setTitleAttr:function(a){this.titleNode.innerHTML=this._cv?this._cv(a):a;this._set("title",a)}});m.ChildSwapViewProperties={lazy:!1};y.extend(n,m.ChildSwapViewProperties);return q("dojo-bidi")?t("dojox.mobile.Carousel",[m,E]):m});