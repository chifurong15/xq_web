//>>built
define("dijit/layout/TabContainer",["dojo/_base/lang","dojo/_base/declare","./_TabContainerBase","./TabController","./ScrollingTabController"],function(c,a,b,d,e){return a("dijit.layout.TabContainer",b,{useMenu:!0,useSlider:!0,controllerWidget:"",_makeController:function(a){var b=this.baseClass+"-tabs"+(this.doLayout?"":" dijitTabNoLayout");return new ("string"==typeof this.controllerWidget?c.getObject(this.controllerWidget):this.controllerWidget)({id:this.id+"_tablist",ownerDocument:this.ownerDocument,
dir:this.dir,lang:this.lang,textDir:this.textDir,tabPosition:this.tabPosition,doLayout:this.doLayout,containerId:this.id,"class":b,nested:this.nested,useMenu:this.useMenu,useSlider:this.useSlider,tabStripClass:this.tabStrip?this.baseClass+(this.tabStrip?"":"No")+"Strip":null},a)},postMixInProperties:function(){this.inherited(arguments);this.controllerWidget||(this.controllerWidget="top"!=this.tabPosition&&"bottom"!=this.tabPosition||this.nested?d:e)}})});